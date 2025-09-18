// Professional 3D Performance Optimization
class Performance3D {
    constructor() {
        this.isLowEndDevice = this.detectLowEndDevice();
        this.reducedMotion = this.checkReducedMotion();
        this.init();
    }

    detectLowEndDevice() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return true;
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        
        // Check for low-end indicators
        const lowEndIndicators = [
            'intel hd graphics 3000',
            'intel hd graphics 4000',
            'adreno 3',
            'mali-4',
            'powervr sgx'
        ];
        
        const isLowEnd = lowEndIndicators.some(indicator => 
            renderer.toLowerCase().includes(indicator)
        );
        
        // Also check hardware concurrency
        const cores = navigator.hardwareConcurrency || 2;
        const memory = navigator.deviceMemory || 2;
        
        return isLowEnd || cores < 4 || memory < 4;
    }

    checkReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    init() {
        this.optimizeForDevice();
        this.setupIntersectionObserver();
        this.throttleAnimations();
    }

    optimizeForDevice() {
        const root = document.documentElement;
        
        if (this.isLowEndDevice || this.reducedMotion) {
            // Disable heavy 3D effects
            root.style.setProperty('--enable-3d-transforms', '0');
            root.style.setProperty('--animation-duration', '0.1s');
            
            // Disable 3D canvas on low-end devices
            const canvas = document.getElementById('3d-canvas');
            if (canvas) {
                canvas.style.display = 'none';
            }
            
            // Simplify hover effects
            const style = document.createElement('style');
            style.textContent = `
                .project-card:hover,
                .skill-card:hover {
                    transform: translateY(-3px) !important;
                }
                
                .btn:hover {
                    transform: translateY(-2px) !important;
                }
                
                .floating-3d {
                    animation: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                
                if (entry.isIntersecting) {
                    element.classList.add('in-viewport');
                    // Enable animations only when in viewport
                    element.style.willChange = 'transform, opacity';
                } else {
                    element.classList.remove('in-viewport');
                    // Disable animations when out of viewport
                    element.style.willChange = 'auto';
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });

        // Observe all animated elements
        document.querySelectorAll('.project-card, .skill-card, .btn').forEach(el => {
            observer.observe(el);
        });
    }

    throttleAnimations() {
        let ticking = false;
        
        const throttledMouseMove = (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Only process mouse events for elements in viewport
                    const inViewportElements = document.querySelectorAll('.in-viewport');
                    inViewportElements.forEach(element => {
                        if (element.matches(':hover')) {
                            // Process hover effects
                            this.processHoverEffect(element, e);
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        };

        document.addEventListener('mousemove', throttledMouseMove);
    }

    processHoverEffect(element, event) {
        if (this.isLowEndDevice) return;
        
        const rect = element.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        
        // Apply subtle 3D transform
        const rotateX = y * -5;
        const rotateY = x * 5;
        
        element.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(10px)
        `;
    }
}

// Lazy Loading for 3D Effects
class Lazy3DLoader {
    constructor() {
        this.loadedEffects = new Set();
        this.init();
    }

    init() {
        this.setupLazyLoading();
    }

    setupLazyLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.loadedEffects.has(entry.target)) {
                    this.loadEffect(entry.target);
                    this.loadedEffects.add(entry.target);
                }
            });
        }, {
            rootMargin: '100px'
        });

        // Observe sections for lazy loading
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    loadEffect(element) {
        // Add 3D effects only when section comes into view
        const cards = element.querySelectorAll('.project-card, .skill-card');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('3d-ready');
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Memory Management
class Memory3DManager {
    constructor() {
        this.cleanupInterval = null;
        this.init();
    }

    init() {
        this.startCleanupInterval();
        this.setupPageVisibilityHandler();
    }

    startCleanupInterval() {
        this.cleanupInterval = setInterval(() => {
            this.cleanupUnusedElements();
        }, 30000); // Clean up every 30 seconds
    }

    cleanupUnusedElements() {
        // Remove unused holographic overlays
        const overlays = document.querySelectorAll('.holographic-overlay');
        overlays.forEach(overlay => {
            const parent = overlay.parentElement;
            if (!parent || !parent.matches(':hover')) {
                overlay.remove();
            }
        });

        // Clean up unused event listeners
        this.cleanupEventListeners();
    }

    cleanupEventListeners() {
        // Remove event listeners from elements that are no longer in viewport
        const elements = document.querySelectorAll('[data-3d-listener]');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (!isVisible) {
                element.removeAttribute('data-3d-listener');
                // Clone and replace to remove all event listeners
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
            }
        });
    }

    setupPageVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause animations when page is hidden
                this.pauseAnimations();
            } else {
                // Resume animations when page is visible
                this.resumeAnimations();
            }
        });
    }

    pauseAnimations() {
        const style = document.createElement('style');
        style.id = 'pause-animations';
        style.textContent = `
            *, *::before, *::after {
                animation-play-state: paused !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    resumeAnimations() {
        const pauseStyle = document.getElementById('pause-animations');
        if (pauseStyle) {
            pauseStyle.remove();
        }
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    new Performance3D();
    new Lazy3DLoader();
    new Memory3DManager();
});

// Add CSS for performance optimizations
const performanceStyle = document.createElement('style');
performanceStyle.textContent = `
    /* Performance optimizations */
    .project-card,
    .skill-card,
    .btn {
        will-change: auto;
        backface-visibility: hidden;
        transform-style: preserve-3d;
    }
    
    .project-card.in-viewport,
    .skill-card.in-viewport,
    .btn.in-viewport {
        will-change: transform, opacity;
    }
    
    .3d-ready {
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        .project-card,
        .skill-card,
        .btn,
        .floating-3d {
            animation: none !important;
            transition: opacity 0.2s ease !important;
        }
        
        .project-card:hover,
        .skill-card:hover,
        .btn:hover {
            transform: none !important;
        }
    }
    
    /* Low-end device optimizations */
    @media (max-width: 768px) {
        .project-card:hover,
        .skill-card:hover {
            transform: translateY(-5px) !important;
        }
        
        .holographic-overlay {
            display: none !important;
        }
    }
`;
document.head.appendChild(performanceStyle);