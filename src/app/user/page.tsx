"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldCheck, AlertCircle, RefreshCw, FileText, Download } from "lucide-react";
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
                <D3ScoreRing score={score} />
                <p className="text-sm font-medium text-slate-600">
                  {score > 80 ? "Your site is highly compliant with Decree 13." : score > 50 ? "Your site is largely compliant, but requires updates." : "Critical compliance issues detected."}
                </p>
                
                <button className="w-full mt-6 bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700">
                  <Download size={18}/> Download Full PDF
                </button>
             </div>

             {/* Right Column: Violations and Issues */}
             <div className="md:col-span-2 space-y-6">
                {findings.length > 0 ? findings.map((f, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex gap-4 items-start">
                    <div className={`${f.severity === 'CRITICAL' || f.severity === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'} p-3 rounded-xl`}>
                      {f.category === 'privacy' ? <ShieldCheck size={24}/> : <AlertCircle size={24}/>}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">{f.title}</h4>
                      <p className="text-slate-600 text-sm mb-3">{f.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {f.nd13_ref && (
                          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{f.nd13_ref}</span>
                          </div>
                        )}
                        {f.law91_ref && (
                          <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">{f.law91_ref}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="bg-green-50 p-12 rounded-3xl border border-green-100 text-center flex flex-col items-center">
                    <ShieldCheck className="text-green-500 mb-4" size={48} />
                    <h4 className="font-bold text-xl text-green-800">Perfect Compliance!</h4>
                    <p className="text-green-600">No issues were detected on the site.</p>
                  </div>
                )}
             </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
