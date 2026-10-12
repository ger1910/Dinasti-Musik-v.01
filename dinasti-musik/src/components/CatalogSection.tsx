'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Star, ArrowRight, Frown } from 'lucide-react';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/utils';

interface CatalogSectionProps {
  products: Product[];
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
  onAddToCart: (product: Product) => void;
}

const CATEGORIES = [
  'Semua',
  'Gitar',
  'Keyboard & Piano',
  'Drum & Perkusi',
  'Audio & Studio',
];

export function CatalogSection({
  products,
  selectedCategory = 'Semua',
  onSelectCategory,
  onAddToCart,
}: CatalogSectionProps) {
  const [internalCategory, setInternalCategory] = useState(selectedCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCat = onSelectCategory ? selectedCategory : internalCategory;
  const setCat = onSelectCategory || setInternalCategory;

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCategory =
        activeCat === 'Semua' || prod.category === activeCat;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        prod.name.toLowerCase().includes(query) ||
        prod.brand.toLowerCase().includes(query) ||
        (prod.description && prod.description.toLowerCase().includes(query));
      return matchCategory && matchSearch;
    });
  }, [products, activeCat, searchQuery]);

  return (
    <section id="catalog-section" className="py-12 md:py-20 px-4 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#bb6a33] font-bold block mb-1">
            KATALOG RESMI
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#080F0F]">
            Koleksi Instrumen Pilihan
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md">
            Jelajahi produk instrumen musik kualitas dunia dengan garansi resmi pabrikan.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Fender, Yamaha, Roland..."
            className="w-full pl-9 pr-9 py-2.5 rounded-full bg-white border border-black/[0.08] text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bb6a33] focus:border-transparent transition-all shadow-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCat(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCat === cat
                ? 'bg-[#080F0F] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-black/[0.06] hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-black/[0.06] p-8 max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#bb6a33] flex items-center justify-center mx-auto mb-4">
            <Frown className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#080F0F] mb-1">
            Produk Tidak Ditemukan
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Tidak ada produk yang cocok dengan kata kunci &quot;{searchQuery || activeCat}&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCat('Semua');
            }}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#080F0F] text-white hover:bg-black transition"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const isOutOfStock = prod.stock <= 0;
            return (
              <div
                key={prod.id}
                className="double-bezel group hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="double-bezel-inner overflow-hidden flex flex-col h-full justify-between">
                  {/* Image Container with Badges */}
                  <div>
                    <div className="relative h-52 bg-gray-100 overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/90 backdrop-blur-md text-[#080F0F] border border-white/50 shadow-xs">
                        {prod.category}
                      </span>

                      <span
                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isOutOfStock
                            ? 'bg-red-50 text-red-700 border border-red-200/60'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                        }`}
                      >
                        {isOutOfStock ? 'Habis' : `Stok: ${prod.stock}`}
                      </span>
                    </div>

                    {/* Metadata Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-1.5 text-xs text-[#bb6a33] mb-2 font-medium">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-[#080F0F]">{prod.rating || 5.0}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">{prod.brand}</span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-[#080F0F] line-clamp-2 mb-2 leading-snug group-hover:text-[#bb6a33] transition-colors">
                        {prod.name}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {prod.description || 'Instrumen kurasi bergaransi resmi internasional.'}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action Footer */}
                  <div className="p-5 pt-3 border-t border-black/[0.04] flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                        Harga
                      </span>
                      <span className="font-serif font-bold text-[#bb6a33] text-base">
                        {formatRupiah(prod.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => !isOutOfStock && onAddToCart(prod)}
                      disabled={isOutOfStock}
                      className={`inline-flex items-center gap-2 pl-3.5 pr-2 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                        isOutOfStock
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                          : 'bg-[#080F0F] text-white hover:bg-black group/btn shadow-xs'
                      }`}
                    >
                      <span>Beli</span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-colors ${
                          isOutOfStock
                            ? 'bg-gray-200 text-gray-400'
                            : 'bg-white/15 text-white group-hover/btn:bg-[#bb6a33]'
                        }`}
                      >
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
