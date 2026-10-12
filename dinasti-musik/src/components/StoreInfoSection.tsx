"use client";

import React from "react";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Award,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Sparkles,
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

  const highlights = [
    {
      icon: ShieldCheck,
      title: "100% Orisinal & Autentik",
      desc: "Semua instrumen didatangkan langsung melalui distributor resmi dengan sertifikat keaslian dan nomor seri terdaftar.",
    },
    {
      icon: Award,
      title: "Inspeksi 24 Titik Profesional",
      desc: "Setiap gitar, drum, dan keyboard dicek intonasi, action, fret leveling, dan kelistrikannya oleh luthier berpengalaman sebelum dikirim.",
    },
    {
      icon: Truck,
      title: "Proteksi Pengiriman Berasuransi",
      desc: "Packing kayu solid khusus alat musik, bubble wrap berlapis, dan asuransi penuh untuk pengiriman ke seluruh kota di Indonesia.",
    },
    {
      icon: Sparkles,
      title: "Konsultasi Nada & Setup Khusus",
      desc: "Layanan konsultasi pemilihan instrumen dan kustomisasi string action gratis bagi seluruh pelanggan Dinasti Musik.",
    },
  ];

  return (
    <section
      id="tentang-toko"
      className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-16 bg-[#080F0F] text-[#F3F0E8] scroll-mt-20"
      aria-label="Tentang Dinasti Musik"
    >
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#bb6a33] font-bold block">
          GALERI &amp; WORKSHOP RESMI
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          Tentang <span className="text-[#C59B6D] italic">{storeName}</span>
        </h2>
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
          {bio}
        </p>
      </div>

      {/* 4 Kartu Keunggulan (Struktur Foto 3 Bagian Atas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {highlights.map((h, i) => {
          const Icon = h.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#0c1414] border border-white/10 hover:border-[#bb6a33]/40 transition-all duration-300 space-y-3 shadow-lg group relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#bb6a33] group-hover:scale-105 group-hover:bg-[#bb6a33]/20 transition-all">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-white">{h.title}</h3>
              <p className="text-xs text-white/65 leading-relaxed font-sans">{h.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 2 Kolom Besar (Struktur Foto 3 Bagian Bawah) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Kolom Kiri: Bandung Showroom */}
        <div className="lg:col-span-5 p-8 rounded-2xl bg-[#0c1414] border border-white/10 flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#bb6a33] font-bold block mb-1">
                KUNJUNGI GALERI KAMI
              </span>
              <h3 className="font-serif font-bold text-2xl text-white">
                Bandung Showroom
              </h3>
            </div>

            <div className="space-y-3.5 text-xs text-white/80 font-sans">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#bb6a33] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white/90 font-medium">Alamat</strong>
                  <span className="text-white/70">{address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#bb6a33] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white/90 font-medium">Jam Operasional</strong>
                  <span className="text-white/70">{hours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#bb6a33] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white/90 font-medium">WhatsApp Konsultasi</strong>
                  <span className="text-white/70">+{whatsapp}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#bb6a33] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white/90 font-medium">Email Resmi</strong>
                  <span className="text-white/70">{email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <a
              href={`https://wa.me/${whatsapp}?text=Halo%20Dinasti%20Musik,%20saya%20tertarik%20dengan%20koleksi%20instrumen%20Anda.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-full bg-[#1E7E4A] hover:bg-[#16653A] text-white font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-sm active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi via WhatsApp</span>
            </a>

            {onOpenAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-3 rounded-full border border-white/20 hover:bg-white/5 text-white/80 text-xs font-semibold uppercase tracking-wider transition"
              >
                Masuk ke Akun Pelanggan
              </button>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Showroom & Testing Room */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0c1414] border border-white/10 overflow-hidden relative min-h-[340px] flex flex-col justify-between p-8 shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1600&auto=format&fit=crop&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080F0F] via-[#080F0F]/60 to-transparent" />

          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#bb6a33] font-bold">
              SHOWROOM &amp; TESTING ROOM
            </span>
            <h4 className="font-serif font-bold text-2xl text-white">
              Coba Langsung Instrumen Impian Anda
            </h4>
            <p className="text-xs sm:text-sm text-white/70 max-w-md leading-relaxed font-sans">
              Kami menyediakan ruangan kedap suara akustik bagi musisi yang ingin mencoba karakter suara instrumen sebelum memutuskan pembelian.
            </p>
          </div>

          <div className="relative z-10 pt-6 flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/90 font-sans">
              <CheckCircle2 className="w-4 h-4 text-[#bb6a33]" />
              <span>Acoustic Testing Booth</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/90 font-sans">
              <CheckCircle2 className="w-4 h-4 text-[#bb6a33]" />
              <span>Amp &amp; Pedalboard Rig</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/90 font-sans">
              <CheckCircle2 className="w-4 h-4 text-[#bb6a33]" />
              <span>On-site Luthier Setup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
