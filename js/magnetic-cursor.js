// Advanced Magnetic Cursor Effect
class MagneticCursor {
    constructor() {
        this.cursor = null;
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.createCursor();
        this.bindEvents();
        this.setupMagneticElements();
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'magnetic-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(0, 212, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        document.body.appendChild(this.cursor);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.updateCursor();
        });
    }

    setupMagneticElements() {
        const elements = document.querySelectorAll('.btn, .social-link, .project-card, .skill-card');
        
        elements.forEach(el => {
            el.addEventListener('mouseenter', () => this.magnetize(el));
            el.addEventListener('mouseleave', () => {
                this.demagnetize();
                el.style.transform = 'translate(0px, 0px) perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
            el.addEventListener('mousemove', (e) => this.updateMagnetic(e, el));
        });
    }

    magnetize(element) {
        this.cursor.style.width = '30px';
        this.cursor.style.height = '30px';
        this.cursor.style.background = 'rgba(0, 212, 255, 0.2)';
        this.cursor.style.border = '1px solid rgba(0, 212, 255, 0.6)';
    }

    demagnetize() {
        this.cursor.style.width = '20px';
        this.cursor.style.height = '20px';
        this.cursor.style.background = 'rgba(0, 212, 255, 0.8)';
        this.cursor.style.border = 'none';
    }

    updateMagnetic(e, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.05;
        const deltaY = (e.clientY - centerY) * 0.05;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px) perspective(1000px) rotateX(${deltaY * -0.3}deg) rotateY(${deltaX * 0.3}deg) translateZ(10px)`;
        
        const attractX = centerX + (e.clientX - centerX) * 0.1;
        const attractY = centerY + (e.clientY - centerY) * 0.1;
        
        this.mouse.x = attractX;
        this.mouse.y = attractY;
        this.updateCursor();
    }

    updateCursor() {
        this.cursor.style.left = this.mouse.x - 10 + 'px';
        this.cursor.style.top = this.mouse.y - 10 + 'px';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768) {
        new MagneticCursor();
        document.body.style.cursor = 'none';
    }
});