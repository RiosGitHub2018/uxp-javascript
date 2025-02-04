const fs = require('uxp').storage.localFileSystem;

class MsButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Getter for textContent
    Object.defineProperty(this, 'textContent', {
      get() {
        const btnText = this.shadowRoot?.querySelector('#textoBtn');
        return btnText ? btnText.textContent : '';
      },
      set(value) { this.setAttribute('texto', value);  }
    });
  }

  async connectedCallback() {  
    await this.loadAndRenderSVG(); 
  }

  async loadAndRenderSVG() {
    try {
      const iconName = this.getAttribute('icon') || "";
      const iconColor = this.getAttribute('color') || "var(--psfx-texto-color)";
      const hoverColor = this.getAttribute('hover-color') || 'var(--psfx-texto-btn-hover-color)';
      const disabledColor =  this.getAttribute('disabled') || 'var(--psfx-ui-slider-circular-disabled-color)';
      const iconBaseSize = this.getAttribute('size') || '90-25-20-5-px';
      const buttonText = this.getAttribute('texto') || '';

      const [width, height, iconSize, radius, unit = 'px'] = iconBaseSize.split('-');
      const activeHeight = parseInt(height) - 1;

      let svgText = '';
      if (iconName) {
        const response = await fetch(`/icons/${iconName}.svg`);
        svgText = await response.text();
      }

      let content;
      if (iconName && buttonText) {
        content = `
          <span class="icon-container">${svgText}</span>
          <div id="textoBtn" class="btn-text">${buttonText}</div>
        `;
      }
       else if (iconName) { content = `<div class="icon-container">${svgText}</div>`;}
       else { content = `<div id="textoBtn" class="btn-text">${buttonText}</div>`; }
              
      this.shadowRoot.innerHTML = `
      <style>
        .ps-btn-icon {
          background-image: var(--psfx-bg-botao-degrader-color);
          border: 1px solid var(--psfx-ui-borda-busca-color);
          box-shadow: var(--psfx-box-shadow);
          border-radius: ${radius}${unit};   
          width: ${width}${unit};
          height: ${height}${unit};
          display: flex;
          align-items: center;
          justify-content: ${iconName && buttonText ? 'flex-start' : 'center'};
        }

        .ps-btn-icon:hover { background: #d4d6d6; }

        .ps-btn-icon:active {
          height: ${activeHeight}${unit};
          background: #ece9e9;
          transform: translate(0px, 1px);
          border-top: 2px solid var(--psfx-ui-borda-busca-color);
        }

        .icon-container svg {
          fill: ${iconColor} !important;
          width: ${iconSize}${unit};
          height: ${iconSize}${unit};
          margin: ${iconName && buttonText ? '5px' : '0'};
        }

        .ps-btn-icon:hover .icon-container svg { 
          fill: ${hoverColor}  !important; 
        }

        .btn-text { 
          font-family: 'Arial', sans-serif; 
          font-size: 0.9em; 
          color: var(--psfx-texto-color:);
          margin: 0.5em 0;
        }

        .ps-btn-icon:hover .btn-text{ 
          color: var(--psfx-texto-color:) ${hoverColor}  !important; ; 
        }

        .desabilitar_bg {
            pointer-events: none;
            color: var(--psfx-ui-slider-circular-disabled-color) !important;
            background-image: none !important;
            background-color: var(--psfx-bg-detalhes-claro-color);
            border: 1px solid var(--uxp-host-border-color);
        }

        .desabilitar_icon svg  { 
          fill: ${disabledColor} !important; 
        }
      </style>
        
      <div class="ps-btn-icon">${content}</div>
      `;

      // Handle the disabled state of the button
      if (this.hasAttribute('disabled')) {   this.disable();  } else { this.enable();  }
    } catch (error) { 
      console.error('Erro ao carregar SVG:', error); 
    }
  }

  disable() {
    try {
      const button = this.shadowRoot.querySelector('.ps-btn-icon');
      const icon = this.shadowRoot.querySelector('.icon-container');
      const btnText = this.shadowRoot.querySelector('#textoBtn');
      if (button) { button.classList.add('desabilitar_bg'); }
      if (icon) {
        icon.classList.remove('desabilitar_icon');
        void icon.offsetWidth; // Força o reflow
        icon.classList.add('desabilitar_icon');
      }
      if (btnText) { btnText.disabled = true; }
      this.setAttribute('disabled', '');
    } catch (err) {}
  }
  
  enable() {
    try {
      const button = this.shadowRoot.querySelector('.ps-btn-icon');
      const icon = this.shadowRoot.querySelector('.icon-container');
      const btnText = this.shadowRoot.querySelector('#textoBtn');
      if (button) { button.classList.remove('desabilitar_bg'); }
      if (icon) {
        icon.classList.remove('desabilitar_icon');
        void icon.offsetWidth; // Força o reflow
      }
      if (btnText) { btnText.disabled = false; }
      this.removeAttribute('disabled');
    } catch (err) {}
  }

  static get observedAttributes() {
    return ['disabled', 'color', 'hover-color', 'size', 'texto'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) { 
      if (name === 'texto') {
        const btnText = this.shadowRoot.querySelector('#textoBtn');
        if (btnText) { btnText.textContent = newValue; }
      } else { this.loadAndRenderSVG();   }
    }
  }
}

customElements.define('ms-buttom', MsButton);