"use client";
import Link from "next/link";
import { Briefcase, Building, FileBarChart, PieChart, LogOut } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function AuditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="Auditor">
      <div className="flex bg-[#f4f6f8] text-[#1c2434] min-h-screen font-body">
        <aside className="w-64 bg-white border-r border-[#e2e8f0] shadow-md flex flex-col z-10">
          <div className="p-8 border-b border-[#e2e8f0]">
            <h1 className="text-2xl font-headline font-black text-[#0f172a] uppercase tracking-tighter">Lex<span className="text-[#2563eb]">Guard</span></h1>
            <p className="text-xs font-bold text-slate-500 mt-1">Auditor Portal</p>
          </div>

          <nav className="flex flex-col gap-2 p-4 flex-1">
            <Link href="/auditor" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 transition-all border-l-4 border-transparent hover:border-slate-300">
              <PieChart size={18} /> Portfolio Overview
            </Link>
            <Link href="/auditor/clients" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 transition-all border-l-4 border-transparent hover:border-slate-300">
              <Building size={18} /> Client Profiles
            </Link>
            <Link href="/auditor/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 transition-all border-l-4 border-transparent hover:border-slate-300">
              <FileBarChart size={18} /> Legal Reports
            </Link>
          </nav>
          
          <div className="p-4 border-t border-[#e2e8f0]">
             <Link href="/login" onClick={() => { if(typeof window !== "undefined") localStorage.removeItem("userRole"); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 font-semibold hover:bg-red-50 transition-all border-l-4 border-transparent hover:border-red-200">
                <LogOut size={18} /> Log Out Account
             </Link>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-10">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
