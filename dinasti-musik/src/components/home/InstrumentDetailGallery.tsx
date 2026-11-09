"use client";

import React, { useState } from "react";
import { Sparkles, Eye, ShieldCheck, ChevronRight, ChevronLeft, Sliders, Music2 } from "lucide-react";

interface InstrumentDetail {
  id: string;
  category: "Gitar & Bass" | "Keys & Synth" | "Drum & Studio";
  title: string;
  subtitle: string;
  desc: string;
  tag: string;
  image: string;
  specs: { label: string; value: string }[];
}

const DETAILS_DATA: InstrumentDetail[] = [
  {
    id: "wood-grain",
    category: "Gitar & Bass",
    title: "Serat Tonewood & Fret Leveling Presisi",
    subtitle: "Selected Alder & Indian Rosewood",
    desc: "Finishing tipis satin lacquer biar pori-pori kayu tetap 'bernapas' dan resonansi bodi keluar maksimal. Fretboard di-dressing rapi tanpa fret sprout yang tajem di tangan pas main solo berjam-jam.",
    tag: "Craftsmanship Fisik",
    image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=1200&auto=format&fit=crop&q=80",
    specs: [
      { label: "Radius Fretboard", value: "9.5\" Modern C Profile" },
      { label: "Action Senar", value: "Low Action (1.5mm - 1.8mm)" },
      { label: "Nut Material", value: "Natural Bone 42mm" },
    ],
  },
  {
    id: "electronics",
    category: "Gitar & Bass",
    title: "Pickup Hand-Wound & Shielded Cavity",
    subtitle: "Alnico V Voicing & Low Noise Floor",
    desc: "Karakter punchy, artikulasi nada bening, dan dynamic range luas pas dipetik lembut sampai digenjreng keras. Rongga elektronik dilapisi copper tape shield biar minim dengung pas dicolok ke high-gain amp.",
    tag: "Elektronik & Tone",
    image: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=1200&auto=format&fit=crop&q=80",
    specs: [
      { label: "Magnet Type", value: "Alnico V Hand-Wound" },
      { label: "Potentiometer", value: "CTS 250k / 500k Smooth Sweep" },
      { label: "Noise Rejection", value: "Full Conductive Shielding" },
    ],
  },
  {
    id: "hardware",
    category: "Gitar & Bass",
    title: "Tremolo Solid Steel Block & Tuning Pegs 18:1",
    subtitle: "Kestabilan Pitch & Sustain Panjang",
    desc: "Tuning machine berasio 18:1 yang smooth dan anti slip pas kamu main bending ekstrim. Steel block tremolo mentransfer vibrasi senar langsung ke serat kayu untuk sustain nada yang panjang.",
    tag: "Hardware Panggung",
    image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=1200&auto=format&fit=crop&q=80",
    specs: [
      { label: "Tuning Ratio", value: "18:1 Sealed Die-Cast" },
      { label: "Bridge Block", value: "Full-size Cold Rolled Steel" },
      { label: "Intonasi", value: "Micro-calibrated per-senar" },
    ],
  },
  {
    id: "keys-feel",
    category: "Keys & Synth",
    title: "Keybed Graded Hammer Action & Sensor Tri-Sensor",
    subtitle: "Feel Sentuhan Akustik di Format Modern",
    desc: "Bobot tuts bawah lebih berat dan makin ringan ke oktaf atas persis grand piano konser. Dilengkapi synth engine responsif yang bisa nangkep dinamika pianissimo sampai fortissimo tanpa lag.",
    tag: "Sentuhan & Respon",
    image: "https://images.unsplash.com/photo-1520523839898-507127053c37?w=1200&auto=format&fit=crop&q=80",
    specs: [
      { label: "Tuts Mechanism", value: "Scaled Hammer Action II" },
      { label: "Dynamic Sensor", value: "Tri-Sensor Velocity Curve" },
      { label: "Key Surface", value: "Ivory & Ebony Touch Textured" },
    ],
  },
  {
    id: "drum-studio",
    category: "Drum & Studio",
    title: "Birch Shell Bearing Edge & Studio Monitors",
    subtitle: "Punch Kick Rapat & Transparan Flat Response",
    desc: "Kayu birch 6-ply dengan bearing edge 45 derajat yang ngeluarin attack punchy tanpa ringing liar. Pas dipadukan monitor studio flat response buat denger detail mix rekaman apa adanya.",
    tag: "Akustik Ruang & Tracking",
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=1200&auto=format&fit=crop&q=80",
    specs: [
      { label: "Shell Construction", value: "100% Selected 6-ply Birch" },
      { label: "Hoop Rim", value: "2.3mm Triple-Flanged Steel" },
      { label: "Frequency Range", value: "Ultra-linear 38Hz - 22kHz" },
    ],
  },
];

