"use client";
import React from "react";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onExplore: () => void;
}

export function Hero({ onExplore }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#080F0F]">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1600&auto=format&fit=crop&q=80"
          alt="Music Studio"
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080F0F] via-transparent to-[#080F0F]/80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080F0F_100%)] opacity-80"></div>
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-7">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#bb6a33] animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C59B6D] font-bold">
            Dinasti Musik • Studio &amp; Stage Gear
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-tight">
          Gear Pilihan Musisi, <br className="hidden md:block" /> Siap{" "}
          <span className="text-[#C59B6D] italic">Panggung &amp; Rekaman</span>
        </h1>

        <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Dari setup action senar, intonasi fret presisi, sampai karakter pickup—tiap instrumen di Dinasti Musik dikurasi langsung oleh telinga musisi. Langsung siap gas tanpa ribet setting ulang.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#bb6a33] hover:bg-[#a55a29] text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
          >
            <span>Jelajahi Koleksi Gear</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
