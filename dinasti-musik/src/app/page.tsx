"use client";

import React from "react";
import { Hero } from "@/components/home/Hero";
import { InstrumentDetailGallery } from "@/components/home/InstrumentDetailGallery";
import { StoreInfoSection } from "@/components/home/StoreInfoSection";
import { useApp } from "@/components/layout/AppProvider";

export default function HomePage() {
  const { storeConfig, openAuthModal } = useApp();

  const handleExplore = () => {
    // Scroll halus ke galeri detail instrumen resolusi tinggi
    const target = document.getElementById("galeri-detail");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: window.innerHeight * 0.85,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#080F0F]">
      {/* 1. Hero Section */}
      <Hero onExplore={handleExplore} />

      {/* 2. Galeri Foto Detail Instrumen Resolusi Tinggi (Pengganti 3D) */}
      <InstrumentDetailGallery />

      {/* 3. Section "Tentang Toko" */}
      <StoreInfoSection config={storeConfig} onOpenAuth={openAuthModal} />
    </div>
  );
}
