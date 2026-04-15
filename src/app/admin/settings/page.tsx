"use client";
import { motion } from "framer-motion";
import { Settings, Database, Bell, Globe, Save } from "lucide-react";
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-3xl font-headline font-bold mb-1">Core Settings</h2>
        <p className="text-slate-400">Global configuration for the VnComply scanning infrastructure.</p>
      </div>

      <form onSubmit={save} className="space-y-6">
        {/* Scanner Config */}
        <div className="bg-[#0b1326] border border-white/5 rounded-2xl p-6 space-y-5">
          <h3 className="font-bold flex items-center gap-2"><Globe size={16} className="text-[#adc6ff]" /> Scanner Configuration</h3>
          {[
            { label: "Crawl Depth", key: "scanDepth", help: "Max URL depth to follow from homepage", suffix: "levels" },
            { label: "Scan Timeout", key: "timeout", help: "Max seconds before a job is declared failed", suffix: "seconds" },
            { label: "Rate Limit", key: "rateLimit", help: "Max requests per second per scan job", suffix: "req/s" },
          ].map(({ label, key, help, suffix }) => (
            <div key={key}>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{label}</label>
              <div className="flex items-center gap-3">
                <input type="number" value={(settings as any)[key]}
                  onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                  className="bg-[#171f33] border border-white/10 rounded-xl px-4 py-3 text-white w-32 focus:ring-1 focus:ring-[#adc6ff]" />
                <span className="text-slate-500 text-sm">{suffix} — {help}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="bg-[#0b1326] border border-white/5 rounded-2xl p-6 space-y-5">
          <h3 className="font-bold flex items-center gap-2"><Bell size={16} className="text-[#a388ee]" /> Alert & Notifications</h3>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Alert Recipient Email</label>
            <input type="email" value={settings.alertEmail}
              onChange={e => setSettings(s => ({ ...s, alertEmail: e.target.value }))}
              className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#a388ee]" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Enable Email Notifications</p>
              <p className="text-slate-500 text-sm">Send violation alerts to the above email</p>
            </div>
            <button type="button" onClick={() => setSettings(s => ({ ...s, notifications: !s.notifications }))}
              className={`w-14 h-8 rounded-full transition-all relative ${settings.notifications ? "bg-[#a388ee]" : "bg-slate-700"}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${settings.notifications ? "left-7" : "left-1"}`} />
            </button>
          </div>
        </div>

        <button type="submit"
          className="w-full bg-[#adc6ff] hover:brightness-110 text-[#001a42] font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
          {saved ? <><motion.span animate={{ scale: [1, 1.2, 1] }}><Save size={18} /></motion.span> Settings Saved!</> : <><Save size={18} /> Save Configuration</>}
        </button>
      </form>
    </motion.div>
  );
}
