/**
 * Dinasti Musik — Core Application Orchestrator
 * High-End Frontend Architecture: Modular, Resilient, Hybrid Offline/Online
 */

import { formatRupiah } from './modules/data.js';
import { getStoredOrders, getStoredProducts, getStoredUsers, getSessionUser } from './modules/storage.js';
import { apiClient } from './modules/api.js';
import { showToast, togglePwdVisibility, setLoginRole, switchView } from './modules/ui.js';
import { getCurrentUser, setCurrentUser, handleLogin, logoutUser } from './modules/auth.js';
import {
    loadProducts,
    renderCatalogGrid,
    filterCategory,
    clearSearch,
    getCurrentSearch,
    setCurrentSearch,
    getActiveCategory
} from './modules/catalog.js';
import {
    addToCart,
    updateCartUI,
    toggleCartDrawer,
    openCheckoutModal,
    closeCheckoutModal,
    submitCheckout,
    changeQty,
    removeItem
} from './modules/cart.js';
import {
    showAdminSection,
    toggleAdminSidebar,
    loadOwnerStats,
    loadOwnerProductsTable,
    loadOwnerOrdersTable,
    loadOwnerStockView,
    loadOwnerCustomersView,
    openAddProductModal,
    closeProductCrudModal,
    editProductPrompt,
    deleteProduct,
    updateOrderStatus,
    editStockPrompt,
    openOwnerProfileSheet,
    closeOwnerProfileSheet,
    handleProductCrudSubmit
} from './modules/admin.js';

