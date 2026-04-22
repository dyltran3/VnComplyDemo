"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import D3SystemMetrics from "@/components/charts/D3SystemMetrics";
import { Server, Cpu, HardDrive, Network, Book, FileCode2, Terminal, Shield, RefreshCcw } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const [cpuData, setCpuData] = useState<number[]>(Array.from({ length: 40 }, () => 0));
  const [ramData, setRamData] = useState<number[]>(Array.from({ length: 40 }, () => 0));
  const [metrics, setMetrics] = useState<any>(null);
  const [engineStatus, setEngineStatus] = useState<"running" | "idle">("running");
  const [logs, setLogs] = useState<string[]>([
    "[10:41:02] ENGINE_START: VnComply Core Initialized",
    "[10:41:05] RULE_SYNC: Fetched latest Decree 13 signatures",
    "[10:41:09] DB_CONN: TimescaleDB connected successfully."
  ]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await api.getSystemMetrics();
        setMetrics(data);
        setCpuData(prev => [...prev.slice(1), data.cpu]);
        setRamData(prev => [...prev.slice(1), data.ram]);

        // Mock log generation based on metrics
        if (Math.random() > 0.7) {
           setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] HTTP_REQ: Target scan requested for node worker-${Math.floor(Math.random()*3)}`]);
        }
      } catch (err) {
        console.error("Failed to fetch system metrics", err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline font-black text-white mb-2">System Administration</h2>
          <p className="text-slate-400 font-medium">Real-time health of the VnComply architecture and Legal Rulebook configurations.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setEngineStatus(prev => prev === 'running' ? 'idle' : 'running')}
             className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 transition-all border ${
               engineStatus === 'running' ? 'bg-[#003731]/80 text-[#3cddc7] border-[#3cddc7]/30 shadow-[0_0_15px_rgba(60,221,199,0.2)]' 
                                          : 'bg-surface text-slate-400 border-white/10 hover:bg-surface-container'
             }`}
           >
             <div className={`w-2.5 h-2.5 rounded-full ${engineStatus === 'running' ? 'bg-[#3cddc7] animate-pulse shadow-[0_0_8px_rgba(60,221,199,1)]' : 'bg-slate-500'}`}></div>
             ENGINE: {engineStatus.toUpperCase()}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Metrics */}
        <div className="lg:col-span-2 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <motion.div whileHover={{ scale: 1.01 }} className="bg-surface-container/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="flex items-center justify-between mb-6 relative z-10">
                 <h3 className="text-lg font-bold flex items-center gap-3 text-white"><Cpu size={24} className="text-primary"/> CPU Utilization</h3>
                 <span className="text-3xl font-black text-primary">{Math.round(cpuData[cpuData.length - 1])}%</span>
               </div>
               <D3SystemMetrics data={cpuData} color="#adc6ff" />
             </motion.div>

             <motion.div whileHover={{ scale: 1.01 }} className="bg-surface-container/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="flex items-center justify-between mb-6 relative z-10">
                 <h3 className="text-lg font-bold flex items-center gap-3 text-white"><HardDrive size={24} className="text-tertiary"/> RAM Usage</h3>
                 <span className="text-3xl font-black text-tertiary">{Math.round(ramData[ramData.length - 1])}%</span>
               </div>
               <D3SystemMetrics data={ramData} color="#3cddc7" />
             </motion.div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { icon: Server, label: "Active Scans", val: metrics?.active_jobs || "0", color: "text-tertiary", bg: "bg-tertiary/10 border-tertiary/20" },
               { icon: Network, label: "Network I/O", val: "1.2 GB/s", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
               { icon: Server, label: "Worker Nodes", val: "3 / 3", color: "text-[#a388ee]", bg: "bg-[#a388ee]/10 border-[#a388ee]/20" },
               { icon: HardDrive, label: "DB Latency", val: "12ms", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" }
             ].map((s, idx) => (
                <div key={idx} className={`border rounded-[1.5rem] p-6 flex flex-col justify-between relative overflow-hidden group shadow-lg transition-colors ${s.bg}`}>
                   <s.icon size={28} className={s.color} />
                   <div className="mt-6">
                     <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
                     <p className="text-xs text-white/70 font-bold uppercase tracking-wider mt-1">{s.label}</p>
                   </div>
                </div>
             ))}
           </div>
        </div>

        {/* Legal Rulebooks & Configuration */}
        <div className="bg-surface-container/50 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-full">
           <div className="p-8 border-b border-white/5 bg-white/[0.02]">
              <h3 className="font-headline font-black text-xl text-white flex items-center gap-3">
                <Book className="text-[#a388ee]"/> Legal Rulebooks
              </h3>
              <p className="text-sm text-slate-400 mt-2">Active compliance heuristics engines loaded.</p>
           </div>
           <div className="p-6 space-y-4 flex-1">
              <div className="bg-surface p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Shield className="text-[#a388ee]" size={28}/>
                    <div>
                       <h4 className="font-bold text-white">Decree 13 (VN)</h4>
                       <p className="text-xs text-slate-400 mt-1 font-mono">v1.2.4-stable</p>
                    </div>
                 </div>
                 <div className="bg-[#a388ee]/20 text-[#a388ee] px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border border-[#a388ee]/30">Active</div>
              </div>
              <div className="bg-surface p-5 rounded-2xl border border-white/5 flex items-center justify-between opacity-60">
                 <div className="flex items-center gap-4">
                    <Shield className="text-slate-500" size={28}/>
                    <div>
                       <h4 className="font-bold text-slate-300">Law on Cyberinfo 86</h4>
                       <p className="text-xs text-slate-500 mt-1 font-mono">v1.0.0-legacy</p>
                    </div>
                 </div>
                 <div className="bg-surface-container text-slate-500 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border border-white/5">Disabled</div>
              </div>
              <div className="bg-surface p-5 rounded-2xl border border-white/5 flex items-center justify-between opacity-60">
                 <div className="flex items-center gap-4">
                    <Shield className="text-slate-500" size={28}/>
                    <div>
                       <h4 className="font-bold text-slate-300">GDPR (EU) Module</h4>
                       <p className="text-xs text-slate-500 mt-1 font-mono">Pending Installation</p>
                    </div>
                 </div>
                 <button className="text-primary text-xs font-bold hover:underline">Install</button>
              </div>
           </div>
           <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors border border-white/10">
                 <RefreshCcw size={16} /> Sync Latest Definitions
              </button>
           </div>
        </div>
      </div>

      {/* System Audit Logs Terminal View */}
      <div className="bg-[#0b1326] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden mt-8">
         <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3 bg-[#171f33]">
            <Terminal className="text-slate-400" size={20} />
            <h3 className="font-bold text-white tracking-wide">System Audit Logs <span className="text-slate-500 font-normal">/var/log/vncomply-engine.log</span></h3>
         </div>
         <div className="p-6 h-64 overflow-y-auto font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {logs.map((log, i) => (
               <div key={i} className={`mb-1 ${log.includes('ENGINE_START') ? 'text-[#3cddc7]' : log.includes('ERR') ? 'text-error' : 'text-slate-300'}`}>
                 <span className="text-slate-500 select-none mr-4">{(i+1).toString().padStart(4, '0')}</span>
                 {log}
               </div>
            ))}
            <div ref={logEndRef} />
         </div>
      </div>

    </div>
  );
}
