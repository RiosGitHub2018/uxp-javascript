document.querySelector("#dgm-btn2").addEventListener("click", () => {
    dlgRenamArquivos() 
 });

 document.querySelector("#dgm-btn7").addEventListener("click", () => {
    dlgRotateScala(); 
 });

 document.querySelector("#dgm-btn8").addEventListener("click", () => {
    dlgDivideImagem(); 
 });

 document.querySelector("#dgm-btn9").addEventListener("click", () => {
    dlgADDframesr();
 });
 
 document.querySelector("#dgm-btn10").addEventListener("click", () => {
    dlgInserirImg();
 });

 document.querySelector("#dgm-btn11").addEventListener("click", () => {
    trocarImagem(); 
 });

 document.querySelector("#dgm-btn12").addEventListener("click", () => {
    mesclarFrames();
 });

 document.querySelector("#dgm-btn13").addEventListener("click", () => {
    desabilitaMask()
 });

 document.querySelector("#dgm-btn15").addEventListener("click", async () => {
    const atualDocPath = `${app.activeDocument.path.replace(/\\[^\\]*$/, "")}\\${app.activeDocument.name}`;
    await illustratorEditar(atualDocPath);
   await shell.openPath(`${Usuario}/AppData/Roaming/tempScripts/illustratorEdit.bat`)
 });



