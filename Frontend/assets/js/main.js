// Initialize Lucide Icons
lucide.createIcons();

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });
}

// Intersection Observer for Animations
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animate-fade-in-up')) {
            entry.target.classList.add('animate-fade-in-up');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Fix for Lucide icons not rendering initially
window.onload = () => lucide.createIcons();

// Fallback for broken images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = function () {
            this.src = 'https://placehold.co/600x400/CCCCCC/333333?text=Image+Error';
        };
    });
});
