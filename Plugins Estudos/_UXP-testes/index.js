const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const alert = app.showAlert;
const fs = require('uxp').storage.localFileSystem;

//////////==========
document.getElementById('btn1').addEventListener('click', async () => {
    fachar = document.getElementById("fechar")
    await core.executeAsModal(async () => {
        if(app.activeDocument == null){app.showAlert("Não existe nenhum documento aberto para salvar!")}
        else{ 
            if(fachar.checked){ await app.batchPlay([{"_obj":"close","forceNotify":false,"saving":{"_enum":"yesNo","_value":"yes"}}],{})} 
            else {await app.batchPlay([{"_obj":"save"}],{}) };
          }
      })
  })

  ////////// EXECUTAR SCRIPTS JSX
document.getElementById('btn2').addEventListener('click', async () => {
    await core.executeAsModal(async () => {
        var jsxArquivos = "jsx/script1.jsx" 
        await exexutarJSXfile(jsxArquivos)                         
    })
})

async function exexutarJSXfile(jsxFile) {  
      var pluginFolder = await fs.getPluginFolder()
      try {var filetoken = await fs.createSessionToken(await pluginFolder.getEntry(jsxFile));}
      catch (e) { app.showAlert("Script não localizado!");}
      await app.batchPlay([{ "_obj": "AdobeScriptAutomation Scripts","javaScript": {"_path": filetoken,"_kind": "local"},"javaScriptMessage": "JSM","_isCommand": true,"_options": {"dialogOptions": "dontDisplay"}}], {});
}
////=====


document.getElementById('btn3').addEventListener('click', async () => {
  await core.executeAsModal(async () => {
    document.querySelector("#dlg").show({ title: "Acesso a conteúdo web!", resize: "both", size: { width: 260, height: 60 } })
     paginasID("https://www.cutout.pro/photo-enhancer-sharpener-upscaler/upload");
  })
})


document.getElementById('btn4').addEventListener('click', async () => {
    await core.executeAsModal(async () => {
      
      modal ()

  })
})


async function modal (){
      try {
        const path = "modal.htm";
        const content = await fetch(path).text();
        document.querySelector("#dialog").show({ title: "Acesso a conteúdo web!", resize: "both", size: { width: 260, height: 60 } })
        container.innerHTML = content;
      } catch (err) {
        //alert(err)
        console.log(err)
      }
}


document.getElementById('btnSite1').addEventListener('click', async () => {
   paginasID("https://www.cutout.pro/photo-enhancer-sharpener-upscaler/upload")
})

document.getElementById('btnSite2').addEventListener('click', async () => {
    paginasID("https://www.cutout.pro/remove-background")
 })

 document.getElementById('btnSite3').addEventListener('click', async () => {
  paginasID("https://www.cleanpng.com/free/holi.html")
})

document.getElementById('btnSite4').addEventListener('click', async () => {
    paginasID("https://www.pexels.com/pt-br/")
})

document.getElementById('btnSite5').addEventListener('click', async () => {
     busca = document.getElementById("busca").value;
     paginasID("https://" + busca)
})

document.getElementById('btnSite6').addEventListener('click', async () => {
  paginasID("https://translate.google.com.br/")
})

document.getElementById('btnSite6').addEventListener('click', async () => {

  paginasID("https://www.flickr.com/cameraroll")
})

document.getElementById('btnSite7').addEventListener('click', async () => {
  paginasID("https://web.whatsapp.com/")
})



async function paginasID(site){
    document.getElementById("sites").setAttribute("src", site); 
    await core.executeAsModal(async () => {
        try {
          await exexutarJSXfile("jsx/dellFiles.jsx");
        } 
        catch (err) { alert(err)}
     })
}


/////////////////////////////////////
/////////////////////////////////////
document.getElementById('btn8').addEventListener('click', async () => {
  await core.executeAsModal(async () => { await manipuleCamadas();},{"interactive": true})
})

document.getElementById('btn9').addEventListener('click', async () => {
  await core.executeAsModal(async () => {
        await app.activeDocument.createTextLayer() 
        await app.activeDocument.createTextLayer({ name: "myTextLayer", contents: "Hello, World!", fontSize: 90, position: {x: 200, y: 300}, fontName: "Impact"})

        const layers = app.activeDocument.layers
        const group = await app.activeDocument.groupLayers([layers[0], layers[1]])

    },{"interactive": true})
})

