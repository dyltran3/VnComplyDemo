"use client";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Target, 
  FileText, 
  Activity, 
  User, 
  Briefcase, 
  Search, 
  Settings,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const breakingTasks = [
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "Privacy / Policy Scanner",
    desc: "Automated crawler using Playwright for deep privacy compliance detection.",
  },
  {
    icon: <Target className="w-8 h-8 text-tertiary" />,
    title: "Demo Target Web",
    desc: "Isolated target environments to safely simulate and detect vulnerabilities.",
  },
  {
    icon: <Activity className="w-8 h-8 text-error" />,
    title: "OWASP Top 10 Scanner",
    desc: "Intelligent security modules for header analysis and injection detection.",
  },
  {
    icon: <FileText className="w-8 h-8 text-inverse-primary" />,
    title: "Report Export Engine",
    desc: "High-fidelity PDF generation with official 'Verified' compliance stamping.",
  }
];

const useCases = [
  {
    icon: <User className="w-6 h-6 text-primary" />,
    role: "Individual User",
    items: ["Quick URL Scan", "View Consent & Trackers", "Download Compliance Reports", "View Scan History"]
  },
  {
    icon: <Briefcase className="w-6 h-6 text-tertiary" />,
    role: "Business",
    items: ["Schedule Automated Scans", "Execute DPIA Wizard", "View Compliance Score", "Audit Evidence Logs"]
  },
  {
    icon: <Search className="w-6 h-6 text-on-primary-container" />,
    role: "Auditor & Legal",
    items: ["Client Portfolio Management", "Cross-Client Risk Radar", "Export Audit Readiness", "Compliance Verification"]
  },
  {
    icon: <Settings className="w-6 h-6 text-slate-400" />,
    role: "System Admin",
    items: ["Monitor Scanner Engine", "System Metric Dashboards", "Update Legal Rulebooks", "View System Audit Logs"]
  }
];

// Reusable animation variants to reduce inline objects
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary/30 overflow-hidden font-body">
      {/* Background Ambience - CSS only for max performance */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex items-center justify-between backdrop-blur-md bg-background/50 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <Shield className="text-primary w-6 h-6" />
          </div>
          <span className="font-headline font-black text-xl tracking-tight text-white">VnComply</span>
        </div>
        <button 
          onClick={() => router.push('/login')}
          className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-6 py-2.5 rounded-full font-bold transition-all text-sm flex items-center gap-2 group"
        >
          Access Portal
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto mb-32"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-white/5 text-sm font-medium text-slate-300 mb-8 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            VnComply Demo Project v2.0
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-headline font-black tracking-tight text-white leading-tight mb-8">
            Privacy Compliance <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">
              & Security Assessment
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-10">
            A comprehensive engine designed to scan, analyze, and enforce Data Privacy (Decree 13) and Cybersecurity compliance in real-time.
          </motion.p>
          <motion.button 
            variants={fadeUp}
            onClick={() => router.push('/login')}
            className="bg-primary hover:bg-primary-fixed-dim text-[#001a42] px-8 py-4 rounded-full font-black text-lg transition-all shadow-[0_0_30px_rgba(173,198,255,0.2)] hover:shadow-[0_0_50px_rgba(173,198,255,0.4)] hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
          >
            Launch Identity Portal
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Breaking Tasks Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-32"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl font-headline font-black text-white mb-4">Core Capabilities</h2>
            <p className="text-slate-400 font-medium">The 4 Breaking Tasks powering the VnComply engine.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {breakingTasks.map((task, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeUp}
                className="bg-surface-container/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl hover:bg-surface-container hover:border-white/10 transition-colors group cursor-default"
              >
                <div className="w-16 h-16 rounded-2xl bg-surface mb-6 flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                  {task.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{task.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{task.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Use Cases Section */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl font-headline font-black text-white mb-4">Target Audience Use Cases</h2>
            <p className="text-slate-400 font-medium">Tailored experiences and workflows for every stakeholder.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((uc, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeUp}
                className="bg-gradient-to-br from-surface-container to-surface-dim border border-white/5 p-8 rounded-[2rem] flex flex-col md:flex-row gap-8 items-start relative overflow-hidden group"
              >
                {/* Decorative subtle background icon */}
                <div className="absolute -right-8 -bottom-8 opacity-[0.03] scale-150 pointer-events-none group-hover:scale-[1.7] transition-transform duration-700">
                   {uc.icon}
                </div>

                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {uc.icon}
                </div>
                <div className="flex-1 z-10">
                  <h3 className="text-2xl font-bold text-white mb-6 font-headline">{uc.role}</h3>
                  <ul className="space-y-4">
                    {uc.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-tertiary flex-shrink-0" />
                        <span className="font-medium text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-32 py-10 text-center relative z-10">
        <p className="text-slate-500 font-medium text-sm">
          © 2026 VnComply Demo Project. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
