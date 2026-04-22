"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, Filter, Download, RefreshCw, Loader2 } from "lucide-react";

export default function AuditLogsPage() {
  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setAllLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchLogs();

  const levelIcon: Record<string, React.ReactNode> = {
    error: <AlertTriangle size={18} className="text-error" />,
    warn:  <AlertTriangle size={18} className="text-amber-400" />,
    info:  <CheckCircle  size={18} className="text-[#3cddc7]" />,
  };

  const filtered = filter === "all" ? allLogs : (allLogs || []).filter(l => l.level === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline font-black text-white mb-2">Audit Logs</h2>
          <p className="text-slate-400 font-medium">Immutable activity records for all system actors and automated jobs.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={refresh} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-lg active:scale-95">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="bg-surface border border-white/10 px-6 py-3 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-all shadow-lg active:scale-95">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-3">
        {["all", "info", "warn", "error"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${filter === f ? "bg-slate-300/20 text-white border-slate-300/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "bg-surface border-white/5 text-slate-400 hover:bg-surface-container"}`}>
            <span className="flex items-center gap-2">
              {f !== "all" && levelIcon[f]} {f}
            </span>
          </button>
        ))}
        <span className="ml-auto text-slate-500 text-xs font-bold tracking-widest uppercase self-center">{filtered.length} events</span>
      </div>

      {/* Log Table */}
      <div className="bg-surface-container/50 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="divide-y divide-white/[0.04]">
          <AnimatePresence>
            {loading ? (
               <div className="p-16 text-center text-slate-500">
                  <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                  <span className="font-bold tracking-widest uppercase text-xs">Loading logs...</span>
               </div>
            ) : filtered.length === 0 ? (
               <div className="p-16 text-center text-slate-500">
                  <span className="font-bold tracking-widest uppercase text-xs">No logs found matching criteria.</span>
               </div>
            ) : filtered.map((log, index) => (
              <motion.div key={log.id || index} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-start gap-5 px-8 py-5 hover:bg-white/[0.02] transition-colors group">
                <div className="mt-1 flex-shrink-0 bg-white/5 p-2 rounded-xl border border-white/5">{levelIcon[log.level]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base text-slate-200 group-hover:text-white transition-colors">{log.action}</p>
                  <p className="text-sm text-slate-500 mt-1.5 font-medium">
                    <span className="text-[#adc6ff] font-bold">{log.actor}</span> &nbsp;·&nbsp; {log.ts}
                  </p>
                </div>
                <span className={`flex-shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded border ${log.level === "error" ? "text-error border-error/20 bg-error/10" : log.level === "warn" ? "text-amber-400 border-amber-400/20 bg-amber-400/10" : "text-[#3cddc7] border-[#3cddc7]/20 bg-[#3cddc7]/10"}`}>
                  {log.level}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
