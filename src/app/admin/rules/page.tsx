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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline font-bold mb-1">Legal Rule Management</h2>
          <p className="text-slate-400 font-body">Manage compliance requirements applied to the scan engine.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
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
            <div className="bg-[#171f33]/80 backdrop-blur p-6 rounded-2xl border border-purple-500/30 shadow-2xl relative">
              <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><PlusCircle className="text-purple-400" size={24}/> Create New Legal Rule</h3>
              <form onSubmit={handleAddRule} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 uppercase tracking-widest font-bold">Rule Description</label>
                  <input type="text" autoFocus value={newRule.description} onChange={e => setNewRule({...newRule, description: e.target.value})} className="w-full bg-[#0b1326] border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all font-body" placeholder="e.g. Tracking Cookies Requires Consent" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 uppercase tracking-widest font-bold">Referenced Article (NĐ13/Luật 91)</label>
                  <input type="text" value={newRule.law_ref} onChange={e => setNewRule({...newRule, law_ref: e.target.value})} className="w-full bg-[#0b1326] border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all font-body" placeholder="e.g. NĐ13 - Article 9" />
                </div>
                <div className="md:col-span-2 pt-2">
                  <button type="submit" className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg w-full md:w-auto hover:brightness-110 active:scale-95 transition-all">Save & Sync to Engine</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#0b1326] rounded-xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 flex gap-4 bg-white/[0.02]">
          <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
             <input type="text" placeholder="Search rules..." className="w-full bg-transparent border-none pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:ring-0" />
          </div>
        </div>
        <table className="w-full text-left font-body">
          <thead>
            <tr className="bg-white/[0.02] text-slate-400 text-xs uppercase tracking-widest">
              <th className="p-4 font-semibold">ID Prefix</th>
              <th className="p-4 font-semibold">Rule Context</th>
              <th className="p-4 font-semibold">Article</th>
              <th className="p-4 font-semibold">Severity</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500"><Loader2 className="animate-spin mx-auto mb-2" /> Loading rules...</td>
                </tr>
              ) : rules.map((rule) => (
                <motion.tr 
                  key={rule.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-4 font-mono text-xs text-slate-400">{rule.id.substring(0, 8)}...</td>
                  <td className="p-4 font-semibold">{rule.description}</td>
                  <td className="p-4 text-purple-300">{rule.law_ref}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${rule.severity === 'HIGH' || rule.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {rule.severity}
                    </span>
                  </td>
                  <td className="p-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:text-[#adc6ff] text-slate-400 transition-colors"><Edit2 size={18}/></button>
                    <button onClick={() => deleteRule(rule.id)} className="p-2 hover:text-red-400 text-slate-400 transition-colors"><Trash2 size={18}/></button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {rules.length === 0 && (
          <div className="p-12 text-center text-slate-500 font-bold flex flex-col items-center gap-2">
            <CheckCircle2 size={48} className="opacity-20 mb-2"/>
            No rules configured. Add one to begin.
          </div>
        )}
      </div>

    </motion.div>
  );
}
