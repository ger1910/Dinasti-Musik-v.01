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
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight leading-tight">
          Koleksi Instrumen <br className="hidden md:block" /> Pilihan{" "}
          <span className="text-[#C59B6D] italic">Profesional</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          Temukan peralatan musik berkualitas untuk kebutuhan rekaman dan pertunjukan live.
        </p>
        <button
          onClick={onExplore}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#bb6a33] hover:bg-[#A97E4F] text-white font-bold tracking-wider uppercase transition shadow-xl hover:shadow-2xl hover:scale-105"
        >
          <span>Jelajahi Koleksi</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
