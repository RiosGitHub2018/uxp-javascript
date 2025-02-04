class PsTabGroup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._activeTabIndex = 0;
  }

  static get observedAttributes() {
    return ['active'];
  }

  connectedCallback() {
    this.render();
    this.setupTabs();
    this.activateTab(this._activeTabIndex);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'active' && oldValue !== newValue) {
      this.activateTab(parseInt(newValue, 10));
    }
  }

  render() {
    const style = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
        }
        .contTabs {
          border: 1px solid var(--psfx-ui-borda-forte-color);
          background-color: var(--psfx-ui-bg-color);
          box-shadow: var(--psfx-box-shadow);
          position: relative;
        }
        .tab-buttons {
          display: flex;
        }
        .tab-button {
          background-color: var(--psfx-bg-detalhes-color);
          padding: 10px 8px;
          cursor: pointer;
          height: 23px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 11px;
          box-shadow: 1px 0px 0px 0px #333333;
          margin-right: 1px;
          color: var(--psfx-texto-color-2);
        }
        .tab-button:hover {
          color: var(--psfx-texto-color);
        }
        .tab-button:active { 
          height: 22px;
          transform: translate(0px, 1px);
          border-top: 1px solid var(--psfx-borda-elemento-color);
          background-color: var(--psfx-ui-bg-color);
        }
        .tab-button.active {
          background: var(--psfx-botao-naveg-Abas);
          pointer-events: none;
        }
        ::slotted(.tab-panel) {
          display: none;
        }
        ::slotted(.tab-panel.active) {
          display: block;
        }
        .bgBtns{
          background-color: var(--psfx-bg-detalhes-color);
          width: 100%;
          height: 23px;
          position: absolute;
          top: 0px;
        }
      </style>
      <div class="contTabs">
        <div class="bgBtns">
          <div class="tab-buttons"></div>
        </div>
        <slot></slot>
      </div>
    `;

    this.shadowRoot.innerHTML = style;
  }

  setupTabs() {
    const tabButtonsContainer = this.shadowRoot.querySelector('.tab-buttons');
    Array.from(this.children).forEach((tab, index) => {
      const button = document.createElement('div');
      button.classList.add('tab-button');
      button.textContent = tab.getAttribute('titulo') || `Tab ${index + 1}`;
      button.dataset.index = index;
      button.addEventListener('click', () => {
        this.activateTab(index);
        this.dispatchTabChangeEvent(index);
      });
      tabButtonsContainer.appendChild(button);
      tab.classList.add('tab-panel');
      
      if (tab.hasAttribute('active')) {
        this._activeTabIndex = index;
      }
    });
  }

  dispatchTabChangeEvent(index) {
    const event = new CustomEvent('tab-change', {
      detail: {
        index,
        text: this.getActiveTabText()
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  activateTab(index) {
    const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
    const tabPanels = this.children;

    tabButtons.forEach(btn => btn.classList.remove('active'));
    Array.from(tabPanels).forEach(panel => panel.classList.remove('active'));

    if (index >= 0 && index < tabPanels.length) {
      tabButtons[index].classList.add('active');
      tabPanels[index].classList.add('active');
      this._activeTabIndex = index;
    }
  }

  // Método para obter o texto do botão da aba ativa
  getActiveTabText() {
    const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
    const activeButton = tabButtons[this._activeTabIndex];
    return activeButton ? activeButton.textContent.trim() : null;
  }
}

class PsTab extends HTMLElement {
  static get observedAttributes() {
    return ['active'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'active' && this.parentElement) {
      const index = Array.from(this.parentElement.children).indexOf(this);
      this.parentElement.activateTab(index);
    }
  }
}

customElements.define('ms-tab-group', PsTabGroup);
customElements.define('ms-tab', PsTab);

 /*
      ///// DOCUMENTAÇÃO DO COMPONENTE
      //////// SINTEMA DE NEVEGAÇÃO POR ABAS

      Atributos HTML:
      <ms-tab-group id="tab-groupA">
          <ms-tab   titulo="Aba 1" active>Conteudo aba 1</ms-tab>  //// ABA SELECIONADA
          <ms-tab   titulo="Aba 2">Conteudo aba 2</ms-tab>  
          <ms-tab   titulo="Aba 3">Conteudo aba 3</ms-tab>  
      </ms-tab-group>
      
      • Manipulação via JavaScript:
          const tabs = document.querySelector('#tab-groupA');
          setTimeout(() => { 
              tabs.addEventListener('tab-change', (event) => {
                  /////// OBTEM O INDICE E O TITULO DA ABA ATIVA
                  const { index, text } = event.detail;
                  console.log(`Aba ${index}\nAtiva: ${text}`);
              });
                  /////// SELECIONA A ABRA ATIVA
                 tabs.activateTab(0);
          }, 90); 
  */