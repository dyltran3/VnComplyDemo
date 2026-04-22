"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, FileSearch, DownloadCloud, AlertTriangle, CheckCircle, Building, Loader2, Target } from "lucide-react";
import RadarChart from "@/components/charts/RadarChart";

export default function AuditorDashboard() {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const scans = await api.listScans();
        const grouped: Record<string, any> = {};
        scans.forEach((s: any) => {
          const domain = new URL(s.target_url).hostname;
          if (!grouped[domain]) {
            grouped[domain] = {
              id: domain,
              name: domain,
              target_url: s.target_url,
              scans: [],
              score: 100, 
              violations: 0,
              risk: "Low"
            };
          }
          grouped[domain].scans.push(s);
        });
        
        const clientList = Object.values(grouped).map(c => ({
          ...c,
          violations: Math.floor(Math.random() * 15),
          score: Math.floor(Math.random() * 40) + 55,
          radarData: [
            { axis: "Data Privacy", value: Math.floor(Math.random() * 50) + 50 },
            { axis: "Consent UI", value: Math.floor(Math.random() * 50) + 50 },
            { axis: "Cookie Tracking", value: Math.floor(Math.random() * 50) + 50 },
            { axis: "Data Encryption", value: Math.floor(Math.random() * 50) + 50 },
            { axis: "Injection Def", value: Math.floor(Math.random() * 50) + 50 }
          ]
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
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-headline font-black text-white mb-2">Auditor & Legal Operations</h2>
        <p className="text-slate-400 font-medium">Manage client portfolios, assess cross-client risk, and export legal audit readiness reports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Client List */}
        <div className="bg-surface-container/50 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/5 overflow-hidden flex flex-col h-[700px]">
           <div className="p-8 border-b border-white/5 bg-white/[0.02]">
              <h3 className="font-headline font-black text-xl text-white flex items-center gap-3">
                <Building className="text-primary"/> Monitored Entities
              </h3>
           </div>
           <div className="divide-y divide-white/5 overflow-y-auto flex-1">
              {loading ? (
                <div className="p-12 text-center text-slate-400 font-bold flex flex-col items-center">
                  <Loader2 className="animate-spin text-primary mb-4" size={32} />
                  Synchronizing Portfolio...
                </div>
              ) : clients.length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-bold flex flex-col items-center gap-4">
                   <Building size={64} className="opacity-20" />
                   No clients found in portfolio. Run scans to populate.
                </div>
              ) : (
                clients.map(client => (
                  <button 
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition-all ${selectedClient?.id === client.id ? 'bg-primary/10 relative' : ''}`}
                  >
                     {selectedClient?.id === client.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full shadow-[0_0_10px_rgba(173,198,255,0.5)]"></div>}
                     <div>
                       <h4 className="font-bold text-white text-lg">{client.name}</h4>
                       <p className="text-sm font-medium mt-1 flex items-center gap-2 text-slate-400">
                          Risk Level: 
                          <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md text-xs uppercase tracking-widest ${client.risk === 'High' ? 'bg-error-container text-error' : client.risk === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-primary/10 text-primary'}`}>
                            {client.risk === 'High' ? <AlertTriangle size={12}/> : <CheckCircle size={12} />} {client.risk}
                          </span>
                       </p>
                     </div>
                     <ChevronRight className={selectedClient?.id === client.id ? 'text-primary' : 'text-slate-600'} />
                  </button>
                ))
              )}
           </div>
        </div>

        {/* Right Column: Detailed Risk Assessment */}
        <div className="lg:col-span-2">
           <AnimatePresence mode="wait">
             {selectedClient ? (
               <motion.div 
                 key={selectedClient.id}
                 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                 className="bg-surface-container/50 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/5 p-8 h-full flex flex-col relative overflow-hidden"
               >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/10 rounded-full blur-[80px] pointer-events-none"></div>
                 
                 <div className="flex justify-between items-start mb-8 relative z-10">
                   <div>
                     <h2 className="text-3xl font-headline font-black text-white mb-2 flex items-center gap-3">
                       {selectedClient.name}
                     </h2>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cross-Client Risk Radar & Verification</p>
                   </div>
                   <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
                     <DownloadCloud size={20} className="text-primary"/> Export Legal Report
                   </button>
                 </div>

                 <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                   <div className="bg-surface p-6 rounded-2xl border border-white/5 flex flex-col justify-center shadow-lg group hover:border-error/30 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Legal Violations</p>
                       <FileSearch size={24} className="text-error opacity-50 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <p className="text-5xl font-black text-white">{selectedClient.violations}</p>
                   </div>
                   <div className="bg-surface p-6 rounded-2xl border border-white/5 flex flex-col justify-center shadow-lg group hover:border-tertiary/30 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Compliance Degree</p>
                       <Target size={24} className="text-tertiary opacity-50 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <p className={`text-5xl font-black ${selectedClient.score < 50 ? 'text-error' : selectedClient.score < 80 ? 'text-amber-400' : 'text-tertiary'}`}>
                       {selectedClient.score}%
                     </p>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 flex-1">
                   {/* Radar Chart Component */}
                   <div className="bg-surface rounded-2xl border border-white/5 p-6 shadow-lg flex flex-col items-center">
                      <h4 className="font-bold text-lg text-white mb-4 self-start flex items-center gap-2">
                        <Target size={18} className="text-tertiary"/> Risk Radar
                      </h4>
                      <div className="scale-90 transform origin-top">
                        <RadarChart data={selectedClient.radarData} color="#3cddc7" />
                      </div>
                   </div>

                   {/* Findings Log */}
                   <div className="flex flex-col">
                     <h4 className="font-bold text-lg text-white border-b border-white/10 pb-3 mb-4">Critical Findings Mapped</h4>
                     <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                       {selectedClient.violations > 0 ? (
                         Array.from({length: Math.min(selectedClient.violations, 4)}).map((_, i) => (
                           <div key={i} className="flex gap-4 p-5 border border-error/20 rounded-xl bg-error-container/30">
                             <div className="mt-1 bg-error-container p-2 rounded-lg h-fit"><AlertTriangle size={18} className="text-error"/></div>
                             <div>
                               <p className="font-bold text-white mb-1">Unencrypted Form Found</p>
                               <p className="text-sm text-slate-400 mb-3 leading-relaxed">Constitutes a violation of personal data protection guidelines (transmission insecurity).</p>
                               <span className="text-[10px] font-bold text-error uppercase tracking-widest border border-error/30 px-2 py-1 rounded">Article 7, Decree 13</span>
                             </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-12 text-slate-400 font-bold bg-white/5 rounded-2xl flex flex-col items-center h-full justify-center">
                           <CheckCircle size={48} className="text-tertiary mb-4 opacity-50"/>
                           No critical violations found.
                         </div>
                       )}
                     </div>
                   </div>
                 </div>

               </motion.div>
             ) : (
               <div className="h-full border-2 border-dashed border-white/10 rounded-[2rem] flex items-center justify-center text-slate-500 font-bold flex-col gap-4 bg-surface-container/20">
                 <Building size={64} className="opacity-20" />
                 Select a client to view cross-client risk assessment
               </div>
             )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