///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////FUNÇÕES AQUI!////////////////////////////////
 ////// CARREGAR JALELA  DIVIDIR IMAGEM
 async function dlgDivideImagem(){
    try {
        docMatriz = app.activeDocument.id;
        dlg = document.querySelector("#dlgDividirIMG");
        dlg.show({ title: `PS-fxrios: Dividir Imagens`, resize: "both", size: { width: 320, height:100}})
        dlg.innerHTML =`<style> .dvimg_main { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; margin: auto; padding: 10px; border: 1px solid rgb(65, 65, 65); border-radius: 10px; background-color: #615f5f; } .dvimg_Container { width: 100%; display: flex; flex-direction: column; flex-wrap: wrap; align-items: left; border: 1px solid rgb(65, 65, 65); padding: 10px; } .btColor { width: 28px; height: 21px; margin: 8px; background-color: #ffffff; border: 1px solid rgb(0, 0, 0); } .btColorDesabilitado { pointer-events: none; background-color: #5c5b5b; border: 1px solid rgb(78, 78, 78); } </style> <!-- //////// DIALOGO LAYOUT --> <div class="dvimg_main"> <div class="dvimg_Container"> <h1 style="color: #a19f9f; font-size: 25px; transform: translateX(25px);">Dividir Imagem</h1> <sp-divider style="margin: 0 0 10px 0"></sp-divider> <div style="width: 245px; background-color: #414040; padding: 5px;  transform: translateX(5px); border-radius: 2px;"> <label style="color: #dddddd; font-size: 12px; margin: 0px; display: flex; justify-content: center;  ">Preferências:</label> </div> <div style="display: flex;"> <div style="width: 125px; height: 70px; display: flex; flex-direction: column;  border: 1px solid rgb(65, 65, 65); border-radius: 5px;margin: 5px; padding: 5px; "> <div style="transform: translate(5px, -5px);"> <div style="display: flex; align-items: center;"> <label style="color: #dddddd; font-size: 12px; margin: 0px; transform: translateX(4px); ">Horizontal:</label> <select id="horizLista" style="width: 38px;"> </select> </div> <div style="display: flex; align-items: center; transform: translate(17px, -10px); "> <label style="color: #dddddd; font-size: 12px; margin: 0px; transform: translateX(4px); ">Vertical:</abel> <select id="vertcLista" style="width: 38px; transform: translateX(-5px);"> </select> </div> </div> </div> <div style="width: 115px; height: 70px; display: flex; flex-direction: column;  border: 1px solid rgb(65, 65, 65); border-radius: 5px;margin: 5px; padding: 5px;"> <div style="transform: translate(0px, 5px);"> <div class="cb-default cb-checado" id="ck-Salvar"><span class="cb-text" style="width: 90px;">Salvar Cortes</span></div> <div class="cb-default" id="ck-Fechar" style="transform: translate(0px, 5px);"><span class="cb-text" style="width: 90px; ">Fechar Cortes</span></div> </div> </div> </div> </div> <div style="width: 100%; display: flex; align-items: center; margin-top: 5px; border: 1px solid #474747; padding: 10px; justify-content: center; border-radius: 0 0 7px 7px; background-color: #4e4d4d;"> <div class="btnMedio" id="dvimg_btn1" style="width: 100px; margin: 5px;">Fechar</div> <div class="btnMedio" id="dvimg_btn2" style="width: 100px; margin: 5px;">Process</div> </div> </div>`;
        /////////:::::::::::::::::
        ///// FUNÇÃO  VALIDA CHECKBOX  1
        checadoCK1 =true;
        checadoCK2 =false;
        ck001 = document.getElementById("ck-Salvar");
        ck002= document.getElementById("ck-Fechar");
        ck001.addEventListener("click", function(){
            if (checadoCK1 === false) {ck001.classList.add('cb-checado'); checadoCK1 =true; }
            else {ck001.classList.remove('cb-checado'); checadoCK1= false;};
        });
    
        ck002.addEventListener("click", function(){
            if (checadoCK2=== false) {ck002.classList.add('cb-checado'); checadoCK2 =true; }
            else {ck002.classList.remove('cb-checado'); checadoCK2= false;};
        });
        /////////:::::::::::::::::
        const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
            horizLista = document.querySelector('#horizLista'); 
            vertcLista = document.querySelector('#vertcLista'); 
            for (let i = 0; i < options.length; i++) {horizLista.innerHTML  += `<option value="${options[i]}">${options[i]}</option>`;}
            for (let i = 0; i < options.length; i++) {vertcLista.innerHTML += `<option value="${options[i]}">${options[i]}</option>`;}
            horizLista.selectedIndex=0;
            vertcLista.selectedIndex=0;
            
            async function DivideImagem(){
                try{
                    await core.executeAsModal(async () => {
                        dlg.close('OK');
                        path = app.activeDocument.path.replace(/\\[^\\]*$/, "");
                        contagem = 0;
                        const row= Number( horizLista.selectedIndex+1);  
                        const column = Number( vertcLista.selectedIndex+1);
    
                        if (checadoCK1 === true) {
                            try{ nome = app.activeDocument.name.match(/(.*)\.[^\.]+$/)[1];} 
                            catch(e){nome="ImgCorte"}; 
                        }
         
                        bounds0= 0;
                        bounds1= 0; 
                        bounds2= app.activeDocument.width;
                        bounds3= app.activeDocument.height;
                
                        var sWidth =  (parseFloat(bounds2)-parseFloat(bounds0))/column-0+0/(row );
                        var sHeight = (parseFloat(bounds3)-parseFloat(bounds1))/row-0+0/(column );
                        var leftSide =   parseFloat(bounds0), topSide = parseFloat (bounds1);   
                        
                        arrOrdemSave=[];
                        for(var i=0; i<row; i++){    
                            leftSide = parseFloat (bounds0);    
                            for(var j=0; j<column; j++){ 
                                arrOrdemSave.push(column[j]);
                                ordemSave = arrOrdemSave.length;
                                await AreaCortes (topSide, leftSide, topSide + sHeight, leftSide + sWidth); 
                                leftSide += sWidth;
                            };
                            topSide += sHeight;
                        }; 
                    },{"interactive": true});
    
                    async function AreaCortes(top, left, bottom, right) {
                            const nomeDoc = app.documents.length
                            contagem = Number(contagem)+1 ;
                            novoNome = `${nome}_part_0${contagem}`; //novoNome = `${nome.substr(0, 2)}_part_00${nomeDoc}`; //// NOME ABREVIADO
                            app.activeDocument.duplicate (novoNome, true)
                            await app.batchPlay( [{"AutoFillMethod":1,"_obj":"crop","angle":{"_unit":"angleUnit","_value":0.0},"cropAspectRatioModeKey":{"_enum":"cropAspectRatioModeClass","_value":"targetSize"},"cropFillMode":{"_enum":"cropFillMode","_value":"defaultFill"},"delete":true,"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":bottom},"left":{"_unit":"pixelsUnit","_value":left},"right":{"_unit":"pixelsUnit","_value":right},"top":{"_unit":"pixelsUnit","_value":top}}}]);
                            if (checadoCK1 == true) {await  salvarImagens();}
                            if (checadoCK2 == true) {await  app.activeDocument.closeWithoutSaving();}//// FECHA activeDocPath
                          //  app.activeDocument = app.documents[0]; //// RETORNA AO activeDocPath MATRIZ
                           await app.batchPlay([{"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}], {});//// RETORNA AO activeDocPath MATRIZ
                    };
    
                    //////////////////////////////////////////////
                    /////// CRIAR E SALVAR NA SUBPASTA DENTRO DA PASTA RAÍZ
                    async function salvarImagens(){
                        try {
                            const Entrada = await fs.getEntryWithUrl(`file:${path}`); 
                            const entries = await Entrada.getEntries();   
                            subfolder = entries.filter((entry) => entry.isFolder).find((subFolder) => subFolder.name === "FinalCortes");
                            if (!subfolder) {subfolder = await Entrada.createFolder("FinalCortes");}
                            newFileName =  `${nome}_part_0${ordemSave}`;
                            var myFile = await subfolder.createFile(newFileName, { overwrite: true });
                           // app.activeDocument.saveAs.jpg(myFile, { quality: 100, embedColorProfile: true}, true);  
                            app.activeDocument.saveAs.png(myFile, { compression: 6}, true);
                        } catch (err) {alert(err)};
                    };
                    
                   if (checadoCK1 == true) {await  abrirDirCortadas()};
                   async function abrirDirCortadas(){
                        await criarPasta("file:/C:/",  "temp");
                        const tempFolder =  await fs.getEntryWithUrl("file:/C:/temp");  
                        const fileBat = await tempFolder.createFile("{987-321-65466666}.bat", { overwrite: true });
                        await fileBat.write(`@echo off\nchcp 65001\nstart ""  "${subfolder.nativePath}"`);
                        await shell.openPath("C:/temp/{987-321-65466666}.bat");
                    };
                }
                catch(e){alert(e)};
            };
            document.querySelector("#dvimg_btn1").addEventListener("click", () => {dlg.close('OK'); });
           document.querySelector("#dvimg_btn2").addEventListener("click", () => { DivideImagem() });
        } catch (err) {alert(err)}
    }


 ////// CARREGAR JALELA ADD IMAGEM AO FRAME
 async function dlgInserirImg() {
    dlg = document.querySelector("#dlgInserirImg");
    dlg.show({ title: `PS-fxrios: Inserir Imagens`, resize: "both", size: { width: 200, height:100}})
    dlg.innerHTML = `<style> .aimg_main { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; margin: auto; padding: 10px; border: 1px solid rgb(65, 65, 65); border-radius: 10px; background-color: #615f5f; } .aimg_Container { width: 100%; display: flex; flex-direction: column; flex-wrap: wrap; align-items: center; border: 1px solid rgb(65, 65, 65); padding: 10px; } </style> <!-- //////// DIALOGO LAYOUT --> <div class="aimg_main"> <div class="aimg_Container"> <h1 style="color: #a19f9f;">Inserir Imagens</h1> <sp-divider></sp-divider> <div style="width: 100%; height: 135px; border: 1px solid rgb(65, 65, 65); margin-top: 5px; padding: 5px;"> <!--/////////////CHECKBOX SEPARA INSERIDAS --> <div style="width: 200px; display: flex; flex-direction: column; margin: 2px 10px; align-items: center; justify-content: center;"> <div style="display: flex; align-items: center; justify-content: center;  transform: translateX(-50px);"> <div class="cb-default" id="aimg-CK03" ><span class="cb-text" style="">Inseir em Lote</span></div> <div class="btnMedio elem-Desabilitado" id="aimg_btn3" style="width: 70px; margin: 5px; transform: translateX(70px);">Diretório</div> </div> <label id="txt-diretorio" style="color: #a8a8a8; font-size: 11px; transform: translateX(-10px); ">C://Diretotio..........</label> </div> <sp-divider style=" transform: translateY(5px); "></sp-divider> <div style="display: flex; flex-direction: column; transform: translateY(10px); margin: 2px 8px"> <div class="cb-default cb-checado" id="aimg-CK01" ><span class="cb-text" style="width: 100%;">Separe imagens Inseridas</span></div> <div class="cb-default cb-checado" id="aimg-CK02" ><span class="cb-text" style="width: 100%;">Ajustar enquandramento</span></div> </div> </div> <div style="width: 100%; display: flex; align-items: center; margin-top: 5px; border: 1px solid #474747; padding: 10px; justify-content: center; border-radius: 0 0 7px 7px; background-color: #4e4d4d;"> <div class="btnMedio" id="aimg_btn1" style="width: 100px; margin: 5px;">Fechar</div> <div class="btnMedio" id="aimg_btn2" style="width: 100px; margin: 5px;">Inserir</div> </div> </div>`
        /////////:::::::::::::::::
        nomefile=[];   imagens=[];  validarPasta=[];
        checadoCK1 = true;  checadoCK2 = true;  checadoCK3 = false; 
        ck001 = document.getElementById("aimg-CK01");
        ck002 = document.getElementById("aimg-CK02");
        ck003 = document.getElementById("aimg-CK03");

        ///// FUNÇÃO  VALIDA CHECKBOX  1
        ck001.addEventListener("click", function(){
            if (checadoCK1 === false) {ck001.classList.add('cb-checado'); checadoCK1 =true; }
            else {ck001.classList.remove('cb-checado'); checadoCK1= false;};
        });

         ///// FUNÇÃO  VALIDA CHECKBOX  2
        ck002.addEventListener("click", function(){
            if (checadoCK2 === false) {ck002.classList.add('cb-checado'); checadoCK2 =true; }
            else {ck002.classList.remove('cb-checado'); checadoCK2= false;};
        });

        ///// FUNÇÃO  VALIDA CHECKBOX  3
        ck003.addEventListener("click", function(){
        if (checadoCK3 === false) { 
            ck003.classList.add('cb-checado'); checadoCK3 =true;
            document.getElementById("aimg_btn3").classList.remove('elem-Desabilitado')
        }
        else { 
            ck003.classList.remove('cb-checado'); checadoCK3= false; 
            document.getElementById("aimg_btn3").classList.add('elem-Desabilitado')
             };
        });

     async function abrirDiretorio(){
        core.executeAsModal(async () => {
                pasta = await fs.getFolder();
                const caminho = pasta.nativePath.replace(/\\/g, "/");  
                const truncatedPath = encurtaLegenda(caminho);
                document.getElementById("txt-diretorio").innerHTML= truncatedPath;
                files = await pasta.getEntries();
                for (const arquivo of files) {imagens.push(arquivo)}
                validarPasta= pasta;
             });
        };

        async function abrirPoraquivo(){
            core.executeAsModal(async () => {
                const arquivo = await fs.getFileForOpening();
            });
        };

     ////////////////////////////////////////
        /// FUNÇÃO ADD IMAGENS =====
        async function adicionarImagens(){
            try {
                await core.executeAsModal(async (executionContext) => {
                    ////// FUNÃO SUSPENDHISTORY DA FUNÇÃO INICIAL
                    let hostControl = executionContext.hostControl; documentID = app.activeDocument.id; 
                    suspensionID = await hostControl.suspendHistory({ "documentID": documentID,"name": "Inserir Imagem" });
                    //////:::::::::::::::::::
                    const targetFrames=[];
                    const activeLayers = app.activeDocument.activeLayers;
                    
                    if(activeLayers.length == 0){ alert("Você não selecionou as camadas!"); return};
                    if(checadoCK3 === true){if(validarPasta==""){alert("Selecione o Diretório!"); return};}
                    dlg.close('OK');
                    
                    activeLayers.forEach( camada  => camada.selected = false);
                    activeLayers.forEach((camada, idx) => {camada.selected = true; targetFrames.push(activeLayers[idx].name);});
                    activeLayers.forEach( camada  => camada.selected = true);
                    for(var i = 0;i<targetFrames.length; i++){ 
                            if(checadoCK3 == true){if ( i === imagens.length) { break;}};
                            targetFrames[i];
                            filesFolder = imagens[i];
                            nomefile = imagens[i];
                            await app.batchPlay( [{"_obj":"select","_target":[{"_name":targetFrames[i],"_ref":"layer"}],"makeVisible":false}], {});
                            await statusBorder();
                            await ColorBorder(1000, 0, 0, 0);  ///// ADICIONAR BORDAawait  ColorBorder(1000); ///// ADICIONAR BORDA
                            await importImagens();
                        }
                    activeLayers.forEach( camada  => camada.selected = true);
                },{"interactive": true});
            } catch (e) {alert(e)}
        }
        /////////////////:::::::::::::::::
        //////////IMPORTA  AS INMAGENS  POR BUSCA INDIVIDUAL
        async function importImagens(){
                  try {
                        await ColorBorder(1000, 0, 0, 0); 
                        const fs = require('uxp').storage.localFileSystem;
                        if(checadoCK3 === false){
                            directory = await fs.getFileForOpening();
                            nomefile = directory; 
                            pastaRaiz = directory.nativePath.split("\\").slice(0, -1).join("\\")+"\\" ;
                            }
                        else{
                            directory = await fs.getEntryWithUrl(filesFolder.nativePath);
                            pastaRaiz = directory.nativePath.split("\\").slice(0, -1).join("\\")+"\\" ;
                        }

                        if(checadoCK1 == true){ await moverParasubpasta();}
                        else{token = await fs.createSessionToken(directory);}

                        await ColorBorder(borderSize, blue, grain, red)  ///// ADICIONAR BORDA
                        await app.batchPlay([{"_obj":"placeEvent","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"linked":true,"null":{"_kind":"local","_path":token},"offset":{"_obj":"offset","horizontal":{"_unit":"distanceUnit","_value":0.0},"vertical":{"_unit":"distanceUnit","_value":0.0}},"replaceLayer":{"_obj":"placeEvent","from":{"_ref":"layer"},"to":{"_ref":"layer"}}}]);
                        if(checadoCK2 === true){
                             await app.batchPlay([{"descriptor": {"_obj":"transform","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"height":{"_unit":"percentUnit","_value":100},"offset":{"_obj":"offset","horizontal":{"_unit":"distanceUnit","_value":0},"vertical":{"_unit":"distanceUnit","_value":0}},"replaceLayer":{"_obj":"transform","from":{"_id":727,"_ref":"layer"},"to":{"_id":727,"_ref":"layer"}},"width":{"_unit":"percentUnit","_value":100}}, "options": {"dialogOptions": "display"}}]);
                          };
                 } 
                 catch (err) {await ColorBorder(borderSize, blue, grain, red) }
        }
            /////////////////:::::::::::::::::
            async function moverParasubpasta(){
                try {
                    const folder = await fs.getEntryWithUrl(pastaRaiz); 
                    const entries = await folder.getEntries();   
                    let subfolder = entries.filter((entry) => entry.isFolder).find((subFolder) => subFolder.name === "Imgs-Usadas");
                    if (!subfolder) {subfolder = await folder.createFolder("Imgs-Usadas");}
                    let file = await folder.getEntry(nomefile.name);
                    await file.moveTo(subfolder);
                    token = await fs.createSessionToken(file); 
                    } 
                catch (err) {}
            }
        //////////ADICIONA BORDA PRETA  100% FECHADA  AO FRAME
        async function ColorBorder(borda, blue, grain, red  ) {
            try {
                let command = [
                    {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"framedGroupSection","_value":"targetEnum"}],"to":{"_obj":"shapeStyle","fillContents":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":0.0,"grain":0.0,"red":0.0}},"strokeStyle":{"_obj":"strokeStyle","fillEnabled":true,"strokeEnabled":true,"strokeStyleLineAlignment":
                    {"_enum":"strokeStyleLineAlignment","_value":"strokeStyleAlignInside"}, "strokeStyleLineWidth":{"_unit":"pixelsUnit","_value":borda}, "strokeStyleContent":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":blue,"grain":grain,"red":red}},"strokeStyleVersion":2}}}
                ];
                await app.batchPlay(command, {});
            } catch (err) {alert(arr) }
        };
    ///////// OUVINTES DE EVENTOS AQUI!
    document.querySelector("#aimg_btn3").addEventListener("click", () => {abrirDiretorio()});
    document.querySelector("#aimg_btn1").addEventListener("click", () => {dlg.close('OK'); });
    document.querySelector("#aimg_btn2").addEventListener("click", () => {adicionarImagens() });
};
////// CARREGAR JALELA ADD IMAGEM AO FRAME:::::::::::::::::::

 ////// CARREGAR JALELA RENOMEAR CAMDA
 async function dlgADDframesr(){
    try {
         cmdSelecinadas = app.activeDocument.activeLayers;
         string = app.activeDocument.activeLayers[0].name;
        if (string.includes("Frame") || string.includes("Color Fill")) {
            if(cmdSelecinadas.length !=1){alertar("Você selecionou mais de uma Camada!"); return};
            await statusBorder(); await dividirFrame();
        } 
        else {if(app.activeDocument.selection.bounds===null){alertar("Você não criou a Seleção!");return}
        else{ red= 255; grain= 255; blue=255; ColorBHSolicitada=false }}

        if(app.documents.length ===0){alertar("Não ha activeDocPath na área de trabalho!");return};
        dlg = document.querySelector("#dlgADDframesr");
        dlg.show({ title: `PS-fxrios: ADD Frames Mask`, resize: "both", size: { width: 305, height:100}})
        dlg.innerHTML =`<style> .dvimg_main { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; margin: auto; padding: 10px; border: 1px solid rgb(65, 65, 65); border-radius: 10px; background-color: #615f5f; } .dvimg_Container { width: 100%; display: flex; flex-direction: column; flex-wrap: wrap; align-items: left; border: 1px solid rgb(65, 65, 65); padding: 10px; } .btColor { width: 28px; height: 21px; margin: 8px; background-color: #ffffff; border: 1px solid rgb(0, 0, 0); } .btColorDesabilitado { pointer-events: none; background-color: #5c5b5b; border: 1px solid rgb(78, 78, 78); } </style> <!-- //////// DIALOGO LAYOUT --> <div class="dvimg_main"> <div class="dvimg_Container"> <h1 style="color: #a19f9f; font-size: 25px; transform: translateX(5px);">ADD Frames Mask</h1> <sp-divider style="margin: 0 0 10px 0"></sp-divider> <div style="width: 230px; background-color: #414040; padding: 5px;  transform: translateX(5px); border-radius: 2px;"> <label style="color: #dddddd; font-size: 12px; margin: 0px; display: flex; justify-content: center;  ">Preferências:</label> </div> <div style="display: flex;"> <div style="width: 110px; height: 100px; display: flex; flex-direction: column;  border: 1px solid rgb(65, 65, 65); border-radius: 5px;margin: 5px; padding: 5px; "> <div style="transform: translate(5px, 0px);"> <div style="display: flex; align-items: center;"> <label style="color: #dddddd; font-size: 12px; margin: 0px; transform: translateX(4px); ">Linhas:</label> <select id="listLinhas" style="width: 45px;"> </select> </div> <div style="display: flex; align-items: center; transform: translateY(-10px); "> <label style="color: #dddddd; font-size: 12px; margin: 0px; transform: translateX(4px); ">Colun.:</label> <select id="lisColunas" style="width: 45px; transform: translateX(-1px);"> </select> </div> <div style="display: flex; align-items: center; transform: translateY(-20px); "> <label style="color: #dddddd; font-size: 12px; margin: 0px; transform: translateX(4px); ">Distancia:</label> <input type="number" id="distance" value="10" style="width: 30px; height: 21px; padding: 2px;"> </div> </div> </div> <div style="width: 110px; height: 100px; display: flex; flex-direction: column;  border: 1px solid rgb(65, 65, 65); border-radius: 5px;margin: 5px; padding: 5px;"> <div style="transform: translate(5px, 5px);"> <div class="cb-default" id="ck-dvimgBorda"><span class="cb-text" style="width: 90px;">ADD Borda</span></div> <div style="display: flex; align-items: center; transform: translateY(0px); "> <label style="color: #dddddd; font-size: 12px; margin: 0px; transform: translateX(4px); ">Tamanho:</label> <input type="number" id="frameBorda" value="5" style="width: 30px; height: 21px; padding: 2px;"> </div> <div style="display: flex; align-items: center; transform: translate(30px, -10px);"> <label style="color: #dddddd; font-size: 12px; margin: 0px; transform: translateX(4px); ">Cor:</label> <div class="btColor btColorDesabilitado" id="dvimg_btnCor"></div> </div> </div> </div> </div> <div style="width: 230px; height: 44px; display: flex; border: 1px solid rgb(65, 65, 65); border-radius: 5px;margin: 5px; padding: 3px; align-items: center; "> <label style="color: #dddddd; font-size: 12px; transform: translateX(7px); margin: 1px;">Frame Molde:</label> <select id="listFMoldes" style="width: 127px; transform: translateX(5px);"> <option>Retangular</option> <option>Cantos redondo</option> <option>Elipse-Sêlo</option> <option>Retang-Sêlo</option> <option>Classic-Sêlo</option> <option>Elipse-Basica</option> <option>Coração</option> </select> </select> </div> </div> <div style="width: 100%; display: flex; align-items: center; margin-top: 5px; border: 1px solid #474747; padding: 10px; justify-content: center; border-radius: 0 0 7px 7px; background-color: #4e4d4d;"> <div class="btnMedio" id="dvimg_btn1" style="width: 100px; margin: 5px;">Fechar</div> <div class="btnMedio" id="dvimg_btn2" style="width: 100px; margin: 5px;">Process</div> </div> </div>`;

        
        ///// FUNÇÃO  VALIDA CHECKBOX EXIBIR LOGO INICIO
        checadoCK2 = false;
        corSolicitada =false;
        ckBorda = document.getElementById("ck-dvimgBorda");
        bodaCor = document.querySelector("#dvimg_btnCor");
        bordaSize = document.querySelector("#frameBorda");
        distance=  document.querySelector("#distance");
        listLinhas = document.querySelector('#listLinhas'); 
        lisColunas = document.querySelector('#lisColunas');  
        listFMoldes = document.querySelector('#listFMoldes'); 

        distance.value=0;

        dlg.addEventListener('load', evt => {
        setTimeout(() =>{ document.getElementById("distance").focus();}, 150)
        });

        /////////////////   ATALHOS DO TECHADO INIAIAR
        document.addEventListener("keydown", handleEnterKey);
        async function handleEnterKey(e) {
            if (e.keyCode === 38) { distance.value =Number( distance.value)+1}
            if (e.keyCode === 40) { distance.value =Number( distance.value)-1 } 
            if (e.keyCode === 13) {
            } /// BORDA -
        };
        /////////////////  ATALHOS DO TECHADO FIANAL
        ///////////////////////////////////////////////////////


        listFMoldes.addEventListener("change", function(){
            if( listFMoldes.selectedIndex ===1){ shapeName = "SP-CA Quad"}
            if( listFMoldes.selectedIndex ===2){ shapeName = "SP-S Elípse"}
            if( listFMoldes.selectedIndex ===3){ shapeName = "SP-SL Quad"}   
            if( listFMoldes.selectedIndex ===4){ shapeName = "Classic_selo"}
            if( listFMoldes.selectedIndex ===5){ shapeName = "SP-Elípse"}
            if( listFMoldes.selectedIndex ===6){ shapeName = "SP-Coração2";}
        });
              
        const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        for (let i = 0; i < options.length; i++) {listLinhas.innerHTML  += `<option value="${options[i]}">${options[i]}</option>`;}
        for (let i = 0; i < options.length; i++) {lisColunas.innerHTML += `<option value="${options[i]}">${options[i]}</option>`;}
        listLinhas.selectedIndex=0;
        lisColunas.selectedIndex=0;
        listFMoldes.selectedIndex=0;
      
        bodaCor.classList.add('btColorDesabilitado');
        document.querySelector("#frameBorda").disabled= true;

         ///// FUNÇÃO  VALIDA CHECKBOX 
        ckBorda.addEventListener("click", function() {
            if (checadoCK2 === false) { 
                ckBorda.classList.add('cb-checado'); checadoCK2 =true;
                bordaConfigs();
            }
            else { 
                ckBorda.classList.remove('cb-checado'); checadoCK2 = false; 
                document.querySelector("#frameBorda").disabled=true 
                bodaCor.classList.add('btColorDesabilitado'); bodaCor.style.backgroundColor ="#5c5b5b";
                red= 255; grain= 255; blue=255;
            };
        });

        function bordaConfigs() {
            ckBorda.classList.add('cb-checado'); checadoCK2 =true;
            document.querySelector("#frameBorda").disabled= false;
            bodaCor.classList.remove('btColorDesabilitado'); 
            if(corSolicitada===true){ bodaCor.style.backgroundColor = newcolorhex;}
            if(ColorBHSolicitada ==true){bodaCor.style.backgroundColor = ColorBH;}
            else{bodaCor.style.backgroundColor = "#ffffff";}
            bordaSize.value = document.querySelector("#frameBorda").value;
        }

        if(ColorBHSolicitada == true){ 
            if(borderSize !=0){bordaConfigs(); bordaSize.value = borderSize;}
        };
        ///// FUNÇÃO  VALIDA CHECKBOX  FINAL:::::::::::::::
    
        /////////SELECIONAR COR DA BODA
        bodaCor.addEventListener("click", async () => {getColorPickerRGBH('#dvimg_btnCor')});
        document.querySelector("#dvimg_btn1").addEventListener("click", () => {dlg.close('OK'); });
        document.querySelector("#dvimg_btn2").addEventListener("click", () => {
            if(distance.value ==""){alertar("Adicione o tamanho do espaçamento!"); return}
            dlg.close('OK');  maskConfis();
        });

        /// FUNÇÃO ADD MASCARAS NA SELEÇÃO
        async function maskConfis(){
            await core.executeAsModal(async (executionContext) => {
                ////// FUNÃO SUSPENDHISTORY DA FUNÇÃO INICIAL
                let hostControl = executionContext.hostControl; documentID = app.activeDocument.id; 
                suspensionID = await hostControl.suspendHistory({ "documentID": documentID,"name": "Add Frames" });
                //////:::::::::::::::::::
                camdaFrames=[];
                if(document.querySelector("#frameBorda").disabled === true){
                    document.querySelector("#frameBorda").value = 0;
                }
        
                const row = Number(listLinhas.selectedIndex+1);
                const coln = Number(lisColunas.selectedIndex+1);
                const lineSize = Number(distance.value);
                const borda= Number(bordaSize.value);

                const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'selection' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
                const left   = result[0].selection.left._value;        //-->  bounds[0]
                const right = result[0].selection.right._value;      //-->  bounds[2]
                const top   = result[0].selection.top._value;        //-->  bounds[1]
                const botn = result[0].selection.bottom._value;   //-->  bounds[3]

                const lineAdjW = lineSize/row;
                const lineAdjH = lineSize/coln;
                const sWidth  = (parseFloat(right)-parseFloat(left))/coln-lineSize+lineSize/(coln); 
                const sHeight = (parseFloat(botn)-parseFloat(top))/row-lineSize+lineSize/( row); 
                const leftSide = parseFloat (right); topSide = parseFloat (top);
            
                for(var i=0;i<row;i++){  
                let leftSide = parseFloat (left);  
                    for(var j=0;j<coln;j++){  
                        await  Create_Rectangle (topSide, leftSide, topSide + sHeight, leftSide + sWidth)
                        leftSide += sWidth + lineSize}  
                        topSide += sHeight  +lineSize;
                        }

                        async function Create_Rectangle(t,l,b,r) {  
                        //  contagem = Number(contagem)+1 ;  
                        await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":b},"left":{"_unit":"pixelsUnit","_value":l},"right":{"_unit":"pixelsUnit","_value":r},"top":{"_unit":"pixelsUnit","_value": t}}}], { synchronousExecution: false, });
                        //// OPÇÃO: FRAMES PADÕES:
                        if( listFMoldes.selectedIndex ===0){ 
                            await app.batchPlay( [{"_obj":"make","_target":[{"_ref":"framedGroupSection"}],"framedGroupRect":{"_obj":"classFloatRect","bottom":b,"left":l,"right":r,"top":t}}], { synchronousExecution: false, });
                        }
                        else{ await shapeToframe(b,l,r,t, shapeName); /*OPÇÃO: SHAPES TO FRAMES:*/};
                        camdaFrames.push(app.activeDocument.activeLayers[0].name);
                        /////////////////////
                        await  ColorBorder( borda, blue, grain, red); ///// ADICIONAR BORDA
                    };
                    await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}], { synchronousExecution: false, });
                    for (var i=0;i<camdaFrames.length;i++){
                        await app.batchPlay( [{"_obj":"select","_target":[{"_name": camdaFrames[i],"_ref":"layer"}],"makeVisible":false,"selectionModifier":{"_enum":"selectionModifierType","_value":"addToSelection"}}]);
                    };
                });
        };/// FUNÇÃO ADD MASCARAS NA SELEÇÃO

        ////////// COLOR BORDER
        async function ColorBorder(borda, blue, grain, red  ) {
            let command = [
              {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"framedGroupSection","_value":"targetEnum"}],"to":{"_obj":"shapeStyle","fillContents":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":0.0,"grain":0.0,"red":0.0}},"strokeStyle":{"_obj":"strokeStyle","fillEnabled":true,"strokeEnabled":true,"strokeStyleLineAlignment":
              {"_enum":"strokeStyleLineAlignment","_value":"strokeStyleAlignInside"}, "strokeStyleLineWidth":{"_unit":"pixelsUnit","_value":borda}, "strokeStyleContent":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":blue,"grain":grain,"red":red}},"strokeStyleVersion":2}}}
            ];
            await app.batchPlay(command, {});
        }
        
        async function shapeToframe(b,l,r,t, shape) {
          let command =  [
              {"_obj":"set","_target":[{"_property":"workPath","_ref":"path"}],"to":{"_obj":"customShape","bottom":{"_unit":"pixelsUnit","_value":b},"keyOriginType":9,"left":{"_unit":"pixelsUnit","_value":l},"name": shape,"right":{"_unit":"pixelsUnit","_value":r},"top":{"_unit":"pixelsUnit","_value":t}}},
              {"_obj":"make","_target":[{"_ref":"contentLayer"}],"using":{"_obj":"contentLayer","type":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":255.0,"grain":255.0,"red":255.0}}}},
              {"LockPPI": false, "PreferredResolution": 300.0, "SavedIteratedName": "", "_obj": "make", "_target": [{ "_ref": "framedGroupSection" }], "framedGroupPath": { "_obj": "pathClass", "pathComponents": [{ "_obj": "pathComponent", "shapeOperation": { "_enum": "shapeOperation", "_value": "add" }, "subpathListKey": [{ "_obj": "subpathsList", "closedSubpath": true, "points": [{ "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value":0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }] }] }] }, "framedGroupPathResolution": 300.0, "framedGroupRect": { "_obj": "classFloatRect", "bottom": 787.0, "left": 441.0, "right": 901.0, "top": 374.0 }, "framedGroupType": 4, "name": "Color Fill 1" }   
          ]
          await app.batchPlay(command, {});
        }
        ////======

      async function dividirFrame(){
        try {
            core.executeAsModal(async () => {
                statusBorder();
                await app.batchPlay( [
                    {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_ref":[{"_enum":"path","_ref":"path","_value":"vectorMask"},{"_name":app.activeDocument.activeLayers[0].name,"_ref":"layer"}]},"vectorMaskParams":true,"version":1},
                    {"_obj":"delete","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}
                    ]);
                });
        } catch (err) {alert(err)}
      }

    } catch (err) {alertar("Selecione uma Camada!")}
}////// CARREGAR JALELA RENOMEAR CAMDA::::::::::::::::


//////////TROCAR IMAGEM FRAME
async function trocarImagem(){
    try {
        await core.executeAsModal(async (executionContext) => {
            ////// FUNÃO SUSPENDHISTORY DA FUNÇÃO INICIAL
            let hostControl = executionContext.hostControl; documentID = app.activeDocument.id; 
            suspensionID = await hostControl.suspendHistory({ "documentID": documentID,"name": "Trocar" });
            //////:::::::::::::::::::
            const activeLayers = app.activeDocument.activeLayers; 
            if(activeLayers.length !=4){alertar("OPERAÇÃO INVÁLIDA!<br>--------------------------<br>Selecione 2 camadas!"); return}
            const allpathFrames= [];
            const xactiveLayers = [];

            activeLayers.forEach(layer => xactiveLayers.push(layer.name))
            const suffixToRemove = " Frame";
            const camdasTarget = xactiveLayers.filter((layer) => !new RegExp(`${suffixToRemove}$`).test(layer));
      
            for (var i=0;i<camdasTarget.length ;i++){
                    myname=camdasTarget[i];
                    app.batchPlay( [{"_obj":"select","_target":[{"_name":myname,"_ref":"layer"}],"makeVisible":false}]);
                    result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'smartObject' }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }]}]);
                    diretorio = await result[0].smartObject.link._path;
                    allpathFrames.push(diretorio);
              };

            for (var i=0;i<camdasTarget.length ;i++){
                if( camdasTarget[i] === camdasTarget[0] ){  
                    folder = await fs.getEntryWithUrl(allpathFrames[1]);
                    token1 = fs.createSessionToken(folder);
                    img1_name =camdasTarget[i];
                }
                else{ 
                    folder = await fs.getEntryWithUrl(allpathFrames[0]);
                    token2 = fs.createSessionToken(folder);
                    img2_name =camdasTarget[i];
                };
                
                await app.batchPlay( [
                    {"_obj":"select","_target":[{"_name":`${camdasTarget[i]}`,"_ref":"layer"}],"layerID":[36],"makeVisible":false},
                    {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","name":`IMAGEM_${[i]}`}}
                ]);
            };
           
            await app.batchPlay( [  
                {"_obj":"select","_target":[{"_name":`${img2_name} Frame`,"_ref":"layer"}],"makeVisible":false},
                {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","opacity":{"_unit":"percentUnit","_value":20}}}
              ]);

            //////// SELECIONAS FRAMES DE NOMES [IMAGEM_0 E IMAGEM_1], LOCALISAR RESPECTIVO ARQUIVO E SUBSTITUE IMAGENS;
            await app.batchPlay( [
                    {"_obj":"select","_target":[{"_name":"IMAGEM_0","_ref":"layer"}],"makeVisible":false},
                    {"ID":45,"_obj":"placeEvent","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"linked":true,"null":{"_kind":"local","_path":token1},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":0.0},"vertical":{"_unit":"pixelsUnit","_value":0.0}},"replaceLayer":{"_obj":"placeEvent","from":{"_id":43,"_ref":"layer"},"to":{"_id":43,"_ref":"layer"}}},
                    {"descriptor": {"_obj":"transform","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"height":{"_unit":"percentUnit","_value":100},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":0},"vertical":{"_unit":"pixelsUnit","_value":0.0}},"replaceLayer":{"_obj":"transform","from":{"_id":15,"_ref":"layer"},"to":{"_id":15,"_ref":"layer"}},"width":{"_unit":"percentUnit","_value":101}}, "options": {"dialogOptions": "display"}},
                    {"_obj":"select","_target":[{"_name":"IMAGEM_1","_ref":"layer"}],"makeVisible":false},
                    {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","opacity":{"_unit":"percentUnit","_value":100}}},
                    {"ID":45,"_obj":"placeEvent","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"linked":true,"null":{"_kind":"local","_path":token2},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":0.0},"vertical":{"_unit":"pixelsUnit","_value":0.0}},"replaceLayer":{"_obj":"placeEvent","from":{"_id":43,"_ref":"layer"},"to":{"_id":43,"_ref":"layer"}}},
                    {"descriptor": {"_obj":"transform","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"height":{"_unit":"percentUnit","_value":100},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":0},"vertical":{"_unit":"pixelsUnit","_value":0.0}},"replaceLayer":{"_obj":"transform","from":{"_id":15,"_ref":"layer"},"to":{"_id":15,"_ref":"layer"}},"width":{"_unit":"percentUnit","_value":101}}, "options": {"dialogOptions": "display"}},
                    {"_obj":"select","_target":[{"_name": `${img2_name} Frame`,"_ref":"layer"}],"selectionModifier":{"_enum":"selectionModifierType","_value":"addToSelection"}}
                ]);

        },{"interactive": true});
   } catch (err) {alert(err) }
}

