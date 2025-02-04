/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/@ms-wc/ms-box-number.js":
/*!*************************************!*\
  !*** ./src/@ms-wc/ms-box-number.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
class NumberField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const size = this.getAttribute('size');
    let largura = '100px';
    if (size) {
      const isNumber = !isNaN(parseFloat(size)) && isFinite(size);
      if (isNumber) { largura = `${size}px`;} 
      else if (typeof size === 'string') {
        const validUnits = ['px', 'em', 'rem', '%'];
        const hasValidUnit = validUnits.some(unit => size.endsWith(unit));
        largura = hasValidUnit ? size : `${size}px`;
      }
    }

    const initialValue = this.getAttribute('value') || '0';
    this._hasDecimals = this._checkIfHasDecimals(initialValue);
    const value = this._parseValue(initialValue);
    
    const disabled = this.hasAttribute('disabled');
    const valueSuffix = this.getAttribute('value-suffix') || '';

    this.shadowRoot.innerHTML = `
    <style>
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      box-sizing: border-box;
      position: relative;
      width: var(--number-field-width, ${largura});
    }
    .container {
      display: inline-flex;
      align-items: center;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      min-height: 25px;
      height: 21px;
      gap: 4px;
    }
    
    .txtLabel {
      color: var(--uxp-host-text-color);
      font-family: 'Arial', sans-serif; 
      font-size: 11px;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      white-space: nowrap;
      margin-right: 3px;
    }

    .sizeNumber {
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        border: 1px solid var(--psfx-borda-elemento-color);
        background-color: var(--psfx-bg-detalhes-color); 
        height: 24px;
        width: 100%;
        border-radius: 3px;
    }
    
    .input-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
      flex: 1;
      min-width: 0;
    }
    .value-label {
      width: 100%;
      display: flex;
      height: 24px;
      padding: 4px;
      cursor: text;
      align-items: center;
      color: var(--uxp-host-text-color);
      font-size: 12px;
    }
    .value-suffix {
      color: var(--uxp-host-text-color);
      font-size: 12px;
      margin-left: 2px;
    }
    input {
      width: 100%;
      height: 23px;
      padding: 4px;
      padding-left: 1px;
      margin: 0px;
      background-color: var(--psfx-bg-detalhes-color); 
      display: none;
      box-sizing: border-box;
      color: var(--uxp-host-text-color);
      border: none;
      outline: none;
    }

    .arrows-container {
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      width: 15px;
      height: 100%;
      margin: 2px;
    }
    .arrow-button {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 9px;
      box-sizing: border-box;
      background-color: var(--uxp-host-background-color);
      user-select: none;
    }

    .arrow-button:first-child {
      border-bottom: none;
    }
    .arrow-button:hover {
      background-color: var(--uxp-host-widget-hover-background-color)
    }
    .setas {fill: var(--psfx-texto-color); }

    .sizeNumber.disabled {
      background-color: var(--psfx-bg-detalhes-claro-color);
    }
    
    :host([disabled]) .arrow-button,
    :host([disabled]) .value-label {
      color: #a0a0a0;  cursor: default; background: none;
    }
    :host([disabled]) .setas { fill: var(--psfx-texto-disbled-color) !important;  }
    :host([disabled]) .txtLabel {
      color: #a0a0a0;
    }
    </style>
    <div class="container">
      <div class="txtLabel"></div>
      <div class="sizeNumber">
        <div class="input-wrapper">
          <div class="value-label">
            <span class="value-content"></span>
            <span class="value-suffix"></span>
          </div>
          <input type="number" value="${value}" min="0">
        </div>
        <div class="arrows-container">
          <div class="arrow-button" role="button" aria-label="Incrementar" style="padding-top: 2px;">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="12" style="transform: rotate(180deg)">
              <path class="setas" d="M4,7.01a1,1,0,0,1,1.7055-.7055l3.289,3.286,3.289-3.286a1,1,0,0,1,1.437,1.3865l-.0245.0245L9.7,11.7075a1,1,0,0,1-1.414,0L4.7055,7.7155A1,1,0,0,1,4,7.01Z"></path>
            </svg>
          </div>
          <div class="arrow-button" role="button" aria-label="Decrementar">
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="12">
              <path class="setas" d="M4,7.01a1,1,0,0,1,1.7055-.7055l3.289,3.286,3.289-3.286a1,1,0,0,1,1.437,1.3865l-.0245.0245L9.7,11.7075a1,1,0,0,1-1.414,0L4.7055,7.7155A1,1,0,0,1,4,7.01Z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>`;

    this._width = largura;
    this._step = this._hasDecimals ? 0.1 : 1;
    
    this.input = this.shadowRoot.querySelector('input');
    this.valueLabel = this.shadowRoot.querySelector('.value-label');
    this.valueContent = this.shadowRoot.querySelector('.value-content');
    this.valueSuffix = this.shadowRoot.querySelector('.value-suffix');
    this.incrementButton = this.shadowRoot.querySelector('.arrow-button:first-child');
    this.decrementButton = this.shadowRoot.querySelector('.arrow-button:last-child');
    
    this.input.step = this._step;
    
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          if (mutation.attributeName === 'size') {
            this.updateSize(this.getAttribute('size'));
          } else if (mutation.attributeName === 'value-suffix') {
            this.updateValueSuffix();
          }
        }
      });
    });

    this.observer.observe(this, { attributes: true });
    
    this.setupEventListeners();
    this.updateLabel();
    this.updateValueLabel();
    this.updateValueSuffix();
  }

  _checkIfHasDecimals(value) {
    const strValue = String(value).replace(',', '.');
    return strValue.includes('.') || parseFloat(strValue) % 1 !== 0;
  }

  _parseValue(value) {
    if (typeof value === 'string') {
      return parseFloat(value.replace(',', '.')) || 0;
    }
    return parseFloat(value) || 0;
  }

  _formatValue(value) {
    const numValue = this._parseValue(value);
    if (this._hasDecimals) {
      return numValue.toFixed(1);
    }
    return Math.round(numValue).toString();
  }

  setupEventListeners() {
    this.input.addEventListener('input', () => {
      const newValue = this.input.value;
      this._hasDecimals = this._checkIfHasDecimals(newValue);
      this._step = this._hasDecimals ? 0.1 : 1;
      this.input.step = this._step;
      
      this.updateValueLabel();
      this.dispatchEvent(new Event('change'));
    });

    this.input.addEventListener('blur', () => {
      const newValue = this.input.value;
      this._hasDecimals = this._checkIfHasDecimals(newValue);
      this._step = this._hasDecimals ? 0.1 : 1;
      this.input.step = this._step;
      
      this.input.value = this._formatValue(newValue);
      this.updateValueLabel();
      this.hideInput();
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const newValue = this.input.value;
        this._hasDecimals = this._checkIfHasDecimals(newValue);
        this._step = this._hasDecimals ? 0.1 : 1;
        this.input.step = this._step;
        
        this.input.value = this._formatValue(newValue);
        this.updateValueLabel();
        this.hideInput();
      }
    });

    this.valueLabel.addEventListener('click', (event) => {
      if (!this.isDisabled()) { 
        this.showInput(); 
      }
    });

    this.incrementButton.addEventListener('click', () => {
      if (!this.isDisabled()) {
        const currentValue = this._parseValue(this.input.value);
        const newValue = currentValue + this._step;
        this.input.value = this._formatValue(newValue);
        this.updateValueLabel();
        this.dispatchEvent(new Event('change'));
      }
    });

    this.decrementButton.addEventListener('click', () => {
      if (!this.isDisabled()) {
        const currentValue = this._parseValue(this.input.value);
        const newValue = Math.max(0, currentValue - this._step);
        this.input.value = this._formatValue(newValue);
        this.updateValueLabel();
        this.dispatchEvent(new Event('change'));
      }
    });
  }

  updateValueSuffix() {
    const suffix = this.getAttribute('value-suffix') || '';
    this.valueSuffix.textContent = suffix ? ` ${suffix}` : '';
  }

  updateSize(size) {
    let newWidth = '100px';
    
    if (size) {
      const isNumber = !isNaN(parseFloat(size)) && isFinite(size);
      if (isNumber) {
        newWidth = `${size}px`;
      } else if (typeof size === 'string') {
        const validUnits = ['px', 'em', 'rem', '%'];
        const hasValidUnit = validUnits.some(unit => size.endsWith(unit));
        newWidth = hasValidUnit ? size : `${size}px`;
      }
    }
    
    this.style.setProperty('--number-field-width', newWidth);
    this._width = newWidth;
    
    const container = this.shadowRoot.querySelector('.container');
    if (container) {
      container.style.width = newWidth;
    }
  }

  showInput() {
    this.input.style.display = 'block';
    this.valueLabel.style.display = 'none';
    this.input.focus();
  }

  hideInput() {
    this.input.style.display = 'none';
    this.valueLabel.style.display = 'flex';
  }

  updateValueLabel() {
    this.valueContent.textContent = this._formatValue(this.input.value);
  }

  updateLabel() {
    const labelElement = this.shadowRoot.querySelector('.txtLabel');
    const label = this.getAttribute('data-label') || this.getAttribute('txtlabel') || this.textContent.trim() || '';
    labelElement.textContent = label;
  }

  static get observedAttributes() {
    return ['disabled', 'data-label', 'txtlabel', 'value', 'size', 'value-suffix'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-label' || name === 'txtlabel') {
      this.updateLabel();
    } else if (name === 'value') {
      this.value = newValue;
    } else if (name === 'size') {
      this.updateSize(newValue);
    } else if (name === 'value-suffix') {
      this.updateValueSuffix();
    }
  }

  connectedCallback() {
    this.updateLabel();
    this.updateValueLabel();
    this.hideInput();
    const size = this.getAttribute('size');
    if (size) { 
      this.updateSize(size);
    }
  }
  
  disconnectedCallback() {
    this.observer.disconnect();
  }

  isDisabled() {
    return this.hasAttribute('disabled');
  }

  get value() {
    return this._parseValue(this.input.value);
  }

  set value(newValue) {
    this._hasDecimals = this._checkIfHasDecimals(newValue);
    this._step = this._hasDecimals ? 0.1 : 1;
    this.input.step = this._step;
    
    this.input.value = this._formatValue(newValue);
    this.updateValueLabel();
    this.dispatchEvent(new Event('change'));
  }

  get size() {
    return this._width;
  }

  setSize(size) {
    this.setAttribute('size', size);
    this.updateSize(size);
  }

  disable() { 
    this.setAttribute('disabled', ''); 
  }
  
  enable() {
    this.removeAttribute('disabled'); 
  }
}

customElements.define('ms-box-number', NumberField);

/***/ }),

