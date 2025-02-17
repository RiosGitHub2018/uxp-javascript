const dgm_btn1 = document.querySelector("#dgm-btn1");
dgm_btn1.addEventListener("click", async () => {  
    D1FtBookEventos=true;
    if(app.documents.length==0){ 
         const f = await fs.getFileForOpening(); if(f){await core.executeAsModal(() => app.open(f));} if(f==null){ return};
        }

    if (app.activeDocument.name.split(".")[1] !="jpg" && app.activeDocument.name.split(".")[1] !="jpeg") { 
        error(`O documento  "${app.activeDocument.name}" precisar estar em formatos JPG`); 
         return;
    }

    await progressDLG("Aquarde Processing . . ."); 
    function evento() { setTimeout(() => incialConfigs());} setTimeout(evento, 100);
});

////// CARREGAR JALELA PRINCIPAL
async function janCapasconfigs() {
    await document.querySelector('#process1DLG').close('OK');
    fetch('html/D1ftbook.html').then(response => response.text()).then(data => {
    const dlg = document.querySelector("#dlgFotobook");
    dlg.show({ title: "PS-fxrios: FotoBook Configurator", resize: "both", size: { width: 380, height:410}})
    dlg.innerHTML = data;
        ////// TODOS OS addEventListener AQUI!
        ouvitesEventsFucs()
        ////// OBTEM O A QUNATE DE PAGINAS DO LOCALSTORAGE 
        document.getElementById("qpages").value= paginas
        focarJanela("#D1focus");
        dorsoConfigus();
        //////// REMOVER EVENTOS DE ATALHO AO FECHAR JANELA
        dlg.addEventListener("close", async () => {  await unidadeseRegua("cm")  });
        ////===
    });
    
}

///FUNCTION incialConfigs INCIAR
async function incialConfigs() {   
    try {
        /////// CARREGA OS DADOS INCIAIS DO LOCALSTORAGE
        //localStorage.clear();
        caminho = app.activeDocument.path.replace(/\\[^\\]*$/, "");
        await paginaQTDobter(caminho ); //////// VERIFICA A QUANTIDADE DE PAGINAS VÁLIDAS
        let paginasQTD = conteudoA.length; //////// OBTEM A QUANTIDADE DE PAGINAS
        //////////:::::::::::::::::::::::::::::
        await unidadeseRegua("px");
        await gramaturaDados();
        const obterDadosDI = localStorage.getItem('InciaisDados');
        if(obterDadosDI !==null) {
            const ObjetoDI = JSON.parse(obterDadosDI);
            paginas = paginasQTD; // ObjetoDI.dados02;
            indexPreset = ObjetoDI.dados03;
        }
        else{paginas = paginasQTD;  indexPreset =1}

        ////////:::::::::::::
        await pontoInicialConfig();
        await core.executeAsModal(async () => {await creatSnapshot("Iniciar")}) 
        resol = 254// app.activeDocument.resolution;
        wDorso = Number (paginas*2*gramatura)/2.54*resol; 

        configsPrestsSel(indexPreset);
        larguraDoc = wDOC+ wDorso;  
        alturaDoc= hDOC; 
        LogoCapa = "Logo Inserido";  cartaoADD=true;
        await CapasConfigP1();

        await corteCapaConfig();

        await document.querySelector('#processServic').close('OK');
        function evento() { setTimeout(() =>janCapasconfigs() );} setTimeout(evento, 100);
       //////////////
      } catch (error) { alert(error)}
};
 
///////////////////////////////////////
///////////CONFIGS PARTE 1 AQUI
async function CapasConfigP1() {
    try {
        await core.executeAsModal(async () => {
            larguraDoc = wDOC+ wDorso;  alturaDoc= hDOC;  
            await GetLuminosidade()
            await app.batchPlay([
                {"_obj":"reset","_target":[{"_property":"colors","_ref":"color"}]},
                {"_obj":"imageSize","constrainProportions":true,"height":{"_unit":"pixelsUnit","_value":alturaDoc},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"resolution":{"_unit":"densityUnit","_value": resol },"scaleStyles":true},
                {"_obj":"canvasSize","horizontal":{"_enum":"horizontalLocation","_value":"center"},"width":{"_unit":"pixelsUnit","_value":larguraDoc}}
            ]);
            await guiasConfigurar(wDorso,50);
            await configsPreferences()

            logADD = document.querySelector("#desAddLogo").checked
            if( logADD==true){
                await adicionarlogoLoja()
                await app.activeDocument.activeLayers[0].rotate(90); 
                await alinarCapaSize();
            }
            await enquadraBordas();   
            await resetarHistorico()
            await ZoomDOC(0);  await ZoomDOC(1);  
           },{"interactive": true}); 
        } catch (e) {alert(e) }
}//////////////////CONFIGS PARTE 1 AQUI FINAL

