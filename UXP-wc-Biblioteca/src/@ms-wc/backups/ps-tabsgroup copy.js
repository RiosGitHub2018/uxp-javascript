class PsTabGroupOp extends HTMLElement {
 constructor() {
   super();
   this.attachShadow({ mode: 'open' });
 }

 connectedCallback() {
   this.render();
   this.setupTabs();

   // Verifica se alguma aba tem o atributo "ativa" e ativa a correspondente
   const activeIndex = Array.from(this.children).findIndex(child => child.hasAttribute('ativa'));
   if (activeIndex >= 0) {
     this.activateTab(activeIndex);} 
     else { this.activateTab(0); }  // Caso contrário, ativa a primeira aba por padrão
 }

 render() {
   let tabs = '';
   Array.from(this.children).forEach((child, index) => {
     tabs += `
     <div class="tab-button" data-index="${index}"> ${child.getAttribute('title') || `Tab ${index + 1}`} </div>`;
   });

   const style = `
     <style>
       :host {
         display: block;
         font-family: Arial, sans-serif;
       }

       .contTabs{
         border: 1px  solid #d1d1d1;  
         background-color: #f0f0f0;
         position: relative;
       }
       .tab-buttons {
         display: flex;
       }

       .tab-button {
         background-color: #e0e0e0;
         padding: 10px 15px;
         cursor: pointer;
         height: 23px;
         display: flex;
         justify-content: center;
         align-items: center;
         font-size: 1.1em;
         color: var(--uxp-host-text-color);
         box-shadow: 1px 0px 0px 0px #ffffff;
         margin-right: 1px
       }
       .tab-button:hover { 
         color: #000000;
       }
       .tab-button.active {
         background: linear-gradient(90deg, rgba(240,240,240,1) 89%, rgba(240,240,240,1) 96%, rgba(168,168,168,1) 100%);
       }
       .tab-content {
         padding: 10px;
         border-top: none;
         display: flex;
         justify-content: center;
         align-items: center;
         margin-top: 23px;
       }

       .divider{
           border-right: 1px solid #b4b5b7;  
           border-left: 1px solid #b4b5b7;  
       }

       .bgBtns{
         background-color: #e0e0e0; width: 100%; height: 23px; position: absolute; top: 0px
       }

       /* Dark mode */
       @media (prefers-color-scheme: dark), (prefers-color-scheme: darkest) {
             .contTabs{
               border: 1px  solid #3a3a3a;  
               box-shadow: var(--psfx-box-shadow);
               background-color: #535353;
               position: relative;
             }
             .tab-buttons {
               display: flex;
               z-index: 100;
             }
             .tab-button {
               background-color: #424242;
               padding: 10px 15px;
               cursor: pointer;
               height: 23px;
               display: flex;
               justify-content: center;
               align-items: center;
               font-size: 1.1em;
               color: var(--uxp-host-text-color);
               box-shadow: 1px 0px 0px 0px #303030;
               margin-right: 1px
             }
             .tab-button:hover { 
               color: #d5d2d2;
             }

              .tab-button:active { 
                height: 22px;
               transform: translate(0px, 1px);
               border-top: 1px solid #242424;
               background-color: #747070;
              }

             .tab-button.active {
               background: linear-gradient(90deg, rgba(83,83,83,1) 91%, rgba(119,119,119,1) 96%, rgba(41,40,40,1) 100%);
               pointer-events: none;
             }
             .tab-content {
               padding: 10px;
               border-top: none;
               display: flex;
               justify-content: center;
               align-items: center;
               margin-top: 23px;
             }

             .bgBtns{
               background-color: #424242; width: 100%; height: 23px; position: absolute; top: 0px
             }
         }

     </style>
   `;

     this.shadowRoot.innerHTML = `
       ${style}
       <div class="contTabs">
         
         <div class="bgBtns">
           <div class="tab-buttons">${tabs}</div>
         </div>
         <div class="tab-content"></div>
         
     
     
     </div>
     `;
   }

   setupTabs() {
     const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');

     tabButtons.forEach((button, index) => {
       button.addEventListener('click', () => { this.activateTab(index); });
     });
 }

 activateTab(index) {
   const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
   const tabContents = Array.from(this.children);
   const tabContentContainer = this.shadowRoot.querySelector('.tab-content');

   if (index >= 0 && index < tabContents.length) {
     // Remove o estado ativo de todas as abas
     tabButtons.forEach(btn =>  
       btn.classList.remove('active')
       );
     // Ativa a aba selecionada
     tabButtons[index].classList.add('active');
     // Atualiza o conteúdo exibido
     tabContentContainer.innerHTML = '';
     const content = tabContents[index].cloneNode(true);
     tabContentContainer.appendChild(content);
   }
 }
}

customElements.define('ps-tabgroup', PsTabGroupOp);

class PsTab extends HTMLElement { constructor() { super(); }}
customElements.define('ps-tab', PsTab);


///// DOCUMENTAÇÃO DO COMPONENTE
////// MANIPUÇÃO E ESCUTAS DO COMPONENTE
/*
 HTM:
 <ps-tabgroupop style="width: 100%;">
     <ps-tab  title="Aba1">  <h3>Conteud 1</h3> </ps-tab>
     <ps-tab  title="Aba2" ativa><h3>Conteudo 2</h3> </ps-tab>
   </ps-tabgroupop>
 -------------------------------------------------------------------
 main.js
 Exemplo de Ativação Programática:
 const tabGroup = document.querySelector('ps-tabgroupop');

 // Ativar a segunda aba (índice 1)
 tabGroup.activateTab(1);
*/



