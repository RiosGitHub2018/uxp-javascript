class MSBusca extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._disabled = false; // Armazena o estado de 'disabled'
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.updateDisabledState(); // Atualiza o estado inicial
  }

  static get observedAttributes() {
    return ['disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      this._disabled = newValue !== null;
      this.updateDisabledState();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        .search-container {
          width: 150px;
          height: 23px;
          background-image: var(--psfx-bg-botao-degrader-color);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
          border: 1px solid var(--psfx-ui-borda-busca-color);
          box-shadow: var(--psfx-box-shadow)
        }
        .search-icon {
          width: 18px;
          height: 18px;
          fill: var(--psfx-texto-color-2);
          position: absolute;
          left: 7px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
        }

        .search-input {
          font-family: sans-serif;
          outline: none;
          width: calc(100% - 29px);
          height: 21px;
          box-sizing: border-box;
          transform: translate(20px, -8px);
          padding: 3px;
        }

        .search-label {
          width: calc(100% - 30px);
          height: 21px;
          font-family: Arial, sans-serif;
          display: flex;
          align-items: center;
          cursor: text;
          color: #ababab; /* Cor inicial */
          font-size: 1.15em;
          transform: translate(30px, 0px);
          background-color: var(--psfx-bg-detalhes-color);
         padding-left: 5px;
        }

        input[type="text"] {
          font-family: Arial, sans-serif;
          font-size: 1.15em;
        }

        :host([disabled]) .search-icon,
        :host([disabled]) .search-input,
        :host([disabled]) .search-label {
          pointer-events: none;
          fill: var(--psfx-texto-disbled-color);
          cursor: default;
        }

        :host([disabled]) .search-container{
          background-image: none;
          background-color: var(--psfx-bg-detalhes-claro-color);
        }

      </style>
      <div class="search-container">
        <form class="search-form">
          <svg class="search-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input type="text" class="search-input" style="display: none;">
          <label for="searchInput" class="search-label">Buscar</label>
        </form>
      </div>
    `;
    this.updateLabelStyle(); // Atualiza a cor inicial do label
  }

  setupEventListeners() {
    const searchForm = this.shadowRoot.querySelector('.search-form');
    const searchInput = this.shadowRoot.querySelector('.search-input');
    const searchLabel = this.shadowRoot.querySelector('.search-label');

    const showInput = () => {
      if (this._disabled) return;
      searchLabel.style.display = 'none';
      searchInput.style.display = 'block';
      searchInput.focus();
    };

    const showLabel = () => {
      if (this._disabled) return;
      searchInput.style.display = 'none';
      searchLabel.style.display = 'flex';
      this.updateLabelStyle();
    };

    const updateLabel = () => {
      searchLabel.textContent = searchInput.value.trim() || 'Buscar';
      this.updateLabelStyle();
    };

    // Captura o valor enquanto o usuário digita
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.trim();

      // Dispara um evento personalizado
      this.dispatchEvent(new CustomEvent('change', { 
        detail: { searchTerm },
        bubbles: true,
        composed: true
      }));
    });

    // Captura o valor ao enviar o formulário (Enter)
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this._disabled) return;

      const searchTerm = searchInput.value.trim();
      // Dispara um evento personalizado
      this.dispatchEvent(new CustomEvent('ms-busca-submit', { 
        detail: { searchTerm },
        bubbles: true,
        composed: true
      }));

      showLabel();
      updateLabel();
    });

    searchLabel.addEventListener('click', showInput);

    searchInput.addEventListener('blur', () => {
      showLabel();
      updateLabel();
    });
  }

  updateDisabledState() {
    const searchInput = this.shadowRoot.querySelector('.search-input');
    if (this._disabled) {
      searchInput.setAttribute('disabled', '');
    } else {
      searchInput.removeAttribute('disabled');
    }
    this.updateLabelStyle();
  }

  updateLabelStyle() {
    const searchLabel = this.shadowRoot.querySelector('.search-label');
    const searchInput = this.shadowRoot.querySelector('.search-input');
    if (this._disabled) {
      searchLabel.style.color = 'var(--psfx-texto-disbled-color)';
    } else {
      searchLabel.style.color = searchInput.value.trim() === '' ? '#ababab' : 'var(--psfx-texto-color-2)';
    }
  }

  disable() { this.setAttribute('disabled', ''); }
  enable() { this.removeAttribute('disabled');}
}

customElements.define('ms-busca', MSBusca);