/***/ "./src/@ms-wc/ms-busca.js":
/*!********************************!*\
  !*** ./src/@ms-wc/ms-busca.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
class MSBusca extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._disabled = false; // Armazena o estado de 'disabled'
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.updateDisabledState(); // Atualiza o estado inicial
  }

  static get observedAttributes() {
    return ['disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      this._disabled = newValue !== null;
      this.updateDisabledState();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        .search-container {
          width: 150px;
          height: 23px;
          background-image: var(--psfx-bg-botao-degrader-color);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
          border: 1px solid var(--psfx-ui-borda-busca-color);
          box-shadow: var(--psfx-box-shadow)
        }
        .search-icon {
          width: 18px;
          height: 18px;
          fill: var(--psfx-texto-color-2);
          position: absolute;
          left: 7px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
        }

        .search-input {
          font-family: sans-serif;
          outline: none;
          width: calc(100% - 29px);
          height: 21px;
          box-sizing: border-box;
          transform: translate(20px, -8px);
          padding: 3px;
        }

        .search-label {
          width: calc(100% - 30px);
          height: 21px;
          font-family: Arial, sans-serif;
          display: flex;
          align-items: center;
          cursor: text;
          color: #ababab; /* Cor inicial */
          font-size: 1.15em;
          transform: translate(30px, 0px);
          background-color: var(--psfx-bg-detalhes-color);
         padding-left: 5px;
        }

        input[type="text"] {
          font-family: Arial, sans-serif;
          font-size: 1.15em;
        }

        :host([disabled]) .search-icon,
        :host([disabled]) .search-input,
        :host([disabled]) .search-label {
          pointer-events: none;
          fill: var(--psfx-texto-disbled-color);
          cursor: default;
        }

        :host([disabled]) .search-container{
          background-image: none;
          background-color: var(--psfx-bg-detalhes-claro-color);
        }

      </style>
      <div class="search-container">
        <form class="search-form">
          <svg class="search-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" class="search-input" style="display: none;">
          <label for="searchInput" class="search-label">Buscar</label>
        </form>
      </div>
    `;
    this.updateLabelStyle(); // Atualiza a cor inicial do label
  }

  setupEventListeners() {
    const searchForm = this.shadowRoot.querySelector('.search-form');
    const searchInput = this.shadowRoot.querySelector('.search-input');
    const searchLabel = this.shadowRoot.querySelector('.search-label');

    const showInput = () => {
      if (this._disabled) return;
      searchLabel.style.display = 'none';
      searchInput.style.display = 'block';
      searchInput.focus();
    };

    const showLabel = () => {
      if (this._disabled) return;
      searchInput.style.display = 'none';
      searchLabel.style.display = 'flex';
      this.updateLabelStyle();
    };

    const updateLabel = () => {
      searchLabel.textContent = searchInput.value.trim() || 'Buscar';
      this.updateLabelStyle();
    };

    // Captura o valor enquanto o usuário digita
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.trim();

      // Dispara um evento personalizado
      this.dispatchEvent(new CustomEvent('change', { 
        detail: { searchTerm },
        bubbles: true,
        composed: true
      }));
    });

    // Captura o valor ao enviar o formulário (Enter)
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this._disabled) return;

      const searchTerm = searchInput.value.trim();
      // Dispara um evento personalizado
      this.dispatchEvent(new CustomEvent('ms-busca-submit', { 
        detail: { searchTerm },
        bubbles: true,
        composed: true
      }));

      showLabel();
      updateLabel();
    });

    searchLabel.addEventListener('click', showInput);

    searchInput.addEventListener('blur', () => {
      showLabel();
      updateLabel();
    });
  }

  updateDisabledState() {
    const searchInput = this.shadowRoot.querySelector('.search-input');
    if (this._disabled) {
      searchInput.setAttribute('disabled', '');
    } else {
      searchInput.removeAttribute('disabled');
    }
    this.updateLabelStyle();
  }

  updateLabelStyle() {
    const searchLabel = this.shadowRoot.querySelector('.search-label');
    const searchInput = this.shadowRoot.querySelector('.search-input');
    if (this._disabled) {
      searchLabel.style.color = 'var(--psfx-texto-disbled-color)';
    } else {
      searchLabel.style.color = searchInput.value.trim() === '' ? '#ababab' : 'var(--psfx-texto-color-2)';
    }
  }

  disable() { this.setAttribute('disabled', ''); }
  enable() { this.removeAttribute('disabled');}
}

customElements.define('ms-busca', MSBusca);


/***/ }),

/***/ "./src/@ms-wc/ms-buttom.js":
/*!*********************************!*\
  !*** ./src/@ms-wc/ms-buttom.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
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

/***/ }),

/***/ "./src/@ms-wc/ms-checkbox.js":
/*!***********************************!*\
  !*** ./src/@ms-wc/ms-checkbox.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
class PsCheckbox extends HTMLElement {
    constructor() {
        super();
        // Attach a shadow DOM
        this.attachShadow({ mode: 'open' });
        // Create the checkbox and label elements
        this.checkbox = document.createElement('input');
        this.checkbox.type = 'checkbox';
        this.checkbox.id = 'ms-checkbox';
   
        this.label = document.createElement('label');
        this.label.setAttribute('for', 'ms-checkbox');
        
        // Modificação: Prioriza data-label
        this.updateLabel();
   
        // Style element
        const style = document.createElement('style');
        style.textContent = `
            /* Container do checkbox e label */
            :host {
                display: inline-flex;
                align-items: center;
            }
   
            /* Estilo do checkbox */
            input[type="checkbox"] {
                appearance: none;
                width: 13px;
                height: 13px;
            }
   
            /* Estilo do label */
            label {
               font-family: 'Arial', sans-serif; 
               font-size: 11px;
               color: var(--uxp-host-text-color); 
                margin-left: 1px;
            }
   
            /* Checkbox desabilitado */
            input[type="checkbox"]:disabled {
                cursor: not-allowed;
            }
   
            /* Label para checkbox desabilitado */
            input[type="checkbox"]:disabled + label {
                color: #8f8c8c;
                cursor: not-allowed;
            }
        `;
        // Append elements to shadow DOM
        this.shadowRoot.append(style, this.checkbox, this.label);
        
        // Adicionar evento de clique ao label para alternar o estado do checkbox
        this.label.addEventListener('click', () => {
            if (!this.checkbox.disabled) {
                this.checkbox.checked = !this.checkbox.checked;
                this.dispatchEvent(new CustomEvent('change', {
                    detail: { 
                        checked: this.checked,
                        // Adiciona o label ao evento
                        label: this.getLabelText()
                    }
                }));
            }
        });
    }
    
    // Método para atualizar o label
    updateLabel() {
        // Prioriza data-label, depois textContent
        const labelText = this.getAttribute('data-label') || this.innerText || "Opção";
        this.label.textContent = labelText;
    }
    
    // Método para obter o texto do label
    getLabelText() {
        return this.getAttribute('data-label') || this.innerText || "Opção";
    }
   
    // Define observed attributes para incluir data-label
    static get observedAttributes() {
        return ['checked', 'disabled', 'data-label'];
    }
   
    // Callback for observed attributes changes
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'checked') {
            this.checkbox.checked = newValue !== null;
        } else if (name === 'disabled') {
            this.checkbox.disabled = newValue !== null;
        } else if (name === 'data-label') {
            // Atualiza o label quando data-label muda
            this.updateLabel();
        }
    }
   
    // Getter and setter for "checked" property
    get checked() {
        return this.checkbox.checked;
    }
    set checked(value) {
        this.checkbox.checked = Boolean(value);
        this.setAttribute('checked', value ? '' : null);
    }
   
    // Getter and setter for "disabled" property
    get disabled() {
        return this.checkbox.disabled;
    }
    set disabled(value) {
        this.checkbox.disabled = Boolean(value);
        this.setAttribute('disabled', value ? '' : null);
    }
   
    // Listen to checkbox changes
    connectedCallback() {
        this.checkbox.addEventListener('change', () => {
            this.dispatchEvent(new CustomEvent('change', {
                detail: { 
                    checked: this.checked,
                    // Adiciona o label ao evento
                    label: this.getLabelText()
                }
            }));
        });
    }
   
    // Clean up event listeners when the component is removed
    disconnectedCallback() {
        this.checkbox.removeEventListener('change', () => {});
    }
   }
   
   // Define the custom element
   customElements.define('ms-checkbox', PsCheckbox);

////// DOCUMENTAÇÃO DO COMPONENTE
////// MANIPUÇÃO E ESCUTAS DO COMPONENTE
/*
    HTM:
    <ms-checkbox id="ck1">Opção1</ms-checkbox>
    <ms-checkbox id="ck1" checked>Opção1</ms-checkbox>
    <ms-checkbox id="ck1" disabled>Opção1</ms-checkbox>

    main.js
    const checkbox = document.querySelector('#ck1');
    checkbox.checked = true;  // ou false
    Manipular o estado "disabled"
    checkbox.disabled = true; // ou false

    // Escutar mudanças
    checkbox2.addEventListener('change', (evt) => {
    if(evt.detail.checked){ funçaA() } else{ funçaB() }
    });
*/


/***/ }),

/***/ "./src/@ms-wc/ms-color-seletor.js":
/*!****************************************!*\
  !*** ./src/@ms-wc/ms-color-seletor.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
class MSColorSeletor extends HTMLElement {
  static get observedAttributes() {
    return ['size', 'initial-color', 'position', 'trigger-for', 'disabled'];
  }

  constructor() {
    super();
    this.baseSvSize = 150;
    this.baseHueWidth = 20;
    this.hue = 0;
    this.saturation = 100;
    this.value = 100;
    this.isOpen = false;
    this.triggerElement = null;
    
    this.innerHTML = `
      <style>
        :host {
          position: relative;
          display: inline-block;
        }
        .color-picker {
          display: none;
          flex-direction: column;
          gap: 5px;
          position: fixed;
          background: var(--psfx-ui-bg-color);
          padding: 10px;
          border: 1px solid var(--psfx-ui-borda-forte-color);
          border-radius: 4px;
          box-shadow: -1px -2px 29px 8px rgba(0,0,0,0.22);
          z-index: 1000;
          width: fit-content;
          align-items: center;
          text-align: center;
        }
        .canvas-container {
          display: flex;
          gap: 5px;
        }
        canvas {
          cursor: crosshair;
          display: block;
        }
        #sv-canvas {
          box-shadow: var(--psfx-box-shadow);
        }
        #hue-canvas {
          box-shadow: var(--psfx-box-shadow);
          margin-left: 7px;
        }
        span {
          display: flex;
          align-items: center;
          margin: 5px;
        }
        #color-hex {
          font-family: Arial, sans-serif;
          font-size: 11px;
          color: var(--psfx-texto-color);
          line-height: 20px;
          width: 70px;
          margin-left: 5px;
        }
        [disabled="true"] {
          color: var(--psfx-texto-disbled-color) !important;
          pointer-events: none !important;
        }
      </style>
      <div class="color-picker">
        <div class="canvas-container">
          <canvas id="sv-canvas"></canvas>
          <canvas id="hue-canvas"></canvas>
        </div>
        <span style="height: 30px; transform: translateX(-5px);">
          <label style="font-size: 10px; margin-left: 5px;" >Color:</label>
          <label id="color-hex" style="width: 40px; margin-left: 3px; font-size: 10px;">#FFFFFF</label>
        </span>
        <ms-buttom id="btn-Sair" texto="Fechar" size="-18-15-2-px" style="width: 100%; height: 20px;"></ms-buttom>
      </div>
    `;
  }

  hexToHsv(hex) {
    hex = hex.replace(/^#/, '');
    
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    
    let h, s, v;
    v = max / 255;
    if (d === 0) { h = 0; s = 0; } else { s = d / max;
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    
    return {
      h: Math.round(h),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  }

  updateDimensions() {
    const size = this.getAttribute('size') || '100';
    const sizePercent = parseInt(size) / 100;
    
    const svCanvas = this.querySelector("#sv-canvas");
    const hueCanvas = this.querySelector("#hue-canvas");
    
    const newSvSize = Math.round(this.baseSvSize * sizePercent);
    const newHueWidth = Math.round(this.baseHueWidth * sizePercent);
    
    svCanvas.width = newSvSize;
    svCanvas.height = newSvSize;
    svCanvas.style.width = `${newSvSize}px`;
    svCanvas.style.height = `${newSvSize}px`;
    
    hueCanvas.width = newHueWidth;
    hueCanvas.height = newSvSize;
    hueCanvas.style.width = `${newHueWidth}px`;
    hueCanvas.style.height = `${newSvSize}px`;
  }

  openColorPicker(triggerElement) {
    const colorPicker = this.querySelector(".color-picker");
    this.isOpen = true;
    colorPicker.style.display = "flex";
    colorPicker.style.visibility = "hidden";
    
    setTimeout(() => {
      this.positionColorPicker(triggerElement);
      this.drawHue();
      this.drawSV(this.hue);
      colorPicker.style.visibility = "visible";
    }, 90);
  }

  closeColorPicker() {
      const colorPicker = this.querySelector(".color-picker");
      colorPicker.style.display = "none";
      this.isOpen = false;
      ///// SAIR DA FERRAMENTA CONTA GOTAS
      require("photoshop").core.executeAsModal( async() => {
        await require("photoshop").app.batchPlay( [ { _obj: "select", _target: [ { _ref: "moveTool" } ], _options: { dialogOptions: "dontDisplay" } } ]);
      });
      //////////
  }

  positionColorPicker(triggerElement) {
    const colorPicker = this.querySelector(".color-picker");
    const triggerRect = triggerElement.getBoundingClientRect();
    const colorPickerRect = colorPicker.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    colorPicker.style.top = '';
    colorPicker.style.bottom = '';
    colorPicker.style.left = '';
    colorPicker.style.right = '';
    colorPicker.style.transform = '';

    let top, left;
    const position = this.getAttribute('position') || 'default';

    switch (position) {
      case 'top':
        top = triggerRect.top - colorPickerRect.height - 10;
        left = triggerRect.left + (triggerRect.width / 2) - (colorPickerRect.width / 2);
        break;
      case 'bottom':
        top = triggerRect.bottom + 10;
        left = triggerRect.left + (triggerRect.width / 2) - (colorPickerRect.width / 2);
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height / 2) - (colorPickerRect.height / 2);
        left = triggerRect.left - colorPickerRect.width - 10;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height / 2) - (colorPickerRect.height / 2);
        left = triggerRect.right + 10;
        break;
      case 'center':
        top = triggerRect.top + (triggerRect.height / 2) - (colorPickerRect.height / 2);
        left = triggerRect.left + (triggerRect.width / 2) - (colorPickerRect.width / 2);
        break;
      default:
        top = triggerRect.bottom + 10;
        left = triggerRect.left;
    }

    if (top < 0) top = 10;
    if (top + colorPickerRect.height > viewportHeight) {
      top = viewportHeight - colorPickerRect.height - 10;
    }
    if (left < 0) left = 10;
    if (left + colorPickerRect.width > viewportWidth) {
      left = viewportWidth - colorPickerRect.width - 10;
    }

    colorPicker.style.position = 'fixed';
    colorPicker.style.top = `${top}px`;
    colorPicker.style.left = `${left}px`;
  }

  connectedCallback() {
    this.init();
    
    const initialColor = this.getAttribute('initial-color') || '#FFFFFF';
    if (initialColor) {
      const hsv = this.hexToHsv(initialColor);
      this.hue = hsv.h;
      this.saturation = hsv.s;
      this.value = hsv.v;
      
      const colorHexLabel = this.querySelector("#color-hex");
      colorHexLabel.textContent = initialColor;
      colorHexLabel.style.color = initialColor;
    }

    const triggerId = this.getAttribute('trigger-for');
    if (triggerId) {
      this.setupTrigger(triggerId);
    }
  }

  init() {
    const svCanvas = this.querySelector("#sv-canvas");
    const hueCanvas = this.querySelector("#hue-canvas");
    const colorPicker = this.querySelector(".color-picker");
    const colorHexLabel = this.querySelector("#color-hex");

    this.updateDimensions();

    const svCtx = svCanvas.getContext("2d");
    const hueCtx = hueCanvas.getContext("2d");

    colorPicker.style.display = "none";

    document.addEventListener("click", (event) => {
      if (!this.contains(event.target)) {
        this.closeColorPicker();
      }
    });

    const btnSair = this.querySelector("#btn-Sair");
    btnSair.addEventListener("click", () => {
      this.closeColorPicker();
    });

    window.addEventListener('resize', () => {
      if (this.isOpen) {
        const triggerElement = document.getElementById(this.getAttribute('trigger-for'));
        if (triggerElement) {
          this.positionColorPicker(triggerElement);
        }
      }
    });

    this.drawHue = () => {
      const gradient = hueCtx.createLinearGradient(0, 0, 0, hueCanvas.height);
      for (let i = 0; i <= 360; i++) {
        gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
      }
      hueCtx.fillStyle = gradient;
      hueCtx.fillRect(0, 0, hueCanvas.width, hueCanvas.height);
    };

    this.drawSV = (hue) => {
      svCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      svCtx.fillRect(0, 0, svCanvas.width, svCanvas.height);

      const whiteGradient = svCtx.createLinearGradient(0, 0, svCanvas.width, 0);
      whiteGradient.addColorStop(0, "rgba(255,255,255,1)");
      whiteGradient.addColorStop(1, "rgba(255,255,255,0)");
      svCtx.fillStyle = whiteGradient;
      svCtx.fillRect(0, 0, svCanvas.width, svCanvas.height);

      const blackGradient = svCtx.createLinearGradient(0, 0, 0, svCanvas.height);
      blackGradient.addColorStop(0, "rgba(0,0,0,0)");
      blackGradient.addColorStop(1, "rgba(0,0,0,1)");
      svCtx.fillStyle = blackGradient;
      svCtx.fillRect(0, 0, svCanvas.width, svCanvas.height);
    };

    this.updateColor = () => {
      const rgb = this.hsvToRgb(this.hue, this.saturation, this.value);
      const hex = this.rgbToHex(rgb[0], rgb[1], rgb[2]);
      colorHexLabel.textContent = hex;
      colorHexLabel.style.color = hex;
    
      const event = new CustomEvent('colorchange', {
        detail: {
          hex: hex,
          rgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          rgbValues: {
            r: rgb[0],
            g: rgb[1],
            b: rgb[2]
          }
        },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
    };

    hueCanvas.addEventListener("mousedown", (e) => {
      const pickHue = (e) => {
        const rect = hueCanvas.getBoundingClientRect();
        const y = e.clientY - rect.top;
        this.hue = Math.round((y / rect.height) * 360);
        this.hue = Math.max(0, Math.min(360, this.hue));
        this.drawSV(this.hue);
        this.updateColor();
      };

      pickHue(e);

      const onMouseMove = (e) => pickHue(e);
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    svCanvas.addEventListener("mousedown", (e) => {
      const pickSV = (e) => {
        const rect = svCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.saturation = Math.round((x / rect.width) * 100);
        this.value = Math.round((1 - y / rect.height) * 100);
        this.saturation = Math.max(0, Math.min(100, this.saturation));
        this.value = Math.max(0, Math.min(100, this.value));
        this.updateColor();
      };

      pickSV(e);

      const onMouseMove = (e) => pickSV(e);
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  hsvToRgb(h, s, v) {
    s /= 100;
    v /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => v * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [
      Math.round(255 * f(5)),
      Math.round(255 * f(3)),
      Math.round(255 * f(1)),
    ];
  }

  rgbToHex(r, g, b) {
    return ("#" + [r, g, b].map((x) => { 
        const hex = x.toString(16); 
        return hex.length === 1 ? "0" + hex : hex;
    }).join("").toUpperCase());
  }

  disable() {
    this.setAttribute('disabled', 'true');
    if (this.triggerElement) {
      this.triggerElement.setAttribute('disabled', 'true');
    }
    this.closeColorPicker();
  }

  enable() {
    this.removeAttribute('disabled');
    if (this.triggerElement) {
      this.triggerElement.removeAttribute('disabled');
    }
  }

  setupTrigger(triggerId) {
    this.triggerElement = document.getElementById(triggerId);
    if (this.triggerElement) {
      // Aplicar estado inicial de disabled se necessário
      if (this.hasAttribute('disabled')) {
        this.triggerElement.setAttribute('disabled', 'true');
      }

      this.triggerElement.addEventListener('click', (event) => {
        event.stopPropagation();
        
        if (this.hasAttribute('disabled')) {
          return;
        }
        
        if (this.isOpen) {
          this.closeColorPicker();
          return;
        }
        
        this.openColorPicker(this.triggerElement);
      });
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      if (newValue !== null) {
        if (this.triggerElement) {
          this.triggerElement.setAttribute('disabled', 'true');
        }
        this.closeColorPicker();
      } else {
        if (this.triggerElement) {
          this.triggerElement.removeAttribute('disabled');
        }
      }
    }
    if (name === 'size' && oldValue !== newValue) {
      this.updateDimensions();
      const colorPicker = this.querySelector(".color-picker");
      if (colorPicker.style.display === "flex") {
        this.drawHue();
        this.drawSV(this.hue);
      }
    }
    if (name === 'initial-color' && oldValue !== newValue) {
      const hsv = this.hexToHsv(newValue);
      this.hue = hsv.h;
      this.saturation = hsv.s;
      this.value = hsv.v;
      
      const colorHexLabel = this.querySelector("#color-hex");
      colorHexLabel.textContent = newValue;
      colorHexLabel.style.color = newValue;
      
      const colorPicker = this.querySelector(".color-picker");
      if (colorPicker.style.display === "flex") {
        this.drawHue();
        this.drawSV(this.hue);
      }
    }
    if (name === 'trigger-for' && newValue) {
      this.setupTrigger(newValue);
      
    }
  }
}

customElements.define("ms-color-seletor", MSColorSeletor);

/***/ }),

/***/ "./src/@ms-wc/ms-dropdowlist.js":
/*!**************************************!*\
  !*** ./src/@ms-wc/ms-dropdowlist.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
class PSDropdownlist extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Criar o Shadow DOM
        this.options = [];
        this._selectedIndex = -1;
        this._originalObjects = [];
        this._submenus = [];
    }
  
    get selectedObject() {
        return this._originalObjects[this._selectedIndex];
    }
  
    connectedCallback() {
        try {
            const itemElements = this.querySelectorAll('ms-item, ms-divider');
            if (itemElements.length > 0) {
                // Limpar arrays antes de popular
                this.options = [];
                this._originalObjects = [];
                this._submenus = [];
    
                itemElements.forEach((item) => {
                    if (item.tagName === 'MS-ITEM') {
                        const text = item.textContent.trim();
                        const icon = item.getAttribute('icon'); // Captura o ícone inline
                        const color = item.getAttribute('color'); // Captura a cor, se existir
                        this.options.push(text);
                
                        // Capturar o objeto original ou criar um com base nos atributos
                        this._originalObjects.push({
                            icon: icon || null,
                            color: color || null,
                            text: text,
                        });
                
                        const subitensAttr = item.getAttribute('subitem');
                        if (subitensAttr) {
                            try {
                                const subitens = JSON.parse(subitensAttr.replace(/'/g, '"'));
                                this._submenus.push(subitens);
                            } catch (error) {
                                console.error('Erro ao processar subitens', error);
                                this._submenus.push(null);
                            }
                        } else {
                            this._submenus.push(null);
                        }
                    }
                });
                
            }
    
            this.render();
            this.attachEventListeners();
    
            const initialIndex = parseInt(this.getAttribute('data-selected-index'), 10);
            if (!isNaN(initialIndex) && initialIndex >= 0 && initialIndex < this.options.length) {
                this.selectedIndex = initialIndex;
            } else {
                // Encontrar o primeiro índice não-nulo
                const firstValidIndex = this.options.findIndex(option => option !== null);
                this.selectedIndex = firstValidIndex !== -1 ? firstValidIndex : 0;
            }
    
            if (this.hasAttribute('disabled')) {
                this.disable();
            }
        } catch (error) {
            console.log(error);
        }
    }
  
    render() {
        this.shadowRoot.innerHTML = `
        <style>
        :host {
            display: inline-block;
            position: relative;
            font-family: Arial, sans-serif;
            width: 300px;
            height: 20px;
            color: var(--psfx-texto-color);
        }

        .ms-dropdownlist-container {
            display: flex;
            align-items: center;
            user-select: none;
            height: 24px;
            border: 1px solid var(--psfx-borda-elemento-color);
            padding-left: 1px;
            background-color: var(--psfx-bg-detalhes-color); 
            cursor: pointer;
        }

        .ms-dropdownlist-container:hover {
            border: 1px solid var(--psfx-borda-elemento-color-2);
        }

        .ms-dropdownlist-text {
            width: 100%;
            height: 20px;
            flex-grow: 1;
            border: 0px;
            font-size: 12px;
            padding: 1px;
            margin: 0px;
            padding-left: 9px;
            font-family: Arial, sans-serif;
            background: transparent;
            display: flex;
            align-items: center;
        }

        .ms-dropdownlist-arrow {
            cursor: pointer;
            padding: 0 2px;
            background-color: var(--psfx-bg-detalhes-claro-color);
            margin-right: 2px;
            fill: var(--psfx-texto-color);
        }

        .ms-dropdownlist-indicador {
            cursor: pointer;
            fill: var(--psfx-texto-options-list-color);
        }

        .ms-dropdownlist-options {
            display: none;
            position: relative;
            top:-4px;
            left: 0;
            right: 0;
            background-color: var( --psfx-bg-options-list-color);
            border: 1px solid var(--psfx-ui-borda-forte-color);
            box-shadow: var(--psfx-box-shadow);
            max-height: 144px;
            overflow-y: auto;
            z-index: 1000;
            margin-top: 5px;
            box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
        }

        .ms-dropdownlist-options.show {
            display: block;
        }

        .ms-dropdownlist-option {
            padding: 3px;
            padding-left: 10px;
            cursor: pointer;
            color: var(--psfx-texto-options-list-color);
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
        }

        .ms-dropdownlist-option:hover {
            background-color: #bcddfc;
        }

        .ms-dropdownlist-option.selected {
            background-color: #d4d3d3;
            color: var(--psfx-texto-options-list-color);
        }

        .ms-dropdownlist-option-svg {
            display: none;
            color: var(--psfx-texto-color)
        }

        .ms-dropdownlist-option.selected .ms-dropdownlist-option-svg {
            display: block;
            margin-right: 5px;
        }

        .ms-dropdownlist-submenu {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(255, 255, 255, 0.9);
            border: 2px solid var(--psfx-borda-elemento-color);
            border-left: 0px;
            z-index: 9999;
            min-width: 150px; 
        }
        
        .ms-dropdownlist-submenu.show {
            display: block;
        }
        
        .ms-dropdownlist-submenu-option {
            padding: 3px;
            padding-left: 10px;
            cursor: pointer;
            color: black;
            font-size: 12px;
            border-bottom: 1px solid #ccc;
        }
        
        .ms-dropdownlist-submenu-option:hover {
            background-color: #60adf5; 
            color: white;
        }

        .ms-dropdownlist-divider {
            height: 1px;
            background-color: var(--psfx-borda-elemento-color-2);
            margin: 2px 0;
            pointer-events: none;
        }
        </style>
        
        <div class="ms-dropdownlist-container">
            <div class="ms-dropdownlist-text">${this.options[this._selectedIndex] || ''}</div>
            <span class="ms-dropdownlist-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="12">
                    <path d="M4,7.01a1,1,0,0,1,1.7055-.7055l3.289,3.286,3.289-3.286a1,1,0,0,1,1.437,1.3865l-.0245.0245L9.7,11.7075a1,1,0,0,1-1.414,0L4.7055,7.7155A1,1,0,0,1,4,7.01Z"></path>
                </svg>
            </span>
        </div>
        <div class="ms-dropdownlist-options">
            ${Array.from(this.children).map((child) => {
                if (child.tagName === 'MS-DIVIDER') {
                    return `<div class="ms-dropdownlist-divider"></div>`;
                }
                
                if (child.tagName === 'MS-ITEM') {
                    const text = child.textContent.trim();
                    const icon = child.getAttribute('icon'); // Verifica se o ícone foi definido inline
                    const color = child.getAttribute('color') || '#000'; // Define uma cor padrão, se não for fornecida
                    const subitensAttr = child.getAttribute('subitem');
                    const subitens = subitensAttr ? JSON.parse(subitensAttr.replace(/'/g, '"')) : null;
                
                    return `
                        <div class="ms-dropdownlist-option${this._selectedIndex === this.options.indexOf(text) ? ' selected' : ''}" data-index="${this.options.indexOf(text)}">
                             <div style="display: flex; align-items: flex-start;">
                                ${icon ? `
                                    <ms-icon icon="${icon}" size="13px" color="${color}" style="margin-left: -5px; margin-right: 5px;"></ms-icon>
                                    ` : ''}
                                    <span>${text}</span>
                            </div>

                            ${subitens ? `
                                <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="13">
                                    <rect opacity="0" width="18" height="18" />
                                    <path class="ms-dropdownlist-indicador" d="M12,9a.994.994,0,0,1-.2925.7045l-3.9915,3.99a1,1,0,1,1-1.4355-1.386l.0245-.0245L9.5905,9,6.3045,5.715A1,1,0,0,1,7.691,4.28l.0245.0245,3.9915,3.99A.994.994,0,0,1,12,9Z" />
                                </svg>
                            ` : ''}
                            <svg xmlns="http://www.w3.org/2000/svg" class="ms-dropdownlist-option-svg" height="12" width="12" viewBox="0 0 16 16" fill="none">
                                <path class="fill" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0=0,15.656,3.8625Z"  fill="var(--psfx-texto-options-list-color)"/>
                            </svg>
                            ${subitens ? `
                                <div class="ms-dropdownlist-submenu">
                                    ${subitens.map((subitem, subindex) => `
                                        <div class="ms-dropdownlist-submenu-option" data-subindex="${subindex}">• ${subitem}</div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `;
                }
                
                return '';
            }).join('')}
        </div>
    `;
     
        // Resto do método render anterior (código de eventos de submenu)
        this.shadowRoot.querySelectorAll('.ms-dropdownlist-submenu-option').forEach(submenuOption => {
            submenuOption.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Subitem clicado:', submenuOption.textContent);
                
                const parentOption = submenuOption.closest('.ms-dropdownlist-option');
                const parentIndex = parseInt(parentOption.getAttribute('data-index'));
                const subitemIndex = parseInt(submenuOption.getAttribute('data-subindex'));
        
                const textDiv = this.shadowRoot.querySelector('.ms-dropdownlist-text');
                textDiv.textContent = submenuOption.textContent.replace(/•/g, '');
        
                this.dispatchEvent(new CustomEvent('optionSelected', {
                    detail: {
                        selectedIndex: parentIndex,
                        value: this.options[parentIndex],
                        subitem: submenuOption.textContent.replace(/•/g, ''),
                        subitemIndex: subitemIndex,
                        originalObject: this._originalObjects[parentIndex]
                    }
                }));
        
                const optionsContainer = this.shadowRoot.querySelector('.ms-dropdownlist-options');
                optionsContainer.style.display = 'none';
                this.shadowRoot.querySelectorAll('.ms-dropdownlist-submenu').forEach(sm => sm.classList.remove('show'));
            });
        });
        
        // Resto do código de eventos de opções com submenu
        this.shadowRoot.querySelectorAll('.ms-dropdownlist-option').forEach((optionEl, index) => {
            if (this._submenus[index]) {
                optionEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const submenu = optionEl.querySelector('.ms-dropdownlist-submenu');
                    
                    console.log('Submenu encontrado:', submenu);
        
                    if (!submenu) {
                        console.warn('Nenhum submenu encontrado para este item:', optionEl);
                        return;
                    }
        
                    const isVisible = submenu.classList.contains('show');
                    this.shadowRoot.querySelectorAll('.ms-dropdownlist-submenu').forEach(sm => sm.classList.remove('show'));
                    if (!isVisible) submenu.classList.add('show');
                });
            }
        });
    }
  
    attachEventListeners() {
        const container = this.shadowRoot.querySelector('.ms-dropdownlist-container');
        const textDiv = this.shadowRoot.querySelector('.ms-dropdownlist-text');
        const arrow = this.shadowRoot.querySelector('.ms-dropdownlist-arrow');
        const optionsContainer = this.shadowRoot.querySelector('.ms-dropdownlist-options');
 
        const toggleOptions = () => {
            if (this.hasAttribute('disabled')) return;
            optionsContainer.style.display = 
                optionsContainer.style.display === 'block' ? 'none' : 'block';
        };
 
        arrow.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleOptions();
        });
 
        textDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleOptions();
        });
 
        optionsContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            const submenuOptionElement = e.target.closest('.ms-dropdownlist-submenu-option');
            const optionElement = e.target.closest('.ms-dropdownlist-option');
      
            if (submenuOptionElement) {
                const parentOption = submenuOptionElement.closest('.ms-dropdownlist-option');
                const parentIndex = parseInt(parentOption.getAttribute('data-index'));
                const subitemIndex = Array.from(parentOption.querySelectorAll('.ms-dropdownlist-submenu-option')).indexOf(submenuOptionElement);
                const selectedSubitem = submenuOptionElement.textContent.trim();
                textDiv.textContent = selectedSubitem;
 
                this.dispatchEvent(new CustomEvent('optionSelected', {
                    detail: {
                        selectedIndex: parentIndex,
                        value: this.options[parentIndex],
                        subitem: selectedSubitem,
                        subitemIndex: subitemIndex,
                        originalObject: this._originalObjects[parentIndex]
                    }
                }));
 
                optionsContainer.style.display = 'none';
            } 
            else if (optionElement) {
                const options = this.shadowRoot.querySelectorAll('.ms-dropdownlist-option');
                options.forEach(opt => opt.classList.remove('selected'));
                optionElement.classList.add('selected');
 
                const index = parseInt(optionElement.getAttribute('data-index'));
                this.selectedIndex = index;
 
                this.dispatchEvent(new CustomEvent('optionSelected', {
                    detail: {
                        selectedIndex: index,
                        value: this.value,
                        originalObject: this._originalObjects[index]
                    }
                }));
 
                optionsContainer.style.display = 'none';
            }
        });
 
        document.addEventListener('click', (e) => {
            if (!this.contains(e.target) && !this.shadowRoot.contains(e.target)) {
                optionsContainer.style.display = 'none';
            }
        });
    }
 
    addOption(item, originalObject = null) {
        this._originalObjects.push(originalObject || item);
        this.options.push(item);
        
        const optionsContainer = this.shadowRoot.querySelector('.ms-dropdownlist-options');
        const newOptionIndex = this.options.length - 1;
        const newOptionElement = document.createElement('div');
        newOptionElement.className = 'ms-dropdownlist-option';
        newOptionElement.setAttribute('data-index', newOptionIndex);
    
        // Verificar se o objeto tem as propriedades 'icon' e 'color'
        if (originalObject && originalObject.icon && originalObject.color) {
            newOptionElement.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <ms-icon   id="btnIcone${newOptionIndex}"  icon="${originalObject.icon}"  size="13px"  color="${originalObject.color}"  style="margin-left: -5px; margin-right: 5px;"> </ms-icon>
                    ${item}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="ms-dropdownlist-option-svg" height="12" width="12" viewBox="0 0 16 16" fill="none">
                    <path class="fill" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0=0,15.656,3.8625Z"  fill="var(--psfx-texto-options-list-color)"/>
                </svg>
            `;
        } else {
            newOptionElement.innerHTML = `
                ${item}
                <svg xmlns="http://www.w3.org/2000/svg" class="ms-dropdownlist-option-svg" height="12" width="12" viewBox="0 0 16 16" fill="none">
                    <path class="fill" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0=0,15.656,3.8625Z"  fill="var(--psfx-texto-options-list-color)"/>
                </svg>
            `;
        }
    
        optionsContainer.appendChild(newOptionElement);
    }

    // Novo método para adicionar divisores em uma posição específica
    addDividerAt(index) {
        try {
            const optionsContainer = this.shadowRoot.querySelector('.ms-dropdownlist-options');
            const allElements = Array.from(optionsContainer.children);
    
            const newDivider = document.createElement('div');
            newDivider.className = 'ms-dropdownlist-divider';
    
            if (index >= 0 && index < allElements.length) {
                optionsContainer.insertBefore(newDivider, allElements[index]);
            } else {
                optionsContainer.appendChild(newDivider);
            }
        } catch (error) {}
        
    }


  
    updateSelected() {
        const textDiv = this.shadowRoot.querySelector('.ms-dropdownlist-text');
        const options = this.shadowRoot.querySelectorAll('.ms-dropdownlist-option');
    
        options.forEach((option) => {
            option.classList.remove('selected');
        });
    
        if (this._selectedIndex !== -1) {
            const selectedOption = options[this._selectedIndex];
            selectedOption.classList.add('selected');
    
            const selectedValue = this.options[this._selectedIndex];
            textDiv.textContent = selectedValue;
        } else {
           textDiv.textContent = '';
        }
    }
  
    get selectedIndex() {
        return this._selectedIndex;
    }
    
    set selectedIndex(value) {
        if (value >= 0 && value < this.options.length) {
            this._selectedIndex = value;
            this.updateSelected();
        } else {
            console.warn('selectedIndex fora do intervalo.');
        }
    }
  
    get value() {
        return this._selectedIndex !== -1 ? this.options[this._selectedIndex] : '';
    }
  
    disable() {
        this.setAttribute('disabled', 'true');
        const textDiv = this.shadowRoot.querySelector('.ms-dropdownlist-text');
        const setasvg = this.shadowRoot.querySelector('#seta');
        const bgseta = this.shadowRoot.querySelector('#bgSeta');
        const arrow = this.shadowRoot.querySelector('.ms-dropdownlist-arrow');
        const container = this.shadowRoot.querySelector('.ms-dropdownlist-container');
    
        if (textDiv) {
            textDiv.style.color = '#7b7b7b';
            textDiv.style.backgroundColor = "var(--psfx-bg-detalhes-color)";
            textDiv.style.cursor = 'default';
        }
    
        if (setasvg) setasvg.classList.add('desabilitar');
        if (bgseta) bgseta.classList.add('desabilitar');
        if (arrow) {
            arrow.style.pointerEvents = 'none';
            arrow.classList.add('desabilitar');
        }
        if (container) container.classList.add('desabilitar');
    }
    
    enable() {
        this.removeAttribute('disabled');
        const textDiv = this.shadowRoot.querySelector('.ms-dropdownlist-text');
        const setasvg = this.shadowRoot.querySelector('#seta');
        const bgseta = this.shadowRoot.querySelector('#bgSeta');
        const arrow = this.shadowRoot.querySelector('.ms-dropdownlist-arrow');
        const container = this.shadowRoot.querySelector('.ms-dropdownlist-container');
    
        if (textDiv) {
            textDiv.style.color = '';
            textDiv.style.backgroundColor= '';
            textDiv.style.cursor = 'pointer';
        }
    
        if (setasvg) setasvg.classList.remove('desabilitar');
        if (bgseta) bgseta.classList.remove('desabilitar');
        if (arrow) {
            arrow.style.pointerEvents = 'auto';
            arrow.classList.remove('desabilitar');
        }
        if (container) container.classList.remove('desabilitar');
    }
}
  
customElements.define('ms-dropdownlist', PSDropdownlist);



/***/ }),

