//////////// OUVITE DE EVENTOS
document.querySelector("#ms_func3").addEventListener("click", () => {
    core.executeAsModal(async () => { await exibirTodososDocs(1)});
 });

document.querySelector("#ms_func4").addEventListener("click", () => {
    core.executeAsModal(async () => { await exibirTodososDocs(2)});
 });

document.querySelector("#ms_func5").addEventListener("click", () => {
    core.executeAsModal(async () => { await novoDocumento()});
 });

document.querySelector("#ms_func7").addEventListener("click", () => {
   core.executeAsModal(async () => {  await app.batchPlay([{"_obj":"save"}]); });  
});

 document.querySelector("#ms_func8").addEventListener("click", () => {
         core.executeAsModal(async () => {
           sannerDlgConfigs();
            // await scannerPSfinalizar();
            // await sannerFilesExecutePS(); return
            // await shell.openPath("C:/Program Files (x86)/Canon/IJ Scan Utility/SCANUTILITY.exe");
         });
});

 document.querySelector("#ms_func9").addEventListener("click", () => {
   core.executeAsModal(async () => { await colorMode(1)});
});

document.querySelector("#ms_func10").addEventListener("click", () => {
   core.executeAsModal(async () => { await colorMode(0)});
});

document.querySelector("#ms_func11").addEventListener("click", () => {
   core.executeAsModal(async () => { await colorMode(2)});
});

