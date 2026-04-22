"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Eye, Tag, Check, ShieldAlert } from "lucide-react";

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
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-headline font-black text-white mb-2">My Reports</h2>
        <p className="text-slate-400 font-medium">Download or preview PDF reports for your previous compliance scans.</p>
      </div>

      <div className="space-y-4">
        {reports.map(r => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-lg p-6 flex items-center gap-6 hover:bg-surface-container transition-all group">
            <div className={`p-4 rounded-xl ${r.score > 80 ? 'bg-[#3cddc7]/10 text-[#3cddc7]' : r.score > 60 ? 'bg-amber-400/10 text-amber-400' : 'bg-error/10 text-error'}`}>
              <FileText size={32} />
            </div>
            <div className="flex-1">
              <h3 className="font-headline font-black text-lg text-white group-hover:text-primary transition-colors">{r.title}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-400 font-medium">
                <span>{r.date}</span>
                <span className="text-white/20">•</span>
                <span className={`font-bold tracking-wide ${r.score > 80 ? "text-[#3cddc7]" : r.score > 60 ? "text-amber-400" : "text-error"}`}>
                  Score: {r.score}/100
                </span>
                <span className="text-white/20">•</span>
                <span>{r.pages} pages</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPreviewing(r)}
                className="p-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white transition-all shadow-sm">
                <Eye size={20} />
              </button>
              <button onClick={() => download(r.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${downloading === r.id ? 'bg-[#3cddc7]/20 text-[#3cddc7] border border-[#3cddc7]/30' : 'bg-primary hover:bg-primary-fixed-dim text-[#001a42]'}`}>
                {downloading === r.id ? <><Check size={18} /> Saved!</> : <><Download size={18} /> Download PDF</>}
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
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface-container rounded-[2rem] w-full max-w-xl p-10 shadow-2xl border border-white/10 relative overflow-hidden">
              
              <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] pointer-events-none opacity-30 ${previewing.score > 80 ? 'bg-[#3cddc7]' : previewing.score > 60 ? 'bg-amber-400' : 'bg-error'}`}></div>

              <div className="flex items-start justify-between mb-8 relative z-10">
                <div>
                  <Tag className="text-primary mb-3" size={28} />
                  <h3 className="text-2xl font-headline font-black text-white">{previewing.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">Compliance Assessment Report · {previewing.pages} pages</p>
                </div>
                <span className={`text-4xl font-black ${previewing.score > 80 ? "text-[#3cddc7]" : previewing.score > 60 ? "text-amber-400" : "text-error"}`}>
                  {previewing.score}
                </span>
              </div>
              <div className="bg-surface rounded-2xl p-6 space-y-4 text-sm text-slate-400 border border-white/5 relative z-10">
                <p className="font-bold text-white text-base mb-2">Report Summary</p>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span>Cookie Consent Banner</span>
                  <span className="font-bold text-error bg-error/10 px-2 py-0.5 rounded">NOT DETECTED</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span>Privacy Policy Link</span>
                  <span className="font-bold text-[#3cddc7] bg-[#3cddc7]/10 px-2 py-0.5 rounded">FOUND</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span>HTTPS Encryption</span>
                  <span className="font-bold text-[#3cddc7] bg-[#3cddc7]/10 px-2 py-0.5 rounded">VALID</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Third-party Trackers</span>
                  <span className="font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">3 DETECTED</span>
                </div>
              </div>
              <div className="flex gap-4 mt-8 relative z-10">
                <button onClick={() => setPreviewing(null)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all">Close</button>
                <button onClick={() => { download(previewing.id); setPreviewing(null); }}
                  className="flex-1 py-4 bg-primary rounded-xl font-bold text-[#001a42] hover:bg-primary-fixed-dim transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(173,198,255,0.3)]">
                  <Download size={20} /> Download PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
