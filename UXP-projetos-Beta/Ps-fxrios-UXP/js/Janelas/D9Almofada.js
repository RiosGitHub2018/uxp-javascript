    //////////////////////////////////////////////////////////////////
    shapStamp = false;
    const inciarD9 = document.querySelector("#serv-btn12");
    inciarD9.addEventListener("click", async (event) => {
        if (event.altKey || event.metaKey) { await docEstampa(822, 822, "Almofada")} 
        else { process = true; await incialConfigs() ;}
    });

    ///FUNCTION incialConfigs INCIAR
    async function incialConfigs() {
            dialogsEventsFalse();
            if(app.documents.length==0){  const f = await fs.getFileForOpening(); if(f){await core.executeAsModal(() => app.open(f));} if(f==null){ return};}
            StampConfigP1();
            doc= app.activeDocument;
            resol = 200 //app.activeDocument.resolution;
            gethDOC = app.activeDocument.height;
            getwDOC = app.activeDocument.width;
            shapStamp = true;
            MaqueteOP = false
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
             try {
               progressDLG("Aquarde Processing . . ."); 
               function evento() { setTimeout(() =>configurar());} setTimeout(evento, 1000);
               //////////CONFIGURAÇÃO INICIAL 
               async function configurar() {
                   await core.executeAsModal(async () => {
                       try {
                            estampaExist = [];
                            idenficadorDcs();
                            docMatriz = app.activeDocument.id; 
                            diretorioDoc = app.activeDocument.path.replace(/\\[^\\]*$/, "");
                            arte = "Almofada";
                            criarPasta(`${Usuario}/AppData/Roaming`, "temp_stamps");
                            ////// AÇÕES DE EVENTOS AQUI! //////////////////////////////////////////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                            carregarDadsosLS();////// OBTEM OS  VALORES NA FUNÇÃO (carregarDadsosLS())
                            wConfig = Number(wDocStart/2.54*resol).toFixed(0); ////// CONVERTE PARA DE CM PARA PX
                            hConfig  = Number(hDocStart/2.54*resol).toFixed(1);  ////// CONVERTE PARA DE CM PARA PX

                           async function selecionarDoc(docId) {
                                await app.batchPlay([{"_obj":"select","_target":[{"_id": docId,"_ref":"document"}]}]);
                                await configMoldes(Number(hConfig), Number(wConfig)) /// 1 altura - 2 largura
                                gethDOC = Number(hConfig); getwDOC = Number(wConfig);
                                await configsPositions(5, null);/////// PREENCHE A IMAGEM EM TODAS ESTENSÃO DO DOCUEMNTO
                                await creatSnapshot("Iniciar");
                                await ZoomDOC(0);  await ZoomDOC(1);
                            }
                            
                            /////// CHAMA AS FUNÇÃO  SE HAVER UM DOC FRENTE OU VERSO OU UM NOME QUALQUER;
                            if(estampaExist.length == 0 || estampaExist.length == 1){await selecionarDoc(docMatriz);}
                            /////// CHAMA AS FUNÇÕES SEQUENCIALMENTE SE HAVER  DOCS  FRENTE SE VERSO
                            else{await selecionarDoc(frente); await selecionarDoc(verso);}
                  
                            await document.querySelector('#processServic').close('OK');
                            dlgAlmofada();
                            await legendaDados();
                       } catch (err) {alert(err)}
                       ////////////////////////
                  },{"interactive": true});
               //////////////::::::::::::::
               };
         } catch (err) {alert(err)}          
        };
    };
    ////////::::::::::::::::::::

    //////////////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    /////////////// CRIAÇÃO DA ESTAMPA DE IMPRESSÃO
     async function StampConfigP2(){
        try {
            await core.executeAsModal(async () => {
                    modelo = LegendaModelo;
                    anchorPos = require('photoshop').constants.AnchorPosition;
                    await selectCamada("Conteudo");
                    app.activeDocument.activeLayers[0].scale(-100, 100);
                    
                    if(wConfig < 1575){app.activeDocument.resizeCanvas(1654, 2323, anchorPos.TOPCENTER)}
                    else{
                        if(altura<lagura){ app.activeDocument.rotate(-90);}////SE O TAMANHO  FOR P, VERTICAL => ROTACIONAR 90+
                        app.activeDocument.resizeCanvas(2339, 3307, anchorPos.TOPCENTER)
                      };

                     
                    await app.batchPlay([
                        {"_obj":"select","_target":[{"_name":"AjustColor","_ref":"layer"}],"makeVisible":false,"selectionModifier":{"_enum":"selectionModifierType","_value":"addToSelectionContinuous"}},
                        {"_obj":"clearAllGuides"},{"_obj":"newPlacedLayer"}
                    ]);
                   
                    bounds = app.activeDocument.activeLayers[0].bounds;
                    await app.batchPlay([{"_obj":"flattenImage"}]);

                    await app.batchPlay([{"_obj":"set","_target":[{"_property":"workPath","_ref":"path"}],"to":{"_obj":"customShape","bottom":{"_unit":"distanceUnit","_value":-0.36},"keyOriginType":9,"left":{"_unit":"distanceUnit","_value":-1.08},"name":"Pontilhado","right":{"_unit":"distanceUnit","_value":842.04},"top":{"_unit":"distanceUnit","_value":-0.72}}}])
                    await solidColorCamada(0,0,0);
   
                    app.activeDocument.activeLayers[0].translate(0, bounds.bottom+23);
                    await app.batchPlay([{"_obj":"flattenImage"}]);
                    

                    if(modelo.toUpperCase().includes("CLIENTE") || modelo.toUpperCase().includes("PERSONALIZADO") ){await ADDselecaoShapes(79, 0, 184, 0, "IconTecido", 1); padrao=false}   
                    else{await ADDselecaoShapes(79, 0, 184, 0, "IconAlmofadas", 1); padrao= true}
                    await solidColorCamada(0,0,0);
        
                    app.activeDocument.activeLayers[0].translate(bounds.left, bounds.bottom+42)
                    await legendaDados();
                    bounds = app.activeDocument.activeLayers[0].bounds; 

                    //////// DADOS DA ESTAMPA COM BASE NA ORIGEM DO TECIDO
                    if(padrao === true){
                        Legenda = ` ${arte} [${ legenda.substring(2)} ] : • Loja: ${Loja}  • Cliente: ${cliente}`;
                        configNomeA = `[OK! ] ${arte} ${modelo}.png`;  configNomeB= `[OK! ] ${arte} ${modelo} 1.png`
                        }
                        else{
                        Legenda = ` Estampar no Tecido do Cliente • Loja: ${Loja}  • Cliente: ${cliente}`;
                        configNomeA = `[OK! ] ${modelo}.png`;  configNomeB= `[OK! ] ${modelo} 1.png`
                    }
                    ////////XXXXXXXXXXXXXXXXXXXXXXXX
                   
                    xPosition= bounds.left+80; yPosition = bounds.bottom-19;
                    await app.activeDocument.createTextLayer({ name: "datos", contents: Legenda, fontSize: 22, position: {x: xPosition, y: yPosition}, fontName: "Arial"});
                    await app.batchPlay([{"_obj":"flattenImage"}]);

                    ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                    await sequenciaSave( configNomeA, configNomeB);
                    await estampasSave(estampaName); ////// NOME OBTDO DA FUNÇÃO ANTERIOR.
                    const D9ck2 = document.querySelector("#D9-ck2");
                    if(D9ck2.checked==true){ await moveOrigArtes()};
             
                    await app.batchPlay([ {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":estampaName}, ]);

                },{"interactive": true});
        } catch (err) {alert(err) }
    };
    //////////////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

    ////////::::::::::::::::::::
    /////////////// CRIAÇÃO DE MAQUETE 
    async function StampConfigP3(){
        try {
            await core.executeAsModal(async () => {
                    /////// MAPEAMENTO DINÂMICO COM SLICES, TENDO COMO BASE LARGURA E ALTURA DA ESTAMPA.
                    const hG = Number(hConfig+78)+39;
                    const wA = Number(wConfig)+39;
                    const cortDP = { bottonA: hG, leftA: 39, rightA: wA, topA: 39 };
                    maquete ="{mcp-&003}.psd";

                    /////// CHAMA AS FUNÇÃO  SE HAVER UM DOC FRENTE OU VERSO OU UM NOME QUALQUER;
                    async function selecionarDoc3(docId) {
                        await app.batchPlay([{"_obj":"select","_target":[{"_id": docId,"_ref":"document"}]}]);
                        await sliceAdicionar(cortDP.bottonA, cortDP.leftA, cortDP.rightA, cortDP.topA); 
                        await renameThumbSTP("thumbSTP_03", "thumbSTP_04");
                        await saveThumbSTP();
                    }
                    if(estampaExist.length == 0 || estampaExist.length == 1){await selecionarDoc3(docMatriz);}
                    else{await selecionarDoc3(frente); await selecionarDoc3(verso);}
                    await  importMokups(maquete);

                    /////// CONFIGS DO MODELO
                    if(document.getElementById("D9list_MD").selectedIndex===0){
                        await selectCamada("Almof_Cora");
                        await tarngetSTPmd("Frent_AC", "Verso_AC"); cor = "Q-Color";
                    }
                    else if(document.getElementById("D9list_MD").selectedIndex===1){
                        await selectCamada("Almof_Quad"); 
                        await tarngetSTPmd("Frente", "Verso"); cor = "Q-Color";
                    }
                    else if(document.getElementById("D9list_MD").selectedIndex===2){
                        await selectCamada("Almof_Retng"); 
                        await tarngetSTPmd("R-Frente", "R-Veso"); cor = "R-Color";
                    }
                    else{
                        await selectCamada("Almof_Quad"); 
                        await tarngetSTPmd("Frente", "Verso");cor = "Q-Color";
                   } 
                    //////////////::::::::::::::: 
                    async function  tarngetSTPmd(f,v){
                        await app.batchPlay([{"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","opacity":{"_unit":"percentUnit","_value":100.0}}}]);
                        await selectCamada(f); await importarRotulo("thumbSTP_03");
                        await selectCamada(v);  
                        if(estampaExist.length == 0 || estampaExist.length == 1){await importarRotulo("thumbSTP_03")}
                        else{await importarRotulo("thumbSTP_04");}
                    };

                    ////////OBTER AS CORES RGB PARA CANECAS COLORIDAS
                    await selectCamada(cor)
                    const aRgbHex = refColor.match(/.{1,2}/g);
                    await app.batchPlay([ {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"contentLayer","_value":"targetEnum"}],"to":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":parseInt(aRgbHex[2], 16),"grain":parseInt(aRgbHex[1], 16),"red": parseInt(aRgbHex[0], 16),}}}])
                    ////////:::::::::::::::::::

                    await app.batchPlay([{"_obj":"flattenImage"},]);
                    Legenda = `Maquete: ${arte} [${ legenda.substring(2)} ] : • Loja: ${Loja}  • Cliente: ${cliente}`;
                    await app.activeDocument.createTextLayer({ name: "datos", contents: Legenda, fontSize: 15, position: {x: 27, y: 660}, fontName: "Arial"});
                    await app.batchPlay([{"_obj":"flattenImage"}]);

                     ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                    docMatriz = app.activeDocument.id
                    await sequenciaSave(`[Amostra] ${arte}.png`, `[Amostra] ${arte} 1.png`);
                    await estampasSave(estampaName);

                    await app.batchPlay([
                        {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":estampaName},
                        {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                    ]);

                    await ZoomDOC(0); await ZoomDOC(1);
                    await document.querySelector('#processServic').close('OK');

            },{"interactive": true});
        } catch (err) {alert(err)}
    };
    ////////::::::::::::::::::::

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// TODAS AS FUNÇÕES AQUI! ::::::::::::
     /////// CARREGA  OS DADOS DO LOCALSTORAGE...
     /////// SE A CHAVE "D9DadosSave" EXISTIR 
     function carregarDadsosLS(){
        try {
            if (localStorage.getItem('D9DadosSave') !== null) {
                const dadosObjeto = JSON.parse(localStorage.getItem('D9DadosSave'));
                backup     = dadosObjeto.dados1;
                imprmir    = dadosObjeto.dados2;
                maquet    = dadosObjeto.dados3;
                indexLista = dadosObjeto.dados4;
                hDocStart = dadosObjeto.dados5;
                wDocStart = dadosObjeto.dados6;
                moldName =dadosObjeto.dados7;
          
                ///////// SE POR FALHA O  wDocStart RTORNAR "undefined", ADD OS VALORES PADRÕES
                if(wDocStart=== undefined){
                    backup = true;  imprmir = false;  maquet = false;
                    indexLista = 0;  hDocStart = 16.2; wDocStart = 17.6; moldName="SP-Coração1"
                };
            } 
            else {
                ////// SE NÃO EXISTIR CARREGA  OS DADOS PADRÃO
                backup = true;  imprmir = false;  maquet = false;
                indexLista = 0;  hDocStart = 16.2; wDocStart = 17.6; moldName="SP-Coração1"
              };
          } catch (err) {alert(err)};
       };
     ////////:::::::::::::::::::::::::::::::::::::::::::::::
             
     //////// TODAS AS FUNÇÕES AQUI! ::::::::::::
    async function eventosJanelaD9(){
        try {
            ///////// IMGEM TEMA DA JANELA EM FORMAR CODIFICADO
            fetch('icons/B64PNG/BAlmofada.rtf').then(response => response.text()).then(imgB64 => {
                document.querySelector("#D9imgBase64").src=imgB64;
             });
            ///////////:::::::::::::::::::::
            
            /////////// EVENTOS DA DA LISTA DE PRESETS
            document.querySelector("#D9list_MD").addEventListener("change", async evt => {	
                modelo = document.querySelector("#D9list_MD").value.substring(2);
                try {
                       textSelectItens(); exeMaquete()
                      await core.executeAsModal(async () => { await  listaPresetsConfig();});
                } catch (err) {alert(err) }
              });
             ///////////::::::::::::::::::

            ////////////CONFIGS SISTEMA DE ABAS
            document.querySelector("#D9-btn1").classList.add('D9selecionado');
            const D9Btns = document.getElementsByClassName("D9-btAbas");
            const D9Abas = document.getElementsByClassName("D9-Abas");
            const D9Btn = Array.from(D9Btns);
            
            for (let i = 0; i < D9Btn.length; i++) {
                D9Btn[i].addEventListener('click', (event) => {
                    // Esconder todas as abas
                    for (let j = 0; j < D9Abas.length; j++){ D9Abas[j].style.display = 'none';}
                    for (let j = 0; j < D9Btn.length; j++) { D9Btn[j].classList.remove('D9selecionado');}
                    D9Abas[i].style.display = 'block';
                    event.currentTarget.classList.add('D9selecionado');
                    document.querySelector("#acrionsPN3").style.display = "none";
                });
            };

            selecionadorDocs(); ////// CONVIGURA VERSTE E VESO E AMBAS ESTIVEREM ATIVAS
            estampaExe = estampaExist;
           ////////::::::::::::::::::::
            ////////OUVINTES BOÕES DE ENQUADRAMENTO
            controlPosition("#D9AJPose1", "#D9AJPose2", "#D9AJPose3", "#D9AJPose4", "#D9AJPose5","#D9AJPose6", "#D9AJPose7", "#D9AJPose8");
            ////////// EVENTOS FUNCÕES BOTÕES DE RADIO
    
            ///////// ABRIR O MENU DE AJUSTE DE CORES
            const menuAjuste2 = document.querySelector("#D9btn-Cores");
            menuAjuste2.addEventListener('click', (event) => {
                    janelaAjustesx();
                });
            ///////// RESTAURAR INICIAL CONFIGS ESTAMPA
            const restar= document.querySelector("#D9btn-resetar");
            restar.addEventListener('click', (event) => { restauraIniConfig("Iniciar")});
             ////////::::::::::::::::::::
            /////////////// FUNÇÃO PROCESSAMENTO FINAL
            document.querySelector("#D9Btn1").addEventListener('click', async () => { finalProcess(); });
            ///////////////////////////////////////////
            document.querySelector("#D9Btn2").addEventListener('click',async () => {
                 document.querySelector("#dlgAlmofada").close('OK'); 
                    for (let j = 0; j < estampaExe.length; j++) {  
                       await core.executeAsModal(async () => {
                               await resetarConfigs();
                               await app.batchPlay([ {"_obj":"select","_target":[{"_id": estampaExe[j],"_ref":"document"}]}]); 
                           })
                       }
                     if(frentOuverso===true){ await resetarConfigs(); }
            });
            ////////::::::::::::::::::::

            ////////////// ATALHOS CONFIGSXXXXXXXXXXXX
            //////// PRECESSO FINAL 
            document.addEventListener("keydown", almofadasKey);
            async function almofadasKey(event) {
                    if (event.keyCode === 13) {
                        document.removeEventListener("keydown", almofadasKey); // Remove o event listener após o evento ter sido acionado
                        await finalProcess();
                    };
                   ////////// AJUSTAR ENQUADRAMENTO
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
                        document.querySelector("#dlgAlmofada").close('OK'); resetarConfigs();
                        D9AlmofadaEventos=false;
                    };
                };
                ////////////////////:::::::::::::::::
                async function finalProcess(){
                        try { 
                            if(D9AlmofadaEventos === false){return};
                            D9AlmofadaEventos=false;
                            document.querySelector("#dlgAlmofada").close('OK'); 
                            SalvarDados(); // ajustePreview(100, "show");
                            progressDLG("Aquarde Processing . . ."); 
                            function evento() { setTimeout(async() =>{
                                ////////  VERIFICA SE O PRECESSO FINAL 
                                const D9ck5= document.querySelector("#D9-ck5");
                                if(D9ck5.checked==true){ await StampConfigP3() }
                                else{ 
                                    await core.executeAsModal(async () => { 
                                        /////// CHAMA AS FUNÇÃO  SE HAVER UM DOC FRENTE OU VERSO OU UM NOME QUALQUER;
                                        if(estampaExist.length == 0 || estampaExist.length == 1){
                                           await StampConfigP2();
                                           await app.batchPlay([
                                               {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]},{"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}},
                                               {"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"fitOnScreen"}]},
                                           ]);
                                        }
                                         /////// CHAMA AS FUNÇÕES SEQUENCIALMENTE SE HAVER  DOCS FRENTE & VERSO
                                        else{
                                            for (let j = 0; j < estampaExe.length; j++) {  
                                                await app.batchPlay([{"_obj":"select","_target":[{"_id": estampaExe[j],"_ref":"document"}]}]); 
                                                await StampConfigP2()
                                            };
                                            async function selecionarDoc2(docId) {
                                                await app.batchPlay([
                                                    {"_obj":"select","_target":[{"_id": docId,"_ref":"document"}]},{"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}},
                                                    {"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"fitOnScreen"}]},
                                                    {"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"tileVertically"}]},
                                                ]);
                                            }
                                             await selecionarDoc2(frente); await selecionarDoc2(verso);
                                        }
                                        await document.querySelector('#processServic').close('OK');
                                    },{"interactive": true});

                                };
                            ////////:::::::::::::::::::::::::::::::::::::::::::::
                          }
                       )} setTimeout(evento, 1000);//////depois alterar para 1000
                      } catch (err) {alert(err)};
                 };
                 ////////::::::::::::::::::::::::::::
                 
            /////// CHECKBOC PREVIEW
            const D9Ck4 = document.querySelector("#D9-ck4");
            D9Ck4.addEventListener('click', (event) => {
                if(D9Ck4.checked == true){ ajustePreview(100, "show")}
                else{ ajustePreview(0, "hide")}; 
            });
            ////////::::::::::::::::::::

            configsListaModel();////// CONFIGUÇOES DA LISTA 
            ////// OBTEM OS  VALORES NA FUNÇÃO (carregarDadsosLS())
            carregarDadsosLS(); 
            try {
                document.querySelector("#D9-ck2").checked = backup; // D9-ck2   backup
                document.querySelector("#D9-ck3").checked = imprmir // D9-ck3   imprimir
                document.querySelector("#D9-ck5").checked = maquet;  // D9-ck5   maquete,   
                document.getElementById("D9list_MD").selectedIndex = indexLista;  // Index Lista presets
              } catch (err) {alert(err)}
            /////////:::::::::::::::
  
            textSelectItens(); 
            LegendaModelo = legenda.substring(2);
            exeMaquete();  
            const status = `Largura ${Number(lagura).toFixed(1)}cm | Altura: ${Number(altura)}cm`
            document.querySelector("#statusPresset").textContent= status;
    
        } catch (err) {  alert(err)   }
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// TODAS AS FUNÇÕES AQUI! ::::::::::::

    /////// SALVAR  DINAMICAMENTE OS DADOS
    function SalvarDados(){
        textSelectItens(); 
        const dadosD9 = {
            dados1: document.querySelector("#D9-ck2").checked, // D9-ck2   backup
            dados2: document.querySelector("#D9-ck3").checked, // D9-ck3   imprimir
            dados3: document.querySelector("#D9-ck5").checked, // D9-ck5   maquete, 
            dados4: document.getElementById("D9list_MD").selectedIndex,
            dados5: altura, 
            dados6: lagura,
            dados7: molde 
        };
        localStorage.setItem('D9DadosSave', JSON.stringify(dadosD9));
    };
    /////////::::::::::::::::::

    //////// PREVISUALIZAR AJUSTES
    async function ajustePreview(v1,v2){
        try {
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
        } catch (err) {}
    };
   
    ////// CARREGAR JALELA PRINCIPAL
    async function dlgAlmofada() {
        D9AlmofadaEventos=true;
        fetch('html/D9Almofada.html').then(response => response.text()).then(data => {
            D9dlg = document.querySelector("#dlgAlmofada");
            D9dlg.show({ title: `PS-fxrios: Canecas Personalizadas!`, resize: "both", size: { width:367, height:290}})
            D9dlg.innerHTML = data; 
            D9dlg.addEventListener('load', evt => { setTimeout(() =>{ document.getElementById('D9-ck5').focus();}, 150) });
            eventosJanelaD9(); 
           });
    };
      
      //////////// CONFIGURAÇÕES DA LISTA DE CANECAS
      function configsListaModel(){
            try {
                corregarLista();
                async function corregarLista() {
                    try {
                        conteudoD9_Obj = new Array();  
                        D9list_MD = document.getElementById("D9list_MD");
                        //// RESGATA DO LOCALSTORAG SE NAO EXISTIR ADICIONA OS ITENS PADROES:
                        conteudoD9_Obj = JSON.parse(localStorage.getItem("conteudoD9")) ||  [
                                { 
                                    Legenda: "✅  Formato Coração", 
                                    CodigoCor:"ffffff", 
                                    Largura: 17.6,
                                    Altura: 16.2,
                                    Molde:"SP-Coração1",
                                    Maquet: true
                                },{
                                    Legenda: "✅  Padrão Branco", 
                                    CodigoCor:"ffffff",
                                    Largura: 29.2,
                                    Altura: 29.2,
                                    Molde: "SP-N Quad",
                                    Maquet: true
                                },{
                                    Legenda: "✅  Retangular Branco", 
                                    CodigoCor:"ffffff",
                                    Largura: 37.4,
                                    Altura: 28.9,
                                    Molde: "SP-N Quad",
                                    IconMD: "sp_07i.svg",
                                    Maquet: true
                                },
                            ];
                        conteudoD9 = conteudoD9_Obj.map(function (itemList) { return itemList.Legenda }); 
                        ////////// FUNC ADD OS ITENS DO ARRAY NA LISTA
                        for (var i = 0; i < conteudoD9.length; i++) { D9list_MD.insertAdjacentHTML("beforeend", `<option>${conteudoD9[i]}</option>`); }
                    } catch (err) {alert(err) }
                }
                
               /////// ADD PRESETES BOTÃO
               document.querySelector("#D9AddPresets").addEventListener("click", async () => {
                    dlgPresetsAlmof(); document.querySelector("#D9PresetNome").value = "Novo Presset";
                    document.getElementById('addSPButton').textContent= "Add Moldura";
                    document.getElementById('iconSP').style.backgroundImage = `url('icons/Shapes/sp_df.svg')`;
                    process = "adicionar";
                  });
                
                ////////// EDITAR ITEM DA LISTA
                document.querySelector("#D9btnEdit").addEventListener("click", async () => {
                    try {
                        if(document.getElementById("D9list_MD").selectedIndex<4){alertar("Esse item não pode ser Editado!")}
                        else{
                            dlgPresetsAlmof();  
                            textSelectItens(); //// RESGATA TODAS O VALORES ATUAS DAS CHAVE DA LISTA 
                            document.querySelector('#D9btnColor').style.background = `#${refColor}`
                            document.querySelector("#D9PresetNome").value = legenda.substring(2)///
                            document.getElementById("D9preEt1").value = altura;
                            document.getElementById("D9preEt2").value = lagura;
                            document.querySelector("#D9-ckOM").checked = maqueteADD;
                            document.getElementById('iconSP').style.backgroundImage = `url('icons/Shapes/${iconShap}')`
                            document.getElementById('addSPButton').textContent= molde;
                            moldeItem =  molde;
                         };
                         process = null;
                     } catch (err) {alert(err)};
                });
                
                ////////// RESETA LISTA
                document.querySelector("#D9btnDesfault").addEventListener("click", async evt => {
                    confiramar("Todos os presets adicionados seram removidos! Você deseja  removê-los?");
                    document.querySelector("#confirm_btn2").addEventListener("click", async () => {
                        dlg.close('OK'); 
                        D9list_MD.innerHTML = "";
                        localStorage.removeItem("conteudoD9"); 
                        localStorage.removeItem('D9DadosSave')
                        corregarLista();
                        textSelectItens();
                        /////// ATUALIZA A NOVA CONFIGURAÇÃO
                        await core.executeAsModal(async () => {  await  listaPresetsConfig() });
                    });
                });
               
                ////////// REMOVE ITEM SELECIONADDO
                document.querySelector("#D9btnRemover").addEventListener("click", async evt => {
                    const item = Number(D9list_MD.selectedIndex);
                    if (item < 4) { alertar("Você não pode remover esse ítem, faz parte dos presets do Sistema!"); return }
                    else if (conteudoD9_Obj.length == 5) { D9list_MD.innerHTML = ""; localStorage.removeItem("conteudoD9"); corregarLista(); }
                    else { conteudoD9_Obj.splice(item, 1); atualizaLista(); }
                    document.querySelectorAll('#D9list_MD option:last-child').item(0).selected = true;
                    textSelectItens();
                    /////// ATUALIZA A NOVA CONFIGURAÇÃO
                    await core.executeAsModal(async () => {  await  listaPresetsConfig() });
                });
                
                ///////////// AÇÃO DO BOTÃO OK DA JANELA ADD PRESSETS
                document.querySelector("#D9btnOK").addEventListener("click", async () => {
                    if(process =="adicionar"){if(document.getElementById('addSPButton').textContent== "Add Moldura"){alertar("Selecione a Moldura!"); return}}
                    savePresets(); 	textSelectItens();
                });
                ////////XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

                document.querySelector("#D9btnClose").addEventListener("click", async () => {
                    document.querySelector('#dlgPresetsAlmof').close('OK');
                });

                document.querySelector("#D9-ckOM").addEventListener("click", async () => {
                    if(document.querySelector("#D9-ckOM").checked ==true){ MaqueteOP = true } 
                    else{ MaqueteOP = false }
                });

                if(document.querySelector("#D9-ckOM").checked ==true){ MaqueteOP = true } 
                else{ MaqueteOP = false }
                
                function dlgPresetsAlmof() {
                    document.querySelector("#dlgPresetsAlmof").show({ title: "Pressets Preferences!", resize: "both", size: { width: 300, height: 280} })
                   function temporizador() { document.querySelector("#D9PresetNome").focus(), 16 }
                    setTimeout(temporizador, 100);
                    document.querySelector('#D9btnColor').style.background = '#FFFFFF'
                    /////////// RETORNA VALORES PADRÕES AO ADICIONAR UM NOVO PRESSET;
                    document.getElementById("D9preEt1").value =29.2;
                    document.getElementById("D9preEt2").value = 29.2;
               };
                
               async function savePresets() {
                    if (process == "adicionar"){ novoItemADD();} else {edidadoOKItem()}
                    textSelectItens()
                    exeMaquete()
                    document.querySelector("#D9-ck5").checked= false
                 };

              async function novoItemADD(){
                    try {
                        altura = document.getElementById("D9preEt1").value;
                        largura = document.getElementById("D9preEt2").value;
                    }
                     catch (err) {
                        altura = document.getElementById("D9preEt1").value.replace(",", "."); ///////// REMOVE VIRGURA E ADD O PONTO
                        largura = document.getElementById("D9preEt2").value.replace(",", "."); ///////// REMOVE VIRGURA E ADD O PONTO
                    }
                    configNomeBreset = "✅ " + document.getElementById("D9PresetNome").value;
                    molde = moldeItem;
                    iconShap = iconSP;

                    var presetsExistents = conteudoD9_Obj.map(function (itemList) {return itemList.Legenda});
                    if(configNomeBreset == "✅ Novo Presset" || configNomeBreset == "✅ ") {alertar("Adicione nome do preset!"); return;}
                    else if(presetsExistents.includes(configNomeBreset) == true) {alertar("Esse preset já consta na lista, adicione outro nome!"); return;}
                    else{
                        try {
                            document.querySelector('#dlgPresetsAlmof').close('OK');
                            try {codigoColor = corHexObtida;} catch (err) {codigoColor = "ffffff"}/////// RETORNA BRANCO SE NÃO BUSCAR UMA COR PELO SELETOR
                            if (conteudoD9_Obj.length == 3) {conteudoD9_Obj.splice(6, 0, {Legenda: "-", CodigoCor: "-" })};
                            conteudoD9_Obj.push({ Legenda: configNomeBreset, CodigoCor: codigoColor, Largura: largura,  Altura: altura, Molde: molde, IconMD: iconShap, Maquet: MaqueteOP }); /////////////////////////////////////////////////////
                            var conteudoD9 = conteudoD9_Obj.map(function (itemList) { return itemList.Legenda });
                            localStorage.setItem("conteudoD9", JSON.stringify(conteudoD9_Obj));
                            D9list_MD.innerHTML = "";
                            for (var i = 0; i < conteudoD9.length; i++) { D9list_MD.insertAdjacentHTML("beforeend", `<option>${conteudoD9[i]}</option>`); }
                            document.querySelectorAll('#D9list_MD option:last-child').item(0).selected = true;
                            /////// ATUALIZA A NOVA CONFIGURAÇÃO EM TEMPO REAL                       
                            await core.executeAsModal(async () => {  await  listaPresetsConfig() });
                        } catch (err) {alert(err) } 
                     };
                };
                
                async function edidadoOKItem(){
                    try {
                        configNomeBreset = "✅ " + document.getElementById("D9PresetNome").value;
                        if(configNomeBreset == "✅ ") {alertar("Adicione nome do preset!"); return;} 
                        try {codigoColor = corHexObtida;} catch (err) {codigoColor = refColor}
                        try {
                            altura = document.getElementById("D9preEt1").value;
                            largura = document.getElementById("D9preEt2").value;
                        }
                         catch (err) {
                            altura = document.getElementById("D9preEt1").value.replace(",", "."); ///////// REMOVE VIRGURA E ADD O PONTO
                            largura = document.getElementById("D9preEt2").value.replace(",", "."); ///////// REMOVE VIRGURA E ADD O PONTO
                        }
                        molde = moldeItem;
                        iconShap = iconShap;
                        document.querySelector('#dlgPresetsAlmof').close('OK');

                        try {conteudoD9_Obj.splice(sel, 1, { Legenda: configNomeBreset, CodigoCor: codigoColor, Largura: largura,  Altura: altura, Molde: molde, IconMD: iconShap, Maquet: MaqueteOP});}
                        catch(e){alert(e) };
                        atualizaLista();
                        D9list_MD.selectedIndex = sel;
                       /////// ATUALIZA A NOVA CONFIGURAÇÃO EM TEMPO REAL                       
                        await core.executeAsModal(async () => { await  listaPresetsConfig() }); 
                    } catch (err) {alert(err)}
                }
                
                async function atualizaLista() {
                    var conteudoD9 = conteudoD9_Obj.map(function (itemList) { return itemList.Legenda });
                    localStorage.setItem("conteudoD9", JSON.stringify(conteudoD9_Obj)); //// Salva no localStorage
                    conteudoD9_Obj = JSON.parse(localStorage.getItem("conteudoD9"));  //// Resgata do localStorage
                    D9list_MD.innerHTML = "";  //// Esvazia a lista;
                    for (var i = 0; i < conteudoD9.length; i++) { D9list_MD.insertAdjacentHTML("beforeend", `<option>${conteudoD9[i]}</option>`); } //// Adiciona os itens atualizados;

                 }
                
                document.getElementById('D9btnColor').addEventListener('click', async () => {
                    await core.executeAsModal(async () => {
                        const result = await app.batchPlay([{ _obj: "showColorPicker", _target: [{ _ref: "application" }], color: { _obj: 'RGBColor', red: 0, green: 0, blue: 0, } }], {});
                        const color = result[0].RGBFloatColor ?? null;
                        if(color.red == 0 && color.grain==0 && color.blue==0){return}//// AO CANCELAR A JANELA COLORPICKER, VALORES RGB SERAM 0,0,0 ENTÃO INTEROMPER AQUI!
                        color && (document.querySelector('#D9btnColor').style.backgroundColor = `rgb(${color.red} ${color.grain} ${color.blue})`)
                        //RGB to HEX conversion
                        const rgbToHex = (r, g, b) => [r, g, b].map(x => {
                            const hex = x.toString(16)
                            return hex.length === 1 ? '0' + hex : hex
                        }).join('');
                        corHexObtida = rgbToHex(parseInt(color.red), parseInt(color.grain), parseInt(color.blue));
                    })
                });
                galeriaShapes();/////// FUNÇÕE DA NAVEGAÇÃO GALERA SHAPES MODELOS
                //////// FOCAR JANELA MODAL
                modalFocus(D9dlg, "D9focus") ;
             } catch (err) {alert(err)}
    };
    //////////////:::::::::::::::
    //// RESGATA TODAS O VALORES ATUAS DAS CHAVE DA LISTA 
    async function textSelectItens(){
        sel = D9list_MD.selectedIndex;
        legenda         = conteudoD9_Obj.map(function (itemList) { return itemList.Legenda;   })[sel];
        refColor         = conteudoD9_Obj.map(function (itemList) { return itemList.CodigoCor; })[sel];
        lagura           = conteudoD9_Obj.map(function (itemList) { return itemList.Largura;     })[sel];
        altura            = conteudoD9_Obj.map(function (itemList) { return itemList.Altura;       })[sel];
        molde           = conteudoD9_Obj.map(function (itemList) { return itemList.Molde;       })[sel];
        iconShap       = conteudoD9_Obj.map(function (itemList) { return itemList.IconMD;     })[sel];
        maqueteADD = conteudoD9_Obj.map(function (itemList) { return itemList.Maquet;     })[sel];
    };

    function exeMaquete(){
        if( maqueteADD == false){ document.querySelector("#D9-ck5").disabled=true;  document.querySelector("#txtMauet").classList.add('labelDisable'); }  
        else{ document.querySelector("#D9-ck5").disabled=false; document.querySelector("#txtMauet").classList.remove('labelDisable'); }  
    };
    
    /////// FUNÇÕE DO SLIDER GALERAI SHAPES MODELOS
    function galeriaShapes() {
        totalScroll = 0;
        scrollAmount = -66;
        document.getElementById('leftButton').addEventListener("click", () => {
            try {
                document.getElementById('rightButton').classList.remove('D9-Desabilitado');
                content = document.getElementById("scrollContent");
                totalScroll += scrollAmount;
                content.style.transform = `translateX(${totalScroll-396}px)`;
                
                if(document.getElementById("scrollContent").offsetLeft== -330){
                document.getElementById('leftButton').classList.add('D9-Desabilitado');
                }
           } catch (err) {alert(err)}
    });
    document.getElementById('rightButton').addEventListener("click", () => {
        try {
            document.getElementById('leftButton').classList.remove('D9-Desabilitado');
            content = document.getElementById("scrollContent");
            totalScroll -= scrollAmount;
            content.style.transform = `translateX(${totalScroll-396}px)`;
            if(document.getElementById("scrollContent").offsetLeft == -66){
              document.getElementById('rightButton').classList.add('D9-Desabilitado');
            }
        } catch (err) {alert(err) }
    });

    ///////EXIBIR O PAINEL SELELECIONAR SHAPES
    document.getElementById('fecharButton').addEventListener("click", () => {
        document.getElementById("painelShapes").style.display = "none"
    })
    
    //////// BOTÃO ADD SHAPES
    document.getElementById('addSPButton').addEventListener("click", () => {
        document.getElementById("painelShapes").style.display = "flex"
    })
  
    ///////OBTEM O INDICE E O VALUE REFERENTE
    const elementos = document.getElementsByClassName("SP-itens");
        try {
            const shapeBtn = Array.from(elementos);
            for (let i = 0; i < shapeBtn.length; i++) { 
                shapeBtn[i].addEventListener('click', (event) => {
                    const clickedElement = event.currentTarget;
                    for (let j = 0; j < shapeBtn.length; j++) {  
                        shapeBtn[j].classList.remove('shepSel');
                    }
                    clickedElement.classList.add('shepSel');
                    index = shapeBtn.indexOf(clickedElement);
                    moldeItem = clickedElement.getAttribute('data-value'); 
                    iconSP= clickedElement.getAttribute('data-value2');
                    document.getElementById('addSPButton').textContent= moldeItem;
                    document.getElementById("painelShapes").style.display = "none"
                    document.getElementById('iconSP').style.backgroundImage = `url('icons/Shapes/${iconSP}')`;
                })
            }
           // document.getElementById('addSPButton').textContent= molde
        } catch (err) {alert(err)}
}
/////////:::::::::::::::::::::::

/////////ADICIONAR O CORTE DA ESTAMPA
async function sliceAdicionar(bot,left,righ,top){
    await app.batchPlay([
    {"_obj":"make","_target":[{"_ref":"slice"}],"using":{"_obj":"slice","at":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":bot},"left":{"_unit":"pixelsUnit","_value":left},"right":{"_unit":"pixelsUnit","_value":righ},"top":{"_unit":"pixelsUnit","_value":top}},"type":{"_enum":"sliceType","_value":"user"}}},
    //{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"toggleShowExtras"}]}
    ]);
};

//////// CONFIGURAÇÃO INICIAL DO MOLDE DAS ESTAMPAS 
async function configMoldes(h, w ){ /// 1 altura - 2 largura - 3 bottom  - 4 right - 5 shap molde 6 snapshot name
     sh= Number(hConfig);  sw=Number( wConfig); spname= moldName;
    await app.batchPlay([
        {"_obj":"flattenImage"},
        {"_obj":"set","_target":[{"_property":"background","_ref":"layer"}],"layerID":121,"to":{"_obj":"layer","mode":{"_enum":"blendMode","_value":"normal"},"name":"Conteudo","opacity":{"_unit":"percentUnit","_value":100.0}}},
        {"_obj":"newPlacedLayer"},
        {"_obj":"imageSize","constrainProportions":true,"height":{"_unit":"pixelsUnit","_value":h},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"resolution":{"_unit":"densityUnit","_value":200.0},"scaleStyles":true},
        {"_obj":"canvasSize","horizontal":{"_enum":"horizontalLocation","_value":"center"},"width":{"_unit":"pixelsUnit","_value":w}},
        {"_obj":"adaptCorrect","blackClip":0.01,"center":0,"colorCorrection":0,"highlightMode":{"_obj":"adaptCorrectTones","amount":{"_unit":"percentUnit","_value":0.0},"radius":0,"width":{"_unit":"percentUnit","_value":0.0}},"shadowMode":{"_obj":"adaptCorrectTones","amount":{"_unit":"percentUnit","_value":0.0},"radius":0,"width":{"_unit":"percentUnit","_value":0.0}},"whiteClip":0.01},
        {"_obj":"reset","_target":[{"_property":"colors","_ref":"color"}]},
        {"_obj":"make","_target":[{"_ref":"layer"}],"below":true,"layerID":123},
        {"_obj":"make","_target":[{"_ref":"contentLayer"}],"using":{"_obj":"contentLayer","type":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":255.0,"grain":255.0,"red":255.0}}}},
        {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","name":"Background"}},
        {"_obj":"select","_target":[{"_name":"Conteudo","_ref":"layer"}],"layerID":[122],"makeVisible":false},
        {"_obj":"make","_target":[{"_ref":"snapshotClass"}],"from":{"_property":"currentHistoryState","_ref":"historyState"}},
        {"_obj":"select","_target":[{"_name":"Snapshot 1","_ref":"snapshotClass"}]},
        {"_obj":"set","_target":[{"_property":"currentHistoryState","_ref":"historyState"}],"to":{"_obj":"snapshotClass","name":"Default"}},
        {"_obj":"newGuideLayout","guideLayout":{"$GdCA":0,"$GdCB":255,"$GdCG":132,"$GdCR":74,"_obj":"guideLayout","marginBottom":{"_unit":"distanceUnit","_value":0.0},"marginLeft":{"_unit":"distanceUnit","_value":0.0},"marginRight":{"_unit":"distanceUnit","_value":0.0},"marginTop":{"_unit":"distanceUnit","_value":0.0}},"guideTarget":{"_enum":"guideTarget","_value":"guideTargetCanvas"},"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}},
        /////////ADICIONAR SHAPE PESONALIZADA****************
        {"_obj":"set","_target":[{"_property":"workPath","_ref":"path"}],"to":{"_obj":"customShape","bottom":{"_unit":"pixelsUnit","_value":sh},"keyOriginType":9,"left":{"_unit":"pixelsUnit","_value":0.0},"name":spname,"right":{"_unit":"pixelsUnit","_value":sw},"top":{"_unit":"pixelsUnit","_value":0.0}}},
        {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_property":"workPath","_ref":"path"},"vectorMaskParams":true,"version":1},
        {"_obj":"select","_target":[{"_property":"workPath","_ref":"path"}]},
        {"_obj":"delete","_target":[{"_property":"workPath","_ref":"path"}]},
       // {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}},
        {"_obj":"make","at":{"_enum":"channel","_ref":"channel","_value":"mask"},"new":{"_class":"channel"},"using":{"_enum":"userMaskEnabled","_value":"revealSelection"}},
        {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","userMaskLinked":false}},
        {"_obj":"canvasSize","height":{"_unit":"distanceUnit","_value":28.44},"horizontal":{"_enum":"horizontalLocation","_value":"center"},"relative":true,"vertical":{"_enum":"verticalLocation","_value":"center"},"width":{"_unit":"distanceUnit","_value":28.44}}
    ], {});
    await loadAjustes(); 
    await app.batchPlay([
        {"_obj":"selectAllLayers","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]},
        {"_obj":"make","_target":[{"_ref":"layerSection"}],"from":{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"},"layerSectionEnd":23,"layerSectionStart":22,"name":"Group 1"},
        {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","name":"ConfigsOBJ"}},
        {"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}
    ], {});
};

//////// CONFIGURAÇÃO  DO MOLDE DAS ESTAMPAS  VIA LISTA
async function configItensMD(h,w){
    sh= Number(hConfig);  sw=Number( wConfig); spname= molde;
    await app.batchPlay([
        {"_obj":"select","_target":[{"_name":"Default","_ref":"snapshotClass"}]},
        {"_obj":"imageSize","constrainProportions":true,"height":{"_unit":"pixelsUnit","_value":h},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"scaleStyles":true},
        {"_obj":"canvasSize","horizontal":{"_enum":"horizontalLocation","_value":"center"},"width":{"_unit":"pixelsUnit","_value":w}},
        {"_obj":"newGuideLayout","guideLayout":{"$GdCA":0,"$GdCB":255,"$GdCG":132,"$GdCR":74,"_obj":"guideLayout","marginBottom":{"_unit":"distanceUnit","_value":0.0},"marginLeft":{"_unit":"distanceUnit","_value":0.0},"marginRight":{"_unit":"distanceUnit","_value":0.0},"marginTop":{"_unit":"distanceUnit","_value":0.0}},"guideTarget":{"_enum":"guideTarget","_value":"guideTargetCanvas"},"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}},
        /////////ADICIONAR SHAPE PESONALIZADA****************
        {"_obj":"set","_target":[{"_property":"workPath","_ref":"path"}],"to":{"_obj":"customShape","bottom":{"_unit":"pixelsUnit","_value":sh},"keyOriginType":9,"left":{"_unit":"pixelsUnit","_value":0.0},"name":spname,"right":{"_unit":"pixelsUnit","_value":sw},"top":{"_unit":"pixelsUnit","_value":0.0}}},
        {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_property":"workPath","_ref":"path"},"vectorMaskParams":true,"version":1},
        {"_obj":"select","_target":[{"_property":"workPath","_ref":"path"}]},
        {"_obj":"delete","_target":[{"_property":"workPath","_ref":"path"}]},
        {"_obj":"make","at":{"_enum":"channel","_ref":"channel","_value":"mask"},"new":{"_class":"channel"},"using":{"_enum":"userMaskEnabled","_value":"revealSelection"}},
        {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","userMaskLinked":false}},
        {"_obj":"canvasSize","height":{"_unit":"distanceUnit","_value":28.44},"horizontal":{"_enum":"horizontalLocation","_value":"center"},"relative":true,"vertical":{"_enum":"verticalLocation","_value":"center"},"width":{"_unit":"distanceUnit","_value":28.44}}
    ], {});
    await loadAjustes(); 
    await app.batchPlay([
        {"_obj":"selectAllLayers","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]},
        {"_obj":"make","_target":[{"_ref":"layerSection"}],"from":{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"},"layerSectionEnd":23,"layerSectionStart":22,"name":"Group 1"},
        {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","name":"ConfigsOBJ"}},
        {"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}
    ], {});
    exeMaquete();
    const status = `Largura ${Number(lagura).toFixed(1)}cm | Altura: ${Number(altura)}cm`
    document.querySelector("#statusPresset").textContent= status;
};
///////////::::::::::::::::::::::::::::::

async function  listaPresetsConfig(){
    textSelectItens();
    ///// CALCULAR CIRCUNFEÊNCIA APATIR DO VALOR  DA CAIXA DE TEXTO DA JANELA PRESSETS
    wConfig = Number(lagura/2.54*resol).toFixed(0); ////// CONVERTE PARA DE CM PARA PX
    hConfig  = Number(altura/2.54*resol).toFixed(1);  ////// CONVERTE PARA DE CM PARA PX
  
    app.activeDocument.activeHistoryState = app.activeDocument.historyStates [3];
    await app.batchPlay([{"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}, {"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}]);

    await configItensMD( Number(hConfig), Number(wConfig)) /// 1 altura - 2 largura
    gethDOC = Number(hConfig); getwDOC = Number(wConfig);
    creatSnapshot("Iniciar");

    await ZoomDOC(0); 
    ///////STATUS PRESSETS
    const status = `Largura ${Number(lagura).toFixed(1)}cm | Altura: ${Number(altura)}cm`
    document.querySelector("#statusPresset").textContent= status;
    exeMaquete();
    configsPositions(5, null);/////// PREENCHE A IMAGEM EM TODAS ESTENSÃO DO DOCUEMNTO
    document.querySelector("#D9-ck5").checked=false;
};

 ////// VERIFICA SE EXISTE ALGUMA  ESTAMPA JA CONFIGURA PARA ADICIONAR NA LISTA DE LAYOULT
async function selecionadorDocs(){
        document.querySelector("#D9btn-frente").addEventListener("click", async evt =>{ await statusBtnSelSocs(frente);});
        document.querySelector("#D9btn-Verso").addEventListener("click", async evt => {await statusBtnSelSocs(verso); });
        ///////DESABILITAR O BOTÃO SELECIONAR O A ESTAMPA VERSO E A MASMA NÃO EXISTIR
        if(estampaExist.length ===1 ||estampaExist.length ===0){
            document.querySelector("#D9btn-Verso").classList.add('D9-Desabilitado')
            document.querySelector("#D9btn-frente").classList.add('D9-Ativado'); 
        }
        else{document.querySelector("#D9btn-Verso").classList.add('D9-Ativado');}
  };

async function statusBtnSelSocs(lado){
    await core.executeAsModal(async () => {await app.batchPlay([ {"_obj":"select","_target":[{"_id": lado,"_ref":"document"}]}]);});
    if(app.activeDocument.id  == verso){ document.querySelector("#D9btn-frente").classList.remove('D9-Ativado');  
    document.querySelector("#D9btn-Verso").classList.add('D9-Ativado');
    }
    else{ 
        document.querySelector("#D9btn-frente").classList.add('D9-Ativado');  
        document.querySelector("#D9btn-Verso").classList.remove('D9-Ativado');
    }
}

function idenficadorDcs(){
    ImgConteudo = app.documents;
    for (let i = 0; i < ImgConteudo.length; i++) {
        frentOuverso = false;
        var doc = app.documents[i];
        if (ImgConteudo[i].name.toUpperCase().includes("FRENTE") || ImgConteudo[i].name.toUpperCase().includes("VERSO")) { 
            estampaExist.push(ImgConteudo[i].id);
        }
        else{frentOuverso= true}
    };
    frente = estampaExist[0];  verso  = estampaExist[1];
}

/////// EVITAR SOBREPOR  IMAGENS DA MAQUETE
async function renameThumbSTP(remover, adicionar){
    try {
        dirSTP =`${Usuario}/AppData/Roaming/temp_stamps/images/`;
        folder = await fs.getEntryWithUrl(dirSTP);
        imagens = await folder.getEntries();  
        try { file = await folder.getEntry(`${remover}.jpg`); exts="jpg"}catch (e){};
        try { file = await folder.getEntry(`${remover}.png`);exts="png"}catch (e){};
         if(imagens.length>0){file.moveTo(folder, { newName: `${adicionar}.${exts}`, overwrite: true }); file.remove()}
    } catch (err) {}
};

async function importarRotulo(img){
    dirTemplates = `${Usuario}/AppData/Roaming/temp_stamps/images/`;
    try {await carregThumbSTP(`${dirTemplates}${img}.jpg` );}catch (e){};
    try {await carregThumbSTP(`${dirTemplates}${img}.png`);}catch (e){};
};