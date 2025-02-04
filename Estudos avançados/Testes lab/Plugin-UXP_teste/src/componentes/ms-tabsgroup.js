class PsTabGroup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupTabs();
    this.activateTab(0); // Ativar a primeira aba por padrão
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
                width: 100%; height: 23px; position: absolute; top: 0px;
             }

      </style>
    `;

    this.shadowRoot.innerHTML = `
      ${style}
      <div class="contTabs">
        <div class="bgBtns">
        <div class="tab-buttons"></div>
      </div>
        <slot></slot>
      </div>
    `;
  }

  setupTabs() {
    const tabButtonsContainer = this.shadowRoot.querySelector('.tab-buttons');

    // Cria botões para cada aba
    Array.from(this.children).forEach((tab, index) => {
      const button = document.createElement('div');
      button.classList.add('tab-button');
      button.textContent = tab.getAttribute('title') || `Tab ${index + 1}`;
      button.dataset.index = index;
      button.addEventListener('click', () => this.activateTab(index));
      tabButtonsContainer.appendChild(button);

      // Adiciona classe inicial para os painéis
      tab.classList.add('tab-panel');
    });
  }

  activateTab(index) {
    const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
    const tabPanels = this.children;

    // Remove o estado ativo de todas as abas e painéis
    tabButtons.forEach(btn => btn.classList.remove('active'));
    Array.from(tabPanels).forEach(panel => panel.classList.remove('active'));

    // Ativa a aba e o painel correspondente
    if (index >= 0 && index < tabPanels.length) {
      tabButtons[index].classList.add('active');
      tabPanels[index].classList.add('active');
    }
  }
}

customElements.define('ms-tabgroup', PsTabGroup);

class PsTab extends HTMLElement {}

customElements.define('ms-tab', PsTab);
