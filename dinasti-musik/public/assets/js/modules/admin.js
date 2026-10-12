/**
 * Dinasti Musik - Admin & Owner Creative Hub Module
 * Manages store telemetry, inventory CRUD, POS orders, and customer insights.
 */

import { apiClient } from './api.js';
import { getStoredProducts, saveStoredProducts, getStoredOrders, saveStoredOrders, getStoredUsers } from './storage.js';
import { formatRupiah } from './data.js';
import { showToast } from './ui.js';

export function showAdminSection(sectionId) {
    document.querySelectorAll('.admin-tab-content').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

    const target = document.getElementById('sec-' + sectionId);
    const targetBtn = document.getElementById('nav-btn-' + sectionId);

    if (target) target.classList.remove('hidden');
    if (targetBtn) targetBtn.classList.add('active');

    if (sectionId === 'dashboard') loadOwnerStats();
    if (sectionId === 'products') loadOwnerProductsTable();
    if (sectionId === 'transactions') loadOwnerOrdersTable();
    if (sectionId === 'stock') loadOwnerStockView();
    if (sectionId === 'customers') loadOwnerCustomersView();

    const overlay = document.getElementById('admin-sidebar-overlay');
    if (overlay && !overlay.classList.contains('hidden')) {
        toggleAdminSidebar();
    }
}

export function toggleAdminSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('admin-sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('-translate-x-full');
    if (overlay) overlay.classList.toggle('hidden');
}

export async function loadOwnerStats() {
    let stats = null;
    try {
        stats = await apiClient.getOwnerStats();
    } catch (err) {
        // Fallback
    }

    if (!stats) {
        const orders = getStoredOrders();
        const prods = getStoredProducts();
        const rev = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        stats = {
            totalRevenue: rev,
            totalOrders: orders.length,
            totalProducts: prods.length,
            lowStockCount: prods.filter(p => p.stock <= 2).length,
            recentOrders: orders.slice(0, 5)
        };
    }

    const revEl = document.getElementById('owner-stat-revenue');
    const ordersEl = document.getElementById('owner-stat-orders');
    const prodsEl = document.getElementById('owner-stat-products');
    const lowStockEl = document.getElementById('owner-stat-lowstock');

    if (revEl) revEl.textContent = formatRupiah(stats.totalRevenue);
    if (ordersEl) ordersEl.textContent = stats.totalOrders;
    if (prodsEl) prodsEl.textContent = stats.totalProducts;
    if (lowStockEl) lowStockEl.textContent = stats.lowStockCount;

    const tbody = document.getElementById('owner-recent-orders-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!stats.recentOrders || stats.recentOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-400 text-xs">Belum ada data transaksi.</td></tr>';
        return;
    }

    stats.recentOrders.forEach(o => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50/80 transition-colors border-b border-gray-50';
        tr.innerHTML = `
            <td class="p-3 font-bold text-xs text-[var(--color-accent)] font-mono">${o.id}</td>
            <td class="p-3 text-gray-500 text-xs">${new Date(o.date).toLocaleDateString('id-ID')}</td>
            <td class="p-3 font-medium text-xs text-[var(--text-primary)]">${o.customerName}</td>
            <td class="p-3 font-bold text-xs text-[var(--text-primary)]">${formatRupiah(o.total)}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">${o.status}</span></td>
            <td class="p-3 text-right">
                <select class="status-select text-xs border border-gray-200 rounded-lg p-1 bg-white font-medium focus:ring-1 focus:ring-[var(--color-accent)]" data-order-id="${o.id}">
                    <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.status-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
            const id = e.target.getAttribute('data-order-id');
            updateOrderStatus(id, e.target.value);
        });
    });
}

export async function loadOwnerProductsTable() {
    const tbody = document.getElementById('owner-products-table-body');
    if (!tbody) return;

    let products = [];
    try {
        const data = await apiClient.getProducts();
        products = data.products || [];
    } catch (err) {
        products = getStoredProducts();
    }

    tbody.innerHTML = '';
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-400 text-xs">Katalog inventaris kosong.</td></tr>';
        return;
    }

    products.forEach(p => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50/80 transition-colors border-b border-gray-50';
        tr.innerHTML = `
            <td class="p-3">
                <div class="flex items-center gap-3">
                    <img src="${p.image}" class="w-10 h-10 rounded-lg object-cover border border-gray-200" alt="${p.name}">
                    <div>
                        <h4 class="font-semibold text-xs text-[var(--text-primary)]">${p.name}</h4>
                        <span class="text-[10px] text-gray-400 font-mono">${p.id}</span>
                    </div>
                </div>
            </td>
            <td class="p-3 text-xs text-gray-600">${p.category}</td>
            <td class="p-3 font-bold text-xs text-[var(--color-accent)]">${formatRupiah(p.price)}</td>
            <td class="p-3 font-bold text-xs ${p.stock <= 2 ? 'text-red-600' : 'text-gray-800'}">${p.stock} Unit</td>
            <td class="p-3">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    p.stock > 0 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                        : 'bg-red-50 text-red-700 border border-red-200/60'
                }">
                    ${p.stock > 0 ? 'Tersedia' : 'Habis'}
                </span>
            </td>
            <td class="p-3 text-right whitespace-nowrap">
                <button data-edit-id="${p.id}" class="edit-prod-btn text-blue-600 hover:text-blue-800 text-xs mr-3 font-medium">Edit</button>
                <button data-del-id="${p.id}" class="del-prod-btn text-red-600 hover:text-red-800 text-xs font-medium">Hapus</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.edit-prod-btn').forEach(btn => {
        btn.addEventListener('click', () => editProductPrompt(btn.getAttribute('data-edit-id')));
    });

    tbody.querySelectorAll('.del-prod-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(btn.getAttribute('data-del-id')));
    });
}

