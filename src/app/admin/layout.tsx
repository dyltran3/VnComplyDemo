"use client";
import Link from "next/link";
import { Activity, FileText, Settings, Users, Server, AlertTriangle, LogOut } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="Admin">
      <div className="flex bg-[#050914] text-white min-h-screen font-body">
        {/* SysAdmin Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-[#0b1326]/50 backdrop-blur-xl p-6 flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="flex flex-col gap-1 relative z-10">
            <h1 className="text-2xl font-headline font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#adc6ff] to-[#a388ee]">SysAdmin</h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">VnComply Core</p>
          </div>

          <nav className="flex flex-col gap-2 relative z-10 flex-1">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 text-[#adc6ff] font-semibold transition-all hover:bg-white/10 border border-white/5">
              <Activity size={18} /> Monitoring
            </Link>
            <Link href="/admin/rules" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 font-semibold transition-all hover:bg-white/5 hover:text-[#a388ee]">
              <FileText size={18} /> Legal Rules
            </Link>
            <Link href="/admin/engine" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 font-semibold transition-all hover:bg-white/5 hover:text-white">
              <Server size={18} /> Scan Engine
            </Link>
            <Link href="/admin/access" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 font-semibold transition-all hover:bg-white/5 hover:text-white">
              <Users size={18} /> Access Control
            </Link>
            <Link href="/admin/logs" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 font-semibold transition-all hover:bg-white/5 hover:text-white">
              <AlertTriangle size={18} /> Audit Logs
            </Link>
          </nav>

          <div className="relative z-10 border-t border-white/5 pt-6 flex flex-col gap-2">
            <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 font-semibold transition-all hover:bg-white/5 hover:text-white">
              <Settings size={18} /> Core Settings
            </Link>
            <Link href="/login" onClick={() => { if(typeof window !== "undefined") localStorage.removeItem("userRole"); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 font-semibold transition-all hover:bg-red-500/10 hover:text-red-300">
              <LogOut size={18} /> Secure Log Out
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative p-8">
           <div className="max-w-7xl mx-auto">
              {children}
           </div>
        </main>
      </div>
    </AuthGuard>
  );
}