/***/ "./src/@ms-wc/ms-icon.js":
/*!*******************************!*\
  !*** ./src/@ms-wc/ms-icon.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
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

/***/ }),

/***/ "./src/@ms-wc/ms-painel.js":
/*!*********************************!*\
  !*** ./src/@ms-wc/ms-painel.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
class MsPainel extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        // Container principal do componente
        const fieldsetDiv = document.createElement('div');
        fieldsetDiv.classList.add('fieldset-container');
        // Criar a legenda do fieldset
        this.legendLabel = document.createElement('span');
        this.legendLabel.textContent = this.getAttribute('legend') || '';
        this.legendLabel.classList.add('legend-label');
        // Div de conteúdo com slot
        const conteudoDiv = document.createElement('div');
        conteudoDiv.classList.add('conteudo-container');
        const slot = document.createElement('slot');
        conteudoDiv.appendChild(slot);

        fieldsetDiv.style.backgroundColor = this.getAttribute('bcground') || 'background-color: var(--uxp-host-background-color)';

        fieldsetDiv.appendChild(this.legendLabel);
        fieldsetDiv.appendChild(conteudoDiv);

        const style = document.createElement('style');
        style.textContent = `
          :host {
            display: block;
            width: 100%;
            height: 100%;
            min-height: 50px;
            box-sizing: border-box;
        }
        .fieldset-container {
            position: relative;
            border: 1px solid var(--uxp-host-border-color, #424242); /* Usando variável do tema */
            padding: 10px;
            margin: 10px 0;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            border-radius: 5px;
            width: 100%;
            height: 100%;
            min-height: inherit;
        }
        .legend-label {
            position: relative;
            color: var(--uxp-host-text-color);
            font-size: 12px;
            position: absolute;
            top: -8px;
            left: 10px;
            padding: 0 5px;
            z-index: 1;
        }
        .legend-label::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 50%;
            background-color: var(--uxp-host-background-color);

        }
        .conteudo-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            box-sizing: border-box;
            gap: 10px;
        }
            ::slotted(*) {
                width: 100%;
                margin: 0 !important;
            }
             :host([disabled]) ::slotted(select),
            :host([disabled]) ::slotted(textarea) {
                background-color: var(--uxp-host-background-color) !important;
                color: #a0a0a0 !important;
                border-color: var(--uxp-host-border-color, #424242) !important;
                opacity: 0.7;
            }
            :host([disabled]) ::slotted(label),
            :host([disabled]) ::slotted(sp-label) {
                color: #a0a0a0 !important;
                opacity: 0.7;
            }
            :host([disabled]) ::slotted(*) {
                pointer-events: none;
            }
            :host([disabled]) ::slotted(number-field) {
                opacity: 0.7;
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(fieldsetDiv);
        

        this.slotChangeObserver = new MutationObserver(() => {
            if (this.hasAttribute('disabled')) {
                this.toggleDisabledState(true);
            }
        });
    }

    connectedCallback() {
        const slot = this.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', () => this.handleSlotChange());
    }

    disconnectedCallback() {
        this.slotChangeObserver.disconnect();
    }

    handleSlotChange() {
        const slot = this.shadowRoot.querySelector('slot');
        const elements = slot.assignedElements();
        
        elements.forEach(element => {
            this.slotChangeObserver.observe(element, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['disabled']
            });
        });

        if (this.hasAttribute('disabled')) {
            this.toggleDisabledState(true);
        }
    }

    static get observedAttributes() {
        return ['disabled', 'legend'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'disabled') {
            this.toggleDisabledState(newValue !== null);
        }

        if (name === 'legend') {
            this.legendLabel.textContent = newValue;
        }
    }

    toggleDisabledState(isDisabled) {
        const fieldsetDiv = this.shadowRoot.querySelector('.fieldset-container');
        const slot = this.shadowRoot.querySelector('slot');
        const assignedElements = slot.assignedElements();

        fieldsetDiv.style.opacity = isDisabled ? '0.5' : '1';
        this.legendLabel.style.color = isDisabled ? '#a0a0a0' : 'var(--uxp-host-text-color);';

        const disableElementRecursively = async (element) => {
            await this.setChildDisabledState(element, isDisabled);

            const shadowRoot = element.shadowRoot;
            if (shadowRoot) {
                shadowRoot.querySelectorAll('*').forEach(el => {
                    disableElementRecursively(el);
                });
            }

            element.querySelectorAll('*').forEach(el => {
                disableElementRecursively(el);
            });

            const slots = element.querySelectorAll('slot');
            slots.forEach(slot => {
                slot.assignedElements().forEach(el => {
                    disableElementRecursively(el);
                });
            });
        };

        assignedElements.forEach(element => {
            disableElementRecursively(element);
        });
    }

    async setChildDisabledState(element, isDisabled) {
        const tagName = element.tagName.toLowerCase();

        // Trata elementos personalizados primeiro
        if (element.tagName.includes('-')) {
            // Tenta diferentes abordagens para desabilitar
            if (typeof element.disable === 'function' && typeof element.enable === 'function') {
                isDisabled ? element.disable() : element.enable();
            } else if ('disabled' in element) {
                element.disabled = isDisabled;
            }
            
            // Sempre define o atributo
            if (isDisabled) {
                element.setAttribute('disabled', '');
            } else {
                element.removeAttribute('disabled');
            }
            // Ajusta opacidade para componentes personalizados
            element.style.pointerEvents = isDisabled ? 'none' : '';
            // Aguarda um tick para garantir que o componente processou a mudança
            await new Promise(resolve => setTimeout(resolve, 0));
            return;
        }
        // Trata elementos nativos
        switch (tagName) {
            case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': 
            if (isDisabled) { element.style.color = '#a0a0a0';}
            else{element.style.color = '#fff';}
                 break;
            case 'select':  
              case 'textarea':
                element.disabled = isDisabled;
                if (isDisabled) {
                    element.style.backgroundColor = 'var(--uxp-host-background-color)';
                    element.style.color = '#a0a0a0';
                    element.style.borderColor = '#424242';
                    element.fill = '#a0a0a0';
                } else {
                    element.style.backgroundColor = '';
                    element.style.color ="var(--uxp-host-text-color)"
                    element.style.borderColor = '';
                }
                break;
               
            case 'button': 
            case 'span':    
            case 'label':
            case 'sp-label':
                if (isDisabled) {
                    element.style.color = '#a0a0a0';
                } else {
                    element.style.color = '';
                    element.style.opacity = '';
                }
                break;

            case 'div':
            case 'template':
                if (isDisabled) {
                    element.style.pointerEvents = 'none';
                } else { }
                break;
        }

        element.style.pointerEvents = isDisabled ? 'none' : '';
    }

    disable() { this.setAttribute('disabled', ''); }
    enable() { this.removeAttribute('disabled'); }
    setLegend(newLegend) {  this.setAttribute('legend', newLegend); }
}

