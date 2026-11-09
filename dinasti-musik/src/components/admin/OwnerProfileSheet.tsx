"use client";
import React from "react";
import { X, Award, MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { StoreConfig } from "@/types";

interface OwnerProfileSheetProps {
  isOpen: boolean;
  config: StoreConfig | null;
  onClose: () => void;
}

export function OwnerProfileSheet({
  isOpen,
  config,
  onClose,
}: OwnerProfileSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#080F0F] text-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-white/10 overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C59B6D] font-bold">
              INFO TOKO & GALERI RESMI
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-2xl text-white">
                {config?.name || "Dinasti Musik"}
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                {config?.bio ||
                  "Didirikan dengan komitmen menyajikan instrumen musik kualitas dunia yang diinspeksi secara detail bagi kepuasan para komposer dan musisi profesional Indonesia."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3.5 text-xs text-white/80">
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-[#C59B6D] shrink-0" />
                <span>Berdiri sejak tahun {config?.established || 2018}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#C59B6D] shrink-0" />
                <span>{config?.address || "Jl. Pasir Rahayu IV, CC No. 22, Bandung"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#C59B6D] shrink-0" />
                <span>{config?.openingHours || "Senin - Sabtu: 09.00 - 18.00 WIB"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C59B6D] shrink-0" />
                <span>{config?.email || "admin@dinastimusik.com"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C59B6D] shrink-0" />
                <span>+{config?.whatsapp || "628992221537"}</span>
              </div>
            </div>
          </div>

          {/* Footer WhatsApp Button */}
          <div className="p-6 border-t border-white/10 bg-white/5">
            <a
              href={`https://wa.me/${config?.whatsapp || "628992221537"}?text=Halo%20Dinasti%20Musik,%20saya%20ingin%20berkonsultasi%20mengenai%20produk.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-full bg-[#1E7E4A] hover:bg-[#16653A] text-white font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-sm active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi WhatsApp Langsung</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
