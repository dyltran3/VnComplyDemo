"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Play, Pause, RefreshCw, Terminal, CheckCircle2, AlertTriangle, Clock, Loader2 } from "lucide-react";

export default function ScanEnginePage() {
  const [engineOn, setEngineOn] = useState(true);
  const [workers, setWorkers] = useState(4);
  const [scanning, setScanning] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [testUrl, setTestUrl] = useState("https://example.com");

  const runTestScan = async () => {
    setLogs([]);
    setScanning(true);
    addLog("info", `Crawler initiated for target: ${testUrl}`);
    
    try {
      const scan = await api.createScan(testUrl);
      addLog("info", `Job scheduled with ID: ${scan.id.slice(0, 8)}...`);
      
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        const status = await api.getScanStatus(scan.id);
        
        if (status.status === "completed") {
          clearInterval(interval);
          addLog("info", `Scan complete. Compliance Score: ${status.score || 0}%`);
          addLog("info", "Findings synchronized with central database.");
          setScanning(false);
        } else if (status.status === "failed") {
          clearInterval(interval);
          addLog("error", "Scan engine encountered a critical error during execution.");
          setScanning(false);
        } else if (attempts > 30) {
          clearInterval(interval);
          addLog("warn", "Scan timeout exceeded. Check server logs.");
          setScanning(false);
        } else {
          addLog("info", `Scanning in progress... (${attempts * 3}s)`);
        }
      }, 3000);
      
    } catch (err: any) {
      addLog("error", `API Error: ${err.message}`);
      setScanning(false);
    }
  };

  const addLog = (level: string, msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour12: false });
    setLogs(prev => [...prev, { time, level, msg }]);
  };


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-headline font-black text-white mb-2">Scan Engine Control</h2>
        <p className="text-slate-400 font-medium">Configure and monitor the core VnComply crawling and analysis engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Engine Status */}
        <div className="bg-surface-container/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 flex flex-col gap-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#3cddc7]/10 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className={`w-3 h-3 rounded-full ${engineOn ? "bg-[#3cddc7] shadow-[0_0_10px_rgba(60,221,199,0.8)] animate-pulse" : "bg-slate-600"}`} />
            <h3 className="font-bold text-xl text-white">Engine Status</h3>
          </div>
          <div className="text-center py-6 relative z-10">
            <Server size={64} className={engineOn ? "text-[#3cddc7] mx-auto mb-4 drop-shadow-[0_0_15px_rgba(60,221,199,0.4)]" : "text-slate-600 mx-auto mb-4"} />
            <p className={`text-3xl font-headline font-black ${engineOn ? "text-[#3cddc7]" : "text-slate-500"}`}>{engineOn ? "ONLINE" : "OFFLINE"}</p>
            <p className="text-slate-400 text-sm mt-2 font-medium">Core Crawler v3.1.2</p>
          </div>
          <button
            onClick={() => setEngineOn(e => !e)}
            className={`w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg relative z-10 ${engineOn ? "bg-error/10 text-error hover:bg-error/20 border border-error/20" : "bg-[#3cddc7]/10 text-[#3cddc7] hover:bg-[#3cddc7]/20 border border-[#3cddc7]/20"}`}
          >
            {engineOn ? <><Pause size={20} /> Shut Down</> : <><Play size={20} /> Start Engine</>}
          </button>
        </div>

        {/* Worker Threads */}
        <div className="bg-surface-container/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#a388ee]/10 rounded-full blur-[40px] pointer-events-none"></div>
          <h3 className="font-bold text-xl text-white relative z-10">Worker Threads</h3>
          <div className="text-center py-4 relative z-10">
            <p className="text-6xl font-headline font-black text-[#a388ee] drop-shadow-[0_0_15px_rgba(163,136,238,0.4)]">{workers}</p>
            <p className="text-slate-400 text-sm mt-2 font-medium">Parallel crawlers active</p>
          </div>
          <input
            type="range" min={1} max={16} value={workers}
            onChange={e => setWorkers(Number(e.target.value))}
            className="accent-[#a388ee] w-full relative z-10 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500 relative z-10 mt-2">
            <span>1 (Low load)</span><span>16 (Max power)</span>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-surface-container/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#adc6ff]/10 rounded-full blur-[40px] pointer-events-none"></div>
          <h3 className="font-bold text-xl text-white relative z-10 mb-2">Today's Stats</h3>
          <div className="space-y-1 relative z-10">
            {[
              { label: "Scans Completed", val: "1,247", color: "text-[#3cddc7]" },
              { label: "Avg Scan Time", val: "3.2s", color: "text-[#adc6ff]" },
              { label: "Violations Found", val: "234", color: "text-amber-400" },
              { label: "Queue Backlog", val: "15 jobs", color: "text-[#a388ee]" },
            ].map(s => (
              <div key={s.label} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                <span className="text-slate-400 text-sm font-medium">{s.label}</span>
                <span className={`font-black text-xl ${s.color}`}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Scanner Console */}
      <div className="bg-surface-container/50 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02]">
          <h3 className="font-bold flex items-center gap-3 text-lg text-white"><Terminal size={24} className="text-[#3cddc7]" /> Live Test Console</h3>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              value={testUrl}
              onChange={e => setTestUrl(e.target.value)}
              className="bg-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm w-full md:w-80 focus:ring-1 focus:ring-[#adc6ff] transition-all"
            />
            <button onClick={runTestScan} disabled={!engineOn || scanning}
              className="bg-[#adc6ff] hover:bg-[#c7d8ff] text-[#001a42] font-black px-6 py-3 rounded-xl transition-all active:scale-95 disabled:opacity-40 flex items-center gap-2 shadow-[0_0_15px_rgba(173,198,255,0.3)] flex-shrink-0">
              {scanning ? <><RefreshCw size={18} className="animate-spin" /> Running...</> : "Run Test Scan"}
            </button>
          </div>
        </div>
        <div className="p-6 font-mono text-sm min-h-[300px] bg-[#000000]/40 space-y-3">
          {logs.length === 0 && !scanning && (
            <p className="text-slate-600 italic">// Console output will appear here after running a test scan...</p>
          )}
          <AnimatePresence>
            {logs.map((log, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className={`flex gap-4 ${log.level === "error" ? "text-error" : log.level === "warn" ? "text-amber-400" : "text-[#3cddc7]"}`}>
                <span className="text-slate-600">[{log.time}]</span>
                <span className={`uppercase font-black text-xs w-12 ${log.level === "error" ? "text-error" : log.level === "warn" ? "text-amber-400" : "text-[#adc6ff]"}`}>{log.level}</span>
                <span className="text-slate-300 font-medium">{log.msg}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {scanning && <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="text-[#3cddc7]">▋</motion.div>}
        </div>
      </div>
    </motion.div>
  );
}
