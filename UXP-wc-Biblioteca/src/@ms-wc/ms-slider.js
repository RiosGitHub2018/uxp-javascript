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