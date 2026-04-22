"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldCheck, AlertCircle, RefreshCw, FileText, Download, History, ChevronRight, CheckCircle2 } from "lucide-react";
import * as d3 from "d3";
import { api } from "@/lib/api";

function D3ScoreRing({ score }: { score: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    d3.select(ref.current).selectAll("*").remove();

    const size = 160;
    const thickness = 15;
    const svg = d3.select(ref.current)
      .append("svg").attr("width", size).attr("height", size)
      .append("g").attr("transform", `translate(${size/2},${size/2})`);

    const color = score > 80 ? "#3cddc7" : score > 50 ? "#f59e0b" : "#ffb4ab";
    const arc = d3.arc().innerRadius((size/2) - thickness).outerRadius(size/2).startAngle(0);

    // Background ring
    svg.append("path").datum({endAngle: 2 * Math.PI})
       .style("fill", "rgba(255,255,255,0.05)").attr("d", arc as any);

    // Foreground ring
    const foreground = svg.append("path").datum({endAngle: 0})
       .style("fill", color).attr("d", arc as any)
       .style("filter", `drop-shadow(0px 0px 8px ${color}80)`);

    foreground.transition().duration(1500)
       .attrTween("d", function(d: any) {
           const i = d3.interpolate(d.endAngle, (score / 100) * 2 * Math.PI);
           return function(t) { d.endAngle = i(t); return arc(d as any) as string; }
       });

    svg.append("text").attr("text-anchor", "middle").attr("dy", "10px").attr("class", "font-bold text-4xl").style("fill", "#dae2fd")
       .text(0).transition().duration(1500).tween("text", function() {
           const i = d3.interpolateRound(0, score);
           return function(t) { this.textContent = i(t).toString(); }
       });

  }, [score]);

  return <div ref={ref} className="flex justify-center my-6" />;
}

