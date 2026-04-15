"use client";
import Link from "next/link";
import { Shield, Home, Clock, Download, LogOut } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="User">
      <div className="flex bg-[#f8fafc] text-slate-800 min-h-screen font-body">
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#10b981] w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#10b981]/30">
              <Shield size={24} />
            </div>
            <div>
               <h1 className="text-xl font-headline font-black text-slate-900 leading-none">SafeWeb</h1>
               <p className="text-xs font-bold text-slate-500 mt-1">Personal Scanner</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 flex-1 mt-4">
            <Link href="/user" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#10b981]/10 text-[#059669] font-bold transition-all">
              <Home size={18} /> Dashboard
            </Link>
            <Link href="/user/history" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all">
              <Clock size={18} /> Scan History
            </Link>
            <Link href="/user/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all">
              <Download size={18} /> Reports
            </Link>
          </nav>

          <div className="pt-4 border-t border-slate-100">
            <Link href="/login" onClick={() => { if(typeof window !== "undefined") localStorage.removeItem("userRole"); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 font-semibold hover:bg-red-50 transition-all">
              <LogOut size={18} /> Log Out
            </Link>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10b981]/5 rounded-full blur-[100px] pointer-events-none"></div>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
