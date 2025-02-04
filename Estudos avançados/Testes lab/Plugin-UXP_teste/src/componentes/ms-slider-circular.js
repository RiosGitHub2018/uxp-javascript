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
    
        setTimeout(() => {  this.rotateTo(this.angle); }, 90);

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