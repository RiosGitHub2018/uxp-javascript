    //////////////////////////////////////////////////////////////////
    const {executeAsModal} = require("photoshop").core;
    const {batchPlay} = require("photoshop").action;
    shapStamp = false;
    const inciarD10 = document.querySelector("#serv-btn4");
    inciarD10.addEventListener("click", async (event) => {
        if (event.altKey || event.metaKey) { await docEstampa(878.8, 623.5, "Camisa")} 
        else { process = true; await incialConfigs() ;}
     });

    ///FUNCTION incialConfigs INCIAR
    async function incialConfigs() {
            if(app.documents.length==0){  const f = await fs.getFileForOpening(); if(f){await core.executeAsModal(() => app.open(f));} if(f==null){ return};}
            StampConfigP1();
            doc= app.activeDocument;
            resol = 200 //app.activeDocument.resolution;
            gethDOC = app.activeDocument.height;
            getwDOC = app.activeDocument.width;
            shapStamp = true;
            MaqueteOP = false
            actionAcabamento = 0;
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
               function evento() { setTimeout(() =>configurar());} setTimeout(evento, 100);
               //////////CONFIGURAÇÃO INICIAL 
               async function configurar() {
                   await core.executeAsModal(async () => {
                       try {
                            transform= false;
                            radioChecado = 12
                            tamanho = "31x22";
                            docMatriz = app.activeDocument.id;  
                            diretorioDoc = app.activeDocument.path.replace(/\\[^\\]*$/, "");
                            arte = "Camisa";
                            
                            criarPasta(`${Usuario}/AppData/Roaming`, "temp_stamps");
                            tamanhoSize();
                            wConfigIni=Number(wConfig/2.54*resol).toFixed(0);
                            hConfigIni =Number(hConfig/2.54*resol).toFixed(0);
                            // ////// AÇÕES DE EVENTOS AQUI! //////////////////////////////////////////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                            await configMoldes(Number(hConfigIni ), Number(wConfigIni ))
                            gethDOC = hConfigIni; getwDOC = wConfigIni;
                            configsPositions(5, null);/////// PREENCHE A IMAGEM EM TODAS ESTENSÃO DO DOCUEMNTO
                            await ZoomDOC(0);  await ZoomDOC(1);

                            await document.querySelector('#processServic').close('OK');
                            await dlgCamisa();
                            await legendaDados();
                            inserirIcone= true;
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
                laguraBase = Number(wConfig/2.54*resol).toFixed(0);
                doc= app.activeDocument;
                anchorPos = require('photoshop').constants.AnchorPosition;

                await selectCamada("Conteudo");
                doc.activeLayers[0].scale(-100, 100);
                await app.batchPlay([
                    {"_obj":"make","_target":[{"_ref":"layerSection"}],"from":{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"},"layerSectionEnd":114,"layerSectionStart":113,"name":"Group 1"},
                    {"_obj":"newPlacedLayer"},  {"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}
                 ]);
                await app.batchPlay([ {"_obj":"newPlacedLayer"}, {"_obj":"clearAllGuides"} ]);

                await conteudoWSize( laguraBase );
                if(rotacionarDoc===true){doc.rotate(-90);}
                await app.batchPlay([{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}])

                boundsLA = doc.activeLayers[0].bounds; 
                wSizeContreudo= boundsLA.right-boundsLA.left
                hSizeContreudo = boundsLA.bottom-boundsLA.top; 
                
                /////// DETREMINA TAMANHO DA FOLHA A3/A4 E LARGURA MINIMA PARA ALINHAMENTO DA MESMA
                if( hSizeContreudo>2087){ folha ="folhaA3"; larMínima= 1200; }
                 else{ folha ="folhaA4"; larMínima= 916; }
                if(getwDOC > gethDOC){ rotacionar = 90} else{ rotacionar = -90}

                //////// REDIMENSIONAR O DOCUMENTO PARA FOLHAS A3 OU A4
                if(folha =="folhaA3"){
                    await doc.resizeCanvas(2339, 3307, anchorPos.TOPCENTER);
                    if(hSizeContreudo <2222 ){ doc.activeLayers[0].rotate(rotacionar); }
                 }
                else{
                    await doc.resizeCanvas(1654, 2323, anchorPos.TOPCENTER)  
                    if(hSizeContreudo < 1577 ){ doc.activeLayers[0].rotate(rotacionar); }
                  }
                //////////:::::::::::::::::::::    

               doc.selection.selectAll()
              await alignCamada(0, true); doc.activeLayers[0].translate(0, 30);
              
               ////// ALINHA A ESTAMPA A ESQUERDA SE A LARGURA MINIMA FOR UTRAPASSADA
              if( wSizeContreudo < larMínima){ 
                doc.selection.selectAll()
                await alignCamada(2, true); doc.activeLayers[0].translate(30, 0);
              }
              //////////:::::::::::

                bounds = doc.activeLayers[0].bounds; 
                await app.batchPlay([
                    {"_obj":"set","_target":[{"_property":"workPath","_ref":"path"}],"to":{"_obj":"customShape","bottom":{"_unit":"distanceUnit","_value":-0.36},"keyOriginType":9,"left":{"_unit":"distanceUnit","_value":-1.08},"name":"Pontilhado","right":{"_unit":"distanceUnit","_value":842.04},"top":{"_unit":"distanceUnit","_value":-0.72}}},
                ])
                
                await solidColorCamada(0,0,0); 
                doc.activeLayers[0].translate(0, bounds.bottom+23);

                boundsIC = doc.activeLayers[0].bounds; 
                await app.batchPlay([{"_obj":"flattenImage"}]);

                //////INSERIR O ICONE REFERENTE AO TIPO DE ESTAPA
                if( radioChecado>7 && radioChecado<12){ iconADD="IC-Camisas-Br"; bodyColor.selectedIndex=0; arte=""} 
                if( boundsIC.bottom <3241){
                    await ADDselecaoShapes(79, 0, 184, 0, iconADD, 1);
                    await solidColorCamada(0,0,0);
                    doc.activeLayers[0].translate(bounds.left, bounds.bottom+28)
                }
                ////////:::::::::::
              
                await legendaDados();
                bounds = doc.activeLayers[0].bounds; 
                legenda = `${arte} [${txtModel} ${localADD}${CololBary}] : • Loja: ${Loja}  • Cliente: ${cliente}`;
                if( boundsIC.bottom <3241){ xPosition= bounds.left+81; yPosition = bounds.bottom-18;}
                else{ xPosition= bounds.left+25; yPosition = bounds.bottom-25;}
               
                await doc.createTextLayer({ name: "datos", contents: legenda, fontSize: 22, position: {x: xPosition, y: yPosition}, fontName: "Arial"});
                await app.batchPlay([{"_obj":"flattenImage"}]);
                
                ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                await sequenciaSave(`[OK! ] ${arte} ${txtModel}.png`, `[OK! ] ${arte} ${txtModel} 1.png`);
                await estampasSave(estampaName); ////// NOME OBTDO DA FUNÇÃO ANTERIOR.
                const D10ck2 = document.querySelector("#D10-ck2");
                if(D10ck2.checked==true){ await moveOrigArtes()};
            
                await app.batchPlay([
                    {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":estampaName},
                    {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                ]);
                await document.querySelector('#processServic').close('OK');
                await ZoomDOC(0);
                textoTranferencia();
             }
            catch(err){alert(err)}

        },{"interactive": true});
     };
    //////////////////////////////////////////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ////////::::::::::::::::::::

    /////////////// CRIAÇÃO DE MAQUETE 
    async function StampConfigP3(){
            try {
                await core.executeAsModal(async () => {
                         /////// MAPEAMENTO DINÂMICO COM SLICES, TENDO COMO BASE LARGURA E ALTURA DA ESTAMPA.
                         doc= app.activeDocument
                         const hG = Number(hCorteConfig)+39;
                         const wA = Number(wCorteConfig)+39;
                         const cortDP = { bottonA: hG, leftA: 39, rightA: wA, topA: 39 };

                         await doc.selection.selectRectangle(
                            {top: 39, left: 39, bottom: hG, right: wA}, Constants.SelectionType.REPLACE
                        );
                        await alignCamada(0, true); await doc.selection.deselect();
                        await sliceAdicionar(cortDP.bottonA, cortDP.leftA, cortDP.rightA, cortDP.topA); 
                        await saveThumbSTP();
                        
                        /////// OBTEM O MODELO DA ESTAMPA
                         if(txtModel.includes("Maculina")){
                            await importMokups("{mcp-&00M}.psd");
                            switch(lado){
                                case 1: gpTarget ="MASC-FRENTE"; break; ///FRENTE
                                case 2: gpTarget ="MASC-FRENTE"; break; ///FRENTE
                                case 3: gpTarget ="MASC-VERSO";break; ///VERSO
                                case 4: gpTarget="" ; break; ///BOLSO
                                case 5: gpTarget="" ; break; ////MANGAS
                            };
                        } 
                        else if(txtModel.includes("Feminina")){
                            await importMokups("{mcp-&00F}.psd");
                            switch(lado){
                                case 1: gpTarget ="FEM-FRENTE"; break; ///FRENTE
                                case 2: gpTarget ="FEM-FRENTE"; break; ///FRENTE
                                case 3: gpTarget ="FEM-VERSO";break; ///VERSO
                                case 4: gpTarget="" ; break; ///BOLSO
                                case 5: gpTarget="" ; break; ////MANGAS
                            };
                        }
                        else if(txtModel.includes("Anos") || txtModel.includes("Ano")){
                            await importMokups("{mcp-&00I}.psd");
                            switch(lado){
                                case 1: gpTarget ="INF-FRENTE"; break; ///FRENTE
                                case 2: gpTarget ="INF-FRENTE"; break; ///FRENTE
                                case 3: gpTarget ="INF-VERSO";break; ///VERSO
                                case 4: gpTarget="" ; break; ///BOLSO
                                case 5: gpTarget="" ; break; ////MANGAS
                            };
                        } 
                        else if(txtModel.includes("Body")){
                                await importMokups("{mcp-&00B}.psd");
                                if(gethDOC < getwDOC ){selIndex = 4} else{selIndex = 3}
                                gpTarget ="B BASE";
                                await selectCamada(corTarget); 
                                app.activeDocument.activeLayers[0].opacity=70;
                            } 
            
                        await selectCamada(gpTarget)
                        app.activeDocument.activeLayers[0].opacity=100;
                        for(let i = 0; i < selIndex ; i++){ await app.batchPlay([{"_obj":"select","_target":[{"_enum":"ordinal","_ref":"layer","_value":"forwardEnum"}],"makeVisible":false} ]);}
                        app.activeDocument.activeLayers[0].opacity=100;
                        await importarRotulo("thumbSTP_03");
      
                        await app.batchPlay([{"_obj":"flattenImage"},]);
                        if(radioChecado<4){arte=""}
                        Legenda = `• Maquete: ${arte} [${txtModel} ${localADD}${CololBary}] : • Loja: ${Loja}  • Cliente: ${cliente}`;
                        await app.activeDocument.createTextLayer({ name: "datos", contents: Legenda, fontSize: 15, position: {x: 27, y: 660}, fontName: "Arial"});
                        await app.batchPlay([{"_obj":"flattenImage"}]);
          
                        ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                        docMatriz = app.activeDocument.id
                        await sequenciaSave(`[Amostra] ${arte} ${txtModel} ${localADD}${CololBary}.png`, `[Amostra] ${arte} ${txtModel} ${localADD}${CololBary}1.png`);
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
 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// TODAS AS FUNÇÕES AQUI! ::::::::::::
        ////// CARREGAR JALELA PRINCIPAL
        async function dlgCamisa() {
            fetch('html/D10Camisa.html').then(response => response.text()).then(data => {
                D10dlg = document.querySelector("#dlgCamisa");
                D10dlg.show({ title: `PS-fxrios: Camisas Personalizadas!`, resize: "both", size: { width:367, height:342}})
                D10dlg.innerHTML = data; eventosJanelaD10(); 
              //  document.querySelector("#areaFocus").addEventListener('click', async () => {modalFocus(D10dlg, "D10focus")});
                });
        };
             
     //////// TODAS AS FUNÇÕES AQUI! ::::::::::::
    async function eventosJanelaD10(){
        try {
            ///////// IMGEM TEMA DA JANELA EM FORMAR CODIFICADO
            fetch('icons/B64PNG/BCamisa.rtf').then(response => response.text()).then(imgB64 => {
                document.querySelector("#D10imgBase64").src=imgB64;
             });
             /////// CARREGA  OS DADOS DO LOCALSTORAGE
            const dadosRecuperados = localStorage.getItem('D10DadosSave');
            if(dadosRecuperados) { 
                    const dadosObjeto = JSON.parse(dadosRecuperados);
                    radioChecado = dadosObjeto.dados2;
                    document.querySelector("#D10-ck2").checked = dadosObjeto.dados3;
                    document.querySelector("#D10-ck3").checked = dadosObjeto.dados4;
                    document.querySelector("#D10-ck5").checked = dadosObjeto.dados5;
                    statusD10ck5 =dadosObjeto.dados5
            }
            ////////:::::::::::::::::::::::::::::::::::::::::::::::
           
            /////////// VALIDAR  EVENTOS DA LISTA DO LOCAL A SER ESTAMPADO
            const listLEstampa = s1("#listLEstampa");
            listLEstampa.addEventListener("change", evt => {
                const maquetStatus = listLEstampa.selectedIndex > 3; //CONDICIONAL
                document.querySelector("#D10txtMaquet").classList.toggle("D10labelDisable", maquetStatus);
                document.querySelector("#D10-ck5").disabled = maquetStatus;
                document.querySelector("#D10-ck5").checked = !maquetStatus && statusD10ck5;
            });
            ////////:::::::::::::::::::::::::::::::::::::::::::::::

             ////////////CONFIGS SISTEMA DE ABAS
            document.querySelector("#D10-btn1").classList.add('D10selecionado');
            const D10Btns = document.getElementsByClassName("D10-btAbas");
            const D10Abas = document.getElementsByClassName("D10-Abas");
            const D10Btn = Array.from(D10Btns);
            
            for (let i = 0; i < D10Btn.length; i++) {
                D10Btn[i].addEventListener('click', (event) => {
                    // Esconder todas as abas
                    for (let j = 0; j < D10Abas.length; j++){ D10Abas[j].style.display = 'none';}
                    for (let j = 0; j < D10Btn.length; j++) { D10Btn[j].classList.remove('D10selecionado');}
                    D10Abas[i].style.display = 'block';
                    event.currentTarget.classList.add('D10selecionado');
                    focarJanelaD10()
                  });
            };
            ////////::::::::::::::::::::

            ////////OUVINTES BOÕES DE ENQUADRAMENTO
            controlPosition("#D10AJPose1", "#D10AJPose2", "#D10AJPose3", "#D10AJPose4", "#D10AJPose5","#D10AJPose6", "#D10AJPose7", "#D10AJPose8");
            document.querySelector("#D10AJPose9").addEventListener('click', (event) => {
                document.querySelector("#gpAJST").classList.add('trancarJanela') 
                transform =true;  transformaçãoLivre();
             })

            //////// TRNSFORMAÇÃO LIVRE
            async function transformaçãoLivre(){
                try {
                    await core.executeAsModal(async () => {
                        await ZoomDOC(1); 
                        await batchPlay( [{"descriptor": {"_obj":"transform","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"height":{"_unit":"percentUnit","_value":100.1},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"bilinear"},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":0.0},"vertical":{"_unit":"pixelsUnit","_value":0}},"width":{"_unit":"percentUnit","_value":100.1}}, "options": {"dialogOptions": "display"}}], {modalBehavior: "wait" } );
                        await ZoomDOC(0); 
                    },{"interactive": true});
                         transform=false;
                       document.querySelector("#gpAJST").classList.remove('trancarJanela')
                } catch (err) {alert(err)  }  
            };
            ////////// EVENTOS FUNCÕES BOTÕES DE RADIO
    
            ///////// ABRIR O MENU DE AJUSTE DE CORES
            const menuAjuste2 = document.querySelector("#D10btn-Cores");
            menuAjuste2.addEventListener('click', (event) => { janelaAjustesx();});
            ///////// RESTAURAR INICIAL CONFIGS ESTAMPA
            const restar= document.querySelector("#D10btn-resetar");
            restar.addEventListener('click', (event) => { restauraIniConfig("Iniciar")});
             ////////::::::::::::::::::::
            /////////////// FUNÇÃO PROCESSAMENTO FINAL
            document.querySelector("#D10Btn1").addEventListener('click', async () => { 
                if(transform ==true){alertar("Conclua a operação de Tranformação Live!"); return}
                try { finalProcess(); } catch (err) {alert(err)} //// alert(`wConfig: ${wConfig}\nhConfig: ${hConfig}`)
            });
            ///////////////////////////////////////////
            document.querySelector("#D10Btn2").addEventListener('click',async () => {
                if(transform ==true){alertar("Conclua a operação de Tranformação Live!"); return}
                document.querySelector("#dlgCamisa").close('OK'); resetarConfigs();
            });
            ////////::::::::::::::::::::

             /////// CHECKBOC PREVIEW
            const D10Ck4 = document.querySelector("#D10-ck4");
            D10Ck4.addEventListener('click', (event) => {
                    if(D10Ck4.checked == true){ ajustePreview(100, "show")}
                    else{ ajustePreview(0, "hide")};
            });
            ////////::::::::::::::::::::

            ////////FUNÇÃO DOS BOÕES DE RADIO
            radios = document.getElementsByClassName("radiobtn");
            radioBtn = Array.from(radios);
            try {
                for(let i = 0; i < radioBtn.length; i++){ 
                    radioBtn[i].addEventListener('click', (event) => {
                        for(let i = 0; i < radioBtn.length; i++){ 
                        radioChecado= radioBtn.indexOf(event.currentTarget);     
                        radioBtn[i].checked=false; 
                        }
                        event.currentTarget.checked=true;
                        tamanho = event.currentTarget.getAttribute('data-tm');  
                        txtModel = event.currentTarget.getAttribute('data-txt');
                        //////// OBTER W/H CONFORME A ORIENTAÇÃO BASEADO NOS ATRIBUTOS DO BOTÃO
                        tamanhoSize(); disabledListas();
                        /////////////////////
                    })
                }
            } catch (err) {alert(err)}
            ///////////xxxxxxxxxxxxx
            configInterfaceRadios(); 
            configListasAjustAba()
             /////// MARCAR A ÚTIMA OPÇÃO DE RADIO PROCESSADA
            radioChecadoUI(radioChecado);
            /////// JANELA EDITA MEDIDAS
            document.querySelector("#D10btn-medidas").addEventListener("click", async () => {
                dlgEditMedidas(); 
            });

            focarJanelaD10();
            configsAtalhoD10() /////// PERMITIR ATALHOS DE TECLADO
             //////////////////////
            } catch(e){alert(e)}
            ///////////:::::::::::::::::::::
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// TODAS AS FUNÇÕES AQUI! ::::::::::::
  
 ////////////XXXXXXXXXXXXXXXXXXX
 async function dlgEditMedidas() {
    document.querySelector("#dlgEditMedidas").show({ title: "Editar medias!", resize: "both", size: { width: 270, height: 260} })
    editarMedidasConfig();
    lagura.value = wConfig; 
    altura.value  =  hConfig;
    sinbolIMG.style.width = Number(lagura.value)+25
    sinbolIMG.style.height = Number(altura.value)+25
    await getImageThumbnail("thumbIMG")////// ELEMENTO DOM HTML
};
////////xxxxxxxxxxxxx

/////////// FUNÇÕES LISTAS DA ABA AJUSTE
 function disabledListas(){
        try {
            if( radioChecado>7 && radioChecado<12){
                toggleHabilitar2( s1("#listBCor"), s1("#listLEstampa"));  acabamento= "CorBody"
            } 
            else{
                 toggleHabilitar2( s1("#listLEstampa"), s1("#listBCor")); CololBary = ""; 
                 acabamento= "localSel";
            }
        } catch (error) {alert(error)}
 };

 function configListasAjustAba(){
        try {
            /////// F1 INI: LOCAL DA CAMISA A SER ESTAMPADO
            localSTP = s1('#listLEstampa');
            localSTP.selectedIndex=0;
            selLocalSTP(localSTP.selectedIndex);
            localSTP.addEventListener("change", () => { selLocalSTP(localSTP.selectedIndex);})
            ////////F1 FIM:::::::::::::::
            //------------------------------------------------
            /////// F2 INI: COR DO TECIDO DO BODY
            bodyColor = s1('#listBCor');
            bodyColor.selectedIndex=0;
            selCololBary(bodyColor.selectedIndex);
            bodyColor.addEventListener("change", () => { selCololBary(bodyColor.selectedIndex);})
             ////////F2 FIM:::::::::::::::
        } catch (err) {alert(err)}
 }
 ////////:::::::::::::::::::::::

 function selLocalSTP(SA){
    switch(SA){
        case 0: lado = 1; localADD = ""; iconADD="IC-Camisas-N";  break;
        case 1: lado = 2; localADD = "- Frente";   iconADD="IC-Camisas-F"; break;
        case 2: lado = 3; localADD = "- Verso";    iconADD="IC-Camisas-V"; break;
        case 3: lado = 4; localADD = "- Bolso";    iconADD="IC-Camisas-Bs"; break;
        case 4: lado = 5; localADD = "- Mangas"; iconADD="IC-Camisas-M";  break;
    };
};

 function selCololBary(SB){
    switch(SB){
        case 0: CololBary = "- Branco"; corTarget ="B BASE"; break; 
        case 1: CololBary = "- Rosa"; corTarget ="COR-ROSA"; break;
        case 2: CololBary = "- Amarelo"; corTarget ="COR-AMAR"; break;
    };
};



/////// FUNÇÕEs DE NAVEGAÇÃO DAS OPÇÕES DE RADIO
function configInterfaceRadios() {
    es1.on('#D10btn-PC2', 'click',()=> {infantUInavegar("ifA")});
    es1.on('#D10btn-PC1', 'click',()=> {infantUInavegar("ifB")});
    es1.on('#D10leftButton',   'click',()=> {aDiFradios("adulto")});
    es1.on('#D10rightButton', 'click',()=> {aDiFradios("infantil")});
};

function infantUInavegar(m){
    if(m =="ifA"){ idA="#cr2", idB="#cr1" }else if(m=="ifB"){ idA="#cr1", idB="#cr2" };
    toggleVisibility(s1(idA), s1(idB));
};

function aDiFradios(m){
      if(m==="adulto"){
        toggleHabilitar(s1("#D10rightButton"), s1("#D10leftButton"));
        toggleVisibility(s1("#adultoRD"),  s1("#infatilRD"));
      }
      else if(m==="infantil"){
        toggleHabilitar( s1("#D10leftButton"), s1("#D10rightButton"));
        toggleVisibility( s1("#infatilRD"), s1("#adultoRD"));
      };
};

function tggCheckboxKey(e) {
    let checkbox = document.querySelector(e);
    checkbox.checked = !checkbox.checked;
    focarJanelaD10(); 
};

function toggleHabilitar2(d, t) { d.disabled=false; t.disabled=true}
function toggleVisibility(show, hide) {  show.style.display = "flex";  hide.style.display = "none";}
function toggleHabilitar(d, t) { d.classList.remove('D10-Desabilitado'); t.classList.add('D10-Desabilitado');}

/////////:::::::::::::::::::::::


/////////////////////////////////////////////////////////////
//////////////// ATALHOS CONFIGS  XXXXXXXXXXXXX
function configsAtalhoD10() {
    processamento=false;
    D10dlg.addEventListener("close", () => {
        document.removeEventListener('keydown', configsD10Teclado);
        if(processamento===false) {resetarConfigs()}
    });
    document.addEventListener('keydown', configsD10Teclado);
    ///////PROCESSAR ENTER
    async function configsD10Teclado(event) {
        if (event.keyCode === 13) {finalProcess()}
        else if(event.keyCode === 27){D10dlg.close('OK')}
        else if(event.keyCode ==   77) {tggCheckboxKey("#D10-ck5")}//// CHEKBOX MAQUETE: [M]
        else if(event.keyCode ==   66) {tggCheckboxKey("#D10-ck2")}//// CHEKBOX BACKUP DOC: [B]
        else if(event.keyCode ==   65) {tggCheckboxKey("#D10-ck3")}//// CHEKBOX AUTO IMPRIMIR: [A]
        else if(event.keyCode == 107) {await configsPositions(1, 102)}////ZOOM MAIS: [+]
        else if(event.keyCode == 109) {await configsPositions(2,   98)}////ZOOM MENOS [-]
        else if(event.keyCode ==   37) {await configsPositions(3, -10);}////MOVERA PARA ESQUEDA: [←]
        else if(event.keyCode ==   39) {await configsPositions(3, 10);}////MOVERA PARA DIREITA: [→] 
        else if(event.keyCode ==   33) {await configsPositions(4, -10);}////MOVERA PARA CIMA: [PageUp]
        else if(event.keyCode ==   34) {await configsPositions(4, 10);}////MOVERA PARA BAIXO: [PageDown]
        else if(event.keyCode == 112) {await configsPositions(5, null);}////PRENCHER HORIZONTALMENTE [F1]
        else if(event.keyCode == 113) {await configsPositions(6, null);}////PRENCHER VERTICALMENTE [F2]
        else if(event.keyCode ==40 || event.keyCode ==38) {seleItensSetas(event); focarJanelaD10()}//// OPÇÃO MAQUETE [SETAS CIMA/BAIXO]
        else if(event.keyCode ==76) {localEstampaSel(event)}//// OPÇÃO MAQUETE [SETAS CIMA/BAIXO]
    }
};
/////////////////////////////////////////////////////////////
//////////////// ATALHOS CONFIGS  XXXXXXXXXXXXX


//////// NAVEGAR NAS LISTA DE PRESSETS POR ATALHOS   
async function seleItensSetas(event){
    try {
        rdOptions = document.querySelectorAll('.radiobtn');
        rdOptions.forEach((modelo) => {modelo.checked=false});
        if (event.keyCode === 40) {
            event.preventDefault();
            radioChecado = (radioChecado + 1) % rdOptions.length;
            rdOptions[radioChecado].checked=true;
            radioChecadoUI(radioChecado);
         } 
        else if (event.keyCode === 38) {
            event.preventDefault();
            radioChecado = (radioChecado - 1 + rdOptions.length) % rdOptions.length;
            rdOptions[radioChecado].checked=true;
            radioChecadoUI(radioChecado);
        };
    } catch (error) {alert(error)}
};

//////// NAVEGAR NAS LISTA LOCAL DA ESTAPA POR ATALHOS   
async function localEstampaSel(event){
    try {
        if(acabamento =="CorBody"){txtAcabamento = s1("#listBCor"); s1("#listLEstampa").selectedIndex =0;}
        else{ txtAcabamento = s1("#listLEstampa"); s1("#listBCor").selectedIndex =0;};
        let options = txtAcabamento.options;
        let selectedIndex = txtAcabamento.selectedIndex;
        event.preventDefault();
        do {selectedIndex = (selectedIndex + 1) % options.length;} 
        while (options[selectedIndex].value === "-");
        txtAcabamento.selectedIndex = selectedIndex;
        s1("#estpLocal").textContent=txtAcabamento.value.charAt(0);
        s1("#estpLocal").setAttribute("title", txtAcabamento.value)
        //////DETERMINA A AÇÃO DE ACABAMENTO DA ESTAmPA
        if(acabamento =="CorBody"){selCololBary(txtAcabamento.selectedIndex);}
        else{ selLocalSTP(txtAcabamento.selectedIndex)};
        focarJanelaD10();
    } catch (err) { alert(err) }
};

////////FOCAR JANELA PRINCIPAL
function focarJanelaD10() {
    function focar() { document.querySelector("#D10focus").focus(), 16 }
    setTimeout(focar, 150);
};



function tamanhoSize(){
    try {
        if(app.activeDocument.height < app.activeDocument.width ){
            wConfig= tamanho.split("x")[0]; hConfig = tamanho.split("x")[1]; selIndex = 2
            rotacionarDoc=true; wCorteConfig=2441; hCorteConfig=1732;//// SLICE CORTE
        }
        else{
             wConfig= tamanho.split("x")[1]; hConfig = tamanho.split("x")[0];selIndex = 1
             rotacionarDoc=false; wCorteConfig=1732; hCorteConfig=2441;//// SLICE CORTE
            }
         s1("#D10btn-medidas").textContent=`Tam: ${wConfig}x${hConfig}`
         s1("#result-md").innerHTML= `Modelo: ${txtModel}`
    } catch (err) {}
}

/////// MARCAR A ÚTIMA OPÇÃO DE RADIO PROCESSADA
function radioChecadoUI(índice) {
    try {
        for (const radio of radioBtn) { radio.checked = false; }
        const radio = radioBtn[índice]; radio.checked = true;  
        tamanho = radio.getAttribute('data-tm');
        txtModel = radio.getAttribute('data-txt'); 
        tamanhoSize();
        if (radioChecado <8){aDiFradios("adulto")}  
         else{
            aDiFradios("infantil");
            if(radioChecado>15){ infantUInavegar("ifA")}
            else{infantUInavegar("ifB")}
         };
         s1("#D10btn-medidas").textContent=`Tam: ${tamanho}`;
         s1("#result-md").innerHTML= `Modelo: ${txtModel}`
         disabledListas()
    } catch (err) {alert(err) }  
  }
 ////////:::::::::::::::

 function editarMedidasConfig(){
    try {
        /////// CONFIGS SETAS INPUTS
        cont= 0.4;
        lagura = s1('#D10-Larg');
        altura = s1('#D10-Alt')
        setas = document.getElementsByClassName("btnsetas");
        sinbolIMG = s1('#thumbIMG')
        setaBtn = Array.from(setas);
       /////// BOTÕES SETAS DOS IMPUNTS LARGURA E ALTURA
        for (const seta of setaBtn) {
            seta.addEventListener("click", () => {
                const index= setaBtn.indexOf(seta)
                switch (index) {
                case 0:
                        if(lagura.value >40 || altura.value >40){inserirIcone=false; return}  
                        updateWidth(cont);
                    break;
                case 1:
                    if(lagura.value < 8 || altura.value < 8){return} 
                        updateWidth(-cont); 
                    break;
                case 2:
                    if(lagura.value >40 || altura.value >40){inserirIcone=false; return}
                        updateHeight(cont); 
                    break;
                case 3:
                    if(lagura.value < 8 || altura.value < 8){return} 
                        updateHeight(-cont); 
                    break;
                }
            });
          }//////::::::::::::::::

          function updateWidth(diff) {
                lagura.value = Number(lagura.value) + Number(diff);
                altura.value = (Number(lagura.value) / Number(wConfig)) * Number(hConfig);
                miniaturaConfig();
          }
          
          function updateHeight(diff) {
                altura.value = Number(altura.value) + Number(diff);
                lagura.value = (Number(altura.value) / Number(hConfig)) * Number(wConfig);
                miniaturaConfig();
          }

        lagura.addEventListener("input", function(){
             if(lagura.value >40 || altura.value >40){return} updateWidth(null)
        });
        altura.addEventListener("input",  function(){
             if(lagura.value >40 || altura.value >40){return} updateHeight(null) 
        });

        ////////// EVENTOS NOTÕES DA JANELA
        document.querySelector("#D10-EP-FE").addEventListener("click", async () => {
            document.querySelector('#dlgEditMedidas').close('OK');
        });
        document.querySelector("#D10-EP-RE").addEventListener("click", async () => {
            lagura.value= wConfig; altura.value = hConfig; updateHeight(null) 
        });
        document.querySelector("#D10-EP-OK").addEventListener("click", async () => {
            try {
                document.querySelector('#dlgEditMedidas').close('OK');
                s1("#D10btn-medidas").innerHTML=`Tam: ${Number(lagura.value).toFixed(1)}x${Number(altura.value).toFixed(1)}`
                 wConfig = Number(lagura.value).toFixed(1);
                 hConfig = Number(altura.value).toFixed(1);
                 focarJanelaD10()
            } catch (err) {alert(err) }
        });
        ////////:::::::::::::::::::::::::::
    } catch (err) {alert(err)}
 }

 function miniaturaConfig(){
    try {
        sinbolIMG.style.width = lagura.value+25
        sinbolIMG.style.height = altura.value+25
        const larguraAtual = wSinbol.offsetWidth;
        const alturaAtual = wSinbol.offsetHeight;
        const novaLargura = larguraAtual + 0.5;
        const novaAltura = alturaAtual + 0.5;
        sinbolIMG.style.width = novaLargura 
        sinbolIMG.style.height = novaAltura 
    } catch (err) {  }
 }

 //////// REDIMENSINAR ESTAMPA COM BASE NA LARGURA DINAMICA
 async function conteudoWSize(method){
    anchorPos = require('photoshop').constants.AnchorPosition;
    app.activeDocument.activeLayers[0].scale(50, 50, anchorPos.MIDDLECENTER)
    const docWidth = method;
    const bounds = app.activeDocument.activeLayers[0].bounds
    const w = bounds.right - bounds.left;
    f1 = ((docWidth / w) * 100);
    app.activeDocument.activeLayers[0].scale(f1, f1, anchorPos.MIDDLECENTER);
} 

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
       {"_obj":"newGuideLayout","guideLayout":{"$GdCA":0,"$GdCB":255,"$GdCG":132,"$GdCR":74,"_obj":"guideLayout","marginBottom":{"_unit":"distanceUnit","_value":0.0},"marginLeft":{"_unit":"distanceUnit","_value":0.0},"marginRight":{"_unit":"distanceUnit","_value":0.0},"marginTop":{"_unit":"distanceUnit","_value":0.0}},"guideTarget":{"_enum":"guideTarget","_value":"guideTargetCanvas"},"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}},
       /////////ADICIONAR SHAPE PESONALIZADA****************
       {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}},
       {"_obj":"contract","by":{"_unit":"pixelsUnit","_value":1.0},"selectionModifyEffectAtCanvasBounds":true},
       {"_obj":"make","at":{"_enum":"channel","_ref":"channel","_value":"mask"},"new":{"_class":"channel"},"using":{"_enum":"userMaskEnabled","_value":"revealSelection"}},
       {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","userMaskLinked":false}},
       {"_obj":"canvasSize","height":{"_unit":"distanceUnit","_value":28.44},"horizontal":{"_enum":"horizontalLocation","_value":"center"},"relative":true,"vertical":{"_enum":"verticalLocation","_value":"center"},"width":{"_unit":"distanceUnit","_value":28.44}},
   ], {});
   await loadAjustes(); 
   await app.batchPlay([
       {"_obj":"selectAllLayers","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]},
       {"_obj":"make","_target":[{"_ref":"layerSection"}],"from":{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"},"layerSectionEnd":23,"layerSectionStart":22,"name":"Group 1"},
       {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","name":"ConfigsOBJ"}},
       {"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]},
       {"_obj":"make","_target":[{"_ref":"snapshotClass"}],"from":{"_property":"currentHistoryState","_ref":"historyState"}},
       {"_obj":"select","_target":[{"_name":"Snapshot 1","_ref":"snapshotClass"}]},
       {"_obj":"set","_target":[{"_property":"currentHistoryState","_ref":"historyState"}],"to":{"_obj":"snapshotClass","name":"Inciar"}},
   ], {});
};

/////////ADICIONAR O CORTE DA ESTAMPA
async function sliceAdicionar(bot,left,righ,top){
    await app.batchPlay([
    {"_obj":"make","_target":[{"_ref":"slice"}],"using":{"_obj":"slice","at":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":bot},"left":{"_unit":"pixelsUnit","_value":left},"right":{"_unit":"pixelsUnit","_value":righ},"top":{"_unit":"pixelsUnit","_value":top}},"type":{"_enum":"sliceType","_value":"user"}}},
    ]);
};
  // ["ADSTops","ADSBottoms","ADSLefts","ADSRights","ADSCentersH","ADSCentersV"]

  async function importarRotulo(img){
    dirTemplates = `${Usuario}/AppData/Roaming/temp_stamps/images/`;
    try {await carregThumbSTP(`${dirTemplates}${img}.jpg` );}catch (e){};
    try {await carregThumbSTP(`${dirTemplates}${img}.png`);}catch (e){};
};


/////////////////////////////////////////////////////
async function finalProcess(){
    try { 
            processamento=true;
            document.querySelector("#dlgCamisa").close('OK'); 
            SalvarDados(); ajustePreview(100, "show");
            progressDLG("Aquarde Processing . . ."); 
            function evento() { setTimeout(() =>{
                ////////  VERIFICA SE O PRECESSO FINAL 
                const D10ck5= document.querySelector("#D10-ck5");
                if(D10ck5.checked==true){  StampConfigP3() }else{ StampConfigP2()}
                ////////:::::::::::::::::::::::::::::::::::::::::::::
                }
            )} setTimeout(evento, 1000);//////depois alterar para 1000
        } catch (err) {alert(err)};
    };
    ////////::::::::::::::::::::::::::::

    
    /////// SALVAR  DINAMICAMENTE OS DADOS
    function SalvarDados(){
        try {
            const dadosD10 = {
                dados2: radioChecado, // radioChecado,
                dados3: document.querySelector("#D10-ck2").checked,
                dados4: document.querySelector("#D10-ck3").checked,
                dados5: document.querySelector("#D10-ck5").checked,
            };
            localStorage.setItem('D10DadosSave', JSON.stringify(dadosD10));
        } catch (err) { alert(err) }
     };
     
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

    try {
        
    } catch (err) { alert(err) }
