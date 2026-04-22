"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Search, Edit2, Trash2, CheckCircle2, X, Loader2 } from "lucide-react";

export default function RuleManagement() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newRule, setNewRule] = useState({ description: "", law_ref: "", severity: "MEDIUM", category: "privacy" });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const data = await api.listLegalRules();
      setRules(data);
    } catch (error) {
      console.error("Failed to fetch rules", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.description || !newRule.law_ref) return;
    
    try {
      await api.createLegalRule(newRule);
      fetchRules();
      setIsAdding(false);
      setNewRule({ description: "", law_ref: "", severity: "MEDIUM", category: "privacy" });
    } catch (error) {
      alert("Failed to create rule");
    }
  };

  const deleteRule = async (id: string) => {
    if(!confirm("Are you sure you want to delete this rule?")) return;
    try {
      await api.deleteLegalRule(id);
      setRules(rules.filter(r => r.id !== id));
    } catch (error) {
      alert("Failed to delete rule");
    }
  };


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline font-black text-white mb-2">Legal Rule Management</h2>
          <p className="text-slate-400 font-medium">Manage compliance requirements applied to the scan engine.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-[#a388ee] hover:bg-[#b098ff] text-[#1c113a] px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(163,136,238,0.3)] active:scale-95"
        >
          <PlusCircle size={20} /> New Rule
        </button>
      </div>

      {/* Add Rule Flow - Interactive Card */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }} 
            animate={{ opacity: 1, height: 'auto', y: 0 }} 
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-surface-container/80 backdrop-blur-xl p-8 rounded-[2rem] border border-[#a388ee]/30 shadow-[0_20px_50px_rgba(163,136,238,0.1)] relative mt-4">
              <button onClick={() => setIsAdding(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-xl"><X size={20}/></button>
              <h3 className="text-2xl font-headline font-black mb-6 flex items-center gap-3 text-white"><PlusCircle className="text-[#a388ee]" size={28}/> Create New Legal Rule</h3>
              <form onSubmit={handleAddRule} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs text-slate-400 uppercase tracking-widest font-bold">Rule Description</label>
                  <input type="text" autoFocus value={newRule.description} onChange={e => setNewRule({...newRule, description: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-[#a388ee] focus:border-[#a388ee] transition-all" placeholder="e.g. Tracking Cookies Requires Consent" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs text-slate-400 uppercase tracking-widest font-bold">Referenced Article (NĐ13/Luật 91)</label>
                  <input type="text" value={newRule.law_ref} onChange={e => setNewRule({...newRule, law_ref: e.target.value})} className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white focus:ring-1 focus:ring-[#a388ee] focus:border-[#a388ee] transition-all" placeholder="e.g. NĐ13 - Article 9" />
                </div>
                <div className="md:col-span-2 pt-4">
                  <button type="submit" className="bg-[#a388ee] text-[#1c113a] font-black py-4 px-8 rounded-xl w-full hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(163,136,238,0.3)]">Save & Sync to Engine</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-surface-container/50 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex gap-4 bg-white/[0.02]">
          <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a388ee]" size={20} />
             <input type="text" placeholder="Search rules..." className="w-full bg-surface border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:ring-1 focus:ring-[#a388ee]" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead>
              <tr className="bg-white/[0.02] text-slate-400 text-[10px] uppercase tracking-widest border-b border-white/5">
                <th className="p-5 font-bold">ID Prefix</th>
                <th className="p-5 font-bold">Rule Context</th>
                <th className="p-5 font-bold">Article</th>
                <th className="p-5 font-bold">Severity</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500"><Loader2 className="animate-spin mx-auto mb-3" size={32} /> <span className="font-bold tracking-widest uppercase text-xs">Loading rules...</span></td>
                  </tr>
                ) : rules.map((rule) => (
                  <motion.tr 
                    key={rule.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-5 font-mono text-xs text-slate-500">{rule.id.substring(0, 8)}...</td>
                    <td className="p-5 font-bold text-white text-base">{rule.description}</td>
                    <td className="p-5 text-[#a388ee] font-medium">{rule.law_ref}</td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded border text-[10px] font-black uppercase tracking-widest ${rule.severity === 'HIGH' || rule.severity === 'CRITICAL' ? 'bg-error/10 border-error/20 text-error' : 'bg-amber-400/10 border-amber-400/20 text-amber-400'}`}>
                        {rule.severity}
                      </span>
                    </td>
                    <td className="p-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors mr-2"><Edit2 size={18}/></button>
                      <button onClick={() => deleteRule(rule.id)} className="p-2 hover:bg-error/10 rounded-lg text-slate-400 hover:text-error transition-colors"><Trash2 size={18}/></button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {rules.length === 0 && !loading && (
          <div className="p-16 text-center text-slate-500 font-bold flex flex-col items-center gap-4 bg-surface/30">
            <CheckCircle2 size={64} className="opacity-20 text-[#a388ee]"/>
            <span className="tracking-widest uppercase text-sm">No rules configured. Add one to begin.</span>
          </div>
        )}
      </div>

    </motion.div>
  );
}
