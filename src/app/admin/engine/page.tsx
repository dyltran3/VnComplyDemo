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
      
      // Poll for status
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-bold mb-1">Scan Engine Control</h2>
        <p className="text-slate-400">Configure and monitor the core VnComply crawling and analysis engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Engine Status */}
        <div className="bg-[#0b1326] border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${engineOn ? "bg-[#3cddc7] animate-pulse" : "bg-slate-600"}`} />
            <h3 className="font-bold text-lg">Engine Status</h3>
          </div>
          <div className="text-center py-4">
            <Server size={48} className={engineOn ? "text-[#adc6ff] mx-auto mb-3" : "text-slate-600 mx-auto mb-3"} />
            <p className={`text-2xl font-black ${engineOn ? "text-[#3cddc7]" : "text-slate-500"}`}>{engineOn ? "ONLINE" : "OFFLINE"}</p>
            <p className="text-slate-500 text-sm mt-1">Core Crawler v3.1.2</p>
          </div>
          <button
            onClick={() => setEngineOn(e => !e)}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${engineOn ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20" : "bg-[#3cddc7]/10 text-[#3cddc7] hover:bg-[#3cddc7]/20 border border-[#3cddc7]/20"}`}
          >
            {engineOn ? <><Pause size={18} /> Shut Down</> : <><Play size={18} /> Start Engine</>}
          </button>
        </div>

        {/* Worker Threads */}
        <div className="bg-[#0b1326] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-bold text-lg">Worker Threads</h3>
          <div className="text-center py-2">
            <p className="text-5xl font-black text-[#a388ee]">{workers}</p>
            <p className="text-slate-500 text-sm mt-1">Parallel crawlers active</p>
          </div>
          <input
            type="range" min={1} max={16} value={workers}
            onChange={e => setWorkers(Number(e.target.value))}
            className="accent-[#a388ee] w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>1 (Low load)</span><span>16 (Max power)</span>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#0b1326] border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
          <h3 className="font-bold text-lg">Today's Stats</h3>
          {[
            { label: "Scans Completed", val: "1,247", color: "text-[#3cddc7]" },
            { label: "Avg Scan Time", val: "3.2s", color: "text-[#adc6ff]" },
            { label: "Violations Found", val: "234", color: "text-[#ffb48a]" },
            { label: "Queue Backlog", val: "15 jobs", color: "text-[#a388ee]" },
          ].map(s => (
            <div key={s.label} className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400 text-sm">{s.label}</span>
              <span className={`font-black text-lg ${s.color}`}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Test Scanner Console */}
      <div className="bg-[#0b1326] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><Terminal size={18} className="text-[#3cddc7]" /> Live Test Console</h3>
          <div className="flex gap-2 items-center">
            <input
              value={testUrl}
              onChange={e => setTestUrl(e.target.value)}
              className="bg-[#171f33] border border-white/10 rounded-lg px-3 py-2 text-white text-sm w-72 focus:ring-1 focus:ring-[#adc6ff]"
            />
            <button onClick={runTestScan} disabled={!engineOn || scanning}
              className="bg-[#adc6ff] hover:bg-[#c7d8ff] text-[#001a42] font-black px-4 py-2 rounded-lg text-sm transition-all active:scale-95 disabled:opacity-40 flex items-center gap-2">
              {scanning ? <><RefreshCw size={14} className="animate-spin" /> Running...</> : "Run Test Scan"}
            </button>
          </div>
        </div>
        <div className="p-4 font-mono text-sm min-h-[200px] bg-[#05060f] space-y-2">
          {logs.length === 0 && !scanning && (
            <p className="text-slate-600 italic">// Console output will appear here after running a test scan...</p>
          )}
          <AnimatePresence>
            {logs.map((log, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className={`flex gap-3 ${log.level === "error" ? "text-red-400" : log.level === "warn" ? "text-amber-400" : "text-[#3cddc7]"}`}>
                <span className="text-slate-600">[{log.time}]</span>
                <span className={`uppercase font-black text-xs w-10 ${log.level === "error" ? "text-red-400" : log.level === "warn" ? "text-amber-400" : "text-[#adc6ff]"}`}>{log.level}</span>
                <span className="text-slate-300">{log.msg}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {scanning && <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="text-[#3cddc7]">▋</motion.div>}
        </div>
      </div>
    </motion.div>
  );
}
