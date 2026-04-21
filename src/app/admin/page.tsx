"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import D3SystemMetrics from "@/components/charts/D3SystemMetrics";
import { Server, Cpu, HardDrive, Network } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const [cpuData, setCpuData] = useState<number[]>(Array.from({ length: 40 }, () => 0));
  const [ramData, setRamData] = useState<number[]>(Array.from({ length: 40 }, () => 0));
  const [metrics, setMetrics] = useState<any>(null);
  const [engineStatus, setEngineStatus] = useState<"running" | "idle">("running");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await api.getSystemMetrics();
        setMetrics(data);
        setCpuData(prev => [...prev.slice(1), data.cpu]);
        setRamData(prev => [...prev.slice(1), data.ram]);
      } catch (err) {
        console.error("Failed to fetch system metrics", err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);


  return (
    <motion.div initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline font-bold mb-1">System Monitoring</h2>
          <p className="text-slate-400 font-body">Real-time health of the VnComply architecture.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setEngineStatus(prev => prev === 'running' ? 'idle' : 'running')}
             className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
               engineStatus === 'running' ? 'bg-[#3cddc7]/10 text-[#3cddc7] hover:bg-[#3cddc7]/20 border border-[#3cddc7]/30' 
                                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
             }`}
           >
             <div className={`w-2 h-2 rounded-full ${engineStatus === 'running' ? 'bg-[#3cddc7] animate-pulse' : 'bg-slate-500'}`}></div>
             Engine: {engineStatus.toUpperCase()}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <motion.div whileHover={{ scale: 1.01 }} className="bg-[#171f33]/80 backdrop-blur border border-white/5 p-6 rounded-2xl shadow-xl shadow-black/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-lg font-bold flex items-center gap-2"><Cpu size={20} className="text-[#adc6ff]"/> CPU Utilization</h3>
            <span className="text-2xl font-black text-[#adc6ff]">{Math.round(cpuData[cpuData.length - 1])}%</span>
          </div>
          <D3SystemMetrics data={cpuData} color="#adc6ff" />
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} className="bg-[#171f33]/80 backdrop-blur border border-white/5 p-6 rounded-2xl shadow-xl shadow-black/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-lg font-bold flex items-center gap-2"><HardDrive size={20} className="text-[#a388ee]"/> RAM Usage</h3>
            <span className="text-2xl font-black text-[#a388ee]">{Math.round(ramData[ramData.length - 1])}%</span>
          </div>
          <D3SystemMetrics data={ramData} color="#a388ee" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Server, label: "Active Jobs", val: metrics?.active_jobs || "0", color: "text-[#3cddc7]" },
          { icon: Network, label: "Network I/O", val: "1.2 GB/s", color: "text-[#adc6ff]" },
          { icon: Server, label: "Nodes Live", val: "3 / 3", color: "text-[#a388ee]" },
          { icon: Cpu, label: "Disk Usage", val: `${metrics?.disk || 0}%`, color: "text-[#ffb48a]" }
        ].map((s, idx) => (
           <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }} className="bg-[#0b1326] border border-white/5 rounded-xl p-6 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-[30px] -translate-y-12 translate-x-12 group-hover:bg-white/10 transition-all duration-500"></div>
              <s.icon size={24} className={s.color} />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
                <p className="text-3xl font-black">{s.val}</p>
              </div>
           </motion.div>
        ))}
      </div>


    </motion.div>
  );
}
