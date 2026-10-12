/**
 * Dinasti Musik - Catalog & Product Showcase Module
 * Handles customer product discovery, category filtering, search, and high-end card rendering.
 */

import { apiClient } from './api.js';
import { getStoredProducts } from './storage.js';
import { formatRupiah } from './data.js';

let allProducts = [];
let activeCategory = 'Semua';
let currentSearch = '';

export function getLoadedProducts() {
    return allProducts;
}

export function getActiveCategory() {
    return activeCategory;
}

export function setActiveCategory(category) {
    activeCategory = category;
}

export function getCurrentSearch() {
    return currentSearch;
}

export function setCurrentSearch(query) {
    currentSearch = query;
}

/**
 * Fetch products using dual-engine fallback.
 */
export async function loadProducts() {
    const query = currentSearch.trim().toLowerCase();
    let loadedFromApi = false;

    try {
        const data = await apiClient.getProducts(activeCategory, query);
        if (data && Array.isArray(data.products)) {
            allProducts = data.products;
            loadedFromApi = true;
        }
    } catch (err) {
        // Fallback to client storage
    }

    if (!loadedFromApi) {
        let prods = getStoredProducts();
        if (activeCategory && activeCategory !== 'Semua') {
            prods = prods.filter(p => p.category === activeCategory);
        }
        if (query) {
            prods = prods.filter(p =>
                (p.name && p.name.toLowerCase().includes(query)) ||
                (p.brand && p.brand.toLowerCase().includes(query)) ||
                (p.description && p.description.toLowerCase().includes(query))
            );
        }
        allProducts = prods;
    }

    renderCatalogGrid();
    return allProducts;
}

/**
 * Render customer catalog grid with Double-Bezel card architecture.
 */