customElements.define('ms-painel', MsPainel);

///// DOCUMENTAÇÃO DO COMPONENTE
////// MANIPUÇÃO E ESCUTAS DO COMPONENTE
/*
    HTM:
    <ms-painel class="small" legend="Conigs painel" id="pn1" bcground="#5b5a5a">
    <div>algum conteudo aqui</div>
    </ms-painel>
    • inciar desabilitado: <ms-painel class="small" legend="Conteudo" id="pn1" disabled></ms-painel >

    main.js
    Manipular o estado "disabled" programaticamente
    const fieldset = document.querySelector('#pn1');
    setTimeout(() => { fieldset.disable();}, 30); fieldset.enable(); // Habilita o componente
*/







/***/ }),

/***/ "./src/@ms-wc/ms-popover.js":
/*!**********************************!*\
  !*** ./src/@ms-wc/ms-popover.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
class MSPopover extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        const style = document.createElement('style');
        style.textContent = `
                :host {
                    display: none;
                    position: fixed;
                    background: var(--psfx-bg-detalhes-color);
                    border: 4px solid var(--psfx-texto-disbled-color);
                    padding: 5px;
                    border-radius: 4px;
                    box-shadow: -2px 4px 29px 3px rgba(0,0,0,0.6);
                    z-index: 1000;
                    box-sizing: border-box;
                }
                
                :host([open]) {
                    display: block;
                }

                :host([disabled]) {
                    pointer-events: none;
                    opacity: 0.6;
                }

                .arrow {
                    position: absolute;
                    fill: var(--psfx-texto-disbled-color);
                }

                .arrow-top {
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .arrow-bottom {
                    bottom: 100%;
                    left: 50%;
                    transform: translate(-50%, 7px);
                }

                .arrow-left {
                    left: 100%;
                    top: 50%;
                    transform: translateY(-50%);
                }

                .arrow-right {
                    right: 100%;
                    top: 50%;
                    transform: translate(7px, -50%);
                }
        `;
        
        this.container = document.createElement('div');
        this.container.setAttribute('class', 'popover-content');
        
        const slot = document.createElement('slot');
        this.container.appendChild(slot);
        
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.container);

        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleSlotClick = this.handleSlotClick.bind(this);

        slot.addEventListener('click', this.handleSlotClick);
    }

    createArrow(position) {
        const arrowSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        arrowSVG.setAttribute("width", "20");
        arrowSVG.setAttribute("height", "20");
        arrowSVG.classList.add('arrow', `arrow-${position}`);
    
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        const borderColor = getComputedStyle(this).getPropertyValue('--psfx-texto-disbled-color');
    
        switch(position) {
            case 'top':
                polygon.setAttribute("points", "20,0 0,0 10,11");
                break;
            case 'bottom':
                polygon.setAttribute("points", "0,11 20,11 10,0");
                break;
            case 'right':
                polygon.setAttribute("points", "11,20 11,0 0,10");
                break;
            case 'left':
                polygon.setAttribute("points", "0,0 0,20 11,10");
                break;
        }
        polygon.setAttribute("fill", borderColor);
        arrowSVG.appendChild(polygon);
        return arrowSVG;
    }

    updateArrow() {
        const showArrow = this.getAttribute('seta') === 'true';
        const position = this.getAttribute('position') || 'center';
        
        const existingArrow = this.shadowRoot.querySelector('.arrow');
        if (existingArrow) {
            existingArrow.remove();
        }

        if (showArrow && position !== 'center') {
            const arrow = this.createArrow(position);
            this.container.appendChild(arrow);
        }
    }

    connectedCallback() {
        const size = this.getAttribute('size');
        if (size) {
            this.style.width = size;
        }

        const triggerId = this.getAttribute('trigger-for');
        if (triggerId) {
            requestAnimationFrame(() => {
                this.setupTrigger(triggerId);
            });
        }

        this.updateArrow();
    }

    static get observedAttributes() {
        return ['seta', 'position', 'disabled', 'size'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (['seta', 'position'].includes(name)) {
            this.updateArrow();
        }
        if (name === 'disabled') {
            this.updateDisabledState();
        }
        if (name === 'size') {
            this.style.width = newValue;
        }
    }

    updateDisabledState() {
        const triggerId = this.getAttribute('trigger-for');
        const trigger = document.getElementById(triggerId);
        
        if (trigger) {
            if (this.hasAttribute('disabled')) {
                trigger.setAttribute('disabled', '');
                trigger.style.pointerEvents = 'none';
                this.hide();
            } else {
                trigger.removeAttribute('disabled');
                trigger.style.pointerEvents = '';
            }
        }
    }

    disable() { this.setAttribute('disabled', ''); }
    enable() { this.removeAttribute('disabled'); }

    handleClickOutside(e) {
        const trigger = document.getElementById(this.getAttribute('trigger-for'));
        if (!this.contains(e.target) && e.target !== trigger) {
            this.hide();
        }
    }

    setupTrigger(triggerId) {
        const trigger = document.getElementById(triggerId);
        if (!trigger) {
            console.error(`Trigger element with id "${triggerId}" not found`);
            return;
        }

        trigger.removeEventListener('click', this.boundClickHandler);
        this.boundClickHandler = (e) => {
            if (!this.hasAttribute('disabled')) {
                e.stopPropagation();
                this.toggle(trigger);
            }
        };
        trigger.addEventListener('click', this.boundClickHandler);

        document.removeEventListener('click', this.handleClickOutside);
        document.addEventListener('click', this.handleClickOutside);
        
        this.updateDisabledState();
    }

    handleSlotClick(e) {
        const closeTrigger = e.target.closest('[data-popover-close]');
        if (closeTrigger) {
            this.hide();
            e.stopPropagation();
        }
    }

    toggle(triggerElement) {
        if (this.hasAttribute('open')) {
            this.hide();
        } else {
            this.show(triggerElement);
        }
    }
    
    position(triggerElement) {
        const position = this.getAttribute('position') || 'center';
        const triggerRect = triggerElement.getBoundingClientRect();
        const popoverRect = this.getBoundingClientRect();
        
        let top, left;
    
        switch(position) {
            case 'top':
                top = triggerRect.top - popoverRect.height - 10;
                left = triggerRect.left + (triggerRect.width/2) - (popoverRect.width/2);
                break;
            case 'bottom':
                top = triggerRect.bottom + 10;
                left = triggerRect.left + (triggerRect.width/2) - (popoverRect.width/2);
                break;
            case 'left':
                top = triggerRect.top + (triggerRect.height/2) - (popoverRect.height/2);
                left = triggerRect.left - popoverRect.width - 10;
                break;
            case 'right':
                top = triggerRect.top + (triggerRect.height/2) - (popoverRect.height/2);
                left = triggerRect.right + 10;
                break;
            case 'center':
                top = triggerRect.top + (triggerRect.height/2) - (popoverRect.height/2);
                left = triggerRect.left + (triggerRect.width/2) - (popoverRect.width/2);
                break;
        }
    
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
    
        if (left < 0) {
            left = 10;
        } else if (left + popoverRect.width > windowWidth) {
            left = windowWidth - popoverRect.width - 10;
        }
    
        if (top < 0) {
            top = 10;
        } else if (top + popoverRect.height > windowHeight) {
            top = windowHeight - popoverRect.height - 10;
        }
    
        this.style.top = `${top}px`;
        this.style.left = `${left}px`;
    }

    show(triggerElement) {
        this.style.top = '-9999px';
        this.style.left = '-9999px';
        
        this.setAttribute('open', '');
        
        Promise.resolve().then(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.position(triggerElement);
                });
            });
        });
    }
    
    hide() { this.removeAttribute('open');}

    disconnectedCallback() {
        document.removeEventListener('click', this.handleClickOutside);
        const trigger = document.getElementById(this.getAttribute('trigger-for'));
        if (trigger && this.boundClickHandler) {
            trigger.removeEventListener('click', this.boundClickHandler);
        }
    }
}

customElements.define('ms-popover', MSPopover);

/***/ }),

/***/ "./src/@ms-wc/ms-radio-group.js":
/*!**************************************!*\
  !*** ./src/@ms-wc/ms-radio-group.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
class MsRadioGroup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: row; /* Por padrão, os botões serão alinhados horizontalmente */
          gap: 8px; /* Espaçamento entre os botões */
        }

        :host([column]) {
          flex-direction: column; /* Alinhamento vertical quando o atributo 'column' está presente */
        }
      </style>
      <slot ></slot>
    `;
  }

  connectedCallback() {
    this.updateRadios();
    this.addEventListener("click", this.onRadioClick.bind(this));
  }

  updateRadios() {
    const radios = Array.from(this.querySelectorAll("ms-radio"));
    radios.forEach((radio, index) => {
      radio.setAttribute("index", index);
      if (radio.hasAttribute("checked")) {
        this.selectRadio(radio);
      }
    });
  }

  onRadioClick(event) {
    const radio = event.target.closest("ms-radio");
    if (radio && !radio.hasAttribute("disabled")) {
      this.selectRadio(radio);
    }
  }

  selectRadio(selectedRadio) {
    const radios = Array.from(this.querySelectorAll("ms-radio"));
    radios.forEach((radio) => {
      if (radio === selectedRadio) {
        radio.setAttribute("checked", "");
        this.dispatchChangeEvent(radio);
      } else {
        radio.removeAttribute("checked");
      }
    });
  }

  dispatchChangeEvent(radio) {
    const detail = {
      // Modificação: Prioriza data-label, depois textContent
      value: radio.getAttribute('data-label') || radio.textContent.trim(),
      index: parseInt(radio.getAttribute("index")),
      data: radio.getAttribute("data") || null,
    };
    this.dispatchEvent(new CustomEvent("change", { detail }));
  }

  checked(index) {
    const radios = this.querySelectorAll("ms-radio");
    if (radios[index]) {
      this.selectRadio(radios[index]);
    }
  }

  enable(index) {
    const radio = this.querySelector(`ms-radio:nth-child(${index + 1})`);
    if (radio) {
      radio.removeAttribute("disabled");
    }
  }

  disable(index) {
    const radio = this.querySelector(`ms-radio:nth-child(${index + 1})`);
    if (radio) {
      radio.setAttribute("disabled", "");
    }
  }
}

class MsRadio extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 11px;
        }

        :host([disabled]) {
          color: #a0a0a0;
          pointer-events: none;
        }

        .circle {
          width: 13px;
          height: 13px;
          margin: 3px;
          border: 2px solid var(--psfx-ui-borda-radio-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--psfx-ui-bg-radio-color);
        }

        .circle:hover {
          border: 2px solid var(--psfx-ui-borda-radio-hover-color);
        }

        :host([disabled]) .circle {
          border: 2px solid var(--psfx-texto-disbled-color);
          background-color: var(-psfx-bg-detalhes-claro-color);
        }

        .circle.checked {
          border: 4px solid var(--psfx-ui-borda-radio-cchecked-color);
        }

        :host(:hover) .circle.checked {
          border: 4px solid var(--psfx-texto-color-2);
        }

        :host([disabled]) .circle.checked {
          background-color: var(--psfx-ui-bg-radio-color);
          border: 4px solid var(--psfx-texto-disbled-color);
        }
      
        :host(:hover) .circle {
          border: 2px solid var(--psfx-ui-borda-radio-hover-color);
        }
      </style>
      <div class="circle"></div>
      <div class="rdtexto"></div>
    `;
  }

  connectedCallback() {
    this.updateLabel();
    if (this.hasAttribute("checked")) {
      this.shadowRoot.querySelector(".circle").classList.add("checked");
    }
  }

  updateLabel() {
    const labelElement = this.shadowRoot.querySelector('.rdtexto');
    // Prioriza data-label, depois textContent
    const label = this.getAttribute('data-label') || this.textContent.trim() || '';
    labelElement.textContent = label;
  }

  static get observedAttributes() {
    return ["checked", "disabled", "data-label"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const circle = this.shadowRoot.querySelector(".circle");
    if (name === "checked") {
      circle.classList.toggle("checked", newValue !== null);
    }
    
    // Atualiza o label quando data-label muda
    if (name === "data-label") {
      this.updateLabel();
    }
  }
}

