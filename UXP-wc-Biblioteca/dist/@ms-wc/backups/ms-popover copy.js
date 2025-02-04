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
        
        // Remove existing arrow if any
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

    attributeChangedCallback(name, oldValue, newValue) {
        if (['seta', 'position'].includes(name)) {
            this.updateArrow();
        }
    }

    static get observedAttributes() {
        return ['seta', 'position'];
    }

    // Rest of the existing methods remain the same...
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
            e.stopPropagation();
            this.toggle(trigger);
        };
        trigger.addEventListener('click', this.boundClickHandler);

        document.removeEventListener('click', this.handleClickOutside);
        document.addEventListener('click', this.handleClickOutside);
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
    
    hide() {
        this.removeAttribute('open');
    }

    disconnectedCallback() {
        document.removeEventListener('click', this.handleClickOutside);
        const trigger = document.getElementById(this.getAttribute('trigger-for'));
        if (trigger && this.boundClickHandler) {
            trigger.removeEventListener('click', this.boundClickHandler);
        }
    }
}

customElements.define('ms-popover', MSPopover);



/*
<button id="meuBotao">Abrir Popover</button>

<ms-popover trigger-for="meuBotao">
    <div>
        <h3>Título do Popover</h3>
        <p>Algum conteúdo aqui...</p>
        
        <!-- Botão que fecha o popover -->
        <button data-popover-close>Fechar</button>
        
        <!-- Link que fecha o popover -->
        <a href="#" data-popover-close>Cancelar</a>
        
        <!-- Qualquer elemento que deve fechar o popover -->
        <div data-popover-close>Clique aqui para fechar</div>
    </div>
</ms-popover>

*/