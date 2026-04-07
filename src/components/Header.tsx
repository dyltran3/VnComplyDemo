import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-16 z-40 bg-[#0b1326]/70 backdrop-blur-xl flex justify-between items-center px-8 border-b border-white/5 font-body text-sm">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text"
            className="w-full bg-[#060e20] border-none rounded-lg pl-10 pr-4 py-2 text-on-background placeholder:text-slate-500 focus:ring-1 focus:ring-[#3cddc7]/40 transition-all"
            placeholder="Search assessments, assets, or compliance logs..."
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-4">
          <button className="text-slate-400 hover:text-white transition-all relative">
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#3cddc7] rounded-full border-2 border-[#0b1326]"></span>
          </button>
          <button className="text-slate-400 hover:text-white transition-all">
            <span className="material-symbols-outlined text-xl">help</span>
          </button>
        </div>

        <div className="h-6 w-[1px] bg-white/10 hidden lg:block"></div>

        <div className="flex items-center gap-3 pl-2 cursor-pointer">
          <div className="text-right hidden xl:block">
            <p className="text-xs font-bold text-on-background leading-none">Alex Mercer</p>
            <p className="text-[10px] text-slate-500">Security Architect</p>
          </div>
          <div className="w-8 h-8 rounded-full border border-primary/20 overflow-hidden bg-surface-container-highest">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoKsu6zoe4U7aFJd4kD0Lges4YsOHlCyKb8Bc6g0Iuvkf2-KSw7sa7b8akKKgSTchI45m4qU-BVbxwyJ4coUPG0dM1f9cUUDp2SzT35MyzaS0Y4VmbdU7pPb3ioUGbnmQtyq8VXF85ezh-VDuACWVvENRqfogNkgIF20jJeNMlr9dVJ5q8tv_QXVRHSdklTPTdViu0gsVQhsPluCL2GWlbT7K2p50Jw4IIeA2ktbyUg-PgBN3k5PqVwr7zurqLX89qTs2tqt5r1VVB"
              alt="User Profile"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>
    </header>
  );
}
