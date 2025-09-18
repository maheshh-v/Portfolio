/**
 * Advanced Portfolio Features
 * Sound effects, 3D animations, smooth transitions
 */

class AdvancedPortfolio {
    constructor() {
        this.sounds = {};
        this.soundEnabled = true;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        this.init();
    }
    
    async init() {
        await this.initSounds();
        this.init3DScene();
        this.initSmoothTransitions();
        this.initTiltEffects();
        this.bindEvents();
    }
    
    // Sound System
    async initSounds() {
        if (typeof Howl === 'undefined') return;
        
        this.sounds = {
            hover: new Howl({
                src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
                volume: 0.1,
                rate: 1.5
            }),
            click: new Howl({
                src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'],
                volume: 0.2,
                rate: 2
            })
        };
    }
    
    playSound(soundName) {
        if (this.soundEnabled && this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const toggle = document.getElementById('soundToggle');
        toggle.classList.toggle('muted', !this.soundEnabled);
    }
    
    // 3D Scene
    init3DScene() {
        if (typeof THREE === 'undefined') return;
        
        const container = document.getElementById('three-portfolio');
        if (!container) return;
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);
        
        // Create floating particles
        this.createFloatingParticles();
        
        // Camera position
        this.camera.position.z = 5;
        
        // Animation loop
        this.animate3D();
    }
    
    createFloatingParticles() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        
        for (let i = 0; i < 100; i++) {
            vertices.push(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            
            colors.push(0, 0.8, 1); // Cyan color
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    animate3D() {
        requestAnimationFrame(() => this.animate3D());
        
        if (this.particles) {
            this.particles.rotation.x += 0.001;
            this.particles.rotation.y += 0.002;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Smooth Page Transitions
    initSmoothTransitions() {
        const links = document.querySelectorAll('a[href^="pages/"], a[href="index.html"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.transitionToPage(link.href);
            });
        });
    }
    
    transitionToPage(url) {
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);
        
        // Trigger transition
        setTimeout(() => transition.classList.add('active'), 10);
        
        // Navigate after transition
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }
    
    // 3D Tilt Effects
    initTiltEffects() {
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
            card.addEventListener('mouseleave', () => this.resetTilt(card));
            card.addEventListener('mouseenter', () => this.playSound('hover'));
        });
    }
    
    handleTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        const rotateX = (mouseY / rect.height) * -10;
        const rotateY = (mouseX / rect.width) * 10;
        
        card.style.transform = `
            translateY(-12px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale(1.02)
        `;
    }
    
    resetTilt(card) {
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
    }
    
    // Event Bindings
    bindEvents() {
        // Sound toggle
        const soundToggle = document.getElementById('soundToggle');
        soundToggle?.addEventListener('click', () => {
            this.toggleSound();
            this.playSound('click');
        });
        
        // Button clicks
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', () => this.playSound('click'));
        });
        
        // Resize handler for 3D scene
        window.addEventListener('resize', () => this.handleResize());
    }
    
    handleResize() {
        if (!this.renderer || !this.camera) return;
        
        const container = document.getElementById('three-portfolio');
        if (!container) return;
        
        this.camera.aspect = container.offsetWidth / container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
}

// Email Signature Generator
function copySignature() {
    const signature = document.getElementById('signaturePreview').innerHTML;
    
    // Create temporary element
    const temp = document.createElement('div');
    temp.innerHTML = signature;
    document.body.appendChild(temp);
    
    // Select and copy
    const range = document.createRange();
    range.selectNode(temp);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    try {
        document.execCommand('copy');
        
        // Show success feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy signature:', err);
    }
    
    document.body.removeChild(temp);
    window.getSelection().removeAllRanges();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedPortfolio();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedPortfolio, copySignature };
}