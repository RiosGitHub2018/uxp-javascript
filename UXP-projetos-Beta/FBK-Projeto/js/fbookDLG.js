///FUNCTION OPENMODAL INCIAR
async function openModal() {
        resol = app.activeDocument.resolution;
        gethDOC = app.activeDocument.height;
        getwDOC = app.activeDocument.width
        PositionLogo = false;

        janCarregando(); //return;
        function evento() { setTimeout(() =>CapasConfigP1());}
        setTimeout(evento, 10);//Chama a função do evento após 2 segundos

        document.querySelector("#qpages").focus(), 16
} /// FUNCTION_OPEN_MODAL_FINAL
//////:::::::::::::::::::

/////CONFIGS PARTE 1 AQUI
async function CapasConfigP1() {
    try {
        await core.executeAsModal(async (executionContext) => {
              ////// FUNÃO SUSPENDHISTORY DA FUNÇÃO INICIAL
            let hostControl = executionContext.hostControl; documentID = app.activeDocument.id; 
            suspensionID = await hostControl.suspendHistory({ "documentID": documentID,"name": "P1Confg" });
            //////:::::::::::::::::::
            path = app.activeDocument.path.replace(/\\[^\\]*$/, "").replace(/\\/g, "/");// app.activeDocument.path.replace(/\\[^\\]*$/, ""); 
            pluginFolder = await fs.getPluginFolder(); 
   
            /////VBS PARA DELETAR A PASTA C:/TEMP
            VBSdellCtemp = await pluginFolder.getEntry("suport/{978-dellC-Temp}.vbs"); 
            await shell.openPath(VBSdellCtemp.nativePath);
            ////////::::::::::
                
             ////// ADD PROCEESO INICIAL SE A CAMADA ATIVA FOE "BACGROUND;
            if(app.activeDocument.layers[0].name=="Background"){ 
                ///// OBTEM A LUMINOSIDADE DO DOCUMENTO
                await GetLuminosidade();
                //////:::::::::::::::::::::
              //  await janCarregando();
                await refeshDocumento();
                await BGconvertoCMD("Capa_Config");
                listPapelOP2AddImage =false;
                
                paginas = localStorage.getItem("pagQuantSave")  || 30;
                larguraPg = paginas*2*0.05; 
                larguraDoc = 3030;  alturaDoc= 2100; 
                capaDefault=true;
                await app.batchPlay([{"_obj":"imageSize","constrainProportions":true,"height":{"_unit":"pixelsUnit","_value": alturaDoc},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"resolution":{"_unit":"densityUnit","_value":254},"scaleStyles":true}], {});
               // await core.executeAsModal(async () => {await ZoomDOC(0); await ZoomDOC(1)})  
                await addLogoLoja();
                await app.activeDocument.layers[0].rotate(90);
                await alinarCapaSize();
                /////////OBTEM NOME ORIGINAL DOS ARQUIVOS
                await ObterNomesDocs();
                NomesOBJ_A =  fileNomes;
                //////////::::::::::
            }
            else{ listPapelOP2AddImage = true; paginas = qpages.value; larguraPg = paginas*2*0.05; };
            ////// CONTINU DAQUI O PROCEESO::::: 
            await app.activeDocument.resizeCanvas( larguraDoc + larguraPg/2.54*resol, alturaDoc);
            ////// NÃO RESETAR A POSIÇÃO DO LOGO SE O MESMO FOR DESLOCADO
            if(PositionLogo == true){await selectCamada("Capa_Config");}
            else{ await selectCamada("Icon_Dorso"); await alinarCapaSize(); }
           /////// ALINHA CAPA SIZE
           async function alinarCapaSize(){
                await ADDselecaoDOC();
                await alignCamada(1, false);
                await alignCamada(4, true);
                await app.activeDocument.layers[0].translate(0, -150);
                await selectCamada("Capa_Config");
            }
            /////////////////
            await GuideLayout();
            await enquadraBordasV();
            await janCapasconfigs();
            await document.querySelector('#process1DLG').close('OK');

            const wsDOC = app.activeDocument.width*2.54/resol;    
            const hsDOC  = app.activeDocument.height*2.54/resol; 
            processar = true;
                  
            try {
                const lnfCcapa = document.querySelector('#statusonfig')
                lnfCcapa.innerHTML= `Capa_${parseFloat(hsDOC.toFixed(1))} x ${parseFloat(wsDOC.toFixed(1))} cm • Dorso: ${ parseFloat(larguraPg.toFixed(1))} cm`;
                ///// VERIFICA E RETORNA FALSO SE A QT  DE PÁGINAS NÃO FOR PERMITIDO.
                if(qpages.value <9 || qpages.value>35){processar=false}else{processar= true}
                document.querySelector("#alerta").style.display = "none"; 
                setTimeout(() => document.querySelector("#qpages").focus(), 16);
            } catch (err) {}
            ////// 
            await core.executeAsModal(async () => {await ZoomDOC(0); /*await ZoomDOC(1)*/})  
        },{"interactive": true});
    } catch (err) {}
}
//////:::::::::::::::::::
//////////////////////////////////////////////////////////////////////////////
/////////////////////////////// PARTE 2 CONFUGURAÇÕES///////////////
/////CONFIGS PARTE 2 AQUI
async function CapasConfigP2() {
    try {
        gethDOC = app.activeDocument.height;
        getwDOC = app.activeDocument.width
        /////// CAPASCONFIGP2 FUNCTION INÍCIO XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        await core.executeAsModal(async (executionContext) => {
            ////// FUNÃO SUSPENDHISTORY DA FUNÇÃO INICIAL
            let hostControl = executionContext.hostControl; documentID = app.activeDocument.id; 
            suspensionID = await hostControl.suspendHistory({ "documentID": documentID,"name": "P2Confg" });
            //////:::::::::::::::::::
            await modoDeTela(1);
            await renomearNomes();
            ///// SALVAR QUANT DE PÁGINAS NO LS
            localStorage.setItem("pagQuantSave", qpages.value);
            //////// CALCULAR PORCETAGEM APOS PRENSAR O DORSO
            somaPages = larguraPg;// 2.4;
            percentagem = 16.67; /////encolhimento
            decimal = percentagem / 100;
            dorso = somaPages - (somaPages * decimal);
            //////////////////////////////////////////////////////
            //////:::::::::::::::
            if(ck4_ckecked == true){ await vincadoTarget(dorso);  await vincadoTarget(3.6+dorso); };
            ///////////////
            await ADDselecaoDOC();
            await app.batchPlay([{"_obj":"clearAllGuides"}, {"_obj":"flattenImage"},{"_obj":"duplicate","_target":[{"_property":"selection","_ref":"channel"}]}], {});
            await app.batchPlay([{"_obj":"make","at":{"_enum":"channel","_ref":"channel","_value":"mask"},"new":{"_class":"channel"},"using":{"_enum":"userMaskEnabled","_value":"revealSelection"}}, {"_obj":"flattenImage"}], {});
            ////////XXXXXXXXXXXXXXXXX
            ////// REDIMENSIONA LARGURA E ALTURA COM BASE NAS OPÇÕES  DA LISTA PAPEL
            if(PesetLista.selectedIndex == 0){wDOCfinal= 3500; }
            if(PesetLista.selectedIndex == 1){wDOCfinal= 3500;}
            if(PesetLista.selectedIndex == 2){wDOCfinal= 4350+160;}
            if(PesetLista.selectedIndex == 3){wDOCfinal= 6350+160;}
            if(PesetLista.selectedIndex == 4){wDOCfinal= 5350+160;}
            if(PesetLista.selectedIndex == 5){wDOCfinal= 6350+160;}

            if(PapeUser =="P20"){ wDOC = wDOCfinal; hDOC = 2030 }
            if(PapeUser =="P25"){ wDOC = wDOCfinal; hDOC = 2540 }    
            if(PapeUser =="P30"){ wDOC = wDOCfinal; hDOC = 3040 }  
            await app.batchPlay([ {"_obj":"canvasSize","height":{"_unit":"pixelsUnit","_value": hDOC },"horizontal":{"_enum":"horizontalLocation","_value":"left"},"vertical":{"_enum":"verticalLocation","_value":"top"},"width":{"_unit":"pixelsUnit","_value":wDOC}}], {});
            await core.executeAsModal(async () => {await ZoomDOC(0); /*await ZoomDOC(1)*/})  
            ////////XXXXXXXXXXXXXXXXX
            ///////ADICIONA O PONTILHAR HRIZONTAL
            const posB1= 596.4094488188977;
            const posE1= 0.5669291338582677;
            const posD1= 1019.9055118110236;
            const posT1= 595.5590551181102;
            await ADDselecaoShapes(posB1, posE1, posD1, posT1, "Pontilhado", 0);
            await solidColorCamada(83,83,83);
            await app.batchPlay([{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}, {"_obj":"select","_target":[{"_property":"workPath","_ref":"path"}]}, {"_obj":"delete","_target":[{"_property":"workPath","_ref":"path"}]}], {});
            ////////XXXXXXXXXXXXXXXXX
            await app.activeDocument.layers[0].duplicate();
            await app.activeDocument.layers[0].translate(0, 62); 
             ///////ADICIONA O PONTILHAR VERTICAL
            if(PapeUser !=="P20"){await app.activeDocument.layers[0].duplicate();}
            await app.activeDocument.layers[0].rotate(-90); 
            await app.batchPlay([{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_name":"Alpha 1","_ref":"channel"}}], {});
            await alignCamada(1,false); await alignCamada(3,true);
            await app.activeDocument.layers[0].translate(3, 62); 
           
             ///////REMOVE O PONTILHADO HORIONTAL SE A ALTURAO DO DOC FOR MAIOR QUE 2100 PX
            if(gethDOC >2100){ await removeCamada("Color Fill 1 copy"); await removeCamada("Color Fill 1");};
            await app.batchPlay([{"_obj":"flattenImage"}], {});
            ////////XXXXXXXXXXXXXXXXX
            //////AAD LEGENDA CAPA :::::::::::::::::::::::
            const posB2= 133; const posE2= 0; const posD2= 306; const posT2= 0;
            await ADDselecaoShapes(posB2, posE2, posD2, posT2, "Icon_Fotobook", 1);
            await solidColorCamada(0,0,0);
            await app.batchPlay([{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}, {"_obj":"select","_target":[{"_property":"workPath","_ref":"path"}]}, {"_obj":"delete","_target":[{"_property":"workPath","_ref":"path"}]}], {});
            
            await dadosLegenda();
            legenda = `Entrada: ${data} / Capa para ${paginas} Páginas • ${LogoCapa} • Loja: ${Loja} •  Cliente: ${cliente}`;
            xPosition= 140; yPosition = 92;
            await app.activeDocument.createTextLayer({ name: "myTextLayer", contents: legenda, fontSize: 28, position: {x: xPosition, y: yPosition}, fontName: "Arial"});
            await app.batchPlay([ {"_obj":"mergeLayersNew"}], {});

            const wsDOC = app.activeDocument.width*2.54/resol;    
            const hsDOC  = app.activeDocument.height*2.54/resol; 
            newFileName = `Capa_${parseFloat(hsDOC.toFixed(1))}x${parseFloat(wsDOC.toFixed(1))}cm`;
            
            ////////XXXXXXXXXXXXXXXXX
            //////ROTACIONA A LEGENDA -90 GRAUS :::::::::::::::::::::::
            await app.activeDocument.layers[0].rotate(-90); 
            await carregarSelecao();
            await alignCamada(1, false);  await alignCamada(3, true);
            await app.activeDocument.layers[0].translate(148, -35); 
            await app.batchPlay([ {"_obj":"mergeLayersNew"}], {});
            //////XXXXXXXXXXXXXXXXX
            //////AAD SHAPE CARTÃO N ENCONTRADO ::::::::::::::
            if(ck1_ckecked==true){
                await ADDselecaoShapes( 853.2283464566929, 5.3858267716535435, 896.8818897637796, 620.503937007874, "CartTemplats", 0);
                await solidColorCamada(210,210,210);
                await app.batchPlay([{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}, {"_obj":"select","_target":[{"_property":"workPath","_ref":"path"}]}, {"_obj":"delete","_target":[{"_property":"workPath","_ref":"path"}]}], {});
                await app.batchPlay([{"_obj":"flattenImage"}], {});
                 //////XXXXXXXXXXXXXXXXX
                //////AAD CARTÃO ARQUIVO :::::::::::::::::::::::
                await inserirCartao();
                if(app.activeDocument.layers[0].name !=="Background"){
                    await resizeCartao(8, 5);
                    await app.activeDocument.layers[0].rotate(-90); 
                    await app.batchPlay([{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}], {});
                    await carregarSelecao();
                    await alignCamada(1, false);  await alignCamada(2, true);
                    await app.activeDocument.layers[0].translate(27, 899);
                    for (var i=0;i<5;i++){await app.activeDocument.layers[0].duplicate();  await app.activeDocument.layers[0].translate(526, 0);}
                    await app.batchPlay([{"_obj":"flattenImage"}], {});
                }
            }
            await  backupCapa();
            await ObterNomesDocs();
            NomesOBJ_B = fileNomes;
            await TabelaNomesExe();
            try { await salvarDocumto(newFileName);} catch (err) {}
            if(ck4_ckecked == true){ await  mcvincarPG01();} ;
            await janTabelaNomes();

        },{"interactive": true}); 
         /////// CAPASCONFIGP2 FUNCTION FINAL XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    } catch (err) {alert(err)}
}
//////:::::::::::::::::::

////////FUNÇÕES LOCAIS AQUI! //////////

////// OBTER LUMINOSIDADE
async function GetLuminosidade(){
   await luminVincado(); await luminLogo();
   console.log(` Luminosidade do vinco: ${luminosidade}\n Luminosidade do Logo: ${luminosidadeL}`);  
}
async function luminVincado(){
    await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":60},"left":{"_unit":"pixelsUnit","_value":getwDOC/2-50},"right":{"_unit":"pixelsUnit","_value":getwDOC/2+50},"top":{"_unit":"pixelsUnit","_value":0.0}}}], { synchronousExecution: false, });
    const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'histogram' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
    lumin =  result[0].histogram;
    luminosidade =  lumin.indexOf(Math.max(...lumin));
    await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}], { synchronousExecution: false, });
}
async function luminLogo(){
    await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":gethDOC-115},"left":{"_unit":"pixelsUnit","_value":getwDOC/2-50},"right":{"_unit":"pixelsUnit","_value":getwDOC/2+50},"top":{"_unit":"pixelsUnit","_value":gethDOC-450}}}], { synchronousExecution: false, });
    const resultL = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'histogram' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
    luminL =  resultL[0].histogram;
    luminosidadeL=  luminL.indexOf(Math.max(...luminL));
    await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}], { synchronousExecution: false, });
}
//////////////////////////////
///////:::::::::::::::::::::::::

