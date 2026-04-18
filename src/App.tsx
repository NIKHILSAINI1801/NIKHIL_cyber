/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Testing } from "./views/Testing";
import { Simulation } from "./views/Simulation";
import { Learn } from "./views/Learn";
import { Chat } from "./views/Chat";
import { Shield, Zap, BookOpen, MessageSquare, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { name: "Testing", path: "/" },
    { name: "Simulation", path: "/simulate" },
    { name: "Learn", path: "/learn" },
    { name: "Chatbot", path: "/chat" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-10 border-bottom border-white/10 bg-[#0B0E14CC] backdrop-blur-[10px]">
      <div className="flex items-center space-x-2">
        <span className="font-display text-2xl tracking-[4px] text-accent-cyan uppercase">
          KAFKA // CORE
        </span>
      </div>
      
      <div className="hidden md:flex space-x-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`font-display text-[14px] uppercase tracking-[2px] transition-all duration-300 ${
                isActive ? "text-accent-purple border-b-2 border-accent-purple" : "text-[#8E9299] hover:text-white"
              }`}
            >
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="flex items-center">
        <span className="font-mono text-[12px] text-accent-cyan uppercase">SEC_STATUS: ENCRYPTED</span>
      </div>
    </nav>
  );
}

function StatusBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[30px] bg-accent-purple text-white text-[10px] flex items-center px-5 uppercase tracking-[2px] z-50">
      ACTIVE SESSION: 0x889F12 // NODES: 04 // THREAT LEVEL: ELEVATED // AI_MODEL: GEMINI 1.5 PRO
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-kafka text-white overflow-x-hidden selection:bg-accent-purple selection:text-white">
        <Navbar />
        
        <main className="pt-[60px] pb-[30px] px-5 h-screen flex flex-col">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Testing />} />
              <Route path="/simulate" element={<Simulation />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </AnimatePresence>
        </main>
        
        <StatusBar />
        
        {/* Background Accents */}
        <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-purple/5 blur-[150px] pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-cyan/5 blur-[150px] pointer-events-none" />
      </div>
    </Router>
  );
}
