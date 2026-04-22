"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Home, Clock, Download, LogOut } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard requiredRole="User">
      <div className="flex bg-[#0b1326] text-white min-h-screen font-body">
        <aside className="w-64 bg-surface-container/50 border-r border-white/5 p-6 flex flex-col gap-8 shadow-2xl backdrop-blur-xl relative z-20">
          <div className="flex items-center gap-3">
            <div className="bg-primary w-10 h-10 rounded-xl flex items-center justify-center text-[#001a42] shadow-[0_0_15px_rgba(173,198,255,0.4)]">
              <Shield size={24} />
            </div>
            <div>
               <h1 className="text-xl font-headline font-black text-white leading-none tracking-wide">SafeWeb</h1>
               <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Personal</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 flex-1 mt-4">
            <Link href="/user" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/user' ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(173,198,255,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Home size={18} /> Dashboard
            </Link>
            <Link href="/user/history" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/user/history' ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(173,198,255,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Clock size={18} /> Scan History
            </Link>
            <Link href="/user/reports" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/user/reports' ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(173,198,255,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Download size={18} /> Reports
            </Link>
          </nav>

          <div className="pt-4 border-t border-white/10">
            <Link href="/login" onClick={() => { if(typeof window !== "undefined") localStorage.removeItem("userRole"); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-error font-bold hover:bg-error-container transition-all">
              <LogOut size={18} /> Log Out
            </Link>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-10 relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
