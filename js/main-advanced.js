/**
 * Advanced Portfolio Application Entry Point
 * Modern ES6+ architecture with performance optimization
 */

import { App } from './core/App.js';

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

async function initApp() {
  try {
    // Initialize main application
    window.portfolioApp = new App();
    
    // Legacy compatibility - keep existing functionality
    await initLegacyFeatures();
    
  } catch (error) {
    console.error('Failed to initialize portfolio app:', error);
    // Fallback to basic functionality
    initBasicFeatures();
  }
}

// Maintain backward compatibility with existing code
async function initLegacyFeatures() {
  const { CustomCursor, Navigation, ScrollAnimations } = await import('./main.js');
  
  // Only initialize if not already handled by new system
  if (!window.portfolioApp.modules.has('cursor')) {
    new CustomCursor();
  }
}

// Basic fallback functionality
function initBasicFeatures() {
  // Basic scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });
  
  document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
    observer.observe(el);
  });
  
  // Basic navigation
  const toggleBtn = document.querySelector('.toggle-btn');
  const navLinks = document.querySelector('.nav-links');
  
  toggleBtn?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
  });
}