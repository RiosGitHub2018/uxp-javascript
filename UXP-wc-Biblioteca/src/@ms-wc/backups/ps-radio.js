class PsRadio extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Template string para estrutura do componente
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: inline-flex;
                    align-items: center;
                    height: 23px;
                }

                sp-radio {
                    display: inline-flex;
                    align-items: center;
                    margin-right: 5px;
                }

                label {
                    color: var(--uxp-host-text-color); 
                    font-family: 'Arial', sans-serif; 
                    font-size: 0.9em; 
                    transform: translate(-5px, 2px);
                }

                :host([disabled]) {
                    pointer-events: none; /* Previne clicks no estado disabled */
                }

                :host([disabled]) label {
                    color: #8f8c8c;
                }
            </style>
            <sp-radio size="s" class="radio-element"><label>${this.innerText || "Opção"}</label></sp-radio>
            
        `;

        // Adicionar template ao shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Referências aos elementos
        this.radio = this.shadowRoot.querySelector('sp-radio');
        this.label = this.shadowRoot.querySelector('label');

        // Configuração inicial de atributos
        if (this.hasAttribute('data')) {
            this.radio.setAttribute('data', this.getAttribute('data'));
        }

        // Evento de clique com checagem de disabled
        this.radio.addEventListener('click', (e) => {
            if (this.disabled) {
                e.stopPropagation(); // Bloqueia o clique se estiver disabled
                console.log('Elemento está desabilitado.');
                return;
            }

            // Alternar checked e disparar evento se habilitado
            this.checked = !this.checked;
            this.dispatchEvent(new CustomEvent('change', {
                detail: { checked: this.checked }
            }));
        });
    }

    // Atributos observáveis
    static get observedAttributes() {
        return ['checked', 'disabled', 'data'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'checked') {
            if (newValue !== null) { this.radio.setAttribute('checked', '');} 
            else { this.radio.removeAttribute('checked');  }
        } 
        else if (name === 'disabled') {
            if (newValue !== null) { this.radio.setAttribute('disabled', '');} 
            else { this.radio.removeAttribute('disabled'); }
        } 
        else if (name === 'data') {
            this.radio.setAttribute('data', newValue);
        }
    }

    get checked() {
        return this.hasAttribute('checked');
    }
    set checked(value) {
        if (value) { this.setAttribute('checked', '');} 
        else { this.removeAttribute('checked'); }
    }

    get disabled() { return this.hasAttribute('disabled'); }
    set disabled(value) {
        if (value) { this.setAttribute('disabled', '');} 
        else { this.removeAttribute('disabled');}
    }
}

// Definir o custom element
customElements.define('ps-radio', PsRadio);



////// DOCUMENTAÇÃO DO COMPONENTE
////// MANIPUÇÃO E ESCUTAS DO COMPONENTE
/*
    HTML
    <ps-radio id="rd1">Radio 1</ps-radio>
    <ps-radio id="rd1" disbled>Radio 1</ps-radio>
    <ps-radio id="rd1"  data="valor1" checked>Radio 1</ps-radio>

    main.js
    Manipular o estado checked / disabled
    document.querySelector('#rd1').checked = true; // Marca o primeiro radio
    document.querySelector('#rd2').disabled = true; // Desabilita o segundo radio

    // Escutar mudanças
    document.querySelector('#rd1').addEventListener('change', (e) => {
       alert('Novo estado de rd1: ' + e.detail.checked);
       alert(`Data: ${e.target.getAttribute('data')}`);; ////// VAOR DO ATRIBUTO DATA
    });

    /////// PERCORRER TODOS OS ELEMENTOS
    document.addEventListener('DOMContentLoaded', () => {
        try {
            const radios = document.getElementsByClassName("btn");
            Array.from(radios).forEach((radio, index) => {
                    setTimeout(() => { radio.disabled = true;}, 90); //// DESABILITAR TODOS
                    radio.addEventListener('change', (event) => {
                        alert(`Data: ${event.target.getAttribute('data')}\nTexto: ${event.target.textContent}\nIndex: ${index}`)
                    })
            });
        } catch (err) {}
    });
    */