const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const fs = require('uxp').storage.localFileSystem;
const shell=require("uxp").shell;
const alert = app.showAlert;

 //// CRIA UMA SUPASTA 
document.querySelector("#btnSalvar ").addEventListener("click", async evt => {
	await renameDocsFolder();
});

async function renameDocsFolder(){
      try {
		await criarPasta("file:/C:/",  "temp");
		      const tempFolder =  await fs.getEntryWithUrl("file:/C:/temp");  
		      const fileBat = await tempFolder.createFile("file.bat", { overwrite: true });
		      const path = app.activeDocument.path.replace(/\\[^\\]*$/, "");
		      fileBat.write(`@echo off\nchcp 65001\nsetlocal enabledelayedexpansion\nset "pasta=${path}"\nset "contador=1"\ncd /d "%pasta%"\nfor %%A in ("*.jpg") do (\n for /f "tokens=2 delims=()" %%B in ("%%~nA") do (\nset /a number=1000+%%B\n ren "%%A" "PG#!number:~-2!%%~xA"\n)\n)\nendlocal`);
		      shell.openPath("C:/temp/file.bat");
	  } catch (err) {alert(err) }
}


async function criarPasta(diretorio, folderName){
	try {
	   const fs = require('uxp').storage.localFileSystem;
	   const entrada = await fs.getEntryWithUrl(diretorio); 
	   const token = await fs.createSessionToken(entrada)
	   const folder = await fs.getEntryForSessionToken(token);
	   await folder.createFolder(folderName );
	} catch (err) {}
 }