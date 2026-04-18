import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, FileText, Download, AlertCircle, ShieldCheck, Globe, Zap } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export function Testing() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const startScan = async () => {
    if (!url) return;
    setScanning(true);
    try {
      const response = await axios.post("/api/testing/scan", { url });
      setResults(response.data);
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setScanning(false);
    }
  };

  const generatePDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    
    // Aesthetic Header
    doc.setFillColor(11, 14, 20); // Dark Background
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(110, 250, 251); // Cyan
    doc.setFontSize(24);
    doc.text("KAFKA SECURITY // VULNERABILITY AUDIT", 15, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`TARGET: ${results.url.toUpperCase()} // SCORE: ${results.safetyScore}`, 15, 35);

    // Threat Breakdown Table
    doc.setTextColor(157, 80, 187); // Purple
    doc.setFontSize(16);
    doc.text("Vulnerability Breakdown", 15, 60);

    const tableData = results.breakdown.map((item: any) => [
      item.type,
      item.severity.toUpperCase(),
      item.detail,
    ]);

    (doc as any).autoTable({
      startY: 70,
      head: [["Type", "Severity", "Detail"]],
      body: tableData,
      headStyles: { fillColor: [157, 80, 187] }, // Purple header
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // OSINT Data
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setTextColor(157, 80, 187);
    doc.setFontSize(16);
    doc.text("OSINT Intelligence", 15, finalY);
    
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.text(`HOSTNAME: ${results.hostname}`, 15, finalY + 10);
    
    if (results.osint && results.osint.geo) {
      doc.text(`LOCATION: ${results.osint.geo.city}, ${results.osint.geo.country}`, 15, finalY + 20);
    }

    doc.save(`KAFKA_AUDIT_${results.hostname}_${Date.now()}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] gap-5 h-full"
    >
      {/* Left Column: Gauge & Input */}
      <div className="glass p-5 flex flex-col items-center text-center">
        <div className="energy-core w-[200px] h-[200px] rounded-full border-[10px] border-accent-purple border-t-accent-cyan flex flex-col items-center justify-center mb-5 shadow-[0_0_30px_rgba(157,80,187,0.2)]">
          <span className="font-display text-[64px] leading-none">{results?.safetyScore || "--"}</span>
          <span className="text-[10px] uppercase tracking-[1px] text-accent-cyan">Safety Score</span>
        </div>
        
        <div className="w-full text-left mt-5">
           <p className="text-[11px] uppercase text-text-dim mb-2">Target URL</p>
           <div className="bg-black p-3 border border-white/10 font-mono text-[12px] truncate mb-5">
             {results?.url || "AWAITING_UPLINK..."}
           </div>
           
           <div className="relative group mb-5">
             <input
               type="text"
               placeholder="ENTER TARGET DOMAIN..."
               className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-3 font-mono text-xs focus:outline-none focus:border-accent-cyan/50 transition-all text-white"
               value={url}
               onChange={(e) => setUrl(e.target.value)}
             />
           </div>

           <button
             onClick={startScan}
             disabled={scanning}
             className="w-full bg-accent-cyan text-background-kafka border-none py-3 font-display uppercase tracking-[1px] text-sm hover:bg-white transition-all disabled:opacity-50"
           >
             {scanning ? "Calibrating..." : "Initiate Pulse"}
           </button>
           
           <button
             onClick={generatePDF}
             className="w-full mt-4 bg-transparent border border-white/10 text-white/40 py-2 font-display uppercase tracking-[1px] text-[10px] hover:text-white transition-all flex items-center justify-center space-x-2"
           >
             <Download className="w-3 h-3" />
             <span>Cosmic Transmission</span>
           </button>
        </div>
      </div>

      {/* Center Column: Results Breakdown */}
      <div className="glass p-5 flex flex-col overflow-hidden">
        <div className="font-display text-[32px] uppercase mb-5 border-l-4 border-accent-cyan pl-4 leading-none">
          Vulnerability_Report
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {results ? results.breakdown.map((item: any) => (
            <div key={item.id} className="grid grid-cols-[1fr_80px] p-4 bg-white/[0.02] border border-white/10">
              <div>
                <div className="font-bold text-accent-cyan text-[14px] uppercase tracking-tight">{item.type}</div>
                <div className="text-[11px] text-text-dim mt-1 leading-tight">{item.detail}</div>
              </div>
              <div className={`text-right font-mono text-[12px] ${item.severity === 'High' ? 'text-red-500' : item.severity === 'Medium' ? 'text-yellow-500' : 'text-accent-cyan'}`}>
                {item.severity.toUpperCase()}
              </div>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
               <ShieldCheck className="w-16 h-16 mb-4" />
               <p className="font-display text-sm tracking-widest">AWAITING_DATA_PULSE</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: AI Assistant & Logs */}
      <div className="glass p-5 flex flex-col overflow-hidden">
        <div className="font-display text-[14px] uppercase text-accent-purple mb-4 flex items-center gap-2">
          <span className="text-xs">●</span> AI SECURITY ASSISTANT
        </div>
        
        <div className="bg-accent-purple/10 p-4 rounded-lg border-l-2 border-accent-purple text-[12px] leading-relaxed mb-4 text-gray-300">
           {results ? (
             "Scan complete. I've identified several vectors including potential " + results.breakdown[0].type + ". I suggest reviewing the remediation steps provided in the report."
           ) : (
             "KAFKA_OS: Neural link stand-by. Initiate pulse to activate tactical advisory."
           )}
        </div>

        <div className="mt-auto bg-black p-3 border border-[#333] font-mono text-[10px] text-[#00FF00] h-[220px] overflow-hidden leading-tight flex flex-col-reverse">
          <p className="animate-pulse">{">> Ready for next command_"}</p>
          <p>[COMP] Audit Engine Finalized.</p>
          <p>[INFO] Gemini AI analyzing logs...</p>
          <p>[DETECT] Firewall Protection: Active</p>
          <p>[INFO] Running Wafw00f...</p>
          <p>[WARN] Restricted endpoint detected.</p>
          {results && <p>[INFO] Target scanned: {results.url}</p>}
          <p>[INFO] Initializing Core Scanner...</p>
          <p>[SYSTEM] Kafka Kernel Online.</p>
        </div>
      </div>
    </motion.div>
  );
}
