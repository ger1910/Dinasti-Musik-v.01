"use client";
import React from "react";
import { Product } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Edit2, Trash2, ShoppingBag, Heart } from "lucide-react";

interface CatalogProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
  isOwner?: boolean;
  onEditProduct?: (p: Product) => void;
  onDeleteProduct?: (id: string) => void;
  wishlist?: string[];
  onToggleWishlist?: (id: string) => void;
  hideCategories?: boolean;
}

const CATEGORIES = [
  "Semua",
  "Gitar",
  "Keyboard & Piano",
  "Drum & Perkusi",
  "Audio & Studio",
];

export function Catalog({
  products,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onProductClick,
  isOwner,
  onEditProduct,
  onDeleteProduct,
  wishlist = [],
  onToggleWishlist,
  hideCategories = false,
}: CatalogProps) {
  const filtered =
    selectedCategory === "Semua"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section className="w-full">
      {/* Category Filter Pills (hidden if parent handles it) */}
      {!hideCategories && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-200 border shadow-xs ${
                  isActive
                    ? "bg-[#0D1317] dark:bg-white text-white dark:text-[#0D1317] border-[#0D1317] dark:border-white shadow-sm"
                    : "bg-white dark:bg-[#141414] text-gray-600 dark:text-gray-300 border-black/[0.08] dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:text-black dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/10 rounded-2xl p-8 shadow-xs">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Tidak ada instrumen yang ditemukan dalam kategori &quot;{selectedCategory}&quot;.
          </p>
          <button
            type="button"
            onClick={() => onSelectCategory("Semua")}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#bb6a33] text-white hover:bg-[#a55a29] transition-colors rounded-full shadow-xs"
          >
            Tampilkan Semua Kategori
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => {
            const isOutOfStock = p.stock <= 0;
            const isWished = wishlist.includes(p.id);

            return (
              <div
                key={p.id}
                onClick={() => onProductClick(p)}
                className="group relative bg-white dark:bg-[#141414] rounded-2xl border border-black/[0.07] dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
              >
                {/* Product Image Area */}
                <div className="relative aspect-square bg-[#F4F5F7] dark:bg-[#1A1A1A] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Stock status overlay */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-red-600/90 px-3 py-1 rounded-full shadow-sm">
                        Stok Habis
                      </span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/90 dark:bg-black/80 text-[#0D1317] dark:text-gray-200 backdrop-blur-xs border border-black/5 dark:border-white/10 rounded-full shadow-xs">
                      {p.category}
                    </span>
                  </div>

                  {/* Action Buttons Overlay */}
                  {onToggleWishlist && (
                    <div
                      className="absolute top-3 right-3 flex items-center opacity-90 group-hover:opacity-100 transition-opacity z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(p.id);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs border ${
                          isWished
                            ? "bg-[#bb6a33] border-[#bb6a33] text-white scale-105"
                            : "bg-white/90 dark:bg-[#141414]/90 backdrop-blur-xs border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-300 hover:text-[#bb6a33] hover:scale-110"
                        }`}
                        title={isWished ? "Hapus dari wishlist" : "Simpan ke wishlist"}
                      >
                        <Heart
                          className="w-3.5 h-3.5"
                          fill={isWished ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Content */}
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[11px] font-bold text-[#bb6a33] dark:text-[#C59B6D] uppercase tracking-wider mb-1">
                    {p.brand}
                  </span>
                  <h3 className="text-sm font-bold text-[#0D1317] dark:text-[#F3F0E8] leading-snug line-clamp-2 mb-4 group-hover:text-[#bb6a33] transition-colors">
                    {p.name}
                  </h3>

                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-black/[0.06] dark:border-white/10">
                    <div>
                      <span className="text-[16px] font-extrabold text-[#0D1317] dark:text-white tracking-tight">
                        {formatRupiah(p.price)}
                      </span>
                      {p.stock > 0 && p.stock <= 3 && (
                        <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                          Sisa {p.stock} unit
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isOutOfStock) onAddToCart(p);
                      }}
                      disabled={isOutOfStock}
                      className={`p-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-xs border ${
                        isOutOfStock
                          ? "border-transparent bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                          : "border-transparent bg-gray-100 hover:bg-[#bb6a33] text-gray-700 hover:text-white dark:bg-white/10 dark:text-gray-300 dark:hover:bg-[#bb6a33] dark:hover:text-white"
                      }`}
                      title={isOutOfStock ? "Stok habis" : "Tambah ke keranjang"}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>

                  {isOwner && (
                    <div className="mt-3 pt-3 border-t border-black/[0.06] dark:border-white/10 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProduct?.(p);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 border border-black/5 dark:border-white/5 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProduct?.(p.id);
                        }}
                        className="py-1.5 px-3 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/60 border border-red-200/50 dark:border-red-900/30 flex items-center justify-center gap-1.5 transition-colors"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
