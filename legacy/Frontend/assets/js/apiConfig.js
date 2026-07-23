/**
 * Global API Configuration
 * Auto-detects if running locally or in production.
 */

(function () {
    const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";

    // Define the global constant
    window.API_BASE_URL = isLocal
        ? "http://localhost:5000"
        : ""; // Relative path for Vercel (Same Origin)

    console.log(`[Config] API Base URL set to: ${window.API_BASE_URL || "Relative (Same Origin)"}`);
})();
