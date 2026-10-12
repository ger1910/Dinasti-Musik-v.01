"use client";

import React, { useState } from "react";
import { Sparkles, Eye, ShieldCheck, Disc3 } from "lucide-react";

interface CollectionItem {
  id: string;
  badge: string;
  title: string;
  desc: string;
  specs: string[];
}

const COLLECTION_ITEMS: CollectionItem[] = [
  {
    id: "overview",
    badge: "ANATOMI INSTRUMEN",
    title: "Eksplorasi Detail 3D",
    desc: "Gulir ke bawah untuk membedah rancang bangun instrumen pilihan profesional Dinasti Musik. Setiap komponen dirawat dan diinspeksi secara manual.",
    specs: ["Hand-Inspected", "Studio Grade", "Solid Tonewood"],
  },
  {
    id: "headstock",
    badge: "PRESISI TUNING",
    title: "Headstock & Tuning Pegs",
    desc: "Gearing machine heads berasio tinggi 18:1 dengan kestabilan tremolo maksimal. Memastikan pitch gitar tetap solid bahkan saat bending agresif.",
    specs: ["Ratio 18:1 Sealed Die-cast", "Bone Nut 42mm", "Zero Pitch Slip"],
  },
  {
    id: "neck",
    badge: "ERGONOMI BERMAIN",
    title: "Neck & Fretboard",
    desc: "Profil modern C dengan radius 9.5 inci dilapisi rosewood terpilih. Memberikan kecepatan transisi chord dan kenyamanan bermain solo berjam-jam.",
    specs: ["Quarter-sawn Hard Maple", "Indian Rosewood 22 Frets", "Satin Poly Finish"],
  },
  {
    id: "body",
    badge: "AKUSTIK & ELEKTRONIK",
    title: "Body & Soundhole / Pickups",
    desc: "Bodi solid alder dengan resonansi hangat dan dinamika sustain panjang. Disempurnakan konfigurasi pickup hand-wound yang responsif terhadap dinamika petikan.",
    specs: ["Selected Solid Alder", "Alnico V Custom Voicing", "Shielded Cavity"],
  },
  {
    id: "bridge",
    badge: "TRANSFER GETARAN",
    title: "Bridge & Saddles Intonation",
    desc: "Sistem saddle baja cor yang mentransfer getaran senar langsung ke serat kayu. Menghasilkan artikulasi nada bersih dan intonasi presisi.",
    specs: ["Synchronized Tremolo", "Solid Steel Block", "Micro-adjust Saddles"],
  },
];

export function GuitarScrollSequence({ onOpenAuth }: { onOpenAuth: () => void }) {
  const [activeFrame, setActiveFrame] = useState(1);
  const [showViewer, setShowViewer] = useState(false);

  return (
    <section className="py-24 px-4 sm:px-6 max-w-6xl mx-auto space-y-12 bg-[#080F0F] text-[#F3F0E8]">
      {/* Header Koleksi Pilihan Profesional */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#bb6a33] font-bold block">
          ANATOMI INSTRUMEN
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Koleksi Pilihan Profesional
        </h2>
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
          Setiap instrumen di Dinasti Musik menjalani inspeksi detail 24 titik sebelum dipajang.
        </p>
      </div>

      {/* Grid 5 Kartu Anatomi (Struktur Foto 2 dengan Sentuhan Craftsmanship) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {COLLECTION_ITEMS.map((item) => (
          <div
            key={item.id}
            className="p-7 rounded-2xl bg-[#0c1414] border border-white/10 hover:border-[#bb6a33]/40 transition-all duration-300 space-y-3.5 shadow-lg group relative overflow-hidden"
          >
            {/* Subtle Copper Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#bb6a33]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#bb6a33]/15 transition-all" />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#bb6a33] font-bold tracking-widest">
                {item.badge}
              </span>
              {item.id === "overview" && (
                <button
                  type="button"
                  onClick={() => setShowViewer(!showViewer)}
                  className="text-[10px] font-mono uppercase text-[#e9b999] hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 transition"
                >
                  <Eye className="w-3 h-3 text-[#bb6a33]" />
                  <span>{showViewer ? "Tutup 3D" : "Putar 3D"}</span>
                </button>
              )}
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
              {item.title}
            </h3>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              {item.desc}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {item.specs.map((s, idx) => (
                <span
                  key={idx}
                  className="text-[10px] sm:text-[11px] font-mono px-3 py-1 rounded-md bg-white/5 border border-white/10 text-white/80"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive 3D Teardown Viewer Modal/Drawer Jika Pengguna Ingin Memutar 3D */}
      {showViewer && (
        <div className="p-8 rounded-3xl bg-[#0c1414] border border-[#bb6a33]/40 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#bb6a33] font-bold">
                INTERACTIVE 3D VIEWER
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                Rotasi Frame Anatomi Gitar
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-white/60">
                Frame: {String(activeFrame).padStart(2, "0")} / 60
              </span>
              <button
                type="button"
                onClick={() => setShowViewer(false)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-xs text-white"
              >
                Tutup
              </button>
            </div>
          </div>

          <div className="relative aspect-video max-w-2xl mx-auto rounded-2xl overflow-hidden bg-[#080F0F] border border-white/10 flex items-center justify-center">
            {/* Render Frame Aktif */}
            <img
              src={`/frames/frame_${String(activeFrame).padStart(4, "0")}.webp`}
              alt={`Frame ${activeFrame}`}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-xs font-mono text-white/60">
              <span>Putar Rotasi 360°:</span>
              <span className="text-[#bb6a33] font-bold">{Math.round((activeFrame / 60) * 360)}°</span>
            </div>
            <input
              type="range"
              min={1}
              max={60}
              value={activeFrame}
              onChange={(e) => setActiveFrame(Number(e.target.value))}
              className="w-full accent-[#bb6a33] cursor-pointer"
            />
          </div>
        </div>
      )}
    </section>
  );
}
