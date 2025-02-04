if (!customElements.get('ps-radio-group')) {
    class PsRadioGroup extends HTMLElement {
        static get observedAttributes() {
            return ['row'];
        }

        constructor() {
            super();
            this.attachShadow({ mode: 'open' });

            const style = document.createElement('style');
            style.textContent = `
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start; /* Alinha à esquerda por padrão */
                }

                ::slotted(ps-radio) {
                    display: flex;
                    align-items: center; /* Centraliza verticalmente o conteúdo dentro do rádio */
                }

                ::slotted(ps-radio[disabled]) {
                    opacity: 0.5;
                }
            `;

            this.slot = document.createElement('slot');
            this.shadowRoot.append(style, this.slot);
        }

        connectedCallback() {
            this.updateDirection();

            // Adiciona evento de clique nos rádios
            this.slot.addEventListener('slotchange', () => {
                this.slot.assignedElements().forEach(radio => {
                    radio.addEventListener('click', this.handleRadioClick.bind(this));
                });
            });
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'row') {
                this.updateDirection();
            }
        }

        updateDirection() {
            const direction = this.hasAttribute('row') ? 'row' : 'column';
            this.shadowRoot.querySelector('style').textContent = `
                :host {
                    display: flex;
                    flex-direction: ${direction};
                    align-items: ${direction === 'row' ? 'center' : 'flex-start'};
                }

                ::slotted(ps-radio) {
                    display: flex;
                    align-items: center; /* Centraliza verticalmente o conteúdo dentro do rádio */
                }

                ::slotted(ps-radio[disabled]) {
                    opacity: 0.5;
                }
            `;
        }

        handleRadioClick(event) {
            const selectedRadio = event.currentTarget;

            // Desmarca todos os rádios antes de marcar o atual
            this.slot.assignedElements().forEach(radio => {
                radio.checked = false;
            });

            // Marca o rádio clicado
            selectedRadio.checked = true;

            // Dispatch evento com detalhes do rádio selecionado
            this.dispatchEvent(new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: {
                    selected: selectedRadio.id,
                    value: selectedRadio.getAttribute('data'),
                    element: selectedRadio
                }
            }));
        }

        get selectedRadio() {
            return this.slot.assignedElements().find(radio => radio.checked);
        }

        get selectedValue() {
            const selected = this.selectedRadio;
            return selected ? selected.getAttribute('data') : null;
        }

        get disabled() {
            return this.hasAttribute('disabled');
        }

        set disabled(value) {
            if (value) {
                this.setAttribute('disabled', '');
                this.slot.assignedElements().forEach(radio => {
                    radio.disabled = true;
                });
            } else {
                this.removeAttribute('disabled');
                this.slot.assignedElements().forEach(radio => {
                    radio.disabled = false;
                });
            }
        }
    }

    customElements.define('ps-radio-group', PsRadioGroup);
}


////// DOCUMENTAÇÃO DO COMPONENTE
////// MANIPUÇÃO E ESCUTAS DO COMPONENTE
/*
    HTML
        <ps-radio-group column >
            <ps-radio class="btn" id="rd1" data="valor1" >Radio 1</ps-radio>
            <ps-radio class="btn" id="rd2" data="valor2">Radio 2</ps-radio>
            <ps-radio class="btn" id="rd3" data="valor3">Radio 3</ps-radio>
        </ps-radio-group>

    main.js
            //////// FUNÇÃO OBTER VALORES DO BOTÃO SELECIONADO
            document.addEventListener('DOMContentLoaded', () => {
            try {
                const radios = document.getElementsByClassName("btn");
                const radioBtn = Array.from(radios);
        
                for (let i = 0; i < radioBtn.length; i++) { 
                    radioBtn[i].addEventListener('change', (event) => {
                            alert(event.target.getAttribute('data'))
                            alert(event.target.textContent)
                            const index = radioBtn.indexOf(event.target);
                            alert(`Índice: ${index}`);
                    });
                }
            } catch (err) { alert(err); }
        });
    */


