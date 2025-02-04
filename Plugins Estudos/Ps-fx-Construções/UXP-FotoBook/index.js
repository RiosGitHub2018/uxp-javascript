const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const alert = app.showAlert;
const fs = require('uxp').storage.localFileSystem;
const shell=require("uxp").shell;

const {openModal} = require("./js/fbookDLG.js");
const {
      BGconvertoCMD, abrirArquivo, ADDselecaoDOC, alignCamada, selectCamada, ZoomDOC, resetarConfigs, 
      ADDselecaoShapes, solidColorCamada, carregarSelecao, refeshDocumento, backupCapa, salvarDocumto,
      modoDeTela, getZoomInform, importSuportes, exibirDiretorio, criarPasta, vbsExecutarBat,
} = require("./js/supotFunc.js");

document.querySelector("#abr-dlg").addEventListener("click", async () => {
      await openModal();
});

// functionA();
// //functionB();

// function functionA(){ function temp() { alert("Essa é a função A"); functionB();} setTimeout(temp, 1000);}
// function functionB(){ alert("Essa é a função B")}


// // Arquivo de destino
// const fc = require("./js/DLG-ftBook.js");

// // Agora você pode chamar as funções assim:
// fc.funcao1();
// fc.funcao2();



//alert("Mauricio")






