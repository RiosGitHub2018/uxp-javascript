const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const fs = require('uxp').storage.localFileSystem;
const shell=require("uxp").shell;
const alert = app.showAlert;

//// ABRIR UMA SUPASTA 
 document.querySelector("#btnPasta").addEventListener("click", async evt => {
      //shell.openPath("E:/•Library");
      //shell.openPath("E:/•Programas/64 Bits/_Drivers PC Mauricio Hollywwod/VueScanPortable/VueScanPortable.exe"); 
      //shell.openPath("C:/Users/Mauricio/Desktop/file.bat"); 
      //shell.openPath("C:/Users/Cliente/Desktop/file.bat"); 
      //exibirDiretorio();
      const fs = require("uxp").storage.localFileSystem;
      const file = await fs.getEntryWithUrl("file:/C:/temp/script.txt") //await fs.getFileForOpening(); // abre a janela de seleção de arquivo
      const contents = await file.read(); // lê o conteúdo do arquivo
      alert(contents);
      //alert(wuser);


});

//// ABRIR PASTA DO DOCUMENTO ATIVO
document.querySelector("#btnPastaDA").addEventListener("click", evt => {
   shell.openPath(app.activeDocument.path.replace(/\\[^\\]*$/, ""));
  // alert(app.activeDocument.path.replace(/\\[^\\]*$/, ""))
});

 //// ABRIR UMA PAGINA WEB
 document.querySelector("#btnWeb").addEventListener("click", evt => {
    shell.openExternal("http://xmbcriostube.epizy.com/?i=1")
 });

  //// ABRIR VBS
  document.querySelector("#btnvbs").addEventListener("click", async evt => {
      // const fileVbs = await tempFolder.createFile("file.vbs", { overwrite: true, encoding: "utf8"});
      // fileVbs.write(`Set objShell = WScript.CreateObject("WScript.Shell")\nobjShell.Run("C:/temp/file.bat"), 0, True`);
      // shell.openPath("C:/temp/{987-321-654}.vbs");

   //    const tempFolder =  await fs.getEntryWithUrl("file:/C:/temp");  
   //    const file = await tempFolder.createFile("file.vbs", { overwrite: true, encoding: "ANSI" });
   //    const path = app.activeDocument.path.replace(/\\[^\\]*$/, "") //"Z:/MATRIZ/12.05.2023/SHOP/Géssica";
   //    file.write(`Set objShell = CreateObject("Shell.Application")\nobjShell.Explore "${path}"`);
   //   //shell.openPath("C:/temp/file.vbs");

   //    shell.openPath("C:/Users/Mauricio/Desktop/00001.hta");
     // remaneFilesnomal()
       remaneFilesOK();
});

 //// ABRIR UMA PAGINA WEB
 document.querySelector("#btnScan").addEventListener("click", evt => {
   shell.openPath("C:/Program Files (x86)/Canon/IJ Scan Utility/SCANUTILITY.exe");
});

////////// FUNÇÕES //////////////////////
async function criarPasta(diretorio, folderName){
   try {
      const fs = require('uxp').storage.localFileSystem;
      const entrada = await fs.getEntryWithUrl(diretorio); 
      const token = await fs.createSessionToken(entrada)
      const folder = await fs.getEntryForSessionToken(token);
      await folder.createFolder(folderName );
   } catch (err) {}
}


async function exibirDiretorio(){
      await criarPasta("file:/C:/",  "temp");
      const tempFolder =  await fs.getEntryWithUrl("file:/C:/temp");  
      const fileBat = await tempFolder.createFile("file.bat", { overwrite: true });
      const path = app.activeDocument.path.replace(/\\[^\\]*$/, "");
      fileBat.write(`@echo off\nchcp 65001\nstart "" "${path}"`);
      // shell.openPath("C:/temp/file.bat");
      const fileVbs = await tempFolder.createFile("file.vbs", { overwrite: true, encoding: "utf8"});
      fileVbs.write(`Set objShell = WScript.CreateObject("WScript.Shell")\nobjShell.Run("C:/temp/file.bat"), 0, True`);
      shell.openPath("C:/temp/file.vbs");
}



