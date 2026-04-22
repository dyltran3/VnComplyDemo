"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FileText, Settings, Users, Server, AlertTriangle, LogOut } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard requiredRole="Admin">
      <div className="flex bg-[#050914] text-white min-h-screen font-body">
        {/* SysAdmin Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-[#0b1326]/50 backdrop-blur-xl p-6 flex flex-col gap-8 relative overflow-hidden z-20 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#adc6ff]/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#a388ee]/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="flex flex-col gap-1 relative z-10">
            <h1 className="text-2xl font-headline font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#adc6ff] to-[#a388ee]">SysAdmin</h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#a388ee]">VnComply Core</p>
          </div>

          <nav className="flex flex-col gap-2 relative z-10 flex-1 mt-4">
            <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/admin' ? 'bg-[#adc6ff]/10 text-[#adc6ff] border border-[#adc6ff]/20 shadow-[0_0_15px_rgba(173,198,255,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Activity size={18} /> Monitoring
            </Link>
            <Link href="/admin/rules" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/admin/rules' ? 'bg-[#a388ee]/10 text-[#a388ee] border border-[#a388ee]/20 shadow-[0_0_15px_rgba(163,136,238,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <FileText size={18} /> Legal Rules
            </Link>
            <Link href="/admin/engine" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/admin/engine' ? 'bg-[#3cddc7]/10 text-[#3cddc7] border border-[#3cddc7]/20 shadow-[0_0_15px_rgba(60,221,199,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Server size={18} /> Scan Engine
            </Link>
            <Link href="/admin/access" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/admin/access' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Users size={18} /> Access Control
            </Link>
            <Link href="/admin/logs" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/admin/logs' ? 'bg-slate-300/10 text-slate-200 border border-slate-300/20 shadow-[0_0_15px_rgba(203,213,225,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <AlertTriangle size={18} /> Audit Logs
            </Link>
          </nav>

          <div className="relative z-10 border-t border-white/5 pt-6 flex flex-col gap-2">
            <Link href="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/admin/settings' ? 'bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Settings size={18} /> Core Settings
            </Link>
            <Link href="/login" onClick={() => { if(typeof window !== "undefined") localStorage.removeItem("userRole"); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-error font-bold hover:bg-error/10 hover:text-error transition-all">
              <LogOut size={18} /> Secure Log Out
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative p-10">
           <div className="max-w-7xl mx-auto">
              {children}
           </div>
        </main>
      </div>
    </AuthGuard>
  );
}
