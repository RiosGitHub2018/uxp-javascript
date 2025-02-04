class NumberField extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        
        // Elementos principais
        const container = document.createElement('div');
        const label = document.createElement('span');
        const inputWrapper = document.createElement('div');
        this.input = document.createElement('input');
        const arrowsContainer = document.createElement('div');
        const incrementButton = document.createElement('div');
        const decrementButton = document.createElement('div');

        // Definindo propriedades iniciais
        const value = parseFloat(this.getAttribute('value')) || 0;
        const disabled = this.hasAttribute('disabled');
        const txtLabel = this.getAttribute('txtLabel') || '';

        // Estilizando o componente
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                vertical-align: middle;
                box-sizing: border-box;
                position: relative;
                width: 100%;
            }
            div.container {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                min-height: 25px;
                width: 100%;
            }
            span {
                color: #d5d2d2;
                font-family: Arial, sans-serif;
                font-size: 12px;
                margin-right: 5px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            div.input-wrapper {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: 100%;
            }
            input {
                padding: 4px;
                margin: 0;
                height: 100%;
                text-align: center;
                background-color: #454545;
                color: #fff;
            }
            input:disabled {
                background-color: #535353;
                color: #808080;
            }
            div.arrows-container {
                display: inline-flex;
                flex-direction: column;
                width: 17px;
                text-align: center;
                color: #eeebeb;
                font-size: 8px;
                font-family: UXPSfxIcon;
                height: 100%;
            }
            div.arrow-button {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 50%;
                border: 1px solid #706f6f;
                box-sizing: border-box;
                background-color: #535353;
                user-select: none;
            }
            div.arrow-button:first-child {
                border-bottom: none;
            }
            div.arrow-button:hover {
                background-color: #494848;
            }
            :host([disabled]) input,
            :host([disabled]) div.arrow-button {
                background-color: #535353;
                color: #808080;
                cursor: default;
            }
            :host([disabled]) div.arrow-button:hover {
                background-color: #2d2d2d;
            }
        `;

        // Aplicar estilos inline do elemento host ao input
        if (this.style.width) {
            this.input.style.width = this.style.width;
        }
        if (this.style.height) {
            const inputHeight = this.style.height;
            this.input.style.height = inputHeight;
            arrowsContainer.style.height = inputHeight;
            container.style.height = inputHeight;
        }

        // Configurando o label
        label.textContent = txtLabel;

        // Configurando o input
        this.input.type = 'number';
        this.input.value = value;
        this.input.disabled = disabled;

        // Observar mudanças no disabled do fieldset pai
        this.updateDisabledState();

        // Eventos do input
        this.input.addEventListener('input', () => {
            this.dispatchEvent(new Event('change'));
        });

        // Configurando os botões
        incrementButton.classList.add('arrow-button');
        incrementButton.textContent = '<';
        incrementButton.setAttribute('role', 'button');
        incrementButton.setAttribute('aria-label', 'Incrementar');

        decrementButton.classList.add('arrow-button');
        decrementButton.textContent = '>';
        decrementButton.setAttribute('role', 'button');
        decrementButton.setAttribute('aria-label', 'Decrementar');

        incrementButton.addEventListener('click', () => {
            if (!this.isDisabled()) {
                this.input.value = Math.max(0, parseInt(this.input.value) + 1);
                this.dispatchEvent(new Event('change'));
            }
        });

        decrementButton.addEventListener('click', () => {
            if (!this.isDisabled()) {
                this.input.value = Math.max(0, parseInt(this.input.value) - 1);
                this.dispatchEvent(new Event('change'));
            }
        });

        // Montando o componente
        arrowsContainer.classList.add('arrows-container');
        arrowsContainer.appendChild(incrementButton);
        arrowsContainer.appendChild(decrementButton);
        
        inputWrapper.classList.add('input-wrapper');
        inputWrapper.appendChild(this.input);
        inputWrapper.appendChild(arrowsContainer);

        container.classList.add('container');
        container.appendChild(label);
        container.appendChild(inputWrapper);

        shadow.appendChild(style);
        shadow.appendChild(container);

        // Observador para mudanças no style
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (this.style.width) {
                        this.input.style.width = this.style.width;
                    }
                    if (this.style.height) {
                        const inputHeight = this.style.height;
                        this.input.style.height = inputHeight;
                        arrowsContainer.style.height = inputHeight;
                        container.style.height = inputHeight;
                    }
                }
            });
        });

        observer.observe(this, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    connectedCallback() {
        this.updateDisabledState();
    }

    // Verifica o estado disabled do fieldset pai e do próprio componente
    isDisabled() {
        const fieldset = this.closest('field-set');
        return this.hasAttribute('disabled') || (fieldset && fieldset.hasAttribute('disabled'));
    }

    // Atualiza o estado disabled baseado no fieldset pai
    updateDisabledState() {
        const isDisabled = this.isDisabled();
        this.input.disabled = isDisabled;
        if (isDisabled) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    static get observedAttributes() {
        return ['disabled'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'disabled') {
            this.updateDisabledState();
        }
    }

    // Getters e setters para o valor
    get value() {
        return parseFloat(this.input.value);
    }

    set value(newValue) {
        this.input.value = newValue;
        this.dispatchEvent(new Event('change'));
    }

    // Métodos de habilitar/desabilitar
    disable() {
        this.setAttribute('disabled', '');
    }

    enable() {
        this.removeAttribute('disabled');
    }
}

// Registrando o componente
customElements.define('number-field', NumberField);