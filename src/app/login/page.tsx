"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      let role = null;
      let path = "";
      const userEmail = email.trim();
      const userPass = password.trim();

      if (userEmail === "AdMin@Polic" && userPass === "adminCanChanges") {
        role = "Admin";
        path = "/admin";
      } else if (userEmail === "User01@testmail" && userPass === "user01Permit") {
        role = "User";
        path = "/user";
      } else if (userEmail === "Auditor@testmail" && userPass === "auditorPermit") {
        role = "Auditor";
        path = "/auditor";
      } else if (userEmail === "Business@testmail" && userPass === "businessPermit") {
        role = "Business";
        path = "/business";
      }

      if (role) {
        localStorage.setItem("userRole", role);
        router.push(path);
      } else {
        setError("Invalid credentials. Access denied.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#05060f]">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-tertiary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0b1326]/80 backdrop-blur-3xl p-10 rounded-3xl border border-white/10 shadow-2xl z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
           <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 shadow-[0_0_20px_rgba(173,198,255,0.2)]">
              <Shield className="text-primary w-8 h-8" />
           </div>
           <h1 className="text-2xl font-headline font-black text-white tracking-tight">VnComply Identity</h1>
           <p className="text-sm font-bold text-slate-500 tracking-widest uppercase mt-2">Authentication Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm font-bold text-center">
              {error}
            </motion.div>
          )}

          <div className="space-y-1 relative group">
            <input 
              type="text" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Account Email" 
              className="w-full bg-[#171f33] border border-white/5 rounded-xl px-4 py-4 text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium placeholder-slate-500"
            />
          </div>
          <div className="space-y-1 relative group">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password" 
              className="w-full bg-[#171f33] border border-white/5 rounded-xl px-4 py-4 pr-12 text-white focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium placeholder-slate-500"
            />
          </div>
          <button 
             type="submit" 
             disabled={loading}
             className="w-full bg-primary hover:bg-primary-fixed-dim text-[#001a42] font-black tracking-wide py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(173,198,255,0.15)] hover:shadow-[0_0_30px_rgba(173,198,255,0.3)] disabled:opacity-50 active:scale-95 flex items-center justify-center"
          >
             {loading ? <span className="animate-pulse">Authenticating...</span> : "Secure Login"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
           <p className="text-xs text-slate-500 font-medium">Use assigned credentials to access your specific compliance zone.</p>
        </div>
      </motion.div>
    </div>
  );
}
