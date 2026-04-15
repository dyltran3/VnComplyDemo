"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      router.replace("/login");
    } else {
      const roleMap: Record<string, string> = {
        Admin: "/admin",
        User: "/user",
        Auditor: "/auditor",
        Business: "/business"
      };
      router.replace(roleMap[role] || "/login");
    }
  }, [router]);

  return (
    <div className="h-screen w-screen bg-[#0b1326] flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin text-[#adc6ff] mb-4" size={48} />
      <span className="font-bold tracking-widest text-slate-400 uppercase text-sm">Redirecting to Sentinel Portal...</span>
    </div>
  );
}
