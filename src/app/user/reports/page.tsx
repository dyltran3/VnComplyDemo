"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Eye, Tag, Check } from "lucide-react";

const reports = [
  { id: 1, title: "VnExpress Scan — Apr 15", date: "2026-04-15", score: 68, type: "Quick Scan", pages: 4 },
  { id: 2, title: "Shopee.vn Scan — Apr 14", date: "2026-04-14", score: 85, type: "Quick Scan", pages: 4 },
  { id: 3, title: "Tiki.vn Scan — Apr 13", date: "2026-04-13", score: 53, type: "Quick Scan", pages: 5 },
];

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<number | null>(null);
  const [previewing, setPreviewing] = useState<typeof reports[0] | null>(null);

  const download = (id: number) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-headline font-black text-slate-800 mb-1">My Reports</h2>
        <p className="text-slate-500">Download or preview PDF reports for your previous compliance scans.</p>
      </div>

      <div className="space-y-4">
        {reports.map(r => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-5 hover:shadow-md transition-all">
            <div className="bg-slate-100 p-4 rounded-xl">
              <FileText className="text-slate-500" size={32} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-slate-800">{r.title}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                <span>{r.date}</span>
                <span className="text-slate-300">|</span>
                <span className={`font-bold ${r.score > 80 ? "text-emerald-600" : r.score > 60 ? "text-amber-600" : "text-red-600"}`}>
                  Score: {r.score}/100
                </span>
                <span className="text-slate-300">|</span>
                <span>{r.pages} pages</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPreviewing(r)}
                className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all">
                <Eye size={18} />
              </button>
              <button onClick={() => download(r.id)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95">
                {downloading === r.id ? <><Check size={16} className="text-[#10b981]" /> Saved!</> : <><Download size={16} /> PDF</>}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPreviewing(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Tag className="text-[#10b981] mb-2" size={24} />
                  <h3 className="text-xl font-black text-slate-800">{previewing.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">Compliance Assessment Report · {previewing.pages} pages</p>
                </div>
                <span className={`text-3xl font-black ${previewing.score > 80 ? "text-emerald-500" : previewing.score > 60 ? "text-amber-500" : "text-red-500"}`}>
                  {previewing.score}
                </span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 space-y-3 text-sm text-slate-600 border border-slate-100">
                <p className="font-bold text-slate-700 text-base">Report Summary</p>
                <p>✦ Cookie Consent Banner: <span className="font-bold text-red-600">NOT DETECTED</span></p>
                <p>✦ Privacy Policy Link: <span className="font-bold text-emerald-600">FOUND</span></p>
                <p>✦ HTTPS Encryption: <span className="font-bold text-emerald-600">VALID</span></p>
                <p>✦ Third-party Trackers: <span className="font-bold text-amber-600">3 detected without consent</span></p>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setPreviewing(null)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Close</button>
                <button onClick={() => { download(previewing.id); setPreviewing(null); }}
                  className="flex-1 py-3 bg-slate-800 rounded-xl font-bold text-white hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <Download size={16} /> Download PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
