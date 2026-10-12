/**
 * Dinasti Musik - Authentication & Session Management Module
 * Handles login, credentials check, session state, and access control.
 */

import { apiClient } from './api.js';
import { getStoredUsers, getSessionUser, setSessionUser } from './storage.js';
import { showToast, switchView } from './ui.js';

let currentUser = getSessionUser();
let currentLoginRole = 'customer';

export function getCurrentUser() {
    return currentUser;
}

export function setCurrentUser(user) {
    currentUser = user;
    setSessionUser(user);
}

export function getCurrentLoginRole() {
    return currentLoginRole;
}

export function setCurrentLoginRole(role) {
    currentLoginRole = role;
}

/**
 * Handle form login submission with dual-engine (API + LocalStorage fallback).
 */
export async function handleLogin(email, password, role) {
    let loginSuccess = false;
    let loggedUser = null;

    // 1. Try Express REST API first
    try {
        const res = await apiClient.login(email, password, role);
        if (res && res.user) {
            loggedUser = res.user;
            loginSuccess = true;
        }
    } catch (err) {
        // Fallback silently if offline or network error, except if credentials explicitly failed on server
        if (err.message && (err.message.includes('password') || err.message.includes('hak akses'))) {
            showToast(err.message, 'error');
            return null;
        }
    }

    // 2. Fallback to LocalStorage
    if (!loginSuccess) {
        const users = getStoredUsers();
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!found) {
            showToast('Email atau password tidak sesuai. Silakan periksa kembali.', 'error');
            return null;
        }
        if (role && found.role !== role) {
            showToast(`Akun ini tidak memiliki hak akses sebagai ${role === 'owner' ? 'Owner' : 'Pelanggan'}.`, 'error');
            return null;
        }
        loggedUser = {
            id: found.id,
            name: found.name,
            email: found.email,
            role: found.role,
            phone: found.phone
        };
        loginSuccess = true;
    }

    setCurrentUser(loggedUser);
    showToast(`Selamat datang kembali, ${loggedUser.name}!`, 'success');
    return loggedUser;
}

/**
 * Log out current active user.
 */
export function logoutUser(onLogoutComplete) {
    setCurrentUser(null);
    switchView('login');
    showToast('Anda telah keluar dari akun.', 'info');
    if (typeof onLogoutComplete === 'function') {
        onLogoutComplete();
    }
}
