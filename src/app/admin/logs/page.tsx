"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
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
    error: <AlertTriangle size={16} className="text-red-400" />,
    warn:  <AlertTriangle size={16} className="text-amber-400" />,
    info:  <CheckCircle  size={16} className="text-[#3cddc7]" />,
  };

  const filtered = filter === "all" ? allLogs : (allLogs || []).filter(l => l.level === filter);



  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline font-bold mb-1">Audit Logs</h2>
          <p className="text-slate-400">Immutable activity records for all system actors and automated jobs.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refresh} className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg font-bold text-slate-300 hover:bg-white/10 flex items-center gap-2 transition-all">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2">
        {["all", "info", "warn", "error"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${filter === f ? "bg-[#adc6ff] text-[#001a42]" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
            <span className="flex items-center gap-1.5">
              {f !== "all" && levelIcon[f]} {f}
            </span>
          </button>
        ))}
        <span className="ml-auto text-slate-500 text-sm self-center">{filtered.length} events</span>
      </div>

      {/* Log Table */}
      <div className="bg-[#0b1326] rounded-2xl border border-white/5 overflow-hidden">
        <div className="divide-y divide-white/[0.04]">
          {filtered.map(log => (
            <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-start gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="mt-0.5 flex-shrink-0">{levelIcon[log.level]}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-200 truncate">{log.action}</p>
                <p className="text-xs text-slate-500 mt-1">
                  <span className="text-slate-400 font-bold">{log.actor}</span> &nbsp;·&nbsp; {log.ts}
                </p>
              </div>
              <span className={`flex-shrink-0 text-xs font-black uppercase px-2 py-1 rounded border ${log.level === "error" ? "text-red-400 border-red-500/20 bg-red-500/10" : log.level === "warn" ? "text-amber-400 border-amber-500/20 bg-amber-500/10" : "text-[#3cddc7] border-[#3cddc7]/20 bg-[#3cddc7]/10"}`}>
                {log.level}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