///////////CONFIGS PARTE 1 AQUI
async function CapasConfigP2() {
    try {
       await core.executeAsModal(async () => {
          await selectCamada("Capa_Config");
           ///////// ADINONAR LEGENDA PARA CONTAGEM DE LAMINAS
            wDocMT=app.activeDocument.width/2;
            await app.activeDocument.createTextLayer({ name: "ttLaminas", contents: `${paginas} lam`, fontSize: 25, position: {x: 10, y: 10}, fontName: "Arial"});
            const bounds = app.activeDocument.activeLayers[0].bounds;             
            posx= Number (wDocMT)- Number(bounds.right-bounds.left)/2 
            posy= Number(app.activeDocument.height-15)
            await app.activeDocument.layers[0].translate(posx-12, posy); 
            if(luminosidade<128){ await app.batchPlay([{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"what":{"_enum":"rasterizeItem","_value":"type"}},{"_obj":"invert"}]);}
            /////////////:::::::::::::::::::::::
            
            //////// ADICIONAR VINCO
            vSize = document.querySelector("#McVincoSize").value;
            adcionarVinco = document.querySelector("#addMcVinco");

            if(adcionarVinco.checked == true){ 
                await vincadoTarget(wDorso, Number(vSize)); await vincadoTarget(360+wDorso, Number(vSize));
                await app.batchPlay([ {"_obj":"mergeLayersNew"}]);  
                if(luminosidade<128){ await app.batchPlay([{"_obj":"invert"}]);}
             };


            await ADDselecaoDOC(); checarOpçoesRadio(); 

            await app.batchPlay([
                {"_obj":"clearAllGuides"}, {"_obj":"flattenImage"},{"_obj":"duplicate","_target":[{"_property":"selection","_ref":"channel"}]},
                {"_obj":"make","at":{"_enum":"channel","_ref":"channel","_value":"mask"},"new":{"_class":"channel"},"using":{"_enum":"userMaskEnabled","_value":"revealSelection"}}, {"_obj":"flattenImage"},
                {"_obj":"canvasSize","height":{"_unit":"pixelsUnit","_value": hDoCfinal },"horizontal":{"_enum":"horizontalLocation","_value":"left"},"vertical":{"_enum":"verticalLocation","_value":"top"},"width":{"_unit":"pixelsUnit","_value":wDOCfinal}}
            ]);

            await ZoomDOC(0);  await ZoomDOC(1);  
            ///////ADICIONA O PONTILHAR HRIZONTAL
            const posB1= 596.4094488188977;
            const posE1= 0.5669291338582677;
            const posD1= 1019.9055118110236;
            const posT1= 595.5590551181102;
            await ADDselecaoShapes(posB1, posE1, posD1, posT1, "Pontilhado", 0);
            await solidColorCamada(83,83,83);
            await app.batchPlay([{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}, {"_obj":"select","_target":[{"_property":"workPath","_ref":"path"}]}, {"_obj":"delete","_target":[{"_property":"workPath","_ref":"path"}]}], {});
            ////////configsPreferencesconfigsPreferencesconfigsPreferencesconfigsPreferencesconfigsPreferencesXX
            if(hDOC < 2500 && hDOC !==2030){  
                await app.activeDocument.layers[0].duplicate();
                await app.activeDocument.layers[0].translate(0, 62); 
                await app.activeDocument.layers[0].duplicate();
            };
           
            ///////ADICIONA O PONTILHAR VERTICAL
            await app.activeDocument.layers[0].rotate(-90); 
            await app.batchPlay([{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_name":"Alpha 1","_ref":"channel"}}], {});
            await alignCamada(1,false); await alignCamada(3,true);
            await app.activeDocument.layers[0].translate(3, 62); 

             //////AAD LEGENDA CAPA :::::::::::::::::::::::
            const posB2= 133; const posE2= 0; const posD2= 306; const posT2= 0;
            await ADDselecaoShapes(posB2, posE2, posD2, posT2, "Icon_Fotobook", 1);
            await solidColorCamada(0,0,0);
            await app.batchPlay([{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}, {"_obj":"select","_target":[{"_property":"workPath","_ref":"path"}]}, {"_obj":"delete","_target":[{"_property":"workPath","_ref":"path"}]}], {});

            await legendaDados();
            legenda = `Entrada: ${data} / Capa para ${paginas} Páginas • ${LogoCapa} • Loja: ${Loja} •  Cliente: ${cliente}`;
            xPosition= 140; yPosition = 92;
            await app.activeDocument.createTextLayer({ name: "myTextLayer", contents: legenda, fontSize: 28, position: {x: xPosition, y: yPosition}, fontName: "Arial"});
            await app.batchPlay([ {"_obj":"mergeLayersNew"}], {});

            const wsDOC = app.activeDocument.width*2.54/resol;    
            const hsDOC  = app.activeDocument.height*2.54/resol; 
            newFileName = `Capa_${parseFloat(hsDOC.toFixed(1))}x${parseFloat(wsDOC.toFixed(1))}cm`;

            //////ROTACIONA A LEGENDA -90 GRAUS :::::::::::::::::::::::
            await app.activeDocument.layers[0].rotate(-90); 
            await carregarSelecao();
            await alignCamada(1, false);  await alignCamada(3, true);
            await app.activeDocument.layers[0].translate(148, -35); 
            await app.batchPlay([ {"_obj":"mergeLayersNew"}], {});  
            //////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   
            /////FUNÇÃO PARA RENOMEAR OS ARQUIVOS E TAMBEM OBTER OS DADOS DA TABBELA
           await renamePaginas(caminho ,true );
            obterDadosTabela = [];
            conteudoA.forEach((elemenA, index) => {
               obterDadosTabela.push({orign_nome: elemenA,  status: "OK",  new_nome: conteudoB[index]})
            });
            //////////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

            //////ADD CARTÃO 
            if(document.querySelector("#rd01").checked===true || document.querySelector("#rd02").checked===true){cartaoADD=false}
            else if(document.querySelector("#ListPreset").selectedIndex==1){cartaoADD =document.querySelector("#insImagem").checked}
            else{cartaoADD=false}

            if(cartaoADD==true){
                try {
                    await inserirCartao();
                    if(app.activeDocument.layers[0].name !=="Background"){
                        await resizeCartao(8, 5);
                        await app.activeDocument.layers[0].rotate(-90); 
                        await app.batchPlay([{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}], {});
                        await carregarSelecao();
                        await alignCamada(1, false);  await alignCamada(2, true);
                        await app.activeDocument.layers[0].translate(27, 899);
                        for (var i=0;i<5;i++){await app.activeDocument.layers[0].duplicate();  await app.activeDocument.layers[0].translate(526, 0);}
                    }
               } catch (error) {alert(error)}
            };

            await app.batchPlay([{"_obj":"flattenImage"}], {});
            await  backupCapa(caminho);
            try { await salvarDocumto(newFileName);} catch (err) {}
            if(adcionarVinco.checked == true){ await  mcvincarPG01(Number(vSize));} ;

            resetarHistorico();
             await document.querySelector('#processServic').close('OK');
            ///////OPÇÃO EXIBIR TABELA SE A MESMA FOR SOLICITADA
            exibirTabela = document.querySelector("#exibTabela").checked;
            if(exibirTabela===true){await janTabelaNomes();}
            SalvarDadosDI(); ///// SALVAR QUANT DE PÁGINAS  NO LS
           },{"interactive": true}); 
      
        } catch (err) {alert(err) }
}//////////////////CONFIGS PARTE 2 AQUI FINAL
///////////////////////////////////////////////////////

///////// CONFIGURAÇÕES SCRIPTS
async function ouvitesEventsFucs(){
    try {
        colunacResetClasss(".coluna_B", '.altura' ); //////// RESETAR BOTÃO SELECIONADO
        cont = 1;
        qpages = document.getElementById("qpages"); 
        document.querySelector(".D1colunaA").addEventListener("click",  function(){ focarJanela("#D1focus") });

        ////// BORÕES DA COLUNA B ////////////////
        document.getElementById("BtnPocess").addEventListener("click", async function(){
            await finalProcess();
        })
        document.getElementById("BtnCancel").addEventListener("click", async function(){
            document.querySelector("#dlgFotobook").close('OK');
            document.querySelector("#dlgCartconfig").close('OK');
             resetarConfigs(); D1FtBookEventos=false;
        })
        document.getElementById("BtnConfigs").addEventListener("click", async function(){           
            dlgPreferencias() ;
        })
        ////// BORÕES DA COLUNA B FINAL ////////////////    

        async function finalProcess(){
           try {
                if (D1FtBookEventos===false) {return};
                D1FtBookEventos=false
                document.querySelector("#dlgFotobook").close('OK');
                progressDLG("Aquarde Processing . . ."); 
                function evento() { setTimeout(() => CapasConfigP2());} setTimeout(evento, 1000);
           } 
           catch (error) {alert(error)}
        };

        ////////////// ATALHOS CONFIGSXXXXXXXXXXXX
        //////// PRECESSO FINAL 
        document.addEventListener("keydown", fotobookKey);
        async function fotobookKey(event) {
            if (D1FtBookEventos===false) {return};
            if (event.keyCode === 13) {
                document.removeEventListener("keydown", fotobookKey); // Remove o event listener após o evento ter sido acionado
                await finalProcess();
            };
            //////// PRECESSO CANCELAR
            if (event.keyCode == 27) {  
                document.querySelector("#dlgFotobook").close('OK'); resetarConfigs();
                D1FtBookEventos=false;
            };

            if (event.keyCode == 76) {
                focarJanela("#qpages");
                function evento() { setTimeout(() =>  focarJanela("#D1focus"));} setTimeout(evento, 1000);
            };

            if (event.keyCode == 38) { enquandrarCapaLogo(-20) };
            if (event.keyCode == 40) { enquandrarCapaLogo(20) };
            if (event.keyCode == 32) { logoDorsiADD() };
            if (event.keyCode == 123) { 
                 toggleButton("#selLogo", "#selCapa", "#txtLogo", "#txtCapa");
                CamadaAjustar="Icon_Dorso";
            };
            if (event.keyCode == 122) { 
                toggleButton("#selCapa", "#selLogo", "#txtCapa", "#txtLogo");
                CamadaAjustar="Capa_Config";
           };
           
        };

      toggleLogoADD= false;
      function logoDorsiADD() {
            if ( toggleLogoADD) {
                document.getElementById("cheLogo").checked=true; 
                focarJanela(); toggleLogoADD = false;
            } else {
                document.getElementById("cheLogo").checked=false;
                focarJanela(); toggleLogoADD = true;
            };
            focarJanela("#dlgfocus");
        };

        ////////////////////:::::::::::::::::

       async function configsPresets(){
            try {
                configsPrestsSel(itemPresets.selectedIndex);
                await  selSanpshots("Iniciar"); await CapasConfigP1(); await wCapaConfig();
                focarJanela("#D1focus");
           } catch (e) {alert(e) }
        }

        CamadaAjustar="Capa_Config";
        document.querySelector("#txtCapa").style.color = "#88f0a0"
        document.querySelector("#selLogo").addEventListener("click", async function(){
                toggleButton("#selLogo", "#selCapa", "#txtLogo", "#txtCapa");
                CamadaAjustar="Icon_Dorso"
        });
        
        document.querySelector("#selCapa").addEventListener("click", async function(){
                toggleButton("#selCapa", "#selLogo", "#txtCapa", "#txtLogo");
                CamadaAjustar="Capa_Config"
        });
                    
       ///// EVENTOS  DOS BOTÕES DE CONFUGURAÇÕES AVANÇADAS
        document.getElementById("stcm").addEventListener("click", function(){
            enquandrarCapaLogo(-20)
        });
        document.getElementById("stbx").addEventListener("click", function(){
                 enquandrarCapaLogo(20)
        });
        addRemoveColor(); ampliarDiminue(); mostrarOcultarLogo()
        ///////:::::::::::::   

        qpages.addEventListener("input", async function(){  wCapaConfig() });
        const setaCM = document.getElementById("setaCM");
        const setaBX  = document.getElementById("setaBX");
       
        setaCM.addEventListener("click", async function(){
            try {
                if(qpages.value >34){ qpages.disabled=true}
                else{qpages.value =Number(qpages.value)+ Number(cont); qpages.disabled= false}
                 wCapaConfig(); 
            } catch (err) {alert(err) }
        });
        setaBX.addEventListener("click",async function(){
            if(qpages.value <10){qpages.disabled=true}
            else{qpages.value =Number(qpages.value) - Number(cont); qpages.disabled= false}
               wCapaConfig()
        });

        ////////MOSTRAR/OCULTAR GUIAS
        es1.on('#ckMtrGuias', 'click', async() => {
            try {
                await core.executeAsModal( async() => {   
                    if( s1("#ckMtrGuias").checked==true){ await guiasConfigurar(wDorso,50)}
                    else{ await app.batchPlay( [ {"_obj": "clearAllGuides" }]);  }
                    await app.batchPlay( [ { "_obj": "clearEvent", "_target": [ { "_property": "historyStates", "_ref": "property" }, { "_enum": "ordinal", "_ref": "document", "_value": "targetEnum" } ] }]); 
               });
            } catch (err) {alert(err)}
        });

        ////////FUNÇÃO DA LISTA DE TAMNHOS
        itemPresets = document.querySelector("#ListPreset");
        itemPresets.addEventListener('change', async (event) => {
           try {
                configsPrestsSel(itemPresets.selectedIndex);
                await  selSanpshots("Iniciar"); 
                await CapasConfigP1(); 
                await corteCapaConfig(); 
                await wCapaConfig();  
                focarJanela("#D1focus");
           } catch (e) {alert(e) }
         })
         
        itemPresets.selectedIndex = indexPreset;
        configsPrestsSel(indexPreset);
        informõesCapa();
        statusConfigsADDLogo() ////// VALIDA AS OPÇÕES DE ADÇÃO DELOGO
 
    } catch (e) {alert(e) }
}///////////////CONFIGURAÇÕES SCRIPTS FINAL
/////////////////////XXXXXXXXXXXXXXXXXXXXXXX

////////// FUNÇÕES COMPLEMENTARES
///////////// STATUS BOTÕES DE RADIO
function  radioTrue(radio){document.querySelector(radio).checked=true}
function habilitarTadio(radio, txtRadio){
    document.querySelector(radio).disabled= false;
    document.querySelector(radio).checked=false
    document.querySelector(radio).classList.remove("label-txtRadios") 
    document.querySelector(txtRadio).classList.remove("label-txtRadios") 
}
function desabilitarRadio(radio, txtRadio){
    document.querySelector(radio).disabled= true;
    document.querySelector(radio).classList.add("label-txtRadios") 
    document.querySelector(txtRadio).classList.add("label-txtRadios") 
}

function stautusRadiosBtn(r1, r2, r3, valor){
    try {
    habilitarTadio("#rd01", "#txt-r01")
    habilitarTadio("#rd02", "#txt-r02")
    habilitarTadio("#rd03", "#txt-r03")
    if(r1==true){ desabilitarRadio("#rd01", "#txt-r01")}
    if(r2==true){ desabilitarRadio("#rd02", "#txt-r02")}
    if(r3==true){ desabilitarRadio("#rd02", "#txt-r03")}
    } catch (err) {}
}///////////// STATUS BOTÕES DE RADIO FINAL

///////////// CONFIGS LISTA DE TAMANHOS
function configsPrestsSel(method){
    switch(method){   
        case 0: 
        try{stautusRadiosBtn(false, true, true); radioTrue("#rd01");  desabilitarRadio("#rd03", "#txt-r03");}catch(e){}; wDOC=2970; hDOC=2030;  hDoCfinal = 2030;  wDOCfinal= 3500; cartaoADD=false; 
        break;     
        case 1: try{ stautusRadiosBtn(true,false,false) ; radioTrue("#rd03");}catch(e){}; wDOC=3030; hDOC=2100; hDoCfinal = 3040;  wDOCfinal= 3500; break; 
        case 2: try{ stautusRadiosBtn(false,false, false); radioTrue("#rd01");}catch(e){}; wDOC=4000; hDOC=2030; hDoCfinal = 2030;  wDOCfinal= 4350+160; cartaoADD=false; break; 
        case 3: try{ stautusRadiosBtn(false,false, false); radioTrue("#rd01");}catch(e){}; wDOC=6000; hDOC=2030; hDoCfinal = 2030;  wDOCfinal= 6350+160; cartaoADD=false; break; 
        case 4: try{stautusRadiosBtn(true,false,  false); radioTrue("#rd02");}catch(e){}; wDOC=5000; hDOC=3040; hDoCfinal = 3040;  wDOCfinal= 5000+160; cartaoADD=false; break; 
        case 5: try{ stautusRadiosBtn(true,false,  false); radioTrue("#rd03");}catch(e){}; wDOC=6000; hDOC=3040; hDoCfinal = 3040;  wDOCfinal= 6350+160; cartaoADD=false; break; 
    };
}

function  informõesCapa(){
    const lnfCcapa = document.querySelector('#statusonfig')
    lnfCcapa.innerHTML= `Capa: ${parseFloat( larguraDoc*2.54/resol).toFixed(1)} x ${parseFloat(alturaDoc*2.54/resol).toFixed(1)} cm • Dorso: ${ parseFloat( wDorso*2.54/resol).toFixed(1)} cm`;
}

async function guiasConfigurar(dorso,marg){
    if(luminosidade<170){verm=255,verde=255,azul=255}else{verm=53, verde=82,azul=147};
    await app.batchPlay([{"_obj":"clearAllGuides"}, {"_obj":"newGuideLayout","guideLayout":{"$GdCA":0,"$GdCB":azul,"$GdCG":verde,"$GdCR":verm,"_obj":"guideLayout","colCount":2,"colGutter":{"_unit":"pixelsUnit","_value":dorso},"marginBottom":{"_unit":"pixelsUnit","_value":marg},"marginLeft":{"_unit":"pixelsUnit","_value":marg},"marginRight":{"_unit":"pixelsUnit","_value":marg},"marginTop":{"_unit":"pixelsUnit","_value":marg}},"guideTarget":{"_enum":"guideTarget","_value":"guideTargetCanvas"},"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}}]);
}

///// FUNC REDIMENSIONA CAMADA NAS BORDAS VERTICAIS
async  function enquadraBordas(){
    try {
        const docWidth =   await app.activeDocument.width
        const bounds = app.activeDocument.activeLayers[0].bounds;                
        const w = bounds.right-bounds.left;        
        f1 = ((docWidth/w)*100);  
        await app.activeDocument.layers[0].scale(f1, f1);
    } catch (err) {alert(err); console.log(err) }
}

async function pontoInicialConfig(){
    try {
        await core.executeAsModal(async () => {
            await app.batchPlay([{"_obj":"flattenImage"}]);
            await BGconvertoCMD("Capa_Config");
        })
    } catch (e) {alert(e) }
}

async function wCapaConfig(){
    try {
        await core.executeAsModal(async () => {
            paginas = qpages.value
            wDorso = Number (paginas*2*gramatura)/2.54*resol; 
            larguraDoc = wDOC+ wDorso;  alturaDoc= hDOC; 
            await app.batchPlay([ {"_obj":"canvasSize","horizontal":{"_enum":"horizontalLocation","_value":"center"},"width":{"_unit":"pixelsUnit","_value":larguraDoc}} ]);
            await guiasConfigurar(wDorso,50);
            await enquadraBordas();
            await capaMaskConfigs();
            informõesCapa();  
            resetarHistorico();
        },{"interactive": true}); 
        } catch (e) {alert(e) }
    }

    ////// CARREGAR JALELA PROGESS
    async function janCarregando() {
        fetch('pags/carregaDLG.html').then(response => response.text()).then(data => {
            const dlg = document.querySelector("#process1DLG");
            dlg.show({ title: "Processing", titleVisibility:"hide", resize: "both", size: { width: 230, height: 50} })
            dlg.innerHTML = data;
        });
    }

    /////// ALINHA CAPA SIZE
    async function alinarCapaSize(){
        await ADDselecaoDOC();
        await alignCamada(1, false);
        await alignCamada(4, true);
        await app.activeDocument.layers[0].translate(0, -150);
        await selectCamada("Capa_Config");
    }

    ///// FUNÇÃO APLICAR COR AO LOGO

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
    };

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

    function ampliarDiminue(){
        const icone1 = document.getElementById("icone-1");
        const icone2 = document.getElementById("icone-2");
        const zoom = document.getElementById("icone-zoom");
        zoom.addEventListener("click", function() {
        if (icone1.style.display === "none") {icone1.style.display = "block"; icone2.style.display = "none";  zoomLogoADD(false)}
            else {icone1.style.display = "none"; icone2.style.display = "block"; zoomLogoADD(true)};
        });
    };

    async function resetarHistorico(){
        await app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}]);
    }

    function mostrarOcultarLogo(){
        cheLogo = document.getElementById("cheLogo")
        cheLogo.addEventListener("click", function(){
            core.executeAsModal(async () => { 
            app.activeDocument.layers.forEach(camada=> {
            if (camada.name == "Icon_Dorso") { if (cheLogo.checked==true) {camada.opacity=100; LogoCapa = "Logo Inserido" ;}  
            else {camada.opacity=0};  resetarHistorico() ;LogoCapa = "Sem Logo" } }) })
        })
    }

    function checarOpçoesRadio(){
        radioChecked = null;
        radios = document.getElementsByClassName("radiobtnFB");
        radioBtns = Array.from(radios);
        radioBtns.forEach(function(btn) { if (btn.checked) { radioChecked = btn; }});
        if(radioChecked.innerText==="Papel 20"){hDoCfinal = 2030}
        else if(radioChecked.innerText==="Papel 25"){hDoCfinal = 2540}   
        else if(radioChecked.innerText==="Papel 30"){hDoCfinal = 3040}
    }

    ///// INSER CARTÃO
    async function inserirCartao(){
        try {
            const token = localStorage.getItem("persistentFolder");
            thePersistentFolder = await fs.getEntryForPersistentToken(token);
            const cartao = fs.createSessionToken(thePersistentFolder);
            await app.batchPlay([{"_obj":"placeEvent","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"linked":true,"null":{"_kind":"local","_path": cartao},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":0.0},"vertical":{"_unit":"pixelsUnit","_value":0.0}},"replaceLayer":{"_obj":"placeEvent","from":{"_id":4,"_ref":"layer"},"to":{"_id":10,"_ref":"layer"}}}], {});
        }
        catch (err) {
             //////AAD SHAPE CARTÃO N ENCONTRADO ::::::::::::::
            await ADDselecaoShapes( 853.2283464566929, 5.3858267716535435, 896.8818897637796, 620.503937007874, "CartTemplats", 0);
            await solidColorCamada(210,210,210);
            await app.batchPlay([{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}, {"_obj":"select","_target":[{"_property":"workPath","_ref":"path"}]}, {"_obj":"delete","_target":[{"_property":"workPath","_ref":"path"}]}], {});
            await app.batchPlay([{"_obj":"flattenImage"}], {});
        }
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
        },{"interactive": true});
    };

    ////// CARREGAR CARTÃO
    async function outroLogoFolder(){
        core.executeAsModal(async () => {
        const directory = await fs.getFileForOpening(); 
        const persistentTokenLogo = await fs.createPersistentToken(directory);   
        localStorage.setItem("persistentLogo", persistentTokenLogo);
        },{"interactive": true});
    };

     ///// FUNC ADD LOGO LOJA DORSO
    async function adicionarlogoLoja(){
        const mudarLogo = document.querySelector("#selectLogo").checked
        ////// SE O CHECKBOX [selectLogo] FOR FOLSO, BUSCAR LOGO PADRÃO DA PASTA DO PLUGIN
        if( mudarLogo===false){
            pluginFolder = await fs.getPluginFolder(); 
            localLogo = await pluginFolder.getEntry("icons/Icon_Dorso.svg"); 
            token = fs.createSessionToken(localLogo);
        }
        else{
            ////// SE O CHECKBOX [selectLogo] FOR MARCADO, BUSCAR LOGO INSERIDO NA FUNÇÃO [outroLogoFolder()]
            novoLogo = localStorage.getItem("persistentLogo");
            thePersistentFolder = await fs.getEntryForPersistentToken(novoLogo);
            token = fs.createSessionToken(thePersistentFolder); 
        };

        await app.batchPlay( [{"_obj":"placeEvent","antiAlias":true,"freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"linked":true,"null":{"_kind":"local","_path":token},"offset":{"_obj":"offset","horizontal":{"_unit":"distanceUnit","_value":0.0},"vertical":{"_unit":"distanceUnit","_value":0.0}}}], { synchronousExecution: false, });
        if(luminosidadeL<128){
            await app.batchPlay([{"_obj":"invert"},{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}, {"_obj":"newPlacedLayer"}], {});
        }
        
        /////// REDIMENSIONAR NO TAMANHO PADRÃO
        const largura = 68
        const camada = app.activeDocument.layers[0];
        const width = camada.bounds.height;
        const newSize = largura * 1 * 100 / width;
        await camada.scale(newSize, newSize);
        camada.name="Icon_Dorso";
    }; ///// FUNC ADD LOGO LOJA DORSO FINAL
    ////////////XXXXXXXXXXXXXXXXXXXXXXXXXXX

    //////ENCURTAR A LEGENDA
    function encurtaLegenda(path) {
        const dirs = path.split("/");
        if (dirs.length > 3) { dirs.splice(2, dirs.length - 3, "..");}; return dirs.join("/");
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

    ////// OBTER LUMINOSIDADE
    async function GetLuminosidade(){
        gethDOC= app.activeDocument.height;
        getwDOC = app.activeDocument.width
        await luminVincado(); await luminLogo();
    }
    async function luminVincado(){
         try {
            await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":90},"left":{"_unit":"pixelsUnit","_value":Number(getwDOC)/2-50},"right":{"_unit":"pixelsUnit","_value":Number(getwDOC)/2+50},"top":{"_unit":"pixelsUnit","_value":0}}}], { synchronousExecution: false, });
            const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'histogram' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
            lumin =  result[0].histogram;   
            luminosidade =  lumin.indexOf(Math.max(...lumin));  
            await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}], { synchronousExecution: false, });
         } catch (error) {alert(error)}
    }
    async function luminLogo(){
          try {
            await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":Number(gethDOC)-115},"left":{"_unit":"pixelsUnit","_value":Number(getwDOC)/2-50},"right":{"_unit":"pixelsUnit","_value":Number(getwDOC)/2+50},"top":{"_unit":"pixelsUnit","_value":Number(gethDOC)-450}}}], { synchronousExecution: false, });
            const resultL = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'histogram' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
            luminL =  resultL[0].histogram;
            luminosidadeL=  luminL.indexOf(Math.max(...luminL));
            await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}], { synchronousExecution: false, });
          } catch (error) {alert(error)}
    }
    //////////////////////////////
    ///////:::::::::::::::::::::::::
    //////////////////////////////////
    async function mcvincarPG01(method){
        try {
            ///OBTER O PRIMEIRO ITEM DA LISTA DE ARQUVOS E ADD VINCO (PRIMEIRA LAMINA)
            const PagsVinco = await fs.getEntryWithUrl(`${path}/PAG_001.jpg`);
            await app.open(PagsVinco);  await GetLuminosidade(); await  vincadoTarget(4, method);
            await app.batchPlay( [{"_obj":"flattenImage"}, {"_obj":"save"}, {"_obj":"close","documentID":138,"forceNotify":true}], {});
        } catch (err) {}
    }
    //////// XXXXXXXXXXXXXX

