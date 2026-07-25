/**
 * Admin Authentication Guard & Helper
 * Usage: Include this script in any protected admin HTML page.
 * It will automatically check for a valid session and redirect to login if unauthorized.
 */

(async function initAdminAuth() {
    const API_BASE = window.API_BASE_URL || "https://ingrowwth-innovations-nbih.onrender.com";

    // 1. Guard Protection
    // We only skip the check if we are already on the login page (to avoid infinite loops), 
    // although this script shouldn't typically be included there.
    if (!location.pathname.endsWith('admin-login.html')) {
        try {
            const res = await fetch(`${API_BASE}/api/me`, { credentials: 'include' });
            if (!res.ok) throw new Error("Unauthorized");

            const data = await res.json();

            // Update UI with user info if element exists
            const userDisplay = document.getElementById('userDisplay');
            if (userDisplay && data.user) {
                userDisplay.textContent = `Hello, ${data.user.username}`;
            }

        } catch (e) {
             
            console.warn("Auth check failed, redirecting to login...");
            window.location.href = 'admin-login.html';
        }
    }

    // 2. Logout Handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch(`${API_BASE}/api/logout`, { method: 'POST', credentials: 'include' });
            } catch (e) {
                console.error("Logout failed", e);
            } finally {
                window.location.href = 'admin-login.html';
            }
        });
    }
})();
