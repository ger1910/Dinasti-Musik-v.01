
"use client";
import React, { useState } from "react";
import { StoreConfig } from "@/types";
import { useApp } from "@/components/AppProvider";
import { Building2, Phone, Mail, MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const DEFAULT_CONFIG: Partial<StoreConfig> = {
  name: "Dinasti Musik",
  whatsapp: "6289512430608",
  email: "admin@dinastimusik.com",
  address: "Jl. Pasir Rahayu IV, CC No. 22, Bandung",
  bio: "Dedikasi menyajikan instrumen musik kualitas dunia dan layanan profesional bagi musisi Indonesia.",
  established: 2018,
  city: "Bandung",
  openingHours: "Senin-Sabtu: 09.00-18.00 WIB",
};

export function AdminSettingsView() {
  const { storeConfig, fetchData } = useApp();
  const [formData, setFormData] = useState<Partial<StoreConfig>>(() => ({
    ...DEFAULT_CONFIG,
    ...(storeConfig || {}),
  }));

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchData();
        setMessage({ text: "Pengaturan toko berhasil diperbarui!", type: "success" });
        setTimeout(() => setMessage(null), 4000);
      } else {
        const err = await res.json();
        setMessage({ text: err.error || "Gagal menyimpan konfigurasi", type: "error" });
      }
    } catch {
      setMessage({ text: "Terjadi kesalahan jaringan saat menyimpan.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="flex justify-between items-center bg-[#181818] p-6 border border-[#292929]">
        <div>
          <h3 className="font-bold text-lg text-[#F3F0E8]">
            Pengaturan Toko & Operasional
          </h3>
          <p className="text-xs text-[#999999] mt-1">
            Konfigurasi informasi resmi Dinasti Musik, kontak layanan, dan alamat galeri fisik
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 text-xs font-semibold flex items-center gap-2 border ${message.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
              : "bg-red-950/40 border-red-500/40 text-red-400"
            }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identitas Bisnis Toko */}
        <div className="p-6 bg-[#181818] border border-[#292929] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#D97732] flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>Identitas Toko</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#999999] block mb-1">
                Nama Toko
              </label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#999999] block mb-1">
                Tahun Berdiri
              </label>
              <input
                type="number"
                value={formData.established || 2018}
                onChange={(e) =>
                  setFormData({ ...formData, established: parseInt(e.target.value) || 2018 })
                }
                className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#999999] block mb-1">
              Deskripsi Singkat / Bio Toko
            </label>
            <textarea
              rows={3}
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
            />
          </div>
        </div>

        {/* Kontak & Operasional Toko */}
        <div className="p-6 bg-[#181818] border border-[#292929] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#D97732] flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Kontak & Lokasi Galeri</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#999999] block mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#666666]" /> Nomor WhatsApp Resmi
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp || ""}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="628..."
                className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#999999] block mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#666666]" /> Email Layanan
              </label>
              <input
                type="email"
                required
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#999999] block mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#666666]" /> Alamat Galeri Musik
              </label>
              <input
                type="text"
                required
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#999999] block mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#666666]" /> Jam Operasional
              </label>
              <input
                type="text"
                value={formData.openingHours || ""}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                placeholder="Senin-Sabtu: 09.00-18.00 WIB"
                className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#D97732] hover:bg-[#c46828] text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Pengaturan Toko"}
          </button>
        </div>
      </form>
    </div>
  );
}
