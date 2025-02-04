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