export default function UserDashboard() {
  const [url, setUrl] = useState("");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "results">("idle");
  const [progress, setProgress] = useState(0);
  const [findings, setFindings] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  const startScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setScanState("scanning");
    setProgress(5);
    
    try {
      const scan = await api.createScan(url, "full");
      const scanId = scan.id;

      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await api.getScanStatus(scanId);
          setProgress(statusRes.progress);

          if (statusRes.status === "completed") {
            clearInterval(pollInterval);
            const findingsRes = await api.getScanFindings(scanId);
            setFindings(findingsRes);
            const calculatedScore = Math.max(0, 100 - (findingsRes.length * 8));
            setScore(calculatedScore);
            setScanState("results");
          } else if (statusRes.status === "failed") {
            clearInterval(pollInterval);
            alert("Scan failed: " + statusRes.error_msg);
            setScanState("idle");
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 2000);
    } catch (err) {
      alert("Failed to start scan");
      setScanState("idle");
    }
  };


  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-headline font-black text-white mb-2">Individual Compliance Scanner</h2>
        <p className="text-slate-400 font-medium">Quickly audit your web applications against Vietnam Decree 13.</p>
      </div>

      {/* Search Input Bar */}
      <motion.form 
        onSubmit={startScan}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-surface-container/80 backdrop-blur-md p-3 rounded-[2rem] shadow-2xl border border-white/5 flex items-center gap-3 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="bg-primary/10 p-4 rounded-2xl text-primary border border-primary/20 z-10">
           <Search size={28} />
        </div>
        <input 
          type="url" 
          value={url} 
          onChange={e => setUrl(e.target.value)} 
          disabled={scanState === 'scanning'}
          placeholder="Enter website URL to scan (e.g. https://your-site.com)" 
          className="flex-1 bg-transparent border-none text-xl font-medium focus:ring-0 text-white placeholder-slate-500 py-2 z-10"
          required
        />
        <button 
          type="submit" 
          disabled={scanState === 'scanning'}
          className="bg-primary hover:bg-primary-fixed-dim text-[#001a42] px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all disabled:opacity-50 z-10 shadow-[0_0_20px_rgba(173,198,255,0.2)]"
        >
          {scanState === 'scanning' ? <><RefreshCw className="animate-spin" /> Scanning</> : 'Quick Scan'}
        </button>
      </motion.form>

      {/* Interactive Scan Presentation */}
      <AnimatePresence mode="wait">
        {scanState === 'scanning' && (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface-container/50 backdrop-blur-xl rounded-3xl p-16 text-center shadow-2xl border border-white/5 relative overflow-hidden"
          >
            <RefreshCw className="animate-spin mx-auto text-primary mb-8" size={72}/>
            <h2 className="text-3xl font-headline font-bold text-white mb-3">Analyzing <span className="text-primary">{new URL(url).hostname}</span>...</h2>
            <p className="text-slate-400 mb-10 text-lg">Checking consent banners, tracking cookies, and policy documents.</p>
            
            <div className="w-full max-w-xl mx-auto bg-black/50 h-3 rounded-full overflow-hidden border border-white/5">
               <motion.div className="h-full bg-gradient-to-r from-primary to-tertiary" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 font-bold text-slate-500 tracking-widest">{Math.round(progress)}% COMPLETE</p>
          </motion.div>
        )}

        {scanState === 'results' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
             {/* Left Column: Score */}
             <div className="bg-surface-container/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/5 text-center flex flex-col items-center justify-center">
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm">Overall Compliance Score</h3>
                <D3ScoreRing score={score} />
                <p className="text-sm font-medium text-slate-300">
                  {score > 80 ? "Your site is highly compliant with Decree 13." : score > 50 ? "Your site is largely compliant, but requires updates." : "Critical compliance issues detected."}
                </p>
                
                <button className="w-full mt-8 bg-inverse-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Download size={20}/> Download Full PDF
                </button>
             </div>

             {/* Right Column: Violations and Issues */}
             <div className="md:col-span-2 space-y-4">
                <h3 className="font-headline font-bold text-xl text-white mb-4">Detected Findings</h3>
                {findings.length > 0 ? findings.map((f, i) => (
                  <div key={i} className="bg-surface-container/50 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/5 flex gap-5 items-start hover:bg-surface-container transition-colors">
                    <div className={`${f.severity === 'CRITICAL' || f.severity === 'HIGH' ? 'bg-error-container text-error' : 'bg-amber-500/20 text-amber-400'} p-4 rounded-2xl`}>
                      {f.category === 'privacy' ? <ShieldCheck size={28}/> : <AlertCircle size={28}/>}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-white mb-2">{f.title}</h4>
                      <p className="text-slate-400 text-sm mb-4 leading-relaxed">{f.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {f.nd13_ref && (
                          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{f.nd13_ref}</span>
                          </div>
                        )}
                        {f.law91_ref && (
                          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">{f.law91_ref}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="bg-[#003731]/30 p-12 rounded-3xl border border-[#3cddc7]/20 text-center flex flex-col items-center h-full justify-center">
                    <ShieldCheck className="text-[#3cddc7] mb-4 drop-shadow-[0_0_15px_rgba(60,221,199,0.5)]" size={64} />
                    <h4 className="font-bold text-2xl text-white mb-2 font-headline">Perfect Compliance!</h4>
                    <p className="text-[#3cddc7]">No issues were detected on the site.</p>
                  </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Scan History Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-headline font-bold text-white flex items-center gap-3">
            <History className="text-primary" /> Scan History
          </h3>
          <button className="text-sm font-bold text-primary hover:text-primary-fixed-dim transition-colors flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className="bg-surface-container/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-widest">Target URL</th>
                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-widest">Date</th>
                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-widest">Score</th>
                <th className="p-5 font-bold text-slate-400 text-sm uppercase tracking-widest">Status</th>
                <th className="p-5 text-right font-bold text-slate-400 text-sm uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { url: "https://shop.vncomply.local", date: "2026-04-20 14:30", score: 68, status: "completed" },
                { url: "https://blog.vncomply.local", date: "2026-04-18 09:15", score: 92, status: "completed" },
                { url: "https://legacy.vncomply.local", date: "2026-04-15 11:00", score: 45, status: "completed" }
              ].map((h, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="p-5 font-medium text-white">{h.url}</td>
                  <td className="p-5 text-slate-400 font-mono text-sm">{h.date}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${h.score > 80 ? 'bg-[#005047] text-[#3cddc7]' : h.score > 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-error-container text-error'}`}>
                      {h.score}/100
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-[#3cddc7]" /> {h.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button className="text-slate-400 group-hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg">
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

    </div>
  );
}

