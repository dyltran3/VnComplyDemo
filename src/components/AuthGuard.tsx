"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children, requiredRole }: { children: React.ReactNode, requiredRole: string }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      router.replace("/login");
    } else if (role !== requiredRole) {
      // Unathorized access across portals, force re-login
      localStorage.removeItem("userRole");
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router, requiredRole]);

  if (!isAuthorized) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0b1326] text-white">
         <Loader2 className="animate-spin text-[#adc6ff] mb-4" size={48} />
         <span className="font-bold tracking-widest text-slate-400 uppercase text-sm">Verifying Access...</span>
      </div>
    );
  }

  return <>{children}</>;
}
