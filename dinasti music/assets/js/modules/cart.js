/**
 * Dinasti Musik - Cart & Checkout Module
 * Manages shopping cart state, drawer interactions, and order creation.
 */

import { apiClient } from './api.js';
import { getStoredProducts, saveStoredProducts, getStoredOrders, saveStoredOrders } from './storage.js';
import { formatRupiah } from './data.js';
import { showToast } from './ui.js';

let cart = [];

export function getCartItems() {
    return cart;
}

export function setCartItems(items) {
    cart = items;
    updateCartUI();
}

/**
 * Add a product to the cart.
 */
export function addToCart(productId, productsList) {
    const prods = (productsList && productsList.length) ? productsList : getStoredProducts();
    const product = prods.find(p => p.id === productId);

    if (!product) {
        showToast('Produk tidak ditemukan.', 'error');
        return;
    }

    if (product.stock <= 0) {
        showToast('Maaf, stok produk ini telah habis.', 'error');
        return;
    }

    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        if (existing.qty + 1 > product.stock) {
            showToast(`Batas maksimum tercapai (${product.stock} unit).`, 'error');
            return;
        }
        existing.qty++;
    } else {
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: 1
        });
    }

    updateCartUI();
    showToast(`"${product.name}" ditambahkan ke keranjang.`, 'success');
}

/**
 * Update the visual representation of the cart badge, list, and totals.
 */
export function updateCartUI() {
    const badge = document.getElementById('cust-cart-badge');
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (badge) badge.textContent = totalCount;

    const container = document.getElementById('cart-items-container');
    const totalPriceEl = document.getElementById('cart-total-price');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 text-gray-400">
                <div class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3 text-xl text-gray-300">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <p class="text-xs sm:text-sm font-medium text-gray-500">Keranjang Anda masih kosong</p>
                <p class="text-[11px] text-gray-400 mt-1">Pilih instrumen favorit dari katalog kami</p>
            </div>
        `;
        if (totalPriceEl) totalPriceEl.textContent = 'Rp 0';
        return;
    }

    cart.forEach((item, idx) => {
        total += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'flex items-center gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-white shadow-xs';
        div.innerHTML = `
            <img src="${item.image}" class="w-12 h-12 rounded-lg object-cover border border-gray-100" alt="${item.name}">
            <div class="flex-1 min-w-0">
                <h4 class="font-medium text-xs text-[var(--text-primary)] truncate">${item.name}</h4>
                <span class="text-[#7C5329] font-bold text-xs">${formatRupiah(item.price)}</span>
            </div>
            <div class="flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-100">
                <button data-cart-delta="-1" data-index="${idx}" class="cart-qty-btn w-5 h-5 rounded bg-white text-xs flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 shadow-xs">-</button>
                <span class="text-xs font-semibold px-1 min-w-[16px] text-center">${item.qty}</span>
                <button data-cart-delta="1" data-index="${idx}" class="cart-qty-btn w-5 h-5 rounded bg-white text-xs flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 shadow-xs">+</button>
                <button data-cart-remove="${idx}" class="cart-del-btn text-red-400 hover:text-red-600 text-xs p-1 ml-1" title="Hapus"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        container.appendChild(div);
    });

    // Attach listeners
    container.querySelectorAll('.cart-qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.getAttribute('data-index'), 10);
            const delta = parseInt(btn.getAttribute('data-delta') || btn.getAttribute('data-cart-delta'), 10);
            changeQty(idx, delta);
        });
    });

    container.querySelectorAll('.cart-del-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-cart-remove'), 10);
            removeItem(idx);
        });
    });

    if (totalPriceEl) totalPriceEl.textContent = formatRupiah(total);
}

export function changeQty(index, delta) {
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

export function removeItem(index) {
    if (!cart[index]) return;
    cart.splice(index, 1);
    updateCartUI();
}

export function toggleCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    if (drawer) drawer.classList.toggle('translate-x-full');
    if (backdrop) backdrop.classList.toggle('hidden');
}

export function openCheckoutModal(currentUser) {
    if (cart.length === 0) {
        showToast('Keranjang belanja masih kosong.', 'error');
        return;
    }
    if (currentUser) {
        const nameEl = document.getElementById('checkout-name');
        const emailEl = document.getElementById('checkout-email');
        if (nameEl) nameEl.value = currentUser.name || '';
        if (emailEl) emailEl.value = currentUser.email || '';
    }
    toggleCartDrawer();
    const modalBackdrop = document.getElementById('checkout-modal-backdrop');
    if (modalBackdrop) modalBackdrop.classList.remove('hidden');
}

export function closeCheckoutModal() {
    const modalBackdrop = document.getElementById('checkout-modal-backdrop');
    if (modalBackdrop) modalBackdrop.classList.add('hidden');
}

/**
 * Handle checkout submission.
 */
export async function submitCheckout(name, email, paymentMethod, currentUser, onSuccess) {
    let orderCreated = null;

    // 1. Try REST API
    try {
        const res = await apiClient.createOrder({
            customerId: currentUser ? currentUser.id : 'GUEST',
            customerName: name,
            customerEmail: email,
            items: cart,
            paymentMethod: paymentMethod
        });
        if (res && res.order) {
            orderCreated = res.order;
        }
    } catch (err) {
        // Fallback to client storage
    }

    // 2. Client fallback
    if (!orderCreated) {
        const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        orderCreated = {
            id: 'TRX-' + Date.now().toString().slice(-6),
            date: new Date().toISOString(),
            customerId: currentUser ? currentUser.id : 'GUEST',
            customerName: name,
            customerEmail: email,
            items: [...cart],
            subtotal: total,
            total: total,
            paymentMethod: paymentMethod,
            status: 'Pending'
        };

        const orders = getStoredOrders();
        orders.unshift(orderCreated);
        saveStoredOrders(orders);

        // Deduct local product stock
        const products = getStoredProducts();
        cart.forEach(ci => {
            const p = products.find(prod => prod.id === ci.productId);
            if (p) p.stock = Math.max(0, p.stock - ci.qty);
        });
        saveStoredProducts(products);
    }

    cart = [];
    updateCartUI();
    closeCheckoutModal();
    showToast(`Transaksi ${orderCreated.id} berhasil diproses!`, 'success');

    if (typeof onSuccess === 'function') {
        onSuccess(orderCreated);
    }

    return orderCreated;
}
