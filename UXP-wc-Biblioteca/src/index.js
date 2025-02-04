const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;


//////// IMPORTAR COMPONENTES
import './@ms-wc/ms-painel.js';
import './@ms-wc/ms-box-number.js';
import './@ms-wc/ms-checkbox.js';
import './@ms-wc/ms-icon.js';
import './@ms-wc/ms-buttom.js';
import './@ms-wc/ms-slider.js';
import './@ms-wc/ms-tab-group.js';
import './@ms-wc/ps-combobox.js';
import './@ms-wc/ms-dropdowlist.js';
import './@ms-wc/ms-radio-group.js';
import './@ms-wc/ms-busca.js';
import './@ms-wc/ms-slider-circular.js';
import './@ms-wc/ms-color-seletor.js';
import './@ms-wc/ms-popover.js';






//////// IMPORTAR SCRIPTS JS
const {moda001} = require("./js/Dlg_001A.js");

document.addEventListener('DOMContentLoaded', () => {

    const fieldset = document.querySelector('#pn1');
    //// OUVINTES DE EVENTOS
    const numberBox = document.querySelector('#teste_nf');
    numberBox.addEventListener('change', () => {
        console.log(`Valor atual: ${numberBox.value}`);
        document.querySelector('#texto').textContent = `Valor atual: ${numberBox.value}`;
    });

    ///// INTEGRAÇÃO COM JAVASCRIPIT "ATRIBUTOS"
    setTimeout(() => { 
        numberBox.setAttribute('size', "130px");
        numberBox.setAttribute('value', "80.7");
        numberBox.setAttribute('value-suffix', "cm");
        numberBox.setAttribute("data-label", "Largura");
    }, 90); 

    

    //setTimeout(() => { fieldset.disable();}, 30); // Desabilita o fieldset

    //////////////////////////////////////////////////////1
    /////////TEXTES DO COMPONENTE CHECKBOX
    // Seleciona o componente
    const checkbox = document.querySelector('#ck1');
    const checkbox2 = document.querySelector('#ck2');

    // Escutar mudanças
    checkbox.addEventListener('change', (evt) => {
        alert(`Novo estado: ${evt.detail.checked}`);
    });

    checkbox2.addEventListener('change',  (evt) => {
            if(evt.detail.checked){
                checkbox.disabled = true;// radiosDisabled(true)
                psButtonDesab(true)
            }
            else{
                checkbox.disabled = false;// radiosDisabled(false)
                psButtonDesab(false)
            }
    });

    //////////////////////////////////////////////////////
    /////////TEXTES DO COMPONENTE RADIOS

    // document.querySelector('#rd2').disabled = true;

    // Escutar mudanças de estado
    /*
    document.querySelector('#rd1').addEventListener('change', (e) => {
        // alert('Novo estado de rd1: ' + e.detail.checked);
        document.querySelector('#rd1').checked = true;
        document.querySelector('#rd2').checked = false;
        document.querySelector('#rd3').checked = false;
    });

    document.querySelector('#rd2').addEventListener('change', (e) => {
        // alert('Novo estado de rd2: ' + e.detail.checked);
            document.querySelector('#rd2').checked = true;
            document.querySelector('#rd1').checked = false;
            document.querySelector('#rd3').checked = false;
        });

        document.querySelector('#rd3').addEventListener('change', (e) => {
        // alert('Novo estado de rd3: ' + e.detail.checked);
            document.querySelector('#rd3').checked = true;
            document.querySelector('#rd1').checked = false;
            document.querySelector('#rd2').checked = false;
        });
*/
    // document.querySelector('#rd2').addEventListener('change', (e) => {
    //     // alert('Novo estado de rd2: ' + e.detail.checked);
    //     // alert(document.querySelector('#rd2').textContent)
    //     alert(`Data: ${e.detail.data}`);
    // });


    ////////FUNÇÃO DOS BOÕES DE RADIO
//  document.addEventListener('DOMContentLoaded', () => {
//     try {
//         const radios = document.getElementsByClassName("btn");
//         const radioBtn = Array.from(radios);

//         for (let i = 0; i < radioBtn.length; i++) { 
//             radioBtn[i].addEventListener('change', (event) => {
//                 // Desmarca todos os botões de rádio
//                 radioBtn.forEach(radio => radio.checked = false);
//                 // Marca o botão de rádio atual
//                 event.currentTarget.checked = true;
//                 alert(event.currentTarget.tex)
//             });
//         }
//     } catch (err) { alert(err); }
//  });



        // ////////FUNÇÃO DOS BOÕES DE RADIO
        // document.addEventListener('DOMContentLoaded', () => {
        //     try {
        //         const radios = document.getElementsByClassName("btn");
        //         const radioBtn = Array.from(radios);

        //         for (let i = 0; i < radioBtn.length; i++) { 
        //             radioBtn[i].addEventListener('change', (event) => {
        //                     alert(event.target.getAttribute('data'))
        //                     alert(event.target.textContent)
        //                     alert(i)
        //             });
        //         }
        //     } catch (err) { alert(err); }
        // });


        // //     document.addEventListener('DOMContentLoaded', () => {
        // //         document.querySelector(".teste").addEventListener("change", evt => {
        // //             alert(`Selected item: ${evt.target.getAttribute('data')}`);
        // //         })
        // //   })




            //   try {
            //         const radios = document.getElementsByClassName("btn");
            //         Array.from(radios).forEach((radio, index) => {
            //            // setTimeout(() => { radio.disabled = true;}, 90); 
            //               radio.addEventListener('change', (event) => {
            //                    alert(`Data: ${event.target.getAttribute('data')}\nTexto: ${event.target.textContent}\nIndex: ${index}`)
            //               })
            //         });
            //     } catch (err) {}


                
            // function radiosDisabled(method){
            //     const radiosBtn = document.querySelectorAll(".btn")
            //     radiosBtn.forEach( radiox => {
            //     setTimeout(() => { radiox.disabled = method;}, 90); //// DESABILITAR TODOS
            //     });
            // }
            
            ////// MODIFICAR THEMA PS
            document.querySelector("#tmC").addEventListener('click', () => {
                themaPS("kPanelBrightnessOriginal")   //// calro
                document.querySelector("#tmC").textContent = 'Thema claro_OK';
            })
            document.querySelector("#tmE").addEventListener('click', () => {
                themaPS("kPanelBrightnessMediumGray")   /// escuro
                document.querySelector("#tmC").textContent = 'Thema claro';
            })


            async function themaPS(thema){
                await core.executeAsModal(async () => {
                    await app.batchPlay( [{
                        "_obj": "set", "_target": [ { "_property": "interfacePrefs", "_ref": "property" }, { "_enum": "ordinal", "_ref": "application", "_value": "targetEnum" } ], "to": { "_obj": "interfacePrefs", "kuiBrightnessLevel": { "_enum": "uiBrightnessLevelEnumType", "_value": thema } }
                    }]);
                })
            }

            ///////// EVENTS BOTÕES ACTIONS
            function psButtonDesab(d){
                setTimeout(() => {
                        if(d==true){
                                document.querySelector('#tmC').disable();
                                document.querySelector('#tmE').disable()
                                document.querySelector('#btnIcone1').disable()
                                document.querySelector('#slider01').disable()
                                document.querySelector('#listaCB').disable()
                                document.querySelector('#buscar').disable()
                                document.querySelector('#teste_nf').disable()
                                disableAllRadios()
                            }
                            else  {  
                            document.querySelector('#tmC').enable()
                            document.querySelector('#tmE').enable()
                            document.querySelector('#btnIcone1').enable()
                            document.querySelector('#slider01').enable()
                            document.querySelector('#listaCB').enable();
                            document.querySelector('#buscar').enable();
                            document.querySelector('#teste_nf').enable();
                            enableAllRadios()
                        }
                    }, 90);
            }


            function disableAllRadios() {
                const radioItems = document.querySelectorAll(".radio-item");
                radioItems.forEach((radio) => { radio.setAttribute("disabled", "");  });
            }

            /////// Função para habilitar todos os itens
            function enableAllRadios() {
                const radioItems = document.querySelectorAll(".radio-item");
                radioItems.forEach((radio) => {radio.removeAttribute("disabled"); });
            }


            ///////// EVENTS BOTÕES COM ICONES
            const button2 = document.querySelector('#btnIcone1'); 
            setTimeout(() => { 
                //   button2.disable();  //// DESABILITAR
            //    button.enable();   //// HABILITAR
                }, 90);

                ///////// ESCUTAR BOTÕES COM ICONES  
                document.querySelector('#btnIcone1').addEventListener('click', async () => {
                //alert("Olá mundo")
                await moda001();
            })



            ///////// SLIDER CONFIGS INICIL-----------------------------------------
            ///////// ESCUTAR VALORES DE SLIDER
            let  inicalSatate ;
            var listener = (e,d) => { 
                inicalSatate = app.activeDocument.historyStates[app.activeDocument.historyStates.length-1]
                }
                action.addNotificationListener([{ event: "select" }, { event: "open" }, { event: "moveTool" } , {event: "make"} ], listener);   

            const eventHandler = (event, descriptor) => console.log(event, descriptor)
            require("photoshop").action.addNotificationListener(['all'], eventHandler);


            const slider = document.querySelector('#slider01');
            slider.addEventListener('change', async (e) => {
            //  console.log('Novo valor:', e.detail);
                        try {
                            await core.executeAsModal( async() => {
                            //    await app.batchPlay([  { "_obj": "clearEvent", "_target": [ { "_property": "historyStates", "_ref": "property" }, { "_enum": "ordinal", "_ref": "document", "_value": "targetEnum" } ] }]);
                                    app.activeDocument.activeHistoryState =  inicalSatate;
                                //    await app.batchPlay([   { "_obj": "colorBalance", "highlightLevels": [ 0, 0, 0 ], "midtoneLevels": [ e.value, 0, 0 ], "preserveLuminosity": true, "shadowLevels": [ 0, 0, 0 ] }   ]);
                                    await app.batchPlay([      { "_obj": "gaussianBlur", "radius": { "_unit": "pixelsUnit", "_value": parseFloat(e.value)/10 } }  ]);
                                // rotate 90 deg counter clockwise
                            //    let anchorPos = require('photoshop').constants.AnchorPosition
                            //    await app.activeDocument.layers[0].rotate(e.value,)
                        },{"interactive": true});
                    } catch (error) { }
            });

            // setTimeout(() => {  slider.value = 10; }, 90); 
            ///////// SLIDER CONFIGS FINAL-----------------------------------------


            //////// SINTEMA DE NEVEGAÇÃO POR ABAS
            const tabs = document.querySelector('#tab-groupA');
            setTimeout(() => { 
                tabs.addEventListener('tab-change', (event) => {
                    const { index, text } = event.detail;
                     /////// OBTEM O INDICE E O TITULO DA ABA ATIVA
                    console.log(`Aba ${index}\nAtiva: ${text}`);
                });
                 /////// SELECIONA A ABRA ATIVA
                tabs.activateTab(0)
            }, 90); 
            ////////::::::::::::::::::::::::::::

            
            /////// ITEMS DA  DINAMICOS
            const combobox = document.querySelector('#listaCB');
            const array = ["João", "Maria", "Pedro", "Catia", "Raimundo", "Mauricio"];

            const arrayOBJ = [
                { nome: 'João f',  idade: 25, sexo: "Masculino" , icon:"icon035", color: "#000000" },
                { nome: 'Maria', idade: 30, sexo: "Feminino",   icon:"icon082", color:  "#c23434" },
                { nome: 'Pedro', idade: 28, sexo: "Masculino", icon:"icon037", color:  "#000000" },
                { nome: 'Jacira', idade: 22, sexo: "Feminina", icon:"icon038", color:  "#000000" },
                { nome: 'Marta', idade: 25, sexo: "Feminina", icon:"icon039", color:  "#3470c2" },
            ];
                        
            /////////////////////////////////////////////////////////
                /////// COMBOBOX METODOS  TESTES INICIO
                ///////// ESCUTAR COMBOBOX
                function comboBoxouvirEscultaLista_itens_html() {
                    combobox.addEventListener('optionSelected', (e) => {
                    alert(`Opção selecionada:, ${e.detail.selectedIndex},  ${e.detail.value}`);
                });
            };

                /////// LIDAR COM ARRAY DE STRING
            function comboBoxcarregarDimnamicoArray(){
                setTimeout(() => { 
                    array.forEach(item => { combobox.addOption(item); });
                    combobox.selectedIndex = 1; // Seleciona a opção com índice 1 (Maria)
                    combobox.updateSelected();
                }, 90); 
                combobox.addEventListener('optionSelected', (e) => {
                    alert(`Opção selecionada:, ${e.detail.selectedIndex},  ${e.detail.value}`);
                });
            };
            
            /////// LIDAR COM ARRAY DE OBJETOS
            function comboBoxcarregarDimnamicoArrayOBJ(){
                setTimeout(() => { 
                    arrayOBJ.forEach(item => {
                    combobox.addOption(item.nome, item); // Passando o item.nome para exibição e o objeto completo como segundo parâmetro
                    });
                    combobox.selectedIndex = 4;
                }, 90); 
                combobox.addEventListener('optionSelected', (event) => {
                    console.log('Evento disparado:', event.detail); // Para debug
                    const { value, originalObject } = event.detail;
                    if (originalObject) {
                    alert(`Nome: ${value},\nIdade: ${originalObject.idade},\nSexo: ${originalObject.sexo},\nIcone: ${originalObject.icon},\nColor: ${originalObject.color}`);
                    }
                });
            };


        /////////////////////////////////////////////////////////
        /////// DROPDOWLISTE METODOS  TESTES INICIO
            const dropdown = document.querySelector('#dropdownlist');

        ///////// CARREGAMENTO DE ARRAY SIMPLES
        function dropDowcarregarDimnamicoArray(){
            setTimeout(() => {
                array.forEach(item => {dropdown.addOption(item); });
                dropdown.selectedIndex = 3;
                dropdown.addEventListener('optionSelected', (event) => {
                    const { value, originalObject, selectedIndex } = event.detail;
                    alert(`Nome: ${value}\n${selectedIndex}\n${originalObject}`);
                });
            }, 90);
        };


            ///////// EVENTO CARREGAMENTO POR TAG ITENS
            function dropDowouvirEscultaLista_itens_html() {
            const dropdown = document.querySelector('#dropdownlist');
                //////// SELECIONAR O ITEM PROGRAMATICAMENTE
            setTimeout(() => {dropdown.selectedIndex = 4; }, 90);  //// OU dropdown.setAttribute('data-selected-index', '3');
            //////// OUVIR OS EVNETOS DOS ITENS E SUBITENS
            dropdown.addEventListener('optionSelected', (event) => {
                const { value, subitem, subitemIndex, } = event.detail;
                if (subitem) {
                    alert(`Selecionado: ${value} - Subitem: ${subitem} (Índice do Subitem: ${subitemIndex})`);
                } else {
                    alert(`Selecionado: ${value}`);
                    console.log(document.querySelectorAll('ps-item[subitem]'));
                }
            });
        }

        ///////// CARREGAMENTO DE ARRAY OBJETOS
        function dropDowcarregarDimnamicoArrayOBJ(){
            setTimeout(() => {
                arrayOBJ.forEach(item => { dropdown.addOption(item.nome, item); });
                dropdown.selectedIndex = 1;
                dropdown.addDividerAt(2)
            }, 90);
                
            dropdown.addEventListener('optionSelected', (event) => {
                const { value, originalObject } = event.detail;
                   if (originalObject) {
                    alert(`Nome: ${value},\nIdade: ${originalObject.idade},\nSexo: ${originalObject.sexo},\nIcone: ${originalObject.icon},\nColor: ${originalObject.color}`);
                }
            });
        }
        
        
        /////// COMBOBOX METODOS  TESTES FINAL
        let carrregaCombobox= 3;
        switch (carrregaCombobox) {
            case 1: comboBoxcarregarDimnamicoArray();  break;s
            case 2: comboBoxouvirEscultaLista_itens_html();  break;
            case 3: comboBoxcarregarDimnamicoArrayOBJ();  break;
            default:  break;
        }

        /////// DROPDOWLISTE METODOS  TESTES FINAL
        let carrregaDropdow= 1;
        switch (carrregaDropdow) {
            case 1: dropDowcarregarDimnamicoArray();  break;s
            case 2: dropDowouvirEscultaLista_itens_html();  break;
            case 3: dropDowcarregarDimnamicoArrayOBJ();  break;
            default:  break;
        }

        
        ////////// TESTANDO RADIOS MODELO 2
        /////// RADIO BOTÕES METODOS  TESTES FINAL
        const radioGroup = document.querySelector("#gpradios");
            function radiosEnventosGrupo(){
            setTimeout(() => {
                console.log("Habilitando o segundo item...");
                radioGroup.disable(1)
                radioGroup.checked(2); // Selecionar o terceiro item
                    radioGroup.addEventListener("change", (evt) => {
                alert(`Selected item: ${evt.detail.value},\nIndex item: ${evt.detail.index},\nData item: ${evt.detail.data}`);
                });

            }, 90);
        };

        
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

        /////// RADIO BOTÕES METODOS  TESTES FINAL
        let radiosGrupo= 1;
        switch (radiosGrupo) {
            case 1: radiosEnventosGrupo();  break;s
            case 2: radiosEnventosGrupos(); break;
            default:  break;
        }
    

        ////////// TESTANDO SITEMA DE BUSCA
        /////// RADIO BOTÕES METODOS  TESTES FINAL

        const items = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10" ];
        const busca = document.querySelector('#buscar');

        // Evento para capturar enquanto digita
        busca.addEventListener('change', (e) => {
            const searchTerm = e.detail.searchTerm.toLowerCase();
            const resultados = items.filter(item => item.toLowerCase().includes(searchTerm));
            //   console.log('Resultados da busca enquanto digita:', resultados);

            ///////RESULTADO DA BUSCA:
            document.querySelector('#buscaResult').textContent=`${resultados}`;
            
        });

        // busca.addEventListener('ms-busca-input', (e) => {
        //   console.log('Valor enquanto digita:', e.detail.searchTerm);
        // });



                   
                    



});








  