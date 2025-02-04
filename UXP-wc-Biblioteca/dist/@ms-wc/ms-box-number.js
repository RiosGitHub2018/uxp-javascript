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