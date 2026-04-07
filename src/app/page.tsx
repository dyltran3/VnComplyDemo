import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="px-8 py-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Hero Section: Run New Scan */}
      <section className="relative overflow-hidden bg-primary-container rounded-xl p-10 border border-outline-variant/10">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-headline font-extrabold text-white mb-2">Initiate Compliance Audit</h3>
          <p className="text-on-secondary-container mb-8 text-lg font-body leading-relaxed">
            Assess your target infrastructure for security vulnerabilities and privacy compliance in real-time.
          </p>

          <form className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">link</span>
              <input
                type="text"
                className="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary/40 text-on-surface py-4 pl-12 pr-4 rounded-lg placeholder-slate-500 font-body transition-all"
                placeholder="Target URL (e.g., https://example.com)"
                required
              />
            </div>
            <Link href="/results">
              <button
                type="button"
                className="w-full sm:w-auto h-full bg-primary text-on-primary font-bold px-8 py-4 rounded-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">rocket_launch</span>
                Start Scan
              </button>
            </Link>
          </form>
        </div>

        {/* Background Decoration */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 hidden lg:block">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCywiPMgzbpdF54yqIMMTtzHY2L16HZE1Po3YeydzopoYez-DV1Uxuika-B0xi4UPYp5abX3XklpHKgHtmuSHlWw4M0Grgcqm9yauiGZuA4Dbk_Swhy26ju0NOTib2WXx5Y8E1w04FfXmqnFPLVRSCpmZVk0e94Hye8UZ6fcYm7xJiqJ-T8xe4w-F-915o6BvclJLJLHNAI7nszCNukPWb05Qd0nZYEYTeGE1PUQHM_daRTUXTIeBL5D75pPjKrbEiIrTo007HR8BmJ"
            alt="Cyber Security Visual"
            fill
            className="object-cover mix-blend-overlay"
            unoptimized
          />
        </div>
      </section>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Privacy Score */}
        <div className="bg-surface-container rounded-xl p-8 flex items-center justify-between group hover:bg-surface-container-high transition-colors">
          <div className="space-y-1">
            <p className="text-slate-400 font-label text-sm uppercase tracking-widest">Privacy Score</p>
            <h4 className="text-4xl font-headline font-bold text-tertiary">85/100</h4>
            <p className="text-on-tertiary-container text-xs flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +4.2% from last scan
            </p>
          </div>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-container-lowest" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="37.68" className="text-tertiary" />
            </svg>
            <span className="material-symbols-outlined absolute text-tertiary text-3xl">lock_open</span>
          </div>
        </div>

        {/* Security Score */}
        <div className="bg-surface-container rounded-xl p-8 flex items-center justify-between group hover:bg-surface-container-high transition-colors">
          <div className="space-y-1">
            <p className="text-slate-400 font-label text-sm uppercase tracking-widest">Security Score</p>
            <h4 className="text-4xl font-headline font-bold text-primary">72/100</h4>
            <p className="text-[#ffb48a] text-xs flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-xs">warning</span>
              2 open vulnerabilities detected
            </p>
          </div>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-container-lowest" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="70.33" className="text-primary" />
            </svg>
            <span className="material-symbols-outlined absolute text-primary text-3xl">shield</span>
          </div>
        </div>
      </div>

      {/* Recent Scans Table */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden">
        <div className="px-8 py-6 flex justify-between items-center border-b border-outline-variant/5">
          <h3 className="text-xl font-headline font-bold">Recent Intelligence Scans</h3>
          <div className="flex gap-2">
            <button className="bg-surface-container p-2 rounded hover:bg-surface-container-high transition-colors text-slate-400">
              <span className="material-symbols-outlined text-lg">filter_list</span>
            </button>
            <button className="bg-surface-container p-2 rounded hover:bg-surface-container-high transition-colors text-slate-400">
              <span className="material-symbols-outlined text-lg">download</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container/30 text-slate-400 text-xs font-label uppercase tracking-widest">
                <th className="px-8 py-4 font-semibold">Target URL</th>
                <th className="px-8 py-4 font-semibold">Date</th>
                <th className="px-8 py-4 font-semibold">Status</th>
                <th className="px-8 py-4 font-semibold">Privacy</th>
                <th className="px-8 py-4 font-semibold">Security</th>
                <th className="px-8 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {/* Row 1 */}
              <tr className="hover:bg-surface-container transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-on-surface font-semibold text-sm">https://cloud.finance.io</span>
                    <span className="text-slate-500 text-xs">Production Infrastructure</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-slate-400">Oct 24, 2023</td>
                <td className="px-8 py-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    Completed
                  </div>
                </td>
                <td className="px-8 py-5 font-headline font-bold text-tertiary">92/100</td>
                <td className="px-8 py-5 font-headline font-bold text-primary">88/100</td>
                <td className="px-8 py-5 text-right">
                  <Link href="/results">
                    <button className="text-primary hover:text-white transition-colors p-2 hover:bg-primary-container rounded-lg">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </Link>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-surface-container transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-on-surface font-semibold text-sm">https://api.v2.services.net</span>
                    <span className="text-slate-500 text-xs">Endpoint Audit</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-slate-400">Oct 24, 2023</td>
                <td className="px-8 py-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    Scanning
                  </div>
                </td>
                <td className="px-8 py-5 font-headline font-bold text-slate-600">--</td>
                <td className="px-8 py-5 font-headline font-bold text-slate-600">--</td>
                <td className="px-8 py-5 text-right">
                  <button className="text-slate-500 cursor-not-allowed p-2">
                    <span className="material-symbols-outlined">hourglass_empty</span>
                  </button>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-surface-container transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-on-surface font-semibold text-sm">https://beta.app.io</span>
                    <span className="text-slate-500 text-xs">Sandbox Environment</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-slate-400">Oct 23, 2023</td>
                <td className="px-8 py-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    Completed
                  </div>
                </td>
                <td className="px-8 py-5 font-headline font-bold text-tertiary">78/100</td>
                <td className="px-8 py-5 font-headline font-bold text-error">42/100</td>
                <td className="px-8 py-5 text-right">
                  <Link href="/results">
                    <button className="text-primary hover:text-white transition-colors p-2 hover:bg-primary-container rounded-lg">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-8 py-4 bg-surface-container/10 flex items-center justify-between text-sm text-slate-500">
          <span>Showing 3 of 48 scans</span>
          <div className="flex gap-4">
            <button className="hover:text-primary transition-colors">Previous</button>
            <button className="hover:text-primary transition-colors font-bold text-primary">Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
