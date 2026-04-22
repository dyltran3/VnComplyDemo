"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Building, FileBarChart, PieChart, LogOut } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function AuditorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard requiredRole="Auditor">
      <div className="flex bg-[#0b1326] text-white min-h-screen font-body">
        <aside className="w-64 bg-surface-container/50 border-r border-white/5 p-6 flex flex-col gap-8 shadow-2xl backdrop-blur-xl relative z-20">
          <div className="flex items-center gap-3">
            <div className="bg-[#2563eb] w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Briefcase size={24} />
            </div>
            <div>
               <h1 className="text-xl font-headline font-black text-white leading-none tracking-wide">LexGuard</h1>
               <p className="text-[10px] font-bold text-[#2563eb] uppercase tracking-widest mt-1">Auditor Portal</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 flex-1 mt-4">
            <Link href="/auditor" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/auditor' ? 'bg-[#2563eb]/10 text-[#3b82f6] border border-[#2563eb]/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <PieChart size={18} /> Portfolio Overview
            </Link>
            <Link href="/auditor/clients" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/auditor/clients' ? 'bg-[#2563eb]/10 text-[#3b82f6] border border-[#2563eb]/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Building size={18} /> Client Profiles
            </Link>
            <Link href="/auditor/reports" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${pathname === '/auditor/reports' ? 'bg-[#2563eb]/10 text-[#3b82f6] border border-[#2563eb]/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <FileBarChart size={18} /> Legal Reports
            </Link>
          </nav>
          
          <div className="pt-4 border-t border-white/10">
             <Link href="/login" onClick={() => { if(typeof window !== "undefined") localStorage.removeItem("userRole"); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-error font-bold hover:bg-error-container transition-all">
                <LogOut size={18} /> Log Out Account
             </Link>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-10 relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2563eb]/5 rounded-full blur-[120px] pointer-events-none"></div>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
