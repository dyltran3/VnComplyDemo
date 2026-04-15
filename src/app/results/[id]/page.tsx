"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export default function DynamicResultsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [scan, setScan] = useState<any>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"privacy" | "security">("privacy");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const scanData = await api.getScanStatus(id as string);
        setScan(scanData);

        if (scanData.status === "completed" || scanData.progress > 5) {
          const findingsData = await api.getScanFindings(id as string);
          setFindings(findingsData);
        }

        if (scanData.status !== "completed" && scanData.status !== "failed") {
          setTimeout(fetchData, 3000); // Poll every 3s
        }
      } catch (err: any) {
        setError(err.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading && !scan) {
    return <div className="p-20 text-center animate-pulse text-slate-500 italic">Initializing scanner...</div>;
  }

  if (error) {
    return (
      <div className="p-20 text-center space-y-4">
        <div className="text-error font-bold">Error: {error}</div>
        <button onClick={() => router.push("/")} className="text-primary underline">Back to Dashboard</button>
      </div>
    );
  }

  const privacyFindings  = findings.filter(f => f.category === "privacy");
  const securityFindings = findings.filter(f => f.category === "owasp");

  return (
    <div className="px-8 py-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Status Header & Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">Target</span>
            <h2 className="text-xl font-headline font-bold text-on-surface truncate max-w-md">
              {scan?.target_url || "..."}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`relative flex h-2 w-2 ${scan?.status === 'running' ? 'animate-ping' : ''}`}>
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  scan?.status === 'completed' ? 'bg-tertiary' : scan?.status === 'failed' ? 'bg-error' : 'bg-primary'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  scan?.status === 'completed' ? 'bg-tertiary' : scan?.status === 'failed' ? 'bg-error' : 'bg-primary'
                }`}></span>
              </span>
              <span className={`text-sm font-medium ${
                scan?.status === 'completed' ? 'text-tertiary' : scan?.status === 'failed' ? 'text-error' : 'text-primary'
              }`}>
                {scan?.status === 'running' ? 'Scanning...' : scan?.status?.toUpperCase()}
              </span>
            </div>
            <div className="w-64 h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 rounded-full" 
                style={{ width: `${scan?.progress || 0}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono text-slate-400">{scan?.progress || 0}%</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            disabled={scan?.status !== 'completed'}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-md shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            <span className="text-sm">Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container p-5 rounded-xl border border-outline-variant/10">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">Critical Issues</p>
          <p className="text-2xl font-bold text-error">{findings.filter(f => f.severity === 'CRITICAL').length}</p>
        </div>
        <div className="bg-surface-container p-5 rounded-xl border border-outline-variant/10">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">High Issues</p>
          <p className="text-2xl font-bold text-orange-400">{findings.filter(f => f.severity === 'HIGH').length}</p>
        </div>
        <div className="bg-surface-container p-5 rounded-xl border border-outline-variant/10">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">Medium / Low</p>
          <p className="text-2xl font-bold text-primary">{findings.filter(f => f.severity === 'MEDIUM' || f.severity === 'LOW').length}</p>
        </div>
        <div className="bg-surface-container p-5 rounded-xl border border-outline-variant/10">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">Scan Mode</p>
          <p className="text-2xl font-bold text-slate-300 capitalize">{scan?.scan_type || 'Full'}</p>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-outline-variant/10 gap-8">
          <button 
            onClick={() => setActiveTab("privacy")}
            className={`pb-4 text-sm font-semibold transition-all px-2 border-b-2 ${
              activeTab === "privacy" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-on-surface"
            }`}
          >
            Privacy / Policy Findings ({privacyFindings.length})
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`pb-4 text-sm font-semibold transition-all px-2 border-b-2 ${
              activeTab === "security" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-on-surface"
            }`}
          >
            OWASP Security Findings ({securityFindings.length})
          </button>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {(activeTab === "privacy" ? privacyFindings : securityFindings).length === 0 ? (
          <div className="p-12 text-center text-slate-500 italic bg-surface-container-lowest rounded-xl">
            {scan?.status === 'running' ? 'Scanning in progress...' : 'No findings detected in this category.'}
          </div>
        ) : (
          (activeTab === "privacy" ? privacyFindings : securityFindings).map((f: any) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={f.id}
              className="group bg-surface-container hover:bg-surface-container-high transition-all rounded-lg p-5 flex items-start gap-5 relative overflow-hidden"
            >
              <div className={`w-1 absolute left-0 top-0 bottom-0 ${
                f.severity === 'CRITICAL' ? 'bg-error' : 
                f.severity === 'HIGH' ? 'bg-orange-400' :
                f.severity === 'MEDIUM' ? 'bg-yellow-400' : 'bg-primary'
              }`}></div>
              
              <div className="mt-1 flex-shrink-0">
                <div className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-tighter text-center w-16 ${
                   f.severity === 'CRITICAL' ? 'bg-error/10 text-error' : 
                   f.severity === 'HIGH' ? 'bg-orange-400/10 text-orange-400' :
                   f.severity === 'MEDIUM' ? 'bg-yellow-400/10 text-yellow-500' : 'bg-primary/10 text-primary'
                }`}>
                  {f.severity}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline font-bold text-on-surface group-hover:text-white transition-colors">
                      {f.title}
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {f.nd13_ref && (
                        <span className="text-[9px] font-bold bg-surface-container-lowest border border-outline-variant/20 px-1.5 py-0.5 rounded text-blue-400 uppercase tracking-widest">
                          {f.nd13_ref.split(' — ')[0]}
                        </span>
                      )}
                      {f.law91_ref && (
                        <span className="text-[9px] font-bold bg-orange-950/20 border border-orange-500/20 px-1.5 py-0.5 rounded text-orange-400 uppercase tracking-widest">
                          {f.law91_ref.split(' — ')[0]}
                        </span>
                      )}
                      {f.owasp_ref && (
                        <span className="text-[9px] font-bold bg-surface-container-lowest border border-outline-variant/20 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-widest">
                          {f.owasp_ref}
                        </span>
                      )}
                    </div>
                  </div>
                  {f.cvss_score && (
                    <div className="text-right">
                      <span className="text-lg font-bold text-error">{f.cvss_score}</span>
                      <p className="text-[9px] text-slate-500 uppercase font-bold">CVSS</p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                  {f.description}
                </p>
                {f.evidence && (
                  <div className="mt-2">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Evidence</p>
                    <pre className="bg-surface-container-lowest p-3 rounded font-mono text-[11px] text-slate-300 overflow-x-auto">
                      {f.evidence}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
