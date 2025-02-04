class Msicons extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
 
  async connectedCallback() {
    await this.loadAndRenderSVG();
  }
 
  async loadAndRenderSVG() {
    try {
      await Promise.resolve();
      const attributes = this.getAttributes();
      
      if (!attributes.icon) {
        this.renderError();
        return;
      }
 
      const response = await fetch(`/icons/${attributes.icon}.svg`);
      if (!response.ok) {
        throw new Error(`Failed to load icon: ${attributes.icon}`);
      }
      
      const svgCode = await response.text();
      this.renderComponent(attributes, svgCode);
 
      if (this.hasAttribute('disabled')) {
        this.disable();
      }
    } catch (error) {
      console.error('Error loading SVG:', error);
      this.renderError();
    }
  }
 
  getAttributes() {
    return {
      icon: this.getAttribute('icon'),
      color: this.getAttribute('color') || "var(--psfx-texto-color)",
      hoverColor: this.getAttribute('hover-color') || "",
      disabledColor: this.getAttribute('disabled') || 'var(--psfx-ui-slider-circular-disabled-color)',
      size: this.getAttribute('size') || '40px'
    };
  }
 
  renderComponent(attrs, svgCode) {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: ${attrs.size};
          height: ${attrs.size};
        }
        
        .ps-btn-icon {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
  
        .ps-btn-icon svg {
          width: 100% !important;
          height: 100% !important;
          fill: ${attrs.color} !important;
              }
  
        /* Correção do hover-color */
        .ps-btn-icon:hover svg {
          fill: ${attrs.hoverColor} !important;
        }
  
        :host([disabled]) .ps-btn-icon svg {
          fill: ${attrs.disabledColor} !important;
          pointer-events: none;
        }
      </style>
      <div class="ps-btn-icon">${svgCode}</div>
    `;
  }
 
  renderError() {
    const size = this.getAttribute('size') || '40px';
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: ${size};
          height: ${size};
        }
        .error-icon {
          width: 100%;
          height: 100%;
          fill: #999;
        }
      </style>
      <svg class="error-icon" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
    `;
  }
 
  disable() {
    const button = this.shadowRoot.querySelector('.ps-btn-icon');
    if (button) {
      this.setAttribute('disabled', '');
    }
  }
 
  enable() {
    const button = this.shadowRoot.querySelector('.ps-btn-icon');
    if (button) {
      this.removeAttribute('disabled');
    }
  }
 
  static get observedAttributes() {
    return ['disabled', 'color', 'hover-color', 'size', 'icon'];
  }
 
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.loadAndRenderSVG();
    }
  }
 }
 
 customElements.define('ms-icon', Msicons);