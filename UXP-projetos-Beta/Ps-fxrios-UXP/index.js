const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const fs = require('uxp').storage.localFileSystem;
const shell=require("uxp").shell;
const Constants = require('photoshop').constants;
const alert = app.showAlert;
const os = require('os') ;
const Usuario = os.homedir().replace(/\\/g, '/'); 
const photoshop = require("photoshop");
const imaging = photoshop.imaging;
const kSRGBProfile = "sRGB IEC61966-2.1";
anchorPos = require('photoshop').constants.AnchorPosition
const cpu = os.cpus()
const memoria = os.totalmem()


const { unidadeseRegua, stayleCamdadaADD, criarSelecao, renomearCamada,ordemNumerica,textoTranferencia,fecarTodososDocs, exibirTodososDocs, colunacResetClasss, limparHistorico, focarJanela, dialogsEventsFalse, docEstampa, obterIndexDocAtivo, ocultarCamada, vincadoTarget, exploradorDiretorio, encurtaLegenda, renomeaAquivos, getImageThumbnail, modalFocus, selSanpshots, restauraIniConfig, janelaAjustesx, creatSnapshot, pathPlugin, saveThumbSTP, importMokups, carregThumbSTP, dellTempStamp, progressDLG, error, alertar, confiramar, msgAlertaPxfxrios, estampasSave, moveOrigArtes, sequenciaSave, legendaDados, controlPosition, configsPositions, estampaGuias, loadAjustes, configsAjusteCor, getColorPickerRGBH, statusBorder, rotacionarDOC, BGconvertoCMD, abrirArquivo, ADDselecaoDOC, alignCamada, selectCamada, ZoomDOC, resetarConfigs, ADDselecaoShapes, solidColorCamada, carregarSelecao, refeshDocumento, backupCapa, salvarDocumto, modoDeTela, getZoomInform, importSuportes, exibirDiretorio, criarPasta, vbsExecutarBat, ZoomCamada, removeCamada,
} = require("./js/menu/supotFunc.js");

/////// IMPORTANDO MODULOS 
pathPlugin(); 

const m1 = require("./js/menu/MSuperior.js");
const m2 = require("./js/menu/MImagem.js");   
const m3 = require("./js/menu/MDiagram.js");  
const m4 = require("./js/menu/MSmartools.js"); 
const m5 = require("./js/menu/MDocumento.js"); 
const m6 = require("./js/Janelas/D1FtBook.js");
const m7 =  require("./js/Janelas/D2Print.js");  
const m9 = require("./js/Janelas/D4Mosuse.js");
const m8 = require("./js/Janelas/D3Ceramica.js");
const m12 = require("./js/Janelas/D5Bone.js"); 
const m13 = require("./js/Janelas/D6Squeese.js");
const m14 = require("./js/Janelas/D7Qbcabeca.js");
const m15 = require("./js/Janelas/D8Canecas.js");
const m10 = require("./js/menu/MSericos.js");
const m11 = require("./js/menu/PuginUI.js");
const m16 = require("./js/Janelas/D9Almofada.js");
const m17 = require("./js/Janelas/D10Camisa.js");
const m18 = require("./js/Janelas/D11SaveDocs.js");
const m19 = require("./js/Janelas/D12CropTool.js");
const m20 = require("./js/Janelas/D13CapaAlbuns.js");





