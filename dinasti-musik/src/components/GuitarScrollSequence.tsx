"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowDown, LogIn, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";

interface GuitarScrollSequenceProps {
  onOpenAuth: () => void;
}

// Konfigurasi frame sequence
const TOTAL_FRAMES = 60;
const FRAME_PATH_PREFIX = "/frames/frame_";
const FRAME_EXTENSION = ".webp";

function getFrameUrl(index: number): string {
  const padIndex = String(index).padStart(4, "0");
  return `${FRAME_PATH_PREFIX}${padIndex}${FRAME_EXTENSION}`;
}

// Tahapan teks penjelasan bagian gitar
interface TextAnnotation {
  id: string;
  min: number;
  max: number;
  badge: string;
  title: string;
  desc: string;
  specs: string[];
}

const ANNOTATIONS: TextAnnotation[] = [
  {
    id: "overview",
    min: 0.0,
    max: 0.12,
    badge: "Anatomi Instrumen",
    title: "Eksplorasi Detail 3D",
    desc: "Gulir ke bawah untuk membedah rancang bangun instrumen pilihan profesional Dinasti Musik. Setiap komponen dirawat dan diinspeksi secara manual.",
    specs: ["Hand-Inspected", "Studio Grade", "Solid Tonewood"],
  },
  {
    id: "headstock",
    min: 0.15,
    max: 0.35,
    badge: "Presisi Tuning",
    title: "Headstock & Tuning Pegs",
    desc: "Gearing machine heads berasio tinggi 18:1 dengan kestabilan tremolo maksimal. Memastikan pitch gitar tetap solid bahkan saat bending agresif.",
    specs: ["Ratio 18:1 Sealed Die-cast", "Bone Nut 42mm", "Zero Pitch Slip"],
  },
  {
    id: "neck",
    min: 0.38,
    max: 0.58,
    badge: "Ergonomi Bermain",
    title: "Neck & Fretboard",
    desc: "Profil modern C dengan radius 9.5 inci dilapisi rosewood terpilih. Memberikan kecepatan transisi chord dan kenyamanan bermain solo berjam-jam.",
    specs: ["Quarter-sawn Hard Maple", "Indian Rosewood 22 Frets", "Satin Poly Finish"],
  },
  {
    id: "body",
    min: 0.60,
    max: 0.78,
    badge: "Akustik & Elektronik",
    title: "Body & Soundhole / Pickups",
    desc: "Bodi solid alder dengan resonansi hangat dan dinamika sustain panjang. Disempurnakan konfigurasi pickup hand-wound yang responsif terhadap dinamika petikan.",
    specs: ["Selected Solid Alder", "Alnico V Custom Voicing", "Shielded Cavity"],
  },
  {
    id: "bridge",
    min: 0.80,
    max: 0.92,
    badge: "Transfer Getaran",
    title: "Bridge & Saddles Intonation",
    desc: "Sistem saddle baja cor yang mentransfer getaran senar langsung ke serat kayu. Menghasilkan artikulasi nada bersih dan intonasi presisi.",
    specs: ["Synchronized Tremolo", "Solid Steel Block", "Micro-adjust Saddles"],
  },
];

