const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;

 //// CRIA UMA SUPASTA 
document.querySelector("#btnSalvar ").addEventListener("click", async evt => {
		try {
            await core.executeAsModal(async () => {  
                    const fs = require('uxp').storage.localFileSystem;
                    //alert(app.activeDocument.path.replace(/\\[^\\]*$/, ""))
                    const path = app.activeDocument.path.replace(/\\[^\\]*$/, "")
                     directory = await fs.getEntryWithUrl(`${path}`); //// MESMO LOCAL
                   //  directory = await fs.getFolder(); ////SELECIONAR LOCAL

                    const token = await fs.createSessionToken(directory);//cria um token persistente para a pasta   
                    const folder = await fs.getEntryForSessionToken(token) //extrai o caminho da pasta persistente

                    const entries = await folder.getEntries();   
                    let subfolder = entries.filter((entry) => entry.isFolder).find((subFolder) => subFolder.name === "SubFolder");
                    // Se a subpasta estiver indefinida, crie-a e atribua à subpasta let
                    if (!subfolder) {subfolder = await folder.createFolder("SubFolder");}

                    const getFiles = await subfolder.getEntries();
                    const  cont = Number(getFiles.length)+1
                    const nome = app.activeDocument.name.match(/(.*)\.[^\.]+$/)[1]
                    //const nome = "Imagem";
                    if(cont<=9){newfile = nome.split("_")[0] +"_0"+cont;}else{newfile = nome.split("_")[0]+"_"+cont};

                    const newFile = await subfolder.createFile(newfile, { overwrite: true });
                    const saveFile = await fs.createSessionToken(newFile);

                    ////// SALVAR EM TIF
                    //await app.batchPlay([{"_obj": "save","as":{"_obj": "TIFF","byteOrder":{"_enum": "platform","_value": "IBMPC"},"layerCompression":{"_enum": "encoding","_value": "RLE"}},"in": {"_path": saveFile,"_kind": "local"}}], { });
                    ////// SALVAR EM PNG
                    await app.batchPlay([ {"_obj":"save","as":{"PNGFilter":{"_enum":"PNGFilter","_value":"PNGFilterAdaptive"},"PNGInterlaceType":{"_enum":"PNGInterlaceType","_value":"PNGInterlaceNone"},"_obj":"PNGFormat","compression":6,"embedIccProfileLastState":{"_enum":"embedOff","_value":"embedOn"},"method":{"_enum":"PNGMethod","_value":"quick"}},"copy":true,"documentID":174,"in":{"_kind":"local","_path": saveFile},"lowerCase":true}]);
			});
		} 
		catch (e) {alert(e);}
		});


  //// ABRE TODAS AS FOTOS DE UMA PASTA
document.querySelector("#btnImport").addEventListener("click", async evt => {
    try {
            getFiles = [];
            getAllFiles=[]
            const fs = require('uxp').storage.localFileSystem;
            await core.executeAsModal(async () => {
            const directory = await fs.getFolder();
            const token = await fs.createSessionToken(directory);
            const thePersistentFolder = await fs.getEntryForSessionToken(token);
            
            //////// FILTRAR ARQUIVO PELO FORMATO
            const formatos = /\.(png|jpg|jpeg|tif|psd|pdf|eps|gif|ai|nef)$/i;
             //////// MÉTODO  PARA OBTER  AQUIVOS DE SUBPASTAS
            const ckSubfolder = document.querySelector("#ckSubf")
          
            const mainEntries = await thePersistentFolder.getEntries();
            for (let mainEntry of mainEntries) { 
			    if (mainEntry.isFile && mainEntry.name.match(formatos)) { getFiles.push(mainEntry); } 
				else if (mainEntry.isFolder && ckSubfolder.checked) {
                    const subEntries = await mainEntry.getEntries()
                    for (let subEntry of subEntries) {if (subEntry.isFile && subEntry.name.match(formatos)) {getFiles.push(subEntry);}
                    };
                };
            };

            ///////// MÉTODO JUNTA TODOS OS ARQUIVOS DE PASTA E SUBPASTAS
            getFiles.forEach(conteudo => { getAllFiles.push(conteudo); });
            
             //////// ORGANIZA A ORDEM NUMÉRICA DOS AQUIVOS
            function classiifcarOrdem(a, b) {
                const nomeA = a.name.toLowerCase();
                const nomeB = b.name.toLowerCase();
                if (nomeA < nomeB) { return -1;} else if (nomeA > nomeB) { return 1; } 
                else { return 0; }
            }
            const arquivos = getAllFiles.sort(classiifcarOrdem);
            
             //////// MÉTODO PARA ABRIR E EXECUTAR OS EVEBTOS  COM FOR
             for(const imagens of arquivos){ app.open(imagens ); alert("Scripts Aqui!!") }

             //////// MÉTODO PARA ABRIR E EXECUTAR OS EVEBTOS COM FOREACH 
             arquivos.forEach( imagem=>{ app.open(imagem);  alert("Scripts Aqui!!") })




        },{"interactive": true}/*REMOVE A JANELA DE PROGRESSO*/);
    } catch (e) {alert(e);  console.log(e);}
});
	



// const result = []
    
// for (let actionSet of app.actionTree ?? []) {
//     for (let action of actionSet.actions ?? []) {
//         const item = {
//             title: action.name,
//             data: {path: [actionSet.name, action.name]},
//             description: actionSet.name,
//         }

//         result.push(item)
//     }
// }

//  console.log(result.map(function (itemList) { return itemList. title})[1])
	
