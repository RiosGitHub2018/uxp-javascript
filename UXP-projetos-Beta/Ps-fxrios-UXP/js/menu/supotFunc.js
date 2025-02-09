////DESTAVA CAMADAS E ADICIONA UM NOVO NOME
async function BGconvertoCMD(nome) {
    const command = [
          {"_obj":"set","_target":[{"_property":"background","_ref":"layer"}],"layerID":365,"to":{"_obj":"layer","mode":{"_enum":"blendMode","_value":"normal"},"name":nome,"opacity":{"_unit":"percentUnit","_value":100.0}}},
          {"_obj":"newPlacedLayer"}
    ];
    await app.batchPlay(command, {});
}

////// RENOMEAR CAMADA
async function renomearCamada(nome){
    await app.batchPlay( [ { "_obj": "set", "_target": [ { "_enum": "ordinal", "_ref": "layer", "_value": "targetEnum" } ], "to": { "_obj": "layer", "name": nome} }]);
};

/////OCULTAR CAMADA ESPECÍFICA
async function ocultarCamada(cm, result){
    core.executeAsModal(async () => {
        camada = app.activeDocument.layers.getByName(cm);
        camada.visible = result
    })
}

///// ALINHA CAMADO AO DOCUMENTO
async function alignCamada(m, delSelecao) {
    const target=["ADSTops","ADSBottoms","ADSLefts","ADSRights","ADSCentersH","ADSCentersV"];
    const command = [{"_obj":"align","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"alignToCanvas":false,"using":{"_enum":"alignDistributeSelector","_value":target[m]}}];
    await app.batchPlay(command, {});
    const command2 = [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}];
    if(delSelecao ==true ){await app.batchPlay(command2, {});}
}

////// DELETAR CAMADA PELO NOME
async function removeCamada(nome){
    try {
        app.batchPlay( [{"_obj":"select","_target":[{"_name":nome,"_ref":"layer"}],"layerID":[1306],"makeVisible":false}, {"_obj":"delete","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"layerID":[1306]}], { synchronousExecution: false, });
        app.batchPlay( [{"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","name":nome}}], { synchronousExecution: false, });
    } catch (err) {alert(err)}
}

///// SELECIONAR CAMDA PELO NOME
async function selectCamada(nome) {
    const command = [{"_obj":"select","_target":[{"_name":nome,"_ref":"layer"}],"makeVisible":false}];
    await app.batchPlay(command, {});
}

async function stayleCamdadaADD(style_name) {
    const command = [{ "_obj": "applyStyle", "_target": [ { "_name": style_name, "_ref": "style" } ], "group": true, "to": { "_enum": "ordinal", "_ref": "layer", "_value": "targetEnum" } }];
    await app.batchPlay(command, {});
}



///// FUNC ZOOM  DOCUMENTO NA TELA
async function ZoomDOC(valor) {
    const zoom=[ "fitOnScreen", "zoomOut", "zoomIn" ];
    const command = [{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value": zoom[valor]}]}];
    await app.batchPlay(command, {});
}

///// FUNC RESETAR CONFIGS 
async function resetarConfigs(){
    try {
        core.executeAsModal(async () => {
            try { dellTempStamp();  await app.batchPlay([  {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]},]); } catch (e) {}
            result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'count' }, { _ref: "snapshotClass", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });  
            etapas = result[0].count;
            app.activeDocument.activeHistoryState = app.activeDocument.historyStates [Number(result[0].count)-1];
            for (let i = 0; i <etapas; i++) {
                app.batchPlay([{"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}, {"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}]);
            };
            ZoomDOC(0); ZoomDOC(1); 
        });
        
    } catch (e) {alert(e)}
};

//////// CRIAR DOCUMENTO PARA ESTAMPAS
async function docEstampa(hDoc, wDoc, nome){
    try {
        await core.executeAsModal(async () => { 
            await app.batchPlay([
                {"_obj":"make","documentID":428,"new":{"_obj":"document","artboard":false,"autoPromoteBackgroundLayer":false,"depth":8,"fill":{"_enum":"fill","_value":"white"},"guides":[],"height":{"_unit":"distanceUnit","_value":hDoc},"mode":{"_class":"RGBColorMode"},"name":nome,"pixelScaleFactor":1.0,"profile":"sRGB IEC61966-2.1","resolution":{"_unit":"densityUnit","_value":200.0},"width":{"_unit":"distanceUnit","_value":wDoc}}
               }])
          //  await ZoomDOC(1); 
        })
    } catch (error) {alert(error)}
}


///// ADICIONAR SELEÇÃO NO DOCUMENTO
async function ADDselecaoDOC() {
    const command = [
        {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}}
    ];
    await app.batchPlay(command, {});
}

///// ADICIONAR SELEÇÃO SHAPES NO DOCUMENTO
async function ADDselecaoShapes(bottom,left,right,top,id,m) {
    medida =[ "distanceUnit", "pixelsUnit"];
    const command = [
        {"_obj":"set","_target":[{"_property":"workPath","_ref":"path"}],"to":{"_obj":"customShape","bottom":{"_unit":medida[m],"_value":bottom},"keyOriginType":9,"left":{"_unit":medida[m],"_value":left},"name":id,"right":{"_unit":medida[m],"_value":right},"top":{"_unit":medida[m],"_value":top}}}
    ];
    await app.batchPlay(command, {});
}

///// CRIAR  SELEÇÃO (BOUNDS METHOD)
async function criarSelecao(t, l, r, b){
    await app.batchPlay( [{ "_obj": "set", "_target": [ { "_property": "selection", "_ref": "channel" } ], "to": { "_obj": "rectangle", "bottom": { "_unit": "pixelsUnit", "_value": b }, 
    "left": { "_unit": "pixelsUnit", "_value": l }, "right": { "_unit": "pixelsUnit", "_value": r }, "top": { "_unit": "pixelsUnit", "_value": t } } }], {});
 };

///// CARREGAR  SELEÇÃO (CANAL ALPHA)
async function carregarSelecao() {
    const command = [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_name":"Alpha 1","_ref":"channel"}}];
    await app.batchPlay(command, {});
}

///// ADICIONAR UMA CAMADA DE COR
async function solidColorCamada(red, grain, blue) {
    const command = [
        {"_obj":"make","_target":[{"_ref":"contentLayer"}],"using":{"_obj":"contentLayer","type":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":blue,"grain":grain,"red":red}}}}
    ];
    await app.batchPlay(command, {});
}

///// ALTERAR MODO DE TELA
async function modoDeTela(method) {
    try {
        telaModo =[ "screenModeFullScreen", "screenModeStandard"];
        await app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":telaModo[method]}]},], {});
    } catch (err) {alert(err)}
}

///// ROTACIONA O DOCUMENTO
async function rotacionarDOC(method){
    core.executeAsModal(async () => {
       const command = [{"_obj":"rotateEventEnum","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"angle":{"_unit":"angleUnit","_value":method}}];
       await app.batchPlay(command, {});
  });
}

//////// OBTER O INDEX DO DOCUMENTO ATIVIO
async function  obterIndexDocAtivo(){
    try {
        core.executeAsModal( async() => {
               const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'itemIndex' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
               indexDA = result["0"].itemIndex;
         })
    } catch (err) {}
}

//////// ASSEGURA Q TODAS AS ALTERAÇÃO NO IMAGEM NAO SERAM REMOVIDAS
async function refeshDocumento(){
    try {
        core.executeAsModal(async () => {
            const doc = app.activeDocument;  
            doc.activeHistoryState = doc.historyStates [0];
            app.batchPlay([{"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}],{ });
            doc.activeHistoryState = doc.historyStates[doc.historyStates.length-1];
            app.batchPlay([{"_obj":"make","_target":[{"_ref":"snapshotClass"}],"from":{"_property":"currentHistoryState","_ref":"historyState"},"name":app.activeDocument.name,"using":{"_enum":"historyState","_value":"fullDocument"}}],{ });
        });
    } catch (err) {alert(err) }
}

////// OBTER VALOR DO ZOOM
async function getZoomInform(){
    const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'zoom' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
    zoomValue  = result[0].zoom._value*100;
}

////// ZOOM CAMADA APROXIMAR
async function ZoomCamada(){
    app.batchPlay( [ {"_obj":"select","_target":[{"_name":"Capa_Config","_ref":"layer"}],"layerID":[1022],"makeVisible":false},{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"fitLayersOnScreen"}]}], { synchronousExecution: false, });
}

////////// CARREGAR SUPORTS (ACTIONS, CHAPES ETC....)
async function importSuportes(suports,suportRef) {
    try {
        const fs = require('uxp').storage.localFileSystem;
        const pluginFolder = await fs.getPluginFolder();
        const fileSuporte = await pluginFolder.getEntry(`suport/${suports}`);
        const suportFiles = action.validateReference({_ref: suportRef, _name: fileSuporte.name.match(/(.*)\.[^\.]+$/)[1]})
        if(suportFiles == true){} else{app.open(fileSuporte);}
    } 
    catch (err) {alert(err) }
}

 ////////// ABRIR O EXPLORADOR DE ARQUIVO DA PASTA TARGET 
 async function exibirDiretorio(caminho){
    try {
            await criarPasta("file:/C:/",  "temp");
            const tempFolder =  await fs.getEntryWithUrl("file:/C:/temp");  
            const fileBat = await tempFolder.createFile("{987-321-654}.bat", { overwrite: true });
            fileBat.write(`@echo off\nchcp 65001\nstart "" "${path}"`);
            //await vbsExecutarBat();
            shell.openPath("file:/C:/temp/{987-321-654}.bat");
    } catch (err) {alert(err) }
}

 //////////  EXECUTA O ARQUIVO BAR POR VBS LOCAL EVITANDO A JANELA CMD.
async function vbsExecutarBat(){
        VBSexecutaBAT = await pluginFolder.getEntry("suport/{987-321-654}.vbs"); 
        ///// EXECUTA BAT OU VBS SE EXISTIR OU NÃO ACENTUAÇÃO NA STRING PATH
        const normalizedString = path.normalize("NFD");
        const acentuacao = normalizedString.length > path.length;
        if(acentuacao == true){shell.openPath("file:/C:/temp/{987-321-654}.bat");}
        else{await shell.openPath(VBSexecutaBAT.nativePath);};
}

////////// CRIAR UMA SUBPASTA
async function criarPasta(diretorio, folderName){
 try {
    const fs = require('uxp').storage.localFileSystem;
    const entrada = await fs.getEntryWithUrl(diretorio); 
    const token = await fs.createSessionToken(entrada)
    const folder = await fs.getEntryForSessionToken(token);
    await folder.createFolder(folderName );
 } catch (err) {}
}

//////  OBTER VALORES INICIAIS DA CAMADA  COM FRAMES
async function statusBorder(){
    try {
      result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'AGMStrokeStyleInfo' }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false,});
      borderSize = result[0].AGMStrokeStyleInfo.strokeStyleLineWidth._value; //document.querySelector("#border").value= borderSize;
      red   = result[0].AGMStrokeStyleInfo.strokeStyleContent.color.red;
      grain = result[0].AGMStrokeStyleInfo.strokeStyleContent.color.grain;
      blue  = result[0].AGMStrokeStyleInfo.strokeStyleContent.color.blue;
      /////// OBERT CORES
         rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
            hex = x.toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }).join('')
          ColorBH = rgbToHex(parseInt(red), parseInt(grain), parseInt(blue));
          ColorBHSolicitada =true;
        } 
    catch (e) {}
}

/////// MARCAR DE VINCO LAMIN 1
async function vincadoTarget(selecao, sizeMaca){
    await core.executeAsModal( async() => {
        const valor = selecao;
        metDorso=valor/2
        const wsDOC = app.activeDocument.width;
        const hsDOC  = app.activeDocument.height;
        await app.batchPlay( [ 
            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":hsDOC},"left":{"_unit":"pixelsUnit","_value":wsDOC/2-metDorso},"right":{"_unit":"pixelsUnit","_value":wsDOC/2+metDorso},"top":{"_unit":"pixelsUnit","_value":0.0}}},
            {"_obj":"make","_target":[{"_ref":"layer"}],"layerID":72}, {"_obj":"stroke","color":{"_obj":"HSBColorClass","brightness":0.0,"hue":{"_unit":"angleUnit","_value":0.0},"saturation":100.0},"location":{"_enum":"strokeLength","_value":"inside"},"mode":{"_enum":"blendMode","_value":"normal"},"opacity":{"_unit":"percentUnit","_value":100.0},"width":2},
            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}},
            {"_obj":"contract","by":{"_unit":"pixelsUnit","_value":sizeMaca},"selectionModifyEffectAtCanvasBounds":true},{"_obj":"delete"},{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}
        ]);
    });
}
///////////::::::::::::::::

