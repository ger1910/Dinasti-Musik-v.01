/**
 * Dinasti Musik - REST API Client Module
 * Provides unified, promise-based API communication with fail-soft fallback.
 */

const API_BASE = '/api';

export const apiClient = {
    // Auth endpoints
    async login(email, password, role) {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || 'Autentikasi gagal');
        }
        return data;
    },

    async register(name, email, password, phone) {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || 'Pendaftaran gagal');
        }
        return data;
    },

    // Products endpoints
    async getProducts(category, search) {
        let url = `${API_BASE}/products`;
        const params = new URLSearchParams();
        if (category && category !== 'Semua') params.append('category', category);
        if (search) params.append('q', search);
        const qs = params.toString();
        if (qs) url += `?${qs}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Gagal memuat produk');
        return await response.json();
    },

    async createProduct(productData) {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error('Gagal menambahkan produk');
        return await response.json();
    },

    async updateProduct(id, updates) {
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Gagal memperbarui produk');
        return await response.json();
    },

    async deleteProduct(id) {
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Gagal menghapus produk');
        return await response.json();
    },

    // Orders endpoints
    async getOrders(customerId) {
        let url = `${API_BASE}/orders`;
        if (customerId) url += `?customerId=${encodeURIComponent(customerId)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Gagal memuat pesanan');
        return await response.json();
    },

    async createOrder(orderPayload) {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });
        if (!response.ok) throw new Error('Gagal membuat pesanan');
        return await response.json();
    },

    async updateOrderStatus(orderId, status) {
        const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Gagal memperbarui status transaksi');
        return await response.json();
    },

    // Owner / Analytics endpoints
    async getOwnerStats() {
        const response = await fetch(`${API_BASE}/owner/stats`);
        if (!response.ok) throw new Error('Gagal memuat statistik pemilik');
        return await response.json();
    },

    async getStoreConfig() {
        const response = await fetch(`${API_BASE}/config`);
        if (!response.ok) throw new Error('Gagal memuat konfigurasi toko');
        return await response.json();
    }
};
