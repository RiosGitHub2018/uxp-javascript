const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const alert = app.showAlert;
const fs = require('uxp').storage.localFileSystem;
const shell=require("uxp").shell;

const {openModal} = require("./js/fbookDLG.js");
const {
      confisPrints, BGconvertoCMD, abrirArquivo, ADDselecaoDOC, alignCamada, selectCamada, ZoomDOC, resetarConfigs, 
      ADDselecaoShapes, solidColorCamada, carregarSelecao, refeshDocumento, backupCapa, salvarDocumto,
      modoDeTela, getZoomInform, importSuportes, exibirDiretorio, criarPasta, vbsExecutarBat, ZoomCamada, 
      removeCamada,
} = require("./js/supotFunc.js");

document.querySelector("#abr-dlg").addEventListener("click", async () => {
      ////// BUSCA O DOC SE NÃO ESTIVER ABERTO
      if(app.documents.length==0){  const f = await fs.getFileForOpening(); if(f){await core.executeAsModal(() => app.open(f));} if(f==null){ return};}
      await openModal();
});






