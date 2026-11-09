"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { Product } from "@/types";

interface ProductCrudModalProps {
  isOpen: boolean;
  initialProduct: Product | null;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

type FormData = {
  name: string;
  brand: string;
  category: string;
  price: string;
  stock: string;
  image: string;
  description: string;
};

const CATEGORIES = [
  "Gitar",
  "Keyboard & Piano",
  "Drum & Perkusi",
  "Audio & Studio",
];

function buildFormData(p: Product | null): FormData {
  if (p) {
    return {
      name: p.name,
      brand: p.brand || "",
      category: p.category || "Gitar",
      price: p.price.toString(),
      stock: p.stock.toString(),
      image: p.image || "",
      description: p.description || "",
    };
  }
  return {
    name: "",
    brand: "",
    category: "Gitar",
    price: "",
    stock: "1",
    image: "",
    description: "",
  };
}

export function ProductCrudModal({
  isOpen,
  initialProduct,
  onClose,
  onSave,
}: ProductCrudModalProps) {
  const [form, setForm] = useState<FormData>(() => buildFormData(initialProduct));
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const set =
    (field: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const [prevKey, setPrevKey] = useState<string | null>(null);
  const currentKey = isOpen ? `${initialProduct?.id || "new"}` : null;
  if (currentKey !== prevKey) {
    setPrevKey(currentKey);
    if (isOpen) {
      setForm(buildFormData(initialProduct));
      setErrorMsg("");
    }
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      setErrorMsg("Nama dan harga wajib diisi.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      await onSave({
        name: form.name.trim(),
        brand: form.brand,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        image:
          form.image ||
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
        description: form.description,
      });
      onClose();
    } catch {
      setErrorMsg("Gagal menyimpan produk. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#181818] border border-[#292929] max-w-lg w-full p-6 sm:p-8 text-[#F3F0E8] shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 bg-[#111111] hover:bg-[#222222] text-[#999999] hover:text-[#F3F0E8] border border-[#292929] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-bold text-lg text-[#F3F0E8] mb-1">
          {initialProduct ? "Edit Spesifikasi Instrumen" : "Tambah Instrumen Baru"}
        </h3>
        <p className="text-xs text-[#999999] mb-4">
          Kelola data katalog dan kuantitas stok inventaris Dinasti Musik.
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 bg-red-950/40 border border-red-500/40 text-xs text-red-400 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold text-[#999999] block mb-1">
              Nama Instrumen
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={set("name")}
              placeholder="Contoh: Fender American Professional II"
              className="w-full px-3 py-2 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#999999] block mb-1">
                Brand / Pabrikan
              </label>
              <input
                type="text"
                required
                value={form.brand}
                onChange={set("brand")}
                placeholder="Fender, Yamaha, Roland..."
                className="w-full px-3 py-2 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#999999] block mb-1">
                Kategori
              </label>
              <select
                value={form.category}
                onChange={set("category")}
                className="w-full px-3 py-2 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#999999] block mb-1">
                Harga (IDR)
              </label>
              <input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={set("price")}
                placeholder="15000000"
                className="w-full px-3 py-2 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#999999] block mb-1">
                Jumlah Stok
              </label>
              <input
                type="number"
                required
                min={0}
                value={form.stock}
                onChange={set("stock")}
                className="w-full px-3 py-2 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#999999] block mb-1">
              URL Foto Produk
            </label>
            <input
              type="url"
              value={form.image}
              onChange={set("image")}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#999999] block mb-1">
              Deskripsi Teknis
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={set("description")}
              placeholder="Spesifikasi kayu, pickup, frets, kelengkapan..."
              className="w-full px-3 py-2 bg-[#141414] border border-[#292929] text-xs text-[#F3F0E8] focus:outline-none focus:border-[#D97732]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#292929] text-xs text-[#999999] hover:text-[#F3F0E8] hover:bg-[#222222] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#D97732] hover:bg-[#c46828] text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
