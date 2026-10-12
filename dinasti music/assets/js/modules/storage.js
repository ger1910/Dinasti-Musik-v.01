/**
 * Dinasti Musik - Local Storage Persistence Module
 * Provides robust localStorage abstraction with automated seed data population.
 */

import { DEFAULT_SEED_DATA } from './data.js';

const STORAGE_KEYS = {
    PRODUCTS: 'dm_products',
    USERS: 'dm_users',
    ORDERS: 'dm_orders',
    SESSION_USER: 'dm_user'
};

export function getStoredProducts() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_SEED_DATA.products));
        return DEFAULT_SEED_DATA.products;
    } catch (e) {
        return DEFAULT_SEED_DATA.products;
    }
}

export function saveStoredProducts(products) {
    try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
        console.error('Failed to save products to localStorage:', e);
    }
}

export function getStoredUsers() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.USERS);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_SEED_DATA.users));
        return DEFAULT_SEED_DATA.users;
    } catch (e) {
        return DEFAULT_SEED_DATA.users;
    }
}

export function getStoredOrders() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_SEED_DATA.orders));
        return DEFAULT_SEED_DATA.orders;
    } catch (e) {
        return DEFAULT_SEED_DATA.orders;
    }
}

export function saveStoredOrders(orders) {
    try {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
        console.error('Failed to save orders to localStorage:', e);
    }
}

export function getSessionUser() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEYS.SESSION_USER);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

export function setSessionUser(user) {
    try {
        if (user) {
            sessionStorage.setItem(STORAGE_KEYS.SESSION_USER, JSON.stringify(user));
        } else {
            sessionStorage.removeItem(STORAGE_KEYS.SESSION_USER);
        }
    } catch (e) {
        console.error('Failed to set session user:', e);
    }
}
