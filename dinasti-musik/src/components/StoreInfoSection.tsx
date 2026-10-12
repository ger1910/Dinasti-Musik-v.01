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

  const pillars = [
    {
      num: "01",
      title: "Kurasi Autentik & Legalitas Distributor",
      desc: "Tidak ada unit tiruan atau grey market. Setiap nomor seri gitar, synth, dan drum dapat dilacak dan terdaftar garansi resmi pabrikan.",
    },
    {
      num: "02",
      title: "Inspeksi 24 Titik & Kalibrasi Akustik",
      desc: "Sebelum instrumen diserahkan ke tangan musisi, action neck, kerataan fretwire, intonasi bridge, dan kelistrikan disetel presisi oleh luthier berpengalaman.",
    },
    {
      num: "03",
      title: "Proteksi Pengiriman Solid Wood Box",
      desc: "Pengiriman antar pulau menggunakan box kayu berbusa tebal dan asuransi penuh untuk menjamin instrumen tiba dalam kondisi zero-damage.",
    },
    {
      num: "04",
      title: "Ruang Uji Akustik Kedap Suara",
      desc: "Musisi dipersilakan mencoba karakter amplifier, pedalboard, dan intonasi instrumen secara privat di ruang studio uji Bandung kami.",
    },
  ];

  return (
    <section
      id="tentang-toko"
      className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-24 bg-[#080F0F] text-[#F3F0E8] scroll-mt-20 border-t border-white/10"
      aria-label="Profil dan Showroom Dinasti Musik"
    >
      {/* Editorial Headline & Pillars (Asymmetric Magazine Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Sisi Kiri: Pernyataan Karakter & Filosofi */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Standar Musisi, <br />
            Bukan Sekadar <span className="text-[#C59B6D] italic">Etalase Toko.</span>
          </h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans max-w-md">
            {storeName} didirikan atas dedikasi menghadirkan instrumen musik kualitas panggung dunia dengan rasa hormat penuh terhadap telinga dan tangan musisi Indonesia.
          </p>
          <div className="pt-4 flex items-center gap-6 text-xs font-mono text-white/50">
            <div>
              <span className="block text-2xl font-serif font-bold text-white">2018</span>
              <span>ESTABLISHED</span>
            </div>
            <div className="h-8 w-[1px] bg-white/15" />
            <div>
              <span className="block text-2xl font-serif font-bold text-[#bb6a33]">24-PT</span>
              <span>INSPECTION</span>
            </div>
            <div className="h-8 w-[1px] bg-white/15" />
            <div>
              <span className="block text-2xl font-serif font-bold text-white">100%</span>
              <span>ORIGINAL</span>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Daftar 4 Pilar Kualitas (Bukan Kotak-Kotak AI) */}
        <div className="lg:col-span-7 divide-y divide-white/10 border-t border-b border-white/10">
          {pillars.map((item) => (
            <div key={item.num} className="py-7 flex items-start gap-6 group">
              <span className="text-xs font-mono text-[#bb6a33] font-bold tracking-widest pt-1">
                [{item.num}]
              </span>
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-xl text-white group-hover:text-[#C59B6D] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/65 leading-relaxed font-sans max-w-xl">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Showroom & Informasi Kontak (Minimalist Gallery Invitation) */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0c1414] border border-white/10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-3xl sm:text-4xl text-white">
                Bandung Workshop &amp; Galeri
              </h3>
              <p className="text-sm text-white/70 max-w-lg leading-relaxed">
                Kunjungi kami untuk berdiskusi langsung seputar setup instrumen, string tension, atau konsultasi gear rekaman studio Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-white/80 pt-2 font-sans">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#bb6a33] shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#bb6a33] shrink-0 mt-0.5" />
                <span>{hours}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#bb6a33] shrink-0 mt-0.5" />
                <span>+{whatsapp}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#bb6a33] shrink-0 mt-0.5" />
                <span>{email}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <a
              href={`https://wa.me/${whatsapp}?text=Halo%20Dinasti%20Musik,%20saya%20ingin%20berkonsultasi%20seputar%20instrumen.`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 rounded-full bg-[#1E7E4A] hover:bg-[#16653A] text-white font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-sm active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi WhatsApp Langsung</span>
            </a>

            {onOpenAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="py-3.5 px-6 rounded-full border border-white/20 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider transition"
              >
                Masuk ke Akun Pelanggan
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
