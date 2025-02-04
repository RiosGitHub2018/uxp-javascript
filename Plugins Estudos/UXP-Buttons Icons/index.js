const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const alert = app.showAlert;
const fs = require('uxp').storage.localFileSystem;
const shell=require("uxp").shell;



document.querySelector("#btnMedio_func1").addEventListener("click", async evt => {
	//await core.executeAsModal( async() => {	arquivoExite() })
    //const file = await fs.getEntryWithUrl("file:/C:/temp/ResulFont.txt") //await fs.getFileForOpening(); // abre a janela de seleção de arquivo
    try {

        const pluginFolder = await fs.getPluginFolder(); 
        const vbsDoc = await pluginFolder.getEntry("lib/vbsRun.vbs");
        shell.openPath(vbsDoc.nativePath);
       // const txtDoc = await pluginFolder.getEntry("lib/ResulFont.txt");

        
        // const valorObtido = await txtDoc.read(); // lê o conteúdo do arquivo
        // const fonteExiste = valorObtido;
        // alert(fonteExiste)

    } catch (err) {alert(err)}

 })


//// COMANDO PARA INSTALAR A FONTE REFERENTE AOS INCONES
 async function installFontIcons(){
    try {
        const pluginFolder = await fs.getPluginFolder();
        const fontIcons = await pluginFolder.getEntry("lib/install_font.vbs");
        shell.openPath(fontIcons.nativePath);
      } 
      catch (err) {alert(err) }
 }



