"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle, AlertTriangle, ChevronRight, FileText, X, Loader2 } from "lucide-react";

const dpiaSteps = [
  { id: 1, title: "Define Processing Purpose", description: "What personal data is being collected? What is the lawful basis?" },
  { id: 2, title: "Assess Necessity & Proportionality", description: "Is the data collected necessary and proportionate to the purpose?" },
  { id: 3, title: "Identify & Assess Risks", description: "What risks exist for the rights and freedoms of data subjects?" },
  { id: 4, title: "Define Risk Mitigation Measures", description: "What technical and organizational measures will address identified risks?" },
  { id: 5, title: "DPO Consultation & Sign-off", description: "Has the Data Protection Officer reviewed and signed off on this assessment?" },
];

export default function DPIAPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const isComplete = Object.keys(answers).length === dpiaSteps.length &&
    Object.values(answers).every(v => v.trim().length > 10);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-headline font-black mb-2">Data Protection Impact Assessment</h2>
        <p className="text-slate-400">Build a structured DPIA document that satisfies Decree 13 requirements, step by step.</p>
      </div>

      {/* Progress tracker */}
      <div className="flex items-center gap-2">
        {dpiaSteps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <button onClick={() => setStep(i)}
              className={`w-9 h-9 rounded-full font-black text-sm flex items-center justify-center flex-shrink-0 transition-all border-2 ${step === i ? "border-[#0d9488] bg-[#0d9488] text-white scale-110" : answers[i + 1] ? "border-[#2dd4bf] bg-[#2dd4bf]/10 text-[#2dd4bf]" : "border-slate-600 bg-transparent text-slate-600"}`}>
              {answers[i + 1] ? <CheckCircle size={16} /> : s.id}
            </button>
            {i < dpiaSteps.length - 1 && <div className={`flex-1 h-0.5 transition-all ${answers[i + 1] ? "bg-[#2dd4bf]" : "bg-slate-700"}`} />}
          </div>
        ))}
      </div>

      {/* Step Panel */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          className="bg-[#1e293b]/50 border border-white/5 rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-[#0d9488]/20 border border-[#0d9488]/30 rounded-xl p-3 flex-shrink-0">
              <ShieldAlert className="text-[#2dd4bf]" size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Step {step + 1} of {dpiaSteps.length}</p>
              <h3 className="text-xl font-black text-white">{dpiaSteps[step].title}</h3>
              <p className="text-slate-400 mt-1">{dpiaSteps[step].description}</p>
            </div>
          </div>
          <textarea
            value={answers[step + 1] || ""}
            onChange={e => setAnswers(a => ({ ...a, [step + 1]: e.target.value }))}
            placeholder="Enter your detailed response for this section..."
            rows={6}
            className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-600 focus:ring-1 focus:ring-[#2dd4bf] focus:border-[#2dd4bf] resize-none leading-relaxed"
          />
          <div className="flex justify-between items-center mt-4">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
              className="px-4 py-2 border border-white/10 rounded-lg font-bold text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all">
              ← Back
            </button>
            {step < dpiaSteps.length - 1 ? (
              <button onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-6 py-2 bg-[#0d9488] hover:bg-[#0f766e] rounded-lg font-bold transition-all active:scale-95">
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={generateReport} disabled={!isComplete || generating || generated}
                className="flex items-center gap-2 px-6 py-2 bg-[#0d9488] hover:bg-[#0f766e] rounded-lg font-bold transition-all active:scale-95 disabled:opacity-40">
                {generating ? <><Loader2 className="animate-spin" size={16} /> Generating...</>
                  : generated ? <><CheckCircle size={16} /> Generated!</>
                    : <><FileText size={16} /> Generate DPIA Report</>}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Generated Banner */}
      {generated && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 rounded-2xl p-6 flex items-center gap-4">
          <CheckCircle className="text-[#2dd4bf] flex-shrink-0" size={32} />
          <div className="flex-1">
            <h4 className="font-black text-white">DPIA Report Generated Successfully</h4>
            <p className="text-slate-400 text-sm mt-1">Your DPIA document has been compiled and is ready for DPO review and submission.</p>
          </div>
          <button className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all">
            <FileText size={16} /> Download PDF
          </button>
        </motion.div>
      )}
    </div>
  );
}
