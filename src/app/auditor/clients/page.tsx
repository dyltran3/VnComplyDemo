"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Users, FileText, PlusCircle, Search, AlertTriangle, CheckCircle, Download, BarChart2, TrendingUp, Loader2 } from "lucide-react";
import RadarChart from "@/components/charts/RadarChart";

export default function ClientProfilesPage() {
  const [allClients, setAllClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", sector: "" });

  const radarData = [
    { axis: "Privacy", value: 80 },
    { axis: "Security", value: 65 },
    { axis: "Consent", value: 45 },
    { axis: "Data Flow", value: 70 },
    { axis: "Retention", value: 90 },
  ];


  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const scans = await api.listScans();
      // Group scans by domain
      const grouped: Record<string, any> = {};
      scans.forEach((s: any) => {
        const domain = new URL(s.target_url).hostname;
        if (!grouped[domain]) {
          grouped[domain] = {
            id: domain,
            name: domain,
            sector: "Enterprise",
            risk: "Low",
            score: s.score || 0,
            violations: s.findings_count || 0,
            lastScan: s.created_at,
            domains: [domain]
          };
        }
      });
      setAllClients(Object.values(grouped));
    } catch (err) {
      console.error("Failed to fetch auditor portfolio", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = allClients.filter(c =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (c.sector || "").toLowerCase().includes(search.toLowerCase())
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

                {/* Radar Analysis */}
                <div className="mb-10 bg-slate-50/50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                   <div className="max-w-[150px]">
                      <h4 className="font-bold text-slate-800 text-lg mb-1">Risk Radar</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Multi-point analysis of organizational data posture across 5 key legal pillars.</p>
                   </div>
                   <div className="scale-75 -my-8 -mx-10 flex-1">
                      <RadarChart data={radarData} color={selected.score > 80 ? "#10b981" : selected.score > 60 ? "#f59e0b" : "#ef4444"} />
                   </div>
                </div>


                {/* Violations Breakdown */}
                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-500" /> Key Findings Breakdown
                </h4>
                <div className="space-y-3">
                  {selected.violations > 0 ? (
                    <>
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-slate-800 text-sm">Cookie consent banner missing</p>
                          <span className="text-xs font-black text-red-600 bg-red-100 px-2 py-0.5 rounded">Art. 11, NĐ13</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Found on: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{selected.name}/home</code></p>
                      </div>
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-slate-800 text-sm">Pre-consent tracking detected</p>
                          <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded">Art. 9, NĐ13</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Found on: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{selected.name}/checkout</code></p>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 uppercase text-xs font-bold tracking-widest">
                       No critical violations found in latest scan
                    </div>
                  )}
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
