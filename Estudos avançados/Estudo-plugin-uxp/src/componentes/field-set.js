class FXFieldset extends HTMLElement {
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

        fieldsetDiv.style.backgroundColor = this.getAttribute('bcground') || '#535353';

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
                border: 1px solid #424242;
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
                color: #eee9e9;
                font-size: 12px;
                position: absolute;
                top: -8px;
                left: 10px;
                padding: 0 5px;
                background: linear-gradient(0deg, rgba(83,83,83,0) 55%, rgba(83,83,83,1) 55%, rgba(83,83,83,1) 100%);
                z-index: 1;
            }
            .conteudo-container {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content:center;
                position: relative;
                box-sizing: border-box;
                gap: 10px;
            }
            ::slotted(*) {
                width: 100%;
                margin: 0 !important;
            }
            :host([disabled]) ::slotted(input),
            :host([disabled]) ::slotted(select),
            :host([disabled]) ::slotted(textarea) {
                background-color: #3a3a3a !important;
                color: #a0a0a0 !important;
                border-color: #424242 !important;
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
        this.legendLabel.style.color = isDisabled ? '#a0a0a0' : '#eee9e9';

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
            element.style.opacity = isDisabled ? '0.7' : '';
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
            case 'input':
            case 'select':
            case 'textarea':
                element.disabled = isDisabled;
                if (isDisabled) {
                    element.style.backgroundColor = '#3a3a3a';
                    element.style.color = '#a0a0a0';
                    element.style.borderColor = '#424242';
                    element.style.opacity = '0.7';
                } else {
                    element.style.backgroundColor = '';
                    element.style.color = '#fff';
                    element.style.borderColor = '';
                    element.style.opacity = '';
                }
                break;
               
            case 'button': 
            case 'span':    
            case 'label':
            case 'sp-label':
                if (isDisabled) {
                    element.style.color = '#a0a0a0';
                    element.style.opacity = '0.7';
                } else {
                    element.style.color = '';
                    element.style.opacity = '';
                }
                break;

            case 'div':
                if (isDisabled) {
                    element.style.opacity = '0.7';
                } else {
                    element.style.opacity = '';
                }
                break;
        }

        element.style.pointerEvents = isDisabled ? 'none' : '';
    }

    disable() {
        this.setAttribute('disabled', '');
    }

    enable() {
        this.removeAttribute('disabled');
    }

    setLegend(newLegend) {
        this.setAttribute('legend', newLegend);
    }
}

customElements.define('field-set', FXFieldset);