"use client";

import React, { useState } from "react";
import { X, Lock, Mail, Eye, EyeOff, User as UserIcon, Phone, AlertCircle, UserPlus, ArrowLeft } from "lucide-react";
import { User } from "@/types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

interface GoogleAccount {
  name: string;
  email: string;
  initials: string;
  avatarBg: string;
}

const GOOGLE_ACCOUNTS: GoogleAccount[] = [
  {
    name: "Geraldo Geraldo zeyyad",
    email: "geraldozeyyad3@gmail.com",
    initials: "G",
    avatarBg: "bg-[#795548]",
  },
  {
    name: "Zeyyad Vymanda",
    email: "zeyyadvymanda@gmail.com",
    initials: "Z",
    avatarBg: "bg-[#5c6bc0]",
  },
  {
    name: "Geraldo zeyyad Vymanda",
    email: "geraldo.zeyyad8@smk.belajar.id",
    initials: "G",
    avatarBg: "bg-[#78909c]",
  },
  {
    name: "geraldo zeyyad",
    email: "geraldozeyyad4@gmail.com",
    initials: "g",
    avatarBg: "bg-[#e65100]",
  },
  {
    name: "Khusus Ada",
    email: "adskhusus763@gmail.com",
    initials: "K",
    avatarBg: "bg-[#00897b]",
  },
  {
    name: "Rtx 5599",
    email: "rtx54921@gmail.com",
    initials: "R",
    avatarBg: "bg-[#d81b60]",
  },
];

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customEmailMode, setCustomEmailMode] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");

  // Form input state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  // Handler saat akun Google di-klik di jendela Choose an account
  const handleSelectGoogleAccount = async (targetEmail: string, targetName: string) => {
    setSelectedEmail(targetEmail);
    setGoogleLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName || targetEmail.split("@")[0],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowGoogleChooser(false);
        onClose();
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.error || "Gagal masuk dengan akun Google.");
      }
    } catch {
      setErrorMsg("Terjadi gangguan koneksi saat menghubungkan akun Google.");
    } finally {
      setGoogleLoading(false);
      setSelectedEmail(null);
    }
  };

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
          onClose();
          onLoginSuccess(data.user);
        } else {
          setErrorMsg(data.error || "Email atau password tidak sesuai.");
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, phone }),
        });
        const data = await res.json();
        if (res.ok) {
          onClose();
          onLoginSuccess(data.user);
        } else {
          setErrorMsg(data.error || "Gagal mendaftar akun baru.");
        }
      }
    } catch {
      setErrorMsg("Terjadi gangguan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      {/* ============================================================== */}
      {/* TAMPILAN 1: GOOGLE CHOOSE AN ACCOUNT PERSIS FOTO 3             */}
      {/* ============================================================== */}
      {showGoogleChooser ? (
        <div className="bg-[#1f1f1f] border border-[#333333] max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative animate-in zoom-in-95 duration-200 overflow-hidden font-sans">
          {/* Header bar Google */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                setShowGoogleChooser(false);
                setCustomEmailMode(false);
                setErrorMsg("");
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Kembali"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-xs text-gray-300 font-medium">Sign in with Google</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Logo Brand Aplikasi */}
          <div className="w-10 h-10 rounded-xl bg-[#D97732] flex items-center justify-center text-white font-bold text-sm tracking-tight mb-4 shadow-sm">
            DM
          </div>

          <h2 className="text-2xl font-normal text-white tracking-tight mb-1">
            Choose an account
          </h2>
          <p className="text-sm text-gray-400 mb-5">
            to continue to <span className="text-white font-medium">Dinasti Musik</span>
          </p>

          {errorMsg && (
            <div className="p-3 mb-4 bg-red-950/40 border border-red-500/40 text-xs text-red-400 font-medium rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Ketik Akun Lain jika dipilih */}
          {customEmailMode ? (
            <div className="mb-4 p-4 bg-[#141414] border border-[#2e2e2e] rounded-2xl">
              <span className="text-xs font-semibold text-gray-300 block mb-2">
                Masukkan Akun Google Lain
              </span>
              <input
                type="text"
                placeholder="Nama Anda"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#333333] text-xs text-white rounded-lg mb-2 focus:outline-none focus:border-[#4285F4]"
              />
              <input
                type="email"
                placeholder="nama@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#333333] text-xs text-white rounded-lg mb-3 focus:outline-none focus:border-[#4285F4]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCustomEmailMode(false)}
                  className="w-1/2 py-2 text-xs text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={!customEmail || googleLoading}
                  onClick={() => handleSelectGoogleAccount(customEmail, customName)}
                  className="w-1/2 py-2 bg-[#4285F4] hover:bg-[#3367d6] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {googleLoading ? "Masuk..." : "Lanjutkan"}
                </button>
              </div>
            </div>
          ) : (
            /* Daftar Akun Google Persis Foto 3 */
            <div className="divide-y divide-[#2d2d2d] border-t border-b border-[#2d2d2d] mb-6">
              {GOOGLE_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectGoogleAccount(acc.email, acc.name)}
                  disabled={googleLoading}
                  className="w-full py-3.5 px-2 flex items-center justify-between hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors text-left group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-8 h-8 rounded-full ${acc.avatarBg} text-white font-medium text-xs flex items-center justify-center uppercase shadow-xs shrink-0`}
                    >
                      {acc.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors leading-tight">
                        {acc.name}
                      </div>
                      <div className="text-xs text-gray-400 leading-tight mt-0.5">
                        {acc.email}
                      </div>
                    </div>
                  </div>

                  {googleLoading && selectedEmail === acc.email && (
                    <div className="w-4 h-4 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin shrink-0" />
                  )}
                </button>
              ))}

              {/* Opsi: Use another account */}
              <button
                type="button"
                onClick={() => setCustomEmailMode(true)}
                disabled={googleLoading}
                className="w-full py-3.5 px-2 flex items-center gap-3.5 hover:bg-white/[0.04] transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-300 shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-200 group-hover:text-white transition-colors">
                  Use another account
                </span>
              </button>
            </div>
          )}

          {/* Footer Google Info */}
          <p className="text-[11px] text-gray-400 leading-relaxed mb-6">
            Before using this app, you can review Dinasti Musik&apos;s{" "}
            <span className="text-blue-400 hover:underline cursor-pointer">Privacy Policy</span> and{" "}
            <span className="text-blue-400 hover:underline cursor-pointer">Terms of Service</span>.
          </p>

          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-3 border-t border-[#2d2d2d]">
            <span>English (United Kingdom)</span>
            <div className="flex gap-4">
              <span className="hover:text-gray-400 cursor-pointer">Help</span>
              <span className="hover:text-gray-400 cursor-pointer">Privacy</span>
              <span className="hover:text-gray-400 cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* TAMPILAN 2: MODAL CHATGPT STYLE (PERSIS FOTO 4)                */
        /* ============================================================== */
        <div className="bg-[#141414] border border-[#262626] max-w-sm w-full p-6 sm:p-8 rounded-2xl shadow-2xl text-[#F3F0E8] relative animate-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-[#1c1c1c] hover:bg-[#262626] text-gray-400 hover:text-white border border-[#2a2a2a] transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-6 mt-1">
            <h3 className="font-bold text-xl text-white">
              {mode === "login" ? "Log in or sign up" : "Buat akun baru"}
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              {mode === "login"
                ? "You'll get access to sound gear, cart, and orders."
                : "Bergabung bersama musisi Dinasti Musik."}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 bg-red-950/40 border border-red-500/40 text-xs text-red-400 font-medium rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tombol Utama: Continue with Google */}
          <button
            type="button"
            onClick={() => {
              setErrorMsg("");
              const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
              if (clientId) {
                // Real Google OAuth redirect flow
                const currentOrigin = window.location.origin;
                const redirectUri = `${currentOrigin}/auth/callback`;
                const params = new URLSearchParams({
                  client_id: clientId,
                  redirect_uri: redirectUri,
                  response_type: "token id_token",
                  scope: "openid email profile",
                  nonce: Math.random().toString(36).substring(2),
                  prompt: "select_account",
                });
                window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
              } else {
                setShowGoogleChooser(true);
              }
            }}
            disabled={loading}
            className="w-full py-3 px-4 bg-[#1f1f1f] hover:bg-[#282828] border border-[#333333] hover:border-[#444444] text-white text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-60 mb-4"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#262626]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#141414] px-2 text-gray-500 font-semibold tracking-wider">
                OR
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <>
                <div>
                  <label className="text-[11px] font-medium text-gray-400 block mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Anda"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#1a1a1a] border border-[#2b2b2b] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#bb6a33] rounded-xl transition-colors"
                    />
                    <UserIcon className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-gray-400 block mb-1">
                    Nomor WhatsApp <span className="text-gray-500">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812..."
                      className="w-full pl-9 pr-3 py-2.5 bg-[#1a1a1a] border border-[#2b2b2b] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#bb6a33] rounded-xl transition-colors"
                    />
                    <Phone className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-medium text-gray-400 block mb-1">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1a1a1a] border border-[#2b2b2b] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#bb6a33] rounded-xl transition-colors"
                />
                <Mail className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-400 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#1a1a1a] border border-[#2b2b2b] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#bb6a33] rounded-xl transition-colors"
                />
                <Lock className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#bb6a33] hover:bg-[#a55a29] text-white font-semibold text-xs rounded-full transition-colors disabled:opacity-50 mt-3"
            >
              {loading ? "Memproses..." : mode === "login" ? "Continue" : "Daftar Akun"}
            </button>
          </form>

          <div className="mt-5 text-center border-t border-[#262626] pt-3.5">
            {mode === "login" ? (
              <p className="text-xs text-gray-400">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => {
                    setMode("register");
                    setErrorMsg("");
                  }}
                  className="text-[#bb6a33] font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-xs text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                  }}
                  className="text-[#bb6a33] font-semibold hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
