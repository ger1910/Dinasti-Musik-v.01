"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowDown, LogIn, ChevronRight } from "lucide-react";

interface GuitarScrollSequenceProps {
  onOpenAuth: () => void;
}

const TOTAL_FRAMES = 60;
const FRAME_PATH_PREFIX = "/frames/frame_";
const FRAME_EXTENSION = ".webp";

function getFrameUrl(index: number): string {
  const padIndex = String(index).padStart(4, "0");
  return `${FRAME_PATH_PREFIX}${padIndex}${FRAME_EXTENSION}`;
}

interface TextAnnotation {
  id: string;
  min: number;
  max: number;
  step: string;
  title: string;
  desc: string;
  specs: string[];
}

const ANNOTATIONS: TextAnnotation[] = [
  {
    id: "overview",
    min: 0.0,
    max: 0.12,
    step: "01",
    title: "Anatomi & Konstruksi Pilihan",
    desc: "Setiap kurasi instrumen melalui pengujian stabilitas kayu dan tegangan senar agar siap panggung maupun rekaman studio berjam-jam.",
    specs: ["Hand-Inspected", "Studio Grade", "Solid Tonewood"],
  },
  {
    id: "headstock",
    min: 0.15,
    max: 0.35,
    step: "02",
    title: "Headstock & Tuning Pegs",
    desc: "Rasio gir 18:1 dengan die-cast tertutup rapat. Presisi nada terkunci stabil tanpa risiko pitch meleset saat teknik bending agresif.",
    specs: ["18:1 Gear Ratio", "Bone Nut 42mm", "Tuning Stability"],
  },
  {
    id: "neck",
    min: 0.38,
    max: 0.58,
    step: "03",
    title: "Neck & Fretboard",
    desc: "Kayu maple quarter-sawn dengan fretboard rosewood radius 9.5 inci. Transisi posisi chord terasa licin dan bebas hambatan fisik.",
    specs: ["Hard Maple Neck", "Indian Rosewood 22F", "Modern-C Radius 9.5\""],
  },
  {
    id: "body",
    min: 0.60,
    max: 0.78,
    step: "04",
    title: "Body & Transmisi Akustik",
    desc: "Bodi solid alder dengan resonansi mid-range tebal. Menyalurkan sustain alami yang langsung diterjemahkan oleh pickup Alnico V.",
    specs: ["Selected Solid Alder", "Alnico V Pickups", "Resonant Cavity"],
  },
  {
    id: "bridge",
    min: 0.80,
    max: 0.92,
    step: "05",
    title: "Bridge & Intonasi Nada",
    desc: "Saddle baja cor mentransfer getaran senar langsung ke poros bodi instrumen. Artikulasi tiap nada terdengar bulat dan jernih.",
    specs: ["Steel Tremolo Block", "Micro-intonation Saddles", "Zero Dead-Spot"],
  },
];

