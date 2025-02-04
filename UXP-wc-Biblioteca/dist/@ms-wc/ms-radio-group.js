class MsRadioGroup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: row; /* Por padrão, os botões serão alinhados horizontalmente */
          gap: 8px; /* Espaçamento entre os botões */
        }

        :host([column]) {
          flex-direction: column; /* Alinhamento vertical quando o atributo 'column' está presente */
        }
      </style>
      <slot ></slot>
    `;
  }

  connectedCallback() {
    this.updateRadios();
    this.addEventListener("click", this.onRadioClick.bind(this));
  }

  updateRadios() {
    const radios = Array.from(this.querySelectorAll("ms-radio"));
    radios.forEach((radio, index) => {
      radio.setAttribute("index", index);
      if (radio.hasAttribute("checked")) {
        this.selectRadio(radio);
      }
    });
  }

  onRadioClick(event) {
    const radio = event.target.closest("ms-radio");
    if (radio && !radio.hasAttribute("disabled")) {
      this.selectRadio(radio);
    }
  }

  selectRadio(selectedRadio) {
    const radios = Array.from(this.querySelectorAll("ms-radio"));
    radios.forEach((radio) => {
      if (radio === selectedRadio) {
        radio.setAttribute("checked", "");
        this.dispatchChangeEvent(radio);
      } else {
        radio.removeAttribute("checked");
      }
    });
  }

  dispatchChangeEvent(radio) {
    const detail = {
      // Modificação: Prioriza data-label, depois textContent
      value: radio.getAttribute('data-label') || radio.textContent.trim(),
      index: parseInt(radio.getAttribute("index")),
      data: radio.getAttribute("data") || null,
    };
    this.dispatchEvent(new CustomEvent("change", { detail }));
  }

  checked(index) {
    const radios = this.querySelectorAll("ms-radio");
    if (radios[index]) {
      this.selectRadio(radios[index]);
    }
  }

  enable(index) {
    const radio = this.querySelector(`ms-radio:nth-child(${index + 1})`);
    if (radio) {
      radio.removeAttribute("disabled");
    }
  }

  disable(index) {
    const radio = this.querySelector(`ms-radio:nth-child(${index + 1})`);
    if (radio) {
      radio.setAttribute("disabled", "");
    }
  }
}

class MsRadio extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 11px;
        }

        :host([disabled]) {
          color: #a0a0a0;
          pointer-events: none;
        }

        .circle {
          width: 13px;
          height: 13px;
          margin: 3px;
          border: 2px solid var(--psfx-ui-borda-radio-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--psfx-ui-bg-radio-color);
        }

        .circle:hover {
          border: 2px solid var(--psfx-ui-borda-radio-hover-color);
        }

        :host([disabled]) .circle {
          border: 2px solid var(--psfx-texto-disbled-color);
          background-color: var(-psfx-bg-detalhes-claro-color);
        }

        .circle.checked {
          border: 4px solid var(--psfx-ui-borda-radio-cchecked-color);
        }

        :host(:hover) .circle.checked {
          border: 4px solid var(--psfx-texto-color-2);
        }

        :host([disabled]) .circle.checked {
          background-color: var(--psfx-ui-bg-radio-color);
          border: 4px solid var(--psfx-texto-disbled-color);
        }
      
        :host(:hover) .circle {
          border: 2px solid var(--psfx-ui-borda-radio-hover-color);
        }
      </style>
      <div class="circle"></div>
      <div class="rdtexto"></div>
    `;
  }

  connectedCallback() {
    this.updateLabel();
    if (this.hasAttribute("checked")) {
      this.shadowRoot.querySelector(".circle").classList.add("checked");
    }
  }

  updateLabel() {
    const labelElement = this.shadowRoot.querySelector('.rdtexto');
    // Prioriza data-label, depois textContent
    const label = this.getAttribute('data-label') || this.textContent.trim() || '';
    labelElement.textContent = label;
  }

  static get observedAttributes() {
    return ["checked", "disabled", "data-label"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const circle = this.shadowRoot.querySelector(".circle");
    if (name === "checked") {
      circle.classList.toggle("checked", newValue !== null);
    }
    
    // Atualiza o label quando data-label muda
    if (name === "data-label") {
      this.updateLabel();
    }
  }
}

