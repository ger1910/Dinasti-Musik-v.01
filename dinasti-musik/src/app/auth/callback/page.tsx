"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GoogleAuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Memproses otentikasi akun Google...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuth() {
      try {
        // Ambil token dari hash fragment atau search query
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash || window.location.search);
        const idToken = params.get("id_token");
        const accessToken = params.get("access_token");

        if (idToken || accessToken) {
          setStatus("Menghubungkan profil Google ke Dinasti Musik...");
          
          let profile = { email: "", name: "", image: "" };

          if (accessToken) {
            try {
              const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              if (userinfoRes.ok) {
                const info = await userinfoRes.json();
                profile = {
                  email: info.email,
                  name: info.name || info.email.split("@")[0],
                  image: info.picture || "",
                };
              }
            } catch (fetchErr) {
              console.warn("Gagal mengambil userinfo langsung, menggunakan credential:", fetchErr);
            }
          }

          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              credential: idToken || undefined,
              email: profile.email || undefined,
              name: profile.name || undefined,
              image: profile.image || undefined,
            }),
          });

          const data = await res.json();
          if (res.ok) {
            setStatus("Berhasil masuk! Mengarahkan ke beranda...");
            window.location.href = "/";
          } else {
            setError(data.error || "Gagal verifikasi dengan server.");
          }
        } else {
          setError("Tidak menemukan token otentikasi dari Google.");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan sistem saat memproses login Google.");
      }
    }

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#080F0F] flex items-center justify-center p-4 text-white">
      <div className="bg-[#141414] border border-[#292929] max-w-md w-full p-8 rounded-2xl text-center shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-[#bb6a33]/10 text-[#bb6a33] flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          DM
        </div>

        {error ? (
          <div>
            <h2 className="text-lg font-bold text-red-400 mb-2">Gagal Masuk Google</h2>
            <p className="text-xs text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-2.5 bg-[#bb6a33] hover:bg-[#a55a29] text-white text-xs font-semibold rounded-full transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        ) : (
          <div>
            <div className="w-6 h-6 border-2 border-[#bb6a33] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-base font-bold text-white mb-2">Login dengan Google</h2>
            <p className="text-xs text-gray-400">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}