/////////////////////////////////////////////////////////////////////////////
///// FUNÇÃO PARA PREENCHER A TABELA COM ESSES DADOS
async function preencherTabela() {
try {
    const tabelaFB = document.querySelector('#tabelaFB');    
    obterDadosTabela.forEach( (pagina, indice) => {
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
        tabelaFB.appendChild(linha);
    });
    document.querySelector('#sevicoLegenda').textContent = `Entrada: ${data} / Capa para ${paginas*2} Páginas • ${LogoCapa}\n• Loja: ${Loja} • Cliente: ${cliente}`;
} catch (err) { alert(err);}
}
/////////:::::::::::::::::::

////// CARREGAR JALELA PROGESS
async function janTabelaNomes() {
    try {
        fetch('html/ftTabala.html').then(response => response.text()).then(data3 => {
            const dlg3 = document.querySelector("#tabelaNomes");
            dlg3.uxpShowModal({ title: "Nomencalura atualizado!", titleVisibility:"show", resize: "both", size: { width: 400}})
            dlg3.innerHTML = data3;
            preencherTabela();
            document.getElementById("closeTabela").addEventListener("click", async function(){
                dlgTabelaClose();
            });
           async function dlgTabelaClose(){
                dlgTabelaClose=true;
                document.querySelector("#tabelaNomes").close('OK');
                //// CONFIGURA SCRIPTS EXTERNOS PARA EXIBIR O DIRETÓRIO ATUAL
                await exploradorDiretorio(caminho); 
                // EXECUTARE O SCRIPT VBS SCRIPTS EXTERNO PARA EXIBIR O DIRETÓRIO ATUAL
                shell.openPath(`${dirPlugin}/suport/CloseExplorer.vbs`)
                shell.openPath(`${Usuario}/AppData/Roaming/tempScripts/explorarDir.vbs`);
            }
            focarJanela("#dlgfocus");
            document.addEventListener('keydown', closeTabela);
            async function closeTabela(e) {
                if(dlgTabelaClose ===false){return}
                if (e.keyCode === 13) {dlgTabelaClose()}
            }
        });

    } catch (error) {alert(error)}
}

