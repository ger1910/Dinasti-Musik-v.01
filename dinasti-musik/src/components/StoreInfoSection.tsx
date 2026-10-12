"use client";

import React from "react";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { StoreConfig } from "@/types";

interface StoreInfoSectionProps {
  config?: StoreConfig | null;
  onOpenAuth?: () => void;
}

export function StoreInfoSection({ config, onOpenAuth }: StoreInfoSectionProps) {
  const storeName = config?.name || "Dinasti Musik";
  const address = config?.address || "Jl. Pasir Rahayu IV, CC No. 22, Bandung";
  const hours = config?.openingHours || "Senin – Sabtu: 09.00 – 18.00 WIB";
  const whatsapp = config?.whatsapp || "6289512430608";
  const email = config?.email || "admin@dinastimusik.com";
  const bio =
    config?.bio ||
    "Dedikasi menyajikan instrumen musik kualitas dunia dan layanan profesional bagi musisi Indonesia.";

  return (
    <section
      id="tentang-toko"
      className="py-20 px-4 sm:px-6 bg-[#080F0F] text-[#F3F0E8] scroll-mt-20"
      aria-label="Tentang Dinasti Musik"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Kolom kiri: info toko */}
        <div className="lg:col-span-5 p-8 rounded-2xl bg-[#0c1414] border border-white/10 flex flex-col justify-between space-y-8 shadow-xl">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#bb6a33] font-bold block mb-2">
                GALERI & WORKSHOP RESMI
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white leading-tight">
                {storeName}
              </h2>
              <p className="text-sm text-white/55 leading-relaxed mt-3 max-w-xs">
                {bio}
              </p>
            </div>

            <div className="space-y-4 text-xs text-white/75 font-sans">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#bb6a33] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white/90 font-medium mb-0.5">Alamat</strong>
                  <span className="text-white/60">{address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#bb6a33] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white/90 font-medium mb-0.5">Jam Buka</strong>
                  <span className="text-white/60">{hours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#bb6a33] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white/90 font-medium mb-0.5">WhatsApp</strong>
                  <span className="text-white/60">+{whatsapp}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#bb6a33] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white/90 font-medium mb-0.5">Email</strong>
                  <span className="text-white/60">{email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <a
              href={`https://wa.me/${whatsapp}?text=Halo%20Dinasti%20Musik,%20saya%20tertarik%20dengan%20koleksi%20instrumen%20Anda.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-full bg-[#1E7E4A] hover:bg-[#16653A] text-white font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi via WhatsApp</span>
            </a>

            {onOpenAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-3 rounded-full border border-white/15 hover:bg-white/5 text-white/70 text-xs font-semibold uppercase tracking-wider transition"
              >
                Masuk ke Akun Pelanggan
              </button>
            )}
          </div>
        </div>

        {/* Kolom kanan: showroom visual */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0c1414] border border-white/10 overflow-hidden relative min-h-[360px] flex flex-col justify-end p-8 shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1600&auto=format&fit=crop&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080F0F] via-[#080F0F]/50 to-transparent" />

          <div className="relative z-10 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#bb6a33] font-bold block mb-1">
                SHOWROOM & TESTING ROOM
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white leading-tight">
                Coba Sebelum Beli
              </h3>
              <p className="text-sm text-white/55 leading-relaxed mt-2 max-w-md">
                Ruang kedap suara akustik tersedia untuk musisi yang ingin menguji karakter suara sebelum memutuskan.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Acoustic Booth", "Amp & Pedalboard Rig", "On-site Luthier"].map((item) => (
                <span
                  key={item}
                  className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
