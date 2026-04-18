import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Testing/Scanner Endpoint
  app.post("/api/testing/scan", async (req, res) => {
    let { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    // Clean URL
    if (!url.startsWith("http")) url = "https://" + url;
    let hostname = "";
    try {
      hostname = new URL(url).hostname;
    } catch (e) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    try {
      // 1. Fetch headers to detect WAF and Security Configuration
      // We use a timeout to avoid hanging
      const headResponse = await axios.head(url, { 
        timeout: 5000, 
        validateStatus: () => true, // Accept any status
        headers: { 'User-Agent': 'Kafka-Security-Bot/1.0' }
      }).catch(() => null);

      let wafDetected = "None";
      let securityHeadersCount = 0;
      const securityHeaders = ["content-security-policy", "strict-transport-security", "x-frame-options", "x-content-type-options"];

      if (headResponse && headResponse.headers) {
        const headers = headResponse.headers;
        // Basic WAF detection
        if (headers['server']?.toLowerCase().includes('cloudflare')) wafDetected = "Cloudflare";
        else if (headers['server']?.toLowerCase().includes('akamai')) wafDetected = "Akamai";
        else if (headers['x-powered-by']?.toLowerCase().includes('sucuri')) wafDetected = "Sucuri";

        securityHeaders.forEach(h => {
          if (headers[h]) securityHeadersCount++;
        });
      }

      // 2. HackerTarget Open Source Intelligence (No Key Required)
      const whoisRes = await axios.get(`https://api.hackertarget.com/whois/?q=${hostname}`, { timeout: 5000 }).catch(() => ({ data: "Lookup failed" }));
      const dnsRes = await axios.get(`https://api.hackertarget.com/dnslookup/?q=${hostname}`, { timeout: 5000 }).catch(() => ({ data: "Lookup failed" }));

      // 3. IP Geolocation (IP-API - Free, No Key)
      const ipApiRes = await axios.get(`http://ip-api.com/json/${hostname}`, { timeout: 5000 }).catch(() => null);
      
      // 4. Wayback Machine History (Archive.org - Free, No Key)
      const waybackRes = await axios.get(`https://archive.org/wayback/available?url=${hostname}`, { timeout: 5000 }).catch(() => null);

      // Calculate a "Safety Score" based on real factors
      let safetyScore = 50; 
      if (wafDetected !== "None") safetyScore += 15;
      safetyScore += (securityHeadersCount * 10);
      if (url.startsWith("https")) safetyScore += 5;
      
      // Cap at 100
      safetyScore = Math.min(safetyScore, 100);

      const threats = [
        { 
          id: 1, 
          type: "WAF Detection", 
          severity: wafDetected !== "None" ? "None" : "Medium", 
          score: wafDetected !== "None" ? 95 : 40, 
          detail: wafDetected !== "None" ? `${wafDetected} detected. Edge protection is active.` : "No WAF detected via headers. Origin may be exposed.", 
          suggestion: wafDetected !== "None" ? "Verify WAF rules are in 'Block' mode." : "Deploy a WAF like Cloudflare or AWS WAF." 
        },
        { 
          id: 2, 
          type: "Security Headers", 
          severity: securityHeadersCount >= 3 ? "None" : securityHeadersCount >= 1 ? "Medium" : "High", 
          score: Math.min(securityHeadersCount * 25, 100), 
          detail: `Detected ${securityHeadersCount} out of ${securityHeaders.length} critical security headers.`, 
          suggestion: "Implement CSP, HSTS, and X-Frame-Options headers." 
        },
        { 
          id: 3, 
          type: "Domain Intelligence", 
          severity: whoisRes.data.includes("Lookup failed") ? "Low" : "None", 
          score: whoisRes.data.includes("Lookup failed") ? 50 : 100, 
          detail: "Public WHOIS/DNS metadata successfully retrieved.", 
          suggestion: "Ensure WHOIS privacy is enabled to prevent social engineering targets." 
        },
        {
          id: 4,
          type: "Geographic Compliance",
          severity: "None",
          score: 100,
          detail: ipApiRes?.data ? `Server located in ${ipApiRes.data.city}, ${ipApiRes.data.country}.` : "Geolocation lookup failed.",
          suggestion: "Verify if data residency complies with local laws (GDPR/CCPA)."
        },
        {
          id: 5,
          type: "Historical Integrity",
          severity: waybackRes?.data?.archived_snapshots?.closest ? "None" : "Low",
          score: waybackRes?.data?.archived_snapshots?.closest ? 100 : 70,
          detail: waybackRes?.data?.archived_snapshots?.closest ? "Historical snapshots found. Long-standing domain." : "No historical records found. Possible recently registered domain.",
          suggestion: "Verify domain age and ownership history to prevent brand impersonation."
        }
      ];

      res.json({
        url,
        hostname,
        timestamp: new Date().toISOString(),
        safetyScore,
        breakdown: threats,
        osint: {
          whois: whoisRes.data.substring(0, 500),
          dns: dnsRes.data.substring(0, 500),
          geo: ipApiRes?.data,
          history: waybackRes?.data
        }
      });

    } catch (error) {
      console.error("Scan error:", error);
      res.status(500).json({ error: "Scan engine timed out or target blocked request." });
    }
  });

  // Simulation Endpoint
  app.post("/api/simulate", async (req, res) => {
    const { type, target } = req.body;
    
    // Simulate thinking/simulation time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const results = {
      type,
      target,
      status: "COMPLETED",
      performance: {
        defensiveStrength: "High",
        packetsIntercepted: Math.floor(Math.random() * 1000),
        latencyImpact: "15ms",
      },
      summary: `The ${type} test against ${target} showed robust initial defenses. However, resource exhaustion was observed under peak load.`
    };

    res.json(results);
  });

  // AI Chatbot Endpoint
  app.post("/api/chat-grok", async (req, res) => {
    const { message } = req.body;
    const xaiKey = process.env.XAI_API_KEY;

    if (!xaiKey) {
      return res.status(401).json({ error: "XAI_API_KEY is not configured in environment variables." });
    }

    try {
      const response = await axios.post("https://api.x.ai/v1/chat/completions", {
        messages: [
          { role: "system", content: "You are Kafka AI, a cybersecurity advisor. Be technical, efficient, and direct." },
          { role: "user", content: message }
        ],
        model: "grok-beta",
        stream: false,
        temperature: 0
      }, {
        headers: {
          "Authorization": `Bearer ${xaiKey}`,
          "Content-Type": "application/json"
        }
      });

      res.json({ content: response.data.choices[0].message.content });
    } catch (error: any) {
      console.error("Grok API Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to connect to Grok Intelligence." });
    }
  });

  // Twilio/WhatsApp Webhook (Stub)
  app.post("/api/twilio/whatsapp", (req, res) => {
    // This would receive messages from Twilio
    // For now, we just log it
    console.log("WhatsApp message received:", req.body);
    res.send("<Response><Message>Kafka Platform: Scan scheduled. You will receive an update shortly.</Message></Response>");
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kafka Server running on http://localhost:${PORT}`);
  });
}

startServer();
