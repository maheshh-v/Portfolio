/**
 * Advanced Animation System
 * Handles all animations with performance optimization
 */
export class AnimationManager {
  constructor(app) {
    this.app = app;
    this.observers = new Map();
    this.animations = new Map();
    this.rafId = null;
    
    this.init();
  }
  
  init() {
    this.createIntersectionObserver();
    this.bindEvents();
    this.startAnimationLoop();
  }
  
  createIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.triggerAnimation(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    this.observers.set('scroll', observer);
    this.observeElements();
  }
  
  observeElements() {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => {
      this.observers.get('scroll').observe(el);
    });
  }
  
  triggerAnimation(element) {
    const animationType = element.dataset.animate;
    const delay = parseInt(element.dataset.delay) || 0;
    
    setTimeout(() => {
      element.classList.add('is-visible');
      this.emit('animationTriggered', { element, type: animationType });
    }, delay);
  }
  
  // Advanced hover effects with performance optimization
  addHoverEffect(element, config = {}) {
    const defaultConfig = {
      scale: 1.02,
      translateY: -6,
      duration: 300,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };
    
    const finalConfig = { ...defaultConfig, ...config };
    
    element.addEventListener('mouseenter', () => {
      if (!this.app.getState().device.isTouch) {
        this.applyTransform(element, finalConfig);
      }
    });
    
    element.addEventListener('mouseleave', () => {
      this.resetTransform(element);
    });
  }
  
  applyTransform(element, config) {
    element.style.transform = `translateY(${config.translateY}px) scale(${config.scale})`;
    element.style.transition = `all ${config.duration}ms ${config.easing}`;
  }
  
  resetTransform(element) {
    element.style.transform = 'translateY(0) scale(1)';
  }
  
  startAnimationLoop() {
    const animate = () => {
      // Handle continuous animations here
      this.rafId = requestAnimationFrame(animate);
    };
    animate();
  }
  
  bindEvents() {
    this.app.on('deviceChange', (e) => {
      if (e.detail.isMobile) {
        this.disableHoverEffects();
      } else {
        this.enableHoverEffects();
      }
    });
  }
  
  disableHoverEffects() {
    document.body.classList.add('no-hover');
  }
  
  enableHoverEffects() {
    document.body.classList.remove('no-hover');
  }
  
  emit(event, data) {
    this.app.emit(`animation:${event}`, data);
  }
  
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.observers.forEach(observer => observer.disconnect());
  }
}