customElements.define("ms-radio-group", MsRadioGroup);
customElements.define("ms-radio", MsRadio);

  /*
        ///// DOCUMENTAÇÃO DO COMPONENTE

          index.htm
          • EXTRUTURA HTML PADRÃO.
            <ms-radio-group id="gpradios">
                <ms-radio data="data 1" checked>Option 1</ms-radio>
                <ms-radio data="data 2" disabled>Option 2</ms-radio>
                <ms-radio data="data 3">Option 3</ms-radio>
                <ms-radio data="data 4">Option 4</ms-radio>
            </ms-radio-group> 
          ///////::::::::::::::::::::::::::::::::::::::::::::::::::

         • EXTRUTURA HTML PARA LIDAR COM MAIS DE UM GRUPO  DE BOTÕES.
            <ms-radio-group>
            <ms-radio class="radio-item" data="opcao1">Opção 1</ms-radio>
            <ms-radio class="radio-item" data="opcao2">Opção 2</ms-radio>
            </ms-radio-group>

            <ms-radio-group>
            <ms-radio class="radio-item" data="opcao3">Opção 3</ms-radio>
            <ms-radio class="radio-item" data="opcao4">Opção 4</ms-radio>
            </ms-radio-group>
           ///////::::::::::::::::::::::::::::::::::::::::::::::::::

            EXTRUTURA HTML PADRÃO PARA JANELAS MODAIS
           <ms-radio-group column>
              <ms-radio data-label="Radio 1" >Radio 1</ms-radio>
              <ms-radio data-label="Radio 2" >Radio 2</ms-radio>
            </ms-radio-group>
            OBS: data-label="texto do botão" : texto do botão
          ///////::::::::::::::::::::::::::::::::::::::::::::::::::

           main.js
           ///////////////////////////////////////////////////////////////////////////////////////
          • METODOS E EVENTOS PADRÃO:
           const radioGroup = document.querySelector("#gpradios");
                    function radiosEnventosGrupo(){
                setTimeout(() => {
                    console.log("Habilitando o segundo item...");
                    radioGroup.disable(3)  // desabilitao terceiro item
                    radioGroup.checked(3); // Selecionar o terceiro item

                    radioGroup.addEventListener("change", (evt) => {
                    alert(`Selected item: ${evt.detail.value},\nIndex item: ${evt.detail.index},\nData item: ${evt.detail.data}`);
                    });

                }, 90);
         };

          ///////////////////////////////////////////////////////////////////////////////////////
        • METODOS  E EVENTOS PARA  LIDAR COM MAIS DE UM GRUPO  DE BOTÕES
           const radioItems = document.querySelectorAll(".radio-item");

                  function radiosEnventosGrupos(){
                      setTimeout(() => {
                          try {
                              const radioItems = document.querySelectorAll(".radio-item");
                              radioItems[0].setAttribute("checked", "");  /////// ITEM  0 CHECADO
                              radioItems[1].setAttribute("disabled", ""); /////// ITEM  1 DESABILITADO
                              radioItems.forEach((radio, index) => {
                                  /////// ITEM MARCADO COMO CHECADO
                                  //radio.setAttribute("disabled", ""); //////desbilita todos os botões
                                  radio.addEventListener("click", () => {
                                      ///// Desmarca todos os itens
                                      radioItems.forEach((item) => item.removeAttribute("checked"));
                                      // Marca apenas o item atual
                                      radio.setAttribute("checked", "");
                                      ///// Obter as propriedades
                                      let value = radio.textContent.trim();
                                      let index = Array.from(radioItems).indexOf(radio);
                                      let data= radio.getAttribute("data") || null;
                                      
                                      alert(`Selected item: ${value},\nIndex item: ${index},\nData item: ${data}`);
                                  });
                              });
                              
                          } catch (error) { alert(error) }
                      }, 90);
                  };

                /////// Função para desabilitar todos os itens
                function disableAllRadios() {
                    const radioItems = document.querySelectorAll(".radio-item");
                    radioItems.forEach((radio) => { radio.setAttribute("disabled", "");  });
                }

                /////// Função para habilitar todos os itens
                function enableAllRadios() {
                    const radioItems = document.querySelectorAll(".radio-item");
                    radioItems.forEach((radio) => {radio.removeAttribute("disabled"); });
                }

                // Testando
                disableAllRadios(); // Desabilita todos os itens
                setTimeout(enableAllRadios, 3000); // Habilita novamente após 3 segundos
  */

/***/ }),

/***/ "./src/@ms-wc/ms-slider-circular.js":
/*!******************************************!*\
  !*** ./src/@ms-wc/ms-slider-circular.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
class PsSliderCircular extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.angle = 0; 
        this.isDragging = false;
        this.isEditing = false;
        this._disabled = false;
    }

    connectedCallback() {
        this._disabled = this.hasAttribute('disabled');
        
        this.render();
        this.setupEventListeners();
        
        const min = parseFloat(this.getAttribute('min')) || 0;
        const max = parseFloat(this.getAttribute('max')) || 100;
        const value = parseFloat(this.getAttribute('value')) || 0;
        
        this.min = min;
        this.max = max;
        
        this.angle = this.mapValueToAngle(value);
        this.updatePointerPosition(this.angle);
    
        setTimeout(() => {  this.rotateTo(this.angle); }, 100);

        if (this._disabled) {
            this.updateDisabledState();
        }
    }
  
    render() {
        const sizeAttr = this.getAttribute('size') || 90;
        const sizeValue = parseInt(sizeAttr, 10);
        const sizeInPx = `${sizeValue}px`;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: ${sizeInPx};
                    height: ${sizeInPx};
                }
                .circle {
                    width: 100%;
                    height: 100%;
                    border: 6px solid var(--psfx-ui-borda-slider-circular-color);
                    border-radius: 50%;
                    position: relative;
                    box-shadow: var(--psfx-box-shadow);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .pointer {
                    position: absolute;
                    width: 16px;
                    height: 16px;
                    background-color: var(--psfx-ui-slider-circular-disabled-color);
                    border: 5px solid var(--psfx-ui-pointer-slider-circular-color);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    box-shadow: var(--psfx-box-shadow-slider-circular);
                }
                .label {
                    color: var(--psfx-texto-color);
                    font-size: 14px;
                    text-shadow: 1px 1px 2px black;
                    pointer-events: auto;
                    cursor: text;
                }
                .input {
                    width:30px;
                    height: 18px;
                    font-size: 14px;
                    display: none;
                    padding: 2px;
                    text-align: right;
                }
            </style>
            <div class="circle">
                <div class="label">0</div>
                <input type="number" class="input" min="${this.min}" max="${this.max}" step="1">
                <div class="pointer"></div>
            </div>
        `;
    
        this.circleEl = this.shadowRoot.querySelector('.circle');
        this.pointerEl = this.shadowRoot.querySelector('.pointer');
        this.labelEl = this.shadowRoot.querySelector('.label');
        this.inputEl = this.shadowRoot.querySelector('.input');
    }
    
    setupEventListeners() {
        this.circleEl.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.circleEl.addEventListener('pointermove', this.onPointerMove.bind(this));
        this.circleEl.addEventListener('pointerup', this.onPointerUp.bind(this));
        this.circleEl.addEventListener('pointerleave', this.onPointerUp.bind(this));

        this.labelEl.addEventListener('click', this.onLabelClick.bind(this));
        this.labelEl.addEventListener('pointerdown', (event) => event.stopPropagation());
        this.inputEl.addEventListener('blur', this.onInputBlur.bind(this));
        this.inputEl.addEventListener('keydown', this.onInputKeyDown.bind(this));
    }

    updateDisabledState() {
        const circleEl = this.shadowRoot.querySelector('.circle');
        const pointerEl = this.shadowRoot.querySelector('.pointer');
        const labelEl = this.shadowRoot.querySelector('.label');

        if (this._disabled) {
            // circleEl.style.border = '6px solid  var(--psfx-ui-slider-circular-disabled-color)';
            // circleEl.style.boxShadow= "0px 1px 0px 1px rgba(0,0,0, 0.16)";
            pointerEl.style.backgroundColor =  'var(--psfx-ui-slider-circular-disabled-color)';
            pointerEl.style.borderColor =  'var( --psfx-ui-borda-slider-circular-color)';
            pointerEl.style.boxShadow ="2px 2px 0px 0px rgba(0,0,0, 0.16)"
            labelEl.style.color = 'var(--psfx-texto-disbled-color)';
        } else {
            // circleEl.style.border = '6px solid var(--psfx-ui-borda-slider-circular-color)';
            // circleEl.style.boxShadow= "var(--psfx-box-shadow)";
            pointerEl.style.backgroundColor = 'var(--psfx-ui-slider-circular-disabled-color)';
            pointerEl.style.borderColor = 'var(--psfx-ui-pointer-slider-circular-color)';
            pointerEl.style.boxShadow ="var(--psfx-box-shadow-slider-circular)"
            labelEl.style.color = 'var(--psfx-texto-color)';
        }
    }

    disable() {
        this._disabled = true;
        this.setAttribute('disabled', '');
        this.updateDisabledState();
    }

    enable() {
        this._disabled = false;
        this.removeAttribute('disabled');
        this.updateDisabledState();
    }

    mapValueToAngle(value) {
        value = Math.max(this.min, Math.min(this.max, value));
        
        const angleRange = 360;
        const valueRange = this.max - this.min;
        
        return Math.round(
            ((value - this.min) / valueRange) * angleRange
        );
    }

    mapAngleToValue(angle) {
        angle = (angle + 360) % 360;
        
        const angleRange = 360;
        const valueRange = this.max - this.min;
        
        return this.min + (angle / angleRange) * valueRange;
    }

    rotateTo(targetAngle) {
        targetAngle = Math.max(0, Math.min(359, targetAngle));
        this.angle = targetAngle;
        this.updatePointerPosition(targetAngle);
        this.dispatchAngleChangeEvent();
    }

    calculateRadius() {
        return this.circleEl.offsetWidth / 2.1;
    }
    
    calculateAngle(event) {
        const rect = this.circleEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        angle = (angle + 360) % 360;
        angle = (angle + 90) % 360;

        return Math.round(angle);
    }

    updatePointerPosition(angle) {
        const radius = this.calculateRadius();
        const adjustedAngle = (angle + 270) % 360;

        const x = radius * Math.cos(adjustedAngle * (Math.PI / 180));
        const y = radius * Math.sin(adjustedAngle * (Math.PI / 180));

        this.pointerEl.style.left = `calc(50% + ${x}px)`;
        this.pointerEl.style.top = `calc(50% + ${y}px)`;

        const mappedValue = Math.round(this.mapAngleToValue(angle));
        this.labelEl.textContent = `${mappedValue}`;
        this.inputEl.value = mappedValue;
    }

    dispatchAngleChangeEvent() {
        const mappedValue = this.mapAngleToValue(this.angle);
        const changeEvent = new CustomEvent('change', {
            detail: { 
                angle: this.angle, 
                value: mappedValue 
            },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(changeEvent);
    }

    onPointerDown(event) {
        if (this._disabled || this.isEditing) return;
        this.isDragging = true;
        this.angle = this.calculateAngle(event);
        this.updatePointerPosition(this.angle);
        this.dispatchAngleChangeEvent();
    }

    onPointerMove(event) {
        if (!this.isDragging || this._disabled || this.isEditing) return;
        this.angle = this.calculateAngle(event);
        this.updatePointerPosition(this.angle);
        this.dispatchAngleChangeEvent();
    }

    onPointerUp() {
        this.isDragging = false;
    }

    onLabelClick(event) {
        if (this._disabled) return;

        event.preventDefault();
        event.stopPropagation();
    
        this.isEditing = true;
        this.labelEl.style.display = 'none';
        this.inputEl.style.display = 'block';
        this.inputEl.value = Math.round(this.mapAngleToValue(this.angle));
        this.inputEl.focus();
    }

    onInputBlur() {
        this.isEditing = false;
        this.labelEl.style.display = 'block';
        this.inputEl.style.display = 'none';

        let newValue = parseFloat(this.inputEl.value);
        if (isNaN(newValue)) {
            newValue = this.min;
        } else if (newValue < this.min) {
            newValue = this.min;
        } else if (newValue > this.max) {
            newValue = this.max;
        }
        
        this.angle = this.mapValueToAngle(newValue);
        this.updatePointerPosition(this.angle);
        this.dispatchAngleChangeEvent();
    }

    onInputKeyDown(event) {
        if (event.key === 'Enter') {
            this.onInputBlur();
        }
    }

    setValue(newValue) {
        newValue = Math.max(this.min, Math.min(this.max, newValue));
        this.angle = this.mapValueToAngle(newValue);
        this.updatePointerPosition(this.angle);
        this.dispatchAngleChangeEvent();
        setTimeout(() => { this.rotateTo(this.angle);}, 50);
    }
}

customElements.define('ms-slider-circular', PsSliderCircular);

/***/ }),

