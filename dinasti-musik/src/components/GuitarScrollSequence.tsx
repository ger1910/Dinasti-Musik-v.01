"use client";

import React, { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FRAMES = [
  {
    id: "overview",
    label: "01",
    title: "Dibuat untuk Bertahan",
    body: "Setiap instrumen di Dinasti Musik melewati 24 titik inspeksi sebelum dipajang. Bukan sekadar stok — pilihan yang dikurasi.",
    spec: "Hand-Inspected · Studio Grade · Solid Tonewood",
    frame: 1,
  },
  {
    id: "headstock",
    label: "02 — Headstock",
    title: "Presisi Tuning 18:1",
    body: "Machine heads berasio 18:1 memastikan pitch tetap solid bahkan setelah bending agresif. Bone nut 42mm tanpa slip.",
    spec: "Sealed Die-cast · Bone Nut 42mm · Zero Pitch Slip",
    frame: 12,
  },
  {
    id: "neck",
    label: "03 — Neck",
    title: "Ergonomi Jangka Panjang",
    body: "Profil modern C radius 9.5 inci. Quarter-sawn hard maple dengan lapisan rosewood — kecepatan transisi chord tanpa lelah.",
    spec: "Quarter-sawn Maple · Indian Rosewood · 22 Frets",
    frame: 25,
  },
  {
    id: "body",
    label: "04 — Body",
    title: "Karakter Suara Solid Alder",
    body: "Resonansi hangat dengan sustain panjang. Konfigurasi pickup hand-wound responsif terhadap dinamika petikan ringan hingga berat.",
    spec: "Solid Alder · Alnico V · Shielded Cavity",
    frame: 40,
  },
  {
    id: "bridge",
    label: "05 — Bridge",
    title: "Transfer Getaran Langsung",
    body: "Saddle baja cor mentransfer getaran senar ke serat kayu secara langsung. Intonasi presisi dengan micro-adjust per senar.",
    spec: "Synchronized Tremolo · Solid Steel Block · Micro-adjust",
    frame: 55,
  },
];

export function GuitarScrollSequence({ onOpenAuth }: { onOpenAuth: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [frameNum, setFrameNum] = useState(FRAMES[0].frame);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartFrame = useRef(FRAMES[0].frame);

  const active = FRAMES[activeIdx];

  const goTo = (idx: number) => {
    const next = Math.max(0, Math.min(FRAMES.length - 1, idx));
    setActiveIdx(next);
    setFrameNum(FRAMES[next].frame);
  };

  const handleDragStart = useCallback((clientX: number) => {
    setDragging(true);
    dragStartX.current = clientX;
    dragStartFrame.current = frameNum;
  }, [frameNum]);

  const handleDragMove = useCallback((clientX: number) => {
    if (!dragging) return;
    const delta = clientX - dragStartX.current;
    const next = Math.max(1, Math.min(60, dragStartFrame.current + Math.round(delta / 6)));
    setFrameNum(next);
  }, [dragging]);

  const handleDragEnd = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 bg-[#080F0F] text-[#F3F0E8]">
      <div className="max-w-6xl mx-auto">
        {/* Tab nav */}
        <div className="flex items-center gap-1 overflow-x-auto pb-4 border-b border-white/10 mb-12 scrollbar-none">
          {FRAMES.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => goTo(i)}
              className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-widest transition-all whitespace-nowrap ${
                i === activeIdx
                  ? "bg-[#bb6a33] text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Kiri: teks */}
          <div className="space-y-6">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
              {active.title}
            </h2>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-md">
              {active.body}
            </p>
            <p className="text-[11px] font-mono text-[#bb6a33] tracking-widest uppercase">
              {active.spec}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => goTo(activeIdx - 1)}
                disabled={activeIdx === 0}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 disabled:opacity-25 transition"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-white/30 tabular-nums">
                {String(activeIdx + 1).padStart(2, "0")} / {String(FRAMES.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => goTo(activeIdx + 1)}
                disabled={activeIdx === FRAMES.length - 1}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 disabled:opacity-25 transition"
                aria-label="Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#bb6a33] hover:bg-[#A97E4F] text-white text-xs font-semibold tracking-wider uppercase transition active:scale-95"
            >
              Lihat Koleksi Lengkap
            </button>
          </div>

          {/* Kanan: 360° viewer */}
          <div className="relative">
            <div
              className={`aspect-square max-w-lg mx-auto rounded-2xl overflow-hidden bg-[#0a1010] border border-white/10 flex items-center justify-center select-none ${
                dragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              onMouseDown={(e) => handleDragStart(e.clientX)}
              onMouseMove={(e) => handleDragMove(e.clientX)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => {
                e.preventDefault();
                handleDragMove(e.touches[0].clientX);
              }}
              onTouchEnd={handleDragEnd}
            >
              <img
                src={`/frames/frame_${String(frameNum).padStart(4, "0")}.webp`}
                alt={`${active.title} — frame ${frameNum}`}
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
              />
            </div>

            <div className="mt-4 px-1 space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-white/30">
                <span>Rotasi 360°</span>
                <span className="text-[#bb6a33]">{Math.round((frameNum / 60) * 360)}°</span>
              </div>
              <input
                type="range"
                min={1}
                max={60}
                value={frameNum}
                onChange={(e) => setFrameNum(Number(e.target.value))}
                className="w-full accent-[#bb6a33] cursor-pointer"
                aria-label="Putar frame 360 derajat"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
