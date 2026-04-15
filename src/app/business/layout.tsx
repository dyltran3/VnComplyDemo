"use client";
import Link from "next/link";
import { BarChart, Settings, Calendar, ShieldAlert, LogOut } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="Business">
      <div className="flex bg-[#0f172a] text-[#f8fafc] min-h-screen font-body">
        {/* Corporate Sidebar */}
        <aside className="w-64 border-r border-[#1e293b] p-6 flex flex-col gap-8 bg-[#1e293b]/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center">
               <span className="font-bold text-white leading-none tracking-tighter">VN</span>
            </div>
            <div>
              <h1 className="text-xl font-headline font-bold text-white tracking-tight">Enterprise</h1>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Compliance Hub</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 flex-1 mt-4">
            <Link href="/business" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0d9488]/10 text-[#2dd4bf] font-bold transition-all border-r-2 border-[#2dd4bf]">
              <BarChart size={18} /> Overview
            </Link>
            <Link href="/business/scans" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 font-semibold hover:bg-slate-800 transition-all">
              <Calendar size={18} /> Auto Scans
            </Link>
            <Link href="/business/dpia" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 font-semibold hover:bg-slate-800 transition-all">
              <ShieldAlert size={18} /> Deep DPIA
            </Link>
            <Link href="/business/policies" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 font-semibold hover:bg-slate-800 transition-all mt-8">
              <Settings size={18} /> Policies
            </Link>
          </nav>

          <div className="pt-4 border-t border-[#1e293b]">
             <Link href="/login" onClick={() => { if(typeof window !== "undefined") localStorage.removeItem("userRole"); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 font-semibold hover:bg-red-500/10 transition-all">
                <LogOut size={18} /> Log Out
             </Link>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-10 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0d9488]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
