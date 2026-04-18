import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Zap, Menu, Shield, UserCheck, X, Activity, Download, Globe, Lock, Code, Database, Bug } from "lucide-react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ATTACK_TYPES = [
  { id: "brute", name: "Brute Force Auth", description: "Credential stuffing simulation with dictionary-based vectors.", icon: Zap },
  { id: "ddos", name: "DDoS Stress Test", description: "High-concurrency packet flooding to assess edge resilience.", icon: Activity },
  { id: "dir", name: "Directory Busting", description: "Recursive endpoint discovery for hidden assets.", icon: Menu },
  { id: "sql", name: "SQL Injection", description: "Simulated blind and time-based SQLi probes on endpoint parameters.", icon: Database },
  { id: "xss", name: "XSS Cross-Site", description: "Reflected and stored XSS payload injection verification.", icon: Code },
  { id: "csrf", name: "CSRF Intercept", description: "Verification of cross-site request forgery protection tokens.", icon: Lock },
  { id: "api", name: "API Fuzzing", description: "Automated parameter permutations for REST/GraphQL endpoints.", icon: Bug },
  { id: "osint", name: "OSINT Scraping", description: "Public data aggregation and metadata extraction simulation.", icon: Globe },
];

export function Simulation() {
  const [selectedAttack, setSelectedAttack] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const startSimulation = async () => {
    setSimulating(true);
    setShowAnimation(true);
    
    // Simulate animation duration
    setTimeout(async () => {
      try {
        const response = await axios.post("/api/simulate", { 
          type: selectedAttack, 
          target: "internal-sandbox-vector-01" 
        });
        setResults(response.data);
      } catch (error) {
        console.error("Simulation failed", error);
      } finally {
        setSimulating(false);
        setShowAnimation(false);
      }
    }, 5000);
  };

  const generatePDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    
    // Aesthetic Header
    doc.setFillColor(11, 14, 20); // Dark Background
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(110, 250, 251); // Cyan
    doc.setFontSize(24);
    doc.text("KAFKA SECURITY // SIMULATION REPORT", 15, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`VECTOR: ${selectedAttack?.toUpperCase()} // HASH: 0x8a92f022b`, 15, 35);

    // Performance Metrics
    doc.setTextColor(157, 80, 187); // Purple
    doc.setFontSize(16);
    doc.text("Performance Metrics", 15, 60);
    
    let yPos = 70;
    Object.entries(results.performance).forEach(([key, val]) => {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`${key.toUpperCase()}:`, 20, yPos);
      doc.setFontSize(14);
      doc.text(`${val}`, 70, yPos);
      yPos += 10;
    });

    // Summary
    doc.setTextColor(157, 80, 187);
    doc.setFontSize(16);
    doc.text("Executive Summary", 15, yPos + 10);
    
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(results.summary, 180);
    doc.text(splitText, 15, yPos + 20);

    // Recommendations
    const recoY = yPos + 25 + (splitText.length * 5);
    doc.setTextColor(157, 80, 187);
    doc.setFontSize(16);
    doc.text("Tactical Recommendations", 15, recoY);
    
    const recs = [
      "Implement exponential backoff on all authentication endpoints.",
      "Update CloudFront WAF to include rate-limiting rules.",
      "Disable directory indexing at the web server software layer."
    ];
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    recs.forEach((rec, idx) => {
      doc.text(`- ${rec}`, 20, recoY + 10 + (idx * 8));
    });

    doc.save(`KAFKA_SIM_${selectedAttack}_${Date.now()}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      {/* Simulation Animation Overlay */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-12 overflow-hidden"
          >
            {selectedAttack === 'ddos' && (
              <div className="relative w-full max-w-2xl flex flex-col items-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    boxShadow: ["0 0 20px #6EFAFB", "0 0 60px #6EFAFB", "0 0 20px #6EFAFB"]
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-48 h-48 border-4 border-accent-cyan rounded-full flex items-center justify-center mb-12"
                >
                  <Shield className="w-24 h-24 text-accent-cyan" />
                </motion.div>
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: i % 2 === 0 ? -1000 : 1000, y: Math.random() * 400 - 200, opacity: 0 }}
                    animate={{ x: 0, opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.05 }}
                    className="absolute w-8 h-[2px] bg-accent-purple"
                  />
                ))}
                <h2 className="text-4xl font-orbitron font-black text-white text-center">ABSORBING PULSE VECTORS...</h2>
                <p className="font-mono text-accent-cyan mt-4">TRAFFIC INTENSITY: 4.8 GB/S | STATUS: RESILIENT</p>
              </div>
            )}

            {selectedAttack === 'brute' && (
              <div className="grid grid-cols-10 gap-2 w-full max-w-4xl h-full opacity-40 overflow-hidden font-mono text-[8px] text-accent-purple">
                {Array.from({ length: 500 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: Math.random() * 2 + 1, delay: Math.random() * 2 }}
                  >
                    {Math.random().toString(36).substring(7).toUpperCase()}
                  </motion.div>
                ))}
                <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                   <div className="glass p-12 rounded-3xl border-accent-purple border-2 animate-pulse">
                      <h2 className="text-4xl font-orbitron font-black text-white">DECRYPTING ACCESS...</h2>
                      <p className="font-mono text-accent-purple text-center mt-4">RETRY COUNTER: {Math.floor(Math.random()*10000)}</p>
                   </div>
                </div>
              </div>
            )}

            {selectedAttack === 'dir' && (
              <div className="relative w-full max-w-3xl">
                <div className="glass p-8 rounded-2xl h-[500px] overflow-hidden flex flex-col">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                      className="font-mono text-sm py-1 border-b border-white/5 flex justify-between"
                    >
                      <span>GET /api/v1/internal/{Math.random().toString(36).substring(5)}</span>
                      <span className="text-red-400">404</span>
                    </motion.div>
                  ))}
                  <motion.div
                    animate={{ y: [0, 400, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute top-0 left-0 right-0 h-2 bg-accent-cyan/20 blur shadow-[0_0_20px_#6EFAFB]"
                  />
                </div>
                <h2 className="text-center mt-8 text-2xl font-orbitron font-black">SCANNING DIRECTORY TREE...</h2>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full relative">
        {/* Sidebar Controls with Hamburger toggle */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              className="md:col-span-4 flex flex-col space-y-6 absolute md:relative z-40 h-full w-[320px] md:w-full"
            >
              <div className="glass p-8 rounded-3xl h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black tracking-tighter flex items-center space-x-3">
                    <Zap className="text-accent-purple" />
                    <span>Attack Vectors</span>
                  </h2>
                  <button onClick={() => setIsMenuOpen(false)} className="md:hidden text-gray-500">
                    <X />
                  </button>
                </div>
                
                <div className="space-y-3 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                  {ATTACK_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedAttack(type.id);
                        setResults(null);
                      }}
                      className={`w-full text-left glass p-4 rounded-xl border-2 transition-all ${
                        selectedAttack === type.id 
                        ? "border-accent-cyan bg-accent-cyan/5 scale-[1.02]" 
                        : "border-transparent hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-1">
                        <type.icon className={`w-4 h-4 ${selectedAttack === type.id ? 'text-accent-cyan' : 'text-gray-400'}`} />
                        <span className="font-display uppercase text-[12px] tracking-widest">{type.name}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-mono leading-tight">{type.description}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <button
                    disabled={!selectedAttack || simulating}
                    onClick={() => setShowConsent(true)}
                    className="w-full bg-accent-cyan hover:bg-cyan-400 text-black font-display font-black px-8 py-4 rounded-xl tracking-widest disabled:opacity-30 transition-all uppercase text-sm"
                  >
                    Launch Simulation
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className={`${isMenuOpen ? 'md:col-span-8' : 'md:col-span-12'} transition-all duration-300`}>
          {!isMenuOpen && (
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="fixed left-5 top-[80px] z-50 glass p-3 rounded-full border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          
          {results ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-12 rounded-3xl h-full overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-4xl font-black mb-2 tracking-tighter">Simulation <span className="text-accent-purple">Complete</span></h2>
                  <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">Vector Hash: 0x8a92f022b</p>
                </div>
                <button 
                  onClick={generatePDF}
                  className="glass p-4 rounded-xl hover:bg-white/10 transition-all group"
                >
                  <Download className="w-6 h-6 text-accent-cyan group-hover:scale-110 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-12">
                {Object.entries(results.performance).map(([key, val]: [string, any]) => (
                  <div key={key} className="glass p-6 rounded-2xl">
                    <span className="block text-[8px] font-bold text-accent-cyan uppercase tracking-[0.2em] mb-2">{key}</span>
                    <span className="text-2xl font-orbitron font-bold">{val}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="font-orbitron font-bold text-xs tracking-widest text-gray-400 mb-4 flex items-center space-x-2">
                    <Activity className="w-3 h-3" />
                    <span>Post-Mortem Summary</span>
                  </h4>
                  <p className="font-mono text-sm leading-relaxed text-gray-300 bg-black/40 p-6 rounded-xl border border-white/5">
                    {results.summary}
                  </p>
                </div>

                <div className="bg-accent-purple/10 p-8 rounded-2xl border border-accent-purple/30">
                  <h4 className="font-orbitron font-bold text-sm tracking-widest mb-4">Tactical Recommendations</h4>
                  <ul className="space-y-2 text-xs font-mono text-gray-400 list-disc list-inside">
                    <li>Implement exponential backoff on all authentication endpoints.</li>
                    <li>Update CloudFront WAF to include rate-limiting rules for UDP floods.</li>
                    <li>Disable directory indexing at the web server software layer.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass p-12 rounded-3xl h-full flex flex-col items-center justify-center relative overflow-hidden">
               <ShieldAlert className="w-32 h-32 mb-8 text-white/5" />
               <p className="font-orbitron text-xs tracking-[0.4em] text-gray-600 uppercase">Select Vector To Initiate</p>
               
               <div className="absolute bottom-8 left-8 p-6 glass rounded-2xl border-accent-purple border-l-4">
                  <h4 className="font-orbitron font-bold text-[10px] tracking-widest mb-1">Safety Constraints</h4>
                  <p className="font-mono text-[9px] text-gray-500">REQUEST_LIMIT: 5/SEC | AUTH: ETHICAL_CONSENT_REQUIRED</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Ethics Consent Modal */}
      <AnimatePresence>
        {showConsent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass max-w-lg p-10 rounded-3xl border-accent-cyan"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-orbitron font-black tracking-tighter">ETHICS <span className="text-accent-cyan">CONSENT</span></h3>
                <button onClick={() => setShowConsent(false)}><X /></button>
              </div>
              
              <div className="bg-black/40 p-6 rounded-xl mb-8 font-mono text-[10px] leading-relaxed text-gray-400 max-h-[200px] overflow-y-auto">
                <p className="mb-4">By initiating this simulation, you acknowledge that you are testing systems you own or have explicit authorization to audit.</p>
                <p className="mb-4">1. You will not use Kafka OS for malicious activities or unauthorized intrusions.</p>
                <p className="mb-4">2. The simulations provided are for defensive auditing only.</p>
                <p className="mb-4">3. Kafka OS and its creators are not liable for any misuse or legal consequences arising from tools used on external systems.</p>
                <p>I SWEAR UPON THE OPERATING SYSTEM TO UPHOLD THE WHITE-HAT CODE OF CONDUCT.</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowConsent(false);
                    startSimulation();
                  }}
                  className="flex-1 bg-accent-cyan text-black font-orbitron font-bold py-4 rounded-xl tracking-widest uppercase text-xs"
                >
                  I CONSENT
                </button>
                <button
                  onClick={() => setShowConsent(false)}
                  className="flex-1 glass text-white font-orbitron font-bold py-4 rounded-xl tracking-widest uppercase text-xs hover:bg-white/10"
                >
                  ABORT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
