"use client";
import React, { useState } from "react";
import { X, Lock, Mail, Eye, EyeOff, User as UserIcon, Phone } from "lucide-react";
import { User } from "@/types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          onLoginSuccess(data.user);
          onClose();
        } else {
          setErrorMsg(data.error || "Email atau password tidak sesuai.");
        }
      } else {
        // Register flow
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, phone }),
        });
        const data = await res.json();
        if (res.ok) {
          onLoginSuccess(data.user);
          onClose();
        } else {
          setErrorMsg(data.error || "Gagal mendaftar.");
        }
      }
    } catch {
      setErrorMsg("Terjadi kesalahan koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-[#292929] max-w-sm w-full p-6 sm:p-8 shadow-2xl text-[#0D1317] dark:text-[#F3F0E8] relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto rounded-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 bg-gray-50 hover:bg-gray-100 dark:bg-[#1c1c1c] dark:hover:bg-[#222222] text-gray-500 hover:text-[#0D1317] dark:text-[#999999] dark:hover:text-[#F3F0E8] border border-black/[0.07] dark:border-[#292929] transition-colors z-10 rounded-lg"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6 mt-1">
          <div className="w-9 h-9 bg-[#D97732] flex items-center justify-center text-white font-bold text-xs tracking-tight mx-auto mb-3">
            DM
          </div>
          <h3 className="font-bold text-lg text-[#0D1317] dark:text-[#F3F0E8]">
            {mode === "login" ? "Masuk ke Akun" : "Daftar Akun Baru"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-[#999999] mt-1">
            {mode === "login"
              ? "Akses wishlist, keranjang, dan riwayat pesanan Anda"
              : "Bergabung bersama musisi Dinasti Musik"}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 text-xs text-red-600 dark:text-red-400 font-medium rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "register" && (
            <>
              <div>
                <label className="text-[11px] font-medium text-[#999999] block mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-[#292929] text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors"
                  />
                  <UserIcon className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[#999999] block mb-1">
                  Nomor WhatsApp <span className="text-[#666666]">(Opsional)</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-[#292929] text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors"
                  />
                  <Phone className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-2.5" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-medium text-gray-500 dark:text-[#999999] block mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-[#292929] text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors"
              />
              <Mail className="w-3.5 h-3.5 text-gray-400 dark:text-[#666666] absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-gray-500 dark:text-[#999999] block mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 bg-gray-50 dark:bg-[#1c1c1c] border border-black/[0.08] dark:border-[#292929] text-xs text-[#0D1317] dark:text-[#F3F0E8] focus:outline-none focus:border-[#bb6a33] rounded-lg transition-colors"
              />
              <Lock className="w-3.5 h-3.5 text-gray-400 dark:text-[#666666] absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 dark:text-[#666666] dark:hover:text-[#F3F0E8]"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#bb6a33] hover:bg-[#a55a29] text-white font-semibold text-xs tracking-wider uppercase transition-colors disabled:opacity-50 mt-2 rounded-full"
          >
            {loading ? "Memproses..." : (mode === "login" ? "Masuk Sekarang" : "Daftar Akun")}
          </button>
        </form>

        <div className="mt-4 text-center border-t border-black/[0.06] dark:border-[#292929] pt-3">
          {mode === "login" ? (
            <p className="text-[11px] text-gray-500 dark:text-[#999999]">
              Belum punya akun?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setErrorMsg("");
                }}
                className="text-[#bb6a33] font-semibold hover:underline"
              >
                Daftar sekarang
              </button>
            </p>
          ) : (
            <p className="text-[11px] text-gray-500 dark:text-[#999999]">
              Sudah memiliki akun?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                }}
                className="text-[#bb6a33] font-semibold hover:underline"
              >
                Masuk
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