/***/ "./src/@ms-wc/ms-slider.js":
/*!*********************************!*\
  !*** ./src/@ms-wc/ms-slider.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
class PSSlider extends HTMLElement {
    constructor() {
        super();
        this._value = 0;
        this._min = 0;
        this._max = 100;
        this._isDragging = false;
        this._textoSld =false;
        this._bgcolor = "#ffffff"; ////"#3498db";
        this._disabled = false;
        this._sufixo = "";
    }

    connectedCallback() {
        this._min = Number(this.getAttribute('min') || this._min);
        this._max = Number(this.getAttribute('max') || this._max);
        this._value = Number(this.getAttribute('value') || this._min);
        this._bgcolor = this.getAttribute('colorbg') || this._bgcolor;
        this._disabled = this.hasAttribute('disabled');
        // Verifica se o atributo 'texto' existe e se não é nulo/undefined
        const textoAttr = this.getAttribute('texto');
        if (textoAttr) {
            const partes = textoAttr.split("@");
            this._textoSld = partes[0];
            this._sufixo = partes[1] || ""; // Garante que _sufixo seja uma string vazia se não houver segunda parte
        } else {
            this._textoSld = this._textoSld; // Mantém o valor padrão
            this._sufixo = this._sufixo;     // Mantém o valor padrão
        }

        let exibTexto;
        if(this._textoSld==false){ exibTexto="none"}else{exibTexto="flex"}
    
        this.innerHTML = `
            <style>
                    .ms-slider-container {
                        position: relative;
                        width: 95%;
                        height: 40px;
                        transform: translate(5px, 0);
                        cursor: default;
                    }


                    ms-slider {
                        display: inline-block;
                        width: 100%;
                        max-width: 300px;
                        position: relative;
                      }

                    .ms-slider-track {
                        position: absolute;
                        top: 50%;
                        left: 0;
                        right: 0;
                        height: 3px;
                        background-color: #464545;
                        transform: translateY(-50%);
                        cursor: default;
                    }
                    .ms-slider-fill {
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        background-color: #9b9b9b;
                    }
                    .ms-slider-thumb {
                        position: absolute;
                        top: 50%;
                        left: 0;
                        transform: translate(-50%, -50%);
                        cursor: default;
                        border-radius: 50%;
                        stroke: #818181;
                        fill:#f0f0f0;
                    }
                    .legenda{
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        transform: translateY(13px);
                    }
                    .desbilitaSLD {
                        background: #d1d1d1 !important;
                        pointer-events: none !important;
                    } 
                    .desbilitaSLD.ms-slider-track {height: 1px;}
                    .desbilitaSLD.ms-slider-thumb{
                        background: #f0f0f0 !important;
                        pointer-events: none !important;
                    }
                    .desbilitaSLD circle {
                        fill: #f0f0f0 !important;
                        stroke: #d1d1d1 !important;
                    }

                /* MODO ESCURO */
                @media (prefers-color-scheme: dark), (prefers-color-scheme: darkest) {
                        .ms-slider-container {
                            position: relative;
                            width: 95%;
                            height: 40px;
                            transform: translate(5px, 0);
                            cursor: default;
                        }

                        
                           ms-slider {
                                display: inline-block;
                                width: 100%;
                                max-width: 300px;
                                position: relative;
                            }

                        .ms-slider-track {
                            position: absolute;
                            top: 50%;
                            left: 0;
                            right: 0;
                            height: 3px;
                            background-color: #464545;
                            transform: translateY(-50%);
                            cursor: default;
                            box-shadow: 0px 1px 0px 1px rgb(95, 95, 95);
                        }
                        .ms-slider-fill {
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 100%;
                            background-color:${this._bgcolor};
                        }
                        .ms-slider-thumb {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            cursor: default;
                            border-radius: 50%;
                            stroke: ${this._bgcolor};
                            fill:#535353;
                        }
                        .legenda{
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            transform: translateY(13px);
                        }
                        .desbilitaSLD {
                            background: #5f5f5f !important;
                            pointer-events: none !important;
                        }
                        .desbilitaSLD.ms-slider-track {height: 0px;}
                        .desbilitaSLD.ms-slider-thumb{
                            background: #535353 !important;
                            pointer-events: none !important;
                        }
                        .desbilitaSLD circle {
                            fill: #535353 !important;
                            stroke: #5f5f5f !important;
                        }
                    }

                      .desbilitaSLD-label {
                        color: #8f8c8c !important;
                        cursor: default !important;
                    }

            </style>

            <div class="legenda" style="display: ${exibTexto}">
            <label class="label-texto">${this._textoSld}</label> <label class="label-valor" id="valor">${this._value} </label> </div>
            <div class="ms-slider-container">
                <div class="ms-slider-track">
                <div class="ms-slider-fill"></div>
                </div>
                <svg width="20" height="20" class="ms-slider-thumb">
                <circle cx="10" cy="10" r="6" stroke-width="2"/>
                </svg>
            </div>
        `;

        this.container = this.querySelector('.ms-slider-container');
        this.fill = this.querySelector('.ms-slider-fill');
        this.thumb = this.querySelector('.ms-slider-thumb');
        this.valorLabel = this.querySelector('#valor');
        this.track = this.querySelector('.ms-slider-track');
        this.labelTexto = this.querySelector('.label-texto');
        this.labelValor = this.querySelector('.label-valor');

        this.setupEventListeners();
        this.updateSliderPosition();
        
        if (this._disabled) {
            this.disable();
        }
    }

    setupEventListeners() {
        this.container.addEventListener('pointerdown', this.onPointerDown.bind(this));
        document.addEventListener('pointermove', this.onPointerMove.bind(this));
        document.addEventListener('pointerup', this.onPointerUp.bind(this));
        document.addEventListener('pointercancel', this.onPointerUp.bind(this));
    }

    onPointerDown(e) {
        this._isDragging = true;
        this.container.setPointerCapture(e.pointerId);
        this.updateValueFromEvent(e);
    }

    onPointerMove(e) {
        if (this._isDragging) {
            this.updateValueFromEvent(e);
        }
    }

    onPointerUp(e) {
        if (this._isDragging) {
            this._isDragging = false;
            this.container.releasePointerCapture(e.pointerId);
        }
    }

    updateValueFromEvent(e) {
        const rect = this.container.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        this.value = Math.round(percentage * (this._max - this._min) + this._min);
    }

    updateSliderPosition() {
        requestAnimationFrame(() => {
            // Ajustar o cálculo percentual para levar em conta valores negativos
            const totalRange = this._max - this._min;
            const adjustedValue = this._value - this._min; // Ajusta o valor para que comece de zero
            const percentage = (adjustedValue / totalRange) * 100;
            this.thumb.style.left = `${percentage}%`;
            this.fill.style.width = `${percentage}%`;
            if (this.valorLabel) {
                this.valorLabel.textContent = `${this._value} ${this._sufixo}`;
            }
        });
    }

    get value() { return this._value; }

    set value(newValue) {
        const oldValue = this._value;
        this._value = Math.max(this._min, Math.min(this._max, newValue));
        if (oldValue !== this._value) {
            this.updateSliderPosition();
            
            class SliderChangeEvent extends CustomEvent {
                constructor(value) {
                    super('change', { detail: value });
                    this._value = value;
                }

                get value() {
                    return this._value;
                }
            }

            console.log(this._textoSld)
            this.dispatchEvent(new SliderChangeEvent(this._value));
        }
    }

    static get observedAttributes() {
        return ['min', 'max', 'value', 'texto', 'disabled'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            switch (name) {
                case 'min':
                    this._min = Number(newValue);
                    break;
                case 'max':
                    this._max = Number(newValue);
                    break;
                case 'value':
                    this.value = Number(newValue);
                    break;
                case 'disabled':
                    this._disabled = this.hasAttribute('disabled');
                    this._disabled ? this.disable() : this.enable();
                    break;
            }
            this.updateSliderPosition();
        }
    }

  disable() {
        this._disabled = true;
        this.fill.classList.add('desbilitaSLD');
        this.thumb.classList.add('desbilitaSLD');
        this.track.classList.add('desbilitaSLD');
        this.labelTexto.classList.add('desbilitaSLD-label');
        this.labelValor.classList.add('desbilitaSLD-label');
        this.style.pointerEvents = "none";
    }

    enable() {
        this._disabled = false;
        this.fill.classList.remove('desbilitaSLD');
        this.thumb.classList.remove('desbilitaSLD');
        this.track.classList.remove('desbilitaSLD');
        this.labelTexto.classList.remove('desbilitaSLD-label');
        this.labelValor.classList.remove('desbilitaSLD-label');
        this.style.pointerEvents = "auto";
    }

    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        const isDisabled = Boolean(value);
        if (isDisabled) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }
}

customElements.define('ms-slider', PSSlider);

/***/ }),

/***/ "./src/@ms-wc/ms-tab-group.js":
/*!************************************!*\
  !*** ./src/@ms-wc/ms-tab-group.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
class PsTabGroup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._activeTabIndex = 0;
  }

  static get observedAttributes() {
    return ['active'];
  }

  connectedCallback() {
    this.render();
    this.setupTabs();
    this.activateTab(this._activeTabIndex);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'active' && oldValue !== newValue) {
      this.activateTab(parseInt(newValue, 10));
    }
  }

  render() {
    const style = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
        }
        .contTabs {
          border: 1px solid var(--psfx-ui-borda-forte-color);
          background-color: var(--psfx-ui-bg-color);
          box-shadow: var(--psfx-box-shadow);
          position: relative;
        }
        .tab-buttons {
          display: flex;
        }
        .tab-button {
          background-color: var(--psfx-bg-detalhes-color);
          padding: 10px 8px;
          cursor: pointer;
          height: 23px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 11px;
          box-shadow: 1px 0px 0px 0px #333333;
          margin-right: 1px;
          color: var(--psfx-texto-color-2);
        }
        .tab-button:hover {
          color: var(--psfx-texto-color);
        }
        .tab-button:active { 
          height: 22px;
          transform: translate(0px, 1px);
          border-top: 1px solid var(--psfx-borda-elemento-color);
          background-color: var(--psfx-ui-bg-color);
        }
        .tab-button.active {
          background: var(--psfx-botao-naveg-Abas);
          pointer-events: none;
        }
        ::slotted(.tab-panel) {
          display: none;
        }
        ::slotted(.tab-panel.active) {
          display: block;
        }
        .bgBtns{
          background-color: var(--psfx-bg-detalhes-color);
          width: 100%;
          height: 23px;
          position: absolute;
          top: 0px;
        }
      </style>
      <div class="contTabs">
        <div class="bgBtns">
          <div class="tab-buttons"></div>
        </div>
        <slot></slot>
      </div>
    `;

    this.shadowRoot.innerHTML = style;
  }

  setupTabs() {
    const tabButtonsContainer = this.shadowRoot.querySelector('.tab-buttons');
    Array.from(this.children).forEach((tab, index) => {
      const button = document.createElement('div');
      button.classList.add('tab-button');
      button.textContent = tab.getAttribute('titulo') || `Tab ${index + 1}`;
      button.dataset.index = index;
      button.addEventListener('click', () => {
        this.activateTab(index);
        this.dispatchTabChangeEvent(index);
      });
      tabButtonsContainer.appendChild(button);
      tab.classList.add('tab-panel');
      
      if (tab.hasAttribute('active')) {
        this._activeTabIndex = index;
      }
    });
  }

  dispatchTabChangeEvent(index) {
    const event = new CustomEvent('tab-change', {
      detail: {
        index,
        text: this.getActiveTabText()
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  activateTab(index) {
    const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
    const tabPanels = this.children;

    tabButtons.forEach(btn => btn.classList.remove('active'));
    Array.from(tabPanels).forEach(panel => panel.classList.remove('active'));

    if (index >= 0 && index < tabPanels.length) {
      tabButtons[index].classList.add('active');
      tabPanels[index].classList.add('active');
      this._activeTabIndex = index;
    }
  }

  // Método para obter o texto do botão da aba ativa
  getActiveTabText() {
    const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
    const activeButton = tabButtons[this._activeTabIndex];
    return activeButton ? activeButton.textContent.trim() : null;
  }
}

class PsTab extends HTMLElement {
  static get observedAttributes() {
    return ['active'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'active' && this.parentElement) {
      const index = Array.from(this.parentElement.children).indexOf(this);
      this.parentElement.activateTab(index);
    }
  }
}

customElements.define('ms-tab-group', PsTabGroup);
customElements.define('ms-tab', PsTab);

 /*
      ///// DOCUMENTAÇÃO DO COMPONENTE
      //////// SINTEMA DE NEVEGAÇÃO POR ABAS

      Atributos HTML:
      <ms-tab-group id="tab-groupA">
          <ms-tab   titulo="Aba 1" active>Conteudo aba 1</ms-tab>  //// ABA SELECIONADA
          <ms-tab   titulo="Aba 2">Conteudo aba 2</ms-tab>  
          <ms-tab   titulo="Aba 3">Conteudo aba 3</ms-tab>  
      </ms-tab-group>
      
      • Manipulação via JavaScript:
          const tabs = document.querySelector('#tab-groupA');
          setTimeout(() => { 
              tabs.addEventListener('tab-change', (event) => {
                  /////// OBTEM O INDICE E O TITULO DA ABA ATIVA
                  const { index, text } = event.detail;
                  console.log(`Aba ${index}\nAtiva: ${text}`);
              });
                  /////// SELECIONA A ABRA ATIVA
                 tabs.activateTab(0);
          }, 90); 
  */

/***/ }),

/***/ "./src/@ms-wc/ps-combobox.js":
/*!***********************************!*\
  !*** ./src/@ms-wc/ps-combobox.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
class PSCombobox extends HTMLElement {
    constructor() {
        super();
        this.options = [];
        this._selectedIndex = -1;
        this._originalObjects = [];
        this._isInputMode = false;
    }

    connectedCallback() {
        this.options = JSON.parse(this.getAttribute('data-options') || '[]');
        this.render();
        this.attachEventListeners();

        const initialIndex = parseInt(this.getAttribute('data-selected-index'), 10)
        if (!isNaN(initialIndex) && initialIndex >= 0 && initialIndex < this.options.length) {
            this.selectedIndex = initialIndex 
        } else {
            this.selectedIndex = 0;
        }

        if (this.hasAttribute('disabled')) {
            this.disable();
        }
    }

    render() {
        this.innerHTML = `
        <style>
            ps-combobox {
                display: inline-block;
                position: relative;
                font-family: Arial, sans-serif;
                width: 100%;
                height: 20px;
                color: var(--psfx-texto-color);
            }

            .ps-combobox-container {
                display: flex;
                align-items: center;
                user-select: none;
                height: 24px;
                border: 1px solid var(--psfx-borda-elemento-color);
                padding-left: 1px;
                background-color: var(--psfx-bg-detalhes-color); 
            }

            .ps-combobox-container:hover {
                border: 1px solid var(--psfx-borda-elemento-color-2);
            }

            .ps-combobox-input {
                width: 100%;
                height: 23px;
                flex-grow: 1;
                border: 0px;
                font-size: 12px;
                padding: 4px;
                cursor: text;
                margin: 0px;
                padding-left: 6px;
                font-family: Arial, sans-serif;
            }

            .ps-combobox-text {
                width: 100%;
                height: 20px;
                flex-grow: 1;
                border: 0px;
                font-size: 12px;
                padding: 1px;
                cursor: pointer;
                margin: 0px;
                padding-left: 9px;
                font-family: Arial, sans-serif;
                background: transparent;
                display: flex;
                align-items: center;
            }

            .ps-combobox-arrow {
                cursor: pointer;
                padding: 0 2px;
                background-color: var(--psfx-bg-detalhes-claro-color);
                margin-right: 2px;
                fill: var(--psfx-texto-color);
             }

            .ps-combobox-options {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background-color: var( --psfx-bg-options-list-color);
                border: 1px solid var(--psfx-ui-borda-forte-color);
                box-shadow: var(--psfx-box-shadow:);
                max-height: 144px;
                overflow-y: auto;
                z-index: 1000;
                margin-top: 5px;
                box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
            }

            .ps-combobox-option {
                padding: 3px;
                padding-left: 10px;
                cursor: pointer;
                color: var(--psfx-texto-options-list-color);
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .ps-combobox-option:hover {
                background-color: #60adf5;
                color: #ffffff;
            }

            .ps-combobox-option.selected {
                background-color: var(--psfx-borda-elemento-color);
                color: var(--psfx-texto-color);
            }

            .ps-combobox-option-svg {
                display: none;
                color: var(--psfx-texto-color)
            }

            .ps-combobox-option.selected .ps-combobox-option-svg {
                display: block;
                margin-right: 5px;
            }

            .desabilitar {
                background-image: none; 
                background-color: var(--psfx-bg-detalhes-color); 
                color: #7b7b7b;
                fill: #7b7b7b !important;
            }

            .desabilitarImp {
                color: #7b7b7b;
            }
        </style>
        
        <div class="ps-combobox-container">
            <div class="ps-combobox-text">${this.options[this._selectedIndex] || ''}</div>
            <input type="text" class="ps-combobox-input" value="${this.options[this._selectedIndex] || ''}" style="display: none;">
            <span class="ps-combobox-arrow">
                <svg id="bgSeta" xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="12">
                    <path class="setas" id="seta" d="M4,7.01a1,1,0,0,1,1.7055-.7055l3.289,3.286,3.289-3.286a1,1,0,0,1,1.437,1.3865l-.0245.0245L9.7,11.7075a1,1,0,0,1-1.4125,0L4.293,7.716A.9945.9945,0,0,1,4,7.01Z" fill= var(--psfx-texto-color) />
                </svg>
            </span>
        </div>
        <div class="ps-combobox-options">
            ${this.options.map((option, index) => `
                <div class="ps-combobox-option" data-index="${index}">
                    ${option}
                    <svg xmlns="http://www.w3.org/2000/svg" class="ps-combobox-option-svg" height="12" width="12" viewBox="0 0 16 16" fill="none">
                        <path class="fill" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z"  fill="#60adf5"/>
                    </svg>
                </div>
            `).join('')}
        </div>
        `;
    }

    attachEventListeners() {
        const container = this.querySelector('.ps-combobox-container');
        const input = this.querySelector('.ps-combobox-input');
        const textDiv = this.querySelector('.ps-combobox-text');
        const arrow = this.querySelector('.ps-combobox-arrow');
        const optionsContainer = this.querySelector('.ps-combobox-options');
    
        const updateFilteredOptions = (filterValue) => {
            this._filteredOptions = this.options
                .map((option, index) => ({ option, index }))
                .filter(({ option }) => 
                    option.toLowerCase().includes(filterValue.toLowerCase())
                );
    
            optionsContainer.innerHTML = this._filteredOptions
                .map(({ option, index }) => `
                    <div class="ps-combobox-option ${index === this._selectedIndex ? 'selected' : ''}" data-index="${index}">
                        ${option}
                        <svg xmlns="http://www.w3.org/2000/svg" class="ps-combobox-option-svg" height="12" width="12" viewBox="0 0 16 16" fill="none" style="display: ${index === this._selectedIndex ? 'block' : 'none'}">
                            <path class="fill" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z" fill="#60adf5"/>
                        </svg>
                    </div>
                `).join('');
        };
    
        const toggleOptions = () => {
            if (this.hasAttribute('disabled')) return;
            const newDisplay = optionsContainer.style.display === 'block' ? 'none' : 'block';
            optionsContainer.style.display = newDisplay;
            
            if (newDisplay === 'block') {
                updateFilteredOptions('');
            }
        };
    
        const updateInputWithSelectedOption = () => {
            if (this._selectedIndex >= 0 && this._selectedIndex < this.options.length) {
                const selectedOption = this.options[this._selectedIndex];
                input.value = selectedOption;
            }
        };
    
        const switchToInput = () => {
            if (this.hasAttribute('disabled')) return;
            
            textDiv.style.display = 'none';
            input.style.display = 'block';
            input.focus();
            input.select();
            this._isInputMode = true;
            optionsContainer.style.display = 'block';
            updateFilteredOptions('');
        };
    
        const switchToText = () => {
            input.style.display = 'none';
            textDiv.style.display = 'flex';
            this._isInputMode = false;
            optionsContainer.style.display = 'none';
            
            const inputValue = input.value.trim();
            if (inputValue !== '') {
                textDiv.textContent = inputValue;
                
                const existingIndex = this.options.indexOf(inputValue);
                if (existingIndex !== -1) {
                    this._selectedIndex = existingIndex;
                } else {
                    this._selectedIndex = -1;
                }
            }
        };
    
        document.addEventListener("keydown", (event) => {
            if (!optionsContainer.style.display || optionsContainer.style.display === "none") return;
    
            if (event.key === "ArrowDown") {
                event.preventDefault();
                const currentFilteredIndex = this._filteredOptions.findIndex(
                    ({ index }) => index === this._selectedIndex
                );
                if (currentFilteredIndex === -1 || currentFilteredIndex === this._filteredOptions.length - 1) {
                    this._selectedIndex = this._filteredOptions[0]?.index ?? -1;
                } else {
                    this._selectedIndex = this._filteredOptions[currentFilteredIndex + 1].index;
                }
                updateInputWithSelectedOption();
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                const currentFilteredIndex = this._filteredOptions.findIndex(
                    ({ index }) => index === this._selectedIndex
                );
                if (currentFilteredIndex <= 0) {
                    this._selectedIndex = this._filteredOptions[this._filteredOptions.length - 1]?.index ?? -1;
                } else {
                    this._selectedIndex = this._filteredOptions[currentFilteredIndex - 1].index;
                }
                updateInputWithSelectedOption();
            } else if (event.key === "Enter") {
                event.preventDefault();
                if (this._selectedIndex >= 0) {
                    const selectedOption = this.options[this._selectedIndex];
                    textDiv.textContent = selectedOption;
                    input.value = selectedOption;
                    this.dispatchEvent(new CustomEvent('optionSelected', {
                        detail: {
                            selectedIndex: this._selectedIndex,
                            value: selectedOption,
                            originalObject: this._originalObjects[this._selectedIndex]
                        }
                    }));
                    switchToText();
                }
                return;
            } else if (event.key === "Escape") {
                optionsContainer.style.display = "none";
                return;
            }
    
            const options = this.querySelectorAll('.ps-combobox-option');
            options.forEach((option) => {
                const originalIndex = parseInt(option.getAttribute('data-index'));
                if (originalIndex === this._selectedIndex) {
                    option.classList.add('selected');
                    option.querySelector('.ps-combobox-option-svg').style.display = 'block';
                    option.scrollIntoView({ block: 'nearest' });
                } else {
                    option.classList.remove('selected');
                    option.querySelector('.ps-combobox-option-svg').style.display = 'none';
                }
            });
        });
    
        textDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            switchToInput();
        });
    
        arrow.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!this._isInputMode) {
                toggleOptions();
            } else {
                toggleOptions();
            }
        });
    
        input.addEventListener('input', () => {
            const filterValue = input.value;
            optionsContainer.style.display = 'block';
            updateFilteredOptions(filterValue);
        });
    
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const inputValue = input.value.trim();
                
                if (inputValue !== '') {
                    const existingIndex = this.options.findIndex(
                        option => option.toLowerCase() === inputValue.toLowerCase()
                    );
        
                    if (existingIndex !== -1) {
                        this._selectedIndex = existingIndex;
                        const selectedOption = this.options[this._selectedIndex];
                        const originalObject = this._originalObjects[this._selectedIndex];
                        
                        this.dispatchEvent(new CustomEvent('optionSelected', {
                            detail: {
                                selectedIndex: this._selectedIndex,
                                value: selectedOption,
                                originalObject: originalObject
                            }
                        }));
                    } else {
                        this.dispatchEvent(new CustomEvent('newValueEntered', {
                            detail: {
                                value: inputValue
                            }
                        }));
                    }
                    input.value = inputValue;
                }
                
                switchToText();
            } else if (e.key === 'Escape') {
                switchToText();
            }
        });
    
        optionsContainer.addEventListener('click', (e) => {
            const optionElement = e.target.closest('.ps-combobox-option');
            if (optionElement) {
                const options = this.querySelectorAll('.ps-combobox-option');
                options.forEach(opt => {
                    opt.classList.remove('selected');
                    opt.querySelector('.ps-combobox-option-svg').style.display = 'none';
                });
                optionElement.classList.add('selected');
                optionElement.querySelector('.ps-combobox-option-svg').style.display = 'block';
                
                this.selectedIndex = parseInt(optionElement.getAttribute('data-index'));
                this.dispatchEvent(new CustomEvent('optionSelected', {
                    detail: {
                        selectedIndex: this._selectedIndex,
                        value: this.value,
                        originalObject: this._originalObjects[this._selectedIndex]
                    }
                }));
                switchToText();
            }
        });
    
        document.addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
                switchToText();
            }
        });
    }

    addOption(item, originalObject = null) {
        this._originalObjects.push(originalObject || item);
        this.options.push(item);
        
        const optionsContainer = this.querySelector('.ps-combobox-options');
        const newOptionIndex = this.options.length - 1;
        const newOptionElement = document.createElement('div');
        newOptionElement.className = 'ps-combobox-option';
        newOptionElement.setAttribute('data-index', newOptionIndex);
        newOptionElement.innerHTML = `
            ${item}
            <svg xmlns="http://www.w3.org/2000/svg" class="ps-combobox-option-svg" height="12" width="12" viewBox="0 0 16 16" fill="none">
                <path class="fill" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z"  fill="#60adf5"/>
            </svg>
        `;

        optionsContainer.appendChild(newOptionElement);
    }

    updateSelected() {
        const input = this.querySelector('.ps-combobox-input');
        const textDiv = this.querySelector('.ps-combobox-text');
        
        if (this._selectedIndex === -1) {
            const customValue = textDiv.textContent;
            input.value = customValue;
        } else {
            const selectedValue = this.options[this._selectedIndex];
            input.value = selectedValue;
            textDiv.textContent = selectedValue;
        }

        const options = this.querySelectorAll('.ps-combobox-option');
        options.forEach((option, index) => {
            const svg = option.querySelector('.ps-combobox-option-svg');
            if (index === this._selectedIndex) {
                option.classList.add('selected');
                if (svg) svg.style.display = 'block';
            } else {
                option.classList.remove('selected');
                if (svg) svg.style.display = 'none';
            }
        });
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    set selectedIndex(value) {
        if (value >= 0 && value < this.options.length) {
            this._selectedIndex = value;
            this.updateSelected();
        } else {
            console.warn('selectedIndex fora do intervalo.');
        }
    }

    get value() {
        const input = this.querySelector('.ps-combobox-input');
        const inputValue = input.value;
        
        const matchedIndex = this.options.findIndex(option => 
            option.toLowerCase() === inputValue.toLowerCase()
        );

        if (matchedIndex !== -1) {
            this._selectedIndex = matchedIndex;
            return this.options[matchedIndex];
        }
        
        return inputValue;
    }

    disable() {
        this.setAttribute('disabled', 'true');
        const input = this.querySelector('.ps-combobox-input');
        const textDiv = this.querySelector('.ps-combobox-text');
        const setasvg = this.querySelector('#seta');
        const bgseta = this.querySelector('#bgSeta');
        const arrow = this.querySelector('.ps-combobox-arrow');
        const container = this.querySelector('.ps-combobox-container');
    
        if (input) input.style.display = 'none';
        if (textDiv) {
            textDiv.style.color = '#7b7b7b';
            textDiv.style.backgroundColor = "var(--psfx-bg-detalhes-color)";
            textDiv.style.cursor = 'default';
        }
    
        if (setasvg) setasvg.classList.add('desabilitar');
        if (bgseta) bgseta.classList.add('desabilitar');
        if (arrow) {
            arrow.style.pointerEvents = 'none';
            arrow.classList.add('desabilitar');
        }
        if (container) container.classList.add('desabilitar');
    }
    
    enable() {
        this.removeAttribute('disabled');
        const input = this.querySelector('.ps-combobox-input');
        const textDiv = this.querySelector('.ps-combobox-text');
        const setasvg = this.querySelector('#seta');
        const bgseta = this.querySelector('#bgSeta');
        const arrow = this.querySelector('.ps-combobox-arrow');
        const container = this.querySelector('.ps-combobox-container');
    
        if (textDiv) {
            textDiv.style.color = '';
            textDiv.style.backgroundColor= '';
            textDiv.style.cursor = 'pointer';
        }
    
        if (setasvg) setasvg.classList.remove('desabilitar');
        if (bgseta) bgseta.classList.remove('desabilitar');
        if (arrow) {
            arrow.style.pointerEvents = 'auto';
            arrow.classList.remove('desabilitar');
        }
        if (container) container.classList.remove('desabilitar');
    }
}

customElements.define('ps-combobox', PSCombobox);



/*
        ///// DOCUMENTAÇÃO DO COMPONENTE
        O PSCombobox é um componente web personalizado que implementa uma caixa de seleção com funcionalidades como pesquisa, navegação por teclado e personalização.

        • Uso Básico
        Atributos HTML
       <ps-combobox data-options='["Brasil", "Argentina", "Chile"]' data-selected-index="3"></ps-combobox>
            data-options: Define as opções disponíveis na combobox.
            data-selected-index: Define o índice do item inicialmente selecionado (exemplo: 3 seleciona o quarto item da lista).
        
        • Manipulação via JavaScript
          Carregar Itens Dinamicamente
              
        const array = [
            { nome: 'João', idade: 25, sexo: "Masculino" },
            { nome: 'Maria', idade: 30, sexo: "Feminino" },
        ];

        const combobox = document.querySelector('ps-combobox');
        setTimeout(() => {
            array.forEach(item => {
                combobox.addOption(item.nome, item); // Exibe `item.nome` e armazena o objeto completo.
            });
            combobox.selectedIndex = 4; // Seleciona o item de índice 4
        }, 90);

        Eventos
        Capturar Seleção
        • combobox.addEventListener('optionSelected', (event) => {
            const { value, originalObject } = event.detail;

            if (originalObject) {
                alert(`Nome: ${value}, Idade: ${originalObject.idade}, Sexo: ${originalObject.sexo}`);
            }
        });
       
       • Ações Personalizadas
         document.querySelector("#botao").addEventListener('click', () => {
            getSelectedItem(); // Obtém as propriedades do item selecionado
            alert(`Nome: ${combobox.value}`); // Exibe o valor selecionado
        });

        Funções Úteis  -------------------------
        • Obter o item selecionado:
        function getSelectedItem() {
            const selected = combobox.selectedObject;
            if (selected) {
                alert(`Nome: ${selected.nome}\nIdade: ${selected.idade}\nSexo: ${selected.sexo}`);
            }
        }

        • Obter item pelo índice:
            function getItemByIndex(index) {
                const selected = combobox._originalObjects[index];
                if (selected) {
                    alert(`Nome: ${selected.nome}\nIdade: ${selected.idade}\nSexo: ${selected.sexo}`);
                }
            }
           
        • Navegação por Teclado
            Seta para cima (↑): Move a seleção para o item anterior.
            Seta para baixo (↓): Move a seleção para o próximo item.
            Enter: Seleciona o item destacado.
            Esc: Fecha o menu de opções.

        • Habilitar ou Desabilitar
            Desabilitar:  combobox.disable();
            Habilitar:     combobox.enable();
*/


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ms_wc_ms_painel_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./@ms-wc/ms-painel.js */ "./src/@ms-wc/ms-painel.js");
/* harmony import */ var _ms_wc_ms_box_number_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./@ms-wc/ms-box-number.js */ "./src/@ms-wc/ms-box-number.js");
/* harmony import */ var _ms_wc_ms_checkbox_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./@ms-wc/ms-checkbox.js */ "./src/@ms-wc/ms-checkbox.js");
/* harmony import */ var _ms_wc_ms_icon_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./@ms-wc/ms-icon.js */ "./src/@ms-wc/ms-icon.js");
/* harmony import */ var _ms_wc_ms_buttom_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./@ms-wc/ms-buttom.js */ "./src/@ms-wc/ms-buttom.js");
/* harmony import */ var _ms_wc_ms_slider_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./@ms-wc/ms-slider.js */ "./src/@ms-wc/ms-slider.js");
/* harmony import */ var _ms_wc_ms_tab_group_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./@ms-wc/ms-tab-group.js */ "./src/@ms-wc/ms-tab-group.js");
/* harmony import */ var _ms_wc_ps_combobox_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./@ms-wc/ps-combobox.js */ "./src/@ms-wc/ps-combobox.js");
/* harmony import */ var _ms_wc_ms_dropdowlist_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./@ms-wc/ms-dropdowlist.js */ "./src/@ms-wc/ms-dropdowlist.js");
/* harmony import */ var _ms_wc_ms_radio_group_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./@ms-wc/ms-radio-group.js */ "./src/@ms-wc/ms-radio-group.js");
/* harmony import */ var _ms_wc_ms_busca_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./@ms-wc/ms-busca.js */ "./src/@ms-wc/ms-busca.js");
/* harmony import */ var _ms_wc_ms_slider_circular_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./@ms-wc/ms-slider-circular.js */ "./src/@ms-wc/ms-slider-circular.js");
/* harmony import */ var _ms_wc_ms_color_seletor_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./@ms-wc/ms-color-seletor.js */ "./src/@ms-wc/ms-color-seletor.js");
/* harmony import */ var _ms_wc_ms_popover_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./@ms-wc/ms-popover.js */ "./src/@ms-wc/ms-popover.js");
const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;


