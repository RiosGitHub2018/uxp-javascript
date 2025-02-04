const fs = require('uxp').storage.localFileSystem;

class PsButtonIcon extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Getter for textContent
    Object.defineProperty(this, 'textContent', {
      get() {
        const btnText = this.shadowRoot?.querySelector('#textoBtn');
        return btnText ? btnText.textContent : '';
      },
      set(value) {
        this.setAttribute('texto', value);
      }
    });
  }

  async connectedCallback() {  
    await this.loadAndRenderSVG(); 
  }

  async loadAndRenderSVG() {
      try {
          const iconName = this.getAttribute('icon') || "";
          const iconColor = this.getAttribute('color') || '#e5e5e5';
          const hoverColor = this.getAttribute('hover-color') || '#000000';
          const iconBaseSize = this.getAttribute('size') || '90-25-20-5-px';
          const buttonText = this.getAttribute('texto') || '';

          const [width, height, iconSize, radius, unit = 'px'] = iconBaseSize.split('-');
          const activeHeight = parseInt(height) - 1;

          let normalSvgUrl = '', hoverSvgUrl = '', disabledSvgUrl = '';
          if (iconName) {
              const pluginFolder = await fs.getPluginFolder();
              const svgFileName = `${iconName}.svg`;
              const entries = await pluginFolder.getEntries();
              const iconsFolder = entries.find(entry => entry.name === 'icons' && entry.isFolder);

              const iconEntries = await iconsFolder.getEntries();
              const iconFile = iconEntries.find(entry => entry.name === svgFileName);

              let svgText = await iconFile.read();
              
              const normalSvg = this.modifySvgColor(svgText, iconColor);
              const hoverSvg = this.modifySvgColor(svgText, hoverColor);
              const disabledSvg = this.modifySvgColor(svgText, "#8f8c8c");

              const normalSvgBase64 =  btoa(normalSvg);
              const hoverSvgBase64 = btoa(hoverSvg);
              const disabledSvgBase64 = btoa(disabledSvg);

              normalSvgUrl = `data:image/svg+xml;base64,${normalSvgBase64}`;
              hoverSvgUrl = `data:image/svg+xml;base64,${hoverSvgBase64}`;
              disabledSvgUrl = `data:image/svg+xml;base64,${disabledSvgBase64}`;
          }

          let content;
          if (iconName && buttonText) {
            content = `<span><div id="icons" class="bgicon"></div></span><div id="textoBtn" class="btn-text">${buttonText}</div>`;
          } else if (iconName) {
            content = `<div id="icons" class="bgicon"></div>`;
          } else {
            content = `<div id="textoBtn" class="btn-text">${buttonText}</div>`;
          }
              
          this.shadowRoot.innerHTML = `
          <style>
                .ps-btn-icon {
                    background: linear-gradient(to top, #e6e9f0 0%, #dadada 100%);
                    border: 1px solid #c4c1c1;
                    border-radius: ${radius}${unit};   
                    width: ${width}${unit};
                    height: ${height}${unit};
                    display: flex;
                    align-items: center;
                    justify-content: ${iconName && buttonText ? 'flex-start' : 'center'};
                }

                .ps-btn-icon:hover { background: #d4d6d6;  }

                .ps-btn-icon:active {
                    height: ${activeHeight}${unit};
                    background: #ece9e9;
                    transform: translate(0px, 1px);
                    border-top: 3px solid #c4c1c1;
                }

                .bgicon {
                    ${normalSvgUrl ? `
                      background: url('${hoverSvgUrl}') no-repeat center center;
                      background-size: contain;
                      width: ${iconSize}${unit};
                      height: ${iconSize}${unit};
                      margin: ${iconName && buttonText ? '5px' : '0'};
                    ` : `
                  `}
              }

                .ps-btn-icon:hover .bgicon {  background-image: url('${hoverSvgUrl}');  }
                .btn-text { 
                    font-family: 'Arial', sans-serif; 
                    font-size: 0.9em; 
                    color: #333;
                    margin: 0.5em 0; /* Ajuste conforme necessário */
                 }

                .desabilitar_bg {
                    pointer-events: none;
                    color: #a0a0a0 !important;
                    background-image: none !important;
                    background-color: var(--uxp-host-background-color);
                    border: 1px solid var(--uxp-host-border-color);
                }

                .desabilitar_icon {
                    background: url('${disabledSvgUrl}') no-repeat center center;
                    background-size: contain;
                    width: ${iconSize}${unit};
                    height: ${iconSize}${unit};
                }

                .desabilitar_txt{ color: #8f8c8c; }
                
                /* MODO ESCURO */
                @media (prefers-color-scheme: dark), (prefers-color-scheme: darkest) {
                  .ps-btn-icon {
                        background-image: linear-gradient(to bottom, #919191 1%, #919191 5%, #6f6f6f 5%, #676767 44%, #5d5d5d 100%);
                        border: 1px solid #232323;
                        box-shadow: 0px 1px 0px 1px rgb(95, 95, 95);
                        border-radius: ${radius}${unit};   
                        width: ${width}${unit};
                        height: ${height}${unit};
                        display: flex;
                        align-items: center;
                        justify-content: ${iconName && buttonText ? 'flex-start' : 'center'};
                    }

                    .ps-btn-icon:hover { background: #aca8a8; }

                    .ps-btn-icon:active {
                        height: ${activeHeight}${unit};
                        background: #aca8a8;
                        transform: translate(0px, 1px);
                        border-top: 3px solid #302f2f;
                    }

                    .bgicon {
                        ${normalSvgUrl ? `
                          background: url('${normalSvgUrl}') no-repeat center center;
                          background-size: contain;
                          width: ${iconSize}${unit};
                          height: ${iconSize}${unit};
                          margin: ${iconName && buttonText ? '5px' : '0'};
                        ` : `
                        `}
                    }

                    .ps-btn-icon:hover .bgicon {  background-image: url('${hoverSvgUrl}');  }
                    .btn-text { 
                      font-family: 'Arial', sans-serif; 
                      font-size: 0.9em; 
                      color: #e5e5e5;
                      margin: 0.5em 0; 
                    }
                    .ps-btn-icon:hover .btn-text { color: #000000; }

                    .desabilitar_bg {
                        pointer-events: none  !important;
                        color: #a0a0a0 !important;
                        background-image: none !important;
                        background-color: var(--uxp-host-background-color);
                        border: 1px solid var(--uxp-host-border-color);
                    }

                  .desabilitar_icon {
                        background: url('${disabledSvgUrl}') no-repeat center center;
                        background-size: contain;
                        width: ${iconSize}${unit};
                        height: ${iconSize}${unit};
                        pointer-events: none  !important;
                  }

                  .desabilitar_txt{ color: #8f8c8c; pointer-events: none  !important;}
                }

        </style>
            
            <div class="ps-btn-icon">${content}</div>
          `;

          // Handle the disabled state of the button
          if (this.hasAttribute('disabled')) {  this.disable();} else { this.enable(); }
        } catch (error) { console.error('Erro ao carregar SVG:', error); }
  }

  modifySvgColor(svgText, color) {
        const processColor = (text) => {
          text = text.replace(/<path([^>]*)>/g, (match, p1) => {
            if (!p1.includes('fill=')) { return `<path${p1} fill="${color}">`; }
            return match;
          });
          return text;
        };

        let modified = processColor(svgText);

        if (!modified.includes('style')) {
          modified = modified.replace(/<svg/, `<svg style="color: ${color};"`);
        }
        return modified;
  }

  disable() {
      try {
          const button = this.shadowRoot.querySelector('.ps-btn-icon');
          const icon = this.shadowRoot.querySelector('#icons');
          const btnText = this.shadowRoot.querySelector('#textoBtn');
          if (button) { button.classList.add('desabilitar_bg'); }
          if (icon) { icon.classList.add('desabilitar_icon'); }
          if (btnText) { btnText.classList.add('desabilitar_txt'); }
          this.setAttribute('disabled', '');
          if (button) {
            button.disabled = true; 
            btnText.disabled = true;
          }
      } catch (err) {}
  }

  enable() {
      try {
            const button = this.shadowRoot.querySelector('.ps-btn-icon');
            const icon = this.shadowRoot.querySelector('#icons');
            const btnText = this.shadowRoot.querySelector('#textoBtn');
            if (button) { button.classList.remove('desabilitar_bg'); }
            if (icon) { icon.classList.remove('desabilitar_icon'); }
            if (btnText) { btnText.classList.remove('desabilitar_txt');  }
            this.removeAttribute('disabled', "");
            if (button) { 
              button.disabled = false; 
              btnText.disabled = false;
            }
      } catch (err) {}
  }

  static get observedAttributes() {
    return ['disabled', 'color', 'hover-color', 'size', 'texto'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) { 
      if (name === 'texto') {
        const btnText = this.shadowRoot.querySelector('#textoBtn');
        if (btnText) {
          btnText.textContent = newValue;
        }
      } else {
        this.loadAndRenderSVG(); 
      }
    }
  }
}

customElements.define('ps-icon-button', PsButtonIcon);