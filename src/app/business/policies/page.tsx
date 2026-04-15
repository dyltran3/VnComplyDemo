"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Globe, Save, CheckCircle, ToggleRight, ToggleLeft, Plus, Trash2, X } from "lucide-react";

export default function PoliciesPage() {
  const [saved, setSaved] = useState(false);
  const [webhooks, setWebhooks] = useState([
    { id: 1, name: "Slack – #compliance-alerts", url: "https://hooks.slack.com/...", active: true },
    { id: 2, name: "Teams – Legal Channel", url: "https://hooks.teams.microsoft.com/...", active: false },
  ]);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ name: "", url: "" });
  const [thresholds, setThresholds] = useState({ violationAlert: true, scoreBelow: "70", dailyReport: false });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setWebhooks(w => [...w, { id: Date.now(), name: newWebhook.name, url: newWebhook.url, active: true }]);
    setShowWebhookForm(false);
    setNewWebhook({ name: "", url: "" });
  };

  const toggleWebhook = (id: number) => setWebhooks(w => w.map(wh => wh.id === id ? { ...wh, active: !wh.active } : wh));
  const removeWebhook = (id: number) => setWebhooks(w => w.filter(wh => wh.id !== id));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-black mb-2">Corporate Policies</h2>
        <p className="text-slate-400">Configure organizational compliance rules, alert thresholds, and integration webhooks.</p>
      </div>

      <form onSubmit={save} className="space-y-6">
        {/* Alert Thresholds */}
        <div className="bg-[#1e293b]/50 border border-white/5 rounded-2xl p-6 space-y-5">
          <h3 className="font-bold text-lg flex items-center gap-2"><Bell size={18} className="text-[#f97316]" /> Alert Thresholds</h3>

          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <p className="font-semibold">Alert on new violations</p>
              <p className="text-slate-400 text-sm">Trigger immediately when a new violation is detected</p>
            </div>
            <button type="button" onClick={() => setThresholds(t => ({ ...t, violationAlert: !t.violationAlert }))}
              className="transition-all">
              {thresholds.violationAlert
                ? <ToggleRight size={36} className="text-[#0d9488]" />
                : <ToggleLeft size={36} className="text-slate-600" />}
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <p className="font-semibold">Alert if score drops below</p>
              <p className="text-slate-400 text-sm">Send urgent alert when compliance score falls below threshold</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={100} value={thresholds.scoreBelow}
                onChange={e => setThresholds(t => ({ ...t, scoreBelow: e.target.value }))}
                className="w-20 bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2 text-white text-center font-bold focus:ring-1 focus:ring-[#2dd4bf]" />
              <span className="text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold">Daily compliance digest</p>
              <p className="text-slate-400 text-sm">Send a daily summary email to all registered stakeholders</p>
            </div>
            <button type="button" onClick={() => setThresholds(t => ({ ...t, dailyReport: !t.dailyReport }))}
              className="transition-all">
              {thresholds.dailyReport
                ? <ToggleRight size={36} className="text-[#0d9488]" />
                : <ToggleLeft size={36} className="text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Webhooks */}
        <div className="bg-[#1e293b]/50 border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2"><Globe size={18} className="text-[#2dd4bf]" /> Webhook Integrations</h3>
            <button type="button" onClick={() => setShowWebhookForm(true)}
              className="text-sm bg-[#2dd4bf]/10 text-[#2dd4bf] px-3 py-2 rounded-lg font-bold hover:bg-[#2dd4bf]/20 flex items-center gap-1.5 transition-all">
              <Plus size={14} /> Add Webhook
            </button>
          </div>

          {showWebhookForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
              <form onSubmit={addWebhook} className="bg-[#0f172a] rounded-xl p-5 space-y-3 border border-white/10">
                <input required value={newWebhook.name} onChange={e => setNewWebhook(n => ({ ...n, name: e.target.value }))}
                  placeholder="Integration name (e.g. Slack – #compliance)"
                  className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#2dd4bf]" />
                <input required value={newWebhook.url} onChange={e => setNewWebhook(n => ({ ...n, url: e.target.value }))}
                  placeholder="Webhook URL (https://...)"
                  className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-[#2dd4bf]" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowWebhookForm(false)} className="flex-1 py-2 bg-white/5 rounded-lg font-bold text-sm">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-[#0d9488] rounded-lg font-bold text-sm text-white flex items-center justify-center gap-1.5"><CheckCircle size={14} /> Save</button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="space-y-3">
            {webhooks.map(wh => (
              <div key={wh.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${wh.active ? "bg-[#0f172a] border-[#2dd4bf]/20" : "bg-[#0f172a]/40 border-white/5 opacity-60"}`}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${wh.active ? "bg-[#2dd4bf] animate-pulse" : "bg-slate-600"}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{wh.name}</p>
                  <p className="text-slate-500 text-xs truncate">{wh.url}</p>
                </div>
                <button type="button" onClick={() => toggleWebhook(wh.id)}>
                  {wh.active ? <ToggleRight size={28} className="text-[#2dd4bf]" /> : <ToggleLeft size={28} className="text-slate-600" />}
                </button>
                <button type="button" onClick={() => removeWebhook(wh.id)} className="text-slate-600 hover:text-red-400 transition-colors"><X size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit"
          className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95">
          {saved ? <><CheckCircle size={18} /> Policies Saved!</> : <><Save size={18} /> Save All Policies</>}
        </button>
      </form>
    </div>
  );
}