async function manipuleCamadas(){
      const targetFrames=[];
      const activeLayers = app.activeDocument.activeLayers;
 
      if(activeLayers.length == 0){ alert("Você não selecionou as camadas!"); return};
      activeLayers.forEach( camada  => camada.selected = false);
      
      activeLayers.forEach((camada, idx) => {camada.selected = true; targetFrames.push(activeLayers[idx].name);});
      activeLayers.forEach( camada  => camada.selected = true);
      for(var i = 0;i<targetFrames.length; i++){ 
          targetFrames[i];
          await app.batchPlay( [{"_obj":"select","_target":[{"_name":targetFrames[i],"_ref":"layer"}],"makeVisible":false}], {});
          await importImagens();
         }
      activeLayers.forEach( camada  => camada.selected = true);
}

async function importImagens(){
      const fs = require('uxp').storage.localFileSystem;
      let Entrada = await fs.getFileForOpening();   alert("")
      let token = await fs.createSessionToken(Entrada);   
      //await ColorBorder(borderSize, blue, grain, red)  ///// ADICIONAR BORDA
      app.activeDocument.activeLayers[0].name=Entrada.name.match(/(.*)\.[^\.]+$/)[1];
      await app.batchPlay([
          {"_obj":"placeEvent","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"linked":true,"null":{"_kind":"local","_path":token},"offset":{"_obj":"offset","horizontal":{"_unit":"distanceUnit","_value":0.0},"vertical":{"_unit":"distanceUnit","_value":0.0}},"replaceLayer":{"_obj":"placeEvent","from":{"_ref":"layer"},"to":{"_ref":"layer"}}},
          {"descriptor": {"_obj":"transform","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"height":{"_unit":"percentUnit","_value":100},"offset":{"_obj":"offset","horizontal":{"_unit":"distanceUnit","_value":0},"vertical":{"_unit":"distanceUnit","_value":0}},"replaceLayer":{"_obj":"transform","from":{"_id":727,"_ref":"layer"},"to":{"_id":727,"_ref":"layer"}},"width":{"_unit":"percentUnit","_value":100}}, "options": {"dialogOptions": "display"}},
        ], { });
}









async function getEntryWithUrl(){
  // const fs = require("uxp").storage.localFileSystem;

  // try {
  //   const docFile = await fs.getEntryWithUrl("file:/Users/user/Documents/test.txt");
  
  //   alert(docFile)
  // } catch (err) {alert(err)}

        const fs = require("fs");
        const fsp = require("uxp").storage.localFileSystem;
  
       // Obtém o caminho para a pasta activeDocument
        const doc = app.activeDocument;
        const path = doc.path;
  
        alert("paths", path);
  
        // Lê o conteúdo da pasta activeDocument
        const readPathFolder = await fs.readdir(`file:/${path}`);
  
        alert("folders", readPathFolder);
  
        // Obter entrada com url ???
        const dataFolder = await fsp.getEntryWithUrl(`plugin-data:/`);
        const pathFolder = await fsp.getEntryWithUrl(`file:/${path}`);
  
        console.log("entries", { dataFolder, pathFolder });
        alert({ dataFolder, pathFolder });
}
/////////////////////////////////////
// var objarr = [
//     {nome: "Mauricio Rios", idade: "44 anos", sexo:"Masculino" },
//     {nome: "Carla Regina", idade: "25 anos", sexo:"Feminina" },
//     {nome: "Felipe Leal", idade: "40 anos", sexo:"Masculino" }
// ];

// index = 0
// nome = objarr[index].nome;
// idade = objarr[index].idade;
// sexo  = objarr[index].sexo


// var objarr_nome = [];
// for (var i = 0; i < objarr.length; i++){
//    objarr_nome.push(objarr[i].nome)
// }

// alert(objarr_nome);
// alert("Nome: " + nome + "\n" + "Idade: " + idade + "\n" + "Sexo: " + sexo );

// ////////// EDITAR CAMADAS SELECIONAS 
// async function manipuleCamadas(){
//   const sizeInput = 120;
//   const activeLayers = app.activeDocument.activeLayers;
//   const size = Number(sizeInput)

//   if(activeLayers.length == 0){ alert("Você não selecionou as camadas!")};
//   activeLayers.forEach( camada  => camada.selected = false);
  
//   activeLayers.forEach((camada, idx) => {
//       camada.selected = true;
//       //  app.batchPlay([{ _obj: "newPlacedLayer"}], {synchronousExecution: true});
//       //alert("Script Aqui!")
//       camada = app.activeDocument.activeLayers[0];
//       activeLayers[idx] =camada;
//       camada.scale( size, size);
//       camada.selected = false;
//   });
//   activeLayers.forEach( camada  => camada.selected = true);
// }



// Este código primeiro obtém o objeto FileSystem usando o método getDataFolder() da API de sistema de arquivos da Adobe. 
// Em seguida, usa o método getEntry() para obter a pasta raiz do documento ativo. 
// Em seguida, usa o método createDirectory() para criar uma subpasta dentro da pasta raiz do documento ativo. 
// O nome da subpasta é especificado como um argumento para o método createDirectory().

// async function createSubFolder() {
//   const fs = require("uxp").storage.localFileSystem;
//   const pluginDataFolder = await fs.getDataFolder();
//   const activeDocument = require("photoshop").app.activeDocument;
//   const rootFolder = await pluginDataFolder.getEntry(activeDocument.id);

//   // Crie uma subpasta dentro da pasta raiz do documento ativo
//   const subFolder = await rootFolder.createDirectory("Subfolder");

//   console.log("Subpasta criada com sucesso: " + subFolder.name);
// }

// createSubFolder();


// async function duplicateLayer() {
//   const activeDocument = require("photoshop").app.activeDocument;
//   const activeLayer = activeDocument.activeLayers[0];

//   // Duplica a camada ativa
//   const duplicatedLayer = await activeLayer.duplicate();

//   // Adiciona um número ao nome da camada duplicada
//   const newLayerName = duplicatedLayer.name + " 2";
//   duplicatedLayer.name = newLayerName;

//   console.log("Camada duplicada com sucesso: " + duplicatedLayer.name);
// }

async function processTestes() {
      try {
          const valor = 7 // cm
          const camada = app.activeDocument.layers[0]
          const resolucao = app.activeDocument.resolution
          const largura = Number(valor)/2.54*resolucao
          const width =camada.bounds.width;
          const newWidth = largura*1*100/width;;
          await camada.scale( newWidth, newWidth)
        }
      catch (err) {alert(err)}
}

/////////////////////////////////////////////////
///////SITEMA DE BUSCAD TESTES =====
lista = document.querySelector("#mostrartxt");
lista.innerHTML = "";

core.executeAsModal(async () => {
    document.querySelector("#et1").addEventListener('input', async () => {
        buscatxt =  document.querySelector("#et1").value
        await filtrarItensLista(buscatxt); 
    })

    //// PRESETLIST FERAMENTAS (CORTES)
    const descritor = ["presetManager", "application"] 
    const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: descritor[0] }, { _ref: descritor[1], _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
    pessoas = result[0].presetManager[7].name;

    for (var i = 0; i < pessoas.length; i++) {
       lista.insertAdjacentHTML("beforeend", `<option>${pessoas[i]}</option>`); 
      }
    
    function filtrarItensLista(busca){
        const pessoasComM = pessoas.filter(pessoa => pessoa.startsWith(busca));
        lista.innerHTML = pessoasComM;
        for (var i = 0; i < pessoasComM.length; i++) {
          lista.insertAdjacentHTML("beforeend", `<option>${pessoasComM[i]}</option>`); 
        }
    }
})

lista.addEventListener("change", async evt => {
  core.executeAsModal(async () => {  await tamanhosPresets() })
})

async function tamanhosPresets(){
    preset = lista.value
    await app.batchPlay( [{"_obj":"select","_target":[{"_name":preset,"_ref":"toolPreset"}]}], { synchronousExecution: false, });
 }

document.addEventListener("keypress", function(event) {
   // if (event.key == "Enter" ||  event.key == "Escape" || event.key === "Backspace") {
 // if (event.ctrlKey && event.key === "z") {
 if (event.key === "z") {
      alert("Teste de teclado")
  }
});



////////////////////////////
////// DEBUG TESTES ==
document.getElementById('btn0').addEventListener('click', async () => {
  await core.executeAsModal(async () => {
      //   //    // PRESETLIST FERAMENTAS (CORTES)
      //     const descritor = ["presetManager", "application"] 
      //   //    const descritor = ["presetManager", "application"] 
      //      const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: descritor[0] }, { _ref: descritor[1], _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
      //      const pinned = result[0].presetManager[7].name;
      //   //    const pinned = result[0].presetManager[6].name;
      //   //    console.log(pinned)
      //      alert(pinned)
      /////////////////////////
      ///// FUNÇÕES AQUI
        //await salvarDumentoAtivo()
        //await importDocsURL();
        await importAtnFiles();
        // await importJson();
        //await salvarDumentoAtivoNasubpasta();
        ///await moverParasubpasta()
        //await obterListaArquivosPasta()
    })
})

//////////////////////////////////////////////
/////// SALVA O DOCUMENTO ATIVO NA NA URL DEFINIDA
async function salvarDumentoAtivo(){
      alert(app.activeDocument.name)
      //let Entrada = await fs.getFolder(fs.supportedDomains[0]);
      let Entrada = await fs.getEntryWithUrl("file:C:/Users/Mauricio/Desktop/Saida");

      //newFileName = "whateverName.jpg";  /// NOME ALTERNATIVO SAIDA
      newFileName = `${app.activeDocument.name}` /// NOME DO DOC ATIVO
      var myFile = await Entrada.createFile(newFileName, { overwrite: true });
      let jpegOptions = {
          quality: 100,
          embedColorProfile: true
      }
      app.activeDocument.saveAs.jpg(myFile, jpegOptions, true);
}



//////////////////////////////////////////////
/////// CRIAR E SALVAR NA SUBPASTA DENTRO DA PASTA RAÍZ
async function salvarDumentoAtivoNasubpasta(){
  try {
      const path = app.activeDocument.path.replace(/\\[^\\]*$/, "")
      const Entrada = await fs.getEntryWithUrl(`file:${path}`); 

      const entries = await Entrada.getEntries();   
      let subfolder = entries.filter((entry) => entry.isFolder).find((subFolder) => subFolder.name === "SubFolder");
      if (!subfolder) {subfolder = await Entrada.createFolder("SubFolder");}
      
      newFileName = app.activeDocument.name;
      var myFile = await subfolder.createFile(newFileName, { overwrite: true });
      let jpegOptions = {
          quality: 100,
          embedColorProfile: true
      }
      app.activeDocument.saveAs.jpg(myFile, jpegOptions, true);
  } catch (err) {alert(err)}
}

//////////////////////////////////////////////
/////// CRIA E MOVE O DOCUMENTO ATIVO PARA A SUBPASTA
async function moverParasubpasta(){
  try {
      const file = await app.activeDocument.path
      const path = app.activeDocument.path.replace(/\\[^\\]*$/, "")
      const Entrada = await fs.getEntryWithUrl(`file:${path}`); 
      const deletar = await fs.getEntryWithUrl(`file:${file}`);

      const entries = await Entrada.getEntries();   
      let subfolder = entries.filter((entry) => entry.isFolder).find((subFolder) => subFolder.name === "SubFolder");
      if (!subfolder) {subfolder = await Entrada.createFolder("SubFolder");}
      
      newFileName = app.activeDocument.name;
      var myFile = await subfolder.createFile(newFileName, { overwrite: true });
      let jpegOptions = {
          quality: 100,
          embedColorProfile: true
      }
      app.activeDocument.saveAs.jpg(myFile, jpegOptions, true);
      deletar.delete()
  } catch (err) {alert(err)}
}


//////////////////////////////////////////////
/////// OBTER A LISTA DE ARQUIVOS POR URL
async function obterListaArquivosPasta(){
  try {
        await core.executeAsModal( async () => {
              getFiles = [];
              //const path = "E:/•Library"
              const path = "C:/Program Files/Common Files/Adobe/Fonts";
              const entry = await fs.getEntryWithUrl(`file:${path}`); 
              const theFolder = entry;
              const mainEntries = await theFolder.getEntries();

              for (let mainEntry of mainEntries) {
               if (mainEntry.isFile) {getFiles.push(mainEntry.name);} 
              }
              alert(getFiles)
        })
    } catch (err) {alert(err)}
}


//////////////////////////////////////////////
/////// IMPORTAR OS ARQUIVO PELA URL
async function importDocsURL() {
  try {
    let Entrada =  await fs.getEntryWithUrl("file:E:/Google Drive/Library/Animais/Anms_btc_06.png");   
    let token = fs.createSessionToken(Entrada);
    await app.batchPlay( [{"_obj":"placedLayerReplaceContents","layerID":3,"null":{"_kind":"local","_path": token }}], { synchronousExecution: false, });
  } catch (err) {alert("Imagem não encontrada")}
}

async function importAtnFiles() {
      const fs = require('uxp').storage.localFileSystem;
      const atnFile = await fs.getFileForOpening({ types: ["atn"] });   alert(atnFile)
      const ActionSetName = action.validateReference({_ref: "actionSet", _name: atnFile.name.match(/(.*)\.[^\.]+$/)[1]})
      if(ActionSetName == true){alert(`"${atnFile.name}" já foi carregado!`)}
      else{app.open(atnFile);}
}
//await importAtnFiles();


/////// SALVA O DOCUMENTO ATIVO NA NA URL DEFINIDA
async function importJson(){
    // const fs = require('uxp').storage.localFileSystem;
    // let domains = require("uxp").storage.domains;
    // let entry = await fs.getFolder({initialDomain: domains.userDocuments});
    try {
      const fs = require('uxp').storage.localFileSystem;
      let Entrada =  await fs.getEntryWithUrl("file:C:/Users/Mauricio PC/Desktop/teste.psjs");   
      let token = fs.createSessionToken(Entrada);
      await app.batchPlay( [{"_obj":"runJavaScript","_target":[{"_enum":"ordinal","_ref":"application","_value":"targetEnum"}],"file":{"_kind":"local","_path":token}}], { synchronousExecution: false, });
    } catch (err) {alert(err)}
}






