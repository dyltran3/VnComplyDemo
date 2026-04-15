import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col h-screen py-6 bg-surface-container-low/95 backdrop-blur-3xl w-64 fixed left-0 top-0 z-50 shadow-2xl shadow-black/40 border-r border-white/10 transition-all duration-500">
      <div className="px-6 mb-10 flex items-center gap-3 group cursor-pointer">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            security
          </span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-[#adc6ff] font-headline">VnComply</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold leading-none">The Sentinel</p>
        </div>
      </div>

      <div className="px-4 mb-6">
        <Link href="/">
          <button className="w-full py-2.5 px-4 bg-primary text-on-primary font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">add</span>
            New Assessment
          </button>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-[#adc6ff] font-bold border-r-2 border-[#3cddc7] bg-[#171f33] transition-colors duration-200 rounded-l-lg">
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span>Dashboard</span>
        </Link>
        <Link href="/results" className="flex items-center gap-3 px-4 py-3 text-slate-400 font-medium hover:bg-[#171f33] hover:text-white transition-colors duration-200 rounded-lg">
          <span className="material-symbols-outlined text-lg">security</span>
          <span>Assessments</span>
        </Link>
        <Link href="/results" className="flex items-center gap-3 px-4 py-3 text-slate-400 font-medium hover:bg-[#171f33] hover:text-white transition-colors duration-200 rounded-lg">
          <span className="material-symbols-outlined text-lg">assignment</span>
          <span>Reports</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 font-medium hover:bg-[#171f33] hover:text-white transition-colors duration-200 rounded-lg">
          <span className="material-symbols-outlined text-lg">settings</span>
          <span>Settings</span>
        </Link>
      </nav>

      <footer className="px-3 pt-6 mt-6 border-t border-white/5 space-y-1">
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 font-medium hover:bg-[#171f33] hover:text-white transition-colors duration-200 rounded-lg">
          <span className="material-symbols-outlined text-lg">help</span>
          <span>Help Center</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 font-medium hover:bg-[#171f33] hover:text-white transition-colors duration-200 rounded-lg">
          <span className="material-symbols-outlined text-lg text-error">logout</span>
          <span>Log Out</span>
        </Link>
      </footer>
    </aside>
  );
}
