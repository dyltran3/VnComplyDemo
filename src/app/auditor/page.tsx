"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, FileSearch, DownloadCloud, AlertTriangle, CheckCircle, Building, Loader2 } from "lucide-react";

export default function AuditorDashboard() {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const scans = await api.listScans();
        // Group scans by domain to create a mock "client" portfolio
        const grouped: Record<string, any> = {};
        scans.forEach((s: any) => {
          const domain = new URL(s.target_url).hostname;
          if (!grouped[domain]) {
            grouped[domain] = {
              id: domain,
              name: domain,
              target_url: s.target_url,
              scans: [],
              score: 100, // Default
              violations: 0,
              risk: "Low"
            };
          }
          grouped[domain].scans.push(s);
        });
        
        // Enhance with mock data for demo since we haven't processed all findings yet
        const clientList = Object.values(grouped).map(c => ({
          ...c,
          violations: Math.floor(Math.random() * 15),
          score: Math.floor(Math.random() * 40) + 55,
        })).map(c => ({
          ...c,
          risk: c.score < 60 ? "High" : c.score < 80 ? "Medium" : "Low"
        }));

        setClients(clientList);
      } catch (err) {
        console.error("Failed to fetch auditor portfolio", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);


  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-black text-[#0f172a] mb-2">Client Portfolio Management</h2>
        <p className="text-slate-500">Macro-level overview of legal risks across all managed clients.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Client List */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden flex flex-col">
           <div className="p-6 border-b border-[#e2e8f0] bg-slate-50/50">
              <h3 className="font-bold text-lg">Monitored Entities</h3>
           </div>
           <div className="divide-y divide-[#e2e8f0] flex-1">
              {loading ? (
                <div className="p-12 text-center text-slate-400">
                  <Loader2 className="animate-spin mx-auto mb-2" />
                  Loading portfolio...
                </div>
              ) : clients.length === 0 ? (
                <div className="p-12 text-center text-slate-400 fflex flex-col items-center gap-2">
                   <Building size={48} className="opacity-20 mb-2" />
                   No clients found in portfolio.
                </div>
              ) : (
                clients.map(client => (
                  <button 
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`w-full text-left p-6 flex justify-between items-center hover:bg-slate-50 transition-colors ${selectedClient?.id === client.id ? 'bg-blue-50/50 relative overflow-hidden' : ''}`}
                  >
                     {selectedClient?.id === client.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                     <div>
                       <h4 className="font-bold text-slate-800">{client.name}</h4>
                       <p className="text-sm font-medium mt-1 flex items-center gap-2 text-slate-500">
                          Risk Level: 
                          <span className={`inline-flex items-center gap-1 font-bold ${client.risk === 'High' ? 'text-red-500' : client.risk === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {client.risk === 'High' ? <AlertTriangle size={14}/> : <CheckCircle size={14} />} {client.risk}
                          </span>
                       </p>
                     </div>
                     <ChevronRight className="text-slate-300" />
                  </button>
                ))
              )}
           </div>

        </div>

        {/* Right Column: Interaction Flow - Detailed Risk Assessment */}
        <div className="lg:col-span-2">
           <AnimatePresence mode="wait">
             {selectedClient ? (
               <motion.div 
                 key={selectedClient.id}
                 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                 className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:min-h-[500px]"
               >
                 <div className="flex justify-between items-start mb-10">
                   <div>
                     <h2 className="text-3xl font-black mb-2">{selectedClient.name} <span className="font-light text-slate-400">| Detail Analysis</span></h2>
                     <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Last scan completed: Today at 09:41 AM</p>
                   </div>
                   <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2">
                     <DownloadCloud size={20} /> Export Legal Report
                   </button>
                 </div>

                 <div className="grid grid-cols-2 gap-6 mb-8">
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex items-center justify-between">
                     <div>
                       <p className="text-sm font-bold text-slate-500">Total Legal Violations</p>
                       <p className="text-4xl font-black mt-1 text-slate-800">{selectedClient.violations}</p>
                     </div>
                     <FileSearch size={32} className="text-slate-300" />
                   </div>
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex items-center justify-between">
                     <div>
                       <p className="text-sm font-bold text-slate-500">Compliance Degree</p>
                       <p className={`text-4xl font-black mt-1 ${selectedClient.score < 50 ? 'text-red-500' : selectedClient.score < 80 ? 'text-amber-500' : 'text-emerald-500'}`}>
                         {selectedClient.score}%
                       </p>
                     </div>
                     <span className="material-symbols-outlined text-slate-300 text-4xl">analytics</span>
                   </div>
                 </div>

                 {/* Simulated mapped vulnerabilities */}
                 <div>
                   <h4 className="font-bold text-lg border-b border-slate-200 pb-2 mb-4">Critical Findings Mapped</h4>
                   {selectedClient.violations > 0 ? (
                     <div className="space-y-3">
                       {Array.from({length: Math.min(selectedClient.violations, 3)}).map((_, i) => (
                         <div key={i} className="flex gap-4 p-4 border border-red-100 rounded-lg bg-red-50/50">
                           <div className="mt-1"><AlertTriangle size={18} className="text-red-500"/></div>
                           <div>
                             <p className="font-bold text-slate-800">Unencrypted Form Submission Found</p>
                             <p className="text-sm text-slate-600 mt-1">Found on `/checkout`. Constitutes a violation of personal data protection guidelines.</p>
                             <p className="text-xs font-bold text-red-600 uppercase tracking-widest mt-2 bg-red-100 inline-block px-2 py-1 rounded">Article 7, Decree 13</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="text-center py-12 text-slate-400 font-bold bg-slate-50 rounded-xl">
                       <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4 opacity-50"/>
                       No critical violations found.
                     </div>
                   )}
                 </div>

               </motion.div>
             ) : (
               <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-bold flex-col gap-4">
                 <Building size={64} className="opacity-20" />
                 Select a client to view their compliance risk assessment
               </div>
             )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
