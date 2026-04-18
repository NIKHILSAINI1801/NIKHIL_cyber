import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Shield, Code, Database, Search, Lock, Share2, Server, Command, Cpu } from "lucide-react";

const OWASP_TOP_10 = [
  { id: "A01", name: "Broken Access Control", icon: Shield, detail: "Users can act outside of their intended permissions. This typically leads to unauthorized information disclosure, modification, or destruction of all data." },
  { id: "A02", name: "Cryptographic Failures", icon: Lock, detail: "Data in transit and at rest is not properly protected, leading to sensitive data exposure like PII or credentials." },
  { id: "A03", name: "Injection", icon: Code, detail: "Unsanitized input is processed as a commands, such as SQL, NoSQL, or OS command injection." },
  { id: "A04", name: "Insecure Design", icon: Command, detail: "Flaws in the actual high-level design and architectural patterns of the application, rather than just implementation." },
  { id: "A05", name: "Security Misconfiguration", icon: Settings, detail: "Common headers not set, default accounts enabled, or verbose error messages revealing too much info." },
  { id: "A06", name: "Vulnerable Components", icon: Cpu, detail: "Using outdated libraries, frameworks, or software that have known vulnerabilities." },
  { id: "A07", name: "Identification & Auth", icon: UserCheck, detail: "Weak password policies, lack of MFA, or poor session management allowing hijacks." },
  { id: "A08", name: "Software Integrity", icon: Share2, detail: "Failure to verify software updates, CI/CD pipelines, or insecure deserialization of data." },
  { id: "A09", name: "Logging & Monitoring", icon: Database, detail: "Insufficient logging or delayed alerts during an active breach, making recovery difficult." },
  { id: "A10", name: "SSRF", icon: Server, detail: "Server-Side Request Forgery allows an attacker to force a server to make requests to internal or external systems." },
];

import { UserCheck, Settings } from "lucide-react";

export function Learn() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-16">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
          OWASP <span className="text-accent-purple">TOP 10</span>
        </h1>
        <p className="font-mono text-gray-500 max-w-2xl text-xs uppercase tracking-widest leading-relaxed">
          The ultimate defensive blueprint. Understand the most critical web application security risks and learn how to secure the cosmic web.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {OWASP_TOP_10.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <div className="glass p-8 rounded-3xl h-full flex flex-col justify-between hover:bg-white/5 transition-all border border-white/5 hover:border-accent-purple group-hover:-translate-y-2">
              <div>
                <div className="bg-black/50 p-4 rounded-2xl w-fit mb-6 group-hover:bg-accent-purple group-hover:text-black transition-colors">
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="block font-mono text-[10px] text-accent-purple font-bold tracking-[0.3em] mb-2">{item.id}</span>
                <h3 className="font-orbitron font-bold text-lg mb-4 leading-tight">{item.name}</h3>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-mono text-[9px] text-gray-400 leading-relaxed uppercase tracking-tighter">
                  {item.detail}
                </p>
              </div>
            </div>
            
            {/* Background Number Accent */}
            <span className="absolute -bottom-2 -right-2 text-8xl font-black text-white/[0.02] pointer-events-none group-hover:text-accent-purple/5 transition-colors">
              {item.id.replace('A', '')}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 glass p-12 rounded-3xl overflow-hidden relative border-accent-cyan/20 border-2">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-black tracking-tighter mb-6">Master the <span className="text-accent-cyan">Digital Frontier</span></h2>
            <p className="text-gray-400 font-mono text-sm leading-relaxed mb-8">
              Kafka's educational hub provides deep dives into each vulnerability. Start with our interactive sandbox to see these flaws in action safely.
            </p>
            <button className="bg-transparent border border-accent-cyan text-accent-cyan font-orbitron font-bold px-10 py-4 rounded-xl hover:bg-accent-cyan hover:text-black transition-all tracking-widest uppercase text-xs">
              Open Academy Tree
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
             <div className="relative">
                <Search className="w-48 h-48 text-accent-cyan opacity-10 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-accent-cyan shadow-[0_0_50px_#6EFAFB]" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