customElements.define("ms-radio-group", MsRadioGroup);
customElements.define("ms-radio", MsRadio);

  /*
        ///// DOCUMENTAÇÃO DO COMPONENTE

          index.htm
          • EXTRUTURA HTML PADRÃO.
            <ms-radio-group id="gpradios">
                <ms-radio data="data 1" checked>Option 1</ms-radio>
                <ms-radio data="data 2" disabled>Option 2</ms-radio>
                <ms-radio data="data 3">Option 3</ms-radio>
                <ms-radio data="data 4">Option 4</ms-radio>
            </ms-radio-group> 
          ///////::::::::::::::::::::::::::::::::::::::::::::::::::

         • EXTRUTURA HTML PARA LIDAR COM MAIS DE UM GRUPO  DE BOTÕES.
            <ms-radio-group>
            <ms-radio class="radio-item" data="opcao1">Opção 1</ms-radio>
            <ms-radio class="radio-item" data="opcao2">Opção 2</ms-radio>
            </ms-radio-group>

            <ms-radio-group>
            <ms-radio class="radio-item" data="opcao3">Opção 3</ms-radio>
            <ms-radio class="radio-item" data="opcao4">Opção 4</ms-radio>
            </ms-radio-group>
           ///////::::::::::::::::::::::::::::::::::::::::::::::::::

            EXTRUTURA HTML PADRÃO PARA JANELAS MODAIS
           <ms-radio-group column>
              <ms-radio data-label="Radio 1" >Radio 1</ms-radio>
              <ms-radio data-label="Radio 2" >Radio 2</ms-radio>
            </ms-radio-group>
            OBS: data-label="texto do botão" : texto do botão
          ///////::::::::::::::::::::::::::::::::::::::::::::::::::

           main.js
           ///////////////////////////////////////////////////////////////////////////////////////
          • METODOS E EVENTOS PADRÃO:
           const radioGroup = document.querySelector("#gpradios");
                    function radiosEnventosGrupo(){
                setTimeout(() => {
                    console.log("Habilitando o segundo item...");
                    radioGroup.disable(3)  // desabilitao terceiro item
                    radioGroup.checked(3); // Selecionar o terceiro item

                    radioGroup.addEventListener("change", (evt) => {
                    alert(`Selected item: ${evt.detail.value},\nIndex item: ${evt.detail.index},\nData item: ${evt.detail.data}`);
                    });

                }, 90);
         };

          ///////////////////////////////////////////////////////////////////////////////////////
        • METODOS  E EVENTOS PARA  LIDAR COM MAIS DE UM GRUPO  DE BOTÕES
           const radioItems = document.querySelectorAll(".radio-item");

                  function radiosEnventosGrupos(){
                      setTimeout(() => {
                          try {
                              const radioItems = document.querySelectorAll(".radio-item");
                              radioItems[0].setAttribute("checked", "");  /////// ITEM  0 CHECADO
                              radioItems[1].setAttribute("disabled", ""); /////// ITEM  1 DESABILITADO
                              radioItems.forEach((radio, index) => {
                                  /////// ITEM MARCADO COMO CHECADO
                                  //radio.setAttribute("disabled", ""); //////desbilita todos os botões
                                  radio.addEventListener("click", () => {
                                      ///// Desmarca todos os itens
                                      radioItems.forEach((item) => item.removeAttribute("checked"));
                                      // Marca apenas o item atual
                                      radio.setAttribute("checked", "");
                                      ///// Obter as propriedades
                                      let value = radio.textContent.trim();
                                      let index = Array.from(radioItems).indexOf(radio);
                                      let data= radio.getAttribute("data") || null;
                                      
                                      alert(`Selected item: ${value},\nIndex item: ${index},\nData item: ${data}`);
                                  });
                              });
                              
                          } catch (error) { alert(error) }
                      }, 90);
                  };

                /////// Função para desabilitar todos os itens
                function disableAllRadios() {
                    const radioItems = document.querySelectorAll(".radio-item");
                    radioItems.forEach((radio) => { radio.setAttribute("disabled", "");  });
                }

                /////// Função para habilitar todos os itens
                function enableAllRadios() {
                    const radioItems = document.querySelectorAll(".radio-item");
                    radioItems.forEach((radio) => {radio.removeAttribute("disabled"); });
                }

                // Testando
                disableAllRadios(); // Desabilita todos os itens
                setTimeout(enableAllRadios, 3000); // Habilita novamente após 3 segundos
  */