class MSColorSeletor extends HTMLElement {
  static get observedAttributes() {
    return ['size', 'initial-color', 'codigo-hex', 'disabled', 'position'];
  }

  constructor() {
    super();
    this.baseSvSize = 150;
    this.baseHueWidth = 20;
    this.hue = 0;
    this.saturation = 100;
    this.value = 100;
    this.isOpen = false;
    
    this.innerHTML = `
      <style>
        :host {
          position: relative;
          display: inline-block;
        }
        .color-picker {
          display: none;
          flex-direction: column;
          gap: 5px;
          position: fixed;
          background: var(--psfx-ui-bg-color);
          padding: 10px;
          border: 1px solid var(--psfx-ui-borda-forte-color);
          border-radius: 4px;
          box-shadow: -1px -2px 29px 8px rgba(0,0,0,0.22);
          z-index: 1000;
          width: fit-content;
          align-items: center;
          text-align: center;
        }
        .canvas-container {
          display: flex;
          gap: 5px;
        }
        canvas {
          cursor: crosshair;
          display: block;
        }
        #sv-canvas {
          box-shadow: var(--psfx-box-shadow);
        }
        #hue-canvas {
          box-shadow: var(--psfx-box-shadow);
          margin-left: 7px;
        }
        .color-display {
          display: flex;
          align-items: center;
          gap: 5px;
          height: 22px;
          position: relative;
        }
        #color-box {
          width: 30px;
          height: 20px;
          border: 1px solid var(--psfx-ui-borda-forte-color);
          box-shadow: var(--psfx-box-shadow);
          cursor: pointer;
          flex-shrink: 0;
        }
        #color-box.disabled {
          background-color: var(--psfx-ui-bg-color) !important;
          border-color: var(--psfx-ui-borda-fraca-color);
        }
        #color-hex {
          font-family: Arial, sans-serif;
          font-size: 11px;
          color: var(--psfx-texto-color);
          line-height: 20px;
          width: 70px;
          margin-left: 5px;
        }
        #color-hex.disabled {
          color: var(--psfx-texto-disabled-color);
          pointer-events: none;
        }
        [disabled="true"] {
          color: var(--psfx-texto-disbled-color) !important;
          pointer-events: none !important;
        }

        span {
            display: flex;
            align-items: center;
            margin: 5px;
        }

      </style>
      <div  class="color-picker">
        <div class="canvas-container">
          <canvas id="sv-canvas"></canvas>
          <canvas id="hue-canvas"></canvas>
        </div>
        <span><label style="font-size: 10px;" >Color:</label> <label id="color-hex2" style="width: 40px; margin-left: 3px; font-size: 10px;">#FFFFFF</label></span>
        <ms-buttom id="btn-Sair" texto="Fechar"   size="-18-15-2-px" style="width: 100%; height: 20px;" ></ms-buttom>
      </div>
      <div class="color-display">
        <div id="color-box"></div>
        <label id="color-hex">#FFFFFF</label>
      </div>
    `;
  }

