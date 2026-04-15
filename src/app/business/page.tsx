"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, FileText, BellRing, Settings2, Plus } from "lucide-react";

export default function BusinessDashboard() {
  const [scheduleModal, setScheduleModal] = useState(false);
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-headline font-black mb-2">Corporate Compliance Hub</h2>
          <p className="text-slate-400">View your organizational compliance limits, scheduled scans, and generate reports.</p>
        </div>
        <button 
          onClick={() => setScheduleModal(true)}
          className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} /> Schedule Auto-Scan
        </button>
      </div>

      {scheduleModal && (
         <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1e293b] p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/10">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Clock className="text-[#2dd4bf]"/> Configure Scanning Schedule</h3>
               <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setScheduleModal(false); }}>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Frequency</label>
                    <select className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-[#2dd4bf] focus:border-[#2dd4bf]">
                       <option>Daily</option>
                       <option>Weekly (Weekends)</option>
                       <option>Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Start Time (Off-peak)</label>
                    <input type="time" defaultValue="02:00" className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-[#2dd4bf] focus:border-[#2dd4bf]"/>
                  </div>
                  <div className="pt-4 flex gap-3">
                     <button type="button" onClick={()=>setScheduleModal(false)} className="flex-1 px-4 py-3 bg-[#0f172a] hover:bg-slate-800 rounded-lg font-bold">Cancel</button>
                     <button type="submit" className="flex-1 px-4 py-3 bg-[#0d9488] hover:bg-[#0f766e] rounded-lg font-bold">Set Schedule</button>
                  </div>
               </form>
            </div>
         </motion.div>
      )}

      {/* Corporate Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI Score Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-[#134e4a] to-[#0f172a] p-8 rounded-2xl border border-[#0d9488]/30 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#2dd4bf]/20 rounded-full blur-[50px] pointer-events-none"></div>
            <p className="text-slate-300 font-bold uppercase tracking-widest text-sm mb-4 relative z-10">Organizational Score</p>
            <div className="flex items-baseline gap-2 relative z-10">
               <span className="text-6xl font-black text-[#f97316]">78</span>
               <span className="text-xl text-[#fdba74] font-bold">/ 100</span>
            </div>
            <p className="text-sm mt-4 text-slate-400 relative z-10"><span className="text-[#2dd4bf]">▲ 4%</span> since last audit</p>
        </div>

        {/* DPIA Quick Access */}
        <div className="md:col-span-2 grid grid-cols-2 gap-6">
           <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-white/5 hover:bg-[#1e293b] transition-colors cursor-pointer group">
              <FileText className="text-[#2dd4bf] mb-4 group-hover:scale-110 transition-transform" size={40} />
              <h4 className="font-bold text-lg mb-1">DPIA Process Center</h4>
              <p className="text-sm text-slate-400">Generate Data Protection Impact Assessment templates for legal review.</p>
           </div>
           <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-white/5 hover:bg-[#1e293b] transition-colors cursor-pointer group">
              <BellRing className="text-[#f97316] mb-4 group-hover:scale-110 transition-transform" size={40} />
              <h4 className="font-bold text-lg mb-1">Alert Configuration</h4>
              <p className="text-sm text-slate-400">Set webhook triggers for critical compliance violations sent to Slack/Teams.</p>
           </div>
        </div>
      </div>

      <div className="bg-[#1e293b]/50 rounded-2xl border border-white/5 overflow-hidden">
         <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2"><Activity size={18} className="text-[#2dd4bf]"/> Latest Analysis & Audit Log</h3>
            <button className="text-slate-400 hover:text-white"><Settings2 size={18} /></button>
         </div>
         <div className="divide-y divide-white/5">
            {[1, 2, 3].map(i => (
               <div key={i} className="p-6 flex items-center justify-between hover:bg-[#1e293b]/80 transition-colors">
                  <div>
                    <h4 className="font-bold">Automated Weekly Scan (Marketing Subdomains)</h4>
                    <p className="text-sm text-slate-400 mt-1">Found 2 new unlisted third-party tracking scripts. Auto-alert sent.</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono text-sm">2026-04-14 02:00 AM</p>
                    <p className="text-xs uppercase font-bold text-[#f97316] mt-1 bg-[#c2410c]/20 inline-block px-2 py-0.5 rounded">Violation Triggered</p>
                  </div>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
}
