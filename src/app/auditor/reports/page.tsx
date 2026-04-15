"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileBarChart, Download, Eye, Filter, CheckCircle, AlertTriangle, Clock, X } from "lucide-react";

const reports = [
  { id: 1, client: "FinTech VN Corp", date: "2026-04-15", score: 45, violations: 12, auditor: "Auditor@testmail", pages: 12 },
  { id: 2, client: "HealthPlus Clinics", date: "2026-04-14", score: 72, violations: 5, auditor: "Auditor@testmail", pages: 8 },
  { id: 3, client: "EduSpace Online", date: "2026-04-13", score: 91, violations: 1, auditor: "Auditor@testmail", pages: 6 },
];

export default function LegalReportsPage() {
  const [filter, setFilter] = useState("all");
  const [previewing, setPreviewing] = useState<typeof reports[0] | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);

  const filtered = filter === "all" ? reports : reports.filter(r =>
    filter === "high" ? r.score < 55 : filter === "medium" ? r.score >= 55 && r.score < 80 : r.score >= 80
  );

  const doDownload = (id: number) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-headline font-black text-[#0f172a] mb-1">Legal Reports Archive</h2>
        <p className="text-slate-500">Complete compliance reports generated for your client portfolio, ready for legal submission.</p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={16} className="text-slate-400" />
        {[["all", "All Reports"], ["high", "High Risk"], ["medium", "Medium Risk"], ["low", "Compliant"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${filter === val ? "bg-[#2563eb] text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {label}
          </button>
        ))}
        <span className="ml-auto text-slate-400 text-sm">{filtered.length} reports</span>
      </div>

      {/* Report Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map(r => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-5">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <FileBarChart className="text-[#2563eb]" size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-slate-800">{r.client}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <Clock size={12} />
                        <span>{r.date}</span>
                        <span className="text-slate-300">·</span>
                        <span>{r.pages} pages</span>
                        <span className="text-slate-300">·</span>
                        <span>{r.violations} violations</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-black ${r.score < 55 ? "text-red-500" : r.score < 80 ? "text-amber-500" : "text-emerald-600"}`}>{r.score}/100</span>
                      <p className={`text-xs uppercase font-bold mt-1 ${r.score < 55 ? "text-red-500" : r.score < 80 ? "text-amber-500" : "text-emerald-600"}`}>
                        {r.score < 55 ? "High Risk" : r.score < 80 ? "Needs Review" : "Compliant"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setPreviewing(r)}
                      className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                      <Eye size={14} /> Preview
                    </button>
                    <button onClick={() => doDownload(r.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-sm font-bold transition-all active:scale-95 shadow-md shadow-blue-600/20">
                      {downloading === r.id ? <><CheckCircle size={14} /> Exported!</> : <><Download size={14} /> Export PDF</>}
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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs font-bold text-[#2563eb] uppercase tracking-widest mb-2">Compliance Assessment Report</p>
                  <h3 className="text-2xl font-black text-slate-800">{previewing.client}</h3>
                  <p className="text-slate-500 text-sm mt-1">{previewing.date} · Prepared by {previewing.auditor}</p>
                </div>
                <button onClick={() => setPreviewing(null)} className="text-slate-400 hover:text-slate-800 transition-colors bg-slate-100 p-2 rounded-xl">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4 text-center border">
                  <p className="text-xs font-bold text-slate-500 uppercase">Score</p>
                  <p className={`text-3xl font-black mt-1 ${previewing.score < 55 ? "text-red-500" : previewing.score < 80 ? "text-amber-500" : "text-emerald-600"}`}>{previewing.score}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center border">
                  <p className="text-xs font-bold text-slate-500 uppercase">Violations</p>
                  <p className="text-3xl font-black mt-1 text-slate-800">{previewing.violations}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center border">
                  <p className="text-xs font-bold text-slate-500 uppercase">Pages</p>
                  <p className="text-3xl font-black mt-1 text-slate-800">{previewing.pages}</p>
                </div>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {previewing.violations > 0 ? (
                  Array.from({ length: Math.min(previewing.violations, 4) }).map((_, i) => (
                    <div key={i} className="flex gap-3 p-4 border border-red-100 rounded-xl bg-red-50">
                      <AlertTriangle className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Violation #{i + 1}: Tracking cookie pre-consent</p>
                        <span className="text-xs font-bold text-red-600 mt-1 inline-block">Decree 13, Art. 11</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-3 p-4 border border-emerald-100 rounded-xl bg-emerald-50">
                    <CheckCircle className="text-emerald-500" size={18} />
                    <p className="font-bold text-slate-800 text-sm">Fully compliant. No violations detected.</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setPreviewing(null)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Close</button>
                <button onClick={() => { doDownload(previewing.id); setPreviewing(null); }}
                  className="flex-1 py-3 bg-[#2563eb] text-white rounded-xl font-black hover:bg-[#1d4ed8] flex items-center justify-center gap-2">
                  <Download size={16} /> Export Legal PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
