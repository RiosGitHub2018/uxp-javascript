    //////////////////////////////////////////////////////////////////
    shapStamp = false;
    const inciarD7 = document.querySelector("#serv-btn5");
    inciarD7.addEventListener("click", async (event) => {
        if (event.altKey || event.metaKey) { presetsQKBsize()} 
        else { process = true; await incialConfigs() ;}
    });

    function presetsQKBsize() {
         document.querySelector("#serv-btn5SM").style.display="flex";
        //////// REMOVE PREVIOUS EVENT HANDLERS IF THEY EXIST
        document.querySelector("#serv-btn5P").removeEventListener("click", setingPClick);
        document.querySelector("#serv-btn5M").removeEventListener("click", setingMClick);
        document.querySelector("#serv-btn5G").removeEventListener("click", setingGClick);
        //////// ADD EVENT HANDLERS FOR EACH BUTTON
        document.querySelector("#serv-btn5P").addEventListener("click", setingPClick);
        document.querySelector("#serv-btn5M").addEventListener("click", setingMClick);
        document.querySelector("#serv-btn5G").addEventListener("click", setingGClick);
    }

    function setingPClick() {
        document.querySelector("#serv-btn5SM").style.display = "none";
        docEstampa(396.7, 510.1, "Quebra-Cabeça P");
    }

    function setingMClick() {
        document.querySelector("#serv-btn5SM").style.display = "none";
        docEstampa(551.5, 780.1, "Quebra-Cabeça M");
    }

    function setingGClick() {
        document.querySelector("#serv-btn5SM").style.display = "none";
        docEstampa(776.5, 1130.4, "Quebra-Cabeça G");
    }

    ///FUNCTION incialConfigs INCIAR
    async function incialConfigs() {
            dialogsEventsFalse();
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
                        arte = "Quebra-cabeça";
                        criarPasta(`${Usuario}/AppData/Roaming`, "temp_stamps");
                        ////// AÇÕES DE EVENTOS AQUI!
                        await app.batchPlay([{"_obj":"flattenImage"}, {"_obj":"reset","_target":[{"_property":"colors","_ref":"color"}]},], {});

                        ////// TAMANHO MEDIO
                        if(gethDOC>getwDOC){await configMoldes(2167, 1532, 2167, 1532, "shp_QKbcas", "MD-CONFG-B" );}
                        else{ await configMoldes(1532, 2167, 1532, 2167, "shp_QKbcas", "MD-CONFG-B" );};
                        app.activeDocument.activeHistoryState = app.activeDocument.historyStates [0];

                        ////// TAMANHO GRANDE
                        if(gethDOC>getwDOC){await configMoldes(3140, 2157, 3140, 2157, "shp_QKbcas", "MD-CONFG-C" );}
                        else{await configMoldes(2157, 3140, 2157, 3140, "shp_QKbcas", "MD-CONFG-C" ); };
                        app.activeDocument.activeHistoryState = app.activeDocument.historyStates [0];
            
                        ////// TAMANHO PEQUENO
                        if(gethDOC>getwDOC){await configMoldes( 1417, 1102,  1417, 1102, "shp_QKbcas", "MD-CONFG-A" );}
                        else{await configMoldes(1102,  1417, 1102,  1417, "shp_QKbcas", "MD-CONFG-A" );};
                        await configsPositions(5, null);
                        app.activeDocument.activeHistoryState = app.activeDocument.historyStates [0];
                        await app.batchPlay([ {"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}], {});
                   //     sanapBase ="MD-CONFG-A";
                       
                        // await ZoomDOC(0); 
                        await document.querySelector('#processServic').close('OK');
                        await dlgQcabeca();
                      
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
                if(tam == "Pequeno"){
                    if(gethDOC>getwDOC){ app.activeDocument.rotate(90);}////SE O TAMANHO  FOR P, VERTICAL => ROTACIONAR 90+
                }
               else if(tam =="Médio" ||  tam =="Grande"){
                    if(gethDOC<getwDOC){ app.activeDocument.rotate(-90);}
                };
      
                anchorPos = require('photoshop').constants.AnchorPosition;
                bounds = app.activeDocument.activeLayers[0].bounds;  
                await app.batchPlay([
                    {"_obj":"select","_target":[{"_name":"AjustColor","_ref":"layer"}],"makeVisible":false,"selectionModifier":{"_enum":"selectionModifierType","_value":"addToSelectionContinuous"}},
                    {"_obj":"clearAllGuides"},{"_obj":"newPlacedLayer"}
                ]);
     
                if(tam == "Pequeno"){app.activeDocument.resizeCanvas(1654, 2323, anchorPos.TOPCENTER); my=-20}
                else if(tam == "Médio"){ app.activeDocument.resizeCanvas(1654, 2323, anchorPos.TOPCENTER); my= -40}
                else if(tam == "Grande"){ app.activeDocument.resizeCanvas(2339, 3307, anchorPos.TOPCENTER); my= -20 }
                app.activeDocument.activeLayers[0].translate(0, my );
                
                bounds = app.activeDocument.activeLayers[0].bounds;  
                 await app.batchPlay([{"_obj":"set","_target":[{"_property":"workPath","_ref":"path"}],"to":{"_obj":"customShape","bottom":{"_unit":"distanceUnit","_value":-0.36},"keyOriginType":9,"left":{"_unit":"distanceUnit","_value":-1.08},"name":"Pontilhado","right":{"_unit":"distanceUnit","_value":842.04},"top":{"_unit":"distanceUnit","_value":-0.72}}}])
                 await solidColorCamada(0,0,0);

                 app.activeDocument.activeLayers[0].translate(0, bounds.bottom+23);
                 await app.batchPlay([{"_obj":"flattenImage"}]);
    
                 await ADDselecaoShapes(79, 0, 184, 0, "IconQKBcas", 1);
                 await solidColorCamada(0,0,0);

                 app.activeDocument.activeLayers[0].translate(bounds.left, bounds.bottom+42)
                 await legendaDados();
                 bounds = app.activeDocument.activeLayers[0].bounds;  
                 legenda = ` ${arte} [${tam}] : • Loja: ${Loja}  • Cliente: ${cliente}`;
                 xPosition= bounds.left+84; yPosition = bounds.bottom-19;
                 await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 22, position: {x: xPosition, y: yPosition}, fontName: "Arial"});
                 await app.batchPlay([{"_obj":"flattenImage"}]);

                ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                await sequenciaSave(`[OK! ] ${arte} ${tam}.png`, `[OK! ] ${arte} ${tam} 1.png`);
                await estampasSave(estampaName); ////// NOME OBTDO DA FUNÇÃO ANTERIOR.
                const D7ck2 = document.querySelector("#D7-ck2");
                if(D7ck2.checked==true){ await moveOrigArtes()};
            
                await app.batchPlay([
                    {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":estampaName},
                    {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                ]);

                /////////EXE AÇÕES
                const D7ck6 = document.querySelector("#D7-ck6");
                if(D7ck6.checked==true){ 
                    const list_AS = ActionSet.value; list_AC = ActionList.value;
                    await app.batchPlay([{"_obj":"play","_target":[{"_name": list_AC,"_ref":"action"},{"_name": list_AS,"_ref":"actionSet"}]}], { });
                };

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
                    await selSanpshots("MD-CONFG-B"); 
                    bot= 1591; left= 59;  righ= 2226;  top= 59;

                    await app.batchPlay([
                        {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":"Maquete"},
                        {"_obj":"select","_target":[{"_name":"Conteudo","_ref":"layer"}],"layerID":[15],"makeVisible":false}, {"_obj":"delete","_target":[{"_enum":"channel","_ref":"channel","_value":"mask"}]},
                        {"_obj":"make","_target":[{"_ref":"slice"}],"using":{"_obj":"slice","at":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":bot},"left":{"_unit":"pixelsUnit","_value":left},"right":{"_unit":"pixelsUnit","_value":righ},"top":{"_unit":"pixelsUnit","_value":top}},"type":{"_enum":"sliceType","_value":"user"}}},
                    ]);
                   await saveThumbSTP();
                    await importMokups("{mcp-&013}.psd");
                    await selectCamada("Frente");

                    const dirTemplates = `${Usuario}/AppData/Roaming/temp_stamps/images/`;
                    try {await carregThumbSTP(`${dirTemplates}thumbSTP_03.jpg` );}catch (e){};
                    try {await carregThumbSTP(`${dirTemplates}thumbSTP_03.png`);}catch (e){};
                    
                    await app.batchPlay([
                        {"_obj":"flattenImage"}, {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, 
                        {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                    ]);
    
                    legenda = `• ${arte} [${tam}] • Loja: ${Loja}  • Cliente: ${cliente}`;   
                    await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 15, position: {x: 27, y: 660}, fontName: "Arial"});
                    await app.batchPlay([{"_obj":"flattenImage"}]);
                    
                    ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                    docMatriz = app.activeDocument.id
                    await sequenciaSave(`[Amostra] ${arte} ${tam}.png`, `[Amostra] ${arte} ${tam} 1.png`);
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
    async function execonfigsD7(){
        try {
            ///////// IMGEM TEMA DA JANELA EM FORMAR CODIFICADO
            fetch('icons/B64PNG/BQcabca.rtf').then(response => response.text()).then(imgB64 => {
                document.querySelector("#imgBase5").src=imgB64;
             });
            ///////////:::::::::::::::::::::
            /////// CARREGA  OS DADOS DO LOCALSTORAGE
            const dadosRecuperados = localStorage.getItem('D7DadosSave');
            if(dadosRecuperados) {
                    const dadosObjeto = JSON.parse(dadosRecuperados);
                    document.querySelector("#D7-r1"  ).checked = dadosObjeto.dados1;
                    document.querySelector("#D7-r2"  ).checked = dadosObjeto.dados2;
                    document.querySelector("#D7-r3"  ).checked = dadosObjeto.dados3;
                    document.querySelector("#D7-ck2").checked = dadosObjeto.dados4;
                    document.querySelector("#D7-ck3").checked = dadosObjeto.dados5;
                    document.querySelector("#D7-ck5").checked = dadosObjeto.dados6;   
                    document.querySelector("#D7-ck6").checked = dadosObjeto.dados7;   
             };
            ////////:::::::::::::::::::::::::::::::::::::::::::::::
    
            ////////////CONFIGS SISTEMA DE ABAS
            document.querySelector("#D7-btn1").classList.add('D7selecionado');
            const D7Btns = document.getElementsByClassName("D7-btAbas");
            const D7Abas = document.getElementsByClassName("D7-Abas");
            const D7Btn = Array.from(D7Btns);
            
            for (let i = 0; i < D7Btn.length; i++) {
                D7Btn[i].addEventListener('click', (event) => {
                    // Esconder todas as abas
                    for (let j = 0; j < D7Abas.length; j++){ D7Abas[j].style.display = 'none';}
                    for (let j = 0; j < D7Btn.length; j++) { D7Btn[j].classList.remove('D7selecionado');}
                    D7Abas[i].style.display = 'block';
                    event.currentTarget.classList.add('D7selecionado');
                    document.querySelector("#acrionsPN3").style.display = "none";
                });
            };
            ////////::::::::::::::::::::
            ////////OUVINTES BOÕES DE ENQUADRAMENTO
            controlPosition("#D7AJPose1", "#D7AJPose2", "#D7AJPose3", "#D7AJPose4", "#D7AJPose5","#D7AJPose6", "#D7AJPose7", "#D7AJPose8");
            ////////// EVENTOS FUNCÕES BOTÕES DE RADIO
            function docSaize(){gethDOC = app.activeDocument.height-118; getwDOC = app.activeDocument.width-118;}
            document.querySelector("#D7-r1").addEventListener('click', async () => { 
                    await selSanpshots("MD-CONFG-A"); restaura ="MD-CONFG-A"; docSaize(); tam ="Pequeno";
              });
            document.querySelector("#D7-r2").addEventListener('click', async () => { 
                await selSanpshots("MD-CONFG-B"); restaura ="MD-CONFG-B"; docSaize(); tam ="Médio";  
            });
            document.querySelector("#D7-r3").addEventListener('click', async () => { 
                await selSanpshots("MD-CONFG-C"); restaura ="MD-CONFG-C"; docSaize(); tam ="Grande";
            });

           selTamanhosConfigs();
           async function selTamanhosConfigs(){
                if(document.querySelector("#D7-r1").checked==true){
                    await selSanpshots("MD-CONFG-A"); docSaize(); restaura ="MD-CONFG-A"; tam ="Pequeno";
                   }
              if(document.querySelector("#D7-r2").checked==true){
                   await selSanpshots("MD-CONFG-B"); docSaize(); restaura ="MD-CONFG-B"; tam ="Médio";  
               }
               if(document.querySelector("#D7-r3").checked==true){
                   await selSanpshots("MD-CONFG-C"); docSaize(); restaura ="MD-CONFG-C"; tam ="Grande";
               };
            }
            ////////::::::::::::::::::::
            ///////// BRIR PAINEL DE AÇÕES
            document.querySelector("#D7btn-actions").addEventListener('click', () => {
                document.querySelector("#acrionsPN3").style.display = "block";
            });
            document.querySelector("#D7btn-voltar").addEventListener('click', () => {
                document.querySelector("#acrionsPN3").style.display = "none";
            });
            ////////::::::::::::::::::::
            carregarActiosLists();

            /////// CHECKBOC EXE ACTIONS
            const D7Ck6 = document.querySelector("#D7-ck6");
            if(D7Ck6.checked == true){ ActionSet.disabled=false; ActionList.disabled=false}
            else{ActionSet.disabled=true; ActionList.disabled=true}; 
            D7Ck6.addEventListener('click', (event) => {
                if(D7Ck6.checked == true){ ActionSet.disabled=false; ActionList.disabled=false}
                else{ActionSet.disabled=true; ActionList.disabled=true}; 
            });
            /////////:::::::::::::::::::

            ///////// ABRIR O MENU DE AJUSTE DE CORES
            const menuAjuste2 = document.querySelector("#D7btn-Cores");
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
            const restar= document.querySelector("#D7btn-resetar");
            restar.addEventListener('click', (event) => { restauraIniConfig(restaura)});
             ////////::::::::::::::::::::
            /////////////// FUNÇÃO PROCESSAMENTO FINAL
            document.querySelector("#D7Btn1").addEventListener('click', async () => { finalProcess();});
            ///////////////////////////////////////////
            document.querySelector("#D7Btn2").addEventListener('click', () => {
                    document.querySelector("#dlgQcabeca").close('OK'); resetarConfigs();
            });
    
           ////////////// ATALHOS CONFIGSXXXXXXXXXXXX
            //////// PRECESSO FINAL POR ATALHOS
            document.addEventListener("keydown", QBcabecasKey);
           async function QBcabecasKey(event) {
                if (event.keyCode === 13) {
                        document.removeEventListener("keydown", QBcabecasKey); // Remove o event listener após o evento ter sido acionado
                        finalProcess();
                    };
                    if (event.keyCode == 80) { document.querySelector("#D7-r1").checked=true; 
                        selTamanhosConfigs()
                    }
                    if (event.keyCode == 77) { document.querySelector("#D7-r2").checked=true; 
                         selTamanhosConfigs()
                     }
                    if (event.keyCode == 71) { document.querySelector("#D7-r3").checked=true; 
                        selTamanhosConfigs()
                     }
                    if (event.keyCode == 107) {await configsPositions(1, 102)}////ZOOM MAIS
                    if (event.keyCode == 109) {await configsPositions(2,   98)}////ZOOM MENOS
                    if (event.keyCode ==   37) {await configsPositions(3, -10);}////MOVERA PARA ESQUEDA
                    if (event.keyCode ==   39) {await configsPositions(3, 10);}////MOVERA PARA DIREITA
                    if (event.keyCode ==   38) {await configsPositions(4, -10);}////MOVERA PARA CIMA
                    if (event.keyCode ==   40) {await configsPositions(4, 10);}////MOVERA PARA BAIXO
                    if (event.keyCode == 112) {await configsPositions(5, null);}////PRENCHER HORIZONTALMENTE
                    if (event.keyCode == 113) {await configsPositions(6, null);}////PRENCHER VERTICALMENTE
                    //////// PRECESSO CANCELAR
                    if (event.keyCode == 27) {  
                        document.querySelector("#dlgQcabeca").close('OK'); resetarConfigs();
                        D7QbcabecaEventos=false;
                    }
            };
            
            //////// PRECESSO FINAL POR ATALHOS FINAL       
            ///////////////:::::::::::::::::::::::::::::::::::::::::::
            async function  finalProcess(){
                try { 
                    if( D7QbcabecaEventos===false){return}
                    D7QbcabecaEventos=false;
                    document.querySelector("#dlgQcabeca").close('OK'); 
                    SalvarDados();  ajustePreview(100, "show");
                    progressDLG("Aquarde Processing . . ."); 
                    function evento() { setTimeout(() =>{
                        ////////  VERIFICA SE O PRECESSO FINAL 
                        const D7ck5= document.querySelector("#D7-ck5");
                          if(D7ck5.checked==true){  StampConfigP3() }else{ StampConfigP2()}
                        ////////:::::::::::::::::::::::::::::::::::::::::::::
                        }
                     )} setTimeout(evento, 1000);//////depois alterar para 1000
                  } catch (err) {alert(err)};
             };
             ////////::::::::::::::::::::::::::::

            /////// CHECKBOC PREVIEW
            const D7Ck4 = document.querySelector("#D7-ck4");
            D7Ck4.addEventListener('click', (event) => {
                if(D7Ck4.checked == true){ ajustePreview(100, "show")}
                else{ ajustePreview(0, "hide")}; 
            });
            ////////::::::::::::::::::::
            
            ////////::::::::::::::::::::
    
        } catch (err) {  alert(err)   }
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////// TODAS AS FUNÇÕES AQUI! ::::::::::::
    
     /////// SALVAR  DINAMICAMENTE OS DADOS
     function SalvarDados(){
            const dadosD7 = {
                dados1: document.querySelector("#D7-r1"  ).checked,
                dados2: document.querySelector("#D7-r2"  ).checked,
                dados3: document.querySelector("#D7-r3"  ).checked,
                dados4: document.querySelector("#D7-ck2").checked,
                dados5: document.querySelector("#D7-ck3").checked,
                dados6: document.querySelector("#D7-ck5").checked,
                dados7: document.querySelector("#D7-ck6").checked
            };
            localStorage.setItem('D7DadosSave', JSON.stringify(dadosD7));
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
    async function dlgQcabeca() {
            D7QbcabecaEventos=true;
            fetch('html/D7Qbcabeca.html').then(response => response.text()).then(data => {
            D7dlg = document.querySelector("#dlgQcabeca");
            D7dlg.show({ title: `PS-fxrios: Qubra-cabeça!`, resize: "both", size: { width:367, height:270}})
            D7dlg.innerHTML = data; 
            D7dlg.addEventListener('load', evt => { setTimeout(() =>{ document.getElementById('D7-ck5').focus();}, 150) });
            execonfigsD7();  
        });
    };
    
     ////////// OBTEM LISTA DE CONJUTOS E AÇÕES
    async function carregarActiosLists(){
        getActionSet3 = require('photoshop').app.actionTree;
        ActionSet = document.getElementById("list_AS3");
        ActionList = document.getElementById("list_AC3");  
        // Preencher o seletor de ações
        for (let i = 0; i < getActionSet3.length; i++) {
            ActionSet.insertAdjacentHTML("beforeend", `<option>${getActionSet3[i].name}</option>`);
        }
        // Função para carregar os itens da ação
        function loadActionItems(selectedIndex) {
            ActionList.innerHTML = "";
            const selectedAction = getActionSet3[selectedIndex];
            for (let i = 0; i < selectedAction.actions.length; i++) {
                const actionName = selectedAction.actions[i].name;
                if (actionName.startsWith("QCabeças")) {
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
        try {
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
        } catch (err) {alert(err)}
    };

