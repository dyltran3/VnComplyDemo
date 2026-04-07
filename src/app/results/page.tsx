export default function ResultsPage() {
  return (
    <div className="px-8 py-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Status Header & Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">Target</span>
            <h2 className="text-xl font-headline font-bold text-on-surface">https://cloud.finance.io</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
              </span>
              <span className="text-sm font-medium text-tertiary">Scanning...</span>
            </div>
            <div className="w-64 h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[75%] rounded-full shadow-[0_0_8px_rgba(173,198,255,0.4)]"></div>
            </div>
            <span className="text-xs font-mono text-slate-400">75%</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-md shadow-lg shadow-primary/10 hover:brightness-110 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">download</span>
            <span className="text-sm">Download PDF Report</span>
            <span className="material-symbols-outlined text-lg ml-1">expand_more</span>
          </button>
          <button className="p-2.5 border border-outline-variant/20 rounded-md text-slate-400 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Score Card 1 */}
        <div className="col-span-1 glass-panel p-6 rounded-xl border border-outline-variant/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'opsz' 48" }}>gpp_good</span>
          </div>
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-container-highest" />
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset="43.7" className="text-tertiary" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-headline font-extrabold text-white">88</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Score</span>
            </div>
          </div>
          <h3 className="font-headline font-bold text-lg text-on-surface">Privacy Score</h3>
          <p className="text-sm text-slate-400 mt-1">Excellent compliance with NĐ13/GDPR</p>
        </div>

        {/* Score Card 2 */}
        <div className="col-span-1 glass-panel p-6 rounded-xl border border-outline-variant/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'opsz' 48" }}>security</span>
          </div>
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-container-highest" />
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset="131.2" className="text-[#ffb48a]" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-headline font-extrabold text-white">64</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Score</span>
            </div>
          </div>
          <h3 className="font-headline font-bold text-lg text-on-surface">Security Score</h3>
          <p className="text-sm text-slate-400 mt-1">OWASP posture requires attention</p>
        </div>

        {/* Live Feed / Metrics */}
        <div className="col-span-1 bg-surface-container p-6 rounded-xl border border-outline-variant/10">
          <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-sm">analytics</span>
            Live Vulnerability Feed
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Critical</span>
              <span className="font-bold text-error">2</span>
            </div>
            <div className="w-full h-1 bg-surface-container-lowest rounded-full">
              <div className="h-full bg-error w-[15%]"></div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">High</span>
              <span className="font-bold text-[#ffb48a]">5</span>
            </div>
            <div className="w-full h-1 bg-surface-container-lowest rounded-full">
              <div className="h-full bg-[#ffb48a] w-[35%]"></div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Medium / Low</span>
              <span className="font-bold text-primary">12</span>
            </div>
            <div className="w-full h-1 bg-surface-container-lowest rounded-full">
              <div className="h-full bg-primary w-[50%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-outline-variant/10 gap-8">
          <button className="pb-4 text-sm font-semibold border-b-2 border-primary text-primary transition-all px-2">Privacy / Policy Findings</button>
          <button className="pb-4 text-sm font-medium text-slate-400 hover:text-on-surface transition-all px-2">OWASP Security Findings</button>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {/* Finding Card 1: Critical */}
        <div className="group bg-surface-container hover:bg-surface-container-high transition-all rounded-lg p-5 flex items-start gap-5 cursor-pointer relative overflow-hidden">
          <div className="w-1 absolute left-0 top-0 bottom-0 bg-error shadow-[0_0_8px_rgba(255,180,171,0.5)]"></div>
          <div className="mt-1 flex-shrink-0">
            <div className="px-2 py-1 bg-error/10 text-error text-[10px] font-bold rounded uppercase tracking-tighter text-center">Critical</div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-headline font-bold text-on-surface group-hover:text-white transition-colors">Missing Cookie Consent Banner</h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-[9px] font-bold bg-surface-container-lowest border border-outline-variant/20 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-widest">GDPR/NĐ13</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">chevron_right</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">The website fails to request explicit consent before deploying non-essential cookies. This violates privacy regulations regarding user data tracking.</p>
          </div>
        </div>

        {/* Finding Card 2: High */}
        <div className="group bg-surface-container hover:bg-surface-container-high transition-all rounded-lg p-5 flex items-start gap-5 cursor-pointer relative overflow-hidden">
          <div className="w-1 absolute left-0 top-0 bottom-0 bg-[#ffb48a] shadow-[0_0_8px_rgba(255,180,138,0.5)]"></div>
          <div className="mt-1 flex-shrink-0">
            <div className="px-2 py-1 bg-[#ffb48a]/10 text-[#ffb48a] text-[10px] font-bold rounded uppercase tracking-tighter text-center">High</div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-headline font-bold text-on-surface group-hover:text-white transition-colors">SQL Injection Vulnerability</h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-[9px] font-bold bg-surface-container-lowest border border-outline-variant/20 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-widest">OWASP A03</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">chevron_right</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">Unsanitized user input detected in the login form. This could allow an attacker to execute arbitrary database queries and bypass authentication.</p>
          </div>
        </div>

        {/* Finding Card 3: Medium */}
        <div className="group bg-surface-container hover:bg-surface-container-high transition-all rounded-lg p-5 flex items-start gap-5 cursor-pointer relative overflow-hidden">
          <div className="w-1 absolute left-0 top-0 bottom-0 bg-[#f9e18d] shadow-[0_0_8px_rgba(249,225,141,0.5)]"></div>
          <div className="mt-1 flex-shrink-0">
            <div className="px-2 py-1 bg-[#f9e18d]/10 text-[#f9e18d] text-[10px] font-bold rounded uppercase tracking-tighter text-center">Medium</div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-headline font-bold text-on-surface group-hover:text-white transition-colors">Broken Access Control</h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-[9px] font-bold bg-surface-container-lowest border border-outline-variant/20 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-widest">OWASP A01</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">chevron_right</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">Certain administrative endpoints are accessible by standard user accounts. This allows potential privilege escalation.</p>
          </div>
        </div>

        {/* Finding Card 4: Low */}
        <div className="group bg-surface-container hover:bg-surface-container-high transition-all rounded-lg p-5 flex items-start gap-5 cursor-pointer relative overflow-hidden">
          <div className="w-1 absolute left-0 top-0 bottom-0 bg-primary shadow-[0_0_8px_rgba(173,198,255,0.5)]"></div>
          <div className="mt-1 flex-shrink-0">
            <div className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-tighter text-center">Low</div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-headline font-bold text-on-surface group-hover:text-white transition-colors">Information Disclosure in Headers</h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-[9px] font-bold bg-surface-container-lowest border border-outline-variant/20 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-widest">OWASP A05</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">chevron_right</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">Server version information is being leaked in the HTTP response headers, which could aid an attacker in reconnaissance.</p>
          </div>
        </div>

        {/* Finding Card 5: Pass */}
        <div className="group bg-surface-container hover:bg-surface-container-high transition-all rounded-lg p-5 flex items-start gap-5 cursor-pointer relative overflow-hidden">
          <div className="w-1 absolute left-0 top-0 bottom-0 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          <div className="mt-1 flex-shrink-0">
            <div className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded uppercase tracking-tighter text-center">Pass</div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-headline font-bold text-on-surface group-hover:text-white transition-colors">Secure Data Transmission</h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-[9px] font-bold bg-surface-container-lowest border border-outline-variant/20 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-widest">OWASP A02</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">chevron_right</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">TLS 1.3 is enforced with strong cipher suites across all endpoints. No plaintext transmission detected.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