///////////// MESCLAR FRAMES
async function mesclarFrames(){
    await core.executeAsModal(async (executionContext) => {
        ////// FUNÃO SUSPENDHISTORY DA FUNÇÃO INICIAL
        let hostControl = executionContext.hostControl; documentID = app.activeDocument.id; 
        suspensionID = await hostControl.suspendHistory({ "documentID": documentID,"name": "Meclar" });
        ///////// OBTEM PROPRIEDADES DA BORDAS SE OS MESMOS CONSTAREM
        const res = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'AGMStrokeStyleInfo' }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false,});
        borderSize = res[0].AGMStrokeStyleInfo.strokeStyleLineWidth._value; 
        Alignment = res["0"].AGMStrokeStyleInfo.strokeStyleLineAlignment._value;
        red = res[0].AGMStrokeStyleInfo.strokeStyleContent.color.red;
        grain = res[0].AGMStrokeStyleInfo.strokeStyleContent.color.grain;
        blue = res[0].AGMStrokeStyleInfo.strokeStyleContent.color.blue;
        
        const command = [ 
            {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"framedGroupSection","_value":"targetEnum"}],"to":{"_obj":"shapeStyle","fillContents":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":255,"grain":255,"red":255}},"strokeStyle":{"_obj":"strokeStyle","fillEnabled":true,"strokeEnabled":true,"strokeStyleContent":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":255,"grain":255,"red":255}},"strokeStyleLineWidth":{"_unit":"pixelsUnit","_value":0.5},"strokeStyleVersion":0.5}}},
            {"_obj":"mergeLayersNew"},
        ]; 
        await app.batchPlay(command, {});
        const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'bounds' }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
        const left = result[0].bounds.left._value; 
        const right = result[0].bounds.right._value;
        const botn = result[0].bounds.bottom._value;
        const top = result[0].bounds.top._value;
        await app.batchPlay( [
            {"_obj":"delete","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"layerID":[5]},
            {"LockPPI":false,"PreferredResolution":300.0,"SavedIteratedName":"","_obj":"make","_target":[{"_ref":"framedGroupSection"}],"framedGroupRect":{"_obj":"classFloatRect","bottom": botn,"left":left,"right":right,"top":top},"framedGroupType":1,"layerSectionEnd":35,"layerSectionStart":34,"name":"Frame 1"}
        ]);
        ///////// ADICIONA BORDA OS MESMOS CONSTAREM
        if(borderSize==1)return;
        await app.batchPlay( [ {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"framedGroupSection","_value":"targetEnum"}],"to":{"_obj":"shapeStyle","fillContents":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":blue,"grain":grain,"red":red}},"strokeStyle":{"_obj":"strokeStyle","fillEnabled":true,"strokeEnabled":true, "strokeStyleLineAlignment":{"_enum":"strokeStyleLineAlignment","_value":Alignment},"strokeStyleContent":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":blue,"grain":grain,"red":red}},"strokeStyleLineWidth":{"_unit":"pixelsUnit","_value": borderSize},"strokeStyleVersion":2}}}]);
    });
};


 ////// CARREGAR JALNELA RENOMEAR CAMADA
 async function dlgRotateScala() {
    try {
        doc = app.activeDocument;  
        currentStatus = doc.activeHistoryState
        activeLayers = app.activeDocument.activeLayers; 

        if(activeLayers.length ==0){alert("Selecione as Camadas!");return}
        if(activeLayers.length <2){alert("Selecione mais de uma Camadas!");return}

        dlg = document.querySelector("#dlgRotateScalar");
        dlg.show({ title: `Transfotmation`, resize: "both", size: { width: 260, height:100}})
        dlg.innerHTML = `<style> .sr_main { width: 100%; display: flex; flex-direction: column; align-items: center; margin: auto; padding: 10px; border: 1px solid rgb(65, 65, 65); border-radius: 10px; background-color: #615f5f; } .sr_Container { width: 100%; display: flex; flex-direction: column; flex-wrap: wrap; align-items: center; border: 1px solid rgb(65, 65, 65); padding: 10px; } </style> <!-- //////// DIALOGO LAYOUT --> <div class="sr_main"> <div class="sr_Container"> <h1 style="color: #a19f9f;">Transformação em lote</h1> <div style="background-color: #4e4d4d; padding: 1px 10px 1px 10px; width: 100%;"> <sp-slider  id="sld_scalar" size="s" variant="filled" fill-offset="left" min="0" max="200" step="5" value="100"> <sp-label slot="label">Scalalonar</sp-label> </sp-slider> </div> <div style="background-color: #4e4d4d; padding: 1px 10px 1px 10px; width: 100%; "> <sp-slider id="sld_rotacionar" size="s" variant="filled" fill-offset="left" min="-180" max="180" step="5" value="0"> <sp-label slot="label">Rotacionar</sp-label> </sp-slider> </div> <sp-divider style="margin: 5px;"></sp-divider> <div style="width: 100%; display: flex; align-items: center; margin-top: 5px; border: 1px solid #474747; padding: 10px; justify-content: center; border-radius: 0 0 7px 7px; background-color: #4e4d4d;"> <div class="btnMedio" id="sr_btn1" style="width: 100px; margin: 5px;">Resetar</div> <div class="btnMedio" id="sr_btn2" style="width: 100px; margin: 5px;">Fechar</div></div></div>`;
        /////////:::::::::::::::::
        scalonar = document.querySelector("#sld_scalar");
        rotacionar =  document.querySelector("#sld_rotacionar");
   
        ///////// OUVINTES DE EVENTOS AQUI!
        scalonar.addEventListener("change",   ()  => {tranformationOBJ()});
        rotacionar.addEventListener("change", () => {tranformationOBJ()});

        document.querySelector("#sr_btn1").addEventListener("click", () => {
            core.executeAsModal(async () => {
                doc.activeHistoryState = doc.historyStates [doc.historyStates.length-2];
                scalonar.value=100;  rotacionar.value=0; //SelALLCamadas(false);;
            });
        }); 

        document.querySelector("#sr_btn2").addEventListener("click", () => {dlg.close('OK'); });
        ////////////:::::::::::::
    } catch (err) {alert(err)}
}