export function InstrumentDetailGallery() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [activeItem, setActiveItem] = useState<InstrumentDetail>(DETAILS_DATA[0]);

  const categories = ["Semua", "Gitar & Bass", "Keys & Synth", "Drum & Studio"];

  const filteredItems =
    activeCategory === "Semua"
      ? DETAILS_DATA
      : DETAILS_DATA.filter((item) => item.category === activeCategory);

  return (
    <section
      id="galeri-detail"
      className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-12 bg-[#080F0F] text-[#F3F0E8]"
      aria-label="Detail Instrumen Pilihan"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#bb6a33] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#bb6a33] font-bold">
              Koleksi &amp; Craftsmanship Fisik
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Detail Instrumen Resolusi Tinggi
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
            Tanpa render 3D artifisial—kami tampilkan langsung material fisik asli, serat tonewood,
            fret dressing, dan wiring rapi dari instrumen yang siap kamu bawa ke panggung.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                const nextItems =
                  cat === "Semua"
                    ? DETAILS_DATA
                    : DETAILS_DATA.filter((i) => i.category === cat);
                if (nextItems.length > 0) setActiveItem(nextItems[0]);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#bb6a33] text-white shadow-md shadow-[#bb6a33]/20"
                  : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Detail Stage (High-Res Showcase) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#111717] border border-white/10 rounded-3xl p-6 sm:p-10 overflow-hidden shadow-2xl relative">
        {/* Left: High-Res Image with Zoom Effect */}
        <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden bg-black aspect-[4/3] sm:aspect-[16/10] border border-white/10 shadow-inner">
          <img
            src={activeItem.image}
            alt={activeItem.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Badge Tag */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase tracking-wider text-[#bb6a33] font-bold">
            {activeItem.tag}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-[11px] font-mono text-gray-300 uppercase tracking-widest block mb-0.5">
              {activeItem.subtitle}
            </span>
            <p className="text-white font-bold text-base sm:text-lg drop-shadow-sm">
              {activeItem.title}
            </p>
          </div>
        </div>

        {/* Right: Technical Notes & Specs Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#bb6a33] font-bold block mb-1">
              Catatan Luthier &amp; Sound Check
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
              {activeItem.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
              {activeItem.desc}
            </p>
          </div>

          {/* Specs List */}
          <div className="space-y-2.5 pt-2 border-t border-white/10">
            {activeItem.specs.map((spec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs"
              >
                <span className="text-gray-400">{spec.label}</span>
                <span className="font-mono font-semibold text-white">{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Quality Guarantee Callout */}
          <div className="p-4 rounded-xl bg-[#bb6a33]/10 border border-[#bb6a33]/30 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#bb6a33] shrink-0" />
            <p className="text-[11px] text-gray-300 leading-snug">
              Semua instrumen telah lolos uji <strong className="text-white">Setup Action &amp; Intonasi</strong> oleh teknisi sebelum siap dikirim ke studio Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Other High-Res Detail Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {filteredItems.map((item) => {
          const isSelected = activeItem.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl ${
                isSelected
                  ? "bg-[#182121] border-[#bb6a33] ring-1 ring-[#bb6a33] shadow-lg"
                  : "bg-[#111717] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3.5 bg-black">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
                  {item.category}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-[#bb6a33] transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-gray-400 font-mono">{item.subtitle}</span>
                <span className="text-[#bb6a33] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Lihat Detail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default InstrumentDetailGallery;
