"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, FileText, BellRing, Settings2, Plus, ShieldAlert, CheckCircle, Fingerprint, Database, BookOpen, AlertOctagon } from "lucide-react";

export default function BusinessDashboard() {
  const [scheduleModal, setScheduleModal] = useState(false);
  const [dpiaModal, setDpiaModal] = useState(false);
  const [dpiaStep, setDpiaStep] = useState(1);
  
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-headline font-black text-white mb-2">Corporate Compliance Hub</h2>
          <p className="text-slate-400 font-medium">View organizational limits, schedule automated scans, and generate DPIA reports.</p>
        </div>
        <button 
          onClick={() => setScheduleModal(true)}
          className="bg-primary hover:bg-primary-fixed-dim text-[#001a42] px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(173,198,255,0.2)] active:scale-95"
        >
          <Plus size={18} /> Schedule Auto-Scan
        </button>
      </div>

      <AnimatePresence>
        {/* Schedule Modal */}
        {scheduleModal && (
           <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <div className="bg-surface-container border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
                 <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px]"></div>
                 <h3 className="text-2xl font-headline font-bold text-white mb-6 flex items-center gap-3 relative z-10"><Clock className="text-primary"/> Configure Scan Schedule</h3>
                 <form className="space-y-5 relative z-10" onSubmit={(e) => { e.preventDefault(); setScheduleModal(false); }}>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Frequency</label>
                      <select className="w-full bg-surface border border-white/5 rounded-xl p-4 text-white focus:ring-1 focus:ring-primary focus:border-primary">
                         <option>Daily</option>
                         <option>Weekly (Weekends)</option>
                         <option>Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Start Time (Off-peak)</label>
                      <input type="time" defaultValue="02:00" className="w-full bg-surface border border-white/5 rounded-xl p-4 text-white focus:ring-1 focus:ring-primary focus:border-primary"/>
                    </div>
                    <div className="pt-4 flex gap-3">
                       <button type="button" onClick={()=>setScheduleModal(false)} className="flex-1 px-4 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white transition-colors">Cancel</button>
                       <button type="submit" className="flex-1 px-4 py-4 bg-primary hover:bg-primary-fixed-dim rounded-xl font-black text-[#001a42] transition-colors shadow-[0_0_15px_rgba(173,198,255,0.3)]">Set Schedule</button>
                    </div>
                 </form>
              </div>
           </motion.div>
        )}

        {/* DPIA Wizard Modal */}
        {dpiaModal && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-surface-container border border-white/10 rounded-[2rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                 <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                   <div>
                     <h3 className="text-2xl font-headline font-black text-white flex items-center gap-3"><FileText className="text-tertiary"/> DPIA Generation Wizard</h3>
                     <p className="text-slate-400 text-sm mt-1">Data Protection Impact Assessment (Decree 13 Compliant)</p>
                   </div>
                   <div className="flex gap-2">
                     {[1,2,3].map(step => (
                       <div key={step} className={`w-3 h-3 rounded-full ${dpiaStep >= step ? 'bg-tertiary shadow-[0_0_10px_rgba(60,221,199,0.5)]' : 'bg-white/10'}`}></div>
                     ))}
                   </div>
                 </div>
                 
                 <div className="p-10 flex-1 overflow-y-auto">
                   {dpiaStep === 1 && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                       <h4 className="text-xl font-bold text-white mb-4">Step 1: Processing Activity Details</h4>
                       <div className="space-y-4">
                         <div>
                           <label className="text-sm font-bold text-slate-400 mb-2 block">Name of Processing Activity</label>
                           <input type="text" placeholder="e.g. User Analytics Tracking" className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white focus:border-tertiary" />
                         </div>
                         <div>
                           <label className="text-sm font-bold text-slate-400 mb-2 block">Categories of Personal Data</label>
                           <textarea rows={3} placeholder="Names, IP Addresses, Email..." className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white focus:border-tertiary" />
                         </div>
                       </div>
                     </div>
                   )}
                   {dpiaStep === 2 && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                       <h4 className="text-xl font-bold text-white mb-4">Step 2: Risk Assessment & Safeguards</h4>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="bg-surface p-6 rounded-2xl border border-white/5 cursor-pointer hover:border-tertiary">
                           <ShieldAlert className="text-amber-400 mb-3" size={32}/>
                           <p className="font-bold text-white">Identify High Risks</p>
                           <p className="text-xs text-slate-400 mt-1">Select known vulnerabilities and tracking exposures.</p>
                         </div>
                         <div className="bg-surface p-6 rounded-2xl border border-white/5 cursor-pointer hover:border-tertiary">
                           <CheckCircle className="text-tertiary mb-3" size={32}/>
                           <p className="font-bold text-white">Apply Safeguards</p>
                           <p className="text-xs text-slate-400 mt-1">Document encryption, anonymization techniques.</p>
                         </div>
                       </div>
                     </div>
                   )}
                   {dpiaStep === 3 && (
                     <div className="text-center py-10 animate-in fade-in slide-in-from-right-4 duration-500">
                       <FileText className="w-24 h-24 text-tertiary mx-auto mb-6" />
                       <h4 className="text-2xl font-bold text-white mb-2">Assessment Ready</h4>
                       <p className="text-slate-400 max-w-md mx-auto">Your DPIA has been compiled and is ready for Data Protection Officer (DPO) signature.</p>
                     </div>
                   )}
                 </div>

                 <div className="p-6 border-t border-white/5 bg-black/20 flex justify-between">
                   <button onClick={() => { setDpiaStep(1); setDpiaModal(false); }} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white">Cancel</button>
                   <div className="flex gap-3">
                     {dpiaStep > 1 && <button onClick={() => setDpiaStep(s => s - 1)} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white">Back</button>}
                     {dpiaStep < 3 ? (
                       <button onClick={() => setDpiaStep(s => s + 1)} className="px-8 py-3 bg-tertiary hover:bg-[#3cddc7]/80 rounded-xl font-black text-[#003731] shadow-[0_0_15px_rgba(60,221,199,0.3)]">Next Step</button>
                     ) : (
                       <button onClick={() => { setDpiaStep(1); setDpiaModal(false); }} className="px-8 py-3 bg-tertiary hover:bg-[#3cddc7]/80 rounded-xl font-black text-[#003731] shadow-[0_0_15px_rgba(60,221,199,0.3)]">Generate PDF</button>
                     )}
                   </div>
                 </div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Corporate Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI Score Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-surface-container to-surface-dim p-8 rounded-[2rem] border border-white/5 relative overflow-hidden flex flex-col justify-center group shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/20 rounded-full blur-[50px] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-4 relative z-10 flex items-center gap-2"><Activity size={18}/> Organizational Score</p>
            <div className="flex items-baseline gap-2 relative z-10 mb-2">
               <span className="text-7xl font-headline font-black text-white">78</span>
               <span className="text-2xl text-slate-500 font-bold">/ 100</span>
            </div>
            <div className="relative z-10 bg-primary/10 border border-primary/20 p-3 rounded-xl mt-4">
              <p className="text-sm font-bold text-primary flex items-center gap-2">▲ 4% Improvement</p>
              <p className="text-xs text-slate-400 mt-1">Since last comprehensive audit.</p>
            </div>
        </div>

        {/* DPIA Quick Access */}
        <div className="md:col-span-2 grid grid-cols-2 gap-6">
           <div onClick={() => setDpiaModal(true)} className="bg-surface-container/50 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 hover:bg-surface-container hover:border-tertiary/30 transition-all cursor-pointer group shadow-2xl flex flex-col justify-center relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-tertiary/10 rounded-tl-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <FileText className="text-tertiary mb-6 group-hover:scale-110 transition-transform" size={48} />
              <h4 className="font-headline font-black text-2xl text-white mb-2">DPIA Process Center</h4>
              <p className="text-sm text-slate-400 leading-relaxed relative z-10">Generate Data Protection Impact Assessment templates required for legal compliance and DPO review.</p>
           </div>
           
           <div className="bg-surface-container/50 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 hover:bg-surface-container hover:border-error/30 transition-all cursor-pointer group shadow-2xl flex flex-col justify-center relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-error/10 rounded-tl-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <BellRing className="text-error mb-6 group-hover:scale-110 transition-transform" size={48} />
              <h4 className="font-headline font-black text-2xl text-white mb-2">Alert Configuration</h4>
              <p className="text-sm text-slate-400 leading-relaxed relative z-10">Set webhook triggers for critical data compliance violations to be instantly sent to Slack/Teams.</p>
           </div>
        </div>
      </div>

      {/* Audit Evidence Logs (PB12) */}
      <div className="bg-surface-container/50 backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden mt-8">
         <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div>
              <h3 className="font-headline font-black text-2xl text-white flex items-center gap-3"><Fingerprint className="text-primary"/> Audit Evidence Ledger</h3>
              <p className="text-sm text-slate-400 mt-1 font-medium">Immutable log of systemic compliance events and scheduled scanning results.</p>
            </div>
            <button className="text-slate-400 hover:text-white bg-white/5 p-3 rounded-xl border border-white/10 transition-colors"><Settings2 size={20} /></button>
         </div>
         <div className="divide-y divide-white/5">
            {[
              { title: "Automated Weekly Scan (Marketing Subdomains)", desc: "Found 2 new unlisted third-party tracking scripts. Auto-alert dispatched to legal team.", date: "2026-04-14 02:00:15 UTC", type: "violation" },
              { title: "DPIA Generated: Marketing CRM Integration", desc: "User 'admin@business.local' generated and downloaded a DPIA report for CRM sync.", date: "2026-04-13 14:45:22 UTC", type: "log" },
              { title: "Policy Update Detected", desc: "Change detected in /privacy-policy. Hash signature updated in ledger.", date: "2026-04-10 09:12:05 UTC", type: "info" }
            ].map((log, i) => (
               <div key={i} className="p-8 flex items-start gap-6 hover:bg-white/[0.02] transition-colors group">
                  <div className={`p-4 rounded-2xl ${log.type === 'violation' ? 'bg-error-container text-error' : log.type === 'log' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'}`}>
                     {log.type === 'violation' ? <AlertOctagon size={24}/> : log.type === 'log' ? <BookOpen size={24}/> : <Database size={24}/>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-white">{log.title}</h4>
                      <p className="font-mono text-xs text-slate-500 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">{log.date}</p>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">{log.desc}</p>
                    {log.type === 'violation' && (
                      <span className="text-[10px] uppercase font-bold text-error bg-error-container inline-block px-3 py-1.5 rounded-lg tracking-widest border border-error/20">Action Required</span>
                    )}
                  </div>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
}