  hexToHsv(hex) {
    hex = hex.replace(/^#/, '');
    
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    
    let h, s, v;
    v = max / 255;
    if (d === 0) { h = 0; s = 0; } else { s = d / max;
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    
    return {
      h: Math.round(h),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  }

  updateDimensions() {
    const size = this.getAttribute('size') || '100';
    const sizePercent = parseInt(size) / 100;
    
    const svCanvas = this.querySelector("#sv-canvas");
    const hueCanvas = this.querySelector("#hue-canvas");
    
    const newSvSize = Math.round(this.baseSvSize * sizePercent);
    const newHueWidth = Math.round(this.baseHueWidth * sizePercent);
    
    svCanvas.width = newSvSize;
    svCanvas.height = newSvSize;
    svCanvas.style.width = `${newSvSize}px`;
    svCanvas.style.height = `${newSvSize}px`;
    
    hueCanvas.width = newHueWidth;
    hueCanvas.height = newSvSize;
    hueCanvas.style.width = `${newHueWidth}px`;
    hueCanvas.style.height = `${newSvSize}px`;
  }

  disable() {
    this.setAttribute('disabled', '');
  }

  enable() {
    this.removeAttribute('disabled');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'size' && oldValue !== newValue) {
      this.updateDimensions();
      const colorPicker = this.querySelector(".color-picker");
      if (colorPicker.style.display === "flex") {
        this.drawHue();
        this.drawSV(this.hue);
      }
    }
    if (name === 'initial-color' && oldValue !== newValue) {
      const hsv = this.hexToHsv(newValue);
      this.hue = hsv.h;
      this.saturation = hsv.s;
      this.value = hsv.v;
      
      const colorBox = this.querySelector("#color-box");
      const colorHexLabel = this.querySelector("#color-hex");
      const colorHexLabel2 = this.querySelector("#color-hex2");
      colorHexLabel2.style.color=newValue;

      if (colorBox && colorHexLabel) {
        colorBox.style.backgroundColor = newValue;
        if (this.getAttribute('codigo-hex') === 'true') { 
          colorHexLabel.textContent = newValue;
          colorHexLabel2.textContent = newValue;
          colorHexLabel.style.width ="70px";  
          colorHexLabel.style.marginLeft = '5px' 
        } 
        else {
          colorHexLabel.textContent = ""
           colorHexLabel.textContent = '';  
           colorHexLabel.style.width ="0px";  
           colorHexLabel.style.marginLeft = '0px' 
        }
      }
      
      const colorPicker = this.querySelector(".color-picker");
      if (colorPicker.style.display === "flex") {
        this.drawHue();
        this.drawSV(this.hue);
      }
    }
    if (name === 'codigo-hex' && oldValue !== newValue) {
      this.updateHexVisibility();
    }
    if (name === 'disabled' && oldValue !== newValue) {
      const colorBox = this.querySelector("#color-box");
      const colorHexLabel = this.querySelector("#color-hex");
      
      if (newValue !== null) {
        colorBox.classList.add('disabled');
        colorBox.setAttribute('disabled', 'true');
        colorHexLabel.classList.add('disabled');
        colorHexLabel.setAttribute('disabled', 'true');
      } else {
        colorBox.classList.remove('disabled');
        colorBox.removeAttribute('disabled');
        colorHexLabel.classList.remove('disabled');
        colorHexLabel.removeAttribute('disabled');
      }
    }
  }

  updateHexVisibility() {
    const colorBox = this.querySelector("#color-box");
    const colorHexLabel = this.querySelector("#color-hex");
    const showHex = this.getAttribute('codigo-hex') === 'true';

    if (colorBox && colorHexLabel) {
        if (showHex) {
            colorHexLabel.textContent = colorBox.style.backgroundColor;
            colorHexLabel.style.width = "70px";
            colorHexLabel.style.marginLeft = '5px';
        } else {
            colorHexLabel.textContent = '';
            colorHexLabel.style.width = "0px";
            colorHexLabel.style.marginLeft = '0px';
        }
    }
  }

  connectedCallback() {
    this.init();
    
    const initialColor = this.getAttribute('initial-color') || '#FFFFFF';
    if (initialColor) {
      const hsv = this.hexToHsv(initialColor);
      this.hue = hsv.h;
      this.saturation = hsv.s;
      this.value = hsv.v;
      
      const colorBox = this.querySelector("#color-box");
      const colorHexLabel = this.querySelector("#color-hex");
      colorBox.style.backgroundColor = initialColor;
      if (this.getAttribute('codigo-hex') === 'true') { 
        colorHexLabel.textContent = initialColor;
        colorHexLabel.style.width ="70px";  
        colorHexLabel.style.marginLeft = '5px' 
      } 
      else {
         colorHexLabel.textContent = '';  
         colorHexLabel.style.width ="0px";  
         colorHexLabel.style.marginLeft = '0px' 
      }
    }

    if (this.hasAttribute('disabled')) {
      const colorBox = this.querySelector("#color-box");
      const colorHexLabel = this.querySelector("#color-hex");
      colorBox.classList.add('disabled');
      colorBox.setAttribute('disabled', 'true');
      colorHexLabel.classList.add('disabled');
      colorHexLabel.setAttribute('disabled', 'true');
    }
  }

  init() {
    const svCanvas = this.querySelector("#sv-canvas");
    const hueCanvas = this.querySelector("#hue-canvas");
    const colorBox = this.querySelector("#color-box");
    const colorPicker = this.querySelector(".color-picker");
    const colorHexLabel = this.querySelector("#color-hex");

    this.updateDimensions();

    const svCtx = svCanvas.getContext("2d");
    const hueCtx = hueCanvas.getContext("2d");

    colorPicker.style.display = "none";

    const positionColorPicker = () => {
      const position = this.getAttribute('position') || 'default';
      const colorBoxRect = colorBox.getBoundingClientRect();
      const colorPickerRect = colorPicker.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Reset any previous positioning
      colorPicker.style.top = '';
      colorPicker.style.bottom = '';
      colorPicker.style.left = '';
      colorPicker.style.right = '';
      colorPicker.style.transform = '';

      let top, left;

      switch (position) {
        case 'top':
          top = colorBoxRect.top - colorPickerRect.height - 10;
          left = colorBoxRect.left + (colorBoxRect.width / 2) - (colorPickerRect.width / 2);
          break;
        case 'bottom':
          top = colorBoxRect.bottom + 10;
          left = colorBoxRect.left + (colorBoxRect.width / 2) - (colorPickerRect.width / 2);
          break;
        case 'left':
          top = colorBoxRect.top + (colorBoxRect.height / 2) - (colorPickerRect.height / 2);
          left = colorBoxRect.left - colorPickerRect.width - 10;
          break;
        case 'right':
          top = colorBoxRect.top + (colorBoxRect.height / 2) - (colorPickerRect.height / 2);
          left = colorBoxRect.right + 10;
          break;
        case 'center':
          top = colorBoxRect.top + (colorBoxRect.height / 2) - (colorPickerRect.height / 2);
          left = colorBoxRect.left + (colorBoxRect.width / 2) - (colorPickerRect.width / 2);
          break;
        default:
          // Default positioning (relative to parent)
          colorPicker.style.position = 'absolute';
          colorPicker.style.left = '50%';
          colorPicker.style.transform = 'translateX(-50%)';
          
          const spaceAbove = colorBoxRect.top;
          if (spaceAbove >= colorPickerRect.height + 10) {
            colorPicker.style.bottom = '100%';
            colorPicker.style.top = 'auto';
          } else {
            colorPicker.style.top = '100%';
            colorPicker.style.bottom = 'auto';
          }
          return;
      }

      // Adjust position to prevent cutting off
      if (top < 0) top = 10;
      if (top + colorPickerRect.height > viewportHeight) {
        top = viewportHeight - colorPickerRect.height - 10;
      }
      if (left < 0) left = 10;
      if (left + colorPickerRect.width > viewportWidth) {
        left = viewportWidth - colorPickerRect.width - 10;
      }

      colorPicker.style.position = 'fixed';
      colorPicker.style.top = `${top}px`;
      colorPicker.style.left = `${left}px`;
    };

    colorBox.addEventListener("click", (event) => {
      if (this.hasAttribute('disabled')) {
        return;
      }
      
      event.stopPropagation();
      
      // Toggle functionality
      if (this.isOpen) {
        colorPicker.style.display = "none";
        this.isOpen = false;
        return;
      }
      
      this.isOpen = true;
      colorPicker.style.display = "flex";
      colorPicker.style.visibility = "hidden";
      
      setTimeout(() => {
        positionColorPicker();
        this.drawHue();
        this.drawSV(this.hue);
        colorPicker.style.visibility = "visible";
      }, 90);
    });

    document.addEventListener("click", (event) => {
      if (!this.contains(event.target)) {
        colorPicker.style.display = "none";
        this.isOpen = false;
      }
    });

    const  btnSair = this.querySelector("#btn-Sair");
    btnSair.addEventListener("click", () => {
        // Toggle functionality
        if (this.isOpen) {
          colorPicker.style.display = "none";
          this.isOpen = false;
          return;
        }
    });

    window.addEventListener('resize', () => {
      if (this.isOpen) {
        positionColorPicker();
      }
    });

    this.drawHue = () => {
      const gradient = hueCtx.createLinearGradient(0, 0, 0, hueCanvas.height);
      for (let i = 0; i <= 360; i++) {
        gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
      }
      hueCtx.fillStyle = gradient;
      hueCtx.fillRect(0, 0, hueCanvas.width, hueCanvas.height);
    };

    this.drawSV = (hue) => {
      svCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      svCtx.fillRect(0, 0, svCanvas.width, svCanvas.height);

      const whiteGradient = svCtx.createLinearGradient(0, 0, svCanvas.width, 0);
      whiteGradient.addColorStop(0, "rgba(255,255,255,1)");
      whiteGradient.addColorStop(1, "rgba(255,255,255,0)");
      svCtx.fillStyle = whiteGradient;
      svCtx.fillRect(0, 0, svCanvas.width, svCanvas.height);

      const blackGradient = svCtx.createLinearGradient(0, 0, 0, svCanvas.height);
      blackGradient.addColorStop(0, "rgba(0,0,0,0)");
      blackGradient.addColorStop(1, "rgba(0,0,0,1)");
      svCtx.fillStyle = blackGradient;
      svCtx.fillRect(0, 0, svCanvas.width, svCanvas.height);
    };

    this.updateColor = () => {
      const colorHexLabel2 = this.querySelector("#color-hex2");
      const rgb = this.hsvToRgb(this.hue, this.saturation, this.value);
      const hex = this.rgbToHex(rgb[0], rgb[1], rgb[2]);
      colorBox.style.backgroundColor = hex;
      colorHexLabel.textContent = this.getAttribute('codigo-hex') === 'true' ? hex : '';
      colorHexLabel2.textContent = colorHexLabel.textContent;
      colorHexLabel2.style.color= colorHexLabel.textContent;
    
      const event = new CustomEvent('colorchange', {
        detail: {
          hex: hex,
          rgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          rgbValues: {
            r: rgb[0],
            g: rgb[1],
            b: rgb[2]
          }
        },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
    };

    hueCanvas.addEventListener("mousedown", (e) => {
      if (this.hasAttribute('disabled')) {
        return;
      }

      const pickHue = (e) => {
        const rect = hueCanvas.getBoundingClientRect();
        const y = e.clientY - rect.top;
        this.hue = Math.round((y / rect.height) * 360);
        this.hue = Math.max(0, Math.min(360, this.hue));
        this.drawSV(this.hue);
        this.updateColor();
      };

      pickHue(e);

      const onMouseMove = (e) => pickHue(e);
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    svCanvas.addEventListener("mousedown", (e) => {
      if (this.hasAttribute('disabled')) {
        return;
      }

      const pickSV = (e) => {
        const rect = svCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.saturation = Math.round((x / rect.width) * 100);
        this.value = Math.round((1 - y / rect.height) * 100);
        this.saturation = Math.max(0, Math.min(100, this.saturation));
        this.value = Math.max(0, Math.min(100, this.value));
        this.updateColor();
      };

      pickSV(e);

      const onMouseMove = (e) => pickSV(e);
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  hsvToRgb(h, s, v) {
    s /= 100;
    v /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => v * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [
      Math.round(255 * f(5)),
      Math.round(255 * f(3)),
      Math.round(255 * f(1)),
    ];
  }

  rgbToHex(r, g, b) {
    return ("#" + [r, g, b].map((x) => { 
        const hex = x.toString(16); 
        return hex.length === 1 ? "0" + hex : hex;
    }).join("").toUpperCase());
  }

}

customElements.define("ms-color-seletor", MSColorSeletor);