////////TRNSFORMAÇÃO CAMADAS EM LOTE
function tranformationOBJ(){
    try {
        core.executeAsModal(async (executionContext) => {
                ////// FUNÃO SUSPENDHISTORY DA FUNÇÃO INICIAL
                let hostControl = executionContext.hostControl; documentID = app.activeDocument.id; 
                suspensionID = await hostControl.suspendHistory({ "documentID": documentID,"name": "Rotacinar" });
                //////:::::::::::::::::::
                const scala = scalonar.value;
                const rotate = rotacionar.value;
               // activeLayers = app.activeDocument.activeLayers;
                activeLayers.forEach(layer => layer.selected = false, doc.activeHistoryState = currentStatus); 
                activeLayers.forEach(layer => {
                    layer.selected = true; 
                    layer.scale(Number(scala), Number(scala)); 
                    layer.rotate(Number(rotate));
                    layer.selected = false; 
                }) ;
                activeLayers.forEach(layer => layer.selected = true);
         });
    } catch (err) {alert(err) }
} ;

//////// LISTAR TODAS AS CAMDAS:  alert(app.activeDocument.layers);
//////// LISTAR TODAS AS CAMDAS SELECIONADAS:  alert(app.activeDocument.activeLayers; );

 ////// CARREGAR JALELA RENOMEIA AQUIVOS
 async function dlgRenamArquivos() {  
    try {
          diretorio = "";
          try {app.activeDocument.path; if(app.activeDocument.path==""){diretorio = null;}}
          catch (error)  {
            diretorio = null;
        }

        dlg = document.querySelector("#dlgRenArquivos");
        dlg.uxpShowModal({ title: `PS-fxrios: Batch File Rename`, resize: "none", size: { width: 400, height:400}})
        dlg.innerHTML = `<style> .RA-aimg-main { width: 100%; height: 305px; display: flex; flex-direction: column; align-items: center; margin: auto; padding: 10px; border: 1px solid rgb(65, 65, 65); border-radius: 10px; background-color: #615f5f; } .RA-aimg-Container { width: 100%; height: 233px; display: flex; flex-direction: column; flex-wrap: wrap; align-items: center; border: 1px solid rgb(65, 65, 65); padding: 10px; } .RATabelaNomes{ width: 100%; height: 202px; overflow: scroll; scrollbars: auto; border: 1px solid rgb(65, 65, 65); } table { border-collapse: collapse; } th, td { padding: 12px; text-align: left; color: rgb(192, 192, 192); width: 170px; font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: left; } th { background-color: #f2f2f2; color: #444; font-weight: bold; /* border-bottom: 2px solid rgb(12, 12, 12); */ font-size: 13px; font-family: Arial, sans-serif; height: 10px; } td { padding-left: 10px; } tr:nth-child(even) { background-color: #525151; color: #ddd; } @media only screen and (max-width: 600px) { table { font-size: 12px; } th, td { padding: 2px; text-align: center; } } tr.selected { background-color: #283841; color: rgb(255, 255, 255); } .iconDell{ font-family: UXPSfxIcon; color: #d8d8d8; font-size: 12px; margin-right: 5px; margin-left: 10px; width: 20px; border: 1px solid rgb(119, 118, 118); border-radius: 2px; } .iconDell:hover { color: #baf3b8; border: 1px solid #708d6f; } .iconDell:active { border: 1px solid rgb(51, 51, 51); background-color: #252525; } .nomesAling{ justify-content: center } .fonteSize{ font-size: 10.5px; height: 21px; line-height: 14px; }</style> <!-- //////// DIALOGO LAYOUT --><div class="RA-aimg-main"><!-- //////// PAINE PREFRECES --><div id="ConfigTabale" style="display: none; flex-direction: column;"><div style="width: 100%; display: flex; margin: 2px;transform: translateX(0px); margin-bottom: 5px;"> <h3 style="color: #252525; font-size: 15px; width: 100%; background-color: #d4d4d4; padding: 1px 5px 1px 5px; display: flex; justify-content: left; margin: 0px; border: 1px solid rgb(65, 65, 65); width: 300px;">Atual Nome</h3> <h3 style="color: #252525; font-size: 15px; width: 100%; background-color: #d4d4d4; padding: 1px 5px 1px 5px; display: flex; justify-content: left; margin: 0px; border: 1px solid rgb(65, 65, 65);"> Novo Nome</h3> </div> <div id="RATabelaNomes" class="RATabelaNomes"> <table id="tabela"> <thead> </thead> <tbody> </tbody> </table> </div> </div> <!-- //////// PAINE PREFRECES --> <div id="RAPrefrences" class="RA-aimg-Container"> <h2 style="color: #a19f9f; font-size: 25px;">Batch File Rename</h2> <sp-divider></sp-divider> <div style="width: 100%; height: 135px; display: flex; flex-direction: column; align-items: center;  border: 1px solid rgb(65, 65, 65); margin-top: 5px; padding: 5px;">  <div style="width: 100%; display: flex;  margin: 2px 10px; align-items: center; justify-content: center;"> <div style="width: 60%; display:  flex; align-items: center; justify-content: center; "> <label  style="color: #e4e2e2; font-size: 11px;  ">Entrada</label> <select id="listDiret" size="8" style="width:130%;  margin-left: 2px;  "> <option>Documento atual</option> <option>Diretório</option> </select> </div> <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; "> <div class="btnMedio fonteSize elem-Desabilitado" id="DADirBtn" style="width: 100px; ">Procurar</div> </div> </div> <label id="DATxtDir" style="color: #c2bebe; font-size: 11px; ">C://Diretotio..........</label> <sp-divider style=" transform: translateY(10px); "></sp-divider>  <div id="nomeConfig" style="width: 100%; display: flex; align-items: center; justify-content: left; transform: translate(12px,  20px); "> <label  style="color: #e4e2e2; font-size: 11px; ">Nones</label> <select id="listNome" size="8" style="width:70px; margin:2px; "> <option>Pag</option> <option>Foto</option> <option>Música</option> <option>Video</option> <option>Diretorio do aquivo</option> <option>-</option> <option>Outro</option> </select>  <input  type="text" disabled value="Outro nome"  id="etOnome"  style="width:90px; height: 25px; padding: 4px; margin:2px; transform: translateY(1px);  "> <label  style="color: #e4e2e2; font-size: 11px; margin: 2px;">Digitos</label> <select id="listDigitos" size="8" style="width:40px; margin:2px;  "> <option>1</option> <option selected>2</option> <option>3</option> <option>4</option> <option>5</option> <option>6</option> </select> </div>  <div id="reProcess" style="display: none; align-items: center; justify-content: center; transform: translateY(11px);"> <label style="font-family: UXPSfxIcon; color: #ace49e; font-size: 50px; transform: translateY(5px);" >r</label> <label style="color: #d6d6d6; font-size: 20px;" >Processando......</label> </div>  <sp-checkbox  id="RAck3" size="s" style="position: absolute; top:233px" ><label class="sp-checkbox-txt" >Usar escrita Maiúscula</label></sp-checkbox > </div> </div> <div style="width: 100%; display: flex; flex-direction: column; align-items: center; margin-top: 5px; border: 1px solid #474747; padding: 10px; justify-content: center; border-radius: 0 0 7px 7px; background-color: #4e4d4d;"> <div  id="botoesGrrupo" style="display: flex; width: 100%; justify-content: center"> <div class="btnMedio fonteSize" id="DAFecharBtn" style="width: 25%; margin: 1px;">Fechar</div> <div class="btnMedio fonteSize" id="DAPreviewBtn" style="width:25%; margin: 1px;">Preview</div> <div class="btnMedio fonteSize" id="DARenomBtn" style="width: 25%; margin: 1px;">Renomear</div> </div> <div id="btnRetGrupo" style="width: 100%; display: none; justify-content: center " > <div class="btnMedio fonteSize" id="DARetornarBtn" style="width: 30%; margin: 1px;  ">Retornar</div> <div class="btnMedio fonteSize" id="DAExplorarBtn" style="width: 30%; margin: 1px;  ">Explorar</div> </div> </div>`
            ///////// FUNÕES QUI! XXXXXXXXXXXXXXXXXXXXXXXXX
            origNomes = []; 
            originalNome=false;
            maiuscula =false;
            naoRenomear = [];

            document.querySelector("#listNome").selectedIndex =0;
            if(diretorio === null){ activeDocPathExiste()}
             else{
                    activeDocPath = app.activeDocument.path.replace(/\\[^\\]*$/, "").replace(/\\/g, "/");
                    diretorioDocs  = activeDocPath;
                    caminhoPasta(diretorioDocs); configDiretorio();
                    document.querySelector("#DADirBtn").classList.add("elem-Desabilitado");
            };

            /////////// VALIDAR  EVENTOS DA LISTA DIRETÓRIO
            document.querySelector("#listDiret").addEventListener("change", evt => {    
                   configDiretorio();
            });
    
            /////////// VALIDAR  EVENTOS DA LISTA DIRETÓRIO
            document.querySelector("#listNome").addEventListener("change", evt => {    
                    if(document.querySelector("#listNome").selectedIndex ==6){
                        document.querySelector("#etOnome").disabled=false
                        document.querySelector("#etOnome").focus(), 16 
                        }
                    else{ document.querySelector("#etOnome").disabled=true}
                    originaNomes();
            });

            /////////// SELECIONAR DIRETÓRIO
            document.querySelector("#DADirBtn").addEventListener("click", async () => {
                    directory = await fs.getFolder();
                    diretorioDocs = directory.nativePath.replace(/\\/g, "/");
                    caminhoPasta(diretorioDocs)
                    atualizaDados()
                    await renomeaAquivos(caminho, naoRenomear, novoNome, digitos, false );
                    await exploradorDiretorio(directory.nativePath); //// CONFIGURA SCRIPTS EXTERNOS PARA EXIBIR O DIRETÓRIO ATUAL
            });
            
            function caminhoPasta(caminho){
                try {
                    const truncatedPath = encurtaLegenda(caminho);
                    document.querySelector("#DATxtDir").textContent = truncatedPath
                } catch (e) {alert(e)}
            };

            function configDiretorio(){
                try {
                    const dirBTNStatus = document.querySelector("#listDiret").selectedIndex ==0; //CONDICIONAL
                    document.querySelector("#DADirBtn").classList.toggle("elem-Desabilitado", dirBTNStatus );
                    if(document.querySelector("#listDiret").selectedIndex ==1){
                    document.querySelector("#DATxtDir").textContent = "C://Diretotio.........."
                    } else{caminhoPasta(activeDocPath)}
                } catch (error) { activeDocPathExiste()}
                }

                function activeDocPathExiste(){
                    document.querySelector("#listDiret").innerHTML="";
                    const newOption = document.createElement("option");
                    newOption.textContent = "Diretório";
                    document.querySelector("#listDiret").appendChild(newOption);
                    document.querySelector("#DADirBtn").classList.remove("elem-Desabilitado");
                    document.querySelector("#DATxtDir").textContent = "C://Diretotio..........";
                    document.querySelector("#listDiret").disabled=true
                }
                
                //////OBTEM NOMES E NOVOS NOMES
                try {
                    atualizaDados()
                    await renomeaAquivos(caminho, naoRenomear, novoNome, digitos, false );
                    await exploradorDiretorio(caminho.replace(/\//g, "\\"))//// CONFIGURA SCRIPTS EXTERNOS PARA EXIBIR O DIRETÓRIO ATUAL
                } catch (error) {}

                function atualizaDados(){
                    caminho = diretorioDocs;
                    pastas = caminho.split("/");
                    ultimaPasta = pastas[pastas.length - 1];
                    if(document.querySelector("#listNome").selectedIndex ==4){ novoNome = ultimaPasta}
                    else if(document.querySelector("#listNome").selectedIndex ==6){ novoNome = document.querySelector("#etOnome").value}
                    else{ novoNome =  document.querySelector("#listNome").value}
                    digitos= document.querySelector("#listDigitos").value
                }
                
                function  configsBotesProcess(a,b,c,d){
                    document.querySelector("#RAPrefrences").style.display = a;
                    document.querySelector("#ConfigTabale").style.display =  b;
                    document.querySelector("#botoesGrrupo").style.display = c;
                    document.querySelector("#btnRetGrupo").style.display = d;
                };

            document.querySelector("#RAck3").addEventListener("click",  () => {
                if( document.querySelector("#RAck3").checked==true){maiuscula =true}
                else{ maiuscula =false}
            })
            
                ///////// BOTÃO PARA ENTRAR NA JANETA PREVIEW
                document.querySelector("#DAPreviewBtn").addEventListener("click", async () => {
                    naoRenomear = []
                await exibirTabelaNomes()
                });

            async function exibirTabelaNomes(){
                if(document.querySelector("#DATxtDir").textContent === "C://Diretotio.........."){ alertar("Selecione um Diretório!"); return}
                    configsBotesProcess("none", "flex", "none", "flex");
                    atualizaDados();
                    await renomeaAquivos(caminho, naoRenomear, novoNome, digitos, false, maiuscula );
                    await preencherTabela();
                };

                ///////// BOTÃO PARA SAIR DA JANELA PREVIEW
                document.querySelector("#DARetornarBtn").addEventListener("click", async () => {
                    retornarTelaConfig();
                });

                function retornarTelaConfig(){
                originalNome= false;
                configsBotesProcess("flex", "none", "flex", "none");
                document.querySelector("#nomeConfig").style.display = "flex";
                document.querySelector("#reProcess").style.display = "none";
                }

                ///////// BOTÃO ABRIR A JANELA DO DIRETÓRIO ATUA
                document.querySelector("#DAExplorarBtn").addEventListener("click", async () => {
                    try {
                    // EXECUTARE O SCRIPT VBS SCRIPTS EXTERNO PARA EXIBIR O DIRETÓRIO ATUAL
                    shell.openPath(`${dirPlugin}/suport/CloseExplorer.vbs`)
                    shell.openPath(`${Usuario}/AppData/Roaming/tempScripts/explorarDir.vbs`)
                } catch (e) {alert(e) }
                });
                
                ///////// BOTÃO PROCESSAR A NOMENCLATURA
            document.querySelector("#DARenomBtn").addEventListener("click", async () => {
                    try {
                        /////OBTER OS NOMES ORIGINAS ANTES DOS MESMOS SEREM ALETRADOS
                        originalNome=true; //// PERMITE QUE A TABELALA ATUALIZE SOMENTE O NOVO NOME AO RENOMEAR.
                        if(document.querySelector("#DATxtDir").textContent === "C://Diretotio.........."){ alertar("Selecione um Diretório!"); return};
                        document.querySelector("#nomeConfig").style.display = "none";
                        document.querySelector("#reProcess").style.display = "flex";
                        atualizaDados();
                        function evento() { setTimeout(async() =>
                            await  funcRemonear(), 
                            );} setTimeout(evento, 1000);
                    } catch (e) {alert(e) }
                });

                /////// BOTÃO PARA SAIR DA JANELA MODAL
                document.querySelector("#DAFecharBtn").addEventListener("click", async () => {
                document.querySelector("#dlgRenArquivos").close('OK')
                })

                async function funcRemonear(){
                    await exibirTabelaNomes();
                    await renomeaAquivos(caminho, naoRenomear, novoNome, digitos, true, maiuscula );
                }

                ///// FUNÇÃO PARA PREENCHER A TABELA COM ESSES DADOS
                function preencherTabela() {
                    try {
                    statusConfig=""
                    const tabela = document.querySelector('#tabela tbody');
                    tabela.innerHTML = "" ;
                    tabelaNomes.forEach( (nomeItens, indice) => {   
                        const linha = document.createElement('tr');
                        const colunaNome = document.createElement('td');   
                        const colunaNovoNome = document.createElement('td');
                        colunaNovoNome.classList.add("nomesAling");
                            //////CRIANDO O BOTÃO DELETE
                        const removerBtn = document.createElement('div');
                        removerBtn.textContent = 'M';
                        removerBtn.classList.add("iconDell");
                        removerBtn.addEventListener('click', async function() {
                            rename = false;
                            naoRenomear.push(nomeItens.nome)
                            await renomeaAquivos(caminho, naoRenomear, novoNome, digitos, false, maiuscula );
                            await exibirTabelaNomes();
                            if(tabelaNomes.length===0){retornarTelaConfig();}
                        });
                        // Adicionando o botão à colunaNome
                        colunaNome.appendChild(removerBtn);
                        ////// ATUALIZA A TABELA CONFORME SOLICITAÇÃO DEFINIDA PELA CONDICIONAL "ORIGINALNOME"
                        if(originalNome==true) { 
                            colunaNome.textContent = nomeItens.nome; statusConfig=" ✅";
                            colunaNovoNome.classList.add("nomesAling");
                            colunaNome.classList.add("nomesAling");
                        } /// NOMES ORIGIANAIS     
                        else{ colunaNome.appendChild(document.createTextNode(nomeItens.nome));} /// APENAS PREVIEW
                        colunaNovoNome.textContent = `${statusConfig} ${nomeItens.novoNome}`;
                        linha.appendChild(colunaNome);
                        linha.appendChild(colunaNovoNome);
                        tabela.appendChild(linha);
                    });
                    } catch (err) { alert(err)}
                }
         } catch (e) {alert(e)}
 };

 async function desabilitaMask(){
        await core.executeAsModal(async () => {
            const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'userMaskEnabled' }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
            const toggleBordasADD = result[0].userMaskEnabled
        
            if (toggleBordasADD) {
                await app.batchPlay([ {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","userMaskEnabled":false}}]);
            } else {
                await app.batchPlay([{"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","userMaskEnabled":true}}]);
            }
        })
 };

 async function illustratorEditar(explorarDir){
    try {
        await criarPasta(`${Usuario}/AppData/Roaming/`,  "tempScripts");
           const tempFolder = await fs.getEntryWithUrl(`${Usuario}/AppData/Roaming/tempScripts`);  
           const fileBat = await tempFolder.createFile("illustratorEdit.bat", { overwrite: true });
           fileBat.write(`@echo off\nchcp 65001\nset image_path=${explorarDir}\nset illustrator_path="C:\\Program Files\\Adobe\\Adobe Illustrator 2023\\Support Files\\Contents\\Windows\\Illustrator.exe"\nstart "" %illustrator_path% "%image_path%"`);
      } catch (err) {alert(err) };
 }


