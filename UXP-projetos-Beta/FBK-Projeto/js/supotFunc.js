////DESTAVA CAMADAS E ADICIONA UM NOVO NOME
async function BGconvertoCMD(nome) {
    const command = [
          {"_obj":"set","_target":[{"_property":"background","_ref":"layer"}],"layerID":365,"to":{"_obj":"layer","mode":{"_enum":"blendMode","_value":"normal"},"name":nome,"opacity":{"_unit":"percentUnit","_value":100.0}}},
          {"_obj":"newPlacedLayer"}
    ];
    await app.batchPlay(command, {});
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
    app.batchPlay( [{"_obj":"select","_target":[{"_name":nome,"_ref":"layer"}],"layerID":[1306],"makeVisible":false}, {"_obj":"delete","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"layerID":[1306]}], { synchronousExecution: false, });
}

///// SELECIONAR CAMDA PELO NOME
async function selectCamada(nome) {
    const command = [{"_obj":"select","_target":[{"_name":nome,"_ref":"layer"}],"makeVisible":false}];
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
    core.executeAsModal(async () => {  
         app.activeDocument.activeHistoryState = app.activeDocument.historyStates [0];
         app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}],{ });
         app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"screenModeStandard"}]}], {});
         ZoomDOC(0);
    });
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

///// CARREGAR  SELEÇÃO (CANAL ALPHA)
async function carregarSelecao() {
    const command = [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_name":"Alpha 1","_ref":"channel"}}];
    await app.batchPlay(command, {});
}

///// ADICIONAR UMA CAMADA DE COR
async function solidColorCamada(blue,grain,red) {
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

///////// BUSCAR O ARQUIVO NA PASTA
async function abrirArquivo() {
    const fs = require("uxp").storage.localFileSystem;
    const app = require("photoshop").app; 
    capaFolder = await fs.getFileForOpening();
    if(capaFolder){await core.executeAsModal(() => app.open(capaFolder));}
}

//////// ASSEGURA Q TODAS AS ALTERAÇÃO NO IMAGEM NAO SERAM REMOVIDAS
async function refeshDocumento(){
    const doc = app.activeDocument;  
    doc.activeHistoryState = doc.historyStates [0];
    app.batchPlay([{"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}],{ });
    doc.activeHistoryState = doc.historyStates[doc.historyStates.length-1];
    app.batchPlay([{"_obj":"make","_target":[{"_ref":"snapshotClass"}],"from":{"_property":"currentHistoryState","_ref":"historyState"},"name":app.activeDocument.name,"using":{"_enum":"historyState","_value":"fullDocument"}}],{ });
}

//// MOVER CAPA ORIG PARA SUBPASTA
async function backupCapa(){
    const path = app.activeDocument.path.replace(/\\[^\\]*$/, "") 
    folder = await fs.getEntryWithUrl(`file:${path}`) 
    const file = await folder.getEntry(app.activeDocument.name);
    //verificar se a subpasta existe e se não a cria
    const  chekSubFolder = (await folder.getEntries()).find(entry => entry.name.includes("nfz_Original"));
    if (chekSubFolder!=null) {}else{subfolder = await folder.createFolder("nfz_Original");}; 
    subfolderDir = subfolder.nativePath;
    exibirFolder = folder.nativePath;
    const moveSubfolder = await folder.getEntry("nfz_Original");  
    await file.moveTo(moveSubfolder);
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

 ////////// COMFIGS IMPRESSÃO EPSOM.
 async function confisPrints(){
    VBSexecutaBAT = await pluginFolder.getEntry("suport/{987-321-654}.vbs"); 
    ///// EXECUTA BAT OU VBS SE EXISTIR OU NÃO ACENTUAÇÃO NA STRING PATH
    const normalizedString = path.normalize("NFD");
    const acentuacao = normalizedString.length > path.length;
    if(acentuacao == true){shell.openPath("file:/C:/temp/{987-321-654}.bat");}
    else{await shell.openPath(VBSexecutaBAT.nativePath);};
}

/////// EXPORTA TODAS AS FUNÇÕES:::::::::::
module.exports = {
    confisPrints, BGconvertoCMD, abrirArquivo, ADDselecaoDOC, alignCamada, selectCamada, ZoomDOC, resetarConfigs, 
     ADDselecaoShapes, solidColorCamada, carregarSelecao, refeshDocumento, backupCapa, salvarDocumto,
     modoDeTela, getZoomInform, importSuportes, exibirDiretorio, criarPasta, vbsExecutarBat, ZoomCamada, removeCamada
};