export function renderCatalogGrid(onAddToCart) {
    const grid = document.getElementById('customer-products-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (allProducts.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-16 text-center">
                <div class="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--border-color)] text-[var(--color-accent)] flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                    <i class="fas fa-magnifying-glass"></i>
                </div>
                <h3 class="font-serif text-xl font-bold text-[var(--text-primary)] mb-2">Instrumen Tidak Ditemukan</h3>
                <p class="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-6">
                    Maaf, tidak ada produk yang cocok dengan pencarian 
                    "<span class="font-semibold text-[var(--color-accent)]">${currentSearch || activeCategory}</span>".
                </p>
                <div class="flex items-center justify-center gap-3">
                    <button id="reset-catalog-btn" class="btn btn-outline btn-sm bg-white hover:bg-gray-50 border-[var(--border-color)]">
                        <i class="fas fa-times text-xs mr-1.5"></i>Reset Pencarian
                    </button>
                    <button id="show-all-catalog-btn" class="btn btn-primary btn-sm">
                        <i class="fas fa-th-large text-xs mr-1.5"></i>Semua Produk
                    </button>
                </div>
            </div>
        `;

        document.getElementById('reset-catalog-btn')?.addEventListener('click', () => {
            clearSearch();
        });
        document.getElementById('show-all-catalog-btn')?.addEventListener('click', () => {
            filterCategory('Semua');
        });
        return;
    }

    allProducts.forEach(prod => {
        const isOutOfStock = prod.stock <= 0;
        const card = document.createElement('div');
        // Double-bezel outer shell with concentric inner card
        card.className = 'group relative rounded-2xl p-1.5 bg-white border border-[var(--border-color)] shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-1';
        
        card.innerHTML = `
            <div class="bg-[var(--color-surface-light)] rounded-[calc(1rem-0.25rem)] overflow-hidden flex flex-col flex-1">
                <!-- Image Container with Visual Overlays -->
                <div class="relative overflow-hidden bg-[#ECEEF1]" style="height: 220px;">
                    <img src="${prod.image}" 
                         class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" 
                         alt="${prod.name}" 
                         loading="lazy">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <!-- Eyebrow Badges -->
                    <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-white/90 backdrop-blur-md text-[var(--color-primary)] border border-white/50 shadow-xs">
                        ${prod.category}
                    </span>
                    <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight ${
                        isOutOfStock 
                            ? 'bg-red-50/90 text-red-700 border border-red-200/50' 
                            : 'bg-emerald-50/90 text-emerald-800 border border-emerald-200/50'
                    }">
                        ${isOutOfStock ? 'Habis' : 'Stok: ' + prod.stock}
                    </span>
                </div>

                <!-- Product Specifications -->
                <div class="p-5 flex flex-col flex-1 justify-between bg-white rounded-b-[calc(1rem-0.25rem)]">
                    <div>
                        <div class="flex items-center gap-1.5 text-[#7C5329] text-xs mb-2 font-medium">
                            <i class="fas fa-star text-[11px]"></i>
                            <span class="font-bold text-[var(--text-primary)] text-xs">${prod.rating || 5.0}</span>
                            <span class="text-gray-400 text-[10px]">•</span>
                            <span class="text-gray-600 text-[11px] font-medium tracking-wide">${prod.brand}</span>
                        </div>
                        <h3 class="font-serif font-bold text-sm text-[var(--text-primary)] line-clamp-2 mb-2 leading-snug group-hover:text-[#7C5329] transition-colors">
                            ${prod.name}
                        </h3>
                        <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                            ${prod.description || ''}
                        </p>
                    </div>

                    <!-- Price & Haptic Button-in-Button CTA -->
                    <div class="pt-4 border-t border-[var(--border-color)] flex items-center justify-between mt-auto">
                        <div>
                            <span class="text-[9px] uppercase tracking-widest text-gray-500 font-semibold block">Harga Resmi</span>
                            <span class="font-serif font-bold text-[#7C5329] text-base">
                                ${formatRupiah(prod.price)}
                            </span>
                        </div>
                        <button data-product-id="${prod.id}" 
                                aria-label="Tambah ${prod.name} ke keranjang"
                                class="add-to-cart-btn inline-flex items-center gap-2 pl-3.5 pr-2 py-2 rounded-full text-xs font-semibold transition-all duration-300 active:scale-[0.98] ${
                                    isOutOfStock 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                                        : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 shadow-sm group/btn'
                                }"
                                ${isOutOfStock ? 'disabled' : ''}>
                            <span>Beli</span>
                            <span class="w-6 h-6 rounded-full ${isOutOfStock ? 'bg-gray-200 text-gray-400' : 'bg-white/15 text-white group-hover/btn:bg-[var(--color-accent)]'} flex items-center justify-center text-[10px] transition-colors">
                                <i class="fas fa-plus"></i>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        const btn = card.querySelector('.add-to-cart-btn');
        if (btn && !isOutOfStock) {
            btn.addEventListener('click', () => {
                if (typeof onAddToCart === 'function') {
                    onAddToCart(prod.id);
                }
            });
        }

        grid.appendChild(card);
    });
}

export function filterCategory(category, onFilterChange) {
    activeCategory = category;
    document.querySelectorAll('#catalog-category-pills .cat-pill').forEach(btn => {
        if (btn.textContent.includes(category) || (category === 'Semua' && btn.textContent.includes('Semua'))) {
            btn.className = 'cat-pill active btn btn-sm bg-[var(--color-primary)] text-white border-0 shadow-sm';
        } else {
            btn.className = 'cat-pill btn btn-sm btn-outline bg-white text-gray-700 border-[var(--border-color)] hover:bg-gray-50';
        }
    });
    loadProducts();
    if (typeof onFilterChange === 'function') onFilterChange(category);
}

export function clearSearch() {
    currentSearch = '';
    const input = document.getElementById('catalog-search-input');
    if (input) input.value = '';
    const clearBtn = document.getElementById('clear-search-btn');
    if (clearBtn) clearBtn.classList.add('hidden');
    loadProducts();
}