/////  OBTER VALORES RGB E HEXADECILMAL
async function getColorPickerRGBH(btn){
    await core.executeAsModal( async() => {       
        const result = await app.batchPlay([{ _obj: "showColorPicker", _target: [{ _ref: "application" }]}],{ });
        const color = result[0].RGBFloatColor ?? null
        color && (document.querySelector(btn).style.backgroundColor = `rgb(${color.red} ${color.grain} ${color.blue})`)
        const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex	}).join('');
        newcolorhex = rgbToHex(parseInt(color.red), parseInt(color.grain), parseInt(color.blue));
        red= parseInt(color.red); grain= parseInt(color.grain); blue= parseInt(color.blue);
        corSolicitada=true;
    });
}

/////  CONFIGS  AJUST COLOR
function configsAjusteCor(){
    try {
        //////CONFIGS ABA MENU AJUSTE
            list_MD = document.getElementById("list_MD");
            document.querySelector("#aj1").classList.add('ajustON');
            const iconsBtn = document.getElementsByClassName("ajustIcon");
            const tBtn = Array.from(iconsBtn);
            for(let i = 0; i < tBtn.length; i++){ 
                tBtn[i].addEventListener('click', (event) => {
                    for(let i = 0; i < tBtn.length; i++){
                        index = tBtn.indexOf(event.currentTarget);
                        tBtn[i].classList.remove('btnAjustClicado');
                    }
                    event.currentTarget.classList.add('btnAjustClicado');
                    document.querySelector("#aj1").classList.remove('ajustON');
                    document.querySelector("#aj2").classList.remove('ajustON');
                    document.querySelector("#aj3").classList.remove('ajustON');
                    if(index===0){ 
                        document.querySelector("#aj1").classList.add('ajustON');
                        document.querySelector("#tituloAba").textContent= "BALANÇO DE CORES";
                    }
                    if(index===1){ 
                        document.querySelector("#aj2").classList.add('ajustON');
                        document.querySelector("#tituloAba").textContent= "MATIZ E SATURAÇÃO";
                    }
                    if(index===2){ 
                        document.querySelector("#aj3").classList.add('ajustON');
                        document.querySelector("#tituloAba").textContent= "LUMINOSIDADE";
                    }
                });
            }
            /////////:::::::::::::::::::::::::::::
            const sld1 = document.querySelector("#sld1");
            const sld2 = document.querySelector("#sld2");
            const sld3 = document.querySelector("#sld3");
            const sld4 = document.querySelector("#sld4");
            const sld5 = document.querySelector("#sld5");
            const sld6 = document.querySelector("#sld6");
            const sld7 = document.querySelector("#sld7");
            const sld8 = document.querySelector("#sld8");
            const sld11 = document.querySelector("#sld11");
    
            sld1.addEventListener("change", async (func) => {
                document.querySelector("#vsld1").innerHTML = `${func.target.value}%`
                await ajusteColor(1, "ColorBalance", sld1.value, sld2.value, sld3.value);
                }) 
            sld2.addEventListener("change", async (func) => {
                document.querySelector("#vsld2").innerHTML = `${func.target.value}%`
                await ajusteColor(1, "ColorBalance", sld1.value, sld2.value, sld3.value);
                }) 
            sld3.addEventListener("change", async (func) => {
                document.querySelector("#vsld3").innerHTML = `${func.target.value}%`
                await ajusteColor(1, "ColorBalance", sld1.value, sld2.value, sld3.value);
                }) 
            sld4.addEventListener("change", async (func) => {
                document.querySelector("#vsld4").innerHTML = `${func.target.value}%`
                await ajusteColor(2,"Hue/Saturar",sld4.value, sld5.value, sld6.value);
                }) 
            sld5.addEventListener("change", async (func) => {
                document.querySelector("#vsld5").innerHTML = `${func.target.value}%`
                await ajusteColor(2,"Hue/Saturar",sld4.value, sld5.value, sld6.value);
                }) 
            sld6.addEventListener("change", async (func) => {
                document.querySelector("#vsld6").innerHTML = `${func.target.value}%`
                await ajusteColor(2,"Hue/Saturar",sld4.value, sld5.value, sld6.value);
                }) 
            sld7.addEventListener("change", async (func) => {
                document.querySelector("#vsld7").innerHTML = `${func.target.value}%`
                await ajusteColor(3,"Brigh/Contra",sld7.value, sld8.value, null);
                }) 
            sld8.addEventListener("change", async (func) => {
                document.querySelector("#vsld8").innerHTML = `${func.target.value}%`
                await ajusteColor(3,"Brigh/Contra",sld7.value, sld8.value, null);
                }) 
            sld11.addEventListener("change", async (func) => {
                document.querySelector("#vsld11").innerHTML = `${func.target.value}%`
                await ajusteColor(5,"Conteudo",sld11.value, null, null);
                }) 
    
            async function ajusteColor(ajuste, name, v1, v2, v3){
                const {executeAsModal} = require("photoshop").core;
                const {batchPlay} = require("photoshop").action;
                async function colorBalance() {
                    if(ajuste === 1){
                        await batchPlay( [ { _obj: "set", _target: [ { _ref: "adjustmentLayer", _name: name, _value: "targetEnum" } ], to: { _obj: "colorBalance", midtoneLevels: [ v1, v2, v3 ] }, _options: { dialogOptions: "dontDisplay" } } ], { modalBehavior: "wait" } );
                        }
                    if(ajuste === 2){
                        await batchPlay( [{_obj:"set",_target:[{_ref:"adjustmentLayer", _name: name, _value:"targetEnum"}],to:{_obj:"hueSaturation",presetKind:{_enum:"presetKindType",_value:"presetKindCustom"},adjustment:[{_obj:"hueSatAdjustmentV2",hue: v1,saturation: v2, lightness: v3}]},_options:{dialogOptions:"dontDisplay"}}], { modalBehavior: "wait" } );
                        }
                    if(ajuste === 3){
                        await batchPlay( [{_obj:"set",_target:[{_ref:"adjustmentLayer", _name: name, _value:"targetEnum"}],to:{_obj:"brightnessEvent",brightness: v1,center: v2,useLegacy:false},_options:{dialogOptions:"dontDisplay"}}], { modalBehavior: "wait" } );
                        }
                    if(ajuste === 4){
                        await batchPlay( [{ _obj: "set", _target: [ { _ref: "layer", _name: name,  _value: "targetEnum" } ], to: { _obj: "layer", opacity: { _unit: "percentUnit", _value: v1 } }, _options: { dialogOptions: "dontDisplay" } }],{synchronousExecution:false,modalBehavior:"wait"} );
                        }
                    if(ajuste === 5){
                            await batchPlay( [{ _obj: "set", _target: [ { _ref: "filterFX", _index: 1 }, { _ref: "layer", _name: name,  _value: "targetEnum" } ], filterFX: { _obj: "filterFX", filter: { _obj: "adaptCorrect", shadowMode: { _obj: "adaptCorrectTones", amount: { _unit: "percentUnit", _value: v1 }, width: { _unit: "percentUnit", _value: 0 }, radius: 0 }, highlightMode: { _obj: "adaptCorrectTones", amount: { _unit: "percentUnit", _value: 0 }, width: { _unit: "percentUnit", _value: 0 }, radius: 0 }, blackClip: 0, whiteClip: 0, center: 0, colorCorrection: 0 } }, _options: { dialogOptions: "dontDisplay" } }],{synchronousExecution:false,modalBehavior:"wait"} );  
                        };
                        await app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}]);
                };
                async function runModalFunction() {await executeAsModal(colorBalance);}
                await runModalFunction();
            };
    
            ////// CARREGAR JALNELA RENOMEAR CAMADA
            async function dlgADDpresAjuste() {
                try {
                    dlg = document.querySelector("#dlgAjuste");
                    dlg.show({ title: `Adionar Presets`, resize: "both", size: { width:270, height:80}})
                    dlg.innerHTML = ` <style> .ap_Container { width: 100%; display: flex; flex-direction: column; flex-wrap: wrap; align-items: center; border: 1px solid rgb(65, 65, 65); padding: 5px; background: linear-gradient(to bottom,  #919191 1%, #919191 5%, #6f6f6f 5%,#676767 44%, #5d5d5d 100%); border-radius: 5px; } </style> <!-- //////// DIALOGO LAYOUT -->  <div class="ap_Container"> <div style="width: 100%; display: flex; align-items: center;  padding: 10px;"> <input type="text"  id="et_new_preset" value="Novo Preset"  style="width: 120px; height: 23px; padding: 2px; margin: 0px; "> <div class="btnMedio" id="ap_btn1" style="width: 50px; margin: 1px;">Fechar</div> <div class="btnMedio" id="ap_btn2" style="width: 50px; margin: 1px;">OK</div>  </div>`;
                    /////////:::::::::::::::::
                    setTimeout(() => document.querySelector("#et_new_preset").focus(), 16);
                    ///////// OUVINTES DE EVENTOS AQUI!
                    document.querySelector("#ap_btn1").addEventListener("click", async () => {
                            document.querySelector('#dlgAjuste').close('OK');
                        });
                    document.querySelector("#ap_btn2").addEventListener("click", async () => {
                            novoItemADD();
                            // setTimeout(() => document.querySelector("#et_new_preset").focus(), 16);
                        });
                } catch (err) {alert(err)};
            };////////////:::::::::::::
    
            ////// PEDEFINISSÕES CONFIG
            try {
                /////// CARREGA DINAMICAMENTE A LISTA
                list_MD = document.getElementById("list_MD");
                conteudo_Obj = new Array();
                //// RESGATA DO LOCALSTORAG SE NAO EXISTIR ADICIONA OS ITENS PADROES:
                conteudo_Obj = JSON.parse(localStorage.getItem("ajustSave")) || [
                    {nome: 'Default',	sld01: 0, sld02: 0, sld03: 0, sld04: 0, sld05: 0, sld11: 0, sld07: 0, sld08: 0, sld06: 0 }, 
                ];	
                ajustSave = conteudo_Obj.map(function (itemList) { return itemList.nome });
                ////////// FUNC ADD OS ITENS DO ARRAY NA LISTA
                 for (var i = 0; i < ajustSave.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<sp-menu-item><label class="sp-dropDowC">${ajustSave[i]}</label></sp-menu-item>`); } //// Adiciona os itens atualizados;
                console.log(conteudo_Obj);
            }
            catch (e) {}
            ///////////::::::::::::::::::::
    
            ///// CRIAÇÃO DE PRESSETES
            function novoItemADD(){
                const list_MD = document.getElementById("list_MD");
                try {
                    nomePreset = "" + document.getElementById("et_new_preset").value;
                    var presetsExistents = conteudo_Obj.map(function (itemList) {return itemList.nome});
                    if(nomePreset == "" || nomePreset == "Novo Preset") { alertar("Adicione nome do preset!");  return;}
                    else if(presetsExistents.includes(nomePreset) == true) {alertar(`"${nomePreset}" já consta na lista!\n Adicione outro nome!`)}
                    else{
                        conteudo_Obj.push({
                                nome: nomePreset,	
                                sld01: document.querySelector("#sld1").value, 
                                sld02: document.querySelector("#sld2").value, 
                                sld03: document.querySelector("#sld3").value, 
                                sld04: document.querySelector("#sld4").value, 
                                sld05: document.querySelector("#sld5").value, 
                                sld11: document.querySelector("#sld11").value, 
                                sld07: document.querySelector("#sld7").value, 
                                sld08: document.querySelector("#sld8").value, 
                                sld06: document.querySelector("#sld6").value, 
                         }); 
                        var ajustSave = conteudo_Obj.map(function (itemList) { return itemList.nome });
                        localStorage.setItem("ajustSave", JSON.stringify(conteudo_Obj));
                        list_MD.innerHTML = "";
                        for (var i = 0; i < ajustSave.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<sp-menu-item><label class="sp-dropDowC">${ajustSave[i]}</label></sp-menu-item>`); } //// Adiciona os itens atualizados;
                        list_MD.selectedIndex=ajustSave.length-1;
                        document.querySelector('#dlgAjuste').close('OK');
                    }
                }
                catch (err) {alert(err)};
            };
       
            //////////ABRI DIALOGO ADD PRESETS
            document.querySelector("#btnAddPresset").addEventListener("click", async (func) => {dlgADDpresAjuste();}) ;
            ////////// REMOVE ITEM SELECIONADDO
            document.querySelector("#btnRemover").addEventListener("click", async evt => {
                try {
                    const list_MD = document.getElementById("list_MD");
                    const item = Number(list_MD.selectedIndex);
                    if (item ==0) { alertar("Esse ítem não pode ser deletado!")}
                    else { conteudo_Obj.splice(item, 1); atualizaLista();}
                    list_MD.selectedIndex=item-1;
                    carregarValores();
                } catch (err) {list_MD.selectedIndex=0}
            });
            ///////////////////////
            function atualizaLista() {
                try {
                    const list_MD = document.getElementById("list_MD");
                    var ajustSave = conteudo_Obj.map(function (itemList) { return itemList.nome });
                    localStorage.setItem("ajustSave", JSON.stringify(conteudo_Obj)); //// Salva no localStorage
                    conteudo_Obj = JSON.parse(localStorage.getItem("ajustSave"));  //// Resgata do localStorage
                    list_MD.innerHTML = "";  //// Esvazia a lista;
                    for (var i = 0; i < ajustSave.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<sp-menu-item ><label class="sp-dropDowC">${ajustSave[i]}</label></sp-menu-item>`); } //// Adiciona os itens atualizados;
                } catch (err) {}
            }
            //////////////////////
    
            ///////// JS PREDEFINIÇÕES
            list_MD.addEventListener("change", evt => {	carregarValores();})
    
            async function carregarValores(){
                try {
                    conteudoOBJ=[];
                    sliders = document.getElementsByClassName("slider");
                    valors = document.getElementsByClassName("valoes"); 
                    sel = list_MD.selectedIndex;
                    conteudoOBJ.push(conteudo_Obj[sel].sld01);
                    conteudoOBJ.push(conteudo_Obj[sel].sld02);
                    conteudoOBJ.push(conteudo_Obj[sel].sld03);
                    conteudoOBJ.push(conteudo_Obj[sel].sld04);
                    conteudoOBJ.push(conteudo_Obj[sel].sld05);
                    conteudoOBJ.push(conteudo_Obj[sel].sld11);
                    conteudoOBJ.push(conteudo_Obj[sel].sld07);
                    conteudoOBJ.push(conteudo_Obj[sel].sld08);
                    conteudoOBJ.push(conteudo_Obj[sel].sld06);
                    for (var i=0;i<sliders.length;i++){	document.getElementById(sliders[i].id).value=conteudoOBJ[i];}
                    for (var i=0;i<sliders.length;i++){	document.getElementById(valors[i].id).innerHTML = `${conteudoOBJ[i]}%`};
                    await updatColorAjuste();
                } catch (err) {list_MD.selectedIndex=0}
            }
    
            async function updatColorAjuste(){
                await ajusteColor(1, "ColorBalance", sld1.value, sld2.value, sld3.value);
                await ajusteColor(1, "ColorBalance", sld1.value, sld2.value, sld3.value);
                await ajusteColor(1, "ColorBalance", sld1.value, sld2.value, sld3.value);
                await ajusteColor(2, "Hue/Saturar",sld4.value, sld5.value, sld6.value);
                await ajusteColor(2, "Hue/Saturar",sld4.value, sld5.value, sld6.value);
                await ajusteColor(2, "Hue/Saturar",sld4.value, sld5.value, sld6.value);
                await ajusteColor(3, "Brigh/Contra",sld7.value, sld8.value, null);
                await ajusteColor(3, "Brigh/Contra",sld7.value, sld8.value, null);
                await ajusteColor(5,"Conteudo",sld11.value, null, null);
            }
            list_MD.selectedIndex=0;
    } catch (err) {console.log(err) }
};
//////////::::::::::::::::::::::::

////////// CONFIGS  AJUST DE ENQUADRAMENTO
async function configsPositions(ajuste, valor) {
    try {
        await core.executeAsModal(async () => {
            const doc = app.activeDocument;
            doc.layers.forEach(layer => {
                if (layer.kind == "group") {
                    layer.layers.forEach(camada => {
                        if (camada.name == "Conteudo") {
                            if (ajuste === 1) {camada.scale(valor, valor)}
                            if (ajuste === 2) {camada.scale(valor, valor)}
                            if (ajuste === 3) {camada.translate(valor, 0)}
                            if (ajuste === 4) {camada.translate(0, valor)}
                            if (ajuste === 5) {
                                camada.scale(50, 50);
                                const docWidth = getwDOC; 
                                const bounds = camada.bounds;
                                const w = bounds.right - bounds.left;
                                f1 = ((docWidth / w) * 100);
                                camada.scale(f1, f1);
                            }
                            if (ajuste === 6) {
                                camada.scale(50, 50);
                                const docWidth = gethDOC;
                                const bounds = camada.bounds;
                                const w = bounds.bottom - bounds.top;
                                f1 = ((docWidth / w) * 100);
                                camada.scale(f1, f1); 
                            }
                        };
                        app.activeDocument.activeLayers[0].opacity=100;
                    })
                }
            });
            await app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}], {});
        });
    } catch (err) {alert(err)}
};
//////////::::::::::::::::::::::::

////////OUVINTES BOÕES DE ENQUADRAMENTO
function controlPosition(b1, b2, b3, b4, b5, b6, b7, b8 ){
    try {
        document.querySelector(b1).addEventListener('click', (event) => {configsPositions(1, 102);})
        document.querySelector(b2).addEventListener('click', (event) => {configsPositions(2, 98);})
        document.querySelector(b3).addEventListener('click', (event) => {configsPositions(3, -10);})
        document.querySelector(b4).addEventListener('click', (event) => {configsPositions(3, 10);})
        document.querySelector(b5).addEventListener('click', (event) => {configsPositions(4, -10);})
        document.querySelector(b6).addEventListener('click', (event) => {configsPositions(4, 10);})
        document.querySelector(b7).addEventListener('click', (event) => {configsPositions(5, null);})
        document.querySelector(b8).addEventListener('click', (event) => {configsPositions(6, null);})
       
        document.querySelector(b1).setAttribute('title', 'Tecla: Somar');
        document.querySelector(b2).setAttribute('title', 'Tecla: Subtrair');
        document.querySelector(b3).setAttribute('title', 'Tecla: Seta mover a esquerda');
        document.querySelector(b4).setAttribute('title', 'Tecla: Seta mover a direita');
        document.querySelector(b5).setAttribute('title', 'Tecla: Seta para cima');
        document.querySelector(b6).setAttribute('title', 'Tecla: Seta para baixo');
        document.querySelector(b7).setAttribute('title', 'Tecla F1');
        document.querySelector(b8).setAttribute('title', 'Tecla F2');
    } catch (err) {alert(err) }
};

/////////// CARREGAR CAMADA AJUSTE DE CORES 
async function loadAjustes() {
    const fs = require("uxp").storage.localFileSystem;
    const pluginFolder = await fs.getPluginFolder();
    const theTemplate = await pluginFolder.getEntry("icons/AjustColor.psd");
    const token = await fs.createSessionToken(theTemplate)
    await app.batchPlay([
        {"ID":64,"_obj":"placeEvent","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"null":{"_kind":"local","_path":token},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":0.0},"vertical":{"_unit":"pixelsUnit","_value":0.0}},"replaceLayer":{"_obj":"placeEvent","to":{"_id":64,"_ref":"layer"}}},
        {"_obj":"placedLayerConvertToLayers"},
        {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","mode":{"_enum":"blendMode","_value":"passThrough"}}},
        {"_obj":"select","_target":[{"_name":"Conteudo","_ref":"layer"}],"layerID":[1],"makeVisible":false},
    ], {});
 };

////// CARREGAR JALELA DE AJUSTE DE CORES
async function janelaAjustesx() {
    fetch('html/Ajustes.html').then(response => response.text()).then(data => {
        conteudoAjuste = document.querySelector("#dlgCorresores");
        conteudoAjuste.show({ title: `PS-fxrios: Ajuste de Cores`, resize: "both", size: { width:250, height:220}})
        conteudoAjuste.innerHTML = data;
        ////// TODOS OS addEventListener AQUI!
        configsAjusteCor();
        ///////// FECHAR O MENU DE AJUSTE DE CORES
        const closeAjuste = document.querySelector("#btnCloseAj");
        closeAjuste.addEventListener('click', (event) => {
            conteudoAjuste.close();
        });
    });
};

 /////////// CARREGAR CAMADA AJUSTE DE CORES 
async function estampaGuias(){
    doc= app.activeDocument;
    gethDOC = app.activeDocument.height;
    getwDOC = app.activeDocument.width
    await doc.guides.add(Constants.Direction.VERTICAL, 0); 
    await doc.guides.add(Constants.Direction.HORIZONTAL, 0);
    await doc.guides.add(Constants.Direction.VERTICAL, getwDOC-1 );
    await doc.guides.add(Constants.Direction.HORIZONTAL, gethDOC-1);
 }

////////////RESETAR ENQUADRAMENTOI
 async function resetPosition(){
    await core.executeAsModal(async () => {
        await app.batchPlay([
            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}},
            {"_obj":"align","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"alignToCanvas":true,"using":{"_enum":"alignDistributeSelector","_value":"ADSCentersH"}},
            {"_obj":"align","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"alignToCanvas":true,"using":{"_enum":"alignDistributeSelector","_value":"ADSCentersV"}},
            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}
        ], {});
    })
 }

 ////////////DADOS DA LEGENDA
 async function legendaDados(){
    resol=app.activeDocument.resolution;
    path = app.activeDocument.path.replace(/\\[^\\]*$/, "").replace(/\\/g, "/");
    pastas =  path.split("/");
    data = pastas[2];
    dataRegex = /^\d{2}.\d{2}.\d{4}$/; // Expressão regular para verificar se é uma data no formato "aaaa-mm-dd"
    dirName = data; // Nome do diretório que será verificado
    if (dataRegex.test(dirName)) {
        digShop = "SHOP" || "SHOPP" ;
        if ( path.includes(digShop)) {Loja="Filial SHOP"; cliente=pastas[4];} else {Loja="Matriz"; cliente=pastas[3]}
    }
    else{
        data = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`;
        Loja="Matriz";  cliente =  path.split('/').pop();
    }
};
 
////////// MENSAGEM DE ALERTA OU CONFIRMA PSFXRIOS;
async function msgAlertaPxfxrios(txtIcon,  txtMsg, txtBtn1, txtBtn2, btn2False, color, titulo) {
    try {
        msgSize= txtMsg.split("<br>")[0].length;  ///////// VERIFICA A QUANTIDADE DE LETRAS DA MSG
        if(msgSize<13 ){dw =180}
        else if(msgSize>20 && msgSize<33){dw =290}
        else if(msgSize>34){dw =340} else{dw=240};
        //////////////////////////////////////////////////////
        dlg = document.querySelector("#dlgAlertConfima");
        dlg.uxpShowModal({ title: `PS-fxrios: ${titulo}`, size: { width: dw, height:100}})
        dlg.innerHTML = `<style>
        .Drname_Container {
            width: 100%;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            align-items: center;
            border: 1px solid rgb(134, 133, 133);
            padding: 10px;
            background-color: #7c7979;
        }
    </style> <!-- //////// DIALOGO LAYOUT -->
    <div class="Drname_Container">
        <div style="display: flex; align-items: center;"> <label id="iconLabel" style="font-family: UXPSfxIcon; font-size: 50px; color: rgb(83, 83, 83); margin: 7px; margin-left: 12px;">W</label> <label id="msgLabel" style="width: 100%; color: aliceblue;font-size: 13px;">Essa estampa já foi impressa! Deseja abrir outro documento?</label> </div>
        <div style="width: 100%; display: flex; align-items: center; margin-top: 5px;  padding: 5px; justify-content: flex-end;  background-color: #484949;""> <div class=" btnMedio" id="confirm_btn1" style="width:70px; margin: 2px;">Não</div>
        <div class="btnMedio btn-Executar" id="confirm_btn2" style="width:70px; margin: 2px;">Sim</div>
        <sp-checkbox  id="confDLGfocus" size="s" style="position: absolute; top: -50px;" ></sp-checkbox >
    </div>`;
        /////////:::::::::::::::::
        ///////// OUVINTES DE EVENTOS AQUI!
        document.querySelector("#iconLabel").innerHTML= txtIcon;    
        document.querySelector("#iconLabel").style.color = color;     
        document.querySelector("#msgLabel").innerHTML= txtMsg;
        document.querySelector("#confirm_btn1").innerHTML= txtBtn1;
        document.querySelector("#confirm_btn2").innerHTML= txtBtn2;
        document.querySelector("#confirm_btn2").style.display = btn2False;
        document.querySelector('#confirm_btn1').setAttribute("title", "Tecla: 'N' para Continuar!")
        document.querySelector('#confirm_btn2').setAttribute("title", "Tecla: 'S' para Cancelar!")

        dlg.addEventListener('load', evt => {
            setTimeout(() =>{ document.getElementById('confDLGfocus').focus();}, 150)
        });

        document.querySelector("#confirm_btn1").addEventListener("click", () => {
            dlg.close('OK'); Start=false; dialogsEventsFalse(); return
         });
    } catch (err) {}
};
function alertar(txtMsg){ msgAlertaPxfxrios("V", txtMsg, "OK", "Sim", "none", "#f3f1f1", "Alerta!");}
function error(txtMsg){ msgAlertaPxfxrios("V", txtMsg, "OK", "Sim", "none", "#e6e6e6", "Error - Operação Inválida!");}
function confiramar(txtMsg){ msgAlertaPxfxrios("W", txtMsg, "Não", "Sim", "block", "#e6e6e6", "Confirmar");}

////// CARREGAR JALELA PROGESS
async function progressDLG(msg) {
    try { documentoAtivo = app.activeDocument.name } catch (error) {documentoAtivo=""}
    const dlgProg = document.querySelector("#processServic");
    dlgProg.show({ title: "Processing", resize: "both", size: { width:250, height: 40} })
    dlgProg.innerHTML = `<style>
    .progConteudo {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        border: 1px solid rgb(134, 133, 133);
        padding: 0;
        background-color: #353535;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 10px;
    }
  </style>
  <!-- //////// DIALOGO LAYOUT -->
  <div class="progConteudo">
    <div style="display: flex; align-items: flex-start; position: relative; margin-left: 10px;">
      <label id="iconLabel" style=" font-family: UXPSfxIcon; font-size: 70px; color: rgb(211, 216, 214); margin: 7px; margin-left: 12px; margin-bottom: -5px; " >h</label > 
      <label id="txtMsgDLG" style="width: 80%; color: aliceblue; font-size: 13px; position: absolute; left: 80px; top: 28px;" ></label>
      <label id="NomeDoc"  class="sp-radio-txt etd" style="font-size: 10px; position: absolute; left: 85px; top: 48px;" >${documentoAtivo}</label>
    </div>
  </div>`;
    document.querySelector("#txtMsgDLG").innerHTML= msg;
};

/////////// ADICIONAR SNAPSHOT
async function creatSnapshot(nome){
    await app.batchPlay([
        {"_obj":"make","_target":[{"_ref":"snapshotClass"}],"from":{"_property":"currentHistoryState","_ref":"historyState"}},
        {"_obj":"select","_target":[{"_name":"Snapshot 1","_ref":"snapshotClass"}]},
        {"_obj":"set","_target":[{"_property":"currentHistoryState","_ref":"historyState"}],"to":{"_obj":"snapshotClass","name":nome}},
        {"_obj":"select","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}
    ], {});
};

////// RESETA TDS VALORES
async function restauraIniConfig(nome){
    try {
        await core.executeAsModal(async () => {
            await app.batchPlay([ 
                {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]},
                {"_obj":"select","_target":[{"_name":nome,"_ref":"snapshotClass"}]},
                {"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"fitOnScreen"}]}
            ]);
        });
    } catch (err) {alert(err)}
}

//////////// MODELO DE ESTAMPA
async function selSanpshots(method){
    await core.executeAsModal(async () => { 
        await app.batchPlay([{"_obj":"select","_target":[{"_name":method,"_ref":"snapshotClass"}]}], {}); 
        await ZoomDOC(0); 
    });
};

//////////// TRAZER O FOCU PARA AS JANELAS MODAIS
function modalFocus(d, fo){
    try {
        const input = document.createElement("input");
        input.type = "number";  input.id = fo; 
        input.setAttribute("style", "width: 1px;  height: 1px;  position: absolute;")
        d.appendChild(input);
        function focarDLG() { document.querySelector(`#${fo}`).focus(), 16 }    
        setTimeout(focarDLG, 100);
    } catch (err) {alert(err) }  
};

//////////// OBTEM E EXIBE A MINIATURA DA CAMADA ATIVA NA INTERFACE
async function getImageThumbnail(elementoDOM) {
    imageElement = document.getElementById(elementoDOM);
    try {
       await core.executeAsModal(async () => {
               let targetDocument = app.activeDocument;
               if (targetDocument == undefined) {throw "No open document"}
               let targetLayer = undefined;
            //    let activeLayers = targetDocument.activeLayers;
            //    if (activeLayers.length > 0) {
            //        targetLayer = activeLayers[0];
            //    };
               let options = {"documentID": targetDocument.id,
                   "targetSize": {"height": undefined, "width": undefined},
                   "componentSize": 8,
                   "applyAlpha": true,
                   "colorProfile": kSRGBProfile};
            //    if (targetLayer != undefined) {
            //        options["layerID"] = targetLayer.id;
            //    }
               let pixels = await imaging.getPixels(options);
               let jpegData = await imaging.encodeImageData({"imageData": pixels.imageData, "base64": true});
           
               let dataUrl = "data:image/jpeg;base64," + jpegData;
               imageElement.src = dataUrl;
               // Release image data immediately
               pixels.imageData.dispose();
         })
   } catch (err) {alert(err)}
};

/////////XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
/////////////// FUNÕES REFERENTES A AQUIVOS

//// MOVER CAPA ORIG PARA SUBPASTA
async function backupCapa(path){
  //  const path = app.activeDocument.path.replace(/\\[^\\]*$/, "") 
    rootFolder = await fs.getEntryWithUrl(`file:${path}`) 
    file = await rootFolder.getEntry(app.activeDocument.name);
    //verificar se a subpasta existe e se não a cria
    chekSubFolder = (await rootFolder.getEntries()).find(entry => entry.name.includes("nfz_Original"));
    if (chekSubFolder!=null) {}else{ subPasta = await rootFolder.createFolder("nfz_Original");}; 
    subfolderDir = subPasta.nativePath;
    exibirFolder = rootFolder.nativePath;
    moveSubfolder = await rootFolder.getEntry("nfz_Original");  
    await file.moveTo(moveSubfolder);

    ///// DESCARTAR ARQUIVOS NÃO JPG
    for (const separar of conteudoC) {
        const descartados = await rootFolder.getEntry(separar);
        await descartados.moveTo(moveSubfolder);
    }
}

function ordemNumerica(a, b) {
    const numA = a.match(/\d+/g).map(Number);
    const numB = b.match(/\d+/g).map(Number);
    for (let i = 0; i < Math.max(numA.length, numB.length); i++) {
        const diff = (numA[i] || 0) - (numB[i] || 0);
        if (diff !== 0) { return diff;}
    }
    return 0;
}
    
/////// SALVA A CAPARA CONFIGURADA  DENTRO DA PASTA RAÍZ
async function salvarDocumto(nome){
    const Entrada = await fs.getEntryWithUrl(`file:${path}`); 
    var myFile = await Entrada.createFile(newFileName, { overwrite: true });
    let jpegOptions = { quality: 100, embedColorProfile: true }
    app.activeDocument.saveAs.jpg(myFile, jpegOptions, true);
   // await backupCapa();
    await  document.querySelector('#process1DLG').close('OK');
}

///////// BUSCAR O ARQUIVO NA PASTA
async function abrirArquivo() {
    const fs = require("uxp").storage.localFileSystem;
    const app = require("photoshop").app; 
    capaFolder = await fs.getFileForOpening();
    if(capaFolder){await core.executeAsModal(() => app.open(capaFolder));}
};

//////////RENOEIAR ARQUIVOS DE UM DIRETÓRIO
async function renomeaAquivos(caminho, naoRenomear, recebeNome, digitos, rename, maiuscula ){
    try {
        const aFolder = await fs.getEntryWithUrl(caminho);
        const listArquivos = await aFolder.getEntries();
        conteudo = []; prevNomes=[]; tabelaNomes=[]; conteudoB=[]
       
        for (const aquivo of listArquivos) {
            if (aquivo.isFile) {
                const nomeArquivo = aquivo.name;
                 ////// OBTEM SOMENTE AQUIVOS QUE NÃO CONSTAM NO ARRAY [naoRenomear]
                if (!naoRenomear.includes(nomeArquivo)) { conteudo.push(nomeArquivo);}
            }
        }

        /////// FUNÇÃO PARA ORDENAR NUMERICAMENTE OS ARQUIVOS /// VIA CHATGPT
        try {       
            function ordemNumerica(a, b) {
                const numA = a.match(/\d+/g).map(Number);
                const numB = b.match(/\d+/g).map(Number);
                for (let i = 0; i < Math.max(numA.length, numB.length); i++) {
                    const diff = (numA[i] || 0) - (numB[i] || 0);
                    if (diff !== 0) { return diff;}
                }
                return 0;
            }
             // ATUALIZA O ARRAY COM A ORDEM CRESCENTE
            conteudo.sort(ordemNumerica);
        } catch (error) {}

        extensao = []
        let cont = 1;
        for (let i = 0; i < conteudo.length; i++) {
            const arquivo = conteudo[i];
            ///////OBTER A EXTENSÃO
            const separarEstensao = arquivo.split(".");
            extensao.push(separarEstensao[separarEstensao.length - 1])
            /////////////////////////////
            ///// CHECAR MAIÚSCULA E MINÚSCULA
            if (maiuscula === true) { novoNome = recebeNome.toUpperCase();} 
            else { novoNome = recebeNome; }
            const listaNomes = await aFolder.getEntry(arquivo);
            const decimal = `${cont}`.padStart(digitos, "0"); // ADICIONA O Nº DE CASAS 
            if (rename === true) {
                 await aFolder.renameEntry(listaNomes, `${novoNome}_${decimal}.${extensao[i]}`, {overwrite: true});
                 conteudoB.push(`${novoNome}_${decimal}.${extensao[i]}`)
             } 
            else { prevNomes.push(`${novoNome}_${decimal}.${extensao[i]}`); }
            cont++;
        }
        conteudo.forEach((nome, index) => { 
            tabelaNomes.push({nome: nome, novoNome:prevNomes[index] })
        })
    } catch (err) {alert(err)}
};
////////////////////xxxxxxxxxxxxxxxxxx

////////// DELETA A PASTA TEMPORADIA: TEMP_STAMPS
async function dellTempStamp(){
    try {
            await criarPasta("file:/C:/",  "temp");
            path= `${Usuario}/AppData/Roaming/temp_stamps`
            const tempFolder =  await fs.getEntryWithUrl("file:/C:/temp");  
            const fileBat = await tempFolder.createFile("deleteTSfolder.vbs", { overwrite: true });
            fileBat.write(`Set objFSO = CreateObject("Scripting.FileSystemObject")\nfolderPath = "${path}"\nIf objFSO.FolderExists(folderPath) Then\nobjFSO.DeleteFolder folderPath, True\nEnd If`);
            shell.openPath("file:/C:/temp/deleteTSfolder.vbs");
    } catch (err) {alert(err) };
};

 ////// CRIAR A IMAGEM THUMBNAIL
 async function saveThumbSTP(){   
    try {
          const tempStamp = await fs.getEntryWithUrl(`${Usuario}/AppData/Roaming/temp_stamps`); 
          const token = await fs.createSessionToken(tempStamp)
          const command = [ 
            {"_obj":"export","using":{"$DIDr":true,"$EICC":false,"$HScl":{"_unit":"percentUnit","_value":50.04686035613871},"$Mtt":true,"$MttB":255,"$MttG":255,"$MttR":255,"$Op":{"_enum":"$SWOp","_value":"$OpSa"},"$SHTM":false,"$SImg":true,"$SWch":{"_enum":"$STch","_value":"$CHsR"},"$SWmd":{"_enum":"$STmd","_value":"$MDNn"},"$SWsl":{"_enum":"$STsl","_value":"$SLUs"},"$VScl":{"_unit":"percentUnit","_value":50.0},"$obCS":{"_enum":"$STcs","_value":"$CS01"},"$obIA":false,"$obIP":"","$ohAA":true,"$ohAC":{"_enum":"$SToc","_value":"$OC03"},"$ohCA":false,"$ohEn":{"_enum":"$STen","_value":"$EN00"},"$ohIC":true,"$ohIZ":true,"$ohIn":-1,"$ohLE":{"_enum":"$STle","_value":"$LE03"},"$ohQA":true,"$ohTC":{"_enum":"$SToc","_value":"$OC03"},"$ohXH":false,"$olCS":false,"$olEC":{"_enum":"$STst","_value":"$ST00"},"$olNC":[{"$ncTp":{"_enum":"$STnc","_value":"$NC00"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC19"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC28"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC24"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC24"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC24"},"_obj":"$SCnc"}],"$olSH":{"_enum":"$STsp","_value":"$SP04"},"$olSV":{"_enum":"$STsp","_value":"$SP04"},"$olWH":{"_enum":"$STwh","_value":"$WH01"},"$ovCB":true,"$ovCM":false,"$ovCU":true,"$ovCW":true,"$ovFN":"thumbSTP.jpg","$ovNC":[{"$ncTp":{"_enum":"$STnc","_value":"$NC01"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC20"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC02"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC19"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC06"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC24"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC24"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC24"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC22"},"_obj":"$SCnc"}],"$ovSF":true,"$ovSN":"images","_obj":"SaveForWeb","format":{"_enum":"$IRFm","_value":"$PN24"},"in":{"_kind":"local","_path":token},"interfaceIconFrameDimmed":false,"transparency":true}},
            {"_obj":"close", "forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}, 
        ];
         await app.batchPlay(command, {});
    } catch (err) {alert(err)};
 };

  ////////// CARREGAR SUPORTS (ACTIONS, CHAPES ETC....)
async function importMokups(suports) {
    try {
        const fs = require('uxp').storage.localFileSystem;
        const pluginFolder = await fs.getPluginFolder();
        const fileSuporte = await pluginFolder.getEntry(`suport/mockups/${suports}`);
        app.open(fileSuporte)
    } 
    catch (err) {alert(err) }
}

 ////// CRIAR A IMAGEM THUMBNAIL
 async function carregThumbSTP(fileStampDir){         
    try {
          const fileStamp = await fs.getEntryWithUrl(fileStampDir); ///`${Usuario}/AppData/Roaming/temp_stamps`
          const token = await fs.createSessionToken(fileStamp)
          await app.batchPlay( [{"_obj":"placedLayerReplaceContents","null":{"_kind":"local","_path":token}}])
    } catch (err) {};
 };

////////// CARREGAR ARQUIVOS DA DA RAIZ DO PLUGIN)
async function pathPlugin() {
        const fs = require('uxp').storage.localFileSystem;  
        const folder = await fs.getPluginFolder(); 
        dirPlugin = folder.nativePath.replace(/\\/g, '/');
};

////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
async function sequenciaSave(filename, sequencia) {
        const folder = await fs.getEntryWithUrl(`file:${diretorioDoc}`); 
        const files = await folder.getEntries();
        let fileExists = false;
        for (const file of files) { if (file.name === sequencia) { fileExists = true; break; } }
        if(fileExists) {
            let contag = 2;
            let newFileName = filename;
            const fileExtension = filename.split('.').pop();
           estampa = filename.slice(0, -fileExtension.length - 1);
            while (fileExists) {
            newFileName = `${estampa} ${contag}.${fileExtension}`;
            fileExists = files.some(file => file.name === newFileName);
            contag++; estampaName = newFileName;  
            };
        } 
        else{estampaName = sequencia};
        try {shell.openPath(`${dirPlugin}/suport/fechaApp.vbs`);} catch (err) { alert(err) }
};

///////// MOVER A ARTE ORAIGINA PARA SUBPASTA
async function moveOrigArtes(){
    try {
        sbName= "[OK! ]-Original";//`Arte_${arte}`;
        let folder = await fs.getEntryWithUrl(`file:${diretorioDoc}`);  
        let file = await folder.getEntry(app.activeDocument.name);
        try {subfolder = await folder.createFolder(sbName) } catch (e) {};
        let subfolderx = await folder.getEntry(sbName);
        await file.moveTo(subfolderx);
    } catch (err) {alert(err)};
};

///////// SALVAR ESTAMPA CONFIGURADA
async function estampasSave(nome){
    try {
        const Entrada = await fs.getEntryWithUrl(`file:${diretorioDoc}`); 
        var myFile = await Entrada.createFile(nome, { overwrite: true });
        app.activeDocument.saveAs.png(myFile, { compression: 6}, true);
        // setTimeout(function() {
        //     alert("UM PRODUTO SUBLIMÁTICO FOI SOLICITADO, ATUALIZE O ESTOQUE!")
        //     shell.openPath("file:/D:/DADOS/•Hollywood/Hollywood Utility 1.0/Hollywood Utility 1.0.exe")
        //   }, 1000);
    } catch (err) {alert(err)};
};



async function exploradorDiretorio(explorarDir){
    try {
        await criarPasta(`${Usuario}/AppData/Roaming/`,  "tempScripts");
           const tempFolder = await fs.getEntryWithUrl(`${Usuario}/AppData/Roaming/tempScripts`);  
           const fileBat = await tempFolder.createFile("explorarDir.bat", { overwrite: true });
           fileBat.write(`@echo off\nchcp 65001\nexplorer "${explorarDir}"`);
           const fileVBS = await tempFolder.createFile("explorarDir.vbs", { overwrite: true });
           fileVBS.write(`Set objShell = CreateObject("WScript.Shell")\nSet objFSO = CreateObject("Scripting.FileSystemObject")\nstrScriptPath = objFSO.GetParentFolderName(WScript.ScriptFullName)\nstrBatchFile = "explorarDir.bat"\nstrCommand = "cmd /c """ & strScriptPath & "\\" & strBatchFile & """"\nobjShell.Run strCommand, 0, True`);
      } catch (err) {alert(err) };
 }

 //////ENCURTAR A LEGENDA
function encurtaLegenda(path) {
    const dirs = path.split("/"); if (dirs.length > 3) { dirs.splice(2, dirs.length - 4, "..");}; return dirs.join("/");
};

///////FOCAR JANELAS DE DIALOGO 
function focarJanela(e) {
    try {
        function focar() { document.querySelector(e).focus(), 16 }
        setTimeout(focar, 150);
    } catch (error) {alert(error)}
}

//////////// MODELO DE ESTAMPA
async function limparHistorico(method){
    await core.executeAsModal(async () => { 
        await app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}], {}); 
    });
};


//////// VISUALIZAR ORIZONTALMENTE TODOS OS DOCUMENTOS
async function exibirTodososDocs(m){
    try {
        await core.executeAsModal(async () => {
                if( m ==2 ){ method = "tileVertically"}else{ method ="consolidateAllTabs"}
                var len = app.documents.length;
                await app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":method}]}]);
                if( m ==2 ){
                    for (var i = 0; i < len; i++) { 
                        app.activeDocument = app.documents[i];  
                        await app.batchPlay([ {"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"fitOnScreen"}]}]);
                    };
                }
                else{ 
                    await app.batchPlay([ {"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"fitOnScreen"}]}]);
                    await app.batchPlay([ {"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"zoomOut"}]}]);
                }
          });
    } catch (error) {alert(error)}
};

/////////// CLOSE TODOS OS DOCUMENTOS
async function fecarTodososDocs(){
    await core.executeAsModal(async () => {
        var len = app.documents.length
        for (var i = 0; i < len; i++) { 
            await app.activeDocument.closeWithoutSaving()}
    });
}

/////////// REMOVE A SELEÇÃO DO BOTÃO PRINCIPALA NAS JANELAS MODAIS
function colunacResetClasss(c1,c2){
    try {
        document.querySelector(c1).addEventListener('mouseover', () => {
            document.querySelectorAll(c2).forEach(function(e) {e.classList.remove('btn-Executar') });
        })
        document.querySelector(c1).addEventListener('mouseout', () => {
            document.querySelectorAll(c2)[0].classList.add('btn-Executar')   
        });
   } catch (error) {alert(error); console.log(error)}
}

/////////// ENVIAR STRINGE DE TEXTO PARA A ÁREA DE TRANFERENCIA
async function textoTranferencia(){
    async  function formatString(str) {
        let words = str.split(" ");
        let firstName = words[0];
         let secondNameInitial = words[1] ? words[1][0] : '';
        return `${firstName} ${secondNameInitial}`;
    }
    prodDNome = estampaName.replace("[OK! ] ", "").replace(".png", "")  // await formatString(estampaName.replace("[OK! ] ", ""))
    const clipboard = navigator.clipboard;
    const dataTransferProviders = { 'text/plain': prodDNome};
    clipboard.writeText(dataTransferProviders).then(()=>{return dataTransferProviders}); 
};

async function unidadeseRegua(regua){
    const executeAsModal = photoshop.core.executeAsModal
    switch (regua) {
        case "px": unidade = Constants.RulerUnits.PIXELS; break;
        case "mm": unidade = Constants.RulerUnits.MILLIMETERS; break;
        case "cm": unidade = Constants.RulerUnits.CENTIMETERS; break;
        case "pt": unidade = Constants.RulerUnits.POINTS; break;
        case "in": unidade = Constants.RulerUnits.INCHES; break;
    }
    await executeAsModal(async () => { app.preferences.unitsAndRulers.rulerUnits = unidade},
    { commandName: "Changing ruler units" })
};


 ////// EVENTOS DA JANELAS DIALOGO FALSE
function dialogsEventsFalse(){
    D1FtBookEventos=false;
    D2PrintEventos=false;
    D3CeramicaEventos=false;
    D7QbcabecaEventos=false;
    D8CanecasEventos=false;
    D9AlmofadaEventos=false;
    D11SaveEventos=false;
    D12CropToolEventos=false;
};

/////// EXPORTA TODAS AS FUNÇÕES:::::::::::
module.exports = {
    unidadeseRegua, stayleCamdadaADD, criarSelecao, renomearCamada, ordemNumerica, textoTranferencia, fecarTodososDocs,exibirTodososDocs, colunacResetClasss, limparHistorico, focarJanela, dialogsEventsFalse, docEstampa, obterIndexDocAtivo, ocultarCamada, vincadoTarget, exploradorDiretorio, encurtaLegenda, renomeaAquivos, getImageThumbnail, modalFocus, selSanpshots, restauraIniConfig, janelaAjustesx, creatSnapshot, pathPlugin, saveThumbSTP, importMokups, carregThumbSTP, dellTempStamp, progressDLG, error, alertar, confiramar, msgAlertaPxfxrios, estampasSave, moveOrigArtes, sequenciaSave, legendaDados, controlPosition, configsPositions, estampaGuias, loadAjustes, configsAjusteCor, getColorPickerRGBH, statusBorder, rotacionarDOC, BGconvertoCMD, abrirArquivo, ADDselecaoDOC, alignCamada, selectCamada, ZoomDOC, resetarConfigs, 
    ADDselecaoShapes, solidColorCamada, carregarSelecao, refeshDocumento, backupCapa, salvarDocumto,
    modoDeTela, getZoomInform, importSuportes, exibirDiretorio, criarPasta, vbsExecutarBat, ZoomCamada, removeCamada
};
