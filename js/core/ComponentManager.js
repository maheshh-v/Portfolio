/**
 * Component System for Reusable UI Elements
 */
export class ComponentManager {
  constructor(app) {
    this.app = app;
    this.components = new Map();
    this.templates = new Map();
    
    this.init();
  }
  
  init() {
    this.loadTemplates();
    this.initializeComponents();
  }
  
  // Register reusable components
  register(name, componentClass) {
    this.components.set(name, componentClass);
  }
  
  // Create component instances
  create(name, element, config = {}) {
    const ComponentClass = this.components.get(name);
    if (!ComponentClass) {
      console.warn(`Component '${name}' not found`);
      return null;
    }
    
    return new ComponentClass(element, config, this.app);
  }
  
  // Auto-initialize components from DOM
  initializeComponents() {
    document.querySelectorAll('[data-component]').forEach(element => {
      const componentName = element.dataset.component;
      const config = this.parseConfig(element.dataset.config);
      
      this.create(componentName, element, config);
    });
  }
  
  parseConfig(configString) {
    try {
      return configString ? JSON.parse(configString) : {};
    } catch (e) {
      console.warn('Invalid component config:', configString);
      return {};
    }
  }
  
  loadTemplates() {
    // Card template
    this.templates.set('card', `
      <div class="card card--hoverable" data-animate="fade-in">
        <div class="card__content">
          <slot name="content"></slot>
        </div>
      </div>
    `);
    
    // Button template
    this.templates.set('button', `
      <button class="button button--primary" data-component="button">
        <slot name="icon"></slot>
        <span class="button__text">
          <slot name="text"></slot>
        </span>
      </button>
    `);
  }
  
  // Template rendering system
  render(templateName, data = {}) {
    const template = this.templates.get(templateName);
    if (!template) return '';
    
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || '';
    });
  }
}

// Base Component Class
export class BaseComponent {
  constructor(element, config, app) {
    this.element = element;
    this.config = config;
    this.app = app;
    this.state = {};
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.render();
  }
  
  bindEvents() {
    // Override in child classes
  }
  
  render() {
    // Override in child classes
  }
  
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
  
  emit(event, data) {
    this.element.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
  
  destroy() {
    // Cleanup logic
  }
}