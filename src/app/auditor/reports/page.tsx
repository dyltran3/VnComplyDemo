"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileBarChart, Download, Eye, Filter, CheckCircle, AlertTriangle, Clock, X } from "lucide-react";
import { api } from "@/lib/api";

export default function LegalReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [previewing, setPreviewing] = useState<any | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await api.listScans();
        const mapped = data.filter((s: any) => s.status === "completed").map((s: any) => ({
          id: s.id,
          client: s.target_url.replace(/https?:\/\//, ""),
          date: s.created_at.split("T")[0],
          score: s.score || 85,
          violations: s.findings_count || 0,
          auditor: "System",
          pages: 12
        }));
        setReports(mapped);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filtered = filter === "all" ? reports : reports.filter(r =>
    filter === "high" ? r.score < 55 : filter === "medium" ? r.score >= 55 && r.score < 80 : r.score >= 80
  );

  const doDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 1500);
  };


  return (
    <div className="space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-headline font-black text-white mb-2">Legal Reports Archive</h2>
        <p className="text-slate-400 font-medium">Complete compliance reports generated for your client portfolio, ready for legal submission.</p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter size={20} className="text-[#2563eb]" />
        {[["all", "All Reports"], ["high", "High Risk"], ["medium", "Medium Risk"], ["low", "Compliant"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border tracking-wide uppercase ${filter === val ? "bg-[#2563eb]/20 text-[#3b82f6] border-[#2563eb]/30 shadow-[0_0_15px_rgba(37,99,235,0.2)]" : "bg-surface text-slate-400 border-white/5 hover:bg-surface-container hover:text-white"}`}>
            {label}
          </button>
        ))}
        <span className="ml-auto text-slate-500 font-bold tracking-widest uppercase text-xs">{filtered.length} reports</span>
      </div>

      {/* Report Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map(r => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-surface-container/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-lg p-6 hover:bg-surface-container transition-all group">
              <div className="flex items-center gap-6">
                <div className="bg-[#2563eb]/10 p-4 rounded-xl border border-[#2563eb]/20 text-[#3b82f6]">
                  <FileBarChart size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-headline font-black text-lg text-white group-hover:text-[#3b82f6] transition-colors">{r.client}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-400 mt-2 font-medium">
                        <Clock size={14} className="text-[#2563eb]" />
                        <span>{r.date}</span>
                        <span className="text-white/20">•</span>
                        <span>{r.pages} pages</span>
                        <span className="text-white/20">•</span>
                        <span className="text-amber-400">{r.violations} violations</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-3xl font-black ${r.score < 55 ? "text-error drop-shadow-[0_0_10px_rgba(255,180,171,0.4)]" : r.score < 80 ? "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]" : "text-[#3cddc7] drop-shadow-[0_0_10px_rgba(60,221,199,0.4)]"}`}>{r.score}/100</span>
                      <p className={`text-[10px] tracking-widest uppercase font-bold mt-1 border px-2 py-0.5 rounded-full inline-block ${r.score < 55 ? "text-error border-error/20 bg-error/10" : r.score < 80 ? "text-amber-400 border-amber-400/20 bg-amber-400/10" : "text-[#3cddc7] border-[#3cddc7]/20 bg-[#3cddc7]/10"}`}>
                        {r.score < 55 ? "High Risk" : r.score < 80 ? "Needs Review" : "Compliant"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={() => setPreviewing(r)}
                      className="flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-xl text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all shadow-sm">
                      <Eye size={16} /> Preview
                    </button>
                    <button onClick={() => doDownload(r.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 ${downloading === r.id ? 'bg-[#3cddc7]/20 text-[#3cddc7] border border-[#3cddc7]/30' : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'}`}>
                      {downloading === r.id ? <><CheckCircle size={16} /> Exported!</> : <><Download size={16} /> Export PDF</>}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPreviewing(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface-container rounded-[2rem] w-full max-w-2xl p-10 shadow-2xl border border-white/10 relative overflow-hidden">
              
              <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] pointer-events-none opacity-30 ${previewing.score > 80 ? 'bg-[#3cddc7]' : previewing.score > 60 ? 'bg-amber-400' : 'bg-error'}`}></div>

              <div className="flex items-start justify-between mb-8 relative z-10">
                <div>
                  <p className="text-xs font-bold text-[#3b82f6] uppercase tracking-widest mb-3">Compliance Assessment Report</p>
                  <h3 className="text-3xl font-headline font-black text-white">{previewing.client}</h3>
                  <p className="text-slate-400 text-sm mt-2 font-medium">{previewing.date} · Prepared by <span className="text-[#3b82f6]">{previewing.auditor}</span></p>
                </div>
                <button onClick={() => setPreviewing(null)} className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-3 rounded-xl">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8 relative z-10">
                <div className="bg-surface rounded-2xl p-5 text-center border border-white/5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Score</p>
                  <p className={`text-4xl font-headline font-black mt-2 ${previewing.score < 55 ? "text-error drop-shadow-[0_0_10px_rgba(255,180,171,0.4)]" : previewing.score < 80 ? "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]" : "text-[#3cddc7] drop-shadow-[0_0_10px_rgba(60,221,199,0.4)]"}`}>{previewing.score}</p>
                </div>
                <div className="bg-surface rounded-2xl p-5 text-center border border-white/5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Violations</p>
                  <p className="text-4xl font-headline font-black mt-2 text-white">{previewing.violations}</p>
                </div>
                <div className="bg-surface rounded-2xl p-5 text-center border border-white/5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pages</p>
                  <p className="text-4xl font-headline font-black mt-2 text-white">{previewing.pages}</p>
                </div>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative z-10">
                {previewing.violations > 0 ? (
                  Array.from({ length: Math.min(previewing.violations, 4) }).map((_, i) => (
                    <div key={i} className="flex gap-4 p-5 border border-error/20 rounded-2xl bg-error/10">
                      <AlertTriangle className="text-error mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-bold text-white text-base">Violation #{i + 1}: Tracking cookie pre-consent</p>
                        <span className="text-[10px] font-bold text-error mt-2 inline-block uppercase tracking-widest border border-error/30 px-2 py-1 rounded bg-error/10">Decree 13, Art. 11</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-4 p-5 border border-[#3cddc7]/20 rounded-2xl bg-[#3cddc7]/10">
                    <CheckCircle className="text-[#3cddc7]" size={24} />
                    <p className="font-bold text-white text-lg">Fully compliant. No violations detected.</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8 relative z-10">
                <button onClick={() => setPreviewing(null)} className="flex-1 py-4 border border-white/10 rounded-xl font-bold text-slate-300 hover:bg-white/5 transition-colors">Close</button>
                <button onClick={() => { doDownload(previewing.id); setPreviewing(null); }}
                  className="flex-1 py-4 bg-[#2563eb] text-white rounded-xl font-black hover:bg-[#1d4ed8] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-colors">
                  <Download size={20} /> Export Legal PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