//////////////////////////////////////////////////
////// CONFIGS DA JANELA PREFERENCIAS
function dlgPreferencias() {
    document.querySelector("#dlgCartconfig").uxpShowModal({ title: "Preferências", resize: "both", size: { width:280, height: 60 } })
     configsPreferences();
};
//////************* 

function configsPreferences(){
    dlgConfig =document.querySelector("#dlgCartconfig")
    dlgConfig.innerHTML= `<div class="D1aimg_main"> <div class="D1aimg_Container"> <h1 style="color: #f4f2f2;">Preferências</h1> <sp-divider></sp-divider> <div style="width: 100%; height: 210px; border: 1px solid rgb(65, 65, 65); margin-top: 5px; padding: 5px;"> <div style="width: 200px; display: flex; flex-direction: column; margin: 2px 10px; align-items: center; justify-content: center;"> <div style="display: flex; align-items: center; justify-content: center;  transform: translateX(-50px); "> <sp-checkbox  id="insImagem" size="s"  style="width: 20px;" ><label class="sp-checkbox-txt"  style="margin: 0px;">Inseir Imagem</label></sp-checkbox > <div class="btnMedio elem-Desabilitado" id="btnBuscar" style="width: 70px; margin: 5px; transform: translateX(70px);">Diretório</div> </div> <label id="caminho" style="color: #a8a8a8; font-size: 11px; transform: translateX(-10px); ">C://Diretotio..........</label> </div> <sp-divider style=" transform: translateY(5px); "></sp-divider> <div style="display: flex; flex-direction: column; transform: translateY(10px); margin: 2px 8px"> <sp-checkbox  id="addMcVinco" size="s"  style="width: 20px;" ><label class="sp-checkbox-txt"  style="margin: 0px;">Adiciona marcas do vinco</label></sp-checkbox > <input type="number" value="30" id="McVincoSize" style="width: 30px; display: flex; transform: translate(140px, -30px);"> <sp-checkbox  id="exibTabela" size="s"  style=" position: absolute; top: 163px;" ><label class="sp-checkbox-txt"  style="margin: 0px;">Exibir a Tabela no final </label></sp-checkbox > </div> <sp-divider style=" transform: translateY(-7px); "></sp-divider> <sp-checkbox  id="desAddLogo" size="s"  style=" position: absolute; top: 193px; left: 46px;" ><label class="sp-checkbox-txt"  style="margin: 0px;">Habiliitar adiçao do Logotipo</label></sp-checkbox > <div style="display: flex; align-items: center; justify-content: center;  transform: translate(-35px, 16px); "> <sp-checkbox  disabled id="selectLogo" size="s"  style="width: 20px;" >Selecionar logo</sp-checkbox > <div class="btnMedio elem-Desabilitado" id="btnBuslogo" style="width: 50px; margin: 5px; transform: translateX(76px);">Buscar</div> </div> </div> <sp-divider style=" width: 200px; transform: translateY(-30px); "></sp-divider> <div style="display: flex; position: absolute; top: 255px; align-items: center;"> <label class="sp-checkbox-txt"  style="margin: 0px;">Gramatura</label> <input type="text" value="0.05" id="gramatura" style="width: 40px; height: 21px; padding: 2px; margin: 0px;"> <label class="sp-checkbox-txt"  style="margin-left: 7px;">cm</label> </div> </div> </div> <div style="width: 100%; height: 100%; display: flex; align-items: center; margin-top: 5px; border: 1px solid #474747; padding: 10px; justify-content: center; border-radius: 0 0 7px 7px; background-color: #4e4d4d;"> <div class="btnMedio" id="D1btnFec" style="width: 70px; margin: 5px;">Sair</div> <div class="btnMedio" id="D1btnOK" style="width: 70px; margin: 5px;">Salvar</div> </div> </div> </div> `
        try {
        const caminho = localStorage.getItem("localCartao");
        const truncatedPath = encurtaLegenda(caminho);
        document.getElementById("caminho").innerHTML= truncatedPath; 
        } catch (e) { document.getElementById("caminho").innerHTML= "C://Diretotio.........."}


        /////// CARREGA  OS DADOS DO LOCALSTORAGE
       dadosRecuperados = localStorage.getItem('D1DadosSave');
        if(dadosRecuperados) {
            const dadosObjeto = JSON.parse(dadosRecuperados);
            document.querySelector("#insImagem" ).checked = dadosObjeto.dados1;
            document.querySelector("#addMcVinco").checked = dadosObjeto.dados2;
            document.querySelector("#exibTabela").checked = dadosObjeto.dados3;
            document.querySelector("#desAddLogo").checked = dadosObjeto.dados4;
            document.querySelector("#McVincoSize").value = dadosObjeto.dados5;
            document.querySelector("#selectLogo").checked = dadosObjeto.dados6
            document.querySelector("#gramatura").value= dadosObjeto.dados7;
        }
        ////////:::::::::::::::::::
        
        bt0001 = document.getElementById("btnBuscar")
        if (document.getElementById("insImagem").checked === false) { bt0001.classList.add('elem-Desabilitado');}
        else { bt0001.classList.remove('elem-Desabilitado'); cartaoADD = true};
        statusConfigsADDLogo()
        
        document.getElementById("insImagem").addEventListener("click", function(){
        if (document.getElementById("insImagem").checked === false) { bt0001.classList.add('elem-Desabilitado');}
            else { bt0001.classList.remove('elem-Desabilitado'); cartaoADD = true};
        });

        document.getElementById("selectLogo").addEventListener("click", function(){ statusConfigsADDLogo() });
        document.getElementById("desAddLogo").addEventListener("click", async function(){ statusConfigsADDLogo()});
        document.getElementById("btnBuslogo").addEventListener("click", function(){outroLogoFolder()});
                   
        bt0001.addEventListener("click", function(){  cartaoFolder();  });
        document.getElementById("D1btnOK").addEventListener("click", async function(){ 
            document.querySelector("#dlgCartconfig").close('OK');  SalvarDados();
             ////// REDIMENSINA A CAPA COM BASE NO VALOR DA GRAMATURA;
             gramaturaDados();  gramaturaDados(); wCapaConfig()
        });
        document.getElementById("D1btnFec").addEventListener("click", function(){ 
            document.querySelector("#dlgCartconfig").close('OK');
        });

        document.querySelector("#gramatura").value= gramaturaDados()
    }//////CONFIGS DA JANELA PREFERENCIAS FINAL
    ////////:::::::::::::::::::::::::::::::::::::::::::::::::::::


    function gramaturaDados(){
        const dadosRecuperados = localStorage.getItem('D1DadosSave');
        dadosObjeto = JSON.parse(dadosRecuperados);
        if(dadosObjeto!==null) { gramatura = dadosObjeto.dados7.replace(/,/g, "."); }
        else{ gramatura = parseFloat(0.06).toFixed(2)}
        return gramatura;
    };


    /////// SALVAR  DINAMICAMENTE OS DADOS
    function SalvarDados(){
    const dadosD1 = {
        dados1: document.querySelector("#insImagem" ).checked,
        dados2: document.querySelector("#addMcVinco").checked,
        dados3: document.querySelector("#exibTabela").checked,
        dados4: document.querySelector("#desAddLogo").checked,
        dados5: document.querySelector("#McVincoSize").value,
        dados6: document.querySelector("#selectLogo").checked,
        dados7: document.querySelector("#gramatura").value,
    };
    SalvarDadosDI()
    localStorage.setItem('D1DadosSave', JSON.stringify(dadosD1));
};
///////////////:::::::::::::::::::::::

