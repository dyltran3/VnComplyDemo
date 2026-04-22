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
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline font-black text-white mb-2">Client Profiles</h2>
          <p className="text-slate-400 font-medium">Full registry of all organizations under your compliance mandate.</p>
        </div>
        <button onClick={() => setAddModal(true)}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          <PlusCircle size={20} /> Add Client
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2563eb]" size={20} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
          className="w-full pl-14 pr-5 py-4 bg-surface-container/80 backdrop-blur-md border border-white/5 rounded-2xl text-white placeholder-slate-500 shadow-xl focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb] transition-all" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Client List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(client => (
            <motion.button key={client.id} onClick={() => setSelected(client)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`w-full text-left bg-surface-container/50 backdrop-blur-md rounded-2xl border p-5 shadow-lg transition-all ${selected?.id === client.id ? "border-[#2563eb] bg-surface shadow-[0_0_15px_rgba(37,99,235,0.15)]" : "border-white/5 hover:bg-surface-container"}`}>
              <div className="flex justify-between items-start">
                <p className="font-black text-white">{client.name}</p>
                <span className={`font-black text-lg ${client.score > 80 ? "text-[#3cddc7]" : client.score > 60 ? "text-amber-400" : "text-error"}`}>{client.score}</span>
              </div>
              <p className="text-sm text-slate-400 mt-1 font-medium">{client.sector}</p>
              <div className="flex items-center gap-2 mt-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${client.risk === "High" ? "text-error border-error/20 bg-error/10" : client.risk === "Medium" ? "text-amber-400 border-amber-400/20 bg-amber-400/10" : "text-[#3cddc7] border-[#3cddc7]/20 bg-[#3cddc7]/10"}`}>
                  {client.risk} Risk
                </span>
                <span className="text-xs text-slate-500 font-bold ml-auto">{client.violations} violations</span>
              </div>
            </motion.button>
          ))}
          {filtered.length === 0 && !loading && (
             <div className="text-center p-8 bg-surface-container/30 border border-white/5 rounded-2xl">
                <p className="text-slate-500 font-medium">No clients found.</p>
             </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="bg-surface-container/50 backdrop-blur-xl rounded-[2rem] border border-white/5 shadow-2xl p-8 sticky top-4">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-headline font-black text-white mb-2">{selected.name}</h3>
                    <p className="text-slate-400 text-sm font-medium">Last scanned: <span className="text-white">{selected.lastScan}</span> · {selected.domains.join(", ")}</p>
                  </div>
                  <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                    <Download size={16} /> Export Report
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-surface rounded-2xl p-6 text-center border border-white/5 relative overflow-hidden">
                    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] pointer-events-none ${selected.score > 80 ? "bg-[#3cddc7]/20" : selected.score > 60 ? "bg-amber-400/20" : "bg-error/20"}`}></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10">Score</p>
                    <p className={`text-5xl font-headline font-black mt-2 relative z-10 ${selected.score > 80 ? "text-[#3cddc7]" : selected.score > 60 ? "text-amber-400" : "text-error"}`}>{selected.score}%</p>
                  </div>
                  <div className="bg-surface rounded-2xl p-6 text-center border border-white/5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Violations</p>
                    <p className="text-5xl font-headline font-black mt-2 text-white">{selected.violations}</p>
                  </div>
                </div>

                {/* Radar Analysis */}
                <div className="mb-10 bg-surface rounded-2xl p-8 border border-white/5 flex items-center justify-between">
                   <div className="max-w-[200px]">
                      <h4 className="font-headline font-bold text-white text-xl mb-2">Risk Radar</h4>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium">Multi-point analysis of organizational data posture across 5 key legal pillars.</p>
                   </div>
                   <div className="scale-90 -my-8 -mx-10 flex-1">
                      <RadarChart data={radarData} color={selected.score > 80 ? "#3cddc7" : selected.score > 60 ? "#fbbf24" : "#ffb4ab"} />
                   </div>
                </div>

                {/* Violations Breakdown */}
                <h4 className="font-headline font-bold text-white text-xl mb-4 flex items-center gap-3">
                  <AlertTriangle size={20} className="text-amber-400" /> Key Findings Breakdown
                </h4>
                <div className="space-y-4">
                  {selected.violations > 0 ? (
                    <>
                      <div className="p-5 bg-error/10 border border-error/20 rounded-2xl">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-white text-base">Cookie consent banner missing</p>
                          <span className="text-[10px] font-black text-error bg-error/20 border border-error/30 px-2 py-1 rounded tracking-widest uppercase">Art. 11, NĐ13</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1 font-medium">Found on: <code className="bg-white/5 border border-white/10 px-2 py-1 rounded text-white">{selected.name}/home</code></p>
                      </div>
                      <div className="p-5 bg-amber-400/10 border border-amber-400/20 rounded-2xl">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-white text-base">Pre-consent tracking detected</p>
                          <span className="text-[10px] font-black text-amber-400 bg-amber-400/20 border border-amber-400/30 px-2 py-1 rounded tracking-widest uppercase">Art. 9, NĐ13</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1 font-medium">Found on: <code className="bg-white/5 border border-white/10 px-2 py-1 rounded text-white">{selected.name}/checkout</code></p>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center text-slate-500 bg-surface rounded-2xl border border-dashed border-white/10 uppercase text-xs font-bold tracking-widest">
                       No critical violations found in latest scan
                    </div>
                  )}
                </div>

              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-[600px] border-2 border-dashed border-white/10 rounded-[2rem] bg-surface-container/20 flex flex-col items-center justify-center text-slate-500">
                <Users size={64} className="opacity-20 mb-4" />
                <p className="font-bold text-lg">Select a client to view their profile</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {addModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-surface-container rounded-[2rem] p-10 w-full max-w-md shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563eb]/20 rounded-full blur-[50px] pointer-events-none"></div>
              <h3 className="text-2xl font-headline font-black mb-8 text-white relative z-10">Add New Client</h3>
              <form onSubmit={(e) => { e.preventDefault(); setAddModal(false); }} className="space-y-6 relative z-10">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Company Name</label>
                  <input required value={newClient.name} onChange={e => setNewClient(n => ({ ...n, name: e.target.value }))}
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Industry Sector</label>
                  <select className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#2563eb]">
                    <option>Finance</option><option>Healthcare</option><option>Education</option><option>E-Commerce</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setAddModal(false)} className="flex-1 py-4 border border-white/10 rounded-xl font-bold text-slate-300 hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-[#2563eb] text-white rounded-xl font-black hover:bg-[#1d4ed8] transition-all active:scale-95 shadow-[0_0_15px_rgba(37,99,235,0.3)]">Add Client</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