//////// IMPORTAR COMPONENTES




















//////// IMPORTAR SCRIPTS JS
const {moda001} = require("./js/Dlg_001A.js");

document.addEventListener('DOMContentLoaded', () => {

    const fieldset = document.querySelector('#pn1');
    //// OUVINTES DE EVENTOS
    const numberBox = document.querySelector('#teste_nf');
    numberBox.addEventListener('change', () => {
        console.log(`Valor atual: ${numberBox.value}`);
        document.querySelector('#texto').textContent = `Valor atual: ${numberBox.value}`;
    });

    ///// INTEGRAÇÃO COM JAVASCRIPIT "ATRIBUTOS"
    setTimeout(() => { 
        numberBox.setAttribute('size', "130px");
        numberBox.setAttribute('value', "80.7");
        numberBox.setAttribute('value-suffix', "cm");
        numberBox.setAttribute("data-label", "Largura");
    }, 90); 

    

    //setTimeout(() => { fieldset.disable();}, 30); // Desabilita o fieldset

    //////////////////////////////////////////////////////1
    /////////TEXTES DO COMPONENTE CHECKBOX
    // Seleciona o componente
    const checkbox = document.querySelector('#ck1');
    const checkbox2 = document.querySelector('#ck2');

    // Escutar mudanças
    checkbox.addEventListener('change', (evt) => {
        alert(`Novo estado: ${evt.detail.checked}`);
    });

    checkbox2.addEventListener('change',  (evt) => {
            if(evt.detail.checked){
                checkbox.disabled = true;// radiosDisabled(true)
                psButtonDesab(true)
            }
            else{
                checkbox.disabled = false;// radiosDisabled(false)
                psButtonDesab(false)
            }
    });

    //////////////////////////////////////////////////////
    /////////TEXTES DO COMPONENTE RADIOS

    // document.querySelector('#rd2').disabled = true;

    // Escutar mudanças de estado
    /*
    document.querySelector('#rd1').addEventListener('change', (e) => {
        // alert('Novo estado de rd1: ' + e.detail.checked);
        document.querySelector('#rd1').checked = true;
        document.querySelector('#rd2').checked = false;
        document.querySelector('#rd3').checked = false;
    });

    document.querySelector('#rd2').addEventListener('change', (e) => {
        // alert('Novo estado de rd2: ' + e.detail.checked);
            document.querySelector('#rd2').checked = true;
            document.querySelector('#rd1').checked = false;
            document.querySelector('#rd3').checked = false;
        });

        document.querySelector('#rd3').addEventListener('change', (e) => {
        // alert('Novo estado de rd3: ' + e.detail.checked);
            document.querySelector('#rd3').checked = true;
            document.querySelector('#rd1').checked = false;
            document.querySelector('#rd2').checked = false;
        });
*/
    // document.querySelector('#rd2').addEventListener('change', (e) => {
    //     // alert('Novo estado de rd2: ' + e.detail.checked);
    //     // alert(document.querySelector('#rd2').textContent)
    //     alert(`Data: ${e.detail.data}`);
    // });


    ////////FUNÇÃO DOS BOÕES DE RADIO
//  document.addEventListener('DOMContentLoaded', () => {
//     try {
//         const radios = document.getElementsByClassName("btn");
//         const radioBtn = Array.from(radios);

//         for (let i = 0; i < radioBtn.length; i++) { 
//             radioBtn[i].addEventListener('change', (event) => {
//                 // Desmarca todos os botões de rádio
//                 radioBtn.forEach(radio => radio.checked = false);
//                 // Marca o botão de rádio atual
//                 event.currentTarget.checked = true;
//                 alert(event.currentTarget.tex)
//             });
//         }
//     } catch (err) { alert(err); }
//  });



        // ////////FUNÇÃO DOS BOÕES DE RADIO
        // document.addEventListener('DOMContentLoaded', () => {
        //     try {
        //         const radios = document.getElementsByClassName("btn");
        //         const radioBtn = Array.from(radios);

        //         for (let i = 0; i < radioBtn.length; i++) { 
        //             radioBtn[i].addEventListener('change', (event) => {
        //                     alert(event.target.getAttribute('data'))
        //                     alert(event.target.textContent)
        //                     alert(i)
        //             });
        //         }
        //     } catch (err) { alert(err); }
        // });


        // //     document.addEventListener('DOMContentLoaded', () => {
        // //         document.querySelector(".teste").addEventListener("change", evt => {
        // //             alert(`Selected item: ${evt.target.getAttribute('data')}`);
        // //         })
        // //   })




            //   try {
            //         const radios = document.getElementsByClassName("btn");
            //         Array.from(radios).forEach((radio, index) => {
            //            // setTimeout(() => { radio.disabled = true;}, 90); 
            //               radio.addEventListener('change', (event) => {
            //                    alert(`Data: ${event.target.getAttribute('data')}\nTexto: ${event.target.textContent}\nIndex: ${index}`)
            //               })
            //         });
            //     } catch (err) {}


                
            // function radiosDisabled(method){
            //     const radiosBtn = document.querySelectorAll(".btn")
            //     radiosBtn.forEach( radiox => {
            //     setTimeout(() => { radiox.disabled = method;}, 90); //// DESABILITAR TODOS
            //     });
            // }
            
            ////// MODIFICAR THEMA PS
            document.querySelector("#tmC").addEventListener('click', () => {
                themaPS("kPanelBrightnessOriginal")   //// calro
                document.querySelector("#tmC").textContent = 'Thema claro_OK';
            })
            document.querySelector("#tmE").addEventListener('click', () => {
                themaPS("kPanelBrightnessMediumGray")   /// escuro
                document.querySelector("#tmC").textContent = 'Thema claro';
            })


            async function themaPS(thema){
                await core.executeAsModal(async () => {
                    await app.batchPlay( [{
                        "_obj": "set", "_target": [ { "_property": "interfacePrefs", "_ref": "property" }, { "_enum": "ordinal", "_ref": "application", "_value": "targetEnum" } ], "to": { "_obj": "interfacePrefs", "kuiBrightnessLevel": { "_enum": "uiBrightnessLevelEnumType", "_value": thema } }
                    }]);
                })
            }

            ///////// EVENTS BOTÕES ACTIONS
            function psButtonDesab(d){
                setTimeout(() => {
                        if(d==true){
                                document.querySelector('#tmC').disable();
                                document.querySelector('#tmE').disable()
                                document.querySelector('#btnIcone1').disable()
                                document.querySelector('#slider01').disable()
                                document.querySelector('#listaCB').disable()
                                document.querySelector('#buscar').disable()
                                document.querySelector('#teste_nf').disable()
                                disableAllRadios()
                            }
                            else  {  
                            document.querySelector('#tmC').enable()
                            document.querySelector('#tmE').enable()
                            document.querySelector('#btnIcone1').enable()
                            document.querySelector('#slider01').enable()
                            document.querySelector('#listaCB').enable();
                            document.querySelector('#buscar').enable();
                            document.querySelector('#teste_nf').enable();
                            enableAllRadios()
                        }
                    }, 90);
            }


            function disableAllRadios() {
                const radioItems = document.querySelectorAll(".radio-item");
                radioItems.forEach((radio) => { radio.setAttribute("disabled", "");  });
            }

            /////// Função para habilitar todos os itens
            function enableAllRadios() {
                const radioItems = document.querySelectorAll(".radio-item");
                radioItems.forEach((radio) => {radio.removeAttribute("disabled"); });
            }


            ///////// EVENTS BOTÕES COM ICONES
            const button2 = document.querySelector('#btnIcone1'); 
            setTimeout(() => { 
                //   button2.disable();  //// DESABILITAR
            //    button.enable();   //// HABILITAR
                }, 90);

                ///////// ESCUTAR BOTÕES COM ICONES  
                document.querySelector('#btnIcone1').addEventListener('click', async () => {
                //alert("Olá mundo")
                await moda001();
            })



            ///////// SLIDER CONFIGS INICIL-----------------------------------------
            ///////// ESCUTAR VALORES DE SLIDER
            let  inicalSatate ;
            var listener = (e,d) => { 
                inicalSatate = app.activeDocument.historyStates[app.activeDocument.historyStates.length-1]
                }
                action.addNotificationListener([{ event: "select" }, { event: "open" }, { event: "moveTool" } , {event: "make"} ], listener);   

            const eventHandler = (event, descriptor) => console.log(event, descriptor)
            require("photoshop").action.addNotificationListener(['all'], eventHandler);


            const slider = document.querySelector('#slider01');
            slider.addEventListener('change', async (e) => {
            //  console.log('Novo valor:', e.detail);
                        try {
                            await core.executeAsModal( async() => {
                            //    await app.batchPlay([  { "_obj": "clearEvent", "_target": [ { "_property": "historyStates", "_ref": "property" }, { "_enum": "ordinal", "_ref": "document", "_value": "targetEnum" } ] }]);
                                    app.activeDocument.activeHistoryState =  inicalSatate;
                                //    await app.batchPlay([   { "_obj": "colorBalance", "highlightLevels": [ 0, 0, 0 ], "midtoneLevels": [ e.value, 0, 0 ], "preserveLuminosity": true, "shadowLevels": [ 0, 0, 0 ] }   ]);
                                    await app.batchPlay([      { "_obj": "gaussianBlur", "radius": { "_unit": "pixelsUnit", "_value": parseFloat(e.value)/10 } }  ]);
                                // rotate 90 deg counter clockwise
                            //    let anchorPos = require('photoshop').constants.AnchorPosition
                            //    await app.activeDocument.layers[0].rotate(e.value,)
                        },{"interactive": true});
                    } catch (error) { }
            });

            // setTimeout(() => {  slider.value = 10; }, 90); 
            ///////// SLIDER CONFIGS FINAL-----------------------------------------


            //////// SINTEMA DE NEVEGAÇÃO POR ABAS
            const tabs = document.querySelector('#tab-groupA');
            setTimeout(() => { 
                tabs.addEventListener('tab-change', (event) => {
                    const { index, text } = event.detail;
                     /////// OBTEM O INDICE E O TITULO DA ABA ATIVA
                    console.log(`Aba ${index}\nAtiva: ${text}`);
                });
                 /////// SELECIONA A ABRA ATIVA
                tabs.activateTab(0)
            }, 90); 
            ////////::::::::::::::::::::::::::::

            
            /////// ITEMS DA  DINAMICOS
            const combobox = document.querySelector('#listaCB');
            const array = ["João", "Maria", "Pedro", "Catia", "Raimundo", "Mauricio"];

            const arrayOBJ = [
                { nome: 'João f',  idade: 25, sexo: "Masculino" , icon:"icon035", color: "#000000" },
                { nome: 'Maria', idade: 30, sexo: "Feminino",   icon:"icon082", color:  "#c23434" },
                { nome: 'Pedro', idade: 28, sexo: "Masculino", icon:"icon037", color:  "#000000" },
                { nome: 'Jacira', idade: 22, sexo: "Feminina", icon:"icon038", color:  "#000000" },
                { nome: 'Marta', idade: 25, sexo: "Feminina", icon:"icon039", color:  "#3470c2" },
            ];
                        
            /////////////////////////////////////////////////////////
                /////// COMBOBOX METODOS  TESTES INICIO
                ///////// ESCUTAR COMBOBOX
                function comboBoxouvirEscultaLista_itens_html() {
                    combobox.addEventListener('optionSelected', (e) => {
                    alert(`Opção selecionada:, ${e.detail.selectedIndex},  ${e.detail.value}`);
                });
            };

                /////// LIDAR COM ARRAY DE STRING
            function comboBoxcarregarDimnamicoArray(){
                setTimeout(() => { 
                    array.forEach(item => { combobox.addOption(item); });
                    combobox.selectedIndex = 1; // Seleciona a opção com índice 1 (Maria)
                    combobox.updateSelected();
                }, 90); 
                combobox.addEventListener('optionSelected', (e) => {
                    alert(`Opção selecionada:, ${e.detail.selectedIndex},  ${e.detail.value}`);
                });
            };
            
            /////// LIDAR COM ARRAY DE OBJETOS
            function comboBoxcarregarDimnamicoArrayOBJ(){
                setTimeout(() => { 
                    arrayOBJ.forEach(item => {
                    combobox.addOption(item.nome, item); // Passando o item.nome para exibição e o objeto completo como segundo parâmetro
                    });
                    combobox.selectedIndex = 4;
                }, 90); 
                combobox.addEventListener('optionSelected', (event) => {
                    console.log('Evento disparado:', event.detail); // Para debug
                    const { value, originalObject } = event.detail;
                    if (originalObject) {
                    alert(`Nome: ${value},\nIdade: ${originalObject.idade},\nSexo: ${originalObject.sexo},\nIcone: ${originalObject.icon},\nColor: ${originalObject.color}`);
                    }
                });
            };


        /////////////////////////////////////////////////////////
        /////// DROPDOWLISTE METODOS  TESTES INICIO
            const dropdown = document.querySelector('#dropdownlist');

        ///////// CARREGAMENTO DE ARRAY SIMPLES
        function dropDowcarregarDimnamicoArray(){
            setTimeout(() => {
                array.forEach(item => {dropdown.addOption(item); });
                dropdown.selectedIndex = 3;
                dropdown.addEventListener('optionSelected', (event) => {
                    const { value, originalObject, selectedIndex } = event.detail;
                    alert(`Nome: ${value}\n${selectedIndex}\n${originalObject}`);
                });
            }, 90);
        };


            ///////// EVENTO CARREGAMENTO POR TAG ITENS
            function dropDowouvirEscultaLista_itens_html() {
            const dropdown = document.querySelector('#dropdownlist');
                //////// SELECIONAR O ITEM PROGRAMATICAMENTE
            setTimeout(() => {dropdown.selectedIndex = 4; }, 90);  //// OU dropdown.setAttribute('data-selected-index', '3');
            //////// OUVIR OS EVNETOS DOS ITENS E SUBITENS
            dropdown.addEventListener('optionSelected', (event) => {
                const { value, subitem, subitemIndex, } = event.detail;
                if (subitem) {
                    alert(`Selecionado: ${value} - Subitem: ${subitem} (Índice do Subitem: ${subitemIndex})`);
                } else {
                    alert(`Selecionado: ${value}`);
                    console.log(document.querySelectorAll('ps-item[subitem]'));
                }
            });
        }

        ///////// CARREGAMENTO DE ARRAY OBJETOS
        function dropDowcarregarDimnamicoArrayOBJ(){
            setTimeout(() => {
                arrayOBJ.forEach(item => { dropdown.addOption(item.nome, item); });
                dropdown.selectedIndex = 1;
                dropdown.addDividerAt(2)
            }, 90);
                
            dropdown.addEventListener('optionSelected', (event) => {
                const { value, originalObject } = event.detail;
                   if (originalObject) {
                    alert(`Nome: ${value},\nIdade: ${originalObject.idade},\nSexo: ${originalObject.sexo},\nIcone: ${originalObject.icon},\nColor: ${originalObject.color}`);
                }
            });
        }
        
        
        /////// COMBOBOX METODOS  TESTES FINAL
        let carrregaCombobox= 3;
        switch (carrregaCombobox) {
            case 1: comboBoxcarregarDimnamicoArray();  break;s
            case 2: comboBoxouvirEscultaLista_itens_html();  break;
            case 3: comboBoxcarregarDimnamicoArrayOBJ();  break;
            default:  break;
        }

        /////// DROPDOWLISTE METODOS  TESTES FINAL
        let carrregaDropdow= 1;
        switch (carrregaDropdow) {
            case 1: dropDowcarregarDimnamicoArray();  break;s
            case 2: dropDowouvirEscultaLista_itens_html();  break;
            case 3: dropDowcarregarDimnamicoArrayOBJ();  break;
            default:  break;
        }

        
        ////////// TESTANDO RADIOS MODELO 2
        /////// RADIO BOTÕES METODOS  TESTES FINAL
        const radioGroup = document.querySelector("#gpradios");
            function radiosEnventosGrupo(){
            setTimeout(() => {
                console.log("Habilitando o segundo item...");
                radioGroup.disable(1)
                radioGroup.checked(2); // Selecionar o terceiro item
                    radioGroup.addEventListener("change", (evt) => {
                alert(`Selected item: ${evt.detail.value},\nIndex item: ${evt.detail.index},\nData item: ${evt.detail.data}`);
                });

            }, 90);
        };

        
        function radiosEnventosGrupos(){
            setTimeout(() => {
                try {
                    const radioItems = document.querySelectorAll(".radio-item");
                    radioItems[0].setAttribute("checked", "");  /////// ITEM  0 CHECADO
                    radioItems[1].setAttribute("disabled", ""); /////// ITEM  1 DESABILITADO
                    radioItems.forEach((radio, index) => {
                        /////// ITEM MARCADO COMO CHECADO
                        //radio.setAttribute("disabled", ""); //////desbilita todos os botões
                        radio.addEventListener("click", () => {
                            ///// Desmarca todos os itens
                            radioItems.forEach((item) => item.removeAttribute("checked"));
                            // Marca apenas o item atual
                            radio.setAttribute("checked", "");
                            ///// Obter as propriedades
                            let value = radio.textContent.trim();
                            let index = Array.from(radioItems).indexOf(radio);
                            let data= radio.getAttribute("data") || null;

                            alert(`Selected item: ${value},\nIndex item: ${index},\nData item: ${data}`);
                        });
                    });
                    
                } catch (error) { alert(error) }
            }, 90);
        };

        /////// RADIO BOTÕES METODOS  TESTES FINAL
        let radiosGrupo= 1;
        switch (radiosGrupo) {
            case 1: radiosEnventosGrupo();  break;s
            case 2: radiosEnventosGrupos(); break;
            default:  break;
        }
    

        ////////// TESTANDO SITEMA DE BUSCA
        /////// RADIO BOTÕES METODOS  TESTES FINAL

        const items = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10" ];
        const busca = document.querySelector('#buscar');

        // Evento para capturar enquanto digita
        busca.addEventListener('change', (e) => {
            const searchTerm = e.detail.searchTerm.toLowerCase();
            const resultados = items.filter(item => item.toLowerCase().includes(searchTerm));
            //   console.log('Resultados da busca enquanto digita:', resultados);

            ///////RESULTADO DA BUSCA:
            document.querySelector('#buscaResult').textContent=`${resultados}`;
            
        });

        // busca.addEventListener('ms-busca-input', (e) => {
        //   console.log('Valor enquanto digita:', e.detail.searchTerm);
        // });



                   
                    



});








  
})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map