/////// SALVAR OS VALORES INICIAIS DA GRAMATURA E QT DE PAGINAS
function SalvarDadosDI(){
    const dadosDI = {
        dados02: qpages.value,
        dados03: document.querySelector("#ListPreset").selectedIndex
    };
    localStorage.setItem('InciaisDados', JSON.stringify(dadosDI));
};

/////// ATUALIZA OS STATUS DAS CONFIGURAÇÕES DE LOGO
function statusConfigsADDLogo(){
    try {
        if (document.getElementById("desAddLogo").checked === true) {   
            document.getElementById("cheLogo").checked=true; 
            document.getElementById("cheLogo").disabled=false;
            document.getElementById("cheLogo").classList.remove('label-Desabilitadox');
            document.querySelector("#selectLogo").disabled=false;
            document.querySelector("#btnBuslogo").classList.remove('elem-Desabilitado'); 
            ocultarCamada("Icon_Dorso", true)
        }   
        else { 
            document.getElementById("cheLogo").checked=false; 
            document.getElementById("cheLogo").disabled=true;
            document.getElementById("cheLogo").classList.add('label-Desabilitadox');  
            document.querySelector("#selectLogo").disabled=true;
            document.querySelector("#btnBuslogo").classList.add('elem-Desabilitado'); 
            document.querySelector("#selectLogo").checked=false;
            ocultarCamada("Icon_Dorso", false)
        };
        if (document.getElementById("selectLogo").checked === true)  {
            document.getElementById("btnBuslogo").classList.remove('elem-Desabilitado');
        }  
        else {document.getElementById("btnBuslogo").classList.add('elem-Desabilitado');};
    } catch (err) {}
};///////ATUALIZA OS STATUS DAS CONFIGURAÇÕES DE LOGO FINAL
////////////XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

