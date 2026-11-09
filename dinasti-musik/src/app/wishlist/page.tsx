"use client";
import React, { useState } from "react";
import { useApp } from "@/components/layout/AppProvider";
import { Catalog } from "@/components/catalog/Catalog";
import { ProductDetailModal } from "@/components/catalog/ProductDetailModal";
import { Product } from "@/types";
import { Heart, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "Semua",
  "Gitar",
  "Keyboard & Piano",
  "Drum & Perkusi",
  "Audio & Studio",
];

export default function WishlistPage() {
  const { user, products, wishlist, toggleWishlist, addToCart, openAuthModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const wishedProducts = products.filter((p) => wishlist.includes(p.id));
  const filteredWishedProducts =
    selectedCategory === "Semua"
      ? wishedProducts
      : wishedProducts.filter((p) => p.category === selectedCategory);

  const getCategoryCount = (cat: string) => {
    if (cat === "Semua") return wishedProducts.length;
    return wishedProducts.filter((p) => p.category === cat).length;
  };

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-4 sm:px-6 animate-in fade-in">
      {/* Header */}
      <div className="border-b border-black/[0.06] dark:border-white/10 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Heart className="w-4 h-4 text-[#bb6a33] fill-current" />
            <span className="text-[11px] uppercase font-mono tracking-widest text-[#bb6a33] font-semibold">
              Koleksi Favorit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1317] dark:text-[#F3F0E8] tracking-tight">
            Wishlist Saya
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-[#999999] mt-1">
            Simpan instrumen yang Anda impikan untuk dipantau ketersediaan dan harganya.
          </p>
        </div>

        {!user && (
          <div className="p-3 bg-amber-50 dark:bg-[#181818] border border-amber-200 dark:border-[#292929] rounded-xl flex items-center gap-3 self-start sm:self-auto">
            <UserCheck className="w-4 h-4 text-[#bb6a33] shrink-0" />
            <div className="text-xs text-gray-600 dark:text-[#999999]">
              <span>Ingin simpan permanen di akun? </span>
              <button
                onClick={openAuthModal}
                className="text-[#bb6a33] font-semibold hover:underline ml-1"
              >
                Masuk / Daftar
              </button>
            </div>
          </div>
        )}
      </div>

      {wishedProducts.length === 0 ? (
        /* Empty State */
        <div className="py-24 text-center bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/10 rounded-2xl p-8 max-w-xl mx-auto shadow-xs">
          <div className="w-14 h-14 bg-amber-50 dark:bg-[#222222] text-[#bb6a33] border border-amber-100 dark:border-[#333333] flex items-center justify-center mx-auto mb-4 rounded-full">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0D1317] dark:text-[#F3F0E8] mb-1">
            Wishlist Anda Masih Kosong
          </h2>
          <p className="text-xs text-gray-500 dark:text-[#999999] mb-6 max-w-sm mx-auto">
            Belum ada instrumen yang ditandai sebagai favorit. Jelajahi katalog dan klik ikon hati untuk menyimpan.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0D1317] dark:bg-[#bb6a33] hover:bg-[#bb6a33] dark:hover:bg-[#a55a29] text-white text-xs font-semibold uppercase tracking-wider transition-colors rounded-full"
          >
            <span>Jelajahi Katalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div>
          {/* Category Tabs with Counts — handled here, not in Catalog */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const count = getCategoryCount(cat);
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-200 border shadow-xs flex items-center gap-2 ${
                    isActive
                      ? "bg-[#0D1317] dark:bg-white text-white dark:text-[#0D1317] border-[#0D1317] dark:border-white shadow-sm"
                      : "bg-white dark:bg-[#141414] text-gray-600 dark:text-gray-300 border-black/[0.08] dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 dark:bg-black/20 text-white dark:text-black"
                        : "bg-black/[0.06] dark:bg-white/10 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          {filteredWishedProducts.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-[#141414] border border-black/[0.07] dark:border-white/10 rounded-2xl p-8 shadow-xs">
              <p className="text-sm text-gray-500 dark:text-[#999999] mb-4">
                Tidak ada instrumen dalam kategori &quot;{selectedCategory}&quot; pada wishlist Anda.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory("Semua")}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#0D1317] dark:bg-[#bb6a33] text-white hover:bg-[#bb6a33] dark:hover:bg-[#a55a29] transition-colors rounded-full"
              >
                Lihat Semua ({wishedProducts.length} Instrumen)
              </button>
            </div>
          ) : (
            <Catalog
              products={filteredWishedProducts}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onAddToCart={(p) => addToCart(p.id, 1)}
              onProductClick={(p) => setSelectedProduct(p)}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
              hideCategories={true}
            />
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => addToCart(p.id, qty)}
      />
    </div>
  );
}
