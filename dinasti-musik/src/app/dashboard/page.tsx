"use client";
import React from "react";
import { UserDashboard } from "@/components/UserDashboard";
import { useApp } from "@/components/AppProvider";
import { useRouter } from "next/navigation";
import { User, LogIn } from "lucide-react";

export default function DashboardPage() {
  const { user, setUser, openAuthModal } = useApp();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 bg-[#181818] border border-[#292929] text-[#D97732] flex items-center justify-center mb-4">
          <User className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-[#F3F0E8] mb-2">Akses Akun</h2>
        <p className="text-xs text-[#999999] mb-6 max-w-sm">
          Silakan masuk ke akun Dinasti Musik Anda untuk memantau pesanan dan data pengiriman.
        </p>
        <button
          onClick={openAuthModal}
          className="px-6 py-2.5 bg-[#D97732] hover:bg-[#c46828] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Masuk ke Akun</span>
        </button>
      </div>
    );
  }

  if (user.role === "owner") {
    router.replace("/admin");
    return null;
  }

  return (
    <UserDashboard
      user={user}
      onLogout={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/");
      }}
      onContinueShopping={() => router.push("/catalog")}
    />
  );
}
