const app = window.require('photoshop').app
const batchPlay = require('photoshop').action.batchPlay;
const fs = require('uxp').storage.localFileSystem;
//const core = require('photoshop').core;
//const executeAsModal = core.executeAsModal;
token = await JSON.parse(localStorage.getItem("fixfolder"));//seleção do token salvo
const folder = await fs.getEntryForPersistentToken(token);//extrai o caminho da pasta persistente
const subfolder = await folder.createFolder("pippo");  //Crie as pastas e subpastas desejadas)
const subsubfolder = await subfolder.createFolder("paperino");
//cria o arquivo em modo modal
require('photoshop').core.executeAsModal(async () => {  

const newFile = await subfolder.createFile("newfile.tif", { overwrite: true });
const saveFile = await fs.createSessionToken(newFile);


const result = await batchPlay(
      [
        {
          "_obj": "save",
          "as":
          {
            "_obj": "TIFF",
            "byteOrder":
            {
              "_enum": "platform",
              "_value": "IBMPC"
            },
            "layerCompression":
            {
              "_enum": "encoding",
              "_value": "RLE"
            }
          },
          "in": {
            "_path": saveFile,
            "_kind": "local"
          }
        }
      ], {

      "synchronousExecution": false,
      //"modalBehavior": "fail"
    });

 });