// --- Customer Order Telemetry ---
async function loadCustomerOrders() {
    const container = document.getElementById('customer-orders-container');
    if (!container) return;
    container.innerHTML = '<p class="text-center text-xs text-gray-400 py-8">Memuat riwayat transaksi...</p>';

    let orders = [];
    let loadedFromApi = false;
    const user = getCurrentUser();

    try {
        const customerId = user ? user.id : 'GUEST';
        orders = await apiClient.getOrders(customerId);
        loadedFromApi = true;
    } catch (err) {
        // Fallback
    }

    if (!loadedFromApi) {
        const allOrders = getStoredOrders();
        if (user) {
            orders = allOrders.filter(o =>
                o.customerId === user.id ||
                (o.customerEmail && user.email && o.customerEmail.toLowerCase() === user.email.toLowerCase())
            );
        } else {
            orders = allOrders;
        }
    }

    container.innerHTML = '';
    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <div class="card p-12 text-center bg-white border border-[var(--border-color)] rounded-2xl shadow-xs">
                <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3 text-gray-300 text-xl border border-gray-100">
                    <i class="fas fa-receipt"></i>
                </div>
                <h4 class="font-serif font-bold text-base text-[var(--text-primary)]">Belum Ada Transaksi</h4>
                <p class="text-xs text-gray-400 mt-1 mb-5">Anda belum pernah melakukan pemesanan instrumen.</p>
                <button id="empty-order-browse-btn" class="btn btn-primary btn-sm mx-auto">
                    <i class="fas fa-store mr-1.5 text-xs"></i>Jelajahi Katalog
                </button>
            </div>
        `;
        document.getElementById('empty-order-browse-btn')?.addEventListener('click', () => {
            showCustomerSection('catalog');
        });
        return;
    }

    const statusBadges = {
        Pending: 'bg-amber-50 text-amber-700 border-amber-200/60',
        Confirmed: 'bg-blue-50 text-blue-700 border-blue-200/60',
        Processing: 'bg-purple-50 text-purple-700 border-purple-200/60',
        Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        Cancelled: 'bg-red-50 text-red-700 border-red-200/60'
    };

    orders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'card bg-white p-5 rounded-2xl border border-[var(--border-color)] shadow-xs space-y-3';

        const itemsHtml = (order.items || []).map(i => `
            <div class="flex justify-between items-center text-xs py-1">
                <span class="text-gray-700 font-medium">${i.name} <span class="text-gray-400">×${i.qty}</span></span>
                <span class="font-semibold text-gray-900">${formatRupiah(i.price * i.qty)}</span>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div>
                    <span class="font-bold text-xs text-[var(--color-accent)] font-mono">${order.id}</span>
                    <span class="text-[10px] text-gray-400 block">${new Date(order.date).toLocaleString('id-ID')}</span>
                </div>
                <span class="px-2.5 py-1 rounded-full border text-[10px] font-bold ${statusBadges[order.status] || 'bg-gray-50 text-gray-600'}">
                    ${order.status}
                </span>
            </div>
            <div class="space-y-1">
                ${itemsHtml}
            </div>
            <div class="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                <span class="text-gray-500">Metode: <strong class="text-gray-700">${order.paymentMethod}</strong></span>
                <span class="font-serif font-bold text-sm text-[var(--color-accent)]">Total: ${formatRupiah(order.total)}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- Customer Profile View ---
function updateProfileViewInfo() {
    const user = getCurrentUser();
    if (user) {
        const nameEl = document.getElementById('cust-profile-name');
        const emailEl = document.getElementById('cust-profile-email');
        const phoneEl = document.getElementById('cust-profile-phone');
        if (nameEl) nameEl.textContent = user.name || 'Pelanggan';
        if (emailEl) emailEl.textContent = user.email || 'customer@email.com';
        if (phoneEl) phoneEl.textContent = user.phone || '081298765432';
    }
}

// --- Customer View Navigation ---
function showCustomerSection(sectionId) {
    document.querySelectorAll('.cust-page-view').forEach(sec => sec.classList.add('hidden'));

    const navIds = {
        home: 'cust-nav-home',
        catalog: 'cust-nav-catalog',
        orders: 'cust-nav-orders',
        profile: 'cust-nav-profile'
    };

    Object.values(navIds).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.classList.remove('active');
    });

    const target = document.getElementById('cust-' + sectionId);
    if (target) target.classList.remove('hidden');
    const activeNav = document.getElementById(navIds[sectionId]);
    if (activeNav) activeNav.classList.add('active');

    if (sectionId === 'catalog') {
        loadProducts().then(() => renderCatalogGrid(handleAddToCartClick));
    } else if (sectionId === 'orders') {
        loadCustomerOrders();
    } else if (sectionId === 'profile') {
        updateProfileViewInfo();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileCustomerNav() {
    const nav = document.getElementById('mobile-cust-nav');
    if (nav) nav.classList.toggle('hidden');
}

function updateCustomerNavState() {
    const statusArea = document.getElementById('cust-user-status-area');
    if (!statusArea) return;
    const user = getCurrentUser();

    if (user) {
        statusArea.innerHTML = `
            <div class="flex items-center gap-2.5">
                <span class="text-xs text-white/80 hidden lg:inline-block font-medium">Halo, <strong class="text-white">${user.name}</strong></span>
                <button id="cust-logout-btn" class="btn btn-sm btn-outline text-white/70 hover:text-white border-white/20 p-2 rounded-lg" title="Keluar">
                    <i class="fas fa-sign-out-alt text-xs"></i>
                </button>
            </div>
        `;
        document.getElementById('cust-logout-btn')?.addEventListener('click', () => {
            logoutUser(() => {
                updateCustomerNavState();
            });
        });
    } else {
        statusArea.innerHTML = `
            <button id="cust-login-btn" class="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-white px-4 py-2 rounded-full text-xs font-semibold transition active:scale-[0.98] shadow-sm">
                <i class="fas fa-sign-in-alt text-xs"></i>
                <span>Masuk</span>
            </button>
        `;
        document.getElementById('cust-login-btn')?.addEventListener('click', () => {
            switchView('login', getCurrentUser());
        });
    }
}

function handleAddToCartClick(productId) {
    addToCart(productId);
}

// --- Wire Global Window Compatibility layer for HTML attributes ---
window.switchView = (view) => {
    switchView(view, getCurrentUser());
    if (view === 'customer') {
        showCustomerSection('home');
        loadProducts().then(() => renderCatalogGrid(handleAddToCartClick));
        updateCustomerNavState();
    } else if (view === 'admin') {
        showAdminSection('dashboard');
    }
};

window.setLoginRole = setLoginRole;
window.togglePwdVisibility = togglePwdVisibility;
window.showCustomerSection = showCustomerSection;
window.toggleMobileCustomerNav = toggleMobileCustomerNav;
window.filterCatalogByCategory = (cat) => {
    filterCategory(cat);
    showCustomerSection('catalog');
};
window.handleCatalogSearchInput = (e) => {
    const q = e.target.value;
    setCurrentSearch(q);
    const clearBtn = document.getElementById('clear-search-btn');
    if (clearBtn) {
        if (q.trim() !== '') clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
    }
    loadProducts().then(() => renderCatalogGrid(handleAddToCartClick));
};
window.clearCatalogSearch = () => {
    clearSearch();
    loadProducts().then(() => renderCatalogGrid(handleAddToCartClick));
};
window.addToCart = (id) => addToCart(id);
window.changeCartQty = changeQty;
window.removeCartItem = removeItem;
window.toggleCartDrawer = toggleCartDrawer;
window.openCheckoutModal = () => openCheckoutModal(getCurrentUser());
window.closeCheckoutModal = closeCheckoutModal;
window.showAdminSection = showAdminSection;
window.toggleAdminSidebar = toggleAdminSidebar;
window.openAddProductModal = openAddProductModal;
window.closeProductCrudModal = closeProductCrudModal;
window.editProductPrompt = editProductPrompt;
window.deleteProduct = deleteProduct;
window.editStockPrompt = editStockPrompt;
window.updateOrderStatus = updateOrderStatus;
window.openOwnerProfileSheet = openOwnerProfileSheet;
window.closeOwnerProfileSheet = closeOwnerProfileSheet;
window.logout = () => {
    logoutUser(() => {
        updateCustomerNavState();
    });
};

// --- Form & Keyboard Event Handlers ---
function attachFormListeners() {
    // 1. Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-pwd').value;
            const currentRole = document.getElementById('owner-badge-tag')?.classList.contains('hidden') ? 'customer' : 'owner';

            const user = await handleLogin(email, password, currentRole);
            if (user) {
                if (user.role === 'owner') {
                    window.switchView('admin');
                } else {
                    window.switchView('customer');
                }
            }
        });
    }

    // 2. Checkout Form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('checkout-name').value;
            const email = document.getElementById('checkout-email').value;
            const method = document.getElementById('checkout-method').value;

            await submitCheckout(name, email, method, getCurrentUser(), (order) => {
                showCustomerSection('orders');
            });
        });
    }

    // 3. Product CRUD Form
    const productCrudForm = document.getElementById('product-crud-form');
    if (productCrudForm) {
        productCrudForm.addEventListener('submit', handleProductCrudSubmit);
    }

    // 4. Global Keyboard Shortcuts & Accessibility (R-32)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeOwnerProfileSheet();
            closeCheckoutModal();
            closeProductCrudModal();
            const cartDrawer = document.getElementById('cart-drawer');
            if (cartDrawer && !cartDrawer.classList.contains('translate-x-full')) {
                toggleCartDrawer();
            }
            const mobileNav = document.getElementById('mobile-cust-nav');
            if (mobileNav && !mobileNav.classList.contains('hidden')) {
                mobileNav.classList.add('hidden');
            }
        }
    });
}

// --- App Bootstrap ---
document.addEventListener('DOMContentLoaded', () => {
    // Prime local storage caches
    getStoredProducts();
    getStoredUsers();
    getStoredOrders();

    attachFormListeners();

    const activeUser = getCurrentUser();
    if (activeUser && activeUser.role === 'owner') {
        window.switchView('admin');
    } else {
        window.switchView('customer');
    }

    // Initial catalog render
    loadProducts().then(() => renderCatalogGrid(handleAddToCartClick));
    updateCartUI();
});
