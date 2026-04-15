"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Shield, PlusCircle, Trash2, ToggleLeft, ToggleRight, X, Check } from "lucide-react";

const roleColors: Record<string, string> = {
  Admin: "text-red-400 bg-red-500/10 border-red-500/20",
  Auditor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Business: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  User: "text-green-400 bg-green-500/10 border-green-500/20",
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-headline font-bold mb-1">Access Control</h2>
          <p className="text-slate-400">Manage user accounts and role-based permissions across all portals.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-[#adc6ff] hover:bg-[#c7d8ff] text-[#001a42] font-black px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all active:scale-95">
          <PlusCircle size={18} /> Add Account
        </button>
      </div>

      {/* Role legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(roleColors).map(([role, cls]) => (
          <span key={role} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cls}`}>
            <Shield size={12} /> {role}
          </span>
        ))}
      </div>

      {/* Accounts Table */}
      <div className="bg-[#0b1326] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <Users size={18} className="text-[#adc6ff]" />
          <h3 className="font-bold">System Accounts ({accounts.length})</h3>
        </div>
        <div className="divide-y divide-white/5">
          <AnimatePresence>
            {accounts.map(acc => (
              <motion.div key={acc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                <div className="flex-1">
                  <p className="font-bold">{acc.email}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border mt-1 ${roleColors[acc.role]}`}>
                    {acc.role}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold uppercase ${acc.active ? "text-[#3cddc7]" : "text-slate-600"}`}>
                    {acc.active ? "Active" : "Suspended"}
                  </span>
                  <button onClick={() => toggleActive(acc.id)}
                    className="text-slate-400 hover:text-white transition-colors">
                    {acc.active ? <ToggleRight size={28} className="text-[#3cddc7]" /> : <ToggleLeft size={28} />}
                  </button>
                  {confirmDelete === acc.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => deleteAccount(acc.id)} className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"><Check size={14} /></button>
                      <button onClick={() => setConfirmDelete(null)} className="p-1.5 rounded bg-white/5 text-slate-400 hover:bg-white/10"><X size={14} /></button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(acc.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><Trash2 size={18} /></button>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-[#0b1326] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><PlusCircle className="text-[#adc6ff]" size={20} /> New Account</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={addAccount} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Email / Username</label>
                  <input type="text" required value={newAcc.email} onChange={e => setNewAcc({ ...newAcc, email: e.target.value })}
                    placeholder="user@domain.com"
                    className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#adc6ff]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Assign Role</label>
                  <select value={newAcc.role} onChange={e => setNewAcc({ ...newAcc, role: e.target.value })}
                    className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-[#adc6ff]">
                    <option>User</option>
                    <option>Auditor</option>
                    <option>Business</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all">Cancel</button>
                  <button type="submit"
                    className="flex-1 py-3 bg-[#adc6ff] hover:brightness-110 text-[#001a42] rounded-xl font-black transition-all active:scale-95">Create Account</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
