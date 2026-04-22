"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Shield, PlusCircle, Trash2, ToggleLeft, ToggleRight, X, Check } from "lucide-react";

const roleColors: Record<string, string> = {
  Admin: "text-error bg-error/10 border-error/20",
  Auditor: "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20",
  Business: "text-[#a388ee] bg-[#a388ee]/10 border-[#a388ee]/20",
  User: "text-[#3cddc7] bg-[#3cddc7]/10 border-[#3cddc7]/20",
};

export default function AccessControlPage() {
  const [accounts, setAccounts] = useState([
    { id: 1, email: "AdMin@Polic", role: "Admin", active: true },
    { id: 2, email: "Auditor@testmail", role: "Auditor", active: true },
    { id: 3, email: "Business@testmail", role: "Business", active: true },
    { id: 4, email: "User01@testmail", role: "User", active: true },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newAcc, setNewAcc] = useState({ email: "", role: "User" });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const addAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcc.email) return;
    setAccounts(prev => [...prev, { id: Date.now(), email: newAcc.email, role: newAcc.role, active: true }]);
    setShowModal(false);
    setNewAcc({ email: "", role: "User" });
  };

  const toggleActive = (id: number) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAccount = (id: number) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    setConfirmDelete(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline font-black text-white mb-2">Access Control</h2>
          <p className="text-slate-400 font-medium">Manage user accounts and role-based permissions across all portals.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-amber-400 hover:bg-amber-300 text-[#1c113a] font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          <PlusCircle size={20} /> Add Account
        </button>
      </div>

      {/* Role legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(roleColors).map(([role, cls]) => (
          <span key={role} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${cls}`}>
            <Shield size={14} /> {role}
          </span>
        ))}
      </div>

      {/* Accounts Table */}
      <div className="bg-surface-container/50 backdrop-blur-xl rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-white/[0.02] relative z-10">
          <Users size={20} className="text-amber-400" />
          <h3 className="font-bold text-lg text-white">System Accounts <span className="text-slate-500 font-normal ml-2">({accounts.length})</span></h3>
        </div>
        <div className="divide-y divide-white/5 relative z-10">
          <AnimatePresence>
            {accounts.map(acc => (
              <motion.div key={acc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-4 px-8 py-5 hover:bg-white/[0.02] transition-colors group">
                <div className="flex-1">
                  <p className="font-bold text-white text-lg">{acc.email}</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] uppercase font-black tracking-widest border mt-2 ${roleColors[acc.role]}`}>
                    {acc.role}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${acc.active ? "text-[#3cddc7] bg-[#3cddc7]/10 border-[#3cddc7]/20" : "text-slate-500 bg-surface border-white/5"}`}>
                    {acc.active ? "Active" : "Suspended"}
                  </span>
                  <button onClick={() => toggleActive(acc.id)}
                    className="text-slate-400 hover:text-white transition-colors">
                    {acc.active ? <ToggleRight size={36} className="text-[#3cddc7] drop-shadow-[0_0_10px_rgba(60,221,199,0.5)]" /> : <ToggleLeft size={36} />}
                  </button>
                  {confirmDelete === acc.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => deleteAccount(acc.id)} className="p-2 rounded-lg bg-error/20 text-error hover:bg-error/30 transition-colors"><Check size={18} /></button>
                      <button onClick={() => setConfirmDelete(null)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-colors"><X size={18} /></button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(acc.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-error transition-all p-2 rounded-lg hover:bg-error/10"><Trash2 size={20} /></button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Account Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-surface-container border border-white/10 rounded-[2rem] p-10 w-full max-w-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-[60px] pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-2xl font-headline font-black flex items-center gap-3 text-white"><PlusCircle className="text-amber-400" size={28} /> New Account</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-colors"><X size={20} /></button>
              </div>
              
              <form onSubmit={addAccount} className="space-y-6 relative z-10">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Email / Username</label>
                  <input type="text" required value={newAcc.email} onChange={e => setNewAcc({ ...newAcc, email: e.target.value })}
                    placeholder="user@domain.com"
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-amber-400 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Assign Role</label>
                  <select value={newAcc.role} onChange={e => setNewAcc({ ...newAcc, role: e.target.value })}
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-amber-400 transition-all">
                    <option>User</option>
                    <option>Auditor</option>
                    <option>Business</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-4 border border-white/10 hover:bg-white/5 rounded-xl font-bold text-slate-300 transition-all">Cancel</button>
                  <button type="submit"
                    className="flex-1 py-4 bg-amber-400 hover:bg-amber-300 text-[#1c113a] rounded-xl font-black transition-all active:scale-95 shadow-[0_0_15px_rgba(251,191,36,0.3)]">Create Account</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
