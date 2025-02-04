const template = document.createElement("template");
template.innerHTML = `
  <style>
    .ps-button {
      height: 20px;
      background: linear-gradient(to top, #e6e9f0 0%, #dadada 100%);
      color: #3d3d3d;
      border: 1px solid #c4c1c1;
      font-size: 11px;
      border-radius: 2px;
      padding: 0 8px;
      position: relative;
      display: inline-flex;
      align-items: center; /* Garantir que o texto seja alinhado verticalmente */
      justify-content: center;
      box-sizing: border-box;
    }

    .button-text {
      line-height: 20px;
      display: inline-block;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    .ps-button:hover {
      background: #d4d6d6;
      color: rgb(56, 56, 56);
    }

    .ps-button:active {
      height: 19px;
      background: #d4d6d6;
      color: rgb(56, 56, 56);
      transform: translate(0px, 1px);
      border-top: 3px solid #5f5e5e;
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark), (prefers-color-scheme: darkest) {
      .ps-button {
        background-image: linear-gradient(to bottom, #919191 1%, #919191 5%, #6f6f6f 5%, #676767 44%, #5d5d5d 100%);
        color: #E0E0E0;
        border: 1px solid #232323;
        box-shadow: 0px 1px 0px 1px rgb(95, 95, 95);
      }
      .ps-button:hover {
        background: #aca8a8;
        color: rgb(0, 0, 0);
      }
      .ps-button:active {
        background: #686767;
        color: rgb(0, 0, 0);
        border-top: 3px solid #302f2f;
      }
    }

    .desabilitar {
      pointer-events: none;
      color: #a0a0a0 !important;
      background-image: none !important;
      background-color: var(--uxp-host-background-color);
      border: 1px solid var(--uxp-host-border-color);
    }

    @media (prefers-color-scheme: dark), (prefers-color-scheme: darkest) {
      .desabilitar {
        pointer-events: none;
        color: #a0a0a0 !important;
        background-image: none !important;
        background-color: var(--uxp-host-background-color);
        border: 1px solid var(--uxp-host-border-color);
      }
    }
  </style>
  <div class="ps-button">
    <span class="button-text"></span>
  </div>
`;

class Botao extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    const buttonText = this.shadowRoot.querySelector('.button-text');
    buttonText.textContent = this.getAttribute('texto');
    
    const buttonDiv = this.shadowRoot.querySelector('.ps-button');
    buttonDiv.style.width = this.getAttribute('size');

    if (this.hasAttribute('disabled')) {
      buttonDiv.classList.add('desabilitar');
      buttonDiv.disabled = true;
    }

    buttonDiv.addEventListener('click', (event) => {
      if (buttonDiv.disabled) {
        event.stopPropagation();
        event.preventDefault();
      }
    });
  }

  static get observedAttributes() {
    return ['disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const buttonDiv = this.shadowRoot.querySelector('.ps-button');
    if (name === 'disabled') {
      if (newValue !== null) {
        buttonDiv.classList.add('desabilitar');
        buttonDiv.disabled = true;
      } else {
        buttonDiv.classList.remove('desabilitar');
        buttonDiv.disabled = false;
      }
    }
  }

  disable() {
    this.setAttribute('disabled', '');
  }

  enable() {
    this.removeAttribute('disabled');
  }
}

window.customElements.define("ps-button", Botao);


///// DOCUMENTAÇÃO DO COMPONENTE
////// MANIPUÇÃO E ESCUTAS DO COMPONENTE
/*
    HTM:
<ps-button id="botao" texto="Botão" size="100px"></ps-button>
<ps-button id="botao" texto="Botão" size="100px" disabled></ps-button>

    main.js
    const button = document.querySelector('#botao'); 
    setTimeout(() => { 
       button.disable();  //// DESABILITAR
       button.enable();   //// HABILITAR
      }}, 90);
*/