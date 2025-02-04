const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;


   async function moda001() {
       try {

           const response = await fetch("./html/Dlg_001A.html")
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
    const dropdown = document.querySelector('#dropdownlist2');

    // const itensQTD = dropdown.options;
    // alert(itensQTD.length)

        //////// SELECIONAR O ITEM PROGRAMATICAMENTE
     //setTimeout(() => { dropdown.selectedIndex = 4;  }, 90);  //// OU dropdown.setAttribute('data-selected-ind  ex', '3');
    //////// OUVIR OS EVNETOS DOS ITENS E SUBITENS
        dropdown.addEventListener('optionSelected', (event) => {
            const { value, subitem, subitemIndex, } = event.detail;
            if (subitem) {alert(`Selecionado: ${value} - Subitem: ${subitem} (Índice do Subitem: ${subitemIndex})`);} 
            else { alert(`Selecionado: ${value}`); console.log(document.querySelectorAll('ps-item[subitem]')); }
        });
    };

 ///////// CARREGAMENTO DE ARRAY OBJETOS
 const arrayOBJ2 = [
     { nome: 'João f',idade: 25, sexo: "Masculino" , icon:"icon035", color: "#000000" },
     { nome: 'Maria', idade: 30, sexo: "Feminino",   icon:"icon082", color:  "#c23434" },
     { nome: 'Pedro', idade: 28, sexo: "Masculino", icon:"icon037", color:  "#000000" },
     { nome: 'Jacira',  idade: 22, sexo: "Feminina", icon:"icon038", color:  "#000000" },
     { nome: 'Marta', idade: 25, sexo: "Feminina", icon:"icon039", color:  "#3470c2" },
  ];
 function dropDowcarregarDimnamicoArrayOBJ(){
    dropdown2 = document.querySelector('#dropdownlist2');
    setTimeout(() => {
        arrayOBJ2.forEach(item => { dropdown2.addOption(item.nome, item); });
        dropdown2.selectedIndex = 1;
        dropdown2.addDividerAt(2)
        
        // const itensQTD = dropdown2.options;
        // alert(itensQTD.length)

    }, 90);
      
    dropdown2.addEventListener('optionSelected', (event) => {
        const { value, originalObject } = event.detail;
        
        if (originalObject) {
            //alert(`Nome: ${value},\nIdade: ${originalObject.idade},\nSexo: ${originalObject.sexo},\nIcone: ${originalObject.icon},\nColor: ${originalObject.color}`);
            console.log(`Nome: ${value},\nIdade: ${originalObject.idade},\nSexo: ${originalObject.sexo},\nIcone: ${originalObject.icon},\nColor: ${originalObject.color}`);
            document.querySelector('#iconGatilho').setAttribute('icon', `${originalObject.icon}`)
        }
    });
};




function janela001Functions(){

    const slider = document.querySelector('#sliderCirc');
    const iconrg = document.querySelector('#iconeRotate');
    const checkbox3 = document.querySelector('#ck3');
    const textBox = document.querySelector('#textBox01');
    const tabs2 = document.querySelector('#tab-groupB');

    //////// SINTEMA DE NEVEGAÇÃO POR ABAS
    setTimeout(() => { 
        tabs2.addEventListener('tab-change', (event) => {
            const { index, text } = event.detail; 
       //     console.log(`Aba ${index}\nAtiva: ${text}`);
        });
        tabs2.activateTab(2) 
        setTimeout(() => {  slider.setValue(45);  }, 50 );   // Define o valor atual
        const activeTabText = tabs2.getActiveTabText();
       // alert(activeTabText)
       
       //////// POPOVER METODOS
    //    const popover = document.getElementById('popover01');
    //    popover.setupTrigger('btnTrigger');
       
         /////////:::::::::::::
    }, 90); 
    ////////::::::::::::::::::::::::::::
 




    //////// DESABILIAR SLIDER
    checkbox3.addEventListener('change',  (evt) => {
        setTimeout(() => { 
        if(evt.detail.checked){ 
            slider.disable(); iconrg.disable(); colorSelector.disable();
            textBox.disable();
         }
        else{ 
            slider.enable();  iconrg.enable();  colorSelector.enable();
            textBox.enable();
         }
        }, 90);
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
            //    rotacionar(angle);
                suaFunction(-angle);
                },{"interactive": true});
           } catch (err) {alert(err)}
    });

    //////////:::::::::::::::::::::::::::::::::::::::::::::::::::::



 function suaFunction(angle){
core.executeAsModal( async() => {
        await app.batchPlay( [
            {"_obj": "set","_target": [{"_enum": "ordinal","_ref": "contentLayer","_value": "targetEnum"}],"to": {"_obj": "patternLayer","angle": {"_unit": "angleUnit","_value": angle},"pattern": {"ID": "0444d959-1172-564f-b786-c50208653c28","_obj": "pattern","name": "Fractures"},"scale": {"_unit": "percentUnit","_value": 122.0}}}
        ]);
    });
};


    ///// POPOVER 
    const popover = document.querySelector('ms-popover');
    popover.setAttribute('size', "150px");
    popover.setAttribute('position', "top");
    popover.setAttribute('seta', "true");

    popover.disable();  // desabilitar
    popover.enable();   // habilitar

   //////////:::::::::::::::::::::::::::::::::::::::::::::::::::::


  
    //////// SELETOR DE CORES
    //const inicialCor  = "#ffffff";
    const inicialCor  = cssColorHex('var(--psfx-texto-color)');
    const colorSelector =  document.querySelector('#sletorB');
    const iconGatilho = document.querySelector('#iconGatilho');

     ////// DEFINE O TEXTCONTE DA COR HEX NO SELETOR
    const colorHexLabel = colorSelector.querySelector('#color-hex');
    colorHexLabel.textContent = inicialCor // Substitua pela cor desejada
    ////// DEFINE A POSIÇÃO DE EXIBIÇÃO DO SELETOR
    colorSelector.setAttribute('position', "top");
    ////// DEFINE COR INICIAL NO SELETOR
    colorSelector.setAttribute('initial-color', inicialCor);
    ////// DEFINE COR  INICIAL DO COMPONENTE MS-ICON DISPARADOR
    iconGatilho.setAttribute('color', inicialCor);
    ////// DEFINE COR  INICIAL DP PLANO DE FUNDO DE COMPONENTES DISPARADOR QUE RECEBE A PROP.CSS: BACKGROU-COLOR
    //iconGatilho.style.backgroundColor= inicialCor;
    ////// DESABILITA E HABILITA
    colorSelector.disable();
   colorSelector.enable();

   sletorB_listine = async (e, d) => {
    if (d.source == "eyeDropperSample" && e == "set") {
        colorSelector.setAttribute('initial-color', app.foregroundColor.rgb.hexValue);
        iconGatilho.setAttribute('color', `#${app.foregroundColor.rgb.hexValue}`);
        colorSelector.querySelector("#color-hex").style.color =`#${app.foregroundColor.rgb.hexValue}`
    }
}
require('photoshop').action.addNotificationListener([ { event: "set" }], sletorB_listine);




    /////Capturando todas as informações:
    colorSelector.addEventListener('colorchange', (event) => {
       const { hex, rgb, rgbValues } = event.detail;
       iconGatilho.setAttribute('color', hex);  // Define o valor atual
       // btnTrigger2.style.backgroundColor= hex;
    });
    //////////:::::::::::::::::::::::::::::::::::::::::::::::::::::
   

}



async function rotacionar(angle){
    await app.activeDocument.layers[0].rotate(angle)
};


/////OBTÉM O VALOR COMPUTADO DA VARIÁVEL CSS
function cssColorHex(corCSSvar){
    const getColorValue = (cssVar) => {
        const element = document.createElement('div');
        element.style.color = cssVar;
        document.body.appendChild(element);
        const color = window.getComputedStyle(element).color;
        document.body.removeChild(element);
        return color;
      }
      // Uso:
      const cssColor = getColorValue(corCSSvar);
      return cssColor;
}



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