export function GuitarScrollSequence({ onOpenAuth }: GuitarScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const activeFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);

  const [currentProgress, setCurrentProgress] = useState<number>(0);

  // Gambar frame ke canvas dengan object-fit cover
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current.get(frameIndex) || imagesRef.current.get(1);
    if (!img || !img.complete) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    drawFrame(activeFrameRef.current);
  }, [drawFrame]);

  // Preload frame
  useEffect(() => {
    let isCancelled = false;

    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current.set(1, firstImg);
      handleResize();
    };

    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        if (isCancelled) return;
        imagesRef.current.set(i, img);
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [handleResize]);

  // Resize listener
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Scroll listener & Lerp animation loop
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDistance = rect.height - windowHeight;

      if (scrollableDistance <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
      targetFrameRef.current = Math.max(
        1,
        Math.min(TOTAL_FRAMES, Math.round(progress * (TOTAL_FRAMES - 1)) + 1)
      );
      setCurrentProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const renderLoop = () => {
      const target = targetFrameRef.current;
      const current = activeFrameRef.current;

      const diff = target - current;
      if (Math.abs(diff) > 0.1) {
        const next = current + diff * 0.14;
        activeFrameRef.current = next;
        drawFrame(Math.round(next));
      } else if (current !== target) {
        activeFrameRef.current = target;
        drawFrame(target);
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawFrame]);

  const activeAnno = ANNOTATIONS.find(
    (a) => currentProgress >= a.min && currentProgress <= a.max
  );
  const isFinalCta = currentProgress >= 0.93;

  return (
    <section
      ref={containerRef}
      className="relative h-[380vh] md:h-[460vh] bg-[#080F0F] text-[#F3F0E8]"
      aria-label="Interactive 3D Guitar Teardown"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Canvas 3D Frame Sequence (Selalu Aktif) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Ambient Film Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#080F0F]/40 to-[#080F0F]/90 pointer-events-none z-10" />

        {/* HUD Top-Left: Metadata Minimalis */}
        <div className="absolute top-8 left-6 md:left-12 z-20 pointer-events-none hidden sm:block">
          <div className="flex items-center gap-3 text-xs font-mono tracking-wider text-white/50">
            <span className="text-[#bb6a33] font-bold">FRAME {String(Math.max(1, Math.min(TOTAL_FRAMES, Math.round(currentProgress * 59) + 1))).padStart(2, "0")}</span>
            <span>/</span>
            <span>60 ROTATION</span>
          </div>
        </div>

        {/* HUD Top-Right: Petunjuk Scroll Bersih */}
        <div className="absolute top-8 right-6 md:right-12 z-20 pointer-events-none hidden sm:flex items-center gap-2 text-white/40 text-xs font-mono">
          <span>Scroll untuk rotasi</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#bb6a33] animate-bounce" />
        </div>

        {/* Anotasi Tipografis Tipis (Bukan Kartu Kotak AI) */}
        {activeAnno && !isFinalCta && (
          <div
            key={activeAnno.id}
            className="absolute bottom-16 md:bottom-20 left-4 md:left-12 max-w-lg z-20 transition-all duration-500 animate-in fade-in"
          >
            <div className="border-l-2 border-[#bb6a33] pl-6 space-y-3 bg-[#080F0F]/80 backdrop-blur-md py-4 pr-6 rounded-r-2xl">
              <span className="text-xs font-mono text-[#bb6a33] font-semibold tracking-widest block">
                [ BAGIAN {activeAnno.step} ]
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white tracking-tight">
                {activeAnno.title}
              </h2>
              <p className="text-sm text-white/75 leading-relaxed font-sans">
                {activeAnno.desc}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {activeAnno.specs.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono text-white/60 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Final Screen: Ajakan Masuk Bersih */}
        {isFinalCta && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
            <div className="max-w-xl text-center space-y-6">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
                Instrumen Siap Eksplorasi
              </h2>
              <p className="text-sm md:text-base text-white/70 max-w-md mx-auto leading-relaxed">
                Katalog lengkap, spesifikasi luthier, dan status ketersediaan stok dapat diakses setelah masuk ke akun Anda.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#bb6a33] hover:bg-[#A97E4F] text-white text-xs font-bold uppercase tracking-wider transition shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk untuk Membuka Katalog</span>
                </button>
                <a
                  href="#tentang-toko"
                  className="text-xs text-white/70 hover:text-white transition flex items-center gap-1 font-mono uppercase tracking-wider"
                >
                  <span>Baca Info Showroom</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#bb6a33]" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar Tipis di Bawah */}
        <div className="absolute bottom-6 right-6 md:right-12 z-20 flex items-center gap-3 text-xs font-mono text-white/50">
          <div className="w-24 h-[2px] bg-white/15">
            <div
              className="h-full bg-[#bb6a33] transition-all"
              style={{ width: `${Math.round(currentProgress * 100)}%` }}
            />
          </div>
          <span>{Math.round(currentProgress * 100)}%</span>
        </div>
      </div>
    </section>
  );
}