function novoDocumento(){
    const command = [{"descriptor": {"_obj":"make","new":{"_obj":"document","depth":8,"fill":{"_enum":"fill","_value":"white"},"mode":{"_class":"RGBColorMode"},"resolution":{"_unit":"densityUnit","_value":300}}}, "options": {"dialogOptions": "display"}}];
    app.batchPlay(command, {});
 }

 function arrangeTela(mtd){
    const method=["tileVertically", "consolidateAllTabs"];
    const command = [{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":method[mtd]}]}];
    app.batchPlay(command, {});
 }

 function colorMode(mtd){
   try {
      const method= ["grayscaleMode", "RGBColorMode", "CMYKColorMode"];
      const command = [{"_obj":"convertMode","to":{"_class":method[mtd]}},];
      app.batchPlay(command, {});
   } catch (err) {alert(err)}
}


////////  SCRIPS JSX  //////////////////////////////////////////////////////////////////////////  
folderJSX = `${Usuario}/AppData/Roaming/Adobe/CEP/extensions/Ps-fxrios/host`;
////////LISTA DE SCRIPTS JSX DP PAINELE CEP
jsxPrintes = `${folderJSX}/1DLG-Printes.jsx`;
jsxSavedoc = `${folderJSX}/1DLG-Savedoc.jsx`;
///JSX AQUI! ++++
/////////////////////////::::::::::::::::::::::

async function exexutarJSXfile(jsxFile) {  
      entrada = await fs.getEntryWithUrl(jsxFile); 
      token = await fs.createSessionToken(entrada)
      await app.batchPlay([{ "_obj": "AdobeScriptAutomation Scripts","javaScript": {"_path": token,"_kind": "local"},"javaScriptMessage": "JSM","_isCommand": true,"_options": {"dialogOptions": "dontDisplay"}}], {});
};
/////////////////////////::::::::::::::::::::::


function sannerDlgConfigs(){
   try {
         const dlgScanner = s1('#dlgScanner')
         dlgScanner.showModal({ title: `PS-fxrios: Scaner Utility`, resize: "both", size: { width:390, height:320}})
         dlgScanner.innerHTML = `
         <style>
         .scan_Container {
            width: 100%;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            border: 1px solid rgb(134, 133, 133);
            padding: 10px;
            background-color: #7c7979;
         }

         .scan_Container td{
            padding: 5px;
         }

         .tdBG{
            background-color: #484949; 
            color: #e2e2e2;
            width: 240px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative; 
         }
         .sc-btnDir{
            position: absolute;
            top: 50%; /* Alinha no topo da célula */
            right: 0; /* Alinha à esquerda da célula */
            transform: translateY(-40%);
            width: 30px;
            height: 100%;
            font-family: UXPSfxIcon;
            display: flex;
            justify-content: center;
            font-size: 17px;
            line-height: 30px; /*Alina o texto verticalmente*/
         }
         

   </style>

      

         <div class="scan_Container">

            <div id="icone01" style="width: 100%; height: 75px; display: flex; align-items: center; background-color: #333333; justify-content: center; padding: 5px;">dfdf</div>
            <div style="display: flex; align-items: center; flex-direction: column;">
               <table style="color: #e2e2e2; width:100%; font-size: 12px; background-color: #5f5f5f; padding: 5px; border-radius: 0px;">
                  <tr>
                     <td style="text-align: right;">Servidor Raiz:</td>
                     <td class="tdBG" style="text-align: left; background-color: #e2e2e2; color: #2c2c2c;  border: 3px solid #484949">
                        <label id="servPath" style="width: 200px; color: #2c2c2c;"></label>
                        <div id="sc-btnBusc" class="sc-btnDir">v</div>
                     </td>
               </tr>

                  <tr>
                     <td style="text-align: right;">Imagem nome:</td>
                     <td class="tdBG" style="text-align: left; ">
                        <div id="sc01" style="margin-right: 3px;" ></div>
                        <input  type="text" id="sc-imgNome"  style="width:100%; height: 23px; padding: 4px; margin: 0px;">
                     </td>
                  </tr>
                  <tr>
                     <td style="text-align: right;">Pasta nome:</td>
                     <td  class="tdBG" style="text-align: left;">
                        <div id="sc02" style="margin-right: 3px;" ></div>
                        <input  type="text"  id="sc-pastaNome" style="width:100%; height: 23px; padding: 4px; margin: 0px; ">
                     </td>
                  </tr>
            </table>
            <sp-checkbox  id="sc-abrPS" size="s" checked><label class="sp-checkbox-txt" >Sempre abrir no Photoshop</label></sp-checkbox >
            </div>

            <div style="width: 100%; display: flex; align-items: center; margin-top: 5px;  padding: 5px; justify-content: flex-end;  background-color: #484949;" >
            <div class=" btnMedio" id="btnScanSair" style=" width:90px;  margin: 2px; font-size: 11px">Sair</div>
            <div class=" btnMedio" id="btnScanPrefs" style=" width:110px;  margin: 2px; font-size: 11px;">Scan Prefences</div>
         </div>
         `;  
         //////// FUNÇÕES AQUI
         s1('#servPath').textContent=  `Z:/MATRIZ/${dataFormatada}`
         s1('#sc-imgNome').value = 'Scan_img';
         s1('#sc-pastaNome').value =  'Scanner_Pasta';

         setTimeout(() => { s1('#sc-pastaNome').focus() }, 150);
         saidaPath  =  s1('#servPath').textContent.replace(/\//g, "\\");
         abrirPs = "True";

         es1.on('#sc-btnBusc', 'click', async () =>{ 
            try {
               scanSaidaFolder = await fs.getFolder();
               saidaPath =scanSaidaFolder.nativePath;
               truncarSaidaPath = encurtaLegendax( saidaPath);
               s1('#servPath').textContent= truncarSaidaPath;
               setTimeout(() => { s1('#sc-pastaNome').focus() }, 150);
            } catch (err) {}
         });

         /////////CHECAR SE ABRIAR IMAGENS NO PS
         es1.on('#sc-abrPS', 'click', async () =>{ 
            if( s1('#sc-abrPS').checked==true){abrirPs = "True"}else{abrirPs = "False"};
         });

         es1.on('#btnScanPrefs', 'click', async () =>{ 
               docNome = s1('#sc-imgNome').value;
               pastaFinal = s1('#sc-pastaNome').value;
               await scannerPSfinalizar();
               await sannerFilesExecutePS(); 
               await uiScanGearInciar();
               await dlgScanner.close();
         });
         es1.on('#btnScanSair', 'click', () =>{dlgScanner.close() })
         
         svgIconesADD('icone01', "250px", "icon101");
         svgIconesADD('sc01', "20px", "icon086");
         svgIconesADD('sc02', "20px", "icon045");

     } catch (error) {alert(error) }
 
};

//////// INCIAR O MONITORAMENTO DA ENTRADA DE ARQUIVOS NA PASTA DOCUMENTS;
async function sannerFilesExecutePS(){
   try {
       await criarPasta(`${Usuario}/AppData/Roaming/`,  "tempScripts");
          const tempFolder = await fs.getEntryWithUrl(`${Usuario}/AppData/Roaming/tempScripts`);  
          const caminhoVBS = await tempFolder.createFile("scannerPSexecutar.vbs", { overwrite: true });

        //  const pastaFinal = "Mauricio Rios";
          const usuarioPC = Usuario.replace(/\//g, "\\");
         // const docNome = "Img";

          const scriptVBS= String.raw ` 
          On Error Resume Next
          Set objFSO = CreateObject("Scripting.FileSystemObject")
          Set objShell = CreateObject("WScript.Shell")
          Set processedFiles = CreateObject("Scripting.Dictionary")
          strFolder = "${usuarioPC}\Documents"
          strPhotoshop = "C:\Program Files\Adobe\Adobe Photoshop 2025\Photoshop.exe"
          
          ' Definir o caminho base para a nova pasta
          strBasePath = "${saidaPath}\${pastaFinal}"
          
          ' Definir se os arquivos devem ser abertos no Photoshop
          openInPhotoshop = ${abrirPs}  ' Você pode alterar para True se quiser abrir os arquivos
          
          Function IsImageFile(fileName)
             ext = LCase(objFSO.GetExtensionName(fileName))
             IsImageFile = (ext = "jpg") Or (ext = "jpeg") Or (ext = "png") Or (ext = "tif") Or (ext = "tiff")
          End Function
          
          Function GetFileExtension(fileName)
             GetFileExtension = LCase(objFSO.GetExtensionName(fileName))
          End Function
          
          Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")
          strQuery = "SELECT * FROM __InstanceCreationEvent WITHIN 1 WHERE " & _
                      "TargetInstance ISA 'CIM_DirectoryContainsFile' AND " & _
                      "TargetInstance.GroupComponent=""Win32_Directory.Name='" & Replace(strFolder, "\", "\\") & "'"""
          
          Set colMonitoredEvents = objWMIService.ExecNotificationQuery(strQuery)
          
          Dim newFolderCreated
          newFolderCreated = False
          Dim strNewFolderPath
          Dim fileCounter
          fileCounter = 1
          
          Do While True
             Set objLatestEvent = colMonitoredEvents.NextEvent
             filePath = Mid(objLatestEvent.TargetInstance.PartComponent, InStr(objLatestEvent.TargetInstance.PartComponent, "=") + 1)
             filePath = Replace(Replace(filePath, """", ""), "\\", "\")
             
             If IsImageFile(filePath) And Not processedFiles.Exists(filePath) Then
                If Not newFolderCreated Then
                   strNewFolderPath = strBasePath 
                   ' Criar a nova pasta
                   If Not objFSO.FolderExists(strNewFolderPath) Then
                      objFSO.CreateFolder(strNewFolderPath)
                   End If
          
                   newFolderCreated = True
                End If
          
                ' Obter a extensão do arquivo
                fileExt = GetFileExtension(filePath)
          
                ' Gerar o novo nome do arquivo com sufixo sequencial de dois dígitos
                newFileName = "${docNome}_" & Right("0" & fileCounter, 2) & "." & fileExt
                newFilePath = strNewFolderPath & "\" & newFileName
          
                ' Mover e renomear o arquivo
                objFSO.MoveFile filePath, newFilePath
          
                ' Verificar se deve abrir no Photoshop
                If openInPhotoshop Then
                   cmdLine = """" & strPhotoshop & """ """ & newFilePath & """"
                   objShell.Run cmdLine, 1, False
                End If
                
                processedFiles.Add newFilePath, Now
                
                ' Incrementar o contador de arquivos
                fileCounter = fileCounter + 1
             End If
          Loop
          `.replace('${pastaFinal}', pastaFinal)
           .replace('${usuarioPC}', usuarioPC)
           .replace('${docNome}', docNome)
           .replace('${saidaPath}', saidaPath)
           .replace('${abrirPs}', abrirPs);

          await require('fs').writeFile( caminhoVBS, scriptVBS , { encoding : "utf-16be" } ) ;  
          await shell.openPath(`${tempFolder.nativePath}/scannerPSexecutar.vbs`);
     } catch (err) {alert(err) };
};
//////////:::::::::::::::::::::::

//////// FINALIZA O MONITORAMENTO DA PASTA DOCUMENTS
async function scannerPSfinalizar(){
   try {
      await criarPasta(`${Usuario}/AppData/Roaming/`,  "tempScripts");
         const tempFolder = await fs.getEntryWithUrl(`${Usuario}/AppData/Roaming/tempScripts`);  
         const caminhoVBS = await tempFolder.createFile("scannerPSfinalizar.vbs", { overwrite: true });
         const scriptVBSfinalizar= String.raw ` 
            Option Explicit
            Sub KillWScriptProcesses()
               Dim objWMIService, colProcesses, objProcess
               Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")
               Set colProcesses = objWMIService.ExecQuery("Select * from Win32_Process Where Name = 'wscript.exe'")
               For Each objProcess In colProcesses
                  objProcess.Terminate()
                  ' WScript.Echo "Terminated process with PID: " & objProcess.ProcessId
               Next
               Set colProcesses = Nothing
               Set objWMIService = Nothing
            End Sub
            KillWScriptProcesses
         `
         await require('fs').writeFile( caminhoVBS, scriptVBSfinalizar , { encoding : "utf-16be" } ) ;  
         await shell.openPath(`${tempFolder.nativePath}/scannerPSfinalizar.vbs`);
    } catch (err) {alert(err) };
};


//////// ENCONTRAR E ABRIR A JANELA DO SCANGEAR
async function uiScanGearInciar(){
   try {
      await criarPasta(`${Usuario}/AppData/Roaming/`,  "tempScripts");
         const tempFolder = await fs.getEntryWithUrl(`${Usuario}/AppData/Roaming/tempScripts`);  
         const caminhoVBS = await tempFolder.createFile("ScanGearInciar.vbs", { overwrite: true });
         const uiScanGearInciar= String.raw ` 
               Option Explicit
               Dim WShell
               ' Aguarda alguns segundos para a janela abrir
               Sub WaitSeconds(intSeconds)
                  WScript.Sleep(intSeconds * 80)
               End Sub
               ' Inicia o processo
               Set WShell = CreateObject("WScript.Shell")
               WShell.Run """C:\Program Files (x86)\Canon\IJ Scan Utility\SCANUTILITY.exe"""
               ' Aguarda a janela abrir
               WaitSeconds(2)
               ' Tenta ativar a janela do IJ Scan Utility
               WShell.AppActivate "Canon IJ Scan Utility"
               WaitSeconds(1)
               ' Simula o clique no botão ScanGear
               WShell.SendKeys "{TAB}"
               WShell.SendKeys "{TAB}"
               WShell.SendKeys "{TAB}"
               WShell.SendKeys "{TAB}"
               WShell.SendKeys "{TAB}"
               WShell.SendKeys "{TAB}"
               WShell.SendKeys "{TAB}"
               WShell.SendKeys " "
               Set WShell = Nothing
         `;
         await require('fs').writeFile( caminhoVBS, uiScanGearInciar, { encoding : "utf-8" } ) ;  
         await shell.openPath(`${tempFolder.nativePath}/ScanGearInciar.vbs`);
    } catch (err) {alert(err) };
};



////ENCURTAR A LEGENDA
function encurtaLegendax(path) {
   const dirs = path.split("\\");
   if (dirs.length > 3) { dirs.splice(2, dirs.length - 4, "..");}; return dirs.join("\\");
}

function formatarData(data = new Date()) {
   const dia = data.getDate().toString().padStart(2, '0');
   const mes = (data.getMonth() + 1).toString().padStart(2, '0');
   const ano = data.getFullYear();
    // Formatação personalizada
   const formato1 = `${dia}.${mes}.${ano}`;
    return `${formato1}`;
 }
 
 // Obtendo a data formatada
 const dataFormatada = formatarData();
 console.log(dataFormatada); // Ex:  02.01.2025



 async function svgIconesADD(id, size, icone) {
   const response = await fetch(`/icons/svg/${icone}.svg`);
   if (!response.ok) {
       throw new Error(`Failed to load icon: ${icone}`);
   }
   
   const svgCode = await response.text();
   const iconeSVG = s1(`#${id}`)
   iconeSVG.innerHTML = `
       <style>
            .${id} {
               width: ${size};
               height: ${size}; // Mudei de 70px para size para manter proporção
               display: flex;
               justify-content: center;
               align-items: center;
         }
         .${id} svg,
         .${id} svg path,
         .${id} svg rect,
         .${id} svg circle,
         .${id} svg polygon {
               width: 100% !important;
               height: 100% !important;
               fill: #b8b8b8 !important;
         }
      </style>
      <div class="${id}">${svgCode}</div>
   `;
};

////////teste