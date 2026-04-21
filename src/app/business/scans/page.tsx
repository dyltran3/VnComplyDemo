"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Play, Pause, Check, Plus, Trash2, Clock, Globe, X, Loader2 } from "lucide-react";

export default function AutoScansPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", freq: "Daily", time: "02:00" });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await api.listSchedules();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch schedules", err);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id: number) => {
    // Mock toggle for demo
    setJobs(j => j.map(jj => jj.id === id ? { ...jj, active: !jj.active } : jj));
  };

  const remove = (id: string) => {
    // Mock remove for demo
    setJobs(j => j.filter(jj => jj.id !== id));
  };

  const addJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSchedule({
        target_url: form.url,
        frequency: form.freq,
      });
      fetchSchedules();
      setShowForm(false);
      setForm({ name: "", url: "", freq: "Daily", time: "02:00" });
    } catch (err) {
      alert("Failed to create schedule");
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline font-black mb-2">Automated Scan Jobs</h2>
          <p className="text-slate-400">Schedule recurring compliance crawls to run off-peak. Violations trigger instant alerts.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95">
          <Plus size={18} /> New Scan Job
        </button>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Jobs", val: jobs.length, color: "text-[#2dd4bf]" },
          { label: "Active", val: jobs.filter(j => j.active).length, color: "text-emerald-400" },
          { label: "Paused", val: jobs.filter(j => !j.active).length, color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#1e293b]/50 border border-white/5 rounded-2xl p-5 text-center">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{s.label}</p>
            <p className={`text-4xl font-black mt-1 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {jobs.map(job => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
              className={`bg-[#1e293b]/50 border rounded-2xl p-6 flex items-center gap-5 transition-all ${job.active ? "border-[#2dd4bf]/20" : "border-white/5 opacity-60"}`}>
              <div className={`p-3 rounded-xl ${job.active ? "bg-[#2dd4bf]/10" : "bg-slate-700/30"}`}>
                <Calendar size={24} className={job.active ? "text-[#2dd4bf]" : "text-slate-500"} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">{job.name}</h4>
                <div className="flex gap-3 mt-1 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Globe size={12} /> {job.url}</span>
                  <span className="text-slate-600">·</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {job.freq} at {job.time}</span>
                  <span className="text-slate-600">·</span>
                  <span>Last: {job.lastRun}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggle(job.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${job.active ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" : "bg-[#2dd4bf]/10 text-[#2dd4bf] hover:bg-[#2dd4bf]/20"}`}>
                  {job.active ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Resume</>}
                </button>
                <button onClick={() => remove(job.id)} className="p-2 text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {jobs.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <Calendar size={48} className="mx-auto mb-3 opacity-20" />
            <p className="font-bold">No scan jobs configured yet.</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-[#1e293b] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><Calendar className="text-[#2dd4bf]" size={20} /> New Scan Job</h3>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={addJob} className="space-y-4">
                {[
                  { label: "Job Name", key: "name", type: "text", placeholder: "Marketing Site Weekly" },
                  { label: "Target URL", key: "url", type: "text", placeholder: "marketing.company.vn" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{label}</label>
                    <input required type={type} value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#2dd4bf]" />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Frequency</label>
                    <select value={form.freq} onChange={e => setForm(f => ({ ...f, freq: e.target.value }))}
                      className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#2dd4bf]">
                      <option>Daily</option><option>Weekly</option><option>Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Start Time</label>
                    <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                      className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#2dd4bf]" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-[#0d9488] hover:bg-[#0f766e] rounded-xl font-black flex items-center justify-center gap-2">
                    <Check size={16} /> Schedule Job
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
