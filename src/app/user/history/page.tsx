"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Download, RefreshCw, Search, AlertTriangle, CheckCircle, BarChart2, TrendingDown } from "lucide-react";

const historyData = [
  { id: 1, url: "https://vnexpress.net", date: "2026-04-15 21:04", score: 68, violations: 3, status: "completed" },
  { id: 2, url: "https://shopee.vn", date: "2026-04-14 18:30", score: 85, violations: 1, status: "completed" },
  { id: 3, url: "https://tiki.vn", date: "2026-04-13 10:10", score: 53, violations: 6, status: "completed" },
  { id: 4, url: "https://tuoitre.vn", date: "2026-04-12 09:45", score: 91, violations: 0, status: "completed" },
];

export default function ScanHistoryPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof historyData[0] | null>(null);

  const filtered = historyData.filter(h => h.url.includes(query.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-headline font-black text-slate-800 mb-1">Scan History</h2>
        <p className="text-slate-500">Review all previous scans and their compliance results.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search by URL..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-800 shadow-sm focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {filtered.map(h => (
              <motion.button key={h.id} onClick={() => setSelected(h)}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className={`w-full text-left bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all ${selected?.id === h.id ? "border-[#10b981] ring-2 ring-[#10b981]/20" : "border-slate-200"}`}>
                <div className="flex justify-between items-start">
                  <p className="font-bold text-slate-800 text-sm truncate pr-2">{h.url}</p>
                  <span className={`flex-shrink-0 text-lg font-black ${h.score > 80 ? "text-emerald-500" : h.score > 60 ? "text-amber-500" : "text-red-500"}`}>
                    {h.score}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <Clock size={12} />
                  <span>{h.date}</span>
                  {h.violations > 0 ? (
                    <span className="ml-auto text-amber-500 font-bold">{h.violations} violations</span>
                  ) : (
                    <span className="ml-auto text-emerald-500 font-bold">Clean</span>
                  )}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sticky top-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-black text-xl text-slate-800 break-all">{selected.url}</h3>
                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-1"><Clock size={12} /> {selected.date}</p>
                  </div>
                  <button className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1.5 hover:bg-slate-700 transition-all">
                    <Download size={14} /> PDF
                  </button>
                </div>

                {/* Score Visual */}
                <div className="bg-slate-50 rounded-xl p-5 text-center mb-6 border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Compliance Score</p>
                  <p className={`text-6xl font-black ${selected.score > 80 ? "text-emerald-500" : selected.score > 60 ? "text-amber-500" : "text-red-500"}`}>
                    {selected.score}
                  </p>
                  <div className="w-full bg-slate-200 h-3 rounded-full mt-4 overflow-hidden">
                    <motion.div className={`h-full rounded-full ${selected.score > 80 ? "bg-emerald-500" : selected.score > 60 ? "bg-amber-500" : "bg-red-500"}`}
                      initial={{ width: 0 }} animate={{ width: `${selected.score}%` }} transition={{ duration: 1.2, ease: "easeOut" }} />
                  </div>
                </div>

                {/* Findings */}
                <h4 className="font-bold text-slate-700 mb-3">Key Findings</h4>
                <div className="space-y-3">
                  {selected.violations > 0 ? (
                    <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="font-bold text-slate-800">Cookie consent banner missing</p>
                        <p className="text-slate-500 text-sm mt-1">Site sets tracking cookies before user consent. Violates Decree 13 Art. 11.</p>
                      </div>
                    </div>
                  ) : null}
                  <div className="flex gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="font-bold text-slate-800">Privacy Policy detected</p>
                      <p className="text-slate-500 text-sm mt-1">Accessible in footer. Compliant with Decree 13 Art. 12.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-80 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                <BarChart2 size={48} className="opacity-20 mb-3" />
                <p className="font-bold">Select a scan to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
