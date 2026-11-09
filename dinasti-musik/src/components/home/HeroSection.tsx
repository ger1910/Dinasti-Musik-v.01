'use client';

import React from 'react';
import { ArrowUpRight, ShieldCheck, Guitar, Piano, Drum, Mic } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onOpenOwner: () => void;
  onSelectCategory: (cat: string) => void;
}

export function HeroSection({ onExplore, onOpenOwner, onSelectCategory }: HeroSectionProps) {
  return (
    <section className="relative pt-6 pb-16 md:pt-10 md:pb-24 px-4 max-w-7xl mx-auto w-full space-y-16">
      {/* Cinematic Hero Card */}
      <div className="relative rounded-[2rem] overflow-hidden bg-[#080F0F] text-white py-20 px-6 sm:px-12 md:py-28 text-center shadow-2xl border border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080F0F] via-[#080F0F]/60 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] text-[#e9b999] font-bold">
            Dinasti Musik Store &amp; Gallery
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Selamat Datang di <br />
            <span className="italic font-normal text-[#e9b999]">Dinasti Musik</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
            Koleksi instrumen musik pilihan dari produsen ternama dunia. Garansi autentik,
            pengiriman aman, dan didukung garansi resmi musisi profesional.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onExplore}
              className="btn-island group shadow-lg bg-[#bb6a33] hover:bg-[#A97E4F]"
            >
              <span>Jelajahi Katalog Produk</span>
              <div className="btn-island-bubble bg-white/20">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={onOpenOwner}
              className="px-6 py-3 rounded-full text-xs font-semibold border border-white/20 bg-white/10 hover:bg-white/15 text-white transition active:scale-95 flex items-center gap-2 backdrop-blur-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[#e9b999]" />
              <span>Profil Pemilik Toko</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kategori Pilihan (Team Style with Modern Cards) */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#080F0F]">
              Kategori Pilihan
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Pilih kategori instrumen untuk menyaring instrumen impian Anda
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('Semua')}
            className="text-xs font-semibold text-[#bb6a33] hover:underline"
          >
            Lihat Semua →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Gitar */}
          <div
            onClick={() => onSelectCategory('Gitar')}
            className="card card-interactive cursor-pointer p-6 group text-center bg-white border border-black/[0.06] rounded-2xl hover:border-[#bb6a33]/40 transition-all hover:-translate-y-1 shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#080F0F]/5 text-[#bb6a33] flex items-center justify-center mx-auto mb-3.5 group-hover:bg-[#bb6a33] group-hover:text-white transition-colors duration-300">
              <Guitar className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#080F0F]">Gitar</h3>
            <p className="text-[11px] text-gray-400 mt-1">Akustik &amp; Listrik</p>
          </div>

          {/* Keyboard & Piano */}
          <div
            onClick={() => onSelectCategory('Keyboard & Piano')}
            className="card card-interactive cursor-pointer p-6 group text-center bg-white border border-black/[0.06] rounded-2xl hover:border-[#bb6a33]/40 transition-all hover:-translate-y-1 shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#080F0F]/5 text-[#bb6a33] flex items-center justify-center mx-auto mb-3.5 group-hover:bg-[#bb6a33] group-hover:text-white transition-colors duration-300">
              <Piano className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#080F0F]">Keyboard &amp; Piano</h3>
            <p className="text-[11px] text-gray-400 mt-1">Stage &amp; Upright</p>
          </div>

          {/* Drum & Perkusi */}
          <div
            onClick={() => onSelectCategory('Drum & Perkusi')}
            className="card card-interactive cursor-pointer p-6 group text-center bg-white border border-black/[0.06] rounded-2xl hover:border-[#bb6a33]/40 transition-all hover:-translate-y-1 shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#080F0F]/5 text-[#bb6a33] flex items-center justify-center mx-auto mb-3.5 group-hover:bg-[#bb6a33] group-hover:text-white transition-colors duration-300">
              <Drum className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#080F0F]">Drum &amp; Perkusi</h3>
            <p className="text-[11px] text-gray-400 mt-1">E-Drums &amp; Acoustic</p>
          </div>

          {/* Audio & Studio */}
          <div
            onClick={() => onSelectCategory('Audio & Studio')}
            className="card card-interactive cursor-pointer p-6 group text-center bg-white border border-black/[0.06] rounded-2xl hover:border-[#bb6a33]/40 transition-all hover:-translate-y-1 shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#080F0F]/5 text-[#bb6a33] flex items-center justify-center mx-auto mb-3.5 group-hover:bg-[#bb6a33] group-hover:text-white transition-colors duration-300">
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#080F0F]">Audio &amp; Studio</h3>
            <p className="text-[11px] text-gray-400 mt-1">Mic &amp; Interface</p>
          </div>
        </div>
      </div>
    </section>
  );
}
