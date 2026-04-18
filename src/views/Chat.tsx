import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Sparkles, Terminal, Trash2 } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";

// Initialize Gemini API
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "SYSTEM ONLINE. I am Kafka AI, your tactical security advisor. How can I assist with your defense vectors today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelType, setModelType] = useState<"gemini" | "grok">("gemini");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      let botContent = "";
      if (modelType === "gemini") {
        const model = "gemini-3-flash-preview"; 
        const chat = genAI.chats.create({
          model,
          config: {
            systemInstruction: "You are Kafka AI, a specialized cybersecurity advisor. Your tone is technical, efficient, yet accessible. You help developers and non-technical staff understand security risks. Use terms from OWASP Top 10 and provide remediation steps in plain language. If asked about hacking a specific site, refuse and state you only assist in ethical audits.",
          }
        });

        const response = await chat.sendMessage({ message: input });
        botContent = response.text;
      } else {
        const response = await axios.post("/api/chat-grok", { message: input });
        botContent = response.data.content;
      }

      const botResponse: Message = {
        role: "bot",
        content: botContent,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error: any) {
      console.error("AI Error:", error);
      const errorMessage: Message = {
        role: "bot",
        content: error.response?.status === 401 
          ? "ERROR: GROK_KEY_MISSING. Please configure XAI_API_KEY in environment variables."
          : "TRANSMISSION INTERRUPTED. Error connecting to the core intelligence unit. Please verify uplink.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto h-full flex flex-col"
    >
      {/* Chat Header */}
      <div className="glass p-6 rounded-t-3xl border-b-2 border-accent-purple/20 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-accent-purple/20 p-3 rounded-full">
            <Bot className="w-6 h-6 text-accent-purple" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold tracking-widest text-lg">KAFKA <span className="text-accent-purple">INTELLIGENCE</span></h2>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest">Neural Link: ACTIVE</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex bg-black/40 rounded-lg p-1 border border-white/5 mr-4">
            <button 
              onClick={() => setModelType("gemini")}
              className={`px-3 py-1 text-[10px] font-orbitron rounded transition-all ${modelType === 'gemini' ? 'bg-accent-purple text-white' : 'text-gray-500 hover:text-white'}`}
            >
              GEMINI
            </button>
            <button 
              onClick={() => setModelType("grok")}
              className={`px-3 py-1 text-[10px] font-orbitron rounded transition-all ${modelType === 'grok' ? 'bg-accent-purple text-white' : 'text-gray-500 hover:text-white'}`}
            >
              GROK
            </button>
          </div>
          <button onClick={clearChat} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      <div 
        ref={scrollRef}
        className="flex-1 glass overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-accent-purple"
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] space-x-4 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'bot' ? 'bg-accent-purple/20' : 'bg-accent-cyan/20'}`}>
                  {msg.role === 'bot' ? <Bot className="w-5 h-5 text-accent-purple" /> : <User className="w-5 h-5 text-accent-cyan" />}
                </div>
                <div>
                   <div className={`p-6 rounded-2xl border ${msg.role === 'bot' ? 'bg-white/5 border-white/5 rounded-tl-none' : 'bg-accent-cyan/10 border-accent-cyan/20 rounded-tr-none'}`}>
                      <p className="font-mono text-xs leading-relaxed text-gray-200">
                        {msg.content}
                      </p>
                   </div>
                   <span className="block mt-2 font-mono text-[8px] text-gray-600 uppercase tracking-tighter text-right">{msg.timestamp}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
             <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-accent-purple animate-pulse" />
                </div>
                <div className="p-6 glass rounded-2xl flex space-x-2">
                   <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="h-2 w-2 rounded-full bg-accent-purple" />
                   <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-2 w-2 rounded-full bg-accent-purple" />
                   <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-2 w-2 rounded-full bg-accent-purple" />
                </div>
             </div>
          </motion.div>
        )}
      </div>

      {/* Chat Input */}
      <div className="glass p-6 rounded-b-3xl border-t-2 border-accent-purple/20">
        <div className="relative group">
          <input
            type="text"
            placeholder="INQUIRE ABOUT SECURITY VECTOR OR SCAN LOG..."
            className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 pr-16 font-mono text-sm focus:outline-none focus:border-accent-purple/50 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="absolute right-2 top-2 bottom-2 bg-accent-purple hover:bg-purple-600 text-white px-4 rounded-lg flex items-center transition-all group-hover:shadow-[0_0_15px_#9D50BB44]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-4 flex items-center space-x-2 opacity-30">
           <Terminal className="w-3 h-3 text-accent-purple" />
           <span className="text-[8px] font-mono uppercase tracking-[0.2em]">Context: OWASP_V2024.1 | Encryption: AES-256</span>
        </div>
      </div>
    </motion.div>
  );
}
