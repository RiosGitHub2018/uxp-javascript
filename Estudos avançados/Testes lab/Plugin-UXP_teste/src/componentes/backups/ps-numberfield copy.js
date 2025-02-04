class NumberField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const value = parseFloat(this.getAttribute('value')) || 0;
    const disabled = this.hasAttribute('disabled');
    const largura = this.getAttribute('size') || '50px';

    this.shadowRoot.innerHTML = `
    <style>
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      box-sizing: border-box;
      position: relative;
      width: 100%;
    }
    .container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      min-height: 25px;
      width: 100%;
      height: 25px;
    }
    .txtLabel {
      color: var(--uxp-host-text-color);
      font-family: 'Arial', sans-serif; 
      font-size: 12px;
      margin-right: 3px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .input-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    input {
      width: ${largura};
      height: 22px;
      padding: 4px;
      margin: 0;
      background-color: #fcfcfc;
    }
    input:disabled {
      background-color: var(--uxp-host-background-color);
      color: var(--uxp-host-text-color);
    }

    /* Tema escuro */
    @media (prefers-color-scheme: dark), (prefers-color-scheme: darkest) {
        input {
          background-color: #454545;
        }
    }

    .arrows-container {
      display: inline-flex;
      flex-direction: column;
      width: 17px;
    }
    .arrow-button {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 11px;
      border: 1px solid #cccccc;
      box-sizing: border-box;
      background-color: var(--uxp-host-background-color);
      user-select: none;
    }

    @media (prefers-color-scheme: dark), (prefers-color-scheme: darkest) {
      .arrow-button {
        border: 1px solid #666666;
      }
    }

    .arrow-button:first-child {
      border-bottom: none;
    }
    .arrow-button:hover {
      background-color: var(--uxp-host-widget-hover-background-color)
    }
    .setas {
      fill: var(--uxp-host-text-color);
      transition: fill 0.3s ease;
    }
    
    :host([disabled]) input, 
    :host([disabled]) .arrow-button {
      background-color: var(--uxp-host-background-color);
      color: #a0a0a0;
      cursor: default;
    }
    :host([disabled]) .arrow-button:hover {
      background-color: var(--uxp-host-background-color);
    }
    :host([disabled]) .setas {
      fill: #a0a0a0 !important;
    }
    :host([disabled]) .txtLabel {
      color: #a0a0a0;
    }
    </style>
    <div class="container">
      <div class="txtLabel"></div>
      <div class="input-wrapper">
        <input type="number" value="${value}" ?disabled="${disabled}">
        <div class="arrows-container">
          <div class="arrow-button" role="button" aria-label="Incrementar">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 10" style="width: 9px; transform: translateY(0px);">
              <path class="setas" d="M6.7,0.07c0.05-0.05,0.11-0.07,0.18-0.07s0.13,0.02,0.18,0.07l6.82,6.18c0.13,0.13,0.13,0.25,0.02,0.38l-0.85,0.92c-0.05,0.05-0.11,0.09-0.2,0.09c-0.05,0-0.13-0.02-0.18-0.07l-5.6-5.06c-0.05-0.05-0.11-0.07-0.18-0.07c-0.05,0-0.13,0.02-0.18,0.05l-5.39,7.04c-0.05,0.03-0.11,0.05-0.18,0.05c-0.09,0-0.15-0.03-0.2-0.09l-0.82-0.94c-0.13-0.13-0.11-0.25,0.02-0.38L6.7,0.07z"/>
            </svg>
          </div>
          <div class="arrow-button" role="button" aria-label="Decrementar">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768.777 10" style="width: 7px; transform: translateY(-2px);">
              <path class="setas" d="M368.777,417l-363-320c-7-7-8-14-1-21l45-52c3-3,7-5,11-5s7,1,10,4l297,262c4,3,7,4,10,4s6-1,10-4l309-281c3-3,6-4,10-4s8,2,11,5l47,51c5,7,6,16-1,21l-375,340c-3,3-6,4-10,4S371.777,420,368.777,417z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>`;

    this.input = this.shadowRoot.querySelector('input');
    this.incrementButton = this.shadowRoot.querySelector('.arrow-button:first-child');
    this.decrementButton = this.shadowRoot.querySelector('.arrow-button:last-child');
    
    this.setupEventListeners();
    this.updateLabel();
    this.updateDisabledState();
  }

  setupEventListeners() {
    this.input.addEventListener('input', () => {
      this.dispatchEvent(new Event('change'));
    });

    this.incrementButton.addEventListener('click', () => {
      if (!this.isDisabled()) {
        this.input.value = Math.max(0, parseInt(this.input.value) + 1);
        this.dispatchEvent(new Event('change'));
      }
    });

    this.decrementButton.addEventListener('click', () => {
      if (!this.isDisabled()) {
        this.input.value = Math.max(0, parseInt(this.input.value) - 1);
        this.dispatchEvent(new Event('change'));
      }
    });
  }

  updateLabel() {
    const labelElement = this.shadowRoot.querySelector('.txtLabel');
    const label = this.getAttribute('data-label') || this.getAttribute('txtlabel') || this.textContent.trim() || '';
    labelElement.textContent = label;
  }

  connectedCallback() {
    this.updateDisabledState();
    this.updateLabel();
  }

  static get observedAttributes() {
    return ['disabled', 'data-label', 'txtlabel'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      this.updateDisabledState();
    } else if (name === 'data-label' || name === 'txtlabel') {
      this.updateLabel();
    }
  }

  isDisabled() {
    const fieldset = this.closest('field-set');
    return this.hasAttribute('disabled') || (fieldset && fieldset.hasAttribute('disabled'));
  }

  updateDisabledState() {
    const isDisabled = this.isDisabled();
    this.input.disabled = isDisabled;
    if (isDisabled) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get value() {
    return parseFloat(this.input.value);
  }

  set value(newValue) {
    this.input.value = newValue;
    this.dispatchEvent(new Event('change'));
  }

  disable() {
    this.setAttribute('disabled', '');
  }

  enable() {
    this.removeAttribute('disabled');
  }
}

customElements.define('ps-numberfield', NumberField);


///// DOCUMENTAÇÃO DO COMPONENTE
////// MANIPUÇÃO E ESCUTAS DO COMPONENTE
/*
    HTM:
   <ps-numberfield id="teste_nf"  txtlabel="Largura:" value="10"></ps-numberfield>
   <ps-numberfield id="teste_nf" txtlabel="Largura:" value="10" disabled></ps-numberfield>

    main.js
    const numberField = document.querySelector('#teste_nf');
    numberField.addEventListener('change', () => {
        document.querySelector('#texto').textContent = `Ordenação: ${numberField.value}`;
    });
    setTimeout(() => { numberField.disable();}, 30); // Desabilita o fieldset
*/

