"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Download, RefreshCw, Search, AlertTriangle, CheckCircle, BarChart2, TrendingDown, Loader2 } from "lucide-react";

export default function ScanHistoryPage() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.listUserScans(); 
      setHistoryData(data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = (historyData || []).filter(h => 
    (h.target_url || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-headline font-black text-white mb-2">Scan History</h2>
        <p className="text-slate-400 font-medium">Review all previous scans and their compliance results.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search by URL..."
          className="w-full bg-surface-container/80 backdrop-blur-md border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-500 shadow-xl focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {filtered.map(h => (
              <motion.button key={h.id} onClick={() => setSelected(h)}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className={`w-full text-left bg-surface-container/50 backdrop-blur-md rounded-2xl border p-5 shadow-lg transition-all ${selected?.id === h.id ? "border-primary bg-surface shadow-[0_0_15px_rgba(173,198,255,0.15)]" : "border-white/5 hover:bg-surface-container"}`}>
                <div className="flex justify-between items-start">
                  <p className="font-bold text-white text-sm truncate pr-2">{h.url}</p>
                  <span className={`flex-shrink-0 text-lg font-black ${h.score > 80 ? "text-[#3cddc7]" : h.score > 60 ? "text-amber-400" : "text-error"}`}>
                    {h.score}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                  <Clock size={14} className="text-primary/70" />
                  <span>{h.date}</span>
                  {h.violations > 0 ? (
                    <span className="ml-auto text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">{h.violations} violations</span>
                  ) : (
                    <span className="ml-auto text-[#3cddc7] font-bold bg-[#3cddc7]/10 px-2 py-0.5 rounded border border-[#3cddc7]/20">Clean</span>
                  )}
                </div>
              </motion.button>
            ))}
            {filtered.length === 0 && !loading && (
              <div className="text-center p-8 bg-surface-container/30 border border-white/5 rounded-2xl">
                <p className="text-slate-500 font-medium">No previous scans found.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="bg-surface-container/50 backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-2xl p-8 sticky top-4">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="font-headline font-black text-2xl text-white break-all mb-2">{selected.url}</h3>
                    <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                       <Clock size={14} className="text-primary" /> {selected.date}
                    </p>
                  </div>
                  <button className="bg-inverse-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-lg">
                    <Download size={16} /> PDF
                  </button>
                </div>

                {/* Score Visual */}
                <div className="bg-surface rounded-2xl p-8 text-center mb-8 border border-white/5 relative overflow-hidden">
                  <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] pointer-events-none ${selected.score > 80 ? "bg-[#3cddc7]/20" : selected.score > 60 ? "bg-amber-400/20" : "bg-error/20"}`}></div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 relative z-10">Compliance Score</p>
                  <p className={`text-7xl font-headline font-black relative z-10 ${selected.score > 80 ? "text-[#3cddc7] drop-shadow-[0_0_15px_rgba(60,221,199,0.4)]" : selected.score > 60 ? "text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]" : "text-error drop-shadow-[0_0_15px_rgba(255,180,171,0.4)]"}`}>
                    {selected.score}
                  </p>
                  <div className="w-full bg-black/40 h-3 rounded-full mt-6 overflow-hidden border border-white/5 relative z-10">
                    <motion.div className={`h-full rounded-full ${selected.score > 80 ? "bg-[#3cddc7]" : selected.score > 60 ? "bg-amber-400" : "bg-error"}`}
                      initial={{ width: 0 }} animate={{ width: `${selected.score}%` }} transition={{ duration: 1.2, ease: "easeOut" }} />
                  </div>
                </div>

                {/* Findings */}
                <h4 className="font-headline font-bold text-xl text-white mb-4">Key Findings</h4>
                <div className="space-y-4">
                  {selected.violations > 0 ? (
                    <div className="flex gap-4 p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                      <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-bold text-white mb-1">Cookie consent banner missing</p>
                        <p className="text-slate-400 text-sm leading-relaxed mb-3">Site sets tracking cookies before user consent. Violates Decree 13 Art. 11.</p>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest border border-amber-400/30 px-2 py-1 rounded bg-amber-400/10">High Severity</span>
                      </div>
                    </div>
                  ) : null}
                  <div className="flex gap-4 p-5 bg-[#3cddc7]/10 border border-[#3cddc7]/20 rounded-2xl">
                    <CheckCircle className="text-[#3cddc7] flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-bold text-white mb-1">Privacy Policy detected</p>
                      <p className="text-slate-400 text-sm leading-relaxed">Accessible in footer. Compliant with Decree 13 Art. 12.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-[500px] border-2 border-dashed border-white/10 rounded-[2rem] bg-surface-container/20 flex flex-col items-center justify-center text-slate-500">
                <BarChart2 size={64} className="opacity-20 mb-4" />
                <p className="font-bold text-lg">Select a scan to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
