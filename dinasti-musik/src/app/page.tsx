"use client";

import React from "react";
import { Hero } from "@/components/Hero";
import { GuitarScrollSequence } from "@/components/GuitarScrollSequence";
import { StoreInfoSection } from "@/components/StoreInfoSection";
import { useApp } from "@/components/AppProvider";

export default function HomePage() {
  const { storeConfig, openAuthModal } = useApp();

  const handleExplore = () => {
    // Scroll halus ke section eksplorasi interaktif 3D
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#080F0F]">
      {/* 1. Hero Section (Dipertahankan) */}
      <Hero onExplore={handleExplore} />

      {/* 2. Scroll-Driven 3D Canvas Teardown Section */}
      <GuitarScrollSequence onOpenAuth={openAuthModal} />

      {/* 3. Section "Tentang Toko" */}
      <StoreInfoSection config={storeConfig} onOpenAuth={openAuthModal} />
    </div>
  );
}
