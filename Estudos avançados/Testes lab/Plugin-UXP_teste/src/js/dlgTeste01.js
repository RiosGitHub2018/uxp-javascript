const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;


   async function moda001() {
       try {

           const response = await fetch("./html/modal.html")
           .then(response => response.text()).then(data => {
               const D5dlg = document.querySelector("#janelaModa01");
               D5dlg.innerHTML = data;
               D5dlg.show({  title: `PS-fxrios: Mouse Pad Personalizada!`,  resize: "both",   size: { width: 367, height: 310 }
               });


               let carrregaDropdow= 3;
               switch (carrregaDropdow) {
                   case 1: dropDowcarregarDimnamicoArray();  break;s
                   case 2: dropDowouvirEscultaLista_itens_html();  break;
                   case 3: dropDowcarregarDimnamicoArrayOBJ();  break;
                   default:  break;
               }


              janela001Functions()
               
           })
       } catch (err) {alert(err)}
  }

  function dropDowouvirEscultaLista_itens_html() {
   const dropdown = document.querySelector('#dropdown   list2');
    //////// SELECIONAR O ITEM PROGRAMATICAMENTE
   setTimeout(() => {dropdown.selectedIndex = 4; }, 90);  //// OU dropdown.setAttribute('data-selected-ind  ex', '3');
   //////// OUVIR OS EVNETOS DOS ITENS E SUBITENS
  dropdown.addEventListener('optionSelected', (event) => {
       const { value, subitem, subitemIndex, } = event.detail;
       if (subitem) {alert(`Selecionado: ${value} - Subitem: ${subitem} (Índice do Subitem: ${subitemIndex})`);} 
       else { alert(`Selecionado: ${value}`); console.log(document.querySelectorAll('ps-item[subitem]')); }
   });
};

 ///////// CARREGAMENTO DE ARRAY OBJETOS
 const arrayOBJ2 = [
     { nome: 'João f',  idade: 25, sexo: "Masculino" , icon:"icon035", color: "#000000" },
     { nome: 'Maria', idade: 30, sexo: "Feminino",   icon:"icon082", color:  "#c23434" },
     { nome: 'Pedro', idade: 28, sexo: "Masculino", icon:"icon037", color:  "#000000" },
     { nome: 'Jacira', idade: 22, sexo: "Feminina", icon:"icon038", color:  "#000000" },
     { nome: 'Marta', idade: 25, sexo: "Feminina", icon:"icon039", color:  "#3470c2" },
  ];
 function dropDowcarregarDimnamicoArrayOBJ(){
    dropdown2 = document.querySelector('#dropdownlist2');
    setTimeout(() => {
        arrayOBJ2.forEach(item => { dropdown2.addOption(item.nome, item); });
        dropdown2.selectedIndex = 1;
        dropdown2.addDividerAt(2)
    }, 90);
      
    dropdown2.addEventListener('optionSelected', (event) => {
        const { value, originalObject } = event.detail;
        
        if (originalObject) {
            //alert(`Nome: ${value},\nIdade: ${originalObject.idade},\nSexo: ${originalObject.sexo},\nIcone: ${originalObject.icon},\nColor: ${originalObject.color}`);
            console.log(`Nome: ${value},\nIdade: ${originalObject.idade},\nSexo: ${originalObject.sexo},\nIcone: ${originalObject.icon},\nColor: ${originalObject.color}`);
            document.querySelector('#iconeTeste').setAttribute('icon', `${originalObject.icon}`)
        }
    });
};




function janela001Functions(){

    const slider = document.querySelector('#sliderCirc');
    const iconrg = document.querySelector('#iconeRotate');
    const testeIcone = document.querySelector('#iconeTeste');
    const checkbox3 = document.querySelector('#ck3');
    const colorSelector =  document.querySelector('#sletorB');
    const textBox = document.querySelector('#textBox01');


    //////// DESABILIAR SLIDER
    checkbox3.addEventListener('change',  (evt) => {
        if(evt.detail.checked){ 
            setTimeout(() => { 
                slider.disable(); iconrg.disable(); colorSelector.disable();
                textBox.disable()
             }, 90)
         }
        else{ 
            setTimeout(() => { 
                slider.enable();  iconrg.enable();  colorSelector.enable();
                textBox.enable();
            }, 90); }
    });
   //////////:::::::::::::::::::::::::::::::::::::::::::::::::::::

    //////// SLIDER CIRCULAR EVENTOS
    let  inicalSatate ;
   // var listener = (e,d) => {  try { inicalSatate = app.activeDocument.historyStates[app.activeDocument.historyStates.length-1];} catch (err) {} // }
   // action.addNotificationListener([{ event: "select" }, { event: "open" }, { event: "moveTool" } , {event: "make"} ], listener);   

   try { inicalSatate = app.activeDocument.historyStates[app.activeDocument.historyStates.length-1];} catch (err) {}
    slider.addEventListener('change', (event) => {
           try {
                const angle = event.detail.angle;
                iconrg.style.transform = `rotate(${angle}deg)`;
                core.executeAsModal(async () => {
                 app.activeDocument.activeHistoryState =  inicalSatate;
                rotacionar(angle);
                },{"interactive": true});
           } catch (err) {alert(err)}
    });
    setTimeout(() => {  slider.setValue(0);  }, 90);   // Define o valor atual
    //////////:::::::::::::::::::::::::::::::::::::::::::::::::::::
  
    //////// SELETOR DE CORES
    colorSelector.setAttribute('initial-color', '#5858fa');
    // colorSelector.setAttribute('codigo-hex', "true") 
    // colorSelector.disable();
    // colorSelector.enable();

     ////////////Capturando todas as informações:
    colorSelector.addEventListener('colorchange', (event) => {
       const { hex, rgb, rgbValues } = event.detail;
       testeIcone.setAttribute('color', hex);  // Define o valor atual
    });
    //////////:::::::::::::::::::::::::::::::::::::::::::::::::::::
   

}



async function rotacionar(angle){
    await app.activeDocument.layers[0].rotate(angle)
};




/////////SLIDER CIRCULAR
// const observer = new MutationObserver(() => {
//     const slider = document.querySelector('#sliderCirc');
//     const iconrg = document.querySelector('#iconeRotate');
//         slider.addEventListener('anglechange', (event) => {
//             const angle = event.detail.angle;
//             iconrg.style.transform = `rotate(${angle}deg)`;
//         });
// });

// observer.observe(document.body, { childList: true, subtree: true });







///////EXPORTAR FUNÇÃO PARA  O INDEX.JS
module.exports = { moda001};