export async function loadOwnerOrdersTable() {
    const tbody = document.getElementById('owner-all-orders-body');
    if (!tbody) return;

    let orders = [];
    try {
        orders = await apiClient.getOrders();
    } catch (err) {
        orders = getStoredOrders();
    }

    tbody.innerHTML = '';
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-400 text-xs">Belum ada riwayat pesanan.</td></tr>';
        return;
    }

    orders.forEach(o => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50/80 transition-colors border-b border-gray-50';
        tr.innerHTML = `
            <td class="p-3 font-bold text-xs text-[var(--color-accent)] font-mono">${o.id}</td>
            <td class="p-3 text-xs text-gray-500">${new Date(o.date).toLocaleString('id-ID')}</td>
            <td class="p-3 font-medium text-xs text-[var(--text-primary)]">${o.customerName}</td>
            <td class="p-3 text-xs text-gray-600 max-w-xs truncate">${(o.items || []).map(i => `${i.name} (x${i.qty})`).join(', ')}</td>
            <td class="p-3 font-bold text-xs text-[var(--text-primary)]">${formatRupiah(o.total)}</td>
            <td class="p-3 text-xs text-gray-500">${o.paymentMethod}</td>
            <td class="p-3 text-right">
                <select class="order-status-select text-xs border border-gray-200 rounded-lg p-1 bg-white font-medium focus:ring-1 focus:ring-[var(--color-accent)]" data-order-id="${o.id}">
                    <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.order-status-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
            const id = e.target.getAttribute('data-order-id');
            updateOrderStatus(id, e.target.value);
        });
    });
}

export async function updateOrderStatus(orderId, newStatus) {
    try {
        await apiClient.updateOrderStatus(orderId, newStatus);
    } catch (err) {}

    const orders = getStoredOrders();
    const ord = orders.find(o => o.id === orderId);
    if (ord) {
        ord.status = newStatus;
        saveStoredOrders(orders);
    }
    showToast(`Status transaksi ${orderId} diperbarui: ${newStatus}`, 'success');
}

export async function loadOwnerStockView() {
    const container = document.getElementById('owner-stock-list');
    if (!container) return;

    let products = [];
    try {
        const data = await apiClient.getProducts();
        products = data.products || [];
    } catch (err) {
        products = getStoredProducts();
    }

    container.innerHTML = '';
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-color)] bg-white shadow-xs';
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <img src="${p.image}" class="w-11 h-11 rounded-lg object-cover border border-gray-100" alt="${p.name}">
                <div>
                    <h4 class="font-bold text-xs text-[var(--text-primary)]">${p.name}</h4>
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider">${p.category}</span>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="font-bold text-xs ${p.stock <= 3 ? 'text-red-600' : 'text-emerald-700'}">${p.stock} Unit Tersedia</span>
                <button data-stock-id="${p.id}" data-current-stock="${p.stock}" class="restock-btn btn btn-outline btn-sm py-1 px-3 text-[10px] font-semibold border-[var(--border-color)] hover:bg-gray-50">Restock</button>
            </div>
        `;
        container.appendChild(div);
    });

    container.querySelectorAll('.restock-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-stock-id');
            const cur = parseInt(btn.getAttribute('data-current-stock'), 10);
            editStockPrompt(id, cur);
        });
    });
}

export async function editStockPrompt(id, currentStock) {
    const newVal = prompt('Masukkan kuantitas stok baru:', currentStock);
    if (newVal !== null && !isNaN(newVal)) {
        const parsedStock = Number(newVal);
        try {
            await apiClient.updateProduct(id, { stock: parsedStock });
        } catch (e) {}

        const products = getStoredProducts();
        const p = products.find(prod => prod.id === id);
        if (p) {
            p.stock = parsedStock;
            saveStoredProducts(products);
        }
        showToast('Stok berhasil diperbarui!', 'success');
        loadOwnerStockView();
    }
}

