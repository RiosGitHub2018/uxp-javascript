    //////////////////////////////////////////////////////////////////
    shapStamp = false;
    const inciarD8 = document.querySelector("#serv-btn10");
    inciarD8.addEventListener("click", async (event) => {
        if (event.altKey || event.metaKey) { await docEstampa(277.92, 552.6, "Caneca")} 
        else { process = true; await incialConfigs() ;}
    });

    ///FUNCTION incialConfigs INCIAR
    async function incialConfigs() {
            /////// RESETAR EVENTOS DE TODAS AS JANELAS
            dialogsEventsFalse();
            ////////////////////////////////
            if(app.documents.length==0){  const f = await fs.getFileForOpening(); if(f){await core.executeAsModal(() => app.open(f));} if(f==null){ return};}
            StampConfigP1();
            doc= app.activeDocument;
            resol = 200 //app.activeDocument.resolution;
            gethDOC = app.activeDocument.height;
            getwDOC = app.activeDocument.width;
            shapStamp = true;
            MaqueteOP = false;
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
                if(estampar){
                    alertar(`"${app.activeDocument.name}" já foi processado!\nAdicione um documento válido!`);  process="msgAlertas"; focarJanela(); }
                    else{exeConfigP1()}
                });
            };
        if(process == false){return}else{exeConfigP1()};

        async function exeConfigP1(){
            await refeshDocumento();
             try {
               progressDLG("Aquarde Processing . . ."); 
               function evento() { setTimeout(() =>configurar());} setTimeout(evento, 500);
               //////////CONFIGURAÇÃO INICIAL 
               async function configurar() {
                   await core.executeAsModal(async () => {
                       try {
                            estampaExist = [];
                            existentEstampas();
                            docMatriz = app.activeDocument.id;   
                            diretorioDoc = app.activeDocument.path.replace(/\\[^\\]*$/, "");
                            arte = "Caneca";
                            criarPasta(`${Usuario}/AppData/Roaming`, "temp_stamps");
                            ////// AÇÕES DE EVENTOS AQUI! //////////////////////////////////////////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                            carregarDadsosLS();////// OBTEM OS  VALORES NA FUNÇÃO (carregarDadsosLS())

                            ///// CALCULAR CIRCUNFEÊNCIA APATIR DO VALOR DO DIÂMETRO NA CX DE TEXTO
                            const diametro = Number(wDocStart*3.14); ////// DIAMETRO*CONSTATE 3.14
                            const percentagem = 23.3; /// INTERVALO: ESPAÇO DA ALÇA
                            const reducao = diametro * (percentagem / 100);
                            const circunferencia = diametro - reducao;///LARGURA FINAL DA ESTAMPA
                            wConfig = Number(circunferencia/2.54*resol).toFixed(0); ////// CONVERTE PARA DE CM PARA PX
                            hConfig  = Number(hDocStart/2.54*resol).toFixed(1);  ////// CONVERTE PARA DE CM PARA PX

                            await configMoldes(Number(hConfig), Number(wConfig)) /// 1 altura - 2 largura
                            gethDOC = Number(hConfig); getwDOC = Number(wConfig);
                            configsPositions(5, null);/////// PREENCHE A IMAGEM EM TODAS ESTENSÃO DO DOCUEMNTO
                            creatSnapshot("Iniciar");

                            await ZoomDOC(0); 
                            if(indexLista ==4){ await ZoomDOC(1); };
                            await document.querySelector('#processServic').close('OK');
                            await dlgCanecas();
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

    //////////////////////////////////////////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    /////////////// CRIAÇÃO DA ESTAMPA DE IMPRESSÃO
     async function StampConfigP2(){
        await core.executeAsModal(async () => {  
            try {
                textSelectItens();      
                modelo = document.querySelector("#D8list_MD").value.substring(2);

                const larguraBase = Number(lagura*3.14); ////// DIAMETRO*CONSTATE 3.14
                if(document.getElementById("D8list_MD").selectedIndex<6){ rotacionarDoc =true}
                else{if( larguraBase <19){rotacionarDoc = false;} else{rotacionarDoc = true}}
                
                anchorPos = require('photoshop').constants.AnchorPosition;
                await selectCamada("Conteudo");
                app.activeDocument.activeLayers[0].scale(-100, 100); mat = "PORCELANA";

                if(modelo ==" Dupla"){await configDupla()} else{ await configBasica()};
                /////// CONFIGURAÇÕES CANECA DUPLA
                async function configDupla(){
                    app.activeDocument.resizeCanvas(1654, 2323, anchorPos.TOPCENTER);
                    await app.batchPlay([{"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","userMaskLinked":true}}]);
                    app.activeDocument.activeLayers[0].translate(0, 18); 

                    await app.batchPlay([
                        {"_obj":"newPlacedLayer"},
                        {"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]},
                        {"_obj":"transform","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSSide0"},"height":{"_unit":"percentUnit","_value":84.23077715522965},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"bilinear"},"offset":{"_obj":"offset","horizontal":{"_unit":"distanceUnit","_value":0.0},"vertical":{"_unit":"distanceUnit","_value":0.0}},"width":{"_unit":"percentUnit","_value":84.23077715522967}},
                        {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":716.0},"left":{"_unit":"pixelsUnit","_value":264.0},"right":{"_unit":"pixelsUnit","_value":827.0},"top":{"_unit":"pixelsUnit","_value":35.0}}},
                        {"_obj":"cut"}, {"_obj":"paste","antiAlias":{"_enum":"antiAliasType","_value":"antiAliasNone"},"as":{"_class":"pixel"},"inPlace":true},
                        {"_obj":"transform","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"bilinear"},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":-140.45058930190388},"vertical":{"_unit":"pixelsUnit","_value":6.0}}},
                        {"_obj":"select","_target":[{"_name":"Conteudo","_ref":"layer"}],"layerID":[15],"makeVisible":false},
                        {"_obj":"transform","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"bilinear"},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":120.95013599274694},"vertical":{"_unit":"pixelsUnit","_value":6.0}}},
                        {"_obj":"flattenImage"}
                    ]);
                    await ADDselecaoShapes(720, 23, 1633, 19, "RecortCaneca_dupla", 1);
                    await solidColorCamada(0,0,0);
                };
                ///////XXXXXXXXXXXXXXXXXXXXX
                
                /////// CONFIGURAÇÕES BÁSICAS
                async function configBasica(){
                        if(rotacionarDoc === false){app.activeDocument.resizeCanvas(1654, 2323, anchorPos.TOPCENTER);}
                        else{app.activeDocument.resizeCanvas(2323, 1654, anchorPos.TOPCENTER);}
                        if(modelo==" Toda preta"){
                       ///// POSICIONAR A ESTAMPA NO CONFORME O CONTRONO
                        await app.batchPlay([
                            {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","userMaskLinked":true}},
                            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_obj":"rectangle","bottom":{"_unit":"distanceUnit","_value":283.32},"left":{"_unit":"distanceUnit","_value":0.0},"right":{"_unit":"distanceUnit","_value":836.28},"top":{"_unit":"distanceUnit","_value":14.04}}},
                            {"_obj":"align","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"alignToCanvas":false,"using":{"_enum":"alignDistributeSelector","_value":"ADSCentersV"}},
                            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}
                           ]);
                            await ADDselecaoShapes(787, 31, 2292, 39, "RecortCaneca", 1);
                            await solidColorCamada(0,0,0);
                            await app.batchPlay([
                            {"_obj":"select","_target":[{"_name":"Background","_ref":"layer"}],"layerID":[348],"makeVisible":false},
                            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":771.0},"left":{"_unit":"pixelsUnit","_value":340.0},"right":{"_unit":"pixelsUnit","_value":1986.0},"top":{"_unit":"pixelsUnit","_value":53.0}}},
                            {"_obj":"make","_target":[{"_ref":"contentLayer"}],"using":{"_obj":"contentLayer","type":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":0.0,"grain":0.0,"red":0.0}}}}
                            ]);
                        }
                        else{
                            /////////RECORTE CONTORNOS DINAMICO
                            await ADDselecaoShapes(39, 0, 20.6, 0, "alçaBaseCaneca", 1); // bottom,left,right,top,id,m
                            await solidColorCamada(0,0,0);
                            for (var j = 0; j < 2; j++) {await alcaBaseSize(hConfig);}
                            await app.batchPlay([{"_obj":"play","_target":[{"_name": "RecorteCaneca","_ref":"action"},{"_name": "Ps-fx Service","_ref":"actionSet"}]}], { });
                            //////////::::::::::::::::::::::::::
                        };
                        //////////:::::::::::::::
                        await app.batchPlay([{"_obj":"flattenImage"}]);
                };
               ////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

                ////////VERIFICAÇÃO DO MODELO DA CANECA
                if(modelo==" Aluminio"){shapName="IconCanecas_aluminio"}
                else if(modelo==" Choop"){shapName="IconCanecas_choop"}
                else if(modelo==" Dupla"){shapName="IconCanecas_dupla"}
                else{ shapName="IconCanecas_Defaut"};
                ////////////:::::::::::::::::

                await ADDselecaoShapes(79, 0, 184, 0, shapName, 1);
                await solidColorCamada(0,0,0);
               
                 ////////POSICIONA ICONE SERVIÇO DA CANECA TODA PRETA
                if(modelo==" Toda preta"){app.activeDocument.activeLayers[0].translate(79, 736);}
                else if(modelo==" Dupla"){app.activeDocument.activeLayers[0].translate(59, 702);}
                else{
                     ////////POSICIONA ICONE SERVIÇO EXETO CANECA TODA PRETA
                    await app.batchPlay([
                        {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_name":"conteudo","_ref":"channel"}},
                        {"_obj":"align","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"alignToCanvas":false,"using":{"_enum":"alignDistributeSelector","_value":"ADSBottoms"}},
                        {"_obj":"align","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"alignToCanvas":false,"using":{"_enum":"alignDistributeSelector","_value":"ADSLefts"}},
                        {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}},
                        {"_obj":"transform","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"bilinear"},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":-271},"vertical":{"_unit":"distanceUnit","_value":11.799999999999999}}}
                    ]);
                 };
                ///////////////::::::::::::::

                ////////////POSICIONAMENTO DO ICON CONFORME ALTURA DA ESTAMPA
                if( altura <=8.1 && altura>=7){app.activeDocument.activeLayers[0].translate(48,0);}
                else if(altura<=7 && altura>=6){app.activeDocument.activeLayers[0].translate(55,0);}
                else if(altura<=6 && altura>=5){app.activeDocument.activeLayers[0].translate(55,0);}
                else if(altura<=5 && altura>=4){app.activeDocument.activeLayers[0].translate(71,0);}
                else if(altura<=4 && altura>=3){app.activeDocument.activeLayers[0].translate(83,0);}
                ///////////////::::::::::::::
           
                await legendaDados();
                bounds = app.activeDocument.activeLayers[0].bounds;  
                legenda = `Caneca [${modelo.toUpperCase()} ]: • Loja: ${Loja}  • Cliente: ${cliente}`;
                xPosition= bounds.left+84; yPosition = bounds.bottom-5;
                await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 22, position: {x: xPosition, y: yPosition}, fontName: "Arial"});
                await app.batchPlay([{"_obj":"flattenImage"},{"_obj":"clearAllGuides"}]);
                if(app.activeDocument.width>app.activeDocument.height){ app.activeDocument.rotate(-90);}

                ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                await sequenciaSave(`[OK! ] Caneca ${modelo}.png`, `[OK! ] Caneca ${modelo} 1.png`);
                await estampasSave(estampaName); ////// NOME OBTDO DA FUNÇÃO ANTERIOR.
                const D8ck2 = document.querySelector("#D8-ck2");
                if(D8ck2.checked==true){ await moveOrigArtes()};

                await app.batchPlay([
                    {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":estampaName},
                    {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}},
                ]);

                /////// ORGANIZAÇÃO DA ESTAMPA NA FOLHA
                if(document.getElementById("D8list_JUN").options.length>3){
                    await app.batchPlay([
                        {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}}, {"_obj":"copyEvent","copyHint":"pixels"},
                        {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}, 
                     ]);
                };

                //////////DUPLICAR ESTAMPA
                if(document.getElementById("D8list_JUN").selectedIndex==1){
                    await app.batchPlay([{"_obj":"copyToLayer"},{"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","mode":{"_enum":"blendMode","_value":"multiply"}}}]);
                    if(rotacionarDoc === false){ app.activeDocument.activeLayers[0].translate(0, gethDOC+40);}
                    else{ app.activeDocument.activeLayers[0].translate(gethDOC+50, 0 );};
                }
                else if(document.getElementById("D8list_JUN").selectedIndex>2){
                      try {
                          indexJuntar= parseFloat( s1("#D8list_JUN").selectedIndex)-3;
                          await app.batchPlay([ 
                            {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}},
                            {"_obj":"select","_target":[{"_name": estampaExist[indexJuntar],"_ref":"document"}]},
                            {"_obj":"paste","antiAlias":{"_enum":"antiAliasType","_value":"antiAliasNone"},"as":{"_class":"pixel"}},{"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","mode":{"_enum":"blendMode","_value":"multiply"}}}
                         ]); 
                         if(rotacionarDoc === false){ app.activeDocument.activeLayers[0].translate(0, gethDOC+40);}
                         else{ app.activeDocument.activeLayers[0].translate(gethDOC+50, 0 );};
                          
                      } catch (error) {alert(error)}
                };
                ///////////:::::::::::::::::::
                await app.batchPlay([ {"_obj":"flattenImage"}]);
                await ZoomDOC(0); await ZoomDOC(1);
                await document.querySelector('#processServic').close('OK');
                textoTranferencia()

            } catch (err) {alert(err)  }
        },{"interactive": true});
     };
    //////////////////////////////////////////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

    ////////::::::::::::::::::::
    /////////////// CRIAÇÃO DE MAQUETE 
    async function StampConfigP3(){
            try {
                await core.executeAsModal(async () => {
                    coloridasMD=false;  

                    /////// MAPEAMENTO DINÂMICO COM SLICES, TENDO COMO BASE LARGURA E ALTURA DA ESTAMPA.
                    const hG = Number(hConfig+78)+39;
                    const wA = Number(wConfig/2)+39;
                    const wB = Number(wConfig/2);
                    const cortDP = { bottonA: hG, leftA: 39, rightA: wA, topA: 39, bottonB: hG, leftB: wB+45, rightB: wB*2+38, topB: 39 };
                   
                    await app.batchPlay([{"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":"Maquete"},{"_obj":"flattenImage"},]);
                    await sliceAdicionar(cortDP.bottonA, cortDP.leftA, cortDP.rightA, cortDP.topA); 
                    await sliceAdicionar(cortDP.bottonB, cortDP.leftB, cortDP.rightB, cortDP.topB);

                    ////////// MODELOS DE CORTE
                    const modelo = document.querySelector("#D8list_MD").value.substring(2).toUpperCase();
                    if(modelo.includes("TODA BRANCA")){maquete ="{mcp-&008}.psd";}
                    else if(modelo.includes("TODA PRETA")){maquete ="{mcp-&012}.psd";}
                    else if(modelo.includes("ALUMINIO")){maquete ="{mcp-&005}.psd";}
                    else if(modelo.includes("CHOOP")){maquete ="{mcp-&007}.psd";}
                    else if(modelo.includes("DUPLA")){ maquete ="{mcp-&009}.psd";}
                    else if(modelo.includes("XÍCARA")){ maquete ="{mcp-&017}.psd";}
                    else if(modelo.includes("DOURADA")){maquete ="{mcp-&010}.psd";}
                    else if(modelo.includes("DOURADA ESPELHADA")){maquete ="{mcp-&015}.psd";}
                    else if(modelo.includes("PRATA")){maquete ="{mcp-&011}.psd";}
                    else if(modelo.includes("PRATA ESPELHADA")){maquete ="{mcp-&012}.psd";}
                    else{coloridasMD=true; maquete ="{mcp-&008}.psd";} 
                    
                    //////SALVAR CORTES
                    await saveThumbSTP(); await  importMokups(maquete);
                    await selectCamada("Frente"); await importarRotulo("thumbSTP_03");
                    await selectCamada("Verso");  await importarRotulo("thumbSTP_05");
                    
                    ////////OBTER AS CORES RGB PARA CANECAS COLORIDAS
                    if(coloridasMD === true){
                        if(modelo.toUpperCase().startsWith("INTERIOR")){await selectCamada("Interior");} else {await selectCamada("Color");}
                        const aRgbHex = refColor.match(/.{1,2}/g);
                         await app.batchPlay([ {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"contentLayer","_value":"targetEnum"}],"to":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":parseInt(aRgbHex[2], 16),"grain":parseInt(aRgbHex[1], 16),"red": parseInt(aRgbHex[0], 16),}}}])
                    };
                    ////////:::::::::::::::::::
                    await app.batchPlay([ {"_obj":"flattenImage"}, {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}} ]);

                    legenda = `• ${arte} [${modelo}] • Loja: ${Loja}  • Cliente: ${cliente}`;   
                    await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 15, position: {x: 27, y: 660}, fontName: "Arial"});
                    await app.batchPlay([{"_obj":"flattenImage"}]);
                    
                    ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                    docMatriz = app.activeDocument.id
                    await sequenciaSave(`[Amostra] ${arte} ${modelo}.png`, `[Amostra] ${arte} ${modelo} 1.png`);
                    await estampasSave(estampaName);
                    
                    await app.batchPlay([
                        {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":estampaName},
                        {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                    ]);
                    await ZoomDOC(0); await ZoomDOC(1);
                    await document.querySelector('#processServic').close('OK');

                },{"interactive": true});
            } catch (err) {alert(err)};
       };
    ////////::::::::::::::::::::

     /////// CARREGA  OS DADOS DO LOCALSTORAGE...
     /////// SE A CHAVE "D8DadosSave" EXISTIR 
    function carregarDadsosLS(){
        try {
            if (localStorage.getItem('D8DadosSave') !== null) {
                const dadosObjeto = JSON.parse(localStorage.getItem('D8DadosSave'));
                backup     = dadosObjeto.dados1;
                imprmir    = dadosObjeto.dados2;
                maquet    = dadosObjeto.dados3;
                indexLista = dadosObjeto.dados4;
                hDocStart = dadosObjeto.dados5;
                wDocStart = dadosObjeto.dados6;   
                ///////// SE POR FALHA O  wDocStart RTORNAR "undefined", ADD OS VALORES PADRÕES
                if(wDocStart=== undefined){
                    backup = true;  imprmir = false;  maquet = false;
                    indexLista = 0;  hDocStart = 9.5; wDocStart = 8.1;
                };
            } 
            else {
                ////// SE NÃO EXISTIR CARREGA  OS DADOS PADRÃO
                backup = true;  imprmir = false;  maquet = false;
                indexLista = 0;  hDocStart = 9.5; wDocStart = 8.1;
              };
          } catch (err) {alert(err)};
       };
     ////////:::::::::::::::::::::::::::::::::::::::::::::::
            




     
     //////// TODAS AS FUNÇÕES AQUI! ::::::::::::
    async function eventosJanelaD8(){
        try {
            colunacResetClasss(".D8colunaB", '.D8altura' ); //////// RESETAR BOTÃO SELECIONADO
            ///////// IMGEM TEMA DA JANELA EM FORMAR CODIFICADO
            fetch('icons/B64PNG/BCaneca.rtf').then(response => response.text()).then(imgB64 => {
                document.querySelector("#imgBase6").src=imgB64;
             });
            ///////////:::::::::::::::::::::
            
            /////////// EVENTOS DA DA LISTA DE PRESETS
            s1("#D8list_MD").addEventListener("change", async evt => {configSelModelo() });
            s1("#D8list_JUN").addEventListener("change", evt => { focarJanela(); });

            ///////STATUS INICIAL
            const status = `Circunferência: ${Number(wDocStart*3.14).toFixed(1)}cm | Altura: ${Number(hDocStart)}cm`
            document.querySelector("#statusPresset").textContent= status;
            ///////////::::::::::::::::::

            ////////////CONFIGS SISTEMA DE ABAS
            document.querySelector("#D8-btn1").classList.add('D8selecionado');
            const D8Btns = document.getElementsByClassName("D8-btAbas");
            const D8Abas = document.getElementsByClassName("D8-Abas");
            const D8Btn = Array.from(D8Btns);
            
            for (let i = 0; i < D8Btn.length; i++) {
                D8Btn[i].addEventListener('click', (event) => {
                    try {
                        // Esconder todas as abas
                        for (let j = 0; j < D8Abas.length; j++){ D8Abas[j].style.display = 'none';}
                        for (let j = 0; j < D8Btn.length; j++) { D8Btn[j].classList.remove('D8selecionado');}
                        D8Abas[i].style.display = 'block'; 
                        event.currentTarget.classList.add('D8selecionado');
                        document.querySelector("#acrionsPN3").style.display = "none";
                    } catch (error) { focarJanela();}
                });
            };

           ////////::::::::::::::::::::
            ////////OUVINTES BOÕES DE ENQUADRAMENTO
            controlPosition("#D8AJPose1", "#D8AJPose2", "#D8AJPose3", "#D8AJPose4", "#D8AJPose5","#D8AJPose6", "#D8AJPose7", "#D8AJPose8");
            ////////// EVENTOS FUNCÕES BOTÕES DE RADIO
    
            ///////// ABRIR O MENU DE AJUSTE DE CORES
            const menuAjuste2 = document.querySelector("#D8btn-Cores");
            menuAjuste2.addEventListener('click', (event) => {
                    janelaAjustesx();
                });
            ///////// RESTAURAR INICIAL CONFIGS ESTAMPA
            const restar= document.querySelector("#D8btn-resetar");
            restar.addEventListener('click', (event) => { restauraIniConfig("Iniciar")});
             ////////::::::::::::::::::::
            /////////////// FUNÇÃO PROCESSAMENTO FINAL
            document.querySelector("#D8Btn1").addEventListener('click', async () => {finalProcess(); });
            ///////////////////////////////////////////
            document.querySelector("#D8Btn2").addEventListener('click', () => {
                 document.querySelector("#dlgCanecas").close('OK'); resetarConfigs();
            });
            ////////::::::::::::::::::::

            //////////COFIGURAÇÕES DE ATALHOS AQUI!
           configsAtalho();
                
            /////// CHECKBOC PREVIEW
            const D8Ck4 = document.querySelector("#D8-ck4");
            D8Ck4.addEventListener('click', (event) => {
                if(D8Ck4.checked == true){ ajustePreview(100, "show")}
                else{ ajustePreview(0, "hide")}; 
            });
            ////////::::::::::::::::::::

            configsListaModel();////// CONFIGUÇOES DA LISTA 
            ////// OBTEM OS  VALORES NA FUNÇÃO (carregarDadsosLS())
            carregarDadsosLS(); 
            try {
                document.querySelector("#D8-ck2").checked = backup; // D8-ck2   backup
                document.querySelector("#D8-ck3").checked = imprmir // D8-ck3   imprimir
                document.querySelector("#D8-ck5").checked = maquet;  // D8-ck5   maquete,   
                document.getElementById("D8list_MD").selectedIndex = indexLista;  // Index Lista presets
            } catch (err) {alert(err)}
            /////////:::::::::::::::
  
            textSelectItens(); 
            exeMaquete();  
            
           //////// DESABILITA LISTA DE LEIALTE DA PAGINA NAS CIRCUNSTANCIAS:
            try {
                if(legenda.substring(2) == " Dupla"){document.getElementById("D8list_JUN").disabled=true}
                else{document.getElementById("D8list_JUN").disabled=false};
            } catch (error) {}

            document.querySelector("#D8-ck5").addEventListener('click', (event) => {
                if(document.querySelector("#D8-ck5").checked==true){document.getElementById("D8list_JUN").disabled=true}
                else{document.getElementById("D8list_JUN").disabled=false}
            });
            //////////::::::::::::::::::::::

            /////// SE EXITIR OUTRA ESTAMPA, ADICIONA NA LISTA 
            if(estampaExist !="") {
                 if(legenda.substring(2) !=" Dupla"){
                    s1("#D8list_JUN").insertAdjacentHTML("beforeend", `<option>-</option>`); 
                    estampaExist.forEach( (optionsName, index)=> { 
                        const strNomes = optionsName.split("[OK! ] ")[1].split(".")[0]
                        s1("#D8list_JUN").insertAdjacentHTML("beforeend", `<option>Com a ${strNomes}</option>`);
                     });  
                     s1("#D8list_JUN").selectedIndex=3;
                 };
            };
            /////////::::::::::::::

            focarJanela()
        } catch (err) { alert(err); console.log(err)}
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// TODAS AS FUNÇÕES AQUI! ::::::::::::

    /////// SALVAR  DINAMICAMENTE OS DADOS
    function SalvarDados(){
        textSelectItens(); 
        const dadosD8 = {
            dados1: document.querySelector("#D8-ck2").checked, // D8-ck2   backup
            dados2: document.querySelector("#D8-ck3").checked, // D8-ck3   imprimir
            dados3: document.querySelector("#D8-ck5").checked, // D8-ck5   maquete, 
            dados4: document.getElementById("D8list_MD").selectedIndex,
            dados5: altura, 
            dados6: lagura  
        };
        localStorage.setItem('D8DadosSave', JSON.stringify(dadosD8));
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
   





    ////////////////////////////////////////////////
    //////////// CONFIGURAÇÕES DE ATALHO
    function focarJanela() {
        try {
            function focar() { document.querySelector("#areaFocus").focus(), 16 }
            setTimeout(focar, 150);
        } catch (error) {alert(error)}
    };

    function configsAtalho(){
        processamento=false;
        D8dlg.addEventListener("close", () => {
            document.removeEventListener('keydown', canecaKey);
            if(processamento===false) {resetarConfigs()}
        });
        ////////MATER A JANELA SEMPRE FOCADA
        document.querySelector(".janelaBase").addEventListener('click', (event) => { focarJanela();})
       /////////////:::::::::

        ////////////// ATALHOS CONFIGSXXXXXXXXXXXX
       document.addEventListener("keydown", canecaKey);
       async function canecaKey(event) {
                if (event.keyCode === 13) {
                     if(process==="adicionar" || process === "editar"){savePresets()}
                     else if(process==="msgAlertas"){dlg.close('OK'); focarJanela() }
                     else{finalProcess()}
                }
                ////////// AJUSTAR ENQUADRAMENTO
                else if(event.keyCode == 107) {await configsPositions(1, 102)}////ZOOM MAIS
                else if(event.keyCode == 109) {await configsPositions(2,   98)}////ZOOM MENOS
                else if(event.keyCode ==   37) {await configsPositions(3, -10);}////MOVERA PARA ESQUEDA
                else if(event.keyCode ==   39) {await configsPositions(3, 10);}////MOVERA PARA DIREITA
                else if(event.keyCode ==   33) {await configsPositions(4, -10);}////MOVERA PARA CIMA
                else if(event.keyCode ==   34) {await configsPositions(4, 10);}////MOVERA PARA BAIXO
                else if(event.keyCode == 112) {await configsPositions(5, null);}////PRENCHER HORIZONTALMENTE
                else if(event.keyCode == 113) {await configsPositions(6, null);}////PRENCHER VERTICALMENTE
                else if(event.keyCode ==   77) {tggCheckboxKey("#D8-ck5")}//// CHEKBOX MAQUETE
                else if(event.keyCode ==   66) {tggCheckboxKey("#D8-ck2")}//// CHEKBOX BACKUP DOC
                else if(event.keyCode ==   65) {tggCheckboxKey("#D8-ck3")}//// CHEKBOX AUTO IMPRIMIR
                else if(event.keyCode ==  27) {document.querySelector("#dlgCanecas").close('OK');  D8CanecasEventos=false; }
                else if(event.keyCode ==40 || event.keyCode ==38) {seleItensSetas(event)}//// OPÇÃO MAQUETE
                else if(event.keyCode ==80) { inserirPressetsKey()} //// INSERIR PRESETS
                else if(event.keyCode ==68) { removePresetsList()} //// REMOVER PRESETS
                else if(event.keyCode ==83) {seltorColorPresets()} //// SELETOR DE CORES
                else if(event.keyCode ==69) {  editatPressets()} //// EDITAR PRESETS
          };
         //////// PRECESSO FINAL POR ATALHOS FINAL       
        ///////////////:::::::::::::::::::::::::::::::::::::::::::
       };

        //////// NAVEGAR NAS LISTA DE PRESSETS POR ATALHOS   
        async function seleItensSetas(event){
            try {
                    let listaSelSetas = document.getElementById("D8list_MD");
                    let options = listaSelSetas.options;
                    let selectedIndex = listaSelSetas.selectedIndex;
                    /////// VERIFICA SE A PRÓXIMA OU A ANTERIOR OPÇÃO É O DIVISOR ("-") E PULA PARA A PRÓXIMA OU ANTERIOR OPÇÃO VÁLIDA.
                    if (event.keyCode === 40) {
                        event.preventDefault();
                        do {selectedIndex = (selectedIndex + 1) % options.length;} 
                        while (options[selectedIndex].value === "-");
                        listaSelSetas.selectedIndex = selectedIndex;
                    } else if (event.keyCode === 38) {
                        event.preventDefault();
                        do { selectedIndex = (selectedIndex - 1 + options.length) % options.length;} 
                        while (options[selectedIndex].value === "-");
                        listaSelSetas.selectedIndex = selectedIndex;
                    };
                await configSelModelo(); //////ATUALIZA A CONFIG COM BASE DO MODELO DE PRESET
                } catch (error) {}
        };
                  
        function inserirPressetsKey(){
            dlgPresetsCan(); document.querySelector("#D8PresetNome").value = "Novo Presset";
            process = "adicionar"; 
       };

        //////// MARCAR/DESMARCAR CHECK MAQUETE
        function tggCheckboxKey(e) {
            let checkbox = document.querySelector(e);
            checkbox.checked = !checkbox.checked;
           // toggleMaqueCK = checkbox.checked; // Atualiza FtoggleMaqueCK para refletir o estado atual da checkbox
            focarJanela(); 
        };
        ///////::::::::::::::::::::::::::
        ///////////::::::::::::::
     
    //// RESGATA TODAS O VALORES ATUAS DAS CHAVE DA LISTA 
    async function textSelectItens(){
        sel = D8list_MD.selectedIndex;
        legenda = conteudo_Obj.map(function (itemList) { return itemList.Legenda; })[sel];
        refColor = conteudo_Obj.map(function (itemList) { return itemList.CodigoCor; })[sel];
        lagura = conteudo_Obj.map(function (itemList) { return itemList.Largura; })[sel];
        altura = conteudo_Obj.map(function (itemList) { return itemList.Altura; })[sel];
        maqueteADD = conteudo_Obj.map(function (itemList) { return itemList.Maquet; })[sel];
    };

    //////// CONFIGURAÇÃO INICIAL DO MOLDE DAS ESTAMPAS 
    async function configMoldes(h, w ){ /// 1 altura - 2 largura - 3 bottom  - 4 right - 5 shap molde 6 snapshot name
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
            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}},
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
        if(indexLista ==4){ app.activeDocument.guides.add(Constants.Direction.VERTICAL, 670)};
    };

     //////// CONFIGURAÇÃO  DO MOLDE DAS ESTAMPAS  VIA LISTA
    async function configItensMD(h,w){
        await app.batchPlay([
            {"_obj":"select","_target":[{"_name":"Default","_ref":"snapshotClass"}]},
            {"_obj":"imageSize","constrainProportions":true,"height":{"_unit":"pixelsUnit","_value":h},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"scaleStyles":true},
            {"_obj":"canvasSize","horizontal":{"_enum":"horizontalLocation","_value":"center"},"width":{"_unit":"pixelsUnit","_value":w}},
            {"_obj":"newGuideLayout","guideLayout":{"$GdCA":0,"$GdCB":255,"$GdCG":132,"$GdCR":74,"_obj":"guideLayout","marginBottom":{"_unit":"distanceUnit","_value":0.0},"marginLeft":{"_unit":"distanceUnit","_value":0.0},"marginRight":{"_unit":"distanceUnit","_value":0.0},"marginTop":{"_unit":"distanceUnit","_value":0.0}},"guideTarget":{"_enum":"guideTarget","_value":"guideTargetCanvas"},"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}},
            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}},
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
        if(document.getElementById("D8list_MD").selectedIndex ==4){ 
            app.activeDocument.guides.add(Constants.Direction.VERTICAL, 670); 
            app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"zoomOut"}]}])
        }  ;
        exeMaquete();
    };
    ///////////::::::::::::::::::::::::::::::


    async function configSelModelo(){
        try {
            modelo = document.querySelector("#D8list_MD").value.substring(2);
            await core.executeAsModal(async () => {
                await  listaPresetsConfig();
                if(modelo== " Dupla"){document.getElementById("D8list_JUN").disabled=true}
                else{document.getElementById("D8list_JUN").disabled=false}
            });
            focarJanela(); 
        } catch (err) {}
   };

    async function  listaPresetsConfig(){
        textSelectItens();
        if(lagura===undefined){lagura = 8.1; altura= 9.5}
        ///// CALCULAR CIRCUNFEÊNCIA APATIR DO VALOR  DA CAIXA DE TEXTO DA JANELA PRESSETS
        const diametro = Number(lagura*3.14); ////// DIAMETRO*CONSTATE 3.14
        const percentagem = 23.3; /// INTERVALO: ESPAÇO DA ALÇA
        const reducao = diametro * (percentagem / 100);
        const circunferencia = diametro - reducao;///LARGURA FINAL DA ESTAMPA

        wConfig = Number(circunferencia/2.54*resol).toFixed(1); ////// CONVERTE PARA DE CM PARA PX
        hConfig  = Number(altura/2.54*resol).toFixed(1);  ////// CONVERTE PARA DE CM PARA PX
      
        app.activeDocument.activeHistoryState = app.activeDocument.historyStates [3];
        await app.batchPlay([{"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}, {"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}]);

        await configItensMD( Number(hConfig), Number(wConfig)) /// 1 altura - 2 largura
        gethDOC = Number(hConfig); getwDOC = Number(wConfig);
        creatSnapshot("Iniciar");

        await ZoomDOC(0); 
        ///////STATUS PRESSETS
        const status = `Circunferência: ${Number(lagura*3.14).toFixed(1)}cm | Altura: ${Number(altura)}cm`
        document.querySelector("#statusPresset").textContent= status;
        if(document.getElementById("D8list_MD").selectedIndex ==4){ 
        await app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"zoomOut"}]}])
        } ;
        exeMaquete();
        configsPositions(5, null);/////// PREENCHE A IMAGEM EM TODAS ESTENSÃO DO DOCUEMNTO
        document.querySelector("#D8-ck5").checked=false;
    };

    function exeMaquete(){
        if( maqueteADD == false){ document.querySelector("#D8-ck5").disabled=true;  document.querySelector("#txtMauet").classList.add('labelDisable'); }  
        else{ document.querySelector("#D8-ck5").disabled=false; document.querySelector("#txtMauet").classList.remove('labelDisable'); }  
    };

    async function importarRotulo(img){
        dirTemplates = `${Usuario}/AppData/Roaming/temp_stamps/images/`;
        try {await carregThumbSTP(`${dirTemplates}${img}.jpg` );}catch (e){};
        try {await carregThumbSTP(`${dirTemplates}${img}.png`);}catch (e){};
    }

    /////////ADICIONAR O CORTE DA ESTAMPA
    async function sliceAdicionar(bot,left,righ,top){
        await app.batchPlay([
        {"_obj":"make","_target":[{"_ref":"slice"}],"using":{"_obj":"slice","at":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":bot},"left":{"_unit":"pixelsUnit","_value":left},"right":{"_unit":"pixelsUnit","_value":righ},"top":{"_unit":"pixelsUnit","_value":top}},"type":{"_enum":"sliceType","_value":"user"}}},
        {"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"toggleShowExtras"}]}
        ]);
    };

   async function alcaBaseSize(method){
        anchorPos = require('photoshop').constants.AnchorPosition;
        const docWidth = method;
        const bounds = app.activeDocument.activeLayers[0].bounds
        const w = bounds.bottom - bounds.top;
        f1 = ((docWidth / w) * 100);
        app.activeDocument.activeLayers[0].scale(f1, f1, anchorPos.MIDDLECENTER);
    } 
 ////////////XXXXXXXXXXXXXXXXXXX



    ///////////////////// CONFIGURAÇÕES DA JANELA PRESSETS
        ////// CARREGAR JALELA PRINCIPAL
        async function dlgCanecas() {
            D8CanecasEventos=true;
            fetch('html/D8Canecas.html').then(response => response.text()).then(data => {
                D8dlg = document.querySelector("#dlgCanecas");
                D8dlg.show({ title: `PS-fxrios: Canecas Personalizadas!`, resize: "both", size: { width:367, height:340}})
                D8dlg.innerHTML = data;
            //  D8dlg.addEventListener('load', evt => { setTimeout(() =>{ document.getElementById('D8-ck5').focus();}, 150) });
                eventosJanelaD8(); 
            });
        };

        async function finalProcess(){
            try { 
                if(D8CanecasEventos === false){return};
                D8CanecasEventos=false;
                processamento=true;
                document.querySelector("#dlgCanecas").close('OK'); 
                SalvarDados();  ajustePreview(100, "show");
                progressDLG("Aquarde Processing . . ."); 
                function evento() { setTimeout(() =>{
                    ////////  VERIFICA SE O PRECESSO FINAL 
                    const D8ck5= document.querySelector("#D8-ck5");
                    if(D8ck5.checked==true){  StampConfigP3() }else{ StampConfigP2()}
                    ////////:::::::::::::::::::::::::::::::::::::::::::::
                    }
                )} setTimeout(evento, 1000);//////depois alterar para 1000
            } catch (err) {alert(err)};
        };
        ////////::::::::::::::::::::::::::::

    ////// CARREGAR JALELA PRESSETS
    function dlgPresetsCan() {
        document.querySelector("#dlgPresetsCan").showModal({ title: "Pressets", resize: "both", size: { width: 300, height: 280} })
        function temporizador() { document.querySelector("#D8PresetNome").focus(), 16 }
        setTimeout(temporizador, 100);
        document.querySelector('#D8btnColor').style.background = '#FFFFFF'
        /////////// RETORNA VALORES PADRÕES AO ADICIONAR UM NOVO PRESSET;
        document.getElementById("D8preEt1").value = 9.5.toFixed(1);
        document.getElementById("D8preEt2").value = 8.1.toFixed(1);
        document.querySelector("#dlgPresetsCan").addEventListener("close", () => { focarJanela()});
   };

   async function savePresets() {
        if (process == "adicionar"){ novoItemADD();} else  if (process == "editar"){edidadoOKItem()}
        document.querySelector("#D8-ck5").checked= false;
        process = "finalizado"; //////// PERMITE LIBERAR A PROCESSAMENTO FINAL
    };

    function novoItemADD(){
        altura = document.getElementById("D8preEt1").value.replace(",", "."); ///////// REMOVE VIRGURA E ADD O PONTO
        diamatro = document.getElementById("D8preEt2").value.replace(",", "."); ///////// REMOVE VIRGURA E ADD O PONTO

        nomePreset = "✅ " + document.getElementById("D8PresetNome").value;
        var presetsExistents = conteudo_Obj.map(function (itemList) {return itemList.Legenda});
        if(nomePreset == "✅ Novo Presset" || nomePreset == "✅ ") {
            alertar("Adicione nome do preset!"); 
            process="msgAlertas"; focarJanela();  return;
        }
        else if(presetsExistents.includes(nomePreset) == true) {
            alertar("Esse preset já consta na lista, adicione outro nome!"); 
            process="msgAlertas"; focarJanela(); 
            return;
        }
        else{
            try {
                document.querySelector('#dlgPresetsCan').close('OK');
                try {codigoColor = corHexObtida;} catch (err) {codigoColor = "ffffff"}/////// RETORNA BRANCO SE NÃO BUSCAR UMA COR PELO SELETOR
                if (conteudo_Obj.length == 5) {conteudo_Obj.splice(6, 0, {Legenda: "-", CodigoCor: "-" })};
                conteudo_Obj.push({ Legenda: nomePreset, CodigoCor: codigoColor, Largura: diamatro,  Altura: altura, Maquet: MaqueteOP }); /////////////////////////////////////////////////////
                var conteudo = conteudo_Obj.map(function (itemList) { return itemList.Legenda });
                localStorage.setItem("conteudo", JSON.stringify(conteudo_Obj));
                D8list_MD.innerHTML = "";
                for (var i = 0; i < conteudo.length; i++) { D8list_MD.insertAdjacentHTML("beforeend", `<option>${conteudo[i]}</option>`); }
                document.querySelectorAll('#D8list_MD option:last-child').item(0).selected = true;
                /////// ATUALIZA A NOVA CONFIGURAÇÃO EM TEMPO REAL                       
                core.executeAsModal(async () => {  await  listaPresetsConfig() });
            } catch (err) {alert(err) } 
        };
    };

    //////////// CONFIGS DA EDIÇÃO DO ITEM SELECIONADO
    function edidadoOKItem(){
        try {
            nomePreset = "✅ " + document.getElementById("D8PresetNome").value;
            if(nomePreset == "✅ ") {
                alertar("Adicione nome do preset!"); process="msgAlertas";  focarJanela();  return;
            } 
            try {codigoColor = corHexObtida;} catch (err) {codigoColor = refColor}
            altura = document.getElementById("D8preEt1").value.replace(",", "."); ///////// REMOVE VIRGURA E ADD O PONTO
            diamatro = document.getElementById("D8preEt2").value.replace(",", "."); ///////// REMOVE VIRGURA E ADD O PONTO
            document.querySelector('#dlgPresetsCan').close('OK');

            try {conteudo_Obj.splice(sel, 1, { Legenda: nomePreset, CodigoCor: codigoColor, Largura: diamatro,  Altura: altura, Maquet: MaqueteOP });}
            catch(e){alert(e) };
            atualizaLista();
            D8list_MD.selectedIndex = sel;
            /////// ATUALIZA A NOVA CONFIGURAÇÃO EM TEMPO REAL                       
            core.executeAsModal(async () => {  await  listaPresetsConfig() }); 
        } catch (err) {alert(err)}
    };

    //////////// EDITAR ITEM SELECIONADO
    function editatPressets(){
        try {
            if(document.getElementById("D8list_MD").selectedIndex<6){
                alertar("Esse item não pode ser Editado!");  process="msgAlertas"; focarJanela(); 
            }
            else{
                dlgPresetsCan();  
                textSelectItens(); //// RESGATA TODAS O VALORES ATUAS DAS CHAVE DA LISTA 
                document.querySelector('#D8btnColor').style.background = `#${refColor}`
                document.querySelector("#D8PresetNome").value = legenda.substring(2)///
                document.getElementById("D8preEt1").value = altura;
                document.getElementById("D8preEt2").value = lagura;
                document.querySelector("#D8-ckOM").checked = maqueteADD;
                // process = null;
                process = "editar";
            };
        } catch (err) {alert(err)};
    }; 

    //////////// REMOVER ITEM SELECIONADO
    async function removePresetsList(){
        const item = Number(D8list_MD.selectedIndex);
        if (item < 5) { alertar("Você não pode remover esse ítem, faz parte dos presets do Sistema!");
        process="msgAlertas"; focarJanela();
         return ;
        }
        else if (conteudo_Obj.length == 7) { D8list_MD.innerHTML = ""; localStorage.removeItem("conteudo"); corregarLista(); }
        else { conteudo_Obj.splice(item, 1); atualizaLista(); }
        document.querySelectorAll('#D8list_MD option:last-child').item(0).selected = true;
        textSelectItens();
        /////// ATUALIZA A NOVA CONFIGURAÇÃO
        await core.executeAsModal(async () => {  await  listaPresetsConfig() });
   }

   //////////// SELETOR DE CORES
   async function seltorColorPresets(){
        await core.executeAsModal(async () => {
            const result = await app.batchPlay([{ _obj: "showColorPicker", _target: [{ _ref: "application" }], color: { _obj: 'RGBColor', red: 0, green: 0, blue: 0, } }], {});
            const color = result[0].RGBFloatColor ?? null;
            if(color.red == 0 && color.grain==0 && color.blue==0){return}//// AO CANCELAR A JANELA COLORPICKER, RGB = 0,0,0 ENTAM INTEROMPER AQUI!
            color && (document.querySelector('#D8btnColor').style.backgroundColor = `rgb(${color.red} ${color.grain} ${color.blue})`)
            //RGB to HEX conversion
            const rgbToHex = (r, g, b) => [r, g, b].map(x => {
                const hex = x.toString(16)
                return hex.length === 1 ? '0' + hex : hex
            }).join('');
            corHexObtida = rgbToHex(parseInt(color.red), parseInt(color.grain), parseInt(color.blue));
            focarJanela(); 
        })
   };


    ////////// ATUALIZAR A LISTA
    async function atualizaLista() {
        var conteudo = conteudo_Obj.map(function (itemList) { return itemList.Legenda });
        localStorage.setItem("conteudo", JSON.stringify(conteudo_Obj)); //// Salva no localStorage
        conteudo_Obj = JSON.parse(localStorage.getItem("conteudo"));  //// Resgata do localStorage
        D8list_MD.innerHTML = "";  //// Esvazia a lista;
        for (var i = 0; i < conteudo.length; i++) { D8list_MD.insertAdjacentHTML("beforeend", `<option>${conteudo[i]}</option>`); } //// Adiciona os itens atualizados;
    };
    ////////////:::::::::::::::::::::::
    //////////////////////////////////

    ////// VERIFICA SE EXISTE ALGUMA  ESTAMPA JA CONFIGURA PARA ADICIONAR NA LISTA DE LAYOULT
    function existentEstampas(){
        ImgConteudo = app.documents;
        for (let i = 0; i < ImgConteudo.length; i++) {
            var doc = app.documents[i];
            if (ImgConteudo[i].name.includes("[OK! ] Caneca")) { estampaExist.push(ImgConteudo[i].name); }
            };
        };
    
      //////////// CONFIGURAÇÕES DA LISTA DE CANECAS
      function configsListaModel(){
            try {
                corregarLista();
                async function corregarLista() {
                    try {
                        conteudo_Obj = new Array();  
                        D8list_MD = document.getElementById("D8list_MD");
                        //// RESGATA DO LOCALSTORAG SE NAO EXISTIR ADICIONA OS ITENS PADROES:
                        conteudo_Obj = JSON.parse(localStorage.getItem("conteudo")) || [ {
                                Legenda: '✅  Toda branca',
                                CodigoCor: "ffffff",
                                Largura: 8.1,
                                Altura: 9.5,
                                Maquet: true
                            }, {
                                Legenda: '✅  Toda preta',
                                CodigoCor: "020101",
                                Largura: 8.1,
                                Altura: 7,
                                Maquet: true
                            }, {
                                 Legenda: '✅  Aluminio',
                                CodigoCor: "eff3ff",
                                Largura: 8.1,
                                Altura: 9.5,
                                Maquet: true
                            }, {
                                Legenda: '✅  Choop',
                                CodigoCor: "eff3ff",
                                Largura: 8.1,
                                Altura: 9.5,
                                Maquet: true
                            },{
                                Legenda: '✅  Dupla',
                                CodigoCor: "ffffff",
                                Largura: 6.65,
                                Altura: 9.5,
                                Maquet: true
                            }];	
                        conteudo = conteudo_Obj.map(function (itemList) { return itemList.Legenda }); 
                        ////////// FUNC ADD OS ITENS DO ARRAY NA LISTA
                        for (var i = 0; i < conteudo.length; i++) { D8list_MD.insertAdjacentHTML("beforeend", `<option>${conteudo[i]}</option>`); }
                    } catch (err) {alert(err) }
                }
                
               /////// ADD PRESETES BOTÃO
               document.querySelector("#D8AddPresets").addEventListener("click", async () => {
                    dlgPresetsCan(); document.querySelector("#D8PresetNome").value = "Novo Presset";
                    process = "adicionar";
                  });
                
                ////////// EDITAR ITEM DA LISTA
                document.querySelector("#D8btnEdit").addEventListener("click", async () => {
                   editatPressets()
                });
                
                ////////// RESETA LISTA
                document.querySelector("#D8btnDesfault").addEventListener("click", async evt => {
                    confiramar("Todos os presets adicionados seram removidos! Você deseja  removê-los?");
                    document.querySelector("#confirm_btn2").addEventListener("click", async () => {
                        dlg.close('OK'); 
                        D8list_MD.innerHTML = "";
                         localStorage.removeItem("conteudo"); 
                         localStorage.removeItem('D8DadosSave')
                         corregarLista();
                        textSelectItens();
                        /////// ATUALIZA A NOVA CONFIGURAÇÃO
                        await core.executeAsModal(async () => {  await  listaPresetsConfig() });
                    });
                });
                
                ////////// REMOVE ITEM SELECIONADDO
                document.querySelector("#D8btnRemover").addEventListener("click", async evt => {removePresetsList()});
                document.querySelector("#D8btnOK").addEventListener("click", async () => {
                    savePresets(); 	textSelectItens();
                });
                document.querySelector("#D8btnClose").addEventListener("click", async () => {
                    document.querySelector('#dlgPresetsCan').close('OK');
                });
                document.querySelector("#D8-ckOM").addEventListener("click", async () => {
                    if(document.querySelector("#D8-ckOM").checked ==true){ MaqueteOP = true } 
                    else{ MaqueteOP = false }
                });
                 
                document.getElementById('D8btnColor').addEventListener('click', async () => { seltorColorPresets() });

             } catch (err) {alert(err)}
    };
    //////////////:::::::::::::::