// Professional 3D Interactions & Effects
class Professional3DEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupHolographicCards();
        this.setupFloatingElements();
        this.setupParallaxScrolling();
        this.setupMorphingShapes();
        this.setupGlowEffects();
    }

    setupHolographicCards() {
        const cards = document.querySelectorAll('.project-card, .skill-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createHolographicEffect(e.target);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.removeHolographicEffect(e.target);
            });
            
            card.addEventListener('mousemove', (e) => {
                this.updateHolographicEffect(e);
            });
        });
    }

    createHolographicEffect(element) {
        const hologram = document.createElement('div');
        hologram.className = 'holographic-overlay';
        hologram.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, 
                rgba(0, 212, 255, 0.1) 0%,
                rgba(99, 102, 241, 0.1) 25%,
                rgba(139, 92, 246, 0.1) 50%,
                rgba(245, 158, 11, 0.1) 75%,
                rgba(0, 212, 255, 0.1) 100%);
            background-size: 400% 400%;
            border-radius: inherit;
            pointer-events: none;
            z-index: 1;
            animation: holographicShift 2s ease-in-out infinite;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        element.style.position = 'relative';
        element.appendChild(hologram);
        
        setTimeout(() => {
            hologram.style.opacity = '1';
        }, 50);
    }

    removeHolographicEffect(element) {
        const hologram = element.querySelector('.holographic-overlay');
        if (hologram) {
            hologram.style.opacity = '0';
            setTimeout(() => {
                hologram.remove();
            }, 300);
        }
    }

    updateHolographicEffect(e) {
        const hologram = e.target.querySelector('.holographic-overlay');
        if (hologram) {
            const rect = e.target.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            hologram.style.background = `
                radial-gradient(circle at ${x}% ${y}%, 
                    rgba(0, 212, 255, 0.3) 0%,
                    rgba(99, 102, 241, 0.2) 30%,
                    rgba(139, 92, 246, 0.1) 60%,
                    transparent 100%)
            `;
        }
    }

    setupFloatingElements() {
        const floatingElements = document.querySelectorAll('.hero-title, .section-title');
        
        floatingElements.forEach((element, index) => {
            element.style.animation = `float3D ${6 + index}s ease-in-out infinite`;
            element.style.animationDelay = `${index * 0.5}s`;
        });
    }

    setupParallaxScrolling() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.project-card, .skill-card');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index % 3) * 0.2;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px) translateZ(${index * 2}px)`;
            });
        });
    }

    setupMorphingShapes() {
        const shapes = document.querySelectorAll('.morphing-shape');
        
        shapes.forEach((shape, index) => {
            const path = shape.querySelector('path');
            const morphStates = [
                'M50,50 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0',
                'M50,50 m-35,0 a35,45 0 1,0 70,0 a35,45 0 1,0 -70,0',
                'M50,50 m-45,0 a45,35 0 1,0 90,0 a45,35 0 1,0 -90,0',
                'M50,50 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0'
            ];
            
            let currentState = 0;
            
            setInterval(() => {
                currentState = (currentState + 1) % morphStates.length;
                path.style.transition = 'all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                path.setAttribute('d', morphStates[currentState]);
            }, 3000 + index * 1000);
        });
    }

    setupGlowEffects() {
        const glowElements = document.querySelectorAll('.btn, .social-link');
        
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.boxShadow = `
                    0 0 20px rgba(0, 212, 255, 0.6),
                    0 0 40px rgba(0, 212, 255, 0.4),
                    0 0 60px rgba(0, 212, 255, 0.2),
                    inset 0 0 20px rgba(255, 255, 255, 0.1)
                `;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.boxShadow = '';
            });
        });
    }
}

// Advanced 3D Text Effects
class Text3DEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupTextShadows();
        this.setupGlitchEffect();
        this.setupNeonEffect();
    }

    setupTextShadows() {
        const titles = document.querySelectorAll('.hero-title, .section-title');
        
        titles.forEach(title => {
            title.style.textShadow = `
                0 0 10px rgba(0, 212, 255, 0.8),
                0 0 20px rgba(0, 212, 255, 0.6),
                0 0 30px rgba(0, 212, 255, 0.4),
                0 0 40px rgba(0, 212, 255, 0.2),
                2px 2px 0px rgba(0, 0, 0, 0.3),
                4px 4px 0px rgba(0, 0, 0, 0.2),
                6px 6px 0px rgba(0, 0, 0, 0.1)
            `;
        });
    }

    setupGlitchEffect() {
        const glitchElements = document.querySelectorAll('.glitch-text');
        
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.triggerGlitch(element);
            });
        });
    }

    triggerGlitch(element) {
        element.style.animation = 'glitch 0.3s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 300);
    }

    setupNeonEffect() {
        const neonElements = document.querySelectorAll('.gradient-text');
        
        neonElements.forEach(element => {
            element.style.filter = `
                drop-shadow(0 0 10px rgba(0, 212, 255, 0.8))
                drop-shadow(0 0 20px rgba(99, 102, 241, 0.6))
                drop-shadow(0 0 30px rgba(139, 92, 246, 0.4))
            `;
        });
    }
}

// Initialize all 3D effects
document.addEventListener('DOMContentLoaded', () => {
    new Professional3DEffects();
    new Text3DEffects();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes holographicShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }
    
    @keyframes glitch {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-2px) rotateY(1deg); }
        40% { transform: translateX(2px) rotateY(-1deg); }
        60% { transform: translateX(-1px) rotateY(0.5deg); }
        80% { transform: translateX(1px) rotateY(-0.5deg); }
    }
    
    @keyframes float3D {
        0%, 100% { 
            transform: translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg); 
        }
        25% { 
            transform: translateY(-10px) translateZ(5px) rotateX(1deg) rotateY(0.5deg); 
        }
        50% { 
            transform: translateY(-20px) translateZ(10px) rotateX(2deg) rotateY(1deg); 
        }
        75% { 
            transform: translateY(-10px) translateZ(5px) rotateX(1deg) rotateY(0.5deg); 
        }
    }
    
    .morphing-shape {
        position: fixed;
        width: 100px;
        height: 100px;
        opacity: 0.1;
        pointer-events: none;
        z-index: -1;
        fill: none;
        stroke: var(--primary-color);
        stroke-width: 2;
        filter: blur(1px);
    }
    
    .shape-1 {
        top: 20%;
        left: 10%;
        animation: float3D 8s ease-in-out infinite;
    }
    
    .shape-2 {
        top: 60%;
        right: 15%;
        animation: float3D 10s ease-in-out infinite reverse;
    }
    
    .shape-3 {
        bottom: 20%;
        left: 20%;
        animation: float3D 12s ease-in-out infinite;
    }
`;
document.head.appendChild(style);