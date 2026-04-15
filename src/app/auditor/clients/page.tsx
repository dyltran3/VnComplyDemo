"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, FileText, PlusCircle, Search, AlertTriangle, CheckCircle, Download, BarChart2, TrendingUp } from "lucide-react";

const allClients = [
  { id: 1, name: "FinTech VN Corp", sector: "Finance", risk: "High", score: 45, violations: 12, lastScan: "2026-04-15", domains: ["fintechvn.com", "api.fintechvn.com"] },
  { id: 2, name: "HealthPlus Clinics", sector: "Healthcare", risk: "Medium", score: 72, violations: 5, lastScan: "2026-04-14", domains: ["healthplus.vn"] },
  { id: 3, name: "EduSpace Online", sector: "Education", risk: "Low", score: 91, violations: 1, lastScan: "2026-04-13", domains: ["eduspace.vn", "learn.eduspace.vn"] },
];

const violationDetails: Record<number, { title: string, article: string, path: string }[]> = {
  1: [
    { title: "No cookie consent banner", article: "Decree 13, Art. 11", path: "/home, /checkout" },
    { title: "Unencrypted form submission", article: "Decree 13, Art. 7", path: "/login" },
    { title: "Third-party trackers pre-consent", article: "Decree 13, Art. 11", path: "/all pages" },
  ],
  2: [
    { title: "Privacy policy not prominently linked", article: "Decree 13, Art. 12", path: "/signup" },
    { title: "Session cookie exceeds 30-day limit", article: "Decree 13, Art. 15", path: "/auth" },
  ],
  3: [
    { title: "Outdated SSL certificate warning", article: "Decree 13, Art. 7", path: "/subdomain" },
  ],
};

export default function ClientProfilesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof allClients[0] | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", sector: "" });

  const filtered = allClients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.sector.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-headline font-black text-[#0f172a] mb-1">Client Profiles</h2>
          <p className="text-slate-500">Full registry of all organizations under your compliance mandate.</p>
        </div>
        <button onClick={() => setAddModal(true)}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 text-sm transition-all active:scale-95 shadow-lg shadow-blue-600/20">
          <PlusCircle size={16} /> Add Client
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
          className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] text-slate-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Client List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(client => (
            <motion.button key={client.id} onClick={() => setSelected(client)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`w-full text-left bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all ${selected?.id === client.id ? "border-[#2563eb] ring-2 ring-[#2563eb]/10" : "border-slate-200"}`}>
              <div className="flex justify-between items-start">
                <p className="font-black text-slate-800">{client.name}</p>
                <span className={`font-black text-lg ${client.score > 80 ? "text-emerald-600" : client.score > 60 ? "text-amber-600" : "text-red-600"}`}>{client.score}</span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{client.sector}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full border ${client.risk === "High" ? "text-red-500 border-red-200 bg-red-50" : client.risk === "Medium" ? "text-amber-500 border-amber-200 bg-amber-50" : "text-emerald-600 border-emerald-200 bg-emerald-50"}`}>
                  {client.risk} Risk
                </span>
                <span className="text-xs text-slate-400 ml-auto">{client.violations} violations</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">{selected.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">Last scanned: {selected.lastScan} · {selected.domains.join(", ")}</p>
                  </div>
                  <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md">
                    <Download size={14} /> Export Report
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4 text-center border">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Score</p>
                    <p className={`text-4xl font-black mt-1 ${selected.score > 80 ? "text-emerald-600" : selected.score > 60 ? "text-amber-500" : "text-red-500"}`}>{selected.score}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center border">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Violations</p>
                    <p className="text-4xl font-black mt-1 text-slate-800">{selected.violations}</p>
                  </div>
                </div>

                {/* Violations Breakdown */}
                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-500" /> Findings Breakdown
                </h4>
                <div className="space-y-3">
                  {(violationDetails[selected.id] || []).map((v, i) => (
                    <div key={i} className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-slate-800 text-sm">{v.title}</p>
                        <span className="text-xs font-black text-red-600 bg-red-100 px-2 py-0.5 rounded">{v.article}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Found on: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{v.path}</code></p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-80 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                <Users size={48} className="opacity-20 mb-3" />
                <p className="font-bold">Select a client to view their profile</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {addModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-black mb-6 text-slate-800">Add New Client</h3>
              <form onSubmit={(e) => { e.preventDefault(); setAddModal(false); }} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Company Name</label>
                  <input required value={newClient.name} onChange={e => setNewClient(n => ({ ...n, name: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Industry Sector</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500">
                    <option>Finance</option><option>Healthcare</option><option>Education</option><option>E-Commerce</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setAddModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-[#2563eb] text-white rounded-xl font-black hover:bg-[#1d4ed8] transition-all active:scale-95">Add Client</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