export async function loadOwnerCustomersView() {
    const container = document.getElementById('owner-customers-list');
    if (!container) return;

    let orders = [];
    try {
        orders = await apiClient.getOrders();
    } catch (err) {
        orders = getStoredOrders();
    }

    const customersMap = {};
    orders.forEach(o => {
        const email = o.customerEmail || 'unknown';
        if (!customersMap[email]) {
            customersMap[email] = { name: o.customerName || 'Customer', email: email, count: 0, total: 0 };
        }
        customersMap[email].count++;
        customersMap[email].total += (o.total || 0);
    });

    const list = Object.values(customersMap);
    container.innerHTML = '';
    if (list.length === 0) {
        container.innerHTML = '<p class="text-center py-8 text-gray-400 text-xs">Belum ada pelanggan terdaftar.</p>';
        return;
    }

    list.forEach(c => {
        const div = document.createElement('div');
        div.className = 'py-3 flex justify-between items-center text-xs border-b border-gray-50 last:border-0';
        div.innerHTML = `
            <div>
                <h4 class="font-bold text-[var(--text-primary)]">${c.name}</h4>
                <span class="text-gray-400 text-[10px] font-mono">${c.email}</span>
            </div>
            <div class="text-right">
                <span class="font-semibold text-gray-600 block">${c.count} Transaksi</span>
                <span class="font-bold text-[var(--color-accent)]">${formatRupiah(c.total)}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

export function openAddProductModal() {
    document.getElementById('crud-product-id').value = '';
    document.getElementById('crud-product-name').value = '';
    document.getElementById('crud-product-brand').value = '';
    document.getElementById('crud-product-price').value = '';
    document.getElementById('crud-product-stock').value = '';
    document.getElementById('crud-product-image').value = '';
    document.getElementById('crud-product-desc').value = '';
    document.getElementById('product-crud-title').textContent = 'Tambah Produk Baru';
    document.getElementById('product-crud-modal').classList.remove('hidden');
}

export function closeProductCrudModal() {
    const modal = document.getElementById('product-crud-modal');
    if (modal) modal.classList.add('hidden');
}

export function editProductPrompt(id) {
    const products = getStoredProducts();
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    document.getElementById('crud-product-id').value = prod.id;
    document.getElementById('crud-product-name').value = prod.name;
    document.getElementById('crud-product-brand').value = prod.brand || '';
    document.getElementById('crud-product-category').value = prod.category;
    document.getElementById('crud-product-price').value = prod.price;
    document.getElementById('crud-product-stock').value = prod.stock;
    document.getElementById('crud-product-image').value = prod.image;
    document.getElementById('crud-product-desc').value = prod.description || '';
    document.getElementById('product-crud-title').textContent = 'Edit Spesifikasi Produk';
    document.getElementById('product-crud-modal').classList.remove('hidden');
}

export async function handleProductCrudSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('crud-product-id').value;
    const payload = {
        name: document.getElementById('crud-product-name').value,
        brand: document.getElementById('crud-product-brand').value,
        category: document.getElementById('crud-product-category').value,
        price: Number(document.getElementById('crud-product-price').value),
        stock: Number(document.getElementById('crud-product-stock').value),
        image: document.getElementById('crud-product-image').value || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        description: document.getElementById('crud-product-desc').value
    };

    // Try API
    try {
        if (id) {
            await apiClient.updateProduct(id, payload);
        } else {
            await apiClient.createProduct(payload);
        }
    } catch (err) {}

    // Update LocalStorage
    const products = getStoredProducts();
    if (id) {
        const idx = products.findIndex(p => p.id === id);
        if (idx !== -1) {
            products[idx] = { ...products[idx], ...payload };
        }
    } else {
        products.push({
            id: 'PROD-' + Date.now().toString().slice(-4),
            ...payload,
            rating: 5.0,
            status: payload.stock > 0 ? 'In Stock' : 'Out of Stock'
        });
    }
    saveStoredProducts(products);

    showToast(id ? 'Produk berhasil diperbarui!' : 'Produk baru berhasil ditambahkan!', 'success');
    closeProductCrudModal();
    loadOwnerProductsTable();
}

export async function deleteProduct(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini secara permanen?')) return;
    try {
        await apiClient.deleteProduct(id);
    } catch (err) {}

    let products = getStoredProducts();
    products = products.filter(p => p.id !== id);
    saveStoredProducts(products);

    showToast('Produk berhasil dihapus dari sistem.', 'success');
    loadOwnerProductsTable();
}

export async function openOwnerProfileSheet() {
    const sheet = document.getElementById('owner-sheet-backdrop');
    if (!sheet) return;
    sheet.classList.add('active');

    try {
        const ordersCountEl = document.getElementById('sheet-orders-count');
        const customersCountEl = document.getElementById('sheet-customers-count');

        let totalOrders = 24;
        let totalCustomers = 18;

        const localOrders = getStoredOrders();
        const localUsers = getStoredUsers();
        if (localOrders.length) totalOrders = localOrders.length;
        if (localUsers.length) totalCustomers = localUsers.filter(u => u.role === 'customer').length || totalCustomers;

        if (ordersCountEl) ordersCountEl.textContent = totalOrders + ' Pesanan';
        if (customersCountEl) customersCountEl.textContent = totalCustomers + ' Pelanggan';
    } catch (e) {
        console.error(e);
    }
}

export function closeOwnerProfileSheet() {
    const sheet = document.getElementById('owner-sheet-backdrop');
    if (sheet) sheet.classList.remove('active');
}