function enquandrarCapaLogo(m){
    core.executeAsModal(async () => {
        selectCamada(CamadaAjustar);  app.activeDocument.layers[0].translate(0, m);
        selectCamada("Capa_Config");  resetarHistorico();
    });
 }
///////:::::::::::::   

function toggleButton(elementToShow, elementToHide, colorToShow, colorToHide) {
    document.querySelector(elementToShow).classList.add("btnSeel");
    document.querySelector(elementToHide).classList.remove("btnSeel");
    document.querySelector(colorToShow).style.color = "#88f0a0";
    document.querySelector(colorToHide).style.color = "#d4cfcf";
}

//////////RENOEIAR ARQUIVOS DE UM DIRETÓRIO
async function renamePaginas(caminho ){
    try {
        const aFolder = await fs.getEntryWithUrl(caminho);
        const listArquivos = await aFolder.getEntries();
        conteudoA = [];   //// NOMES ORIGINAIS
        conteudoB = [] ;  //// NOVOS NOMES
        conteudoC = [];   //// NÃO RENOMEAR

        for (const paginasDoc of listArquivos) {
            if (paginasDoc.isFile) {
                const nomeArquivo = paginasDoc.name;
                const paginasJPG = nomeArquivo.split(".")[1];
                ////// OBTEM SOMENTE AQUIVOS JPG e DESCARTA O ARQUIVO ATIVO "CAPA"
                if (!app.activeDocument.name.includes(nomeArquivo) &&paginasJPG=="jpg" ) { conteudoA.push(nomeArquivo);}
                if(paginasJPG !=="jpg"){ conteudoC.push(nomeArquivo)}
            }
        };

         // ATUALIZA O ARRAY COM A ORDEM CRESCENTE
        conteudoA.sort(ordemNumerica);
        let cont = 1;
        for (let i = 0; i < conteudoA.length; i++) {
            const arquivo = conteudoA[i];
            /////////////////////////////
            const listaNomes = await aFolder.getEntry(arquivo);
            const decimal = `${cont}`.padStart( 3, "0"); // ADICIONA O Nº DE CASAS 
             await aFolder.renameEntry( listaNomes, `PAG_${decimal}.jpg`, {overwrite: true});
            conteudoB.push(`PAG_${decimal}.jpg`)
            cont++;
        }
    } catch (err) {alert(err)}
};
////////////////////xxxxxxxxxxxxxxxxxx

