"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldCheck, AlertCircle, RefreshCw, FileText, Download } from "lucide-react";
import * as d3 from "d3";

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

    const color = score > 80 ? "#10b981" : score > 50 ? "#f59e0b" : "#ef4444";
    const arc = d3.arc().innerRadius((size/2) - thickness).outerRadius(size/2).startAngle(0);

    // Background ring
    svg.append("path").datum({endAngle: 2 * Math.PI})
       .style("fill", "#f1f5f9").attr("d", arc as any);

    // Foreground ring
    const foreground = svg.append("path").datum({endAngle: 0})
       .style("fill", color).attr("d", arc as any)
       .style("filter", `drop-shadow(0px 0px 8px ${color}80)`);

    foreground.transition().duration(1500)
       .attrTween("d", function(d: any) {
           const i = d3.interpolate(d.endAngle, (score / 100) * 2 * Math.PI);
           return function(t) { d.endAngle = i(t); return arc(d as any) as string; }
       });

    svg.append("text").attr("text-anchor", "middle").attr("dy", "10px").attr("class", "font-bold text-4xl").style("fill", "#0f172a")
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

  const startScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setScanState("scanning");
    setProgress(0);
    
    // Mock the interactive scan progress
    const int = setInterval(() => {
       setProgress(p => {
           if (p >= 100) { clearInterval(int); setScanState("results"); return 100; }
           return p + Math.random() * 20;
       });
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Search Input Bar */}
      <motion.form 
        onSubmit={startScan}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 flex items-center gap-2"
      >
        <div className="bg-[#10b981]/10 p-3 rounded-xl text-[#059669]">
           <Search size={24} />
        </div>
        <input 
          type="url" 
          value={url} 
          onChange={e => setUrl(e.target.value)} 
          disabled={scanState === 'scanning'}
          placeholder="Enter website URL to scan (e.g. https://your-site.com)" 
          className="flex-1 bg-transparent border-none text-xl font-medium focus:ring-0 text-slate-800 placeholder-slate-400 py-2"
          required
        />
        <button 
          type="submit" 
          disabled={scanState === 'scanning'}
          className="bg-[#10b981] hover:bg-[#059669] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {scanState === 'scanning' ? <><RefreshCw className="animate-spin" /> Scanning</> : 'Quick Scan'}
        </button>
      </motion.form>

      {/* Interactive Scan Presentation */}
      <AnimatePresence mode="wait">
        {scanState === 'scanning' && (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="bg-white rounded-3xl p-12 text-center shadow-xl border border-slate-100"
          >
            <RefreshCw className="animate-spin mx-auto text-[#10b981] mb-6" size={64}/>
            <h2 className="text-2xl font-bold mb-2">Analyzing {new URL(url).hostname}...</h2>
            <p className="text-slate-500 mb-8">Checking consent banners, tracking cookies, and policy documents.</p>
            
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
               <motion.div className="h-full bg-[#10b981]" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 font-bold text-slate-400">{Math.round(progress)}% Complete</p>
          </motion.div>
        )}

        {scanState === 'results' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
             {/* Left Column: Score */}
             <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center flex flex-col items-center justify-center">
                <h3 className="text-slate-500 font-bold uppercase tracking-widest text-sm">Overall Compliance Score</h3>
                <D3ScoreRing score={68} />
                <p className="text-sm font-medium text-slate-600">Your site is largely compliant, but requires minor updates to the consent mechanisms.</p>
                
                <button className="w-full mt-6 bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700">
                  <Download size={18}/> Download Full PDF
                </button>
             </div>

             {/* Right Column: Violations and Issues */}
             <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex gap-4 items-start">
                   <div className="bg-amber-100 text-amber-600 p-3 rounded-xl"><AlertCircle size={24}/></div>
                   <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">Missing Cookie Consent Banner</h4>
                      <p className="text-slate-600 text-sm mb-3">The site sets 3 tracking cookies on load without prior user consent. This violates basic data protection principles.</p>
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                         <span className="material-symbols-outlined text-sm text-slate-400">gavel</span>
                         <span className="text-xs font-bold text-slate-500 uppercase">Legal Mapping: Decree 13, Article 11</span>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex gap-4 items-start">
                   <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl"><ShieldCheck size={24}/></div>
                   <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">Privacy Policy Detect</h4>
                      <p className="text-slate-600 text-sm mb-3">Privacy policy is accessible and clearly linked in the footer. Readability score is good.</p>
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                         <span className="material-symbols-outlined text-sm text-slate-400">gavel</span>
                         <span className="text-xs font-bold text-slate-500 uppercase">Legal Mapping: Decree 13, Article 12</span>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
