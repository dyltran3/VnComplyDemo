"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Search, Edit2, Trash2, CheckCircle2, X } from "lucide-react";

export default function RuleManagement() {
  const [rules, setRules] = useState([
    { id: "SA-02", name: "Data Localization (NĐ 13)", status: "active", article: "Article 26" },
    { id: "SA-03", name: "Consent Collection requirement", status: "active", article: "Article 11" },
    { id: "SA-04", name: "DPIA Submission", status: "inactive", article: "Article 24" }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newRule, setNewRule] = useState({ name: "", article: "" });

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name || !newRule.article) return;
    
    setRules([{ id: `SA-0${Math.floor(Math.random()*100)}`, name: newRule.name, article: newRule.article, status: 'active' }, ...rules]);
    setIsAdding(false);
    setNewRule({ name: "", article: "" });
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  }

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
                  <label className="text-xs text-slate-400 uppercase tracking-widest font-bold">Rule Name / Description</label>
                  <input type="text" autoFocus value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} className="w-full bg-[#0b1326] border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all font-body" placeholder="e.g. Tracking Cookies Requires Consent" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 uppercase tracking-widest font-bold">Referenced Article</label>
                  <input type="text" value={newRule.article} onChange={e => setNewRule({...newRule, article: e.target.value})} className="w-full bg-[#0b1326] border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all font-body" placeholder="e.g. Decree 13 - Art. 9" />
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
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Rule Context</th>
              <th className="p-4 font-semibold">Article</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
              {rules.map((rule) => (
                <motion.tr 
                  key={rule.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-4 font-mono text-sm text-slate-400">{rule.id}</td>
                  <td className="p-4 font-semibold">{rule.name}</td>
                  <td className="p-4 text-purple-300">{rule.article}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${rule.status === 'active' ? 'bg-[#3cddc7]/10 text-[#3cddc7]' : 'bg-slate-800 text-slate-400'}`}>
                      {rule.status === 'active' && <CheckCircle2 size={12}/>} {rule.status}
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
