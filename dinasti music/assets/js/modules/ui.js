/**
 * Dinasti Musik - UI & View Orchestrator Module
 * Manages view transitions, toast notifications, modals, and responsive drawers.
 */

let currentView = 'login';

/**
 * Display an agency-grade toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const icons = {
        success: 'fa-check-circle text-emerald-500',
        error: 'fa-exclamation-circle text-red-500',
        info: 'fa-info-circle text-[var(--color-accent)]'
    };

    toast.className = 'flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-xl border border-[var(--border-color)] text-xs sm:text-sm font-medium text-[var(--text-primary)] transition-all duration-300 pointer-events-auto transform translate-y-2 opacity-0 backdrop-blur-md';
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info} text-base sm:text-lg"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', '-translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/**
 * Toggle password input visibility.
 */
export function togglePwdVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) icon.className = 'fas fa-eye-slash text-sm';
    } else {
        input.type = 'password';
        if (icon) icon.className = 'fas fa-eye text-sm';
    }
}

/**
 * Set active role tab on Login view.
 */
export function setLoginRole(role) {
    const custTab = document.getElementById('role-tab-customer');
    const ownerTab = document.getElementById('role-tab-owner');
    const heading = document.getElementById('login-heading');
    const subheading = document.getElementById('login-subheading');
    const badgeTag = document.getElementById('owner-badge-tag');
    const emailInput = document.getElementById('login-email');

    if (role === 'customer') {
        if (custTab) custTab.className = 'flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 bg-[var(--color-accent)] text-white shadow-sm';
        if (ownerTab) ownerTab.className = 'flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 text-white/50 hover:text-white/80';
        if (heading) heading.textContent = 'Selamat Datang';
        if (subheading) subheading.textContent = 'Masuk ke akun Dinasti Musik Anda';
        if (badgeTag) badgeTag.classList.add('hidden');
        if (emailInput) emailInput.placeholder = 'customer@email.com';
    } else {
        if (ownerTab) ownerTab.className = 'flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 bg-[var(--color-accent)] text-white shadow-sm';
        if (custTab) custTab.className = 'flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 text-white/50 hover:text-white/80';
        if (heading) heading.textContent = 'Owner Portal';
        if (subheading) subheading.textContent = 'Akses khusus pemilik & manajemen toko';
        if (badgeTag) badgeTag.classList.remove('hidden');
        if (emailInput) emailInput.placeholder = 'admin@dinastimusik.com';
    }
}

/**
 * Global View Switcher: 'login' | 'customer' | 'admin'
 */
export function switchView(viewName, currentUser) {
    currentView = viewName;
    const loginPage = document.getElementById('login-page');
    const customerWrapper = document.getElementById('customer-wrapper');
    const adminWrapper = document.getElementById('admin-wrapper');
    const waFloating = document.getElementById('whatsapp-floating-btn');

    if (loginPage) loginPage.classList.add('hidden');
    if (customerWrapper) customerWrapper.classList.add('hidden');
    if (adminWrapper) adminWrapper.classList.add('hidden');
    if (waFloating) waFloating.classList.add('hidden');

    if (viewName === 'login') {
        if (loginPage) loginPage.classList.remove('hidden');
    } else if (viewName === 'customer') {
        if (customerWrapper) customerWrapper.classList.remove('hidden');
        if (waFloating) waFloating.classList.remove('hidden');
    } else if (viewName === 'admin') {
        if (!currentUser || currentUser.role !== 'owner') {
            showToast('Akses khusus Owner. Silakan login dengan akun manajemen.', 'error');
            switchView('login');
            setLoginRole('owner');
            return;
        }
        if (adminWrapper) adminWrapper.classList.remove('hidden');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
