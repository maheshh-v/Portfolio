// Enhanced Custom Cursor
class CustomCursor {
    constructor() {
        this.cursorDot = null;
        this.cursorOutline = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.outlineX = 0;
        this.outlineY = 0;
        
        this.init();
    }
    
    init() {
        this.createCursor();
        this.bindEvents();
        this.animate();
    }
    
    createCursor() {
        this.cursorDot = document.createElement('div');
        this.cursorOutline = document.createElement('div');
        this.cursorDot.className = 'cursor-dot';
        this.cursorOutline.className = 'cursor-outline';
        document.body.appendChild(this.cursorDot);
        document.body.appendChild(this.cursorOutline);
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.cursorDot.style.left = this.mouseX + 'px';
            this.cursorDot.style.top = this.mouseY + 'px';
        });
        
        // Hover effects
        document.querySelectorAll('a, button, .btn, .skill-card, .project-card, .social-link').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursorDot.classList.add('hover');
                this.cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                this.cursorDot.classList.remove('hover');
                this.cursorOutline.classList.remove('hover');
            });
        });
    }
    
    animate() {
        this.outlineX += (this.mouseX - this.outlineX) * 0.2;
        this.outlineY += (this.mouseY - this.outlineY) * 0.2;
        this.cursorOutline.style.left = this.outlineX + 'px';
        this.cursorOutline.style.top = this.outlineY + 'px';
        requestAnimationFrame(() => this.animate());
    }
}

// Enhanced Mobile Navigation
class Navigation {
    constructor() {
        this.toggleBtn = document.querySelector('.toggle-btn');
        this.navLinks = document.querySelector('.nav-links');
        this.navItems = document.querySelectorAll('.nav-links a');
        this.header = document.querySelector('header');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleScroll();
    }
    
    bindEvents() {
        this.toggleBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
        
        document.addEventListener('click', (e) => {
            if (!this.navLinks?.contains(e.target) && !this.toggleBtn?.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }
    
    toggleMenu() {
        this.navLinks?.classList.toggle('active');
        this.toggleBtn?.classList.toggle('active');
    }
    
    closeMenu() {
        this.navLinks?.classList.remove('active');
        this.toggleBtn?.classList.remove('active');
    }
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.header?.classList.add('scrolled');
        } else {
            this.header?.classList.remove('scrolled');
        }
    }
}

// Enhanced Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        this.createObserver();
        this.observeElements();
    }
    
    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, this.observerOptions);
    }
    
    observeElements() {
        const elements = document.querySelectorAll('.fade-in, .fade-in-up, .project-card, .skill-card');
        elements.forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
    new Navigation();
    new ScrollAnimations();
});