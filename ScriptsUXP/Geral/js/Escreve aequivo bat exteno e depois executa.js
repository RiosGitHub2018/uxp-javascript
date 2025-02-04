const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const fs = require('uxp').storage.localFileSystem;
const shell=require("uxp").shell;
const alert = app.showAlert;

async function exibirDiretorio(){
      await criarPasta("file:/C:/",  "temp");
      const tempFolder =  await fs.getEntryWithUrl("file:/C:/temp");  
      const fileBat = await tempFolder.createFile("file.bat", { overwrite: true });
      const path = app.activeDocument.path.replace(/\\[^\\]*$/, "");
      fileBat.write(`@echo off\nchcp 65001\nstart "" "${path}"`);
      shell.openPath("C:/temp/file.bat");
	  /*
      const fileVbs = await tempFolder.createFile("file.vbs", { overwrite: true, encoding: "utf8"});
      fileVbs.write(`Set objShell = WScript.CreateObject("WScript.Shell")\nobjShell.Run("C:/temp/file.bat"), 0, True`);
      shell.openPath("C:/temp/file.vbs");*/
}


await exibirDiretorio();
