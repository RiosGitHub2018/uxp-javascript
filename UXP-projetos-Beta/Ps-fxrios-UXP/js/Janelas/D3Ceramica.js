try {
    //////////////////////////////////////////////////////////////////
    const inciarD3 = document.querySelector("#serv-btn8");
    inciarD3.addEventListener("click", async (event) => {
        if (event.altKey || event.metaKey) { await docEstampa(566.6, 566.6, "Cerâmica")} 
        else { process = true; await incialConfigs() ;}
    });

///FUNCTION incialConfigs INCIAR
async function incialConfigs() {
    dialogsEventsFalse();
    await dlgCeramica();
    return
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
                arte = "Cerâmica";
                criarPasta(`${Usuario}/AppData/Roaming`, "temp_stamps");
                ////// AÇÕES DE EVENTOS AQUI!
                await app.batchPlay([{"_obj":"flattenImage"}, {"_obj":"reset","_target":[{"_property":"colors","_ref":"color"}]},], {});

                ////// TAMANHO MEDIO
                // if(gethDOC>getwDOC){await configMoldes(2362, 1575, 2362, 1575, "shp_QKbcas", "MD-QUAD" );}
                // else{ await configMoldes(1575, 2362, 1575, 2362, "shp_QKbcas", "MD-QUAD" );};
                await configMoldes(1622, 1622, 1622, 1622, "shp_QKbcas", "MD-QUAD" );
                app.activeDocument.activeHistoryState = app.activeDocument.historyStates [0];

                ////// TAMANHO GRANDE
                if(gethDOC>getwDOC){await configMoldes(1622, 1228, 1622, 1228, "shp_QKbcas", "MD-15x20" );}
                else{await configMoldes(1228, 1622, 1228, 1622, "shp_QKbcas",  "MD-15x20" ); };
                app.activeDocument.activeHistoryState = app.activeDocument.historyStates [0];
    
                ////// TAMANHO PEQUENO
                if(gethDOC>getwDOC){await configMoldes( 2409, 1622,  2409, 1622, "shp_QKbcas", "MD-20x30" );}
                else{await configMoldes(1622,  2409, 1622,  2409, "shp_QKbcas", "MD-20x30" );};
                await configsPositions(5, null);
                app.activeDocument.activeHistoryState = app.activeDocument.historyStates [0];
                await app.batchPlay([ {"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}], {});
                sanapBase ="MD-20x30";
               
                // await ZoomDOC(0); 
                await document.querySelector('#processServic').close('OK');
                await dlgCeramica()
              
                await legendaDados();
            } catch (err) {alert(err)}
            ////////////////////////
       },{"interactive": true});
    //////////////::::::::::::::
    };          
};
};
////////::::::::::::::::::::
        
     ////////////////////////////////////////
     async function StampConfigP2(){
        try {
            await core.executeAsModal(async (executionContext) => {
                ////// FUNÃO SUSPENDHISTORY DA FUNÇÃO INICIAL
                let hostControl = executionContext.hostControl; documentID = app.activeDocument.id; 
                suspensionID = await hostControl.suspendHistory({ "documentID": documentID,"name": "FinalConfg" });  
                //////:::::::::::::::::::
                const D3r1 = document.querySelector("#D3-r1");
                const D3ck1 = document.querySelector("#D3-ck1");
                const D3ck2= document.querySelector("#D3-ck2");
         
                if(D3r1.checked==true){
                    tamanho="10x15"; scalaWH=77.92; ajusteY=36;
                    Bt1=1584; Bt2=63; Bt3=1589; Bt4=55; tracado="RecortCeramica_15x15";
                }
                else{
                    tamanho="20x20"; scalaWH=101.72; ajusteY=341;
                    Bt1=2191; Bt2=24; Bt3=1630; Bt4=64; tracado="RecortCeramica_20x20";
                };
                
                anchorPos = require('photoshop').constants.AnchorPosition
                if(D3ck1.checked==false){ app.activeDocument.activeLayers[0].scale(-100, 100); mat = "PORCELANA";}
                else{mat = "VIDRO"};
                
               app.activeDocument.resizeCanvas(1573, 1573);
                await selectCamada("Conteudo");
                await app.batchPlay([
                    {"_obj":"select","_target":[{"_name":"AjustColor","_ref":"layer"}],"makeVisible":false,"selectionModifier":{"_enum":"selectionModifierType","_value":"addToSelectionContinuous"}},
                    {"_obj":"clearAllGuides"},{"_obj":"newPlacedLayer"}
                ]);
                 app.activeDocument.resizeCanvas(1622, 2323, anchorPos.TOPCENTER);
    
                app.activeDocument.activeLayers[0].scale(scalaWH, scalaWH);
                app.activeDocument.activeLayers[0].translate(0, ajusteY);
                await ADDselecaoShapes(Bt1, Bt2, Bt3 ,Bt4, tracado, 1);
                await solidColorCamada(0,0,0);
    
                const { left, top, right, bottom } =app.activeDocument.activeLayers[0].bounds;
                await app.batchPlay([{"_obj":"flattenImage"}]);
                            
                await ADDselecaoShapes(79, 0, 184, 0, "IconAllServices", 1);
                await solidColorCamada(0,0,0);
                app.activeDocument.activeLayers[0].translate(left, bottom); 
                bounds = app.activeDocument.activeLayers[0].bounds;
    
                await legendaDados();
                legenda = `Azulejo de [ ${mat} ]: • Tamanho: ${tamanho} • Loja: ${Loja}  • Cliente: ${cliente}`;
                xPosition= bounds.left+84; yPosition = bounds.bottom-19;
                await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 22, position: {x: xPosition, y: yPosition}, fontName: "Arial"});
                await app.batchPlay([{"_obj":"flattenImage"}]);
    
                ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                await sequenciaSave(`[OK! ] Cerâmica [${tamanho}].png`, `[OK! ] Cerâmica [${tamanho}] 1.png`);
                await estampasSave(estampaName); ////// NOME OBTDO DA FUNÇÃO ANTERIOR.
                  if(D3ck2.checked==true){ await moveOrigArtes()};

                await app.batchPlay([
                    {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":estampaName},
                    {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                ]);
                await ZoomDOC(0); //await ZoomDOC(1);
                await document.querySelector('#processServic').close('OK');
                textoTranferencia();

            },{"interactive": true});
        } catch (err) {alert(err)}
    };
    ////////::::::::::::::::::::

    /////////////// CRIAÇÃO DE MAQUETE 
    async function StampConfigP3(){
        try {
            await core.executeAsModal(async () => {
                const D3r1 = document.querySelector("#D3-r1");
                const D3r2 = document.querySelector("#D3-r2");
                const D3ck1 = document.querySelector("#D3-ck1");
                const D3ck2= document.querySelector("#D3-ck2");
                if(D3r1.checked==true){ tamanho="10x15" } else{ tamanho="20x20" };
                if(D3ck1.checked==false){ mat = "PORCELANA";} else{mat = "VIDRO"};

                await app.batchPlay([
                    {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":"Maquete"},
                    {"_obj":"make","_target":[{"_ref":"slice"}],"using":{"_obj":"slice","at":{"_obj":"rectangle","bottom":{"_unit":"distanceUnit","_value":583.92},"left":{"_unit":"distanceUnit","_value":16.92},"right":{"_unit":"distanceUnit","_value":583.56},"top":{"_unit":"distanceUnit","_value":17.28}},"type":{"_enum":"sliceType","_value":"user"}}},
                ]);
                await saveThumbSTP();
                await importMokups("{mcp-&006}.psd");
    
                if(D3ck1.checked===true){
                    await selectCamada("Ceramic_vd");
                    await app.batchPlay([{"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","opacity":{"_unit":"percentUnit","_value":100.0}}}]);
                    await selectCamada("Frente_cv");
                }
                else{
                    await selectCamada("Ceramic_df");
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

                legenda = `• Maquete: Azulejo de [ ${mat} ] • Tamanho: ${tamanho} • Loja: ${Loja}  • Cliente: ${cliente}`;
                await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 15, position: {x: 27, y: 660}, fontName: "Arial"});
                await app.batchPlay([{"_obj":"flattenImage"}]);
    
                ////////// ADICIONAR ORDEM NUMÉRICA AO AQUIVO JÁ EXISTENTE
                docMatriz = app.activeDocument.id
                await sequenciaSave(`[Amostra] Cerâmica [${tamanho}].png`, `[Amostra] Cerâmica [${tamanho}] 1.png`);
                await estampasSave(estampaName);

                await app.batchPlay([
                    {"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"name":estampaName},
                    {"_obj":"select","_target":[{"_id":docMatriz,"_ref":"document"}]}, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}
                ]);
                await ZoomDOC(0); await ZoomDOC(1);
                await document.querySelector('#processServic').close('OK');
       
            },{"interactive": true});
        } catch (err) {alert(err) }
    };
    ////////::::::::::::::::::::
        
     //////// TODAS AS FUNÇÕES AQUI! ::::::::::::
    function execonfigsD3(){
        try {
          ///////// IMGEM TEMA DA JANELA EM FORMAR CODIFICADO
          fetch("icons/B64PNG/BCeramica.rtf")
            .then((response) => response.text())
            .then((imgB64) => {
              document.querySelector("#imgBase4").src = imgB64;
            });

          corregarDados();

          const D3Btns = document.getElementsByClassName("d3-btAbas");
          const D3Abas = document.getElementsByClassName("d3-Abas");
          const D3Btn = Array.from(D3Btns);

          for (let i = 0; i < D3Btn.length; i++) {
            D3Btn[i].addEventListener("click", (event) => {
              // Esconder todas as abas
              for (let j = 0; j < D3Abas.length; j++) {
                D3Abas[j].style.display = "none";
              }
              for (let j = 0; j < D3Btn.length; j++) {
                D3Btn[j].classList.remove("d3selecionado");
              }
              D3Abas[i].style.display = "block";
              event.currentTarget.classList.add("d3selecionado");
            });
          }
          ////////::::::::::::::::::::

            ////////PRESETS DE MODELOS
            indice = dadosUI_Obj[0].dadosA;
            s1("#D3-ck2").checked =  dadosUI_Obj[0].dadosB;    
            s1("#D3-ck3").checked =  dadosUI_Obj[0].dadosC;   
            s1("#D3-ck5").checked =  dadosUI_Obj[0].dadosD;     
            let novoPreset;
  
            initSvgIcons(".svg-icon");
            initSvgIcons(".svg-icon2");

          //  es1.on("#D13-presets", "click", () => { toggleBtnsUIpreset(); });
            es1.on("#D13-btnPresets", "click", () => { 
                toggleBtnsUIpreset();
            });
            //////// CRIAR PRESETS
            es1.on("#D13-Pres01", "click", () => {
                 novoPreset=true;  toggleDlgUIpreset(); 
             });
            /////// DELETAR PRESSETS
            es1.on("#D13-Pres02", "click", () => { 
                         deleteIitens()
            });
            /////// EDITAR PRESETS
            es1.on("#D13-Pres03", "click", () => {
                 novoPreset=false;  toggleDlgUIpreset()
                 });
            ///////RESETAR PRESETS
            es1.on("#D13-Pres04", "click", () => { resetarLista();});
            ////// SAIR DA JANELA PRESETS
            es1.on("#D13-PresSair", "click", () => {
                 toggleDlgUIpreset(); toggleBtnsUIpreset();
                });
            ////// SALVAR PRESETS
            es1.on("#D13-PresSaves", "click", () => { 
                presetsConfig();
                s1('#D3list_MD').selectedIndex= conteudo_Obj.length-1;
                toggleBtnsUIpreset();
            });
            ////// OUNVITES DA LISTA
            s1("#D3list_MD").addEventListener("change", ()=> { 
                indice = s1('#D3list_MD').selectedIndex;
                maquetStatus(conteudo_Obj[indice].make)
                desabledBtnsSVG( ["#D13-Pres02", "#D13-Pres03", "#D13-Pres04"] );
            });
         
           ///////// CARREGAR LISTA DINÂMICA
           corregarLista();
           async function corregarLista() {
               try {
                   conteudo_Obj = new Array();  
                   //// RESGATA DO LOCALSTORAG SE NAO EXISTIR ADICIONA OS ITENS PADROES:
                   conteudo_Obj = JSON.parse(localStorage.getItem("modelosSave")) || [ 
                        {
                            nome: "MD-15x15",
                            forma: "shp_QKbcas",
                            wSize: 15,
                            hSize: 15,
                            make: true
                        }, {
                            nome: "MD-20x20",
                            forma: "shp_QKbcas",
                            wSize: 20,
                            hSize: 20,
                            make: true
                        },
                    ];	
                    conteudo_Obj.forEach(  (modelo) => {
                        s1("#D3list_MD").insertAdjacentHTML("beforeend", `<option>${modelo.nome}</option>`);
                        s1('#D3list_MD').selectedIndex = dadosUI_Obj[0].dadosA;    
                        try {maquetStatus(conteudo_Obj[indice].make) } catch (err) {}
                    });
               } catch (err) {alert(err) }
           }
           ///////////:::::::::::::::::::::::::::::::::::::

           function statusDlgUIpreset(){
                try {
                    if(novoPreset==true){
                        s1("#D13v01").value = "";
                        s1("#D13v02").value = "shp_QKbcas",
                        s1("#D13v03").value = "";
                        s1("#D13v04").value = "";   
                        s1("#D13ck3").checked=false;
                        s1("#D13-PresSaves").textContent= 'Salvar';
                    }
                    else{
                        s1("#D13v01").value =  conteudo_Obj[indice].nome
                        s1("#D13v02").value =  conteudo_Obj[indice].forma
                        s1("#D13v03").value =  conteudo_Obj[indice].wSize
                        s1("#D13v04").value =  conteudo_Obj[indice].hSize
                        s1("#D13ck3").checked =  conteudo_Obj[indice].make
                        s1("#D13-PresSaves").textContent= 'Atualizar';
                    }
                    function active() { s1("#D13v01").focus(), 16 }setTimeout(active, 50);
                    formatNomePrests();

                  } catch (err) {alert(err)}
           };

          function presetsConfig(){
                try {
                    atualizar = true;
                    nomeMD = s1("#D13v01").value;
                    formaMD = s1("#D13v02").value;
                    wSizeMD  = s1("#D13v03").value;
                    hSizeMD  = s1("#D13v04").value;
                    makeMD =  s1("#D13ck3").checked

                    const itensPrefs = { nome: nomeMD,  forma: formaMD,  wSize: wSizeMD,  hSize: hSizeMD, make: makeMD }

                    const msg1 = "Esse preset já consta na lista, adicione outro nome!";
                    const msg2 = "Preencha todos campos!";

                    if (novoPreset == true) {
                      itemExite = conteudo_Obj.map(function (iitens) {                        
                        return iitens.nome;
                      });
                      if (itemExite.includes(nomeMD) == true) {
                        alertar(msg1);
                        atualizar = false;
                        presetsUIDlg = false; 
                      } else if (!nomeMD || !formaMD || !wSizeMD || !hSizeMD) {
                        alertar(msg2);
                        atualizar = false;
                      } else {
                        if(conteudo_Obj.length==2){ conteudo_Obj.push({ nome: "-"});}
                        conteudo_Obj.push(itensPrefs);
                        maquete = s1("#D13ck3").checked;
                      }
                    } else {
                      conteudo_Obj.splice(indice, 1, itensPrefs);
                      maquete = conteudo_Obj[indice].make;
                    }

                    if (atualizar ==true) {
                        toggleDlgUIpreset();  
                        s1("#D3list_MD").innerHTML=""
                        atualizarLista();
                        maquetStatus(maquete);   
                    }  
                } catch (err) {alert(err)}
           };

            function resetarLista(){
                confiramar("Todos os presets adicionados seram removidos! Você deseja  removê-los?");
                s1("#confirm_btn2").addEventListener("click", async () => {
                    dlg.close('OK'); 
                    localStorage.removeItem("modelosSave"); 
                    corregarLista(); 
                    s1("#D3list_MD").innerHTML=""
                    atualizarLista();
                })
            };

           function deleteIitens(){
                confiramar(`Você tem certeza que deseja remover o preset "${conteudo_Obj[indice].nome}"?`);
                s1("#confirm_btn2").addEventListener("click", async () => {
                    dlg.close(toggleBtnsUIpreset()); 
                    conteudo_Obj.splice(indice, 1);
                    if(conteudo_Obj.length==3){ conteudo_Obj.pop()}
                    s1("#D3list_MD").innerHTML=""
                    atualizarLista();
                })
            };
          
           function atualizarLista(){
                conteudo_Obj.forEach(  (modelo) => {
                    s1("#D3list_MD").insertAdjacentHTML("beforeend", `<option>${modelo.nome}</option>`);
                });
                localStorage.setItem("modelosSave", JSON.stringify(conteudo_Obj));
                desabledBtnsSVG( ["#D13-Pres02", "#D13-Pres03", "#D13-Pres04"] );
                toggleBtnsUIpreset();
           };
           
            function maquetStatus(maquete){
                try {
                      if(maquete ==false ){ 
                        s1("#D3-ck5").disabled= true; es1.css('#D13-lbMac', { color: "#707070"}) 
                        s1("#D3-ck5").checked=false;
                    }
                     else{ s1("#D3-ck5").disabled= false; es1.css('#D13-lbMac', { color: "#dddada"}) }
                } catch (err) {alert(err)}
            };

           let presetsUI = false;
           function toggleBtnsUIpreset() {
                if (presetsUI != true) {
                    es1.css("#D13-presets", { display: "flex" });
                    es1.css("#D3-ck1", { display: "none" });
                    presetsUI = true;
                } else {
                    es1.css("#D13-presets", { display: "none" });
                    es1.css("#D3-ck1", { display: "flex" });
                    presetsUI = false;
                }
                desabledBtnsSVG( ["#D13-Pres02", "#D13-Pres03", "#D13-Pres04"] );
          };

          ////// JANELA CONFIG PRESTS
          let presetsUIDlg  = false;
          function toggleDlgUIpreset() {
                if (presetsUIDlg != true) {
                    es1.css("#D3list_MD", { display: "none" });
                    es1.css("#D13-DlgPrests", { display: "flex" });
                    presetsUIDlg = true;
                    statusDlgUIpreset()
                } else {
                    es1.css("#D3list_MD", { display: "flex" });
                    es1.css("#D13-DlgPrests", { display: "none" });
                    presetsUIDlg = false;
                }
          };

          async function desabledBtnsSVG(botoes){
            try {
                const updateIcon = await initSvgIcons(".icon");
                botoes.forEach( botoes=> {
                    if(conteudo_Obj.length==2){
                          updateIcon( botoes, "#878787"); s1(botoes).classList.add("D13disable");
                         }
                         else if(
                            s1('#D3list_MD').selectedIndex ==0 ||
                             s1('#D3list_MD').selectedIndex ==1)
                             {
                          updateIcon( botoes, "#878787"); s1(botoes).classList.add("D13disable");
                         }
                    else{ updateIcon( botoes, "#d6d6d6"); s1(botoes).classList.remove("D13disable") }
                });
            } catch (error) {alert(error)}
        };
          ///////// FORMATAÇÃO DO NOME COM PREFIXO PADRÃO
            function formatNomePrests(){
                s1("#D13v01").addEventListener('input', function() {
                     let value = this.value.replace('MD-', '');  // Remove o prefixo existente se houver
                    if (value) { this.value = 'MD-' + value; }   // Adiciona o prefixo apenas se houver algum texto
                    if (!value) { this.value = ''; }   // Se o campo estiver vazio, não adiciona o prefixo
                    const end = this.value.length;  // Posiciona o cursor no final do texto
                    this.setSelectionRange(end, end);
                });
            };

           ///////// FECHAR JANELA PRESETS CLICANDO FORA
        //   document.addEventListener('click', function(event) {
        //       try {
        //         if (
        //             !s1("#D13-DlgPrests").contains(event.target) &&
        //             !s1("#D13-Pres01").contains(event.target) &&
        //             !s1("#D13-Pres03").contains(event.target) &&
        //             !s1("#confirm_btn1").contains(event.target)
        //           ) {
        //            presetsUIDlg = true;
        //             toggleDlgUIpreset();
        //             presetsUIDlg = false;
        //            }
        //       } catch (err) {}
        //    });
          /////////::::::::::::::::::::::

 
          //    s1('#').value = 'string';
          //    s1('#').selectedIndex= Number(index);
          //    s1('#').textContent= 'Text';
          //    s1('#').innerHTML =`string`;
          //    s1('#').checked = true;
          //    s1('#').disabled = true;
          //    s2('.elemento').forEach(element =>{alert(element.textContent)});
          //    es1.css('#elemento5', { transform:'translateX(4px)'})
          //    es1.on('#elemento', 'click', () =>{ funcao();});

          //   ////////OUVINTES BOÕES DE ENQUADRAMENTO
          //   controlPosition("#D3AJPose1", "#D3AJPose2", "#D3AJPose3", "#D3AJPose4", "#D3AJPose5","#D3AJPose6", "#D3AJPose7", "#D3AJPose8");
          //    ////////::::::::::::::::::::
          //    ///////// ABRIR O MENU DE AJUSTE DE CORES
          //     const menuAjuste = document.querySelector("#btn-Cores");
          //     menuAjuste.addEventListener('click', (event) => {
          //         try {
          //             /////////REMOVE O FOCU DA JANELHA PRINCIPAL
          //             require('photoshop').core.performMenuCommand({
          //                 commandID:5933,
          //                 kcanDispatchWhileModal: true,
          //                 _isCommand: false
          //             });
          //             janelaAjustesx();
          //         } catch (err) {alert(err)}
          //     });
            //   ///////// RESTAURAR INICIAL CONFIGS ESTAMPA
            //   const restar= document.querySelector("#D3btn-resetar");
            //   restar.addEventListener('click', (event) => { restauraIniConfig("Inciar")});
            //   ////////::::::::::::::::::::
              ///////////////////////////////////////////
              document.querySelector("#d3Btn2").addEventListener('click', () => {
                  document.querySelector("#dlgCeramica").close('OK'); resetarConfigs();
                  D3CeramicaEventos=false;
              });

            /////////////// FUNÇÃO PROCESSAMENTO FINAL
            document.querySelector("#d3Btn1").addEventListener('click', async () => { 
               // finalProcess()
                exportarDados()
                alert("Processs")

             });

          //     ////////////// ATALHOS CONFIGSXXXXXXXXXXXX
          //     //////// PRECESSO FINAL
          //     document.addEventListener("keydown", canecaKey);
          //     async function canecaKey(event) {
          //             if (event.keyCode === 13) {
          //                 document.removeEventListener("keydown", canecaKey); // Remove o event listener após o evento ter sido acionado
          //                 await finalProcess();
          //             };
          //             if (event.keyCode == 68) { document.querySelector("#D3-r1").checked=true;}
          //             if (event.keyCode == 86) { document.querySelector("#D3-r2").checked=true;}
          //             ////////// AJUSTAR ENQUADRAMENTO
          //             if (event.keyCode == 107) {await configsPositions(1, 102)}////ZOOM MAIS
          //             if (event.keyCode == 109) {await configsPositions(2,   98)}////ZOOM MENOS
          //             if (event.keyCode ==   37) {await configsPositions(3, -10);}////MOVERA PARA ESQUEDA
          //             if (event.keyCode ==   39) {await configsPositions(3, 10);}////MOVERA PARA DIREITA
          //             if (event.keyCode ==   38) {await configsPositions(4, -10);}////MOVERA PARA CIMA
          //             if (event.keyCode ==   40) {await configsPositions(4, 10);}////MOVERA PARA BAIXO
          //             if (event.keyCode == 112) {await configsPositions(5, null);}////PRENCHER HORIZONTALMENTE
          //             if (event.keyCode == 113) {await configsPositions(6, null);}////PRENCHER VERTICALMENTE
          //             //////// PRECESSO CANCELAR
          //             if (event.keyCode == 27) {
          //                 document.querySelector("#dlgCeramica").close('OK'); resetarConfigs();
          //                 D3CeramicaEventos=false;
          //             };
          //         };
          //        ////////////////////:::::::::::::::::

          //         async function finalProcess(){
          //             try {
          //                 if(D3CeramicaEventos === false){return};
          //                  D3CeramicaEventos=false;
          //                   document.querySelector("#dlgCeramica").close('OK'); SalvarDados();
          //                   ajustePreview(100, "show");
          //                   progressDLG("Aquarde Processing . . .");
          //                   function evento() { setTimeout(() =>{
          //                       ////////  VERIFICA SE O PRECESSO FINAL
          //                       const D3ck5= document.querySelector("#D3-ck5");
          //                         if(D3ck5.checked==true){  StampConfigP3() }else{ StampConfigP2()}
          //                       ////////:::::::::::::::::::::::::::::::::::::::::::::
          //                       }
          //                   )} setTimeout(evento, 1000);//////depois alterar para 1000
          //               } catch (err) {alert(err)};
          //          };
          ////////::::::::::::::::::::::::::::

          /////// CHECKBOC PREVIEW
          const D3Ck4 = document.querySelector("#D3-ck4");
          D3Ck4.addEventListener("click", (event) => {
            if (D3Ck4.checked == true) {
              ajustePreview(100, "show");
            } else {
              ajustePreview(0, "hide");
            }
          });
          ////////::::::::::::::::::::
        } catch (err) {  alert(err)   }
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////// TODAS AS FUNÇÕES AQUI! ::::::::::::
    
    //  /////// SALVAR  DINAMICAMENTE OS DADOS
    //  function SalvarDados(){
    //         const dadosD3 = {
    //             dados1: document.querySelector("#D3-r1"  ).checked,
    //             dados2: document.querySelector("#D3-r2"  ).checked,
    //             dados3: document.querySelector("#D3-ck1").checked,
    //             dados4: document.querySelector("#D3-ck2").checked,
    //             dados5: document.querySelector("#D3-ck3").checked,
    //             dados6: document.querySelector("#D3-ck5").checked,
    //         };
    //         localStorage.setItem('d3DadosSave', JSON.stringify(dadosD3));
    // };
    
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
    async function dlgCeramica() {
        D3CeramicaEventos =true;
        fetch('html/D3Ceramica.html').then(response => response.text()).then(data => {
            D3dlg = document.querySelector("#dlgCeramica");
            D3dlg.show({ title: `PS-fxrios: Cerâmica Personalizada!`, resize: "both", size: { width:367, height:270}})
            D3dlg.innerHTML = data;
            D3dlg.addEventListener('load', evt => { setTimeout(() =>{ document.getElementById('D3-ck5').focus();}, 150) });
            execonfigsD3();
        });
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


    async function initSvgIcons(csvg) {
        const icons = document.querySelectorAll(csvg);
    
        // Função para carregar e renderizar o ícone
        async function loadIcon(element, index) {
            // Adiciona um id dinâmico se não existir
            const id = element.id || `svg-icon-${index}`;
            element.id = id;
    
            const size = element.dataset.size || "20px";
            const icone = element.dataset.icon;
            const fill = element.dataset.fill || "#b8b8b8";
    
            try {
                const response = await fetch(`/icons/svg/${icone}.svg`);
                if (!response.ok) {
                    throw new Error(`Failed to load icon: ${icone}`);
                }
                const svgCode = await response.text();
    
                element.innerHTML = `
                    <style>
                        .${id} {
                            width: ${size};
                            height: ${size};
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .${id} svg,
                        .${id} svg path,
                        .${id} svg rect,
                        .${id} svg circle,
                        .${id} svg polygon {
                            width: 100% !important;
                            height: 100% !important;
                            fill: ${fill} !important;
                        }
                    </style>
                    <div class="${id}">${svgCode}</div>
                `;
            } catch (error) { console.error(error);}
        }
    
        // Carrega todos os ícones inicialmente
        icons.forEach(async (element, index) => {  await loadIcon(element, index); });
    
        // Retorna uma função para atualizar dinamicamente os ícones
        return async function updateIcon(selector, newFill) {
            const targetElement = document.querySelector(selector);
            if (targetElement) {
                targetElement.dataset.fill = newFill; // Atualiza o dataset.fill
                const index = Array.from(icons).indexOf(targetElement); // Obtém o índice do elemento
                await loadIcon(targetElement, index); // Recarrega o ícone com o novo fill
            } else {
                console.error("Element not found:", selector);
            }
        };
    };
    ////////////::::::::::::::::::

    
    async function corregarDados() {
        try {
            dadosUI_Obj = [];
            dadosUI_Obj = JSON.parse(localStorage.getItem("dadosUISave")) || [ 
                 {
                     dadosA: 0,         ///// LISTA DE MODELOS
                     dadosB: false,    ///// BACKUP DOCS
                     dadosC: false,    ///// AUTO PRINT
                     dadosD: false,   ///// MAQUETE EXECUTE
                    }
             ];	
        } catch (err) {alert(err) }
    }

   async function exportarDados(){
        try {
            dadosUI_Obj = [];
            const dadosOBJ =  {
                dadosA: s1('#D3list_MD').selectedIndex,   ///// LISTA DE MODELOS
                dadosB:  s1("#D3-ck2").checked,               ///// BACKUP DOCS
                dadosC:  s1("#D3-ck3").checked,               ///// AUTO PRINT
                dadosD:  s1("#D3-ck5").checked,               ///// MAQUETE EXECUTE
             };
            dadosUI_Obj.push(dadosOBJ);  
            localStorage.setItem("dadosUISave", JSON.stringify(dadosUI_Obj ));
        } catch (err) {alert(err)}
   };
    ///////////:::::::::::::::::::::::::::::::::::::



} catch (err) { alert(err)};