export function GuitarScrollSequence({ onOpenAuth }: GuitarScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cache gambar frame di Ref untuk menghindari re-render React saat scroll
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const activeFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);

  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  // Deteksi perubahan reduced motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Gambar frame ke canvas dengan perilaku 'contain / cover' proporsional
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

    // Hitung posisi cover tanpa distorsi
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

  // Resize canvas dengan DPR capping maksimal 2
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    drawFrame(activeFrameRef.current);
  }, [drawFrame]);

  // Preload frame: Frame 1 diprioritaskan, sisanya bertahap di latar
  useEffect(() => {
    let isCancelled = false;

    // Muat Frame 1 dulu
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current.set(1, firstImg);
      handleResize();
    };

    // Muat 59 frame sisanya secara asinkron
    let loadedCount = 1;
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        if (isCancelled) return;
        imagesRef.current.set(i, img);
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
      };
      img.onerror = () => {
        if (isCancelled) return;
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [handleResize]);

  // Listener resize jendela
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Scroll listener passive & rAF Lerp Loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDistance = rect.height - windowHeight;

      if (scrollableDistance <= 0) return;

      // Scroll progress 0.0 -> 1.0 di dalam section
      const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
      targetFrameRef.current = Math.max(
        1,
        Math.min(TOTAL_FRAMES, Math.round(progress * (TOTAL_FRAMES - 1)) + 1)
      );
      setCurrentProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Lerp Animation Loop
    const renderLoop = () => {
      // Lerp interpolasi untuk kehalusan perpindahan frame
      const target = targetFrameRef.current;
      const current = activeFrameRef.current;

      const diff = target - current;
      if (Math.abs(diff) > 0.1) {
        // Kecepatan lerp 0.14
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
  }, [drawFrame, prefersReducedMotion]);

  // Render mode alternatif untuk pengguna yang mengaktifkan Reduced Motion
  if (prefersReducedMotion) {
    return (
      <section className="py-20 px-4 max-w-5xl mx-auto space-y-12 bg-[#080F0F] text-[#F3F0E8]">
        <div className="text-center space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#e9b999] font-bold">
            Anatomi Instrumen
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white">
            Koleksi Pilihan Profesional
          </h2>
          <p className="text-sm text-white/70 max-w-xl mx-auto">
            Setiap instrumen di Dinasti Musik menjalani inspeksi detail 24 titik sebelum dipajang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ANNOTATIONS.map((anno) => (
            <div
              key={anno.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3"
            >
              <span className="text-[10px] font-mono uppercase text-[#bb6a33] font-bold tracking-widest">
                {anno.badge}
              </span>
              <h3 className="font-serif text-xl font-bold text-white">{anno.title}</h3>
              <p className="text-xs text-white/70 leading-relaxed">{anno.desc}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {anno.specs.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-white/90"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Active annotation berdasarkan progress scroll saat ini
  const activeAnno = ANNOTATIONS.find(
    (a) => currentProgress >= a.min && currentProgress <= a.max
  );
  const isFinalCta = currentProgress >= 0.93;

  return (
    <section
      ref={containerRef}
      className="relative h-[380vh] md:h-[500vh] bg-[#080F0F] text-[#F3F0E8]"
      aria-label="Animasi Scroll 3D Penjelasan Bagian Instrumen Gitar"
    >
      {/* Container Sticky 100vh */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Canvas WebGL / 2D Frame Sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300"
          aria-label="Tampilan 3D anatomi instrumen musik yang berputar mengikuti scroll"
        />

        {/* Subtle Radial Gradient Overlay for High Contrast Reading */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080F0F]/90 via-transparent to-[#080F0F]/60 pointer-events-none z-10" />

        {/* Loading Progress Bar (Top) */}
        {loadProgress < 100 && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[10px] font-mono text-[#e9b999]">
            <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#bb6a33] transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span>Memuat 3D ({loadProgress}%)</span>
          </div>
        )}

        {/* HUD Top-Left Indicator */}
        <div className="absolute top-8 left-6 md:left-12 z-20 pointer-events-none hidden sm:block">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#bb6a33] font-bold flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-[#e9b999]" />
              <span>3D Hardware Teardown</span>
            </span>
            <div className="text-xs font-mono text-white/50">
              Frame: {String(Math.max(1, Math.min(TOTAL_FRAMES, Math.round(currentProgress * (TOTAL_FRAMES - 1)) + 1))).padStart(2, "0")} / 60
            </div>
          </div>
        </div>

        {/* HUD Top-Right Scroll Hint */}
        <div className="absolute top-8 right-6 md:right-12 z-20 pointer-events-none hidden sm:flex items-center gap-2 text-white/40 text-[11px] font-mono">
          <span>Gulir untuk membedah</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#e9b999]" />
        </div>

        {/* Overlay Konten Teks yang Sinkron dengan Scroll Range (0% - 92%) */}
        {activeAnno && !isFinalCta && (
          <div
            key={activeAnno.id}
            className="absolute bottom-16 md:bottom-20 left-4 md:left-12 max-w-md z-20 p-6 md:p-8 rounded-3xl bg-black/65 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 animate-in fade-in slide-in-from-bottom-6"
          >
            <div className="space-y-3">
              <span className="inline-block text-[10px] font-mono uppercase tracking-[0.2em] text-[#e9b999] font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                {activeAnno.badge}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight">
                {activeAnno.title}
              </h2>
              <p className="text-xs md:text-sm text-white/80 leading-relaxed font-sans">
                {activeAnno.desc}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {activeAnno.specs.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-white/80 font-mono"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Overlay Final Call-to-Action (93% - 100%) */}
        {isFinalCta && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all duration-500 animate-in fade-in">
            <div className="max-w-xl text-center space-y-6 p-8 md:p-12 rounded-[2.5rem] bg-[#0c1414] border border-[#bb6a33]/40 shadow-[0_25px_60px_rgba(187,106,51,0.2)]">
              <div className="w-14 h-14 rounded-full bg-[#bb6a33]/20 border border-[#bb6a33]/50 text-[#e9b999] flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-7 h-7 text-[#bb6a33]" />
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#e9b999] font-bold block">
                  Koleksi Eksklusif Siap Dieksplorasi
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight">
                  Rasakan Presisi Setiap Instrumen
                </h2>
                <p className="text-xs md:text-sm text-white/75 max-w-md mx-auto leading-relaxed">
                  Akses katalog lengkap, inventaris stok *real-time*, dan konsultasi spesifikasi dengan masuk ke akun Anda.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#bb6a33] hover:bg-[#A97E4F] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[#bb6a33]/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Akun Sekarang</span>
                </button>

                <a
                  href="#tentang-toko"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>Info Toko Dinasti</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#e9b999]" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Scroll Progress Ring / Bar (Bottom-Right) */}
        <div className="absolute bottom-6 right-6 md:right-12 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 text-[10px] font-mono text-white/70">
          <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#bb6a33]"
              style={{ width: `${Math.round(currentProgress * 100)}%` }}
            />
          </div>
          <span>{Math.round(currentProgress * 100)}%</span>
        </div>
      </div>
    </section>
  );
}
