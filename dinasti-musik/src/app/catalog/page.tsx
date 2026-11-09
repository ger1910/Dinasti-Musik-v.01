"use client";
import React, { useState, useMemo } from "react";
import { Catalog } from "@/components/catalog/Catalog";
import { ProductDetailModal } from "@/components/catalog/ProductDetailModal";
import { useApp } from "@/components/layout/AppProvider";
import { Product } from "@/types";
import { Search, X } from "lucide-react";

export default function CatalogPage() {
  const { products, addToCart, user, wishlist, toggleWishlist } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const searchedProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-4 sm:px-6 animate-in fade-in">
      {/* Catalog Header with Search Bar */}
      <div className="border-b border-black/[0.06] dark:border-white/10 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[11px] uppercase font-mono tracking-widest text-[#bb6a33] font-semibold block mb-1">
            Koleksi Resmi
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1317] dark:text-[#F3F0E8] tracking-tight">
            Katalog Instrumen Musik
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-[#999999] mt-1 max-w-lg">
            Peralatan musik orisinal dengan garansi pabrikan resmi untuk musisi panggung, studio, dan hobi.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari gitar, drum, Roland, Fender..."
            className="w-full pl-9 pr-9 py-2.5 bg-white dark:bg-[#141414] border border-black/[0.08] dark:border-white/10 text-xs text-[#0D1317] dark:text-[#F3F0E8] placeholder:text-gray-400 dark:placeholder:text-[#666666] focus:outline-none focus:border-[#bb6a33] transition-colors rounded-xl shadow-xs"
          />
          <Search className="w-4 h-4 text-gray-400 dark:text-[#777777] absolute left-3 top-3" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 dark:text-[#777777] dark:hover:text-[#F3F0E8]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Catalog Component */}
      <Catalog
        products={searchedProducts}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onAddToCart={(p) => addToCart(p.id, 1)}
        onProductClick={(p) => setSelectedProduct(p)}
        isOwner={user?.role === "owner"}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />

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