async function remaneFilesnomal(){
   try {
      await criarPasta("file:/C:/",  "temp");
      const tempFolder =  await fs.getEntryWithUrl("file:/C:/temp");  
      const fileVbs = await tempFolder.createFile("remaneFiles.vbs", { overwrite: true, encoding: "utf8"});
      const path = app.activeDocument.path.replace(/\\[^\\]*$/, "");  
      fileVbs.write(`On Error Resume Next\nSet fso = CreateObject("Scripting.FileSystemObject")\nSet folder = fso.GetFolder("${path}")\nFor Each file In folder.Files\nfileName = fso.GetBaseName(file)\nfileExt = fso.GetExtensionName(file)\n newFileName = ""\nFor i = 1 To Len(fileName)\n If IsNumeric(Mid(fileName, i, 1)) Then\nnewFileName = newFileName & Mid(fileName, i, 1)\nEnd If\nNext\nIf Len(newFileName) = 1 And CInt(newFileName) >= 1 And CInt(newFileName) <= 9 Then\nnewFileName = "0" & newFileName\nEnd If\nnewFileName = "PG#0" & newFileName\nfile.Name = newFileName & "." & fileExt\nNext\nIf Err.Number <> 0 Then\nEnd If`);
      shell.openPath("C:/temp/remaneFiles.vbs");
   } catch (err) {alert(err)}
}

async function remaneFilesOK(){
   try {
      const path = app.activeDocument.path.replace(/\\[^\\]*$/, "");
      const tempFolder =  await fs.getEntryWithUrl("file:/C:/temp");  
      const fileBat = await tempFolder.createFile("{2532-888-086}.bat", { overwrite: true });
      fileBat.write(`@echo off\nchcp 65001\nsetlocal enabledelayedexpansion\nset "folder=${path}"\nfor %%F in ("%folder%\*") do (\nset "fileName=%%~nF"\nset "fileExt=%%~xF"\nset "newFileName="\nfor %%C in (0 1 2 3 4 5 6 7 8 9) do (\nset "temp=!fileName:%%C=!"\nif not "!temp!"=="!fileName!" set "newFileName=!newFileName!%%C"\n )\n if "!newFileName:~0,1!" equ "" set "newFileName=0!newFileName!"\nset "newFileName=PG#0!newFileName!"\nset "fileFullPath=%folder%\!newFileName!!fileExt!"\ncall :renameFile "%%F" "!fileFullPath!"\n)\nexit /b\n:renameFile\nmove %1 %2 >nul 2>&1\nexit /b`); //"${path}"
      const fileVbs = await tempFolder.createFile("{2532-888-086}.vbs", { overwrite: true });
      fileVbs.write(`Set objShell = WScript.CreateObject("WScript.Shell")\nobjShell.Run("C:/temp/{2532-888-086}.bat"), 0, True`);
      shell.openPath("C:/temp/{2532-888-086}.vbs");
   } catch (err) {alert(err)}
}


////:::::::::::::::::::::::::::::::::::::


 /// EXPLORADOR DE ARQUIVOS.BAT
//  @echo off
// chcp 65001
// start "" "E:\Fotos\meu cachorro"



// const files = await fs.getFileForOpening({allowMultiple: true, types: fileTypes.images});
// if (files.length === 0) {
//     // no files selected
// }


////////////ARQUIVO VBS PARA EXECUTAR COMANDOS
// Set objShell = CreateObject("Shell.Application")
// objShell.Explore "Z:\MATRIZ\05.05.2023\Antonio Alves\C,4"
//// OBS! SALVAR COM EXENSÃO (.vbs)




// async function exibirDiretorio(){
//    await criarPasta("file:/C:/",  "temp");
//    const tempFolder =  await fs.getEntryWithUrl("file:/C:/temp");  
//    const file = await tempFolder.createFile("file.vbs", { overwrite: true });
//    const path = app.activeDocument.path.replace(/\\[^\\]*$/, "") //"Z:/MATRIZ/12.05.2023/SHOP/Géssica";
//    file.write(`Set objShell = CreateObject("Shell.Application")\nobjShell.Explore "${path}"`);
//    shell.openPath("C:/temp/file.vbs");
// }





// async function exibirDiretorio(){
//    await criarPasta("file:/C:/",  "temp");
//    const tempFolder =  await fs.getEntryWithUrl("file:/C:/temp");  
//    const file = await tempFolder.createFile("file.bat", { overwrite: true });
//    const path = app.activeDocument.path.replace(/\\[^\\]*$/, "") //"Z:/MATRIZ/12.05.2023/SHOP/Géssica";
//    file.write(`@echo off\nchcp 65001\nstart "" "${path}"`);
//    shell.openPath("C:/temp/file.bat");
// }


////////////ARQUIVO VBS PARA EXECUTAR COMANDOS
// Set objShell = CreateObject("Shell.Application")
// objShell.Explore "Z:\MATRIZ\05.05.2023\Antonio Alves\C,4"
//// OBS! SALVAR COM EXENSÃO (.vbs)

 /// EXPLORADOR DE ARQUIVOS.BAT
//  @echo off
// chcp 65001
// start "" "E:\Fotos\meu cachorro"

// const files = await fs.getFileForOpening({allowMultiple: true, types: fileTypes.images});
// if (files.length === 0) {
//     // no files selected
// }

// Set objShell = WScript.CreateObject("WScript.Shell")
// objShell.Run("C:\yourbatchfile.bat"), 0, True