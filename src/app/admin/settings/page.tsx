"use client";
import { motion } from "framer-motion";
import { Bell, Globe, Save } from "lucide-react";
import { useState } from "react";

export default function CoreSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    scanDepth: "3",
    timeout: "30",
    rateLimit: "100",
    alertEmail: "admin@vncomply.vn",
    notifications: true,
    debugMode: false,
  });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl pb-20">
      <div>
        <h2 className="text-3xl font-headline font-black text-white mb-2">Core Settings</h2>
        <p className="text-slate-400 font-medium">Global configuration for the VnComply scanning infrastructure.</p>
      </div>

      <form onSubmit={save} className="space-y-8">
        {/* Scanner Config */}
        <div className="bg-surface-container/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#adc6ff]/5 rounded-full blur-[60px] pointer-events-none"></div>
          <h3 className="font-headline font-black text-xl text-white flex items-center gap-3 relative z-10"><Globe size={24} className="text-[#adc6ff]" /> Scanner Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 mt-4">
            {[
              { label: "Crawl Depth", key: "scanDepth", help: "Max URL depth to follow from homepage", suffix: "levels" },
              { label: "Scan Timeout", key: "timeout", help: "Max seconds before a job is declared failed", suffix: "seconds" },
              { label: "Rate Limit", key: "rateLimit", help: "Max requests per second per scan job", suffix: "req/s" },
            ].map(({ label, key, help, suffix }) => (
              <div key={key}>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">{label}</label>
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <input type="number" value={(settings as any)[key]}
                      onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                      className="bg-surface border border-white/10 rounded-xl px-5 py-4 text-white w-full md:w-48 focus:ring-1 focus:ring-[#adc6ff] transition-all font-bold text-lg" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm pointer-events-none hidden md:block">{suffix}</span>
                  </div>
                  <span className="text-slate-500 text-xs font-medium">{help}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface-container/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#a388ee]/5 rounded-full blur-[60px] pointer-events-none"></div>
          <h3 className="font-headline font-black text-xl text-white flex items-center gap-3 relative z-10"><Bell size={24} className="text-[#a388ee]" /> Alert & Notifications</h3>
          
          <div className="relative z-10 space-y-8 mt-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Alert Recipient Email</label>
              <input type="email" value={settings.alertEmail}
                onChange={e => setSettings(s => ({ ...s, alertEmail: e.target.value }))}
                className="w-full bg-surface border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-1 focus:ring-[#a388ee] transition-all font-bold" />
            </div>
            
            <div className="flex items-center justify-between p-5 bg-white/[0.02] rounded-xl border border-white/5">
              <div>
                <p className="font-bold text-white text-lg">Enable Email Notifications</p>
                <p className="text-slate-500 text-sm mt-1 font-medium">Send violation alerts to the configured email immediately.</p>
              </div>
              <button type="button" onClick={() => setSettings(s => ({ ...s, notifications: !s.notifications }))}
                className={`w-16 h-8 rounded-full transition-all relative shadow-inner ${settings.notifications ? "bg-[#a388ee] shadow-[0_0_15px_rgba(163,136,238,0.4)]" : "bg-surface border border-white/10"}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${settings.notifications ? "left-9" : "left-1"}`} />
              </button>
            </div>
          </div>
        </div>

        <button type="submit"
          className="w-full bg-white hover:bg-slate-200 text-[#001a42] font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          {saved ? <><motion.span animate={{ scale: [1, 1.2, 1] }}><Save size={24} /></motion.span> Settings Saved!</> : <><Save size={24} /> Save Global Configuration</>}
        </button>
      </form>
    </motion.div>
  );
}
