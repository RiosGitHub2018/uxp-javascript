    //////////////////////////////////////////////////////////////////
    shapStamp = false;
    const inciarD5 = document.querySelector("#serv-btn9");
    inciarD5.addEventListener("click", async (event) => {
        if (event.altKey || event.metaKey) { await docEstampa(205.9, 325.8, "Boné")} 
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
            shapStamp = false;
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
            //await refeshDocumento();
           progressDLG("Aquarde Processing . . ."); 
            function evento() { setTimeout(() =>configurar());} setTimeout(evento, 100);
            //////////CONFIGURAÇÃO INICIAL 
            async function configurar() {
                await core.executeAsModal(async () => {
                    try {
                        docMatriz = app.activeDocument.id;
                        diretorioDoc = app.activeDocument.path.replace(/\\[^\\]*$/, "");
                        arte = "Boné";
                        criarPasta(`${Usuario}/AppData/Roaming`, "temp_stamps");
                        //////// AÇÕES DE EVENTOS AQUI!
                        await app.batchPlay([{"_obj":"flattenImage"}, {"_obj":"reset","_target":[{"_property":"colors","_ref":"color"}]},], {});
                        await configMoldes(572, 905, 572, 905, "shp_Bones", "Inciar" );
                        gethDOC = 572; getwDOC = 905;
               
                        await ZoomDOC(0); await ZoomDOC(1); 
                        await document.querySelector('#processServic').close('OK');
                        await dlgBone();
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
                const D5ck2 = document.querySelector("#D5-ck2");
                const D5ck6 = document.querySelector("#D5-ck6");
                anchorPos = require('photoshop').constants.AnchorPosition;
                await selectCamada("Conteudo");
                app.activeDocument.activeLayers[0].scale(-100, 100);
                
                bounds = app.activeDocument.activeLayers[0].bounds;  
                await app.batchPlay([
                    {"_obj":"select","_target":[{"_name":"AjustColor","_ref":"layer"}],"makeVisible":false,"selectionModifier":{"_enum":"selectionModifierType","_value":"addToSelectionContinuous"}},
                    {"_obj":"clearAllGuides"},{"_obj":"newPlacedLayer"}
                ]);
    
               app.activeDocument.resizeCanvas(1654, 2323, anchorPos.TOPCENTER);
               bounds = app.activeDocument.activeLayers[0].bounds;  
               await app.batchPlay([ {"_obj":"set","_target":[{"_property":"workPath","_ref":"path"}],"to":{"_obj":"customShape","bottom":{"_unit":"distanceUnit","_value":-0.36},"keyOriginType":9,"left":{"_unit":"distanceUnit","_value":-0.72},"name":"Pontilhado","right":{"_unit":"distanceUnit","_value":609.48},"top":{"_unit":"distanceUnit","_value":-0.72}}}])
               await solidColorCamada(0,0,0);

               app.activeDocument.activeLayers[0].translate(0, bounds.bottom+40);
               await app.batchPlay([{"_obj":"flattenImage"}]);
   
               await ADDselecaoShapes(79, 0, 184, 0, "IconBoner", 1);
               await solidColorCamada(0,0,0);
               app.activeDocument.activeLayers[0].translate(bounds.left, bounds.bottom+42); 

                await legendaDados();
                bounds = app.activeDocument.activeLayers[0].bounds;  
                legenda = `Boné Personalizado: • Loja: ${Loja}  • Cliente: ${cliente}`;
                xPosition= bounds.left+84; yPosition = bounds.bottom-19;
                await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 22, position: {x: xPosition, y: yPosition}, fontName: "Arial"});
                await app.batchPlay([{"_obj":"flattenImage"}]);

                ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                await sequenciaSave(`[OK! ]-Boné.png`, `[OK! ]-Boné 1.png`);
                await estampasSave(estampaName); ////// NOME OBTDO DA FUNÇÃO ANTERIOR.
                if(D5ck2.checked==true){ await moveOrigArtes()};

                await app.batchPlay([
                    {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":estampaName},
                    {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                ]);

                /////////EXE AÇÕES
                if(D5ck6.checked==true){ 
                    const list_AS = ActionSet.value; list_AC = ActionList.value;
                     await app.batchPlay([{"_obj":"play","_target":[{"_name": list_AC,"_ref":"action"},{"_name": list_AS,"_ref":"actionSet"}]}], { });
                };

                await ZoomDOC(0);
                await document.querySelector('#processServic').close('OK');
              
            } catch (err) {alert(err)  }
        });
     };

    ////////::::::::::::::::::::
    /////////////// CRIAÇÃO DE MAQUETE 
    async function StampConfigP3(){
            try {
                await core.executeAsModal(async () => {
                    await app.batchPlay([
                        {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":"Maquete"},
                        {"_obj":"make","_target":[{"_ref":"slice"}],"using":{"_obj":"slice","at":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":611},"left":{"_unit":"pixelsUnit","_value":39},"right":{"_unit":"pixelsUnit","_value":944},"top":{"_unit":"pixelsUnit","_value":39}},"type":{"_enum":"sliceType","_value":"user"}}},
                    ]);

                    await saveThumbSTP();
                    await importMokups("{mcp-&004}.psd");
                  
                   async function addRototulo(img){
                        const dirTemplates = `${Usuario}/AppData/Roaming/temp_stamps/images/`;
                        try {await carregThumbSTP(`${dirTemplates}${img}.jpg` );}catch (e){};
                        try {await carregThumbSTP(`${dirTemplates}${img}.png`);}catch (e){};
                    };
                    
                    await selectCamada("Frente_P");await addRototulo("thumbSTP_03");

                    await app.batchPlay([
                        {"_obj":"flattenImage"}, {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, 
                        {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                    ]);
    
                    legenda = `• Maquete: Boné personalizado • Loja: ${Loja}  • Cliente: ${cliente}`;
                    await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 15, position: {x: 27, y: 660}, fontName: "Arial"});
                    await app.batchPlay([{"_obj":"flattenImage"}]);

                    ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                    docMatriz = app.activeDocument.id
                    await sequenciaSave(`[Amostra] Boné.png`, `[Amostra] Boné 1.png`);
                    await estampasSave(estampaName);

                    await app.batchPlay([
                        {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":estampaName},
                        {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                    ]);
                    await ZoomDOC(0); await ZoomDOC(1);
                    await document.querySelector('#processServic').close('OK');
                });
            } catch (err) {alert(err)}
       };
    ////////::::::::::::::::::::
        
    //////// TODAS AS FUNÇÕES AQUI! ::::::::::::
    async function execonfigsD5(){
        try {
            ///////// IMGEM TEMA DA JANELA EM FORMAR CODIFICADO
            fetch('icons/B64PNG/BBone.rtf').then(response => response.text()).then(imgB64 => {
                document.querySelector("#imgBase1").src=imgB64;
             });
            ///////////:::::::::::::::::::::
            /////// CARREGA  OS DADOS DO LOCALSTORAGE
            const dadosRecuperados = localStorage.getItem('d5DadosSave');
            if(dadosRecuperados) {
                    const dadosObjeto = JSON.parse(dadosRecuperados);
                    document.querySelector("#D5-ck2").checked = dadosObjeto.dados3;
                    document.querySelector("#D5-ck3").checked = dadosObjeto.dados4;
                    document.querySelector("#D5-ck5").checked = dadosObjeto.dados5;
            }
            ////////:::::::::::::::::::::::::::::::::::::::::::::::
                    ////////OUVINTES BOÕES DE ENQUADRAMENTO
           controlPosition("#D5AJPose1", "#D5AJPose2", "#D5AJPose3", "#D5AJPose4", "#D5AJPose5","#D5AJPose6", "#D5AJPose7", "#D5AJPose8");
           ////////::::::::::::::::::::
            document.querySelector("#D5btn-actions").addEventListener('click', () => {
                document.querySelector("#acrionsPN").style.display = "block";
            });
            document.querySelector("#D5btn-voltar").addEventListener('click', () => {
                document.querySelector("#acrionsPN").style.display = "none";
            });

            carregarActiosLists();
            ActionSet.disabled=true; ActionList.disabled=true
            /////// CHECKBOC EXE ACTIONS
            const D5Ck6 = document.querySelector("#D5-ck6");
            D5Ck6.addEventListener('click', (event) => {
                if(D5Ck6.checked == true){ ActionSet.disabled=false; ActionList.disabled=false}
                else{ActionSet.disabled=true; ActionList.disabled=true}; 
            });
            /////////:::::::::::::::::::
            ///////// ABRIR O MENU DE AJUSTE DE CORES
            const menuAjuste2 = document.querySelector("#D5btn-Cores");
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
            const restar= document.querySelector("#D5btn-resetar");
            restar.addEventListener('click', (event) => { restauraIniConfig("Inciar")});
            ////////::::::::::::::::::::
            /////////////// FUNÇÃO PROCESSAMENTO FINAL
            document.querySelector("#d5Btn1").addEventListener('click', async () => { finalProcess()});
            ///////////////////////////////////////////
            document.querySelector("#d5Btn2").addEventListener('click', () => {
                document.querySelector("#dlgBone").close('OK'); resetarConfigs();
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
                     if (m.keyCode == 27) {  document.querySelector("#dlgBone").close('OK'); resetarConfigs();}
                });   
                /////////////////////////////////////////////////////
                async function  finalProcess(){
                    try { 
                        document.querySelector("#dlgBone").close('OK'); 
                        SalvarDados(); 
                        ajustePreview(100, "show");
                        progressDLG("Aquarde Processing . . ."); 
                        function evento() { setTimeout(() =>{
                            ////////  VERIFICA SE O PRECESSO FINAL 
                            const D5ck5= document.querySelector("#D5-ck5");
                            if(D5ck5.checked==true){  StampConfigP3() }else{ StampConfigP2()}
                            ////////:::::::::::::::::::::::::::::::::::::::::::::
                            }
                        )} setTimeout(evento, 1000);//////depois alterar para 1000
                      } catch (err) {alert(err)};
                 };
                 ////////::::::::::::::::::::::::::::

        } catch (err) {  alert(err)   }
    };
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////// TODAS AS FUNÇÕES AQUI! ::::::::::::

    /////// SALVAR  DINAMICAMENTE OS DADOS
    function SalvarDados(){
    const dadosD5 = {
        dados3: document.querySelector("#D5-ck2").checked,
        dados4: document.querySelector("#D5-ck3").checked,
        dados5: document.querySelector("#D5-ck5").checked,
      };
        localStorage.setItem('d5DadosSave', JSON.stringify(dadosD5));
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
    async function dlgBone() {
        fetch('html/D5Bone.html').then(response => response.text()).then(data => {
            D5dlg = document.querySelector("#dlgBone");
            D5dlg.show({ title: `PS-fxrios: Mouse Pad Personalizada!`, resize: "both", size: { width:367, height:310}})
            D5dlg.innerHTML = data;  execonfigsD5();
            D5dlg.addEventListener('click', async () => {modalFocus(D5dlg, "D5focus")})
            modalFocus(D5dlg, "D5focus")          
        });
    };
    
    ////////// OBTEM LISTA DE CONJUTOS E AÇÕES
    async function carregarActiosLists(){
        getActionSet = require('photoshop').app.actionTree;
        ActionSet = document.getElementById("list_AS");
        ActionList = document.getElementById("list_AC");  
        // Preencher o seletor de ações
        for (let i = 0; i < getActionSet.length; i++) {
        ActionSet.insertAdjacentHTML("beforeend", `<option>${getActionSet[i].name}</option>`);
        }
        // Função para carregar os itens da ação
        function loadActionItems(selectedIndex) {
            ActionList.innerHTML = "";
            const selectedAction = getActionSet[selectedIndex];
            for (let i = 0; i < selectedAction.actions.length; i++) {
                const actionName = selectedAction.actions[i].name;
                if (actionName.startsWith("Boné")) {
                    ActionList.insertAdjacentHTML("beforeend", `<option>${actionName}</option>`);
                }
            }
        };
        // Event listener para detectar mudanças na seleção de ações
        ActionSet.addEventListener("change", evt => {
            const selectedIndex = evt.target.selectedIndex; loadActionItems(selectedIndex);
        });
        // Carregar itens da primeira ação por padrão
        loadActionItems(0);  
        ActionSet.selectedIndex = 0; ActionList.selectedIndex = 0;
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
                {"_obj":"canvasSize","height":{"_unit":"pixelsUnit","_value":78},"horizontal":{"_enum":"horizontalLocation","_value":"center"},"relative":true,"vertical":{"_enum":"verticalLocation","_value":"center"},"width":{"_unit":"pixelsUnit","_value":78}},
            ], {});
            await loadAjustes(); 
            await app.batchPlay([
                {"_obj":"selectAllLayers","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]},
                {"_obj":"make","_target":[{"_ref":"layerSection"}],"from":{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"},"layerSectionEnd":23,"layerSectionStart":22,"name":"Group 1"},
                {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","name":"ConfigsOBJ"}},
                {"_obj":"make","_target":[{"_ref":"snapshotClass"}],"from":{"_property":"currentHistoryState","_ref":"historyState"}},
                {"_obj":"select","_target":[{"_name":"Snapshot 1","_ref":"snapshotClass"}]},
                {"_obj":"set","_target":[{"_property":"currentHistoryState","_ref":"historyState"}],"to":{"_obj":"snapshotClass","name":snapref}},
                {"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}
            ], {});
        };

        // document.addEventListener("keydown", async function(m) { ///////// FUNÇÃO IMPRIR COM A TECLA ENTER
        //     if (m.keyCode === 13) {
        //        // if(janela==="CanecasDLG"){alert("Caneca process")}
        //        alert("Bone")
        //     }
        // });
         


