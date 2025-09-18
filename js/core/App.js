/**
 * Main Application Controller
 * Handles app initialization and module coordination
 */
export class App {
  constructor() {
    this.modules = new Map();
    this.state = {
      theme: 'dark',
      isLoading: true,
      currentPage: 'home',
      animations: {
        enabled: true,
        reducedMotion: false
      }
    };
    
    this.init();
  }
  
  async init() {
    try {
      await this.detectCapabilities();
      await this.loadModules();
      this.bindGlobalEvents();
      this.setState({ isLoading: false });
    } catch (error) {
      console.error('App initialization failed:', error);
    }
  }
  
  async detectCapabilities() {
    // Detect device capabilities for performance optimization
    this.state.animations.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.state.device = {
      isMobile: window.innerWidth < 768,
      isTouch: 'ontouchstart' in window,
      hasHover: window.matchMedia('(hover: hover)').matches
    };
  }
  
  async loadModules() {
    const { Navigation } = await import('./Navigation.js');
    const { AnimationManager } = await import('./AnimationManager.js');
    const { ThemeManager } = await import('./ThemeManager.js');
    
    this.modules.set('navigation', new Navigation(this));
    this.modules.set('animations', new AnimationManager(this));
    this.modules.set('theme', new ThemeManager(this));
  }
  
  bindGlobalEvents() {
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));
    
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
  }
  
  handleResize() {
    const wasMobile = this.state.device.isMobile;
    this.state.device.isMobile = window.innerWidth < 768;
    
    if (wasMobile !== this.state.device.isMobile) {
      this.emit('deviceChange', this.state.device);
    }
  }
  
  handleVisibilityChange() {
    const isVisible = !document.hidden;
    this.emit('visibilityChange', { isVisible });
  }
  
  // State Management
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.emit('stateChange', this.state);
  }
  
  getState() {
    return { ...this.state };
  }
  
  // Event System
  emit(event, data) {
    document.dispatchEvent(new CustomEvent(`app:${event}`, { detail: data }));
  }
  
  on(event, callback) {
    document.addEventListener(`app:${event}`, callback);
  }
  
  // Utilities
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}