async function paginaQTDobter(caminho ){
    try {
        const aFolder = await fs.getEntryWithUrl(caminho);
        const listArquivos = await aFolder.getEntries();
        conteudoA = [];   //// NOMES ORIGINAIS
        for (const paginasDoc of listArquivos) {
            if (paginasDoc.isFile) {
                const nomeArquivo = paginasDoc.name;
                const paginasJPG = nomeArquivo.split(".")[1];
                ////// OBTEM SOMENTE AQUIVOS JPG e DESCARTA O ARQUIVO ATIVO "CAPA"
                if (!app.activeDocument.name.includes(nomeArquivo) &&paginasJPG=="jpg" ) { conteudoA.push(nomeArquivo);}
             }
        };
    } catch (err) {alert(err)}
};

/////////////////////////////////////////////////////////////////
////////// SEPARAÇÃO DA CAPAS EM PARTES AJUSTAVEIS
async function corteCapaConfig(){
    try {
       await core.executeAsModal( async() => {
          await app.batchPlay( [{ "_obj": "make", "_target": [ { "_ref": "layerSection" } ], "from": { "_enum": "ordinal", "_ref": "layer", "_value": "targetEnum" }, "name": "Group 1" }]);
          await renomearCamada("Capa_Configx"); await selectCamada("Capa_Config"); 

          await app.batchPlay( [{ "_obj": "copyToLayer"}]); 
          await renomearCamada("Capa_Frente"); 
        //  await stayleCamdadaADD("Sdw-pg-dr");
          await app.batchPlay( [{ "_obj": "copyToLayer"}]); 
          await renomearCamada("Capa_Verso");
       //   await stayleCamdadaADD("Sdw-pg-esq");
          await maskPositions();///////CONFIGURAÇÃO DAS MASCARAS
          await selectCamada("Capa_Config");  

          await app.batchPlay( [  { "_obj": "gaussianBlur", "radius": { "_unit": "pixelsUnit", "_value": 1 } }]); 
          await criarSelecao(0, 0, app.activeDocument.width, app.activeDocument.height);
          await app.batchPlay( [ { "_obj": "make", "at": { "_enum": "channel", "_ref": "channel", "_value": "mask" }, "new": { "_class": "channel" }, "using": { "_enum": "userMaskEnabled", "_value": "revealSelection" } }]); 
        
          await renomearCamada("Dorso");  await dorsoColorADD();
                      
          await app.batchPlay( [{ "_obj": "move", "_target": [ { "_enum": "ordinal", "_ref": "layer", "_value": "targetEnum" } ], "to": { "_enum": "ordinal", "_ref": "layer", "_value": "back" } }]); 
          await app.batchPlay( [{ "_obj": "move", "_target": [ { "_enum": "ordinal", "_ref": "layer", "_value": "targetEnum" } ], "to": { "_enum": "ordinal", "_ref": "layer", "_value": "back" } }]); 
          await selectCamada("Capa_Configx");  await renomearCamada("Capa_Config");
      });
   } catch (error) {alert(error) }
};