///// INSER CARTÃO
async function inserirCartao(){
    try {
        const token = localStorage.getItem("persistentFolder");
        thePersistentFolder = await fs.getEntryForPersistentToken(token);
        const cartao = fs.createSessionToken(thePersistentFolder); 
        await app.batchPlay([{"_obj":"placeEvent","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"linked":true,"null":{"_kind":"local","_path": cartao},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":0.0},"vertical":{"_unit":"pixelsUnit","_value":0.0}},"replaceLayer":{"_obj":"placeEvent","from":{"_id":4,"_ref":"layer"},"to":{"_id":10,"_ref":"layer"}}}], {});
        }
     catch (err) {}
}

///// REDIMENSIONAR CARTÃO
async function resizeCartao(vl,va) {
    const valorL = vl; valorA = va 
    const camada = app.activeDocument.layers[0]
    const largura = Number(valorL/2.54*resol);  
    const Altura = Number(valorA/2.54*resol); 
    const width =camada.bounds.width;  height =camada.bounds.height;
    const newWidth = largura*1*100/width;  newHeight = Altura*1*100/height;
    await camada.scale( newWidth, newHeight)
}

///// FUNC ADD LOGO LOJA DORSO
async function addLogoLoja(){
    pluginFolder = await fs.getPluginFolder(); 
    localLogo = await pluginFolder.getEntry("icons/Icon_Dorso.svg"); 
    const token = fs.createSessionToken(localLogo);
    await app.batchPlay( [{"_obj":"placeEvent","antiAlias":true,"freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"linked":true,"null":{"_kind":"local","_path":token},"offset":{"_obj":"offset","horizontal":{"_unit":"distanceUnit","_value":0.0},"vertical":{"_unit":"distanceUnit","_value":0.0}}}], { synchronousExecution: false, });
    if(luminosidadeL<128){
        await app.batchPlay([{"_obj":"invert"},{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}, {"_obj":"newPlacedLayer"}], {});
   }
}

///// FUNC ADD GUIAS SANGRIAS
async function GuideLayout() {
    if(luminosidade<170){R=255,G=255,B=255}else{R=53,G=82,B=147};
    const command = [
        {"_obj":"clearAllGuides"},{"_obj":"reset","_target":[{"_property":"colors","_ref":"color"}]},
        {"_obj":"newGuideLayout","guideLayout":{"$GdCA":0,"$GdCB":B,"$GdCG":G,"$GdCR":R,"_obj":"guideLayout","colCount":2,"colGutter":{"_unit":"pixelsUnit","_value": larguraPg/2.54*resol},"marginBottom":{"_unit":"pixelsUnit","_value":36.0},"marginLeft":{"_unit":"pixelsUnit","_value":36.0},"marginRight":{"_unit":"pixelsUnit","_value":36.0},"marginTop":{"_unit":"pixelsUnit","_value":36.0}},"guideTarget":{"_enum":"guideTarget","_value":"guideTargetCanvas"},"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}}
    ];
    await app.batchPlay(command, {});
}

///// FUNC REDIMENSIONA CAMADA NAS BORDAS VERTICAIS
async  function enquadraBordasV(){
    try {
        const docWidth =   await app.activeDocument.width
        const bounds = app.activeDocument.activeLayers[0].bounds;                
        const w = bounds.right-bounds.left;        
         f1 = ((docWidth/w)*100);  
        await app.activeDocument.layers[0].scale(f1, f1);
    } catch (err) {alert(err); console.log(err) }
}

////// CARREGAR JALELA PRINCIPAL
async function janCapasconfigs() {
    await document.querySelector('#process1DLG').close('OK');
    fetch('pags/fbookDLG.html').then(response => response.text()).then(data => {
    const dlg = document.querySelector("#dlgFotobook");
    dlg.show({ title: "PS-fxrios: FotoBook Configurator", resize: "both", size: { width: 370, height:380}})
    dlg.innerHTML = data;
        ////// TODOS OS addEventListener AQUI!
           CapasConfigP1(); ouvitesEventsFucs();
        ////===
    });
}

////// CARREGAR JALELA PROGESS
async function janCarregando() {
    fetch('pags/carregaDLG.html').then(response => response.text()).then(data => {
        const dlg = document.querySelector("#process1DLG");
        dlg.show({ title: "Processing", titleVisibility:"hide", resize: "both", size: { width: 230, height: 50} })
        dlg.innerHTML = data;
    });
}

////// CARREGAR CARTÃO
async function cartaoFolder(){
        core.executeAsModal(async () => {
           const directory = await fs.getFileForOpening(); 
           const persistentToken = await fs.createPersistentToken(directory);   
           localStorage.setItem("persistentFolder", persistentToken);
           //////////////////////
           const caminho = directory.nativePath.replace(/\\/g, "/");  
           localStorage.setItem("localCartao", caminho);
           const originalPath = localStorage.getItem("localCartao");
           const truncatedPath = encurtaLegenda(originalPath);
           document.getElementById("caminho").innerHTML= truncatedPath;
           ////////
        })
};

//////ENCURTAR A LEGENDA
function encurtaLegenda(path) {
    const dirs = path.split("/");
    if (dirs.length > 3) { dirs.splice(2, dirs.length - 4, "..");}; return dirs.join("/");
}

async function dadosLegenda(){
    resol=app.activeDocument.resolution;
     //path = path; //app.activeDocument.path.replace(/\\[^\\]*$/, "").replace(/\\/g, "/");
    var pastas =  path.split("/");
    data = pastas[2];
    const dataRegex = /^\d{2}.\d{2}.\d{4}$/; // Expressão regular para verificar se é uma data no formato "aaaa-mm-dd"
    const dirName = data; // Nome do diretório que será verificado
    if (dataRegex.test(dirName)) {
        digShop = "SHOP" || "SHOPP" ;
        if ( path.includes(digShop)) {Loja="Shop"; cliente=pastas[4];} else {Loja="Centro"; cliente=pastas[3]}
    }
    else{
        data = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`;
        Loja="Centro";  cliente =  path.split('/').pop();
    }
    if(ck2_ckecked == true){LogoCapa = "Logo Inserido" } else{LogoCapa = "Sem Logo" };
    paginas = Number(qpages.value)*2;
}

/////// IMPORTAR OS ARQUIVO 
async function substituirLogo(logo) {
    core.executeAsModal(async () => {
        selectCamada("Icon_Dorso");
        const { left, top, right, bottom } = app.activeDocument.layers[0].bounds;
        pluginFolder = await fs.getPluginFolder(); 
        if(logo ==true){ Entrada = await pluginFolder.getEntry("icons/Icon_Dorso.svg"); }
        else if(logo == null){ Entrada =  await fs.getFileForOpening();};
        const token = fs.createSessionToken(Entrada);
        await app.batchPlay( [{"_obj":"placedLayerReplaceContents","null":{"_kind":"local","_path": token }}], { synchronousExecution: false, });
        const camada = app.activeDocument.layers[0];
        const largura = `${right-left}`
        const width = camada.bounds.width;
        const newSize = largura * 1 * 100 / width;
        await camada.scale(newSize, newSize);
        camada.name="Icon_Dorso";
    },{"interactive": true});
}

/////// ADD COR AO LOGOTIPO DORSO
function colorLogoADD(cor){
    core.executeAsModal(async () => {
        await app.batchPlay([{"_obj":"select","_target":[{"_name":"Icon_Dorso","_ref":"layer"}]}], {});
        if(cor==true){
            const result = await app.batchPlay([{ _target: { _ref: "application" }, _obj: "showColorPicker", context: "Adicionar outra cor ao Logo", color: { _obj: 'RGBColor', red: 0, green: 0, blue: 0, }, }],{ });
            const color = result[0].RGBFloatColor ?? null;
                defaultColor = color.blue+color.grain+color.red;
            if(defaultColor==0){} else{await app.batchPlay([{"_obj":"set","_target":[{"_property":"layerEffects","_ref":"property"},{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layerEffects","scale":{"_unit":"percentUnit","_value":0},"solidFill":{"_obj":"solidFill","color":{"_obj":"RGBColor","blue":color.blue,"grain":color.grain,"red":color.red},"enabled":true,"mode":{"_enum":"blendMode","_value":"normal"},"opacity":{"_unit":"percentUnit","_value":100.0},"present":true,"showInDialog":true}}}], {}); icone3.style.display = "none"; icone4.style.display = "block"; };
            }
        else{ await app.batchPlay([{"_obj":"disableLayerFX","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}], {});}
        await app.batchPlay([{"_obj":"select","_target":[{"_name":"Capa_Config","_ref":"layer"}]}], {});
    })
}

///////APROCIMAR LOGOTIPO DORSO
function zoomLogoADD(zoom){
    core.executeAsModal(async () => {
        await app.batchPlay([{"_obj":"select","_target":[{"_name":"Icon_Dorso","_ref":"layer"}]}], {});
        if(zoom==true){ await app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"fitLayersOnScreen"}]},{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"zoomOut"}]}], {});}
        else{
             await app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"fitOnScreen"}]}], {});
             await app.batchPlay([{"_obj":"select","_target":[{"_name":"Capa_Config","_ref":"layer"}]}], {});
            };
       });
 }

 /////// MARCAR DE VINCO LAMIN 1
async function vincadoTarget(valores){
    await core.executeAsModal( async() => {
          const valor = valores;
          const resol = app.activeDocument.resolution;
          const dorsox = valor/2.54*resol/2;
          const wsDOC = app.activeDocument.width/2;
          const hsDOC  = app.activeDocument.height;
          await app.batchPlay( [{"_obj":"make","_target":[{"_ref":"layer"}],"layerID":2}, {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":hsDOC},"left":{"_unit":"pixelsUnit","_value":wsDOC-dorsox},"right":{"_unit":"pixelsUnit","_value":wsDOC+dorsox},"top":{"_unit":"pixelsUnit","_value":0.0}}}], { synchronousExecution: false, });
          if(luminosidade<128){ await app.batchPlay( [{"_obj":"stroke","color":{"_obj":"HSBColorClass","brightness":100,"hue":{"_unit":"angleUnit","_value":0.0},"saturation":0},"location":{"_enum":"strokeLength","_value":"inside"},"mode":{"_enum":"blendMode","_value":"normal"},"opacity":{"_unit":"percentUnit","_value":100.0},"width":2},{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}], { synchronousExecution: false, }); }
          else{ await app.batchPlay( [{"_obj":"stroke","color":{"_obj":"HSBColorClass","brightness":0.0,"hue":{"_unit":"angleUnit","_value":0.0},"saturation":100.0},"location":{"_enum":"strokeLength","_value":"inside"},"mode":{"_enum":"blendMode","_value":"normal"},"opacity":{"_unit":"percentUnit","_value":100.0},"width":2},{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}], { synchronousExecution: false, }); }
          await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}},{"_obj":"contract","by":{"_unit":"pixelsUnit","_value":30},"selectionModifyEffectAtCanvasBounds":true},{"_obj":"delete"},{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}], { synchronousExecution: false, });
      })
}
///////////::::::::::::::::

///////OBTEM A LISTA DE TODOSO OS AQUIVOS DA PASTA
async function ObterNomesDocs(){
    try {
        laminas =[]
        folder = await fs.getEntryWithUrl(path);  
        files = await folder.getEntries();
        for (const file of files) {	laminas.push(file.name) } 
        ondenar = laminas ;
        ondenar.sort((a, b) => a.toString().localeCompare(b.toString(), undefined, { numeric: true }));
        itensParaRemover =  ["01 capa.jpg","capa.jpg", "01 Capa.jpg", "Capa.jpg", "CAPA.jpg", "cover.jpg", "COVER.jpg", "nfz", "nfz_Original"]; 
        fileNomes = ondenar.filter(function(item) {return !itensParaRemover.includes(item);});
     } catch (err) {alert(err) }
}
//////////::::::::::::

async function TabelaNomesExe(){
    try {
        /////////OBTEM NOME ARUAL DOS ARQUIVOS B
        await ObterNomesDocs();
        NomesOBJ_B = fileNomes;
        ////// CRIA UM ARRAY DE OBJ  minhaTabela ::::::::::
        minhaTabela = [];
        for (var i = 0; i < NomesOBJ_A.length; i++) {
             minhaTabela.push({orign_nome: NomesOBJ_A[i],  status: "OK",  new_nome: NomesOBJ_B[i]}); 
        }
    } catch (err) {alert(err) }
}
 //////////::::::::::

///////RENOEMIA OS AQUIVOS DA PASTA
async function renomearNomes(){
    // try {
    //       await criarPasta("file:/C:/",  "temp");
    //         const tempFolder =  await fs.getEntryWithUrl("file:/C:/temp");  
    //         const fileBat = await tempFolder.createFile("{987-321-654}.bat", { overwrite: true });
    //         await fileBat.write(`@echo off\n chcp 65001\n setlocal enabledelayedexpansion\n set "pasta=${path}"\n set "contador=1"\n cd /d "%pasta%"\n for %%A in (*.jpg *.jpeg *.png) do (\n set "filename=%%~nA"\n set "number="\n for /f "delims=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@-# " %%B in ("!filename!") do (\n set "number=!number!%%B"\n )\n set /a number=1000+!number!\n ren "%%A" "PG_0!number:~-2!%%~xA"\n )\n endlocal`);
    //         await shell.openPath("C:/temp/{987-321-654}.bat");
    //      } catch (err) {alert(err) }
        core.executeAsModal(async () => {
            var jsxArquivos = "suport/renameDocs.jsx" 
            await exexutarJSXfile(jsxArquivos)                         
        })
        async function exexutarJSXfile(jsxFile) {  
            var pluginFolder = await fs.getPluginFolder()
            try {var filetoken = await fs.createSessionToken(await pluginFolder.getEntry(jsxFile));}
            catch (e) { app.showAlert("Script não localizado!");}
            await app.batchPlay([{ "_obj": "AdobeScriptAutomation Scripts","javaScript": {"_path": filetoken,"_kind": "local"},"javaScriptMessage": "JSM","_isCommand": true,"_options": {"dialogOptions": "dontDisplay"}}], {});
        }
  }
//////////::::::::::::
//////////::::::::::::

/////////////////////////////////////////////////////////////////////////////
///// FUNÇÃO PARA PREENCHER A TABELA COM ESSES DADOS
async function preencherTabela() {
    try {
       const tabela = document.querySelector('#tabela tbody');    
       minhaTabela.forEach( (pagina, indice) => {
            const linha = document.createElement('tr');
            const colunaA = document.createElement('td');
            const colunaB = document.createElement('td');
            const colunaC = document.createElement('td');
            colunaA.textContent = pagina.orign_nome;
            colunaB.textContent = pagina.status;
            colunaC.textContent = pagina.new_nome;
            linha.appendChild(colunaA);
            linha.appendChild(colunaB);
            linha.appendChild(colunaC);
            tabela.appendChild(linha);
        });
        document.querySelector('#sevicoLegenda').textContent = `Entrada: ${data} / Capa para ${paginas} Páginas • ${LogoCapa}• Loja: ${Loja} •  Cliente: ${cliente}`;
    } catch (err) { console.log(err);}
}
/////////:::::::::::::::::::

////// CARREGAR JALELA PROGESS
async function janTabelaNomes() {
    fetch('pags/tabelaDLG.html').then(response => response.text()).then(data3 => {
        const dlg3 = document.querySelector("#tabelaNomes");
        dlg3.show({ title: "Nomencalura atualizado!", titleVisibility:"show", resize: "both", size: { width: 400}})
        dlg3.innerHTML = data3;
        preencherTabela();
        document.getElementById("closeTabela").addEventListener("click", async function(){
            document.querySelector("#tabelaNomes").close('OK');
            await core.executeAsModal( async() => {await app.batchPlay( [{"_obj":"close","documentID":1792,"forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}], {});});
            await exibirDiretorio(exibirFolder);
        })
    });
}

//////////////////////////////////
async function mcvincarPG01(){
    try {
        ///OBTER O PRIMEIRO ITEM DA LISTA DE ARQUVOS E ADD VINCO (PRIMEIRA LAMINA)
        const PagsVinco = await fs.getEntryWithUrl(`${path}/${NomesOBJ_B[0]}`);
        await app.open(PagsVinco);  await GetLuminosidade(); await  vincadoTarget(0.05);
        await app.batchPlay( [{"_obj":"flattenImage"}, {"_obj":"save"}, {"_obj":"close","documentID":138,"forceNotify":true}], {});
    } catch (err) {alert(err)}
}
/////////::::::::::::::::::::::::::::::
////////FUN_ES_LOCAIS_FINAL

//////////////////////////////////////////
//// EPORTA ES FUNÇÕES DESSE JS
module.exports = {openModal}

///////XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
/////// OUVINTES DE EVENTOS AQUI =============
function ouvitesEventsFucs(){
    let  left
    core.executeAsModal(async () => {
        await importSuportes("xmbcrios03.csh", "customShape"); 
    })

    PesetLista = document.getElementById("list_PA");
    AjusteLista = document.getElementById("list_AJ");
    ///// FUNÇÃO SETAS  INPUT TEXT
    deslocarVertical()
    function deslocarVertical(){
        const cont = 1;
        qpages = document.getElementById("qpages"); 
        const setaCM = document.getElementById("setaCM");
        const setaBX  = document.getElementById("setaBX");
    
        setaCM.addEventListener("click", async function(){
            try {
                if(qpages.value >34){ qpages.disabled=true}
                else{qpages.value =Number(qpages.value)+ Number(cont); qpages.disabled= false}
                PositionLogo = true; ////// NÃO RESETAR A POSIÇÃO DO LOGO SE O MESMO FOR DESLOCADO
                await CapasConfigP1();
            } catch (err) {alert(err) }
        });
        setaBX.addEventListener("click",async function(){
            if(qpages.value <10){qpages.disabled=true}
            else{qpages.value =Number(qpages.value) - Number(cont); qpages.disabled= false}
            PositionLogo = true; ////// NÃO RESETAR A POSIÇÃO DO LOGO SE O MESMO FOR DESLOCADO
            await  CapasConfigP1();
        });
    };
    ///=====
    ///// FUNÇÃO APLIA DIMINUE ZOOM
    ampliarDiminue();
    function ampliarDiminue(){
        const icone1 = document.getElementById("icone-1");
        const icone2 = document.getElementById("icone-2");
        const zoom = document.getElementById("icone-zoom");
        zoom.addEventListener("click", function() {
        if (icone1.style.display === "none") {icone1.style.display = "block"; icone2.style.display = "none";  zoomLogoADD(false)}
            else {icone1.style.display = "none"; icone2.style.display = "block"; zoomLogoADD(true)};
        });
    }
    ///////// ====
    ///// FUNÇÃO APLICAR COR AO LOGO
    addRemoveColor();
    function addRemoveColor(){
        icone3 = document.getElementById("icone-3");
        icone4 = document.getElementById("icone-4");
        const zoom = document.getElementById("icone-Balde");
        zoom.addEventListener("click", function() {
            if (icone3.style.display === "none") { icone3.style.display = "block"; icone4.style.display = "none"; colorLogoADD(false);
            } else { colorLogoADD(true)};
        });
    }
    ///////// ====
    ///// FUNÇÃO  VALIDA CHECKBOX ADD IMAGEM
    metodo= false;
    addImageCheck();
    function addImageCheck(){
        const ck1 = document.getElementById("checkbox-A");
        ck1_ckecked = true;
        ck1.addEventListener("click", function() {
            if(PesetLista.selectedIndex == 0){return};
            if(PesetLista.selectedIndex == 2){return};
            if (ck1_ckecked === false) { 
                ck1.classList.add('cb-checado'); ck1_ckecked =true;  metodo= false;
                document.getElementById("Buscar").classList.remove('elem-Desabilitado');
            } 
            else { 
                ck1.classList.remove('cb-checado');  ck1.classList.add('cb-default');   ck1_ckecked = false;  metodo= true;   
                document.getElementById("Buscar").classList.add('elem-Desabilitado');
                    }
            });
    };
    ///////// ====
    ///// FUNÇÃO  VALIDA CHECKBOX EXIBIR LOGO
    exibirLogotipo();
    function exibirLogotipo(){
        const ck2 = document.getElementById("checkbox-B");
        ck2_ckecked = true;
        ck2.addEventListener("click", function() {
            core.executeAsModal(async () => {
                await app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}], {});
                if (ck2_ckecked === false) { 
                    ck2.classList.add('cb-checado'); ck2_ckecked =true;  
                    app.activeDocument.layers[0].opacity=100;
                    } 
                else { ck2.classList.remove('cb-checado'); ck2_ckecked = false;  app.activeDocument.layers[0].opacity=0 };
            });
        });
    };
    ///////// ====
    ////// VALIDA FUNÇÃO BUSCAR CARTÃO
    buscarCartao();
    function buscarCartao(){
        document.getElementById("Buscar").addEventListener("click", function(){   
            if(ck1_ckecked ==true){dlgCartconfig();/*alert("Aqui função buscar!")*/}
        });
    };
    ///////// ====

    ///// FUNÇÃO  VALIDA CHECKBOX ADD IMAGEM
    customLogo();
    function customLogo(){
            const ck3 = document.getElementById("checkbox-C");
            ck3_ckecked = false;
            ck3.addEventListener("click", function() {  
            if (ck3_ckecked === false) { 
                ck3.classList.add('cb-checado'); ck3_ckecked =true; 
                document.getElementById("bs-Logo").classList.remove('elem-Desabilitado');
                } 
                else { 
                ck3.classList.remove('cb-checado'); ck3_ckecked = false;
                document.getElementById("bs-Logo").classList.add('elem-Desabilitado'); 
                substituirLogo(true);
                }
            });
    };
    ///////// ====
    ////// VALIDA FUNÇÃO BUSCAR LOGO
    buscarLogo();
    function buscarLogo(){
        document.getElementById("bs-Logo").addEventListener("click", function(){
            if(ck3_ckecked ==true){substituirLogo(null)}
        });
    };
    ///////// ====

    renameOP();
    function renameOP(){
        const ck4 = document.getElementById("checkbox-D");
        ck4_ckecked = true;
        ck4.addEventListener("click", function() {  
        if (ck4_ckecked === false) { ck4.classList.add('cb-checado'); ck4_ckecked =true;} 
        else { ck4.classList.remove('cb-checado'); ck4.classList.add('cb-default'); ck4_ckecked = false; }
        });
    };

    ////////////// BOTÕES COLUNA B
    document.getElementById("Pocess").addEventListener("click", async function(){processOK()});
    
    async function processOK(){
        try {
            ///// SE O VALOR DE DA VAR.. "PROCESSAR" FOR FALSO, DISPARAR ALERTA E NÃO PROCESSAR.
            if(processar==false){ document.querySelector("#alerta").style.display = "block"; return };
            await document.querySelector('#dlgFotobook').close('OK');  
            await janCarregando(); 
            function evento() {setTimeout(() => CapasConfigP2()); }
            setTimeout(evento, 100); 
            document.querySelector('#process1DLG').close('OK')
        } catch (err) {alert(err)}
    }
     /////////::::::::::::::::
    //////// EVENTO CANCELAR
    document.getElementById("Cancel").addEventListener("click", async function(){
            document.querySelector('#dlgFotobook').close('OK'); resetarConfigs(); 
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") { document.querySelector('#dlgFotobook').close('OK'); resetarConfigs();}
    });
    /////////::::::::::::::::

    document.getElementById("stcm").addEventListener("click", function(){
        core.executeAsModal(async () => { 
            await app.activeDocument.layers[0].translate(0, -20);
            await app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}], {});
        });
    });
    document.getElementById("stbx").addEventListener("click", function(){
        core.executeAsModal(async () => {
                await app.activeDocument.layers[0].translate(0, 20);
                await app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}], {});
            });
    });
    ///////:::::::::::::   

    ////// CONFIGS ADICIONAR CARTÃO
    function dlgCartconfig() {
        document.querySelector("#dlgCartconfig").show({ title: "Mine explorador de arquivo!", resize: "both", size: { width: 320, height: 60 } })
        const caminho =   localStorage.getItem("localCartao");
        const truncatedPath = encurtaLegenda(caminho);
        document.getElementById("caminho").innerHTML= truncatedPath;
    };
    //////************* 
    document.getElementById("btnBuscar").addEventListener("click", function(){
        cartaoFolder(); 
    });
    document.getElementById("btnOK").addEventListener("click", function(){
        document.querySelector('#dlgCartconfig').close('OK');
    });

    document.getElementById("qpages").addEventListener("input", async function(){
            CapasConfigP1();
    });
    
    ////// OBTEM O A QUNATE DE PAGINAS DO LOCALSTORATE OU O VALOR 10 SE NÃO EXISTIR
    document.getElementById("qpages").value= localStorage.getItem("pagQuantSave")  || 10;
     //////========

    
    //////XXXXXXXXXXXXXXXXXXXXXXX //////////////////////////////////////////////////
     /////// BOTÕES DE RÁEDIO SETTINGS
    rd1 = document.getElementById("rd1");
    rd2 = document.getElementById("rd2");
    rd3 = document.getElementById("rd3");

    //////// AÇÃO QIE VERIFICA QUAL BAOTÃO CHECADO
    function radioChecado() {
    ////////// VERIFICA QUAL BOTÃO TEM A CLASSE 'rchecado'
        if (rd1.classList.contains('rchecado')) { PapeUser ="P20"} //alert("Papel 20,3'");
        if (rd2.classList.contains('rchecado')) { PapeUser ="P25"} //alert("Papel 25,4'");
        if (rd3.classList.contains('rchecado')) { PapeUser ="P30"} //alert("Papel 30,4'");
    }
   ///////::::::::::::::::::::::::

    const radioSellect = 2; /// MARCAR PAPEL: 0: 23,3 / 1: 25,4 / 2: 30.4
    ////////// SELECIONAR A OPÇAO RADIO POR NUMERO
    function radioIndexMc(){   
        rd1.classList.remove('rchecado');
        rd2.classList.remove('rchecado');
        rd3.classList.remove('rchecado');
        if (radioSellect === 0) { rd1.classList.add('rchecado');} 
        else if (radioSellect === 1) { rd2.classList.add('rchecado'); } 
        else if (radioSellect === 2) { rd3.classList.add('rchecado'); }
    }
    ////////// SELECIONAR A OPÇAO RADIO POR NUMERO - FINAL
    radioIndexMc(); ////////// SELECIONAR A OPÇAO RADIO POR NUMERO
    radioChecado(); /////// VERIFICA RADIO BOTÕES

    const radios = document.getElementsByClassName("radio");
    const radioBtn = Array.from(radios);
    for(let i = 0; i < radioBtn.length; i++){ 
        radioBtn[i].addEventListener('click', (event) => {
            for(let i = 0; i < radioBtn.length; i++){
                 index = radioBtn.indexOf(event.currentTarget);
                 //////// VALIDAÇÃO BOTÕES DE RADIO COM BASE NA LISTA
                 if(PesetLista.selectedIndex == 0){ if(index==0 || index==1){desabiltaAddimage();} else{habiltaAddimage();} } 
                 if(PesetLista.selectedIndex == 1){ if(index==0 ){return};  if(index==1){desabiltaAddimage();} else{habiltaAddimage();}} 
                 if(PesetLista.selectedIndex == 4){ if(index==0 ){return};} 
                 if(PesetLista.selectedIndex == 5){ if(index==0 || index==1){return};} 
                 //////:::::::::::::::
                 radioBtn[i].classList.remove('rchecado');
          }
           event.currentTarget.classList.add('rchecado');
           radioChecado(); /////// VERIFICA RADIO BOTÕES
        })
    }

    document.getElementById("txt_rd1").setAttribute("style", "color: #8b8888");
    /////////////RADIO SUPORT////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    //////===

    ////////EVENTOS LISTA PAPEL E AJUSTE
     PesetLista.selectedIndex = 1;
     PesetLista.addEventListener("change", function(){  
         try { listaPapelOK();  CapasConfigP1(); radioChecado();} catch (err) {alert(err) }
     })

     function configPrest(largura, altura, tela){
        larguraDoc= largura; alturaDoc= altura; core.executeAsModal( () => { modoDeTela(tela)})
     }

     /////////////////
     AjusteLista.addEventListener("change", function(){
         core.executeAsModal(async () => { if(AjusteLista.selectedIndex == 0){ selectCamada("Capa_Config")}else{selectCamada("Icon_Dorso")} })
     })
     //////========

    ////// FUNÇÃO HABILTAR / DESABILITAR COMPONENTE
    habilitado ="#d4d2d2"; desabiltado = "#8b8888";
    function validaSelOption(comp, method){ document.getElementById(comp).setAttribute("style", `color: ${method}`);}
    ////////:::::::::::::::::::::::::::::::::::::::::::::::::::

    function listaPapelOK(){
        if(PesetLista.selectedIndex == 0){ 
            desabiltaAddimage(); /////// FUNÇÃO PARA DESALITAR BOTÃO ADD IMAGEM
            rd1.classList.add('rchecado'); rd2.classList.remove('rchecado'); rd3.classList.remove('rchecado');
            validaSelOption("txt_rd3", habilitado); validaSelOption("txt_rd2", habilitado); validaSelOption("txt_rd1", habilitado);
            configPrest(2970, 2030, 1); 
         }
        else if(PesetLista.selectedIndex == 1){
            habiltaAddimage();
            rd3.classList.add('rchecado'); rd2.classList.remove('rchecado'); rd1.classList.remove('rchecado');
            validaSelOption("txt_rd3", habilitado); validaSelOption("txt_rd2", habilitado); validaSelOption("txt_rd1", desabiltado);
            configPrest(3030, 2100, 1);
           }
        else if(PesetLista.selectedIndex == 2){
            desabiltaAddimage(); /////// FUNÇÃO PARA DESALITAR BOTÃO ADD IMAGEM
            rd1.classList.add('rchecado'); rd2.classList.remove('rchecado'); rd3.classList.remove('rchecado');
            validaSelOption("txt_rd3", habilitado); validaSelOption("txt_rd2", habilitado); validaSelOption("txt_rd1", habilitado);
            configPrest(4000, 2030, 0); 
         }
        else if(PesetLista.selectedIndex == 3){
            desabiltaAddimage(); /////// FUNÇÃO PARA DESALITAR BOTÃO ADD IMAGEM
            rd1.classList.add('rchecado'); rd2.classList.remove('rchecado'); rd3.classList.remove('rchecado');
            validaSelOption("txt_rd3", habilitado); validaSelOption("txt_rd2", habilitado); validaSelOption("txt_rd1", habilitado);
            configPrest(6000, 2030, 0); 
          }
        else if(PesetLista.selectedIndex == 4){
            desabiltaAddimage(); /////// FUNÇÃO PARA DESALITAR BOTÃO ADD IMAGEM
            rd2.classList.add('rchecado'); rd3.classList.remove('rchecado'); rd1.classList.remove('rchecado');
            validaSelOption("txt_rd3", habilitado); validaSelOption("txt_rd2", habilitado); validaSelOption("txt_rd1", desabiltado);
            configPrest(5000, 2540, 0); 
          }
        else if(PesetLista.selectedIndex == 5){
            desabiltaAddimage(); /////// FUNÇÃO PARA DESALITAR BOTÃO ADD IMAGEM
            rd3.classList.add('rchecado'); rd2.classList.remove('rchecado'); rd1.classList.remove('rchecado');
            validaSelOption("txt_rd3", habilitado); validaSelOption("txt_rd2", desabiltado); validaSelOption("txt_rd1", desabiltado);
            configPrest(6000, 3040, 0);
         };
    }

    /////// FUNÇÃO PARA HALITAR BOTÃO ADD IMAGEM
    function habiltaAddimage(){
        document.getElementById("checkbox-A").classList.remove('cb-desabilitado'); 
        document.getElementById("text-checkbox-A").classList.remove('label-Desabilitado');
        if(metodo==false){ document.getElementById("Buscar").classList.remove('elem-Desabilitado'); ck1_ckecked = true; }
        else{ck1_ckecked =false;}; 
    }
    /////// FUNÇÃO PARA DESALITAR BOTÃO ADD IMAGEM
    function desabiltaAddimage(){
        document.getElementById("text-checkbox-A").classList.add('label-Desabilitado');
        document.getElementById("checkbox-A").classList.add('cb-desabilitado');
        if(metodo==false){ document.getElementById("Buscar").classList.add('elem-Desabilitado'); ck1_ckecked = false; }
        else{ck1_ckecked =false;}; 
    }
//////::::::::::::::::::::::::
     //////XXXXXXXXXXXXXXXXXXXXXXX //////////////////////////////////////////////////
} ////   ouvitesEventsFucs  - FINAL BLOCO:::
/////////////////////////////////////////////