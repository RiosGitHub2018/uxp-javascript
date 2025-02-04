class MsButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    Object.defineProperty(this, 'textContent', {
      get() {
        const btnText = this.shadowRoot?.querySelector('#textoBtn');
        return btnText ? btnText.textContent : '';
      },
      set(value) { 
        this.setAttribute('texto', value); 
      }
    });
  }
 
  async connectedCallback() {
    await this.loadAndRenderSVG();
  }
 
  getAttributes() {
    const iconBaseSize = this.getAttribute('size') || '90-25-20-5-px';
    const [width, height, iconSize, radius, unit = 'px'] = iconBaseSize.split('-');
    
    return {
      icon: this.getAttribute('icon') || "",
      color: this.getAttribute('color') || "var(--psfx-texto-color)",
      hoverColor: this.getAttribute('hover-color') || 'var(--psfx-texto-btn-hover-color)',
      disabledColor: this.getAttribute('disabled') || 'var(--psfx-ui-slider-circular-disabled-color)',
      text: this.getAttribute('texto') || '',
      width: `${width}${unit}`,
      height: `${height}${unit}`,
      iconSize: `${iconSize}${unit}`,
      radius: `${radius}${unit}`,
      activeHeight: `${parseInt(height) - 1}${unit}`
    };
  }
 
  async loadAndRenderSVG() {
    try {
      const attrs = this.getAttributes();
      let svgCode = '';
      
      if (attrs.icon) {
        const response = await fetch(`/icons/${attrs.icon}.svg`);
        if (!response.ok) throw new Error(`Failed to load icon: ${attrs.icon}`);
        svgCode = await response.text();
      }
 
      this.render(attrs, svgCode);
      
      if (this.hasAttribute('disabled')) {
        this.disable();
      }
    } catch (error) {
      console.error('Error:', error);
      this.renderError();
    }
  }
 
  render(attrs, svgCode) {
    let content;
    if (attrs.icon && attrs.text) {
      content = `
        <span class="icon-container">${svgCode}</span>
        <div id="textoBtn" class="btn-text">${attrs.text}</div>
      `;
    } else if (attrs.icon) {
      content = `<div class="icon-container">${svgCode}</div>`;
    } else {
      content = `<div id="textoBtn" class="btn-text">${attrs.text}</div>`;
    }
 
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        
        .ps-btn-icon {
          background-image: var(--psfx-bg-botao-degrader-color);
          border: 1px solid var(--psfx-ui-borda-busca-color);
          box-shadow: var(--psfx-box-shadow);
          border-radius: ${attrs.radius};   
          width: ${attrs.width};
          height: ${attrs.height};
          display: flex;
          align-items: center;
          justify-content: ${attrs.icon && attrs.text ? 'flex-start' : 'center'};
          transition: all 0.2s ease;
        }
 
        .ps-btn-icon:hover {
          background: #d4d6d6;
        }
 
        .ps-btn-icon:active {
          height: ${attrs.activeHeight};
          background: #ece9e9;
          transform: translate(0px, 1px);
          border-top: 1px solid var(--psfx-ui-borda-busca-color);
        }
 
        .icon-container svg {
          fill: ${attrs.color} !important;
          width: ${attrs.iconSize};
          height: ${attrs.iconSize};
          margin: ${attrs.icon && attrs.text ? '5px' : '0'};
        }
 
        .ps-btn-icon:hover .icon-container svg {
          fill: ${attrs.hoverColor} !important;
        }
 
        .btn-text {
          font-family: 'Arial', sans-serif;
          font-size: 0.9em;
          color: var(--psfx-texto-color);
        }
 
        .ps-btn-icon:hover .btn-text {
          color: ${attrs.hoverColor} !important;
        }
 
        :host([disabled]) .ps-btn-icon {
          pointer-events: none;
          background-image: none !important;
          background-color: var(--psfx-bg-detalhes-claro-color);
          border: 1px solid var(--uxp-host-border-color);
        }
 
        :host([disabled]) .icon-container svg {
          fill: ${attrs.disabledColor} !important;
        }
 
        :host([disabled]) .btn-text {
          color: var(--psfx-ui-slider-circular-disabled-color) !important;
        }
      </style>
      <div class="ps-btn-icon">${content}</div>
    `;
  }
 
  renderError() {
    const attrs = this.getAttributes();
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        .error-btn {
          width: ${attrs.width};
          height: ${attrs.height};
          border: 1px solid #ccc;
          border-radius: ${attrs.radius};
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
        }
      </style>
      <div class="error-btn">!</div>
    `;
  }
 
  disable() {
    this.setAttribute('disabled', '');
  }
 
  enable() {
    this.removeAttribute('disabled');
  }
 
  static get observedAttributes() {
    return ['disabled', 'color', 'hover-color', 'size', 'texto', 'icon'];
  }
 
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.loadAndRenderSVG();
    }
  }
 }
 
 customElements.define('ms-buttom', MsButton);