//await capaMaskConfigs();
async function capaMaskConfigs(){
    await dorsoConfigus();
    s1("#ckMtrGuias").checked=true;
   try {
        await selectCamada("Capa_Frente");
        await app.batchPlay( [{ "_obj": "delete", "_target": [ { "_enum": "channel", "_ref": "channel", "_value": "mask" } ] }]); 

        await selectCamada("Capa_Verso");
        await app.batchPlay( [{ "_obj": "delete", "_target": [ { "_enum": "channel", "_ref": "channel", "_value": "mask" } ] }]); 

        await selectCamada("Dorso");
        await app.batchPlay( [{ "_obj": "delete", "_target": [ { "_enum": "channel", "_ref": "channel", "_value": "mask" } ] }]); 

        await  maskPositions();
        await selectCamada("Capa_Config");
   } catch (error) {alert(error) }
};

///////CONFIGURAÇÃO DAS MASCARAS
async function maskPositions(){
           await maskUpdatecorte("Capa_Verso", "capaVerso");
           await maskUpdatecorte("Capa_Frente", "capaFrente");
           await maskUpdatecorte("Dorso", "capaDorso");

           async function maskUpdatecorte(camada, selecaox){
                await selectCamada(camada); await selecaoCortes(selecaox);
                await app.batchPlay( [
                    { "_obj": "make", "at": { "_enum": "channel", "_ref": "channel", "_value": "mask" }, "new": { "_class": "channel" }, "using": { "_enum": "userMaskEnabled", "_value": "revealSelection" } }, 
                    { "_obj": "set", "_target": [ { "_enum": "ordinal", "_ref": "layer", "_value": "targetEnum" } ], "to": { "_obj": "layer", "userMaskLinked": false } }
                ]);
            };
};


////// OBTER LARGURA E ALTURA SA CAMADA
async function selecaoCortes(myGuid){
    switch (myGuid) {
        case "capaVerso":   await criarSelecao(0, 0, await positionGuids(1) , app.activeDocument.height); break;
        case "capaFrente":  await criarSelecao(0, await positionGuids(2), app.activeDocument.width, app.activeDocument.height); break;
        case "capaDorso":   await criarSelecao(0, 0, app.activeDocument.width, app.activeDocument.height); break;
    };
};

async function positionGuids(guia){
  const result = await app.batchPlay( [ { _obj: "multiGet", _target: [ { _ref: "document", _name: app.activeDocument.name } ], extendedReference: [ [ "position" ], { _obj: "guide", index: 1, count: -1 } ] } ], {} );
  const guias= result[0].list[guia].position._value;
  return guias;
};

///////// OBTEM A COR DO  BG ORIGINAL E APLICAR NOVO SOLIDO
async function dorsoColorADD(){
    const posx = await positionGuids(1)-75;
    const posy = Number(app.activeDocument.height)/2;
    const colorSamplerList = await app.batchPlay( [ { _obj:"colorSampler", _target:{_ref: "document",_enum: "ordinal",_value: "targetEnum"}, samplePoint: { horizontal: posx, vertical: posy } }],{});

    const red=colorSamplerList[0].colorSampler.red;
    const green=colorSamplerList[0].colorSampler.grain;
    const blue=colorSamplerList[0].colorSampler.blue;
    await solidColorCamada( red, green, blue );
};



async function dorsoConfigus(){
    desfocar = s1("#borrarDorso").value;
    await borarDorso(desfocar );
    s1("#borrarDorso").addEventListener("change", async (func) => { await borarDorso(desfocar );}) 

    async function borarDorso(desfocar){
        await core.executeAsModal( async() => {
            desfocar = s1("#borrarDorso").value;
            await selectCamada("Dorso")
            await app.batchPlay( [{ "_obj": "set", "_target": [ { "_index": 1, "_ref": "filterFX" }, { "_enum": "ordinal", "_ref": "layer", "_value": "targetEnum" } ], "filterFX": { "_obj": "filterFX", "filter": { "_obj": "gaussianBlur", "radius": { "_unit": "pixelsUnit", "_value": desfocar  } } } } ]);
            await selectCamada("Capa_Config")
        });
   };

    ////////CHECKBOX  OP~TAR POR DPORSO BORRADO
    s1("#ckdborrado").addEventListener("click", async () => {
        await core.executeAsModal( async() => {
            if( s1("#ckdborrado").checked==true){
                s1("#borrarDorso").disabled=false 
                await app.batchPlay( [  { "_obj": "show", "null": [ { "_name": "Dorso", "_ref": "layer" } ] } ]); 
            }
            else{
                s1("#borrarDorso").disabled=true 
                await app.batchPlay( [  { "_obj": "hide", "null": [ { "_name": "Dorso", "_ref": "layer" } ] } ]); 
            }
        })
    })
};


//   alert(app.activeDocument.guides[1].coordinate)
//   alert(app.activeDocument.guides[2].coordinate)

