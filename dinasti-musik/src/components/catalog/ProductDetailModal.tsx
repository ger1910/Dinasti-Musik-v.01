"use client";
import React, { useState } from "react";
import { Product } from "@/types";
import { X, ShoppingBag, CheckCircle2, XCircle, Heart } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { useApp } from "@/components/AppProvider";

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailProps) {
  const [qty, setQty] = useState(1);
  const { wishlist, toggleWishlist } = useApp();

  if (!isOpen || !product) return null;

  const inStock = product.stock > 0;
  const isWished = wishlist.includes(product.id);

  const handleAdd = () => {
    if (inStock && qty > 0 && qty <= product.stock) {
      onAddToCart(product, qty);
      onClose();
      setQty(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-[#292929] max-w-4xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-hidden flex flex-col md:flex-row rounded-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 bg-gray-50 hover:bg-gray-100 dark:bg-[#1c1c1c] dark:hover:bg-[#222222] text-gray-500 hover:text-[#0D1317] dark:text-[#999999] dark:hover:text-[#F3F0E8] transition-colors z-20 border border-black/[0.07] dark:border-[#292929] rounded-lg"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Product Image */}
        <div className="w-full md:w-1/2 bg-[#F4F5F7] dark:bg-[#1c1c1c] border-b md:border-b-0 md:border-r border-black/[0.05] dark:border-[#292929] relative min-h-[300px] md:min-h-full flex items-center justify-center p-8">
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            <span className="px-2.5 py-0.5 bg-white/90 dark:bg-black/80 border border-black/[0.06] dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-[#999999] rounded-full shadow-xs backdrop-blur-xs">
              {product.brand}
            </span>
            <span className="px-2.5 py-0.5 bg-[#bb6a33] text-[10px] font-bold uppercase tracking-wider text-white self-start rounded-full">
              {product.category}
            </span>
          </div>

          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-sm max-h-[340px] object-contain"
          />
        </div>

        {/* Right: Info & Purchase */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Stock status */}
            <div className="flex items-center gap-2 mb-3">
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Tersedia ({product.stock} Unit)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-2.5 py-0.5 rounded-full">
                  <XCircle className="w-3 h-3" /> Stok Habis
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-[#0D1317] dark:text-[#F3F0E8] mb-2 leading-snug">
              {product.name}
            </h2>

            <div className="text-2xl font-bold text-[#bb6a33] mb-6">
              {formatRupiah(product.price)}
            </div>

            <div className="text-gray-500 dark:text-[#999999] text-xs sm:text-sm leading-relaxed mb-6 whitespace-pre-wrap border-t border-black/[0.06] dark:border-[#292929] pt-4">
              {product.description || "Instrumen musik dengan standar kualitas pabrikan terjamin."}
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-6 border-t border-black/[0.06] dark:border-[#292929]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-gray-500 dark:text-[#999999] uppercase tracking-wider">
                Kuantitas
              </span>
              <div className="flex items-center border border-black/[0.08] dark:border-[#292929] bg-gray-50 dark:bg-[#1c1c1c] rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={!inStock || qty <= 1}
                  className="px-3.5 py-1.5 text-gray-600 hover:text-[#0D1317] dark:text-[#999999] dark:hover:text-[#F3F0E8] hover:bg-gray-100 dark:hover:bg-[#222222] disabled:opacity-30 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-semibold text-[#0D1317] dark:text-[#F3F0E8]">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={!inStock || qty >= product.stock}
                  className="px-3.5 py-1.5 text-gray-600 hover:text-[#0D1317] dark:text-[#999999] dark:hover:text-[#F3F0E8] hover:bg-gray-100 dark:hover:bg-[#222222] disabled:opacity-30 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!inStock}
                className="flex-1 py-3 bg-[#bb6a33] hover:bg-[#a55a29] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-full"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Tambah ke Keranjang</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 border transition-all rounded-xl ${
                  isWished
                    ? "bg-[#bb6a33] border-[#bb6a33] text-white"
                    : "bg-gray-50 dark:bg-[#1c1c1c] border-black/[0.08] dark:border-[#292929] text-gray-500 dark:text-[#999999] hover:text-[#bb6a33] hover:border-[#bb6a33]"
                }`}
                title={isWished ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isWished ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
