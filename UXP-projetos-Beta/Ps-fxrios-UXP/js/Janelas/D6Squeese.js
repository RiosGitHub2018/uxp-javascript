    //////////////////////////////////////////////////////////////////
    shapStamp = false;
    const inciarD6 = document.querySelector("#serv-btn6");
    inciarD6.addEventListener("click", async () => {
            process = true; await incialConfigs() ;
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
                await core.executeAsModal(async (executionContext) => {
                    try {
                        ////// FUNÃO SUSPENDHISTORY DA FUNÇÃO INICIAL
                        let hostControl = executionContext.hostControl; documentID = app.activeDocument.id; 
                        suspensionID = await hostControl.suspendHistory({ "documentID": documentID,"name": "P1Confg" });  
                        //////:::::::::::::::::::
                        docMatriz = app.activeDocument.id;
                        diretorioDoc = app.activeDocument.path.replace(/\\[^\\]*$/, "");
                        arte = "Squeese";
                        criarPasta(`${Usuario}/AppData/Roaming`, "temp_stamps");
                        await app.batchPlay([
                            {"_obj":"flattenImage"},
                            {"_obj":"reset","_target":[{"_property":"colors","_ref":"color"}]},
                            {"_obj":"set","_target":[{"_property":"background","_ref":"layer"}],"layerID":15,"to":{"_obj":"layer","mode":{"_enum":"blendMode","_value":"normal"},"name":"Conteudo","opacity":{"_unit":"percentUnit","_value":100.0}}},
                            {"_obj":"imageSize","constrainProportions":true,"height":{"_unit":"pixelsUnit","_value":785},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"resolution":{"_unit":"densityUnit","_value":200.0},"scaleStyles":true},
                            {"_obj":"canvasSize","horizontal":{"_enum":"horizontalLocation","_value":"center"},"width":{"_unit":"pixelsUnit","_value":1533}},
                            {"_obj":"newPlacedLayer"},{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}},
                            ], {});
                        await estampaGuias();   
                        await app.batchPlay([
                            {"_obj":"contract","by":{"_unit":"pixelsUnit","_value":1.0},"selectionModifyEffectAtCanvasBounds":true},
                            {"_obj":"make","at":{"_enum":"channel","_ref":"channel","_value":"mask"},"new":{"_class":"channel"},"using":{"_enum":"userMaskEnabled","_value":"revealSelection"}},
                            {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","userMaskLinked":false}},
                            {"_obj":"canvasSize","canvasExtensionColorType":{"_enum":"canvasExtensionColorType","_value":"white"},"height":{"_unit":"distanceUnit","_value":28.44},"horizontal":{"_enum":"horizontalLocation","_value":"center"},"relative":true,"vertical":{"_enum":"verticalLocation","_value":"center"},"width":{"_unit":"distanceUnit","_value":28.44}},
                            {"_obj":"make","_target":[{"_ref":"layer"}],"below":true,"layerID":26},
                            {"_obj":"make","_target":[{"_ref":"contentLayer"}],"using":{"_obj":"contentLayer","type":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":255.0,"grain":255.0,"red":255.0}}}},
                            {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","name":"Background"}},
                            {"_obj":"select","_target":[{"_name":"Conteudo","_ref":"layer"}],"layerID":[22],"makeVisible":false},
                            {"_obj":"adaptCorrect","blackClip":0.01,"center":0,"colorCorrection":0,"highlightMode":{"_obj":"adaptCorrectTones","amount":{"_unit":"percentUnit","_value":0.0},"radius":0,"width":{"_unit":"percentUnit","_value":0.0}},"shadowMode":{"_obj":"adaptCorrectTones","amount":{"_unit":"percentUnit","_value":0.0},"radius":0,"width":{"_unit":"percentUnit","_value":0.0}},"whiteClip":0.01}
                        ], {});
                        await loadAjustes(); 
                        await app.batchPlay([
                            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_ref":[{"_enum":"channel","_ref":"channel","_value":"mask"},{"_name":"Conteudo","_ref":"layer"}]}},
                            {"_obj":"select","_target":[{"_name":"AjustColor","_ref":"layer"}],"layerID":[34],"makeVisible":false},
                            {"_obj":"make","at":{"_enum":"channel","_ref":"channel","_value":"mask"},"new":{"_class":"channel"},"using":{"_enum":"userMaskEnabled","_value":"revealSelection"}}
                            ])

                        await ZoomDOC(0);// await ZoomDOC(1);
                        await app.batchPlay([{"_obj":"selectAllLayers","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]},{"_obj":"make","_target":[{"_ref":"layerSection"}],"from":{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"},"layerSectionEnd":216,"layerSectionStart":215,"name":"Group 1"} ], {});
                        await removeCamada("ConfigsOBJ");
                        await dlgSqueese();
                        await creatSnapshot("Inciar");
                        await document.querySelector('#processServic').close('OK');
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
                const D6ck2 = document.querySelector("#D6-ck2");
                const D6ck6 = document.querySelector("#D6-ck6");
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
   
               await ADDselecaoShapes(79, 0, 184, 0, "IconSqueese", 1);
               await solidColorCamada(0,0,0);
               app.activeDocument.activeLayers[0].translate(bounds.left, bounds.bottom+42); 

                await legendaDados();
                bounds = app.activeDocument.activeLayers[0].bounds;  
                legenda = `Squeese Personalizado: • Loja: ${Loja}  • Cliente: ${cliente}`;
                xPosition= bounds.left+84; yPosition = bounds.bottom-19;
                await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 22, position: {x: xPosition, y: yPosition}, fontName: "Arial"});
                await app.batchPlay([{"_obj":"flattenImage"}]);

                ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                await sequenciaSave(`[OK! ]-Squeese.png`, `[OK! ]-Squeese 1.png`);
                await estampasSave(estampaName); ////// NOME OBTDO DA FUNÇÃO ANTERIOR.
                if(D6ck2.checked==true){ await moveOrigArtes()};

                await app.batchPlay([
                    {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":estampaName},
                    {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                ]);

                /////////EXE AÇÕES
                if(D6ck6.checked==true){ 
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
                        {"_obj":"make","_target":[{"_ref":"slice"}],"using":{"_obj":"slice","at":{"_obj":"rectangle","bottom":{"_unit":"distanceUnit","_value":296.28},"left":{"_unit":"distanceUnit","_value":14.04},"right":{"_unit":"distanceUnit","_value":290.52},"top":{"_unit":"distanceUnit","_value":14.04}},"type":{"_enum":"sliceType","_value":"user"}}},
                        {"_obj":"make","_target":[{"_ref":"slice"}],"using":{"_obj":"slice","at":{"_obj":"rectangle","bottom":{"_unit":"distanceUnit","_value":296.28},"left":{"_unit":"distanceUnit","_value":290.52},"right":{"_unit":"distanceUnit","_value":565.56},"top":{"_unit":"distanceUnit","_value":14.04}},"type":{"_enum":"sliceType","_value":"user"}}}
                    ]);
                    
                    await saveThumbSTP();
                    await importMokups("{mcp-&014}.psd");
                  
                   async function addRototulo(img){
                        const dirTemplates = `${Usuario}/AppData/Roaming/temp_stamps/images/`;
                        try {await carregThumbSTP(`${dirTemplates}${img}.jpg` );}catch (e){};
                        try {await carregThumbSTP(`${dirTemplates}${img}.png`);}catch (e){};
                    };
                    
                    await selectCamada("Frente");await addRototulo("thumbSTP_03");
                    await selectCamada("Verso"); await addRototulo("thumbSTP_04");

                    await app.batchPlay([
                        {"_obj":"flattenImage"}, {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, 
                        {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                    ]);
    
                    legenda = `• Maquete: Squeese personalizado • Loja: ${Loja}  • Cliente: ${cliente}`;
                    await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 15, position: {x: 27, y: 660}, fontName: "Arial"});
                    await app.batchPlay([{"_obj":"flattenImage"}]);

                    ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                    docMatriz = app.activeDocument.id
                    await sequenciaSave(`[Amostra] Squeese.png`, `[Amostra] Squeese 1.png`);
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
    async function execonfigsD6(){
        try {
            ///////// IMGEM TEMA DA JANELA EM FORMAR CODIFICADO
            fetch('icons/B64PNG/BSqueese.rtf').then(response => response.text()).then(imgB64 =>{
                document.querySelector("#imgBase3").src=imgB64;
             });
            /////// CARREGA  OS DADOS DO LOCALSTORAGE
            const dadosRecuperados = localStorage.getItem('d6DadosSave');
            if(dadosRecuperados) {
                    const dadosObjeto = JSON.parse(dadosRecuperados);
                    document.querySelector("#D6-ck2").checked = dadosObjeto.dados3;
                    document.querySelector("#D6-ck3").checked = dadosObjeto.dados4;
                    document.querySelector("#D6-ck5").checked = dadosObjeto.dados5;
            }
            ////////:::::::::::::::::::::::::::::::::::::::::::::::
           ////////OUVINTES BOÕES DE ENQUADRAMENTO
           controlPosition("#D6AJPose1", "#D6AJPose2", "#D6AJPose3", "#D6AJPose4", "#D6AJPose5","#D6AJPose6", "#D6AJPose7", "#D6AJPose8");
           ////////::::::::::::::::::::
            document.querySelector("#D6btn-actions").addEventListener('click', () => {
                document.querySelector("#acrionsPN2").style.display = "block";
            });
            document.querySelector("#D6btn-voltar").addEventListener('click', () => {
                document.querySelector("#acrionsPN2").style.display = "none";
            });

            carregarActiosLists();
            ActionSet.disabled=true; ActionList.disabled=true
            /////// CHECKBOC EXE ACTIONS
            const D6Ck6 = document.querySelector("#D6-ck6");
            D6Ck6.addEventListener('click', (event) => {
                if(D6Ck6.checked == true){ ActionSet.disabled=false; ActionList.disabled=false}
                else{ActionSet.disabled=true; ActionList.disabled=true}; 
            });
            /////////:::::::::::::::::::
            ///////// ABRIR O MENU DE AJUSTE DE CORES
            const menuAjuste2 = document.querySelector("#D6btn-Cores");
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
            const restar= document.querySelector("#D6btn-resetar");
            restar.addEventListener('click', (event) => { restauraIniConfig("Inciar")});
            ////////::::::::::::::::::::
            /////////////// FUNÇÃO PROCESSAMENTO FINAL
            document.querySelector("#d6Btn1").addEventListener('click', async () => { D6finalProcess() });
            ///////////////////////////////////////////
            document.querySelector("#d6Btn2").addEventListener('click', () => {
                document.querySelector("#dlgSqueese").close('OK'); resetarConfigs();
            });
             ////////////// ATALHOS CONFIGSXXXXXXXXXXXX
            //////// PRECESSO FINAL 
            function keyEventOnce(event) {
                if (event.keyCode === 13) {
                         D6finalProcess();
                         document.removeEventListener("keydown", keyEventOnce); // Remove o event listener após o evento ter sido acionado
                        }
                   };
                    document.addEventListener("keydown", keyEventOnce);
                  //////// PRECESSO CANCELAR
                document.addEventListener("keydown", async function(m) { 
                    if (m.keyCode == 27) {  document.querySelector("#dlgSqueese").close('OK'); resetarConfigs();}
                });   
                /////////////////////////////////////////////////////
                async function D6finalProcess(){
                    try { 
                        document.querySelector("#dlgSqueese").close('OK'); 
                        SalvarDados(); 
                        ajustePreview(100, "show");
                        progressDLG("Aquarde Processing . . ."); 
                        function evento() { setTimeout(() =>{
                            ////////  VERIFICA SE O PRECESSO FINAL 
                            const D6ck5= document.querySelector("#D6-ck5");
                             if(D6ck5.checked==true){  StampConfigP3() }else{ StampConfigP2()}
                            ////////:::::::::::::::::::::::::::::::::::::::::::::
                            }
                        )} setTimeout(evento, 1000);//////depois alterar para 1000
                      } catch (err) {alert(err)};
                 };
                 ////////::::::::::::::::::::::::::::

            /////// CHECKBOC PREVIEW
            const D6Ck4 = document.querySelector("#D6-ck4");
            D6Ck4.addEventListener('click', (event) => {
                if(D6Ck4.checked == true){ ajustePreview(100, "show")}
                else{ ajustePreview(0, "hide")}; 
            });
            ////////::::::::::::::::::::

        } catch (err) {  alert(err)   }
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////// TODAS AS FUNÇÕES AQUI! ::::::::::::

    /////// SALVAR  DINAMICAMENTE OS DADOS
    function SalvarDados(){
    const dadosD6 = {
        dados3: document.querySelector("#D6-ck2").checked,
        dados4: document.querySelector("#D6-ck3").checked,
        dados5: document.querySelector("#D6-ck5").checked,
      };
        localStorage.setItem('d6DadosSave', JSON.stringify(dadosD6));
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
    async function dlgSqueese() {
        fetch('html/D6Squeese.html').then(response => response.text()).then(data => {
            D6dlg = document.querySelector("#dlgSqueese");
            D6dlg.show({ title: `PS-fxrios: Squeese Personalizada!`, resize: "both", size: { width:367, height:310}})
            D6dlg.innerHTML = data;  execonfigsD6();
            D6dlg.addEventListener('click', async () => {modalFocus(D6dlg, "D6focus")})
            modalFocus(D6dlg, "D6focus")          
        });
    };
    
    ////////// OBTEM LISTA DE CONJUTOS E AÇÕES
    async function carregarActiosLists(){
        getActionSet2 = require('photoshop').app.actionTree;
        ActionSet = document.getElementById("list_AS2");
        ActionList = document.getElementById("list_AC2");  
        // Preencher o seletor de ações
        for (let i = 0; i < getActionSet2.length; i++) {
            ActionSet.insertAdjacentHTML("beforeend", `<option>${getActionSet2[i].name}</option>`);
        }
        // Função para carregar os itens da ação
        function loadActionItems(selectedIndex) {
            ActionList.innerHTML = "";
            const selectedAction = getActionSet2[selectedIndex];
            
            for (let i = 0; i < selectedAction.actions.length; i++) {
                const actionName2 = selectedAction.actions[i].name;
                if (actionName2.startsWith("Squeeze")) {
                    ActionList.insertAdjacentHTML("beforeend", `<option>${actionName2}</option>`);
                }
            }
        };
         // Event listener para detectar mudanças na seleção de ações
        ActionSet.addEventListener("change", evt => {
            const selectedIndex = evt.target.selectedIndex; loadActionItems(selectedIndex);
        });
        // Carregar itens da primeira ação por padrão
        loadActionItems(0);  
        ActionSet.selectedIndex = 0;
        ActionList.selectedIndex = 51;
    };




