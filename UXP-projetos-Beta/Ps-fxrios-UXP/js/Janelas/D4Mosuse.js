    //////////////////////////////////////////////////////////////////
    shapStamp = false;
    const inciarD4 = document.querySelector("#serv-btn7");
    inciarD4.addEventListener("click", async (event) => {
        if (event.altKey || event.metaKey) { await docEstampa(496.1, 609.5, "Mouise Pad")} 
        else { process = true; await incialConfigs() ;}
    });

    ///FUNCTION incialConfigs INCIAR
    async function incialConfigs() {
            if(app.documents.length==0){  const f = await fs.getFileForOpening(); if(f){await core.executeAsModal(() => app.open(f));} if(f==null){ return};}
            StampConfigP1();
            doc= app.activeDocument;
            resol = app.activeDocument.resolution;
            gethDOC = app.activeDocument.height;
            getwDOC = app.activeDocument.width;
            shapStamp = true;
    };
    //////:::::::::::::::::::
    /////////////// CRIAÇÃO CONFIG INICAIL
     async function StampConfigP1(){
            estampar= app.activeDocument.name.match (/^\[OK! \]/) || app.activeDocument.name.match (/^\[Amostra\]/)  ;    
            if(estampar){
                process =false;
                txtMsg  = `"${app.activeDocument.name}" já foi processado!\nVocê deseja abrir um outro?`
                confiramar(txtMsg);
                document.querySelector("#confirm_btn2").addEventListener("click", async () => {
                dlg.close('OK'); 
                const f = await fs.getFileForOpening(); if(f){await core.executeAsModal(() => app.open(f));} if(f==null){ return};
                estampar= app.activeDocument.name.match (/^\[OK! \]/) || app.activeDocument.name.match (/^\[Amostra\]/) ;    
                if(estampar){alertar(`"${app.activeDocument.name}" já foi processado!\nAdicione um documento válido!`)}else{exeConfigP1()}
                });
            };
        if(process == false){return}else{exeConfigP1()};

        async function exeConfigP1(){
            await refeshDocumento();
           progressDLG("Aquarde Processing . . ."); 
            function evento() { setTimeout(() =>configurar());} setTimeout(evento, 100);
            //////////CONFIGURAÇÃO INICIAL 
            async function configurar() {
                await core.executeAsModal(async () => {
                    try {
                        docMatriz = app.activeDocument.id;
                        diretorioDoc = app.activeDocument.path.replace(/\\[^\\]*$/, "");
                        arte = "Mouse Pad";
                        criarPasta(`${Usuario}/AppData/Roaming`, "temp_stamps");
                        //////// AÇÕES DE EVENTOS AQUI!
                        await app.batchPlay([{"_obj":"flattenImage"}, {"_obj":"reset","_target":[{"_property":"colors","_ref":"color"}]},], {});
                        if(gethDOC>getwDOC){}
                        else{
                            await configMoldes(1651, 1903, 1651, 1903, "SP-Coração1", "MD-CONFG-A" );
                            app.activeDocument.activeHistoryState = app.activeDocument.historyStates [0];
                        };

                        gethDOC = app.activeDocument.height;
                        getwDOC = app.activeDocument.width;

                        if(gethDOC>getwDOC){await configMoldes(1693, 1378, 1693, 1378, "Pad_Mouse_Retang", "MD-CONFG-B" );}
                        else{await configMoldes(1378, 1693, 1378, 1693, "Pad_Mouse_Retang", "MD-CONFG-B" );}
                        await app.batchPlay([ {"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}], {});
                        gethDOC = app.activeDocument.height -118; getwDOC = app.activeDocument.width -118;
                        sanapBase ="MD-CONFG-B";
                       
                        await ZoomDOC(0); 
                        await document.querySelector('#processServic').close('OK');
                        await dlgMousePd();
                        await legendaDados();
                    } catch (err) {alert(err)}
                    ////////////////////////
               },{"interactive": true});
            //////////////::::::::::::::
            };          
        };
    };
    ////////::::::::::::::::::::


  
     /////////////// CRIAÇÃO DA ESTAMPA DE IMPRESSÃO
     async function StampConfigP2(){
        await core.executeAsModal(async () => {
            try {
                await selectCamada("Conteudo");
                app.activeDocument.activeLayers[0].scale(-100, 100);
                
                const D4r1 = document.querySelector("#D4-r1");
                const D4ck2 = document.querySelector("#D4-ck2");
                if(D4r1.checked==true){modelo="Padrão"}else{modelo="Coração"}

                if(gethDOC<getwDOC){ app.activeDocument.rotate(-90);}
                anchorPos = require('photoshop').constants.AnchorPosition;

                bounds = app.activeDocument.activeLayers[0].bounds;  
                await app.batchPlay([
                    {"_obj":"select","_target":[{"_name":"AjustColor","_ref":"layer"}],"makeVisible":false,"selectionModifier":{"_enum":"selectionModifierType","_value":"addToSelectionContinuous"}},
                    {"_obj":"clearAllGuides"},{"_obj":"newPlacedLayer"}
                ]);
    
               app.activeDocument.resizeCanvas(1654, 2323, anchorPos.TOPCENTER);
               bounds = app.activeDocument.activeLayers[0].bounds;  
                await app.batchPlay([ {"_obj":"set","_target":[{"_property":"workPath","_ref":"path"}],"to":{"_obj":"customShape","bottom":{"_unit":"distanceUnit","_value":-0.36},"keyOriginType":9,"left":{"_unit":"distanceUnit","_value":-0.72},"name":"Pontilhado","right":{"_unit":"distanceUnit","_value":609.48},"top":{"_unit":"distanceUnit","_value":-0.72}}}])
                await solidColorCamada(0,0,0);
               
                app.activeDocument.activeLayers[0].translate(0, bounds.bottom+23);
                await app.batchPlay([{"_obj":"flattenImage"}]);
    
                await ADDselecaoShapes(79, 0, 184, 0, "IconMpades", 1);
                await solidColorCamada(0,0,0);
    
                if(document.querySelector("#D4-r1" ).checked==true){
                 app.activeDocument.activeLayers[0].translate(bounds.left, bounds.bottom+42); 
                }
                else{app.activeDocument.activeLayers[0].translate(bounds.left+42, bounds.bottom+42); };
    
                await legendaDados();
                bounds = app.activeDocument.activeLayers[0].bounds;  
                legenda = `Mouse Pade [ ${modelo} ]: • Loja: ${Loja}  • Cliente: ${cliente}`;
                xPosition= bounds.left+84; yPosition = bounds.bottom-19;
                await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 22, position: {x: xPosition, y: yPosition}, fontName: "Arial"});
                await app.batchPlay([{"_obj":"flattenImage"}]);

                ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                await sequenciaSave(`[OK! ]-Mouse Pad-${modelo}.png`, `[OK! ]-Mouse Pad-${modelo} 1.png`);
                await estampasSave(estampaName); ////// NOME OBTDO DA FUNÇÃO ANTERIOR.
                if(D4ck2.checked==true){ await moveOrigArtes()};
           
                await app.batchPlay([
                    {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":estampaName},
                    {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                ]);
                await ZoomDOC(0); //await ZoomDOC(1);
                await document.querySelector('#processServic').close('OK');
              
            } catch (err) {alert(err)  }
        },{"interactive": true});
     };

    ////////::::::::::::::::::::
    /////////////// CRIAÇÃO DE MAQUETE 
    async function StampConfigP3(){
            try {
                await core.executeAsModal(async () => {
                    const D4r1 = document.querySelector("#D4-r1");
                    const D4ck1 = document.querySelector("#D4-ck1");
                    const D4ck2= document.querySelector("#D4-ck2");
                    if(D4r1.checked==true){ modelo="Padrão" } else{ modelo="Coração" };
                    bot= gethDOC+59; left= 54;  righ= getwDOC+59;  top= 59;

                    await app.batchPlay([
                        {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":"Maquete"},
                        {"_obj":"select","_target":[{"_name":"Conteudo","_ref":"layer"}],"layerID":[15],"makeVisible":false}, {"_obj":"delete","_target":[{"_enum":"channel","_ref":"channel","_value":"mask"}]},
                        {"_obj":"make","_target":[{"_ref":"slice"}],"using":{"_obj":"slice","at":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":bot},"left":{"_unit":"pixelsUnit","_value":left},"right":{"_unit":"pixelsUnit","_value":righ},"top":{"_unit":"pixelsUnit","_value":top}},"type":{"_enum":"sliceType","_value":"user"}}},
                    ]);
                    await saveThumbSTP();
                    await importMokups("{mcp-&002}.psd");

                    if(D4r1.checked===true){
                        await selectCamada("Mouse_ret");
                        await app.batchPlay([{"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","opacity":{"_unit":"percentUnit","_value":100.0}}}]);
                        if(gethDOC<getwDOC){ await selectCamada("Frente_rt")}
                        else{await selectCamada("Frente_rtv")}
                     }
                    else{
                        await selectCamada("Mouse_cor");
                        await app.batchPlay([{"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","opacity":{"_unit":"percentUnit","_value":100.0}}}]);
                        await selectCamada("Frente_cr");
                    };
                  
                    const dirTemplates = `${Usuario}/AppData/Roaming/temp_stamps/images/`;
                    try {await carregThumbSTP(`${dirTemplates}thumbSTP_03.jpg` );}catch (e){};
                    try {await carregThumbSTP(`${dirTemplates}thumbSTP_03.png`);}catch (e){};

                    await app.batchPlay([
                        {"_obj":"flattenImage"}, {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, 
                        {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                    ]);
    
                    legenda = `• Mouse Pade [ ${modelo}] • Loja: ${Loja}  • Cliente: ${cliente}`;
                    await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 15, position: {x: 27, y: 660}, fontName: "Arial"});
                    await app.batchPlay([{"_obj":"flattenImage"}]);

                    ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                    docMatriz = app.activeDocument.id
                    await sequenciaSave(`[Amostra] MPad [${modelo}].png`, `[Amostra] MPad [${modelo}] 1.png`);
                    await estampasSave(estampaName);

                    await app.batchPlay([
                        {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":estampaName},
                        {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                    ]);
                    await ZoomDOC(0); await ZoomDOC(1);
                    await document.querySelector('#processServic').close('OK');

                },{"interactive": true});
            } catch (err) {};
       };
    ////////::::::::::::::::::::
        
     //////// TODAS AS FUNÇÕES AQUI! ::::::::::::
    async function execonfigsD4(){
        try {
            ///////// IMGEM TEMA DA JANELA EM FORMAR CODIFICADO
            fetch('icons/B64PNG/BMouse.rtf').then(response => response.text()).then(imgB64 => {
                document.querySelector("#imgBase2").src=imgB64;
             });
            ///////////:::::::::::::::::::::
            
            /////// CARREGA  OS DADOS DO LOCALSTORAGE
            const dadosRecuperados = localStorage.getItem('d4DadosSave');
            if(dadosRecuperados) {
                    const dadosObjeto = JSON.parse(dadosRecuperados);
                    document.querySelector("#D4-r1"  ).checked = dadosObjeto.dados1;
                    document.querySelector("#D4-r2"  ).checked = dadosObjeto.dados2;
                    document.querySelector("#D4-ck2").checked = dadosObjeto.dados3;
                    document.querySelector("#D4-ck3").checked = dadosObjeto.dados4;
                    document.querySelector("#D4-ck5").checked = dadosObjeto.dados5;
            }
            ////////:::::::::::::::::::::::::::::::::::::::::::::::
    
            ////////////CONFIGS SISTEMA DE ABAS
            document.querySelector("#d4-btn1").classList.add('d4selecionado');
            const D4Btns = document.getElementsByClassName("d4-btAbas");
            const D4Abas = document.getElementsByClassName("d4-Abas");
            const D4Btn = Array.from(D4Btns);
            
            for (let i = 0; i < D4Btn.length; i++) {
                D4Btn[i].addEventListener('click', (event) => {
                    // Esconder todas as abas
                    for (let j = 0; j < D4Abas.length; j++){ D4Abas[j].style.display = 'none';}
                    for (let j = 0; j < D4Btn.length; j++) { D4Btn[j].classList.remove('d4selecionado');}
                    D4Abas[i].style.display = 'block';
                    event.currentTarget.classList.add('d4selecionado');
                });
            };
           ////////::::::::::::::::::::
              ////////OUVINTES BOÕES DE ENQUADRAMENTO
           controlPosition("#D4AJPose1", "#D4AJPose2", "#D4AJPose3", "#D4AJPose4", "#D4AJPose5","#D4AJPose6", "#D4AJPose7", "#D4AJPose8");
           ////////::::::::::::::::::::
            ////////// EVENTOS FUNCÕES BOTÕES DE RADIO
            document.querySelector("#D4-r1").addEventListener('click', async () => { 
                await selSanpshots("MD-CONFG-B"); restaura ="MD-CONFG-B";
                gethDOC = app.activeDocument.height -118; 
                getwDOC = app.activeDocument.width -118 ; 
               });
            document.querySelector("#D4-r2").addEventListener('click', async () => { 
                if(gethDOC>getwDOC){
                    alertar("Esse documento não é proporcional para essa opção!");
                    document.querySelector("#D4-r1" ).checked=true;
                    document.querySelector("#D4-r2" ).disabled=true;
                    document.querySelector(".enabled" ).style.color = "#9e9c9c";
                    restaura ="MD-CONFG-A";
                }
                await selSanpshots("MD-CONFG-A");  getwDOC = 1903; gethDOC =1651; 
            });
            if(document.querySelector("#D4-r1" ).checked==true){ 
                selSanpshots("MD-CONFG-B"); gethDOC = app.activeDocument.height -118; 
                getwDOC = app.activeDocument.width -118;
                restaura ="MD-CONFG-B";
            }
            else{ 
                if(gethDOC>getwDOC){
                    document.querySelector("#D4-r1" ).checked=true;
                    document.querySelector("#D4-r2" ).checked=false;
                }
                else{ selSanpshots("MD-CONFG-A"); getwDOC = 1903; gethDOC =1651; };
                restaura ="MD-CONFG-A";
            };
            ////////////::::::::::::::::::::

            ///////// ABRIR O MENU DE AJUSTE DE CORES
            const menuAjuste2 = document.querySelector("#D4btn-Cores");
            menuAjuste2.addEventListener('click', (event) => {
                try {
                    /////////REMOVE O FOCU DA JANELHA PRINCIPAL
                    require('photoshop').core.performMenuCommand({
                        commandID:5933,
                        kcanDispatchWhileModal: true,
                        _isCommand: false
                    });
                    janelaAjustesx();
                } catch (err) {alert(err)}
             });
            ///////// RESTAURAR INICIAL CONFIGS ESTAMPA
            const restar= document.querySelector("#D4btn-resetar");
            restar.addEventListener('click', (event) => { restauraIniConfig(restaura)});
             ////////::::::::::::::::::::
            /////////////// FUNÇÃO PROCESSAMENTO FINAL
            document.querySelector("#d4Btn1").addEventListener('click', async () => { finalProcess() });
            ///////////////////////////////////////////
            document.querySelector("#d4Btn2").addEventListener('click', () => {
                document.querySelector("#dlgMousePd").close('OK'); resetarConfigs();
            });

             ////////////// ATALHOS CONFIGSXXXXXXXXXXXX
            //////// PRECESSO FINAL 
            function keyEventOnce(event) {
                if (event.keyCode === 13) {
                         finalProcess();
                         document.removeEventListener("keydown", keyEventOnce); // Remove o event listener após o evento ter sido acionado
                        }
                   };
                    document.addEventListener("keydown", keyEventOnce);
                  //////// PRECESSO CANCELAR
                document.addEventListener("keydown", async function(m) { 
                    if (m.keyCode == 27) {  document.querySelector("#dlgMousePd").close('OK'); resetarConfigs();}
                });   
                /////////////////////////////////////////////////////
                
                async function  finalProcess(){
                    try { 
                      document.querySelector("#dlgMousePd").close('OK'); 
                      SalvarDados(); 
                      ajustePreview(100, "show");
                      progressDLG("Aquarde Processing . . ."); 
                      function evento() { setTimeout(() =>{
                          ////////  VERIFICA SE O PRECESSO FINAL 
                          const D4ck5= document.querySelector("#D4-ck5");
                            if(D4ck5.checked==true){  StampConfigP3() }else{ StampConfigP2()}
                          ////////:::::::::::::::::::::::::::::::::::::::::::::
                          }
                       )} setTimeout(evento, 1000);//////depois alterar para 1000
                      } catch (err) {alert(err)};
                 };
                 ////////::::::::::::::::::::::::::::
    
            /////// CHECKBOC PREVIEW
            const D4Ck4 = document.querySelector("#D4-ck4");
            D4Ck4.addEventListener('click', (event) => {
                if(D4Ck4.checked == true){ ajustePreview(100, "show")}
                else{ ajustePreview(0, "hide")}; 
            });
            ////////::::::::::::::::::::
    
        } catch (err) {  alert(err)   }
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////// TODAS AS FUNÇÕES AQUI! ::::::::::::
    
     /////// SALVAR  DINAMICAMENTE OS DADOS
     function SalvarDados(){
            const dadosD4 = {
                dados1: document.querySelector("#D4-r1"  ).checked,
                dados2: document.querySelector("#D4-r2"  ).checked,
                dados3: document.querySelector("#D4-ck2").checked,
                dados4: document.querySelector("#D4-ck3").checked,
                dados5: document.querySelector("#D4-ck5").checked,
            };
            localStorage.setItem('d4DadosSave', JSON.stringify(dadosD4));
    };
    
    //////// PREVISUALIZAR AJUSTES
    async function ajustePreview(v1,v2){
        const {executeAsModal} = require("photoshop").core;
        const {batchPlay} = require("photoshop").action;
        async function preview() {
                await batchPlay( [{_obj:"set",_target:[{_ref:"layer", _name: "AjustColor",_value:"targetEnum"}],to:{_obj:"layer",fillOpacity:{_unit:"percentUnit",_value: v1}},_options:{dialogOptions:"dontDisplay"}},
                {_obj: v2,_target:[{_ref:"filterFX",_index:1},{_ref:"layer", _name: "Conteudo",_value:"targetEnum"}],_options:{dialogOptions:"dontDisplay"}},
                {"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}
             ], { modalBehavior: "wait" } );
        };
        async function runModalFunction2() {await executeAsModal(preview);}
        await runModalFunction2();
    };
    
    ////// CARREGAR JALELA PRINCIPAL
    async function dlgMousePd() {
        fetch('html/D4Mosuse.html').then(response => response.text()).then(data => {
            D4dlg = document.querySelector("#dlgMousePd");
            D4dlg.show({ title: `PS-fxrios: Mouse Pad Personalizada!`, resize: "both", size: { width:367, height:270}})
            D4dlg.innerHTML = data; execonfigsD4();   
            D4dlg.addEventListener('click', async () => {modalFocus(D4dlg, "D4focus")})
            modalFocus(D4dlg, "D4focus")       
        });
    };
    

    ////////// CONFIGURAÇÃO DO MOLDE DAS ESTAMPAS
    async function configMoldes(h, w, btm, rig, mold, snapref){ /// 1 altura - 2 largura - 3 bottom  - 4 right - 5 shap molde 6 snapshot name
        await app.batchPlay([
            {"_obj":"set","_target":[{"_property":"background","_ref":"layer"}],"layerID":2,"to":{"_obj":"layer","mode":{"_enum":"blendMode","_value":"normal"},"name":"Conteudo","opacity":{"_unit":"percentUnit","_value":100.0}}},
            {"_obj":"newPlacedLayer"},
            {"_obj":"imageSize","constrainProportions":true,"height":{"_unit":"pixelsUnit","_value":h},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"resolution":{"_unit":"densityUnit","_value":200.0},"scaleStyles":true},
            {"_obj":"canvasSize","horizontal":{"_enum":"horizontalLocation","_value":"center"},"width":{"_unit":"pixelsUnit","_value":w}},
            {"_obj":"set","_target":[{"_property":"workPath","_ref":"path"}],"to":{"_obj":"customShape","bottom":{"_unit":"pixelsUnit","_value":btm},"keyOriginType":9,"left":{"_unit":"pixelsUnit","_value":0.0},"name":mold,"right":{"_unit":"pixelsUnit","_value":rig},"top":{"_unit":"pixelsUnit","_value":0.0}}},
            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_property":"workPath","_ref":"path"}},
            {"_obj":"make","at":{"_enum":"channel","_ref":"channel","_value":"mask"},"new":{"_class":"channel"},"using":{"_enum":"userMaskEnabled","_value":"revealSelection"}},
            {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","userMaskLinked":false}},
            {"_obj":"delete","_target":[{"_property":"workPath","_ref":"path"}]},
            {"_obj":"make","_target":[{"_ref":"layer"}],"below":true,"layerID":22},
            {"_obj":"make","_target":[{"_ref":"contentLayer"}],"using":{"_obj":"contentLayer","type":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":255.0,"grain":255.0,"red":255.0}}}},
            {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","name":"Background"}},
            {"_obj":"select","_target":[{"_name":"Conteudo","_ref":"layer"}],"layerID":[3],"makeVisible":false},
            {"_obj":"adaptCorrect","blackClip":0.01,"center":0,"colorCorrection":0,"highlightMode":{"_obj":"adaptCorrectTones","amount":{"_unit":"percentUnit","_value":0.0},"radius":0,"width":{"_unit":"percentUnit","_value":0.0}},"shadowMode":{"_obj":"adaptCorrectTones","amount":{"_unit":"percentUnit","_value":0.0},"radius":0,"width":{"_unit":"percentUnit","_value":0.0}},"whiteClip":0.01},
            {"_obj":"newGuideLayout","guideLayout":{"$GdCA":0,"$GdCB":255,"$GdCG":132,"$GdCR":74,"_obj":"guideLayout","marginBottom":{"_unit":"pixelsUnit","_value":0.0},"marginLeft":{"_unit":"pixelsUnit","_value":0.0},"marginRight":{"_unit":"pixelsUnit","_value":0.0},"marginTop":{"_unit":"pixelsUnit","_value":0.0}},"guideTarget":{"_enum":"guideTarget","_value":"guideTargetCanvas"},"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}},
            {"_obj":"canvasSize","height":{"_unit":"pixelsUnit","_value":118},"horizontal":{"_enum":"horizontalLocation","_value":"center"},"relative":true,"vertical":{"_enum":"verticalLocation","_value":"center"},"width":{"_unit":"pixelsUnit","_value":118}},
        ], {});
        await loadAjustes(); 
        await app.batchPlay([
            {"_obj":"selectAllLayers","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]},
            {"_obj":"make","_target":[{"_ref":"layerSection"}],"from":{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"},"layerSectionEnd":23,"layerSectionStart":22,"name":"Group 1"},
            {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","name":"ConfigsOBJ"}},
            {"_obj":"make","_target":[{"_ref":"snapshotClass"}],"from":{"_property":"currentHistoryState","_ref":"historyState"}},
            {"_obj":"select","_target":[{"_name":"Snapshot 1","_ref":"snapshotClass"}]},
            {"_obj":"set","_target":[{"_property":"currentHistoryState","_ref":"historyState"}],"to":{"_obj":"snapshotClass","name":snapref}},
        ], {});
    };
