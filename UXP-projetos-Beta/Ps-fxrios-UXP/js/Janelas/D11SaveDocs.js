try {
   //////////ABRIR A JENELA VIA BOTÃO
    document.querySelector("#ms_func6").addEventListener("click", async () => {  
        dialogsEventsFalse();
        dlgSaveDocs();
    })

// //////////////// ATALHOS CONFIGS  XXXXXXXXXXXXX
// document.addEventListener('keydown', pluginsAtalhos);
// async function pluginsAtalhos(event) {
//     if (event.keyCode == 113) {dlgSaveDocs();}
// }


    /////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// TODAS AS FUNÇÕES AQUI! ::::::::::::

    ////////TODOS OS EVEVTO NESSE BLOCO
    function eventosJanelaD11(){
        try {
            colunacResetClasss(".D11colunaB", '.D11altura' ); //////// RESETAR BOTÃO SELECIONADO
            naoDuplicarScript = false;
            itensDocsKey=[];
            filtrarDocs=true;
            funcaoPrincipal();
            carregarActiosLists();
            ///////// IMGEM TEMA DA JANELA EM FORMAR CODIFICADO
            document.querySelector("#D11imgBase64").src="icons/Save_icon.svg"
            ////////:::::::::::::::::::::::::::::::::::::::::::::::
            document.querySelector(".janelaBase").addEventListener("click",  function(){ focarJanela() });
                 
            ////////////CONFIGS SISTEMA DE ABAS
            document.querySelector("#D11-btn1").classList.add('D11selecionado');
            const D11Btns = document.getElementsByClassName("D11-btAbas");
            const D11Abas = document.getElementsByClassName("D11-Abas");
            const D11Btn = Array.from(D11Btns);
            
            for (let i = 0; i < D11Btn.length; i++) {
                D11Btn[i].addEventListener('click', (event) => {
                    for (let j = 0; j < D11Abas.length; j++){
                        D11Abas[j].style.display = 'none';
                        D11Btn[j].classList.remove('D11selecionado');
                    }
                    D11Abas[i].style.display = 'block';
                    event.currentTarget.classList.add('D11selecionado');
                    statusListaDocs(); focarJanela();
                });
            };
            ////// FUNÇÃO PARA SELECIONAR UMA ABA POR INDICE
            function aba1Selecionada(indice) {
                for (let j = 0; j < D11Abas.length; j++) {
                    D11Abas[j].style.display = 'none';
                    D11Btn[j].classList.remove('D11selecionado');
                }
                D11Abas[indice].style.display = 'block';
                D11Btn[indice].classList.add('D11selecionado');
            }
            ////////::::::::::::::::::::
            ////////////CONFIGS SISTEMA DE ABAS2
            document.querySelector("#D11-btn3").classList.add('D11selecionado');
            const D11Btns2 = document.getElementsByClassName("D11-btAbas2");
            const D11Abas2 = document.getElementsByClassName("D11-Abas2");
            const D11Btn2 = Array.from(D11Btns2);
            
            for (let i = 0; i < D11Btn2.length; i++) {
                D11Btn2[i].addEventListener('click', (event) => {
                    // Esconder todas as abas
                    for (let j = 0; j < D11Abas2.length; j++){
                           D11Abas2[j].style.display = 'none';
                           D11Btn2[j].classList.remove('D11selecionado');
                        }
                        D11Abas2[i].style.display = 'flex';
                    event.currentTarget.classList.add('D11selecionado');
                    focarJanela();
                });
            };
            ////////::::::::::::::::::::
            /////// CARREGA  OS DADOS DO LOCALSTORAGE
           
            obterDadosIniciais();
            configsPreferencesD11()
            ////////:::::::::::::::::::::::::::::::::::::::::::::::
             /////// AQUI A ISERSÃO DO VAORES INICIAIS
            document.querySelector("#D11CKBorda").checked= dados02
            document.querySelector("#listModo").selectedIndex = dados03
            document.querySelector("#listForm").selectedIndex = dados04
            document.querySelector("#D11BdSize").value = dados05
            document.querySelector("#listSaidaSave").selectedIndex = dados07
            document.querySelector("#listSaidaNome").selectedIndex = dados08
            document.querySelector("#D11CKSbPasta").checked= dados09
            //document.querySelector("#D11CKPastaFinal").checked= dados11
            document.querySelector("#GrupoListaMT").textContent= dados12;
            corHexObtida = dados06;
            indexBodaSel = dados10;
            indexListaMaterial = dados01;
            txtBtnListaMaterial = dados12;
             ////////;::::::::::::::::::::::
            
            /////// OUVINTES DE EVENTOS PRINCIPAL
            snome=document.querySelector("#listSaidaNome")
            bBorda = document.querySelector('#D11btnBcolor')
            ckeckEntrada = document.querySelector("#D11CKetd")
            D11CKBorda =document.querySelector("#D11CKBorda")
            saidaSave= document.querySelector("#listSaidaSave")
            D11CKform=document.querySelector("#D11CKform")
            listFormato = document.querySelector("#listFormato");
            saidalistFormato = document.querySelector("#listForm");
            modoRetrato = document.querySelector("#D11CkMRetrato");
            listModo = document.querySelector("#listModo");
            acabamento = document.querySelector("#listAcabamento");
            acabamento.selectedIndex=0; 
            //////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

            ////// OBTER TODOS OS ITENS DA LISTA ACABAMENTO
            var itensAcabamento = [];
            for (var i = 0; i < acabamento.options.length; i++) {
            itensAcabamento.push(acabamento.options[i].textContent);
            };
            /////////////////////:::::::::::

            ///////// IMPROVISO DA LISTA DE MATERIAL
            document.querySelector("#GrupoListaMT").addEventListener("click", function() {
                exibListaMaterial(true)
            })

            /////// MANTE A JANELA FOCADA
            saidalistFormato.addEventListener("change", ()=> {focarJanela()})
            listModo.addEventListener("change", ()=> {focarJanela()})
            saidaSave.addEventListener("change", ()=> {focarJanela()})
            acabamento.addEventListener("change", ()=> {dadosStatusUI()})
            ///////::::::::::::::::::::::::::::::::::

            mtListaItens = document.getElementsByClassName("btnsMat");
            mtListaBtn = Array.from(mtListaItens);
    
            for (let i = 0; i < mtListaBtn.length; i++) {
                mtListaBtn[i].addEventListener('click', (event) => {
                        for (let j = 0; j < mtListaBtn.length; j++) {
                        indexListaMaterial = mtListaBtn.indexOf(event.currentTarget); 
                        txtBtnListaMaterial = event.currentTarget.getAttribute('value')
                        mtListaBtn[j].classList.remove('clicado');
                    }
                    event.currentTarget.classList.add('clicado');
                    if(indexListaMaterial == 0 || indexListaMaterial == 3 
                    || indexListaMaterial == 4 || indexListaMaterial == 5)
                    {
                        exibListaMaterial(false);
                        document.querySelector("#listMaterialLona").style.display= "none"; 
                    }
                    else{  document.querySelector("#listMaterialLona").style.display= "flex"; }
                    if(indexListaMaterial !==1 ){
                         document.querySelector("#GrupoListaMT").textContent= txtBtnListaMaterial ;
                     }
                    //////STATUS DAS CONFIGS DA BORDA
                    subMenuLonaConfig();
                    configsSaidaServicos();
                   });
                   
                    mtListaBtn[i].addEventListener('mouseover', () => {
                        for (let j = 0; j < mtListaBtn.length; j++) {
                        mtListaBtn[j].classList.remove('clicado');
                        }
                    });
            };
             
            ////////////////////////////////////////////////
            //////////////// ATALHOS CONFIGS XXXXXXXXXXXXXXXXXXX
            let processado = false;
            let listaSeleciona = false;
            try {
                contAcabamento=0
                let BordaSizec = document.querySelector("#D11BdSize");
                let bordaInicial = BordaSizec.value;
                document.addEventListener('keydown', saveDocsKey);
                /////:::::::::::::::::
             } catch (error) {}

            //////////REMOVE TODOS O EVENTOS AO FECHA A JANELA
            function removeEventos(){
                document.removeEventListener('keydown', tecladoEventos);
            }; ////////:::::::::::::


            ////////////// REMOVER EVENTOS DE ATALHO AO FECHAR JANELA
            D11dlg.addEventListener("close", () => {
                     removeEventos();
            });
             
             /////////////////////////////////////////////////////////////
           //////////////// ATALHOS CONFIGS  XXXXXXXXXXXXX
            document.addEventListener('keydown', tecladoEventos);
            async function tecladoEventos(event) {
                //////// CANCELAR
                if (event.keyCode == 27) {document.querySelector("#dlgSaveDoc").close(removeEventos()); }
                  //////// PROCESSAMENTO FINAL
                 if (event.keyCode === 13) {  finalProcesso(); }
               //////////////xxxxxxxxxxxxxxxxxxx

               else if (event.keyCode === 112) {
                    document.querySelector("#GrupoListaMT").textContent= "Papel" ;
                    D11CKBorda.checked=false
                    funcCheckBorda(); funcDisabledBorda(false);
                    indexListaMaterial =0;
                    txtBtnListaMaterial= "Papel"
                    configsSaidaServicos();
                    acabamento.selectedIndex=0;
                }
                else if (event.keyCode === 113) {
                    document.querySelector("#GrupoListaMT").textContent= "Banner" ;
                    D11CKBorda.checked=false
                    funcCheckBorda(); funcDisabledBorda(true)
                    indexListaMaterial = 6;
                    txtBtnListaMaterial= "Banner"
                    configsSaidaServicos();
                    acabamento.selectedIndex=4
                }
                else if (event.keyCode === 114) {
                    document.querySelector("#GrupoListaMT").textContent= "Chassis" ;
                    D11CKBorda.checked=false
                    funcCheckBorda(); funcDisabledBorda(true)
                    indexListaMaterial = 7;
                    txtBtnListaMaterial= "Chassis"
                    configsSaidaServicos();
                    acabamento.selectedIndex=0;
                }
                else if (event.keyCode === 115) {
                    document.querySelector("#GrupoListaMT").textContent= "Etiquetas" ;
                    D11CKBorda.checked=false
                    funcCheckBorda(); funcDisabledBorda(true)
                    indexListaMaterial = 2;
                    txtBtnListaMaterial= "Etiquetas"
                    configsSaidaServicos();
                    acabamento.selectedIndex=0;
                }
                else if(event.keyCode === 119) {
                    document.querySelector("#GrupoListaMT").textContent= "Adesivo" ;
                    D11CKBorda.checked=false
                    funcCheckBorda(); funcDisabledBorda(false)
                    indexListaMaterial = 3;
                    txtBtnListaMaterial= "Adesivo"
                    configsSaidaServicos();
                    acabamento.selectedIndex=0;
                }
                else if (event.keyCode === 117) {
                    document.querySelector("#GrupoListaMT").textContent= "Canvas" ;
                    D11CKBorda.checked=true;
                    funcCheckBorda(); funcDisabledBorda(false)
                    indexListaMaterial = 4;
                    txtBtnListaMaterial= "Canvas";
                    configsSaidaServicos();
                    acabamento.selectedIndex=0;
                }
                else if (event.keyCode === 118) {
                    document.querySelector("#GrupoListaMT").textContent= "Nenhum" ;
                    D11CKBorda.checked=false
                    funcCheckBorda(); funcDisabledBorda(false);
                    indexListaMaterial = 5;
                    txtBtnListaMaterial= "";
                    configsSaidaServicos()
                    acabamento.selectedIndex=0;
                }
                ////////LISTA SAIDA NOMES
                else if (event.keyCode === 84){ SelItensLista(); }
                else if (event.keyCode === 77) {toggleMDretratoFunc()}
                else if (event.keyCode === 66) {SelBordas()}
                //////// ALTERNAR NOMES DE SAÍDA ARQUIVOS
                else if (event.keyCode === 33) {  
                    if(snome.selectedIndex >5){snome.selectedIndex=0 }
                    else{snome.selectedIndex =Number(snome.selectedIndex)+1;}
                }  
                else if (event.keyCode === 78) {  
                    if(snome.selectedIndex !=0){document.querySelector("#D11SaidaNome").disabled=false;}
                    function temporizador() { document.querySelector("#D11SaidaNome").focus(), 16 }
                    setTimeout(temporizador, 10);
                }  
              ////////SELECIONAR TIPO DE ACABAMENTO
              else if (event.keyCode === 65) {
                acabamento.selectedIndex =Number( acabamento.selectedIndex)+1
                focarJanela(); dadosStatusUI()
              }
              //////// ALTERAR O VALOR DA BODA
              else  if(D11CKBorda.checked==true){
                    BordaSizec = document.querySelector("#D11BdSize");
                    if (event.keyCode === 39) {  BordaSizec.value =Number( BordaSizec.value)+1 } /// BORDA +
                    else if (event.keyCode === 37) {  
                        if(BordaSizec.value===1){BordaSizec.value =1}else{BordaSizec.value =Number( BordaSizec.value)-1 }
                    } /// BORDA -
                    ///////TEXTURA DA BORDA
                   else if (event.keyCode === 34) { 
                       if(indexBodaSel ===2 ){indexBodaSel= 0}else{ indexBodaSel=  indexBodaSel+1; }
                        selectBordasType()
                    }
               };
              /////////::::::::::::::::::::::::::::::::::::
           };
           
            dadosStatusUI();
            toggleMDretrato = false;
            function toggleMDretratoFunc() {
                if (toggleMDretrato) { modoRetrato.checked=false; toggleMDretrato = false; } 
                else { modoRetrato.checked=true;  toggleMDretrato = true;
                }; focarJanela(); 
            };
             
            //////////////::::::::::::::::::  
            toggleBordasADD= false;
            function SelBordas() {
                if ( toggleBordasADD) {
                    if(indexListaMaterial==2||indexListaMaterial==6|indexListaMaterial==7){return}///ANUNLA OPÇAO BODAS PARA LONAS E ETIQUETAS
                    D11CKBorda.checked=true; funcCheckBorda(); funcDisabledBorda(false)
                    focarJanela();  toggleBordasADD = false;
                } else {
                    D11CKBorda.checked=false; funcCheckBorda(); funcDisabledBorda(true)
                    focarJanela();  toggleBordasADD = true;
                };
            };
            ///////////////////////////////////////
            toggleSelItensListaDocs= false;
            function SelItensLista() {
                let elementos = document.querySelectorAll('.docsNomes');
                if ( toggleSelItensListaDocs) {
                    filtrarDocs=true;
                    elementos.forEach(function(elemento) { elemento.style.color = "#ffffff"});
                    focarJanela(); toggleSelItensListaDocs = false; 
                } else {
                    filtrarDocs=false
                    elementos.forEach(function(elemento) { elemento.style.color = "#9dfbed"}); 
                    focarJanela(); toggleSelItensListaDocs = true;
                };
            };
           ////////////////////////////////////////////////////////////////////
           //////////////// ATALHOS CONFIGS FINAL XXXXXXXXXXXXX



            subMenuLonaConfig()
            function subMenuLonaConfig(){
                if( indexListaMaterial ==1){
                    D11CKBorda.checked=false;
                    funcCheckBorda(); funcDisabledBorda(true);
                }
                else if( indexListaMaterial ==2 || indexListaMaterial ==5 || indexListaMaterial ==6 || indexListaMaterial ==7 ){
                    exibListaMaterial(false); 
                    document.querySelector("#listMaterialLona").style.display= "none"; 
                    D11CKBorda.checked=false
                    funcCheckBorda(); funcDisabledBorda(true)
                }
                else{ funcDisabledBorda(false)}
            }
    
            function exibListaMaterial(m){
                if(m==true){dsp="flex"; opacidade=0}else {dsp="none"; opacidade=1}
                document.querySelector("#listMaterial").style.display= dsp;
                saidaSave.style.opacity =opacidade; 
            }
            try {
            /////// SELECIONA O ULTIMO ITEM PROCESSSADO DA LISTA DE MATERIAL
            for (const selMatItem of mtListaItens) { selMatItem.classList.remove("clicado") }
            const selMatItem = mtListaItens[indexListaMaterial]; selMatItem.classList.add("clicado") ;   
            } catch (error) {alert(error)}

            ///// PREDEFINIÇÕES DE SAÍDA COM BASE NA LISTA DE MATERIAIS
            function configsSaidaServicos(){
                if(indexListaMaterial !== 5){
                    snome.selectedIndex=3;
                    listModo.selectedIndex=1;
                    saidaSave.selectedIndex=1;
                    saidalistFormato.selectedIndex=3;
                    exibirPastaFinal.checked=true;
                }else{
                    snome.selectedIndex=0;
                    listModo.selectedIndex=0;
                    saidaSave.selectedIndex=1;
                    saidalistFormato.selectedIndex=0;
                    exibirPastaFinal.checked=false;
                }
                dadosStatusUI()
            };

            ///////// IMPROVISO DA LISTA DE MATERIAL
            //////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            toggleDisabledAtivado = false;
            toggleDisabled("formatos");
            D11CKform.addEventListener("click", function() {
                if(D11CKform.checked===true){
                      ImagensDir = []; todasAsImagens=[];
                      toggleDisabled("formatos");  importarImagens(); 
                    }
                else{toggleDisabled("formatos")}
            })
            ///////xxxxxxxxxxxxxxxx
    
            ////////// CONFIGUÇÃOE DE BORDA
            //////////////////////////////////////////
            bordasBtn = Array.from(document.getElementsByClassName("btnMarg"));
            for(let i = 0; i < bordasBtn.length; i++){ 
                bordasBtn[i].addEventListener('click', (event) => {
                    for(let i = 0; i < bordasBtn.length; i++){ 
                        indexBodaSel = bordasBtn.indexOf(event.currentTarget); 
                        bordasBtn[i].classList.remove("btnMargSel") 
                    }
                    seletorBtn=true;
                    bordasBtn[i].classList.add("btnMargSel"); selectBordasType();
                    /////////////////////
                })
                document.querySelector('#idB1').setAttribute("title", "Seletor de Cor • Tecla:4")
                document.querySelector('#idB2').setAttribute("title", "Textura  de Madeira • Tecla:5")
                document.querySelector('#idB3').setAttribute("title", "Textura da Imagem Atual • Tecla:6")
            };
    
            /////// ATUALIZA O BG DO BTN DA BORDA COM BASE NO VALOR DE [indexBodaSel]
            for (const itBoda of bordasBtn) { itBoda.classList.remove("btnMargSel") }
            const itBoda = bordasBtn[indexBodaSel]; itBoda.classList.add("btnMargSel") ;
        
            function selectBordasType(){
                switch(indexBodaSel){
                    case 0:  colorBarderADD(); b1(); break;
                    case 1: exibMargemSel(false);  b2();  break;  
                    case 2: exibMargemSel(false) ;  b3();  break;
                };
                focarJanela();
            };
    
            function b1(){
                bBorda.textContent="";  bBorda.style.backgroundImage=""
                bBorda.style.backgroundColor = `#${corHexObtida}`;
                seletorBtn=false
            };
             function b2(){
                bBorda.style.backgroundImage = "url('../icons/bgBordM.png')"
                bBorda.textContent="";
            };
            function b3(){
                bBorda.style.backgroundColor = "#3b3b3b";
                bBorda.textContent="z"; bBorda.style.backgroundImage="";
            };
            document.querySelector('#D11btnBcolor').addEventListener("click", function() {
                exibMargemSel(true)
            });
    
            ////////SELETOR DE COR PARA BORDAS
            document.querySelector('#D11btn-Mrg').addEventListener("click", function() {
                exibMargemSel(false)
            });
             ////////CHECKBOX ADD BORDAS
             funcCheckBorda();
             D11CKBorda.addEventListener("click", function() { funcCheckBorda()})
      
             function funcCheckBorda(){
              seletorBtn=false; 
              bord=document.querySelectorAll('.bord');
               if(D11CKBorda.checked===true){ 
                     if(indexBodaSel===1){ b2()} else if(indexBodaSel===2){ b3()}  else{ b1()}
                     bord.forEach(function(e) { e.disabled = false; e.classList.remove("D11elDesabilitado") }); 
                     selectBordasType();
                 }
                 else{ 
                     b1();
                     bBorda.style.backgroundColor ="#5c5b5b";
                     bord.forEach(function(e) {e.disabled = true; e.classList.add("D11elDesabilitado") });
                 };
             };
            
             ////////HABILITAR CHECHBOX BORDA
             function funcDisabledBorda(B){  
                if( B ==true){
                     document.querySelector(".elBorda").classList.add("D11elDesabilitado") 
                     D11CKBorda.disabled = true; 
                }
                else{
                    document.querySelector(".elBorda").classList.remove("D11elDesabilitado")
                    D11CKBorda.disabled = false
                };
             };
             ////////HABILITAR CHECHBOX BORDA FINAL
            ////////AUMENTAR  VALOR DA BORDA INPUT 
            document.querySelector("#setaSima").addEventListener("click", function() {
                BordaSizec = document.querySelector("#D11BdSize")
                BordaSizec.value =Number( BordaSizec.value)+1
            })
            ////////AUMENTAR  VALOR DA BORDA INPUT 
            document.querySelector("#setaBaixo").addEventListener("click", function() {
                BordaSizeb = document.querySelector("#D11BdSize");
                if(BordaSizeb.value !==0){ BordaSizeb.value =Number( BordaSizeb.value)-1 }
             })
            ////////// CONFIGUÇÃOE DE BORDA FINAL
            ///////xxxxxxxxxxxxxxxx
    
            ////////CHECKBOX USAR AÇÕES
            toggleActios()
            document.querySelector("#D11CKActions").addEventListener("click", function() {toggleActios() })
            function toggleActios(){
            document.querySelectorAll('.usarActions').forEach(function(e) {
                if (e.disabled) {e.disabled = false; }else {e.disabled = true; }  
                });
            }
            ///////xxxxxxxxxxxxxxxx
            ////////CHECKBOX ENTRADA
            toggleEntrada()
            ckeckEntrada.addEventListener("click", function() { toggleEntrada() })
            function toggleEntrada(){
            document.querySelectorAll('.etd').forEach(function(e) {
                if (e.disabled) {e.disabled = false; e.classList.remove("D11elDesabilitado")}
                else {e.disabled = true; e.classList.add("D11elDesabilitado");  }  
                });
            }
     
    
            //////// SELECIONAR O METODO DE LISTAR AS IMAGENS PARA PROCESAMENTO EM LOTE;
            if(totalDocs==0){ aba1Selecionada(0); ckeckEntrada.checked=true;}
            else{ aba1Selecionada(1) ; ckeckEntrada.checked=false; toggleEntrada() }
            toggleEntrada();
            //////////////::::::::::::::::::::::::::::::::::::::::::::::::
    
             ////////LISTAR LOCAL DE DESTINO
             saidaDisabled()
             saidaSave.addEventListener("change", function() { saidaDisabled()})
    
             function saidaDisabled(){
                 saida= saidaSave.selectedIndex;
                document.querySelectorAll('.sad').forEach(function(e) {
                   if(saida===0 ||saida===1){ e.classList.add("D11elDesabilitado")}
                   else{e.classList.remove("D11elDesabilitado")} 
                 });
             }
            ///////xxxxxxxxxxxxxxxx
            
             /////ATUALIZA A QUANTIDADE DE IMAGENS NO INTERFACE
            listFormato.addEventListener("change", async function() { 
                ImagensDir = []; todasAsImagens=[]; focarJanela();
                await importarImagens() 
            })
            const ckSubfolder = document.querySelector("#D11CKSbPasta")
            ckSubfolder.addEventListener("click", async function(event) {
                ImagensDir = []; todasAsImagens=[]
                await importarImagens(); 
            })
            //////XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    
            //////// LISTAR PAREA SELECIONAR O NOME DA SIADE DO ARQUIVO
            snomeDisabled()
            snome.addEventListener("change", function() { snomeDisabled() })
            
            function snomeDisabled(){
                etNome= snome.selectedIndex;
                document.querySelectorAll('.san').forEach(function(e) {
                if(etNome===0 ||etNome===3){ e.disabled = true} else{e.disabled =false}; e.value=""; 
                function temporizador() { document.querySelector("#D11SaidaNome").focus(), 16 }
                setTimeout(temporizador, 100);
                });
            }
             ///////xxxxxxxxxxxxxxxx
    
            //////// SELECIONAR DIRETÓRIO DE ENTRADA
            buscarDir = document.querySelector("#D11Entrada")
            buscarDir.addEventListener("click",async function() {
                ImagensDir = []; todasAsImagens=[]
                directory = await fs.getFolder();
                await importarImagens();
                focarJanela();
            })
            //////////////::::::::::::::::::::::
    
            //////// SELECIONAR DIRETÓRIO DE DESTINO
            DestinoDir = document.querySelector("#D11Destino")
            DestinoDir.addEventListener("click",async function() {
                directorySsida = await fs.getFolder();
                saidaPath = directorySsida.nativePath.replace(/\\/g, "/");
                caminhoPasta(saidaPath, "#D11txtSaida")
            })
            //////////////::::::::::::::::::::
            ///////////////////////////////////////////////////////
            //////// PROCESSAR FINAL :::::::::::::::::::::::::
            ////////CANECALR
            document.querySelector("#D11Btn2").addEventListener("click", function() {
                document.querySelector("#dlgSaveDoc").close(removeEventos());
            })
            //////// PREFERENCIAS
            document.querySelector("#D11Btn3").addEventListener("click", function() {
                dlgPrefsxD11();
                //////// Garante que O ouvinte de eventos é adicionado apenas uma vez
                document.addEventListener("keydown", handleEnterKey);
            });
            //////// PROCESSAR
            document.querySelector("#D11Btn1").addEventListener("click",async function() {
                 await finalProcesso();
            })
            //////////::::::::::::::
           async  function finalProcesso(){
                try {
                    
                if(processado===true){return}
                ////////// PROCESSAMENTO RESTRITO SOMENTE NA JANELA ATUAL::: INICIO
               if(document.querySelector("#D11confDLGfocus").checked == true){
                       /////////// VERIFICA SE O DIRETRIO EXISTE SE A OPÇÃO REFERENTE ESTIVER MARCDA
                       try {
                           if(ckeckEntrada.checked===true){
                               D11txtEntrada =document.querySelector("#D11txtEntrada")
                               if (D11txtEntrada.textContent==="C://Selecione um Diretório.....") {
                                   alertar("Selecione o diretório de entrada dos arquivos!"); return;
                                   }
                           }
                           /////////// VERIFICA SE O DIRETRIO DE DESTINO FOI ADICIONADO
                           if(saidaSave.selectedIndex===2){
                               D11txtSaida =document.querySelector("#D11txtSaida")
                               if (D11txtSaida.textContent==="C://Selecione um Diretório.....") {
                                   alertar("Selecione o diretório de saida dos arquivos!"); return;
                                   }
                           };
                           //////////::::::::::::::::::::::
                           /////// SE EXISTIR MAIS DE 1 DOC NA LISTA, PERGUTAR SE DESEJA POCESSAR TODOS
                           if(ckeckEntrada.checked===false){
                               if(filtrarDocs==true){
                                   if( totalDocs >1){
                                       txtMsg  = `Você possue "${totalDocs} imagens" na lista de documentos, deseja processar todos?`
                                       document.querySelector("#dlgSaveDoc").close(removeEventos());
                                       confiramar(txtMsg);
                                       document.querySelector("#confirm_btn1").addEventListener("click", async () => {
                                           dlg.close('OK'); dlgSaveDocs();
                                           });
                                       document.querySelector("#confirm_btn2").addEventListener("click", async () => {
                                       dlg.close('OK'); processamentoFinalOK();
                                       });
                                       //////////CONFIRMA COM ATALHOS DO TRCLAHDO
                                       document.addEventListener('keydown', D11ConfirmaKey);
                                       async function D11ConfirmaKey(event) {
                                       if (event.keyCode === 83 && !naoDuplicarScript){ 
                                           dlg.close('OK'); processamentoFinalOK(); naoDuplicarScript = true;
                                       };
                                       if (event.keyCode === 78){dlg.close('OK'); dlgSaveDocs();}
                                   };///////////////////
                               }
                                   else  if( totalDocs ==0){alertar("Nenhum documento ou aquivo encontrado!")}
                                   else  if( totalDocs ==1){processamentoFinalOK();}
                               }
                               else{processamentoFinalOK();}
                           }
                           else{ processamentoFinalOK();}
                           
                           //////// FUNÇÃO DE PROCESSAMENTO FINAAL
                           function processamentoFinalOK(){
                               try {
                                   document.querySelector("#dlgSaveDoc").close(removeEventos());
                                   janProgresso = document.querySelector("#D11CKProgView")
                                   if(janProgresso.checked===true){
                                       progressDLG(""); 
                                       txtMsgDLG= document.querySelector("#txtMsgDLG");
                                       txtMsgDLG.innerHTML= `Iniciando Configs....`
                                       document.querySelector("#NomeDoc").textContent="ANALISANDO IMAGENS!";
                                   };
                                   function evento() { setTimeout(async() =>{ await percorreDocumuntos(); await SalvarDados(); })} 
                                   setTimeout(evento, 1000);
                               } catch (error) {alert(error) }
                           }
                       } catch (error) {alert(error)}
                   }
                   dadosStatusUI();
                    
                } catch (error) {alert(error)}
            }; //////////////////////////////////////////////////////////////////////////////////
            ////////// PROCESSAMENTO RESTRITO SOMENTE NA JANELA ATUAL FINAL
            ///////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        } catch (err) {}

    } ////////TODOS OS EVEVTO NESSE BLOCO
    //////////XXXXXXXXXXXXXXXXXXXXXXXXXXX
} catch (error) {alert(error)}

//////////////////////////////////////////////////////////////////
/////////// CONFIGUREÇÕES DA LISTA DE DOCUMENTOS
function  obterDocumentos(){
    try {
        acessarDoc=[];
        ImgConteudo = app.documents;
        for(i = 0; i < ImgConteudo.length; i++){ 
            acessarDoc.push(ImgConteudo[i].name);
        }
        totalDocs =acessarDoc.length;
        TxtDocItens = document.getElementById("D11TxtDocItens")
        TxtDocItens.textContent = `Lista de Documentos: ${totalDocs} itens`;
    } catch (err) {alert(err)}
}

/////////FUNÇÃO PRICIPAL
function funcaoPrincipal(){
try {
    core.executeAsModal( async() => {
        obterDocumentos();
        criarListaDocumentos()

        /////////// CONFIGUREÇÕES DA LISTA DE DOCUMENTOS
        ///////////////XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        function criarListaDocumentos(){
            const listaNomes = document.getElementById("listaNomes");
            listaNomes.innerHTML = ""; // Limpa a lista antes de criar os itens novamente
            acessarDoc.forEach((item, index) => {
                let displayedItem = item;
                ///////////// SE O ÍTEM POSSUI MAIS DE 30 CARACTERES O MESMO É ABREVIADO
                if (item.length > 30) {
                    try {
                    if (item.includes("_")){ parts = item.split('_') }
                    else if (item.includes(" ")){ parts = item.split(' ')}
                    else if (item.includes("-")){ parts = item.split('-')}
                    let extension = parts[parts.length - 1];
                    let fileNameWithoutExtension = extension.substring(0, extension.lastIndexOf('.'));
                    let fileExtension = extension.substring(extension.lastIndexOf('.'));
                    displayedItem = parts[0] + ' ...' + fileNameWithoutExtension + fileExtension;
                    } catch (error) {alert(error)}
                };
                ///////////// Criar o item na lista com o texto exibido e o nome original como atributo data
                listaNomes.insertAdjacentHTML("beforeend", `
                    <div id="item${index}" class="task Itens" style="width: 100%; height: 24px; display: flex; align-items: center; justify-content: space-between; transform: translate(-5px, -10px);">
                    <label class="docsNomes" style="width: 100%; font-size: 11px; color: #f7f7f7; margin: 2px;  padding: 5px; "data-original="${item}">${displayedItem}</label>
                    <div style="display: flex;">
                    <div class="preview btnIconsD" data-nome="${item}" style="font-size: 11px;">i</div>
                    <div class="delete btnIconsD" data-id="${index}" >M</div>
                    </div>
                    </div>
                `);
               itensDocsKey.push(item);
            });

            ////////// ACESSAR ITENS DA LISTA DE DOCS COM CLICKS DO MOUSE
            var elementos = document.querySelectorAll('.docsNomes');
            elementos.forEach(function(elemento, indicex) {
                elemento.addEventListener('click', function() {
                    selectedIndex = indicex;
                    var dataOriginalValue = this.getAttribute('data-original');
                    elementos.forEach(function(el) { el.classList.remove('selectItemOK'); });
                    this.classList.add('selectItemOK');
                    acessarDocumento(dataOriginalValue)
                });
            });
            ////////////////:::::::::::::::::::::::::

           
            ////////// ACESSAR ITENS DA LISTA DE DOCS COM  ATALHOS
            let selectedIndex = indexDA-1;
           
            contEventosLista = 0;
            function acessoListadosKey(event) {
                try {
                        contEventosLista++;
                       switch(event.keyCode) {
                        case 38: // Seto para cima
                            contEventosLista = 0
                            selectedIndex = Math.max(0, selectedIndex - 1);
                            if (selectedIndex < 4) {rolagemItensLista(selectedIndex)}
                            
                            break;
                        case 40: // Seto para baixo
                            contEventosLista = 0
                            selectedIndex = Math.min(itensDocsKey.length - 1, selectedIndex + 1);
                            rolagemItensLista(selectedIndex)
                            break;
                        }
                        if(contEventosLista >0){return}/////ACEGURA QIUE O VENTO NÃO SEJA PORCESSADO MAIS DE UMA VEZ
                        nomeAtalho = (itensDocsKey[selectedIndex]);
                        indexAtalho = selectedIndex;
                        selItemAtualConfig(indexAtalho)
                } catch (error) {alert(error)}
            }
            document.addEventListener("keydown", acessoListadosKey);
            /////////::::::::::::::
            selItemAtualConfig(indexDA-1)
            statusListaDocs(); 
            preverDocuneto();
       }
        ///////////////::::::::::::::::::::::::::::

        ////////// DESLOCAMENTO DA BARRA DE ROLAGEM 
        function rolagemItensLista(selectedIndex) {
            var listaNomes = document.getElementById('listaNomes');
            var itensLista = listaNomes.getElementsByClassName("docsNomes"); 
            if (selectedIndex > 4) {
            listaNomes.scrollTop = itensLista[selectedIndex].offsetTop - listaNomes.clientHeight + itensLista[selectedIndex].clientHeight;
            }
            else{
                if (selectedIndex < itensLista.length - Math.ceil(listaNomes.clientHeight / itensLista[0].clientHeight)) {
                    listaNomes.scrollTop = itensLista[selectedIndex].offsetTop - (listaNomes.clientHeight - itensLista[selectedIndex].clientHeight);
                     };
                };
        };
       ///////////////::::::::::::::::::::::::::::

        ////////// PRECHER A LISTA DE DE DOCUMENTOS AO ACESSAR A ABA  REFERENTE
        document.querySelector("#D11-btn2").addEventListener("click", function(event) {
            filtrarDocs=true;
            const listaNomes = document.getElementById("listaNomes");
            listaNomes.innerHTML = "";
            obterDocumentos(); criarListaDocumentos();
            document.getElementById("D11TxtDocItens").innerHTML=`Lista de Documentos: ${acessarDoc.length} itens`
            if(acessarDoc.length !=0){
                ckeckEntrada.checked=false;
                document.querySelectorAll('.etd').forEach(function(e) {
                e.disabled = true; e.classList.add("D11elDesabilitado") 
                });
            }
        })

        /////// REMOVENDO ITENS DA LISTA
        document.getElementById("listaNomes").addEventListener("click", function(event) {
            try {
                if (event.target.classList.contains("delete")) {
                const itemNome = event.target.parentNode.parentNode.querySelector('label').getAttribute('data-original');
                index = acessarDoc.indexOf(itemNome); /////Encontra o índice do item no array pelo clisck do mouse
                if (index !== -1) { // Verifica se o índice foi encontrado
                    const divParaRemover = event.target.closest('.task'); // Encontra o elemento pai da div a ser removida
                    if (divParaRemover) {
                        divParaRemover.remove(); // Remove o elemento da lista
                        acessarDoc.splice(index, 1); // Remove o item do array
                        document.getElementById("D11TxtDocItens").textContent = `Lista de Documentos: ${acessarDoc.length} itens`;
                    }
                    
                    itensClassNomes = document.getElementsByClassName("docsNomes"); 
                    for (let item of itensClassNomes) { item.classList.remove("selectItemOK"); }
                    statusListaDocs(); focarJanela(); filtrarDocs=false;
                    } ;
                };
            } catch (error) {}
        });
        ///////////////::::::::::::::::::::::::::::
     
        
     /////// VISUALISTA O DOCUMENTO CLICADO
      async  function preverDocuneto(){
         pevItens = document.getElementsByClassName("preview");
         prevBtn = Array.from(pevItens);
         for (let i = 0; i < prevBtn.length; i++) {
             prevBtn[i].addEventListener('click', (event) => {
                 for (let j = 0; j < prevBtn.length; j++) {
                     index = prevBtn.indexOf(event.currentTarget); 
                     nome = event.currentTarget.getAttribute('data-nome');
                 }
                 acessarDocumento(nome);
                itensClassNomes = document.getElementsByClassName("docsNomes"); 
                for (let item of itensClassNomes) { item.classList.remove("selectItemOK"); }
                itensClassNomes[index].classList.add("selectItemOK");
                //////EXIBIT TAMANHO DO DOCUMENTO ATUAL
                toggleInforDoc()
                });
            };
        };
        ////////::::::::::::::::::::::::::
        document.getElementById("D11TxtDocItens").textContent = `Lista de Documentos: ${acessarDoc.length} itens`;

        }); /////////////////xxxxxxxxxxxxxxxxxx
    } catch (e) {}
};

////////EXIBIR INFORMAÇÕES DO DOCUMENTO NA LISTA
function toggleInforDoc() {
        document.querySelector("#InforDoc").style.display= "flex";
        tamanhoDocs(); focarJanela();
        function evento() { setTimeout(() =>{
            document.querySelector("#InforDoc").style.display= "none";
        }
        )} setTimeout(evento, 5000);//////depois alterar para 1000
};

//////// OBTEM O DIMENSÕES DO DOCUMENTO
function tamanhoDocs(){
    resolucao= app.activeDocument.resolution;
    wsDoc = Number(app.activeDocument.width*2.54/resolucao).toFixed(1);
    hsDoc = Number(app.activeDocument.height*2.54/resolucao).toFixed(1);
    if(wsDoc > hsDoc){ tamanho=`Tamanho: ${hsDoc} x ${wsDoc} cm`}
    else{ tamanho=`Tamanho: ${wsDoc}  x ${hsDoc} cm`}
    document.getElementById("InforDoc").innerHTML= `${tamanho} ( ${resolucao.toFixed(0)} ppi )`;
}

//// PREVISUALIZA O DOCUMENTO AO PASSAR O MOUSE SOBRE O ITEM
async function acessarDocumento(conteudo){
    core.executeAsModal( async() => {
        await app.batchPlay([{"_obj":"select","_target":[{"_name":conteudo,"_ref":"document"}]}], {});
        tamanhoDocs();
    });
};

////////FUNÇÃO PARA STATOS DO ITENS NA INTERFACE
function statusListaDocs(){
    try {
        listaNomes = document.getElementById("listaNomes")
        totalDocs =acessarDoc.length;
        if(totalDocs==0){ 
            /// EXIBIR A O SVG LISTA VALIZA!
            listaNomes.innerHTML = `
            <div style="display: flex; width: 100%; height: 100%; justify-content: center; align-items: center;">
            <img src="../icons/lista_vazia.svg"  width="80" height="80"> 
            <label  style="color: rgb(179, 179, 179); font-size: 13px; margin: 0 0 0 10px;">Nenhum documento!</label>
            </div>`;
        }
        /// REMOVE A BARRA DE ROLAGEM SE EXISTIR PELO MENOS DE 6 ITENS
        else if(totalDocs>0 && totalDocs<6){listaNomes.style.overflow = "hidden"}
        /// ADICIONA A BARRA DE ROLAGEM SE EXISTIR MAIS DE 5 ITENS
        else{listaNomes.style.overflow = "scroll"}
    } catch (error) {}
}
///////;::::::::::::::: 

///////// DESABILITA/HABILIAR ALEMENTOS
 toggleDisabledAtivado = false;
function toggleDisabled(d) {
    const div = document.getElementById(d);
    const es = div.getElementsByTagName("*");
    if (toggleDisabledAtivado) {
        for (let i = 0; i < es.length; i++) {
        es[i].classList.remove("D11elDesabilitado");
        es[i].disabled = false;
        } toggleDisabledAtivado = false;
    } else {
        for (let i = 0; i < es.length; i++) {
        es[i].classList.add("D11elDesabilitado");
        es[i].disabled = true;
        } toggleDisabledAtivado = true;
    }
}

//////// CONFIGS BOÕES COLOR BOREDER
async function colorBarderADD(){
    try {
        if(seletorBtn===false){return}
        await core.executeAsModal(async () => {
            const result = await app.batchPlay([{ _obj: "showColorPicker", _target: [{ _ref: "application" }], color: { _obj: 'RGBColor', red: 0, green: 0, blue: 0, } }], {});
            const color = result[0].RGBFloatColor ?? null;
            if(color.red == 0 && color.grain==0 && color.blue==0){return}//// AO CANCELAR A JANELA COLORPICKER, RGB = 0,0,0 ENTAM INTEROMPER AQUI!
            color && (document.querySelector('#D11btnBcolor').style.backgroundColor = `rgb(${color.red} ${color.grain} ${color.blue})`);
            red= color.red; green= color.grain;  blue=color.blue;
            //RGB to HEX conversion
            const rgbToHex = (r, g, b) => [r, g, b].map(x => {
                const hex = x.toString(16)
                return hex.length === 1 ? '0' + hex : hex
            }).join('');
            corHexObtida = rgbToHex(parseInt(color.red), parseInt(color.grain), parseInt(color.blue));
            exibMargemSel(false); focarJanela();
        });
    } catch (error) {alert(error)}
}

////////// OBTEM LISTA DE CONJUTOS E AÇÕES
async function carregarActiosLists(){
    getActionSet = require('photoshop').app.actionTree;
    ActionSet = document.getElementById("listActionS");
    ActionList = document.getElementById("listActionA");  
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
            if (actionName.startsWith("")) {
                ActionList.insertAdjacentHTML("beforeend", `<option>${actionName}</option>`);
            }
        }
    };
    ActionSet.addEventListener("change", evt => {
        const selectedIndex = evt.target.selectedIndex; loadActionItems(selectedIndex);
    });
    loadActionItems(0);  
    ActionSet.selectedIndex = 0; ActionList.selectedIndex = 0;
};

function obterDadosIniciais(){
    const dadosObterD11 = localStorage.getItem('D11DadosSave');
    if(dadosObterD11 !==null) { 
        const dadosOBJ = JSON.parse(dadosObterD11);
        dados01 = dadosOBJ.d01;  //// LISTA MATERIAL
        dados02 = dadosOBJ.d02;  //// ADD BORDA CK
        dados03 = dadosOBJ.d03;  //// MODO DE COR
        dados04 = dadosOBJ.d04;  //// SAIDA FORMATO
        dados05 = dadosOBJ.d05;  //// VALOR DA BORDA
        dados06 = dadosOBJ.d06;  //// COR HEX BORDA
        dados07 = dadosOBJ.d07;  //// SAIDA DIRETORIO
        dados08 = dadosOBJ.d08;  //// SAIDA NOME SAIDA
        dados09 = dadosOBJ.d09;  //// SAIDA NOME SAIDA
        dados10 = dadosOBJ.d10;  //// MODELO DA BORDA
       // dados11 = dadosOBJ.d11;//// TIPO DE MATERIAL NA NOME DO AQRUIVO
        dados12 = dadosOBJ.d12
    }
    else{
        dados01 = 0;  //// LISTA MATERIAL
        dados02 = false;  //// ADD BORDA CK
        dados03 = 0;  //// MODO DE COR   
        dados04 = 0;  //// SAIDA FORMATO
        dados05 = 1;  //// VALOR DA BORDA
        dados06 = "ffffff";  //// COR HEX BORDA
        dados07 = 0;  //// SAIDA DIRETORIO
        dados08 = 3;  //// SAIDA NOME SAIDA
        dados09 = true;  //// SAIDA NOME SAIDA
        dados10 = 0; //// MODELO DA BORDA
      //  dados11 = false; //// TIPO DE MATERIAL NA NOME DO AQRUIVO
        dados12 = "Papel";
    }
}////////:::::::::::::::::::::::::

/////// SALVAR  DINAMICAMENTE OS DADOS
function SalvarDados(){
    const dadosD11 = {
        //d01: document.querySelector("#listMaterial").selectedIndex, 
        d01: indexListaMaterial,
        d02: document.querySelector("#D11CKBorda").checked,
        d03: document.querySelector("#listModo").selectedIndex,
        d04: document.querySelector("#listForm").selectedIndex,
        d05: document.querySelector("#D11BdSize").value,
        d07: document.querySelector("#listSaidaSave").selectedIndex,
        d08: document.querySelector("#listSaidaNome").selectedIndex,
        d09: document.querySelector("#D11CKSbPasta").checked,
       // d11: document.querySelector("#D11CKPastaFinal").checked,
        d12: txtBtnListaMaterial,
        d06: corHexObtida,
        d10: indexBodaSel,
        }; localStorage.setItem('D11DadosSave', JSON.stringify(dadosD11));
    };
   /////////:::::::::::::::::::::;

//////////////////////////////////////////////////
////// CONFIGS DA JANELA PREFERENCIAS
function dlgPrefsxD11() {
    document.querySelector("#dlgPrefsD11").uxpShowModal({ title: "Preferências", resize: "both",size: {width: 280,height: 60}})
    configsPreferencesD11();
};
//////*************

/////////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
async function configsPreferencesD11() { 
   try {
        dlgConfigD11 = document.querySelector("#dlgPrefsD11");
        dlgConfigD11.innerHTML = `<div class="D11aimg_main">
            <div class="D11aimg_Container">
               <h1 style="color: #f4f2f2;">Preferências</h1>
               <sp-divider></sp-divider>
               <div style="width: 100%; height: 250px; border: 1px solid rgb(65, 65, 65); margin-top: 5px; padding: 5px;">
                  <div style="width: 200px; display: flex; flex-direction: column; margin: 2px 10px; align-items: center; justify-content: center;">
                     <div style="display: flex; align-items: center; justify-content: center;  transform: translateX(-47px); ">
                        <sp-checkbox id="insLogo" size="s" style="width: 20px;" checked><label class="sp-checkbox-txt" style="margin: 0px;">Inseir logo em lona</label> </sp-checkbox>
                        <div class="btnMedio" id="btnBuscLogo" style="width: 50px; margin: 5px; transform: translateX(90px);">Buscar</div>
                        <div class="btnMedio" id="btnBuscLgDf" style="width: 20px; margin: 5px; transform: translateX(80px);">D</div>
                     </div>
                     <label id="caminLogo" style="color: #a8a8a8; font-size: 11px; transform: translateX(-10px); ">C:/Diretotio default.........</label> 
                  </div>
                  <sp-divider style=" transform: translateY(5px); "></sp-divider>
                  <div style="display: flex; flex-direction: column; transform: translateY(10px); margin: 2px 8px">
                     <sp-checkbox id="insrIDC" size="s" style="width: 20px;"><label class="sp-checkbox-txt" style="margin: 0px;">Inserir indicardor de cortes</label></sp-checkbox>
                     <div style="width: 100%; display: flex; align-items: center; transform: translate(0px, 0px);"> <label style="color: #dbd7d7; font-size: 11px;">Tamanho</label> <input type="number" value="74" id="insrIDCSize" style="width: 35px; height: 20px; display: flex; margin: 3px; padding: 2px;"> <label style="color: #dbd7d7; font-size: 11px;">px | Traçado</label> <input type="number" value="4" id="insrIDCExp" style="width: 25px; height: 20px; display: flex; margin: 3px; padding: 2px;"> <label style="color: #dbd7d7; font-size: 11px;">px</label> </div>
                  </div>
                  <sp-divider style=" width: 200px; transform: translateY(10px); "></sp-divider>
                  <div style="width: 100%; display: flex; align-items: flex-start; transform: translate(8px, 15px); flex-direction: column; justify-content: left;">
                     <sp-checkbox id="insrLEG" size="s" style=""><label class="sp-checkbox-txt" style="margin: 0px;">Imprimir dodos de impresão</label></sp-checkbox>
                     <sp-checkbox id="insrCont" size="s" style=""><label class="sp-checkbox-txt" style="margin: 0px;">Adicionar controno demarcador</label></sp-checkbox>
                     <sp-checkbox  id="D11CKPastaFinal" size="s" ><label class="sp-checkbox-txt" >Exibir diretório ao concluir</label></sp-checkbox >
                     <sp-divider style=" width: 200px; margin: 2px 2px 2px -5px"></sp-divider>
                     <div style="display: flex; transform: translate(2px, 0px);"> <label style="color: #dbd7d7; font-size: 11px;">Valor de acrescimo na Canvas</label> <input type="text" value="2.2" id="acesCanvas" style="width: 30px; height: 20px; display: flex; margin: 3px; padding: 2px;"> <label style="color: #dbd7d7; font-size: 11px;">%</label> </div>
                  </div>
               </div>
            </div>
         </div>
         <div style="width: 100%; height: 100%; display: flex; align-items: center; margin-top: 5px; border: 1px solid #474747; padding: 10px; justify-content: center; border-radius: 0 0 7px 7px; background-color: #4e4d4d;">
            <div class="btnMedio" id="D11PbtnFec" style="width: 70px; margin: 1px;">Sair</div>
            <div class="btnMedio" id="D11PbtnRes" style="width: 70px; margin: 1px;">Defalt</div>
            <div class="btnMedio btn-Executar" id="D11PbtnOK" style="width: 70px; margin: 1px;">Salvar</div>
         </div>
         </div> </div> `
       /////FINAL HTML INTERFACE
       exibirPastaFinal = document.querySelector("#D11CKPastaFinal");

        obterPrefsD11();
        atualiarPrefs();
        function atualiarPrefs(){
            document.querySelector("#insLogo").checked = prefsD11_01;
            document.querySelector("#insrIDCSize").value = prefsD11_02;
            document.querySelector("#insrIDCExp").value = prefsD11_03;
            document.querySelector("#insrLEG").checked = prefsD11_04;
            document.querySelector("#insrCont").checked = prefsD11_05;
            document.querySelector("#acesCanvas").value = prefsD11_06;
            document.querySelector("#insrIDC").checked = prefsD11_07;
            document.querySelector("#caminLogo").textContent= prefsD11_08;
            document.querySelector("#D11CKPastaFinal").checked  = prefsD11_09;
        };
    
        inserirLogo = prefsD11_01;
        cortesMC = prefsD11_02
        sizeCorteMC = prefsD11_03;
        legendaInfo  =  prefsD11_04;
        contornoPreto = prefsD11_05;
        valorHCanvas  = prefsD11_06;
        localLogoPath = prefsD11_08;
        exibirPastaFinal.checked=prefsD11_09


        //////ENCURTAR A LEGENDA
        truncarPathLogo = encurtaLegendax( prefsD11_08);
        document.querySelector("#caminLogo").textContent= truncarPathLogo;
        function encurtaLegendax(path) {
            const dirs = path.split("/");
            if (dirs.length > 3) { dirs.splice(2, dirs.length - 3, "..");}; return dirs.join("/");
        }

        //////// BUSCAR OUITRO LOGO
        document.querySelector("#btnBuscLogo").addEventListener("click", async function() {
            outroLogo = await fs.getFileForOpening()
            localLogoPath = outroLogo.nativePath.replace(/\\/g, "/");
            truncarPathLogo = encurtaLegendax( localLogoPath);
            document.querySelector("#caminLogo").textContent= truncarPathLogo;
        })
        //////// BUSCAR LOGO PADRÃO
        document.querySelector("#btnBuscLgDf").addEventListener("click", async function() {
            localLogoPath="C:/Diretotio default........."
            document.querySelector("#caminLogo").textContent= localLogoPath
        })

        //////// EVENTOS DOS BOTÕES DA JANELA PREFERENCIAS :::::::::::::::::::::::::
            //////// SAIR DA JANELA
        document.querySelector("#D11PbtnFec").addEventListener("click", function() {
            dlgConfigD11.close('OK');
        })
        //////// RESTAURAR VALORES PADÕES
        document.querySelector("#D11PbtnRes").addEventListener("click", function() {
            localLogoPath="C:/Diretotio default........."
            document.querySelector("#caminLogo").textContent= localLogoPath
            originasiPrefs(); atualiarPrefs();
        })
        //////// SALVAR TODOS OS VALORES
        document.querySelector("#D11PbtnOK").addEventListener("click", async function() {
        try {
            dlgConfigD11.close('OK'); SalvarPrefsD11();
           // alertar("OBS! É necessário reiniciar a janela novamente para aplicar os valores!");
            alertar("REINICIE A JANELA, PARA ATUALIZAR PREFERENCIAS!")
        } catch (error) {alert(error)}
     });
   } catch (error) {}
}

function obterPrefsD11(){
    try {
        dadosPrefsD11 = localStorage.getItem('prefsSaveD11'); 
        if(dadosPrefsD11 !==null) { 
            const prefsOBJ = JSON.parse(dadosPrefsD11);
            prefsD11_01 = prefsOBJ.pref_01; ////// INSERIT O LOGO 
            prefsD11_07 = prefsOBJ.pref_07; //// ADD MARCAÇÃO DE CORTE
            prefsD11_02 = prefsOBJ.pref_02; //////// TAMNHO DA MARCAÇÃO DE CORTE
            prefsD11_03 = prefsOBJ.pref_03; //////// TAMNHO DA EXPESSURA DA MARCAÇÃO DE CORTE
            prefsD11_04 = prefsOBJ.pref_04; ///////OPÇÃO DE LEGENDA IFORM DOC 
            prefsD11_05 = prefsOBJ.pref_05; ///////OPÇÃO DE CONTORNO PRETO NA IMAGEM
            prefsD11_06 = prefsOBJ.pref_06; //// VALOR DO ACRESCIMO DE ENCOLHIMENTO DA CANVAS
            prefsD11_08 = prefsOBJ.pref_08; //// VERIFCAR O CAMINHO DO LOGO
            prefsD11_09 = prefsOBJ.pref_09; ////  EXIBIR DIRETÓRIO
        }
        else{originasiPrefs()}
    } catch (error) {}
    }////////:::::::::::::::::::::::::

  function originasiPrefs(){
        prefsD11_01 = true; ////// INSERIT O LOGO 
        prefsD11_07 = true; //// ADD MARCAÇÃO DE CORTE
        prefsD11_02 = 74; //////// TAMNHO DA MARCAÇÃO DE CORTE
        prefsD11_03 = 4; //////// TAMNHO DA EXPESSURA DA MARCAÇÃO DE CORTE
        prefsD11_04 = true; ///////OPÇÃO DE LEGENDA IFORM DOC 
        prefsD11_05 = true; ///////OPÇÃO DE CONTORNO PRETO NA IMAGEM
        prefsD11_06 = 2.2; //// VALOR DO ACRESCIMO DE ENCOLHIMENTO DA CANVAS
        prefsD11_08 = "C:/Diretotio default........."; //// VERIFCAR O CAMINHO DO LOGO
        prefsD11_09 = false; ////// EXIBIR DIRETÓRIO
};
  
/////// SALVAR  DINAMICAMENTE PREFERENCIAS
function SalvarPrefsD11(){
    const prefsD11 = {
        pref_01: document.querySelector("#insLogo").checked,
        pref_02: document.querySelector("#insrIDCSize").value,
        pref_03: document.querySelector("#insrIDCExp").value,
        pref_04: document.querySelector("#insrLEG").checked,
        pref_05: document.querySelector("#insrCont").checked,
        pref_06: document.querySelector("#acesCanvas").value,
        pref_07: document.querySelector("#insrIDC").checked,
        pref_08: localLogoPath,
        pref_09: document.querySelector("#D11CKPastaFinal").checked,
     }; localStorage.setItem('prefsSaveD11', JSON.stringify(prefsD11));
};
/////////:::::::::::::::::::::;
///xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

////////SELETOR DE COR PARA BORDAS
function exibMargemSel(m){
    if(m==true){dsp="flex"; opacidade=0}else {dsp="none"; opacidade=1}
    document.querySelector("#margeSel").style.display= dsp
}

async function bordaConfigs(){
    try {  
        indexBodaSelTextura= false
        if(indexBodaSel ===1 || indexBodaSel ===2){ corHexObtida ="ffffff";}
        //////  Convertendo o código hexadecimal para valores RGB
        corR = parseInt(corHexObtida.substring(0, 2), 16);
        corG = parseInt(corHexObtida.substring(2, 4), 16);
        corB  = parseInt(corHexObtida.substring(4, 6), 16);

            ///////////// CONVERTER CM POR  PIXELS
        borda  = Number(document.querySelector("#D11BdSize").value)/2.54*doc.resolution
        const { app, constants } = require("photoshop");
        bounds = doc.activeLayers[0].bounds;
        constantsx = constants.SelectionType.REPLACE

        B01 = [anchorPos.TOPCENTER, 0,0, borda, bounds.right, 100, -100];
        B03 = [anchorPos.MIDDLELEFT, 0, 0, bounds.bottom, borda, -100, 100];
        B02 = [anchorPos.MIDDLERIGHT, 0, bounds.right-borda, bounds.bottom, bounds.right, -100, 100];
        B04 = [anchorPos.BOTTOMCENTER, bounds.bottom-borda, 0, bounds.bottom, bounds.right, 100, -100];

        ////////ADICIONAR BORDA TEXTURA MADEIRA 
        if(indexBodaSel ===1){
            await pixelsAjustados()
            await app.batchPlay([
                {"_obj":"make","_target":[{"_ref":"contentLayer"}],"using":{"_obj":"contentLayer","group":true,"type":{"_obj":"patternLayer","pattern":{"ID":"9bf42d62-eacc-11e5-ba67-fd7ff8f7eec1","_obj":"pattern","name":"modeira2"}}}},
                {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"contentLayer","_value":"targetEnum"}],"to":{"_obj":"patternLayer","pattern":{"ID":"9bf42d62-eacc-11e5-ba67-fd7ff8f7eec1","_obj":"pattern","name":"modeira2"},"scale":{"_unit":"percentUnit","_value":396.0}}}
                ]);   
        } ////////ADICIONAR BORDA TEXTURA DA PROPRIA FOTO; 
        else if(indexBodaSel ===2){ await pixelsAjustados(); };
        /////////////::::::::::::::::::::::::::::

        //////// REDIMENSONA O DOCUMENTO COM BASE NO VALOR DA BORDA
        await app.batchPlay([
        {"_obj":"canvasSize","canvasExtensionColor":{"_obj":"RGBColor","blue":corB,"grain":corG,"red":corR }, "canvasExtensionColorType":{"_enum":"canvasExtensionColorType","_value":"color"},"height":{"_unit":"pixelsUnit","_value": borda*2},"horizontal":{"_enum":"horizontalLocation","_value":"center"},"relative":true,"vertical":{"_enum":"verticalLocation","_value":"center"},"width":{"_unit":"pixelsUnit","_value": borda*2}}
        ]);
        ////////////:::::::::::::::::::
        /////FINAL DA FUNÇÃO BORFA CONFIGS 
    } catch (error) {}
};
/////////////::::::::::::::::::::::::::::::

async  function pixelsAjustados(){
    await pixelsCopiar( B01[0], B01[1], B01[2], B01[3], B01[4], B01[5], B01[6])
    await pixelsCopiar( B04[0], B04[1], B04[2], B04[3], B04[4], B04[5], B04[6])
    await pixelsCopiar( B03[0], B03[1], B03[2], B03[3], B03[4], B03[5], B03[6])
    await pixelsCopiar( B02[0], B02[1], B02[2], B02[3], B02[4], B02[5], B02[6])
}

///////// SELECIONA, COPIA E POSICIONA OS PISXELS DA MARGEM DO AQUIVO
async function pixelsCopiar(position, top, left, bottom, right, width, height){
    await app.batchPlay([{"_obj":"select","_target":[{"_name":"Background","_ref":"layer"}],"layerID":[1],"makeVisible":false}]);
    await doc.selection.selectRectangle({top: top, left: left, bottom: bottom, right: right}, constantsx);
    await app.batchPlay([ {"_obj":"copyToLayer"}]);
    doc.activeLayers[0].scale(width, height, position);

    if(indexBodaSel ===2){doc.activeLayers[0].opacity=99}
    if(doc.layers.length===5){
    await app.batchPlay([
        {"_obj":"select","_target":[{"_name":"Layer 1","_ref":"layer"}],"makeVisible":false,"selectionModifier":{"_enum":"selectionModifierType","_value":"addToSelectionContinuous"}},
            {"_obj":"mergeLayersNew"}
        ]);
    }
};    
////////////:::::::::::::::::::::::::::::::::

//////CONFIG RESOLUÇÃO
async function IniConfigIMG(){
    if( indexListaMaterial !==2 ){
         await app.batchPlay([ {"_obj":"imageSize","constrainProportions":true,"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"resolution":{"_unit":"densityUnit","_value":200.0},"scaleStyles":true}]);
        ///////// ADICIONAR 2.2% NO VALOR DA ALTURA DA IMAGEM SE A MESMA FOR  MATERIAL CANVAS
         if( indexListaMaterial ===4 ){
            heightCanvas = 100+Number(valorHCanvas);
            await app.batchPlay([{"_obj":"imageSize","height":{"_unit":"percentUnit","_value":heightCanvas },"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"}}]);
         }
    }
};

async function configsImagensPrint(){
    try {
       //await core.executeAsModal(async () => {
            //valoresTestes()  //// dpois deletar
           legendaDados(); 
           if(acabamento.selectedIndex===0 || indexListaMaterial === 6){ acabamentoLJ =""}
           else{ acabamentoLJ = `• OBS! [ ${acabamento.value.toUpperCase()} ]` }

          /////////  COFIGURÇÕES COM BASE NO TIPO DE MATRIAL
          if( indexListaMaterial ==2 ){return} ////// ETIQUETA: SEGUI PARA A PROX FUNÇÃO, POIS NÃO PRECISA DE LEGENDAS
           else if( indexListaMaterial ==6 ){ ////// BANNER
                legendaBG = 0; intervalo=16;
                txtBtnListaMaterial = "Lona para Banner";
                await app.batchPlay([{"_obj":"canvasSize","canvasExtensionColor":{"_obj":"RGBColor","blue":255.0,"grain":255.0,"red":255.0},"canvasExtensionColorType":{"_enum":"canvasExtensionColorType","_value":"color"},"height":{"_unit":"pixelsUnit","_value":1260.0},"horizontal":{"_enum":"horizontalLocation","_value":"center"},"relative":true,"vertical":{"_enum":"verticalLocation","_value":"center"},"width":{"_unit":"pixelsUnit","_value":220.0}}])
            }
            else if( indexListaMaterial ==7 ){ ////// CHASSIS
                legendaBG = 0; intervalo=0;
                txtBtnListaMaterial = "Lona para Acabamento Personalisado";
                await app.batchPlay([{"_obj":"canvasSize","canvasExtensionColor":{"_obj":"RGBColor","blue":255.0,"grain":255.0,"red":255.0},"canvasExtensionColorType":{"_enum":"canvasExtensionColorType","_value":"color"},"height":{"_unit":"distanceUnit","_value":453.6},"horizontal":{"_enum":"horizontalLocation","_value":"center"},"relative":true,"vertical":{"_enum":"verticalLocation","_value":"center"},"width":{"_unit":"distanceUnit","_value":453.6}}])
                
                for (let j = 0; j < 4; j++) {
                       const doc = app.activeDocument
                        await ADDselecaoShapes(375, 0, 375, 0, "marcadorMetalon",0);
                        await solidColorCamada(0,0,0);
                        await doc.rotate(90);  
                }
                await app.batchPlay([{"_obj":"flattenImage"}]);
            }
            else {legendaBG = 40; intervalo=16}

           await app.batchPlay([
                {"_obj":"reset","_target":[{"_property":"colors","_ref":"color"}]},
                {"_obj":"canvasSize","canvasExtensionColor":{"_obj":"RGBColor","blue":255.0,"grain":255.0,"red":255.0},"canvasExtensionColorType":{"_enum":"canvasExtensionColorType","_value":"color"},"height":{"_unit":"pixelsUnit","_value":intervalo},"horizontal":{"_enum":"horizontalLocation","_value":"center"},"relative":true,"vertical":{"_enum":"verticalLocation","_value":"center"},"width":{"_unit":"pixelsUnit","_value":intervalo}},
                {"_obj":"flattenImage"}, {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}},{"_obj":"make","_target":[{"_ref":"layer"}],"layerID":13},
                {"_obj":"stroke","color":{"_obj":"RGBColor","blue":0.0,"grain":0.0,"red":0.0},"location":{"_enum":"strokeLength","_value":"inside"},"mode":{"_enum":"blendMode","_value":"normal"},"opacity":{"_unit":"percentUnit","_value":100.0},"width":Number(sizeCorteMC)},
                {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}
            ]);
            const doc = app.activeDocument
            const bounds = doc.activeLayers[0].bounds;
            const constantsx = Constants.SelectionType.REPLACE
            await doc.selection.selectRectangle({top: Number(cortesMC), left: 0, bottom: bounds.bottom-Number(cortesMC), right: bounds.right}, constantsx);
            await app.batchPlay([ {"_obj":"delete"}]);
            await doc.selection.selectRectangle({top: 0, left: Number(cortesMC), bottom: bounds.bottom, right: bounds.right-Number(cortesMC)}, constantsx);
            await app.batchPlay([ {"_obj":"delete"},{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}, {"_obj":"flattenImage"},]); 

            ///////OPÇÃO DE CONTORNO PRETO NA IMAGEM
            if(contornoPreto ===true){
                await app.batchPlay([
                    {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}},
                    {"_obj":"stroke","color":{"_obj":"RGBColor","blue":0.0,"grain":0.0,"red":0.0},"location":{"_enum":"strokeLength","_value":"inside"},"mode":{"_enum":"blendMode","_value":"normal"},"opacity":{"_unit":"percentUnit","_value":100.0},"width":1},
                    {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}},{"_obj":"flattenImage"}
                ]);
            };

            /////////// ADICIONAR LEGENDO COM INF DO CLIENTNE           
            if(legendaInfo === true){
                await app.batchPlay([ 
                     {"_obj":"canvasSize","canvasExtensionColor":{"_obj":"RGBColor","blue":255.0,"grain":255.0,"red":255.0},"canvasExtensionColorType":{"_enum":"canvasExtensionColorType","_value":"color"},"height":{"_unit":"pixelsUnit","_value": legendaBG},"relative":true,"vertical":{"_enum":"verticalLocation","_value":"top"}}
                ]);
                legenda = `Impressão ${tamanho}cm em ${txtBtnListaMaterial} • Data: ${data} • Loja: ${Loja} • Nome: ${cliente} ${acabamentoLJ }`;
                xPosition= 5; yPosition = bounds.bottom + 32;
                await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 28, position: {x: xPosition, y: yPosition}, fontName: "Arial"});
            } 
            else{
                legenda = " ";
                xPosition= 5; yPosition = bounds.bottom + 32;
                await app.activeDocument.createTextLayer({ name: "datos", contents: legenda, fontSize: 28, position: {x: xPosition, y: yPosition}, fontName: "Arial"});
            }
            /////////// ADICIONAR LEGENDO COM INF DO CLIENTNE FIANL;

             ///////// LONA TAMNHO CONFIGS PARTE FINAL
            if( indexListaMaterial ==6 ){////// BANNER
                let bounds = doc.activeLayers[0].bounds;
                if( inserirLogo===true){ await importarLogo();}
                if( legendaInfo ===true){
                 await doc.activeLayers[0].translate( Number(app.activeDocument.width-bounds.right)-117,  -64);
                 } else{await doc.activeLayers[0].translate( Number(app.activeDocument.width-bounds.right)-617,  -64);}
                await doc.activeLayers[0].rotate(180); 
            }
            if( indexListaMaterial ==7 ){////// CHASSIS
                if( inserirLogo===true){
                    await importarLogo(); await doc.activeLayers[0].translate( 655, -396); 
                } else{await doc.activeLayers[0].translate( 626, -600); }
            }
          await app.batchPlay([{"_obj":"flattenImage"}]);
      
      //  })
    } catch (err) {alert(err)}
}

//////// FUNÇÃO PARA IMPORTAÇÃO DE LOGO
async function importarLogo(){
    try {
        if(localLogoPath ==="C:/Diretotio default........."){
            if(Loja==="Matriz"){logo = "logoHm.svg"}else{logo="logoHs.svg"}
             fileStamp = await fs.getEntryWithUrl(`${dirPlugin}/icons/${logo}`);
        }
        else{ fileStamp = await fs.getEntryWithUrl( localLogoPath );}
        const token = await fs.createSessionToken(fileStamp)
        await app.batchPlay( [
            {"_obj":"placeEvent","antiAlias":true,"freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"null":{"_kind":"local","_path":token},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":0.0},"vertical":{"_unit":"pixelsUnit","_value":0.0}}},
        ]);

        /////// REDIMENSIONAR NO TAMANHO PADRÃO
        const largura = 172
        const camada = app.activeDocument.layers[0];
        const width = camada.bounds.height;
        const newSize = largura * 1 * 100 / width;
        await camada.scale(newSize, newSize);
        
        //////// ALINMHAR NO RESPECTIVOS LOCAL
        await app.batchPlay( [
            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}},
            {"_obj":"align","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"alignToCanvas":false,"using":{"_enum":"alignDistributeSelector","_value":"ADSBottoms"}},
            {"_obj":"align","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"alignToCanvas":false,"using":{"_enum":"alignDistributeSelector","_value":"ADSLefts"}},
            {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}
        ]);

        await app.activeDocument.activeLayers[0].translate(4, 7); 
        await app.batchPlay( [
            {"_obj":"selectAllLayers","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}, {"_obj":"mergeLayersNew"}
        ])
    } catch (error) {}
}
///////////:::::::::::::::::::::::;

/////// IMPORTAR IMAGENS PELO BOTÃO ENTRADA
async  function importarImagens(){
        const fs = require('uxp').storage.localFileSystem;
   //     await core.executeAsModal(async () => {
        const token = await fs.createSessionToken(directory);
        const thePersistentFolder = await fs.getEntryForSessionToken(token);

        //////// FILTRAR ARQUIVO PELO FORMATO
        if(D11CKform.checked===true){
             listFormato = document.querySelector("#listFormato");
            switch(listFormato.selectedIndex){
                    case 0: formatos = /\.(psd)$/i; break;
                    case 1: formatos = /\.(jpg)$/i; break;
                    case 2: formatos = /\.(png)$/i; break;
                    case 3: formatos = /\.(tif)$/i; break;
                    case 4: formatos = /\.(gif)$/i; break;
                    case 5: formatos = /\.(pdf)$/i; break;
                    case 6: formatos = /\.(nef)$/i; break;
            }
        }
        else{ formatos = /\.(png|jpg|jpeg|tif|psd|pdf|eps|gif|ai|nef)$/i; }
    
        //////// MÉTODO  PARA OBTER  AQUIVOS DE SUBPASTAS
        const ckSubfolder = document.querySelector("#D11CKSbPasta")
        entradaPrincipal = await thePersistentFolder.getEntries(); ///// PASTA PRINCIPAS
        for (let entPrincipal of entradaPrincipal) { 
            if (entPrincipal.isFile && entPrincipal.name.match(formatos)) { ImagensDir.push(entPrincipal); } 
            else if (entPrincipal.isFolder && ckSubfolder.checked) {
                subEntradas = await entPrincipal.getEntries();///// SUBPASTAS
                for (let subEnt of subEntradas) {if (subEnt.isFile && subEnt.name.match(formatos)) {ImagensDir.push(subEnt);}
                };
            };
        };

        ///////// MÉTODO JUNTA TODOS OS ARQUIVOS DE PASTA E SUBPASTAS
        ImagensDir.forEach(conteudo => { todasAsImagens.push(conteudo); });
        
         //////// ORGANIZA A ORDEM NUMÉRICA DOS AQUIVOS
        function classiifcarOrdem(a, b) {
            const nomeA = a.name.toLowerCase(); const nomeB = b.name.toLowerCase();
            if (nomeA < nomeB) { return -1;} else if (nomeA > nomeB) { return 1; } 
            else { return 0; }
        }
        /////// ADICIONA OS ARQUIVOS AO ARRAY SE A OPÇÃO EBTRADA ESTIVER HABILITADA
        if(ckeckEntrada.checked===true){
            acessarDoc = todasAsImagens.sort(classiifcarOrdem);
            /////// EXIBIR A QUANTIDADE DE IMAGENS DO DIRETÓRIO
            document.querySelector("#totalArquivos").textContent=`Total: ${acessarDoc.length} imagens`;
            entradaPath = directory.nativePath.replace(/\\/g, "/");
            caminhoPasta(entradaPath, "#D11txtEntrada")
        }
    // },{"interactive": true});
}//////////:::::::::::::

function caminhoPasta(caminho,e){
    try {
        const truncatedPath = encurtaLegenda(caminho);
        document.querySelector(e).textContent = truncatedPath
    } catch (e) {alert(e)}
};
//////////:::::::::::::::::::::::::::

/////// SALVAR DOCUMENTOS
async function salvarDocumentos(){
    try {
      await core.executeAsModal(async () => {  
            const fs = require('uxp').storage.localFileSystem;
             path = app.activeDocument.path.replace(/\\[^\\]*$/, "");
            ////// SELECIONAR O LOCAL DE DESTINHO DAS IMAGENS PROCESSADAS
            switch (saidaSave.selectedIndex) {
                case 0: directory = await fs.getEntryWithUrl(`${path}`); break;
                case 1: ; break; //// MESMO LOCAL
                case 2: directory = await fs.getEntryWithUrl(`${directorySsida.nativePath}`); break; 
            }
            /////////////::::::::::::::::::::::::::::::::::
            const token = await fs.createSessionToken(directory);
            const folder = await fs.getEntryForSessionToken(token);

            /////NOME DA SUBPASTA
            if(indexListaMaterial ==6 ){ subFolderNome = "Lona_Prints"; txtBtnListaMaterial="Banner"}
            else if(indexListaMaterial ==7 ){ subFolderNome = "Lona_Prints"; txtBtnListaMaterial= "Chaxis"}
            else if(indexListaMaterial ==5){ subFolderNome = `Imagens ${saidalistFormato.value}`}
            else{ subFolderNome = `${txtBtnListaMaterial}_Prints`;  }
            const entries = await folder.getEntries();   
            subfolder = entries.filter((entry) => entry.isFolder).find((subFolder) => subFolder.name === subFolderNome);
            if (!subfolder) {subfolder = await folder.createFolder(subFolderNome );}
            
            const getFiles = await subfolder.getEntries();
            const  cont = Number(getFiles.length)+1

            ////////// NOMENCLATURA FINAL DO AQRUIVO
            let ordenar = true;
            let sNome= snome.selectedIndex;
            let editarNome = document.querySelector("#D11SaidaNome").value;
            let atualNome = app.activeDocument.name.match(/(.*)\.[^\.]+$/)[1];
           // if( exibirPastaFinal.checked===true){ matSda= `${txtBtnListaMaterial} `} else{ matSda="" }
           if(indexListaMaterial === 5){txtBtnListaMaterial=""}
            let matSda= `${txtBtnListaMaterial} `
            if(sNome==0){ newfile = `${matSda}${atualNome}` ; ordenar = false  }
            if(sNome==1){ newfile = `${matSda}${editarNome} ${atualNome}`; ordenar = false; }  
            if(sNome==2){ newfile = `${matSda}${atualNome} ${editarNome}`; ordenar = false; }
            if(sNome==3){ nome   = `${matSda}${tamanho}`; ordenar = true}
            if(sNome==4){ nome   = `${matSda}${editarNome} ${tamanho}`; ordenar = true; }
            if(sNome==5){ nome   = `${matSda}${tamanho} ${editarNome}`; ordenar = true; }
            if(sNome==6){ nome   = `${matSda}${editarNome}`; ordenar = true }
            ///////////////////////xxxxxxxxxxxxx
            if(ordenar===true){
                 if(cont<=9){newfile = nome.split("_")[0] +" ID0"+cont;}
                 else{newfile = nome.split("_")[0]+" ID"+cont};
             }
            const newFile = await subfolder.createFile(newfile, { overwrite: true });
            const saveFile = await fs.createSessionToken(newFile);
 
            //////////SAÍDA DE ARQUVIVOS "FORMATOS"
            sfor= saidalistFormato.selectedIndex;
            if(sfor== 0){ command = {"_obj":"save","as":{"_obj":"JPEG","extendedQuality":12,"matteColor":{"_enum":"matteColor","_value":"none"}},"copy":true,"in":{"_kind":"local","_path":saveFile},"lowerCase":true};}
            if(sfor== 1){ command = {"_obj":"save","as":{"PNGFilter":{"_enum":"PNGFilter","_value":"PNGFilterAdaptive"},"PNGInterlaceType":{"_enum":"PNGInterlaceType","_value":"PNGInterlaceNone"},"_obj":"PNGFormat","compression":6,"embedIccProfileLastState":{"_enum":"embedOff","_value":"embedOn"},"method":{"_enum":"PNGMethod","_value":"quick"}},"copy":true,"in":{"_kind":"local","_path": saveFile},"lowerCase":true};}
            if(sfor== 2){ command = {"_obj":"save","as":{"_obj":"photoshop35Format","maximizeCompatibility":true},"in":{"_kind":"local","_path":saveFile},"lowerCase":true};}
            if(sfor== 3){ command = {"_obj": "save","as":{"_obj": "TIFF","byteOrder":{"_enum": "platform","_value": "IBMPC"},"layerCompression":{"_enum": "encoding","_value": "RLE"}},"in": {"_path": saveFile,"_kind": "local"}};}
            if(sfor== 4){ command = {"_obj":"save","as":{"_obj":"photoshopPDFFormat","pdfCompressionType":7,"pdfIncludeProfile":false,"pdfPresetFilename":"High Quality Print"},"in":{"_kind":"local","_path":saveFile},"lowerCase":true};}
           await app.batchPlay([command, {"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}], {});
                 //////////SAÍDA DE ARQUVIVOS "FORMATOS" FINAL
        },{"interactive": true});
    } 
    catch (e) {alert(e);}
}
////////////////////::::::::::::::::::::::

//////////OBTER AS DIMENÕES DO DOCUMENTO ATIVO
async function obterDimensoesDoc(){
    resolucao= app.activeDocument.resolution;
    wsDoc = Number(app.activeDocument.width*2.54/resolucao).toFixed(0);
    hsDoc = Number(app.activeDocument.height*2.54/resolucao).toFixed(0);
    if(wsDoc > hsDoc){ tamanho=`${hsDoc}x${wsDoc}`}
    else{ tamanho=`${wsDoc}x${hsDoc}`}
}
///////ABRIR A JANELA DE PROCESSADOS
async function abrirJanelaProcessados(){
    core.executeAsModal( async() => {
        await exploradorDiretorio(subfolder.nativePath); 
        shell.openPath(`${dirPlugin}/suport/CloseExplorer.vbs`)
        shell.openPath(`${Usuario}/AppData/Roaming/tempScripts/explorarDir.vbs`)
    },{"interactive": true});
}

//// PERCORRE SOMENTE OS DOCUMENTOS OBTIDOS NA LISTA PELO ID
async function percorreDocumuntos(){
     try {
        //core.executeAsModal( async(executionContext) => {
            core.executeAsModal( async() => {
                ////// SE CHECKBOX ENTRADA FOR FALSE, A O VALOR DE "directory" SERÁ O CAMINHO DO DOCUMENTO ATIVO
                if(ckeckEntrada.checked===false){ 
                    entradaDocAtivoPath = app.activeDocument.path.replace(/\\[^\\]*$/, "");
                    directory = await fs.getEntryWithUrl(`${entradaDocAtivoPath}`);
                }
            // try {document.querySelector("#txtMsgDLG").innerHTML= `Processing... 1/${acessarDoc.length}` } catch (error) {}
                //////// PERCORRE TODOS OS DOCUEMTNOS 
                totalDocs = parseFloat(acessarDoc.length);
                for (var i=0;i<acessarDoc.length;i++){
                cont=1;
                conteudo= acessarDoc[i]; 
                ///////////// SE O ÍTEM POSSUI MAIS DE 30 CARACTERES O MESMO É ABREVIADO
                    try {
                        if(ckeckEntrada.checked===true){item= conteudo.name}else{ item= conteudo}
                        let displayedItem = item;
                        if (item.length > 30) {
                            if (item.includes("_")){ parts = item.split('_') }
                            else if (item.includes(" ")){ parts = item.split(' ')}
                            else if (item.includes("-")){ parts = item.split('-')}
                            let extension = parts[parts.length - 1];
                            let fileNameWithoutExtension = extension.substring(0, extension.lastIndexOf('.'));
                            let fileExtension = extension.substring(extension.lastIndexOf('.'));
                            displayedItem = parts[0] + ' ...' + fileNameWithoutExtension + fileExtension;
                            atualDocName= displayedItem;
                        }else{atualDocName= item}
                    } catch (error) {NomeDoc.textContent="AGUARDE!"}
                    ///////////:::::::::::::::::::::::::::
                    try {
                    txtMsgDLG= document.querySelector("#txtMsgDLG");
                    txtMsgDLG.innerHTML= `Processing... ${cont+i}/${totalDocs}`
                    NomeDoc = document.querySelector("#NomeDoc");
                    NomeDoc.textContent= atualDocName;


                    } catch (error) {alert(error)}

                    if(ckeckEntrada.checked===true){ app.open(conteudo )}
                    else{ await app.batchPlay([{"_obj":"select","_target":[{"_name":conteudo,"_ref":"document"}]}], {}); }
                    ////////////TODOS OS EVENTOS AQUI
                    await obterDimensoesDoc("servico");
                    await pocessamento();
            };
            try {await document.querySelector('#processServic').close('OK'); } catch (error) {}
            if(exibirPastaFinal.checked===true){await abrirJanelaProcessados();} 

            core.executeAsModal( async() => {await shell.openPath(`${dirPlugin}/suport/exeVersaWoerks.vbs`)})
            },{"interactive": true});
        
     } catch (error) {alert(error) }
};
//////////xxxxxxxxxxxxxxxxxxxxxxxxx

/////// FUNÇÃO MODO RETRATO
async function modoRetratox(){
    obterDimensoesDoc();
    if(wsDoc>hsDoc){await app.batchPlay([{"_obj":"rotateEventEnum","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"angle":{"_unit":"angleUnit","_value":-90.0}}]); }
}

///////////////////////////////////////////////
//////FUNÇÃO PRINCIPAL AQUI!XXXXXXX
async function pocessamento() {
    try {
        doc = await app.activeDocument;
        await app.batchPlay([{"_obj":"flattenImage"}]);
        if(modoRetrato.checked===true){modoRetratox()}

        await IniConfigIMG();
        if(D11CKBorda.checked==true){ await bordaConfigs()}
        ////////::::::::::::::::::::::
        ///////EXECUTAR  AÇÕES
        const exeActions = document.getElementById("D11CKActions").checked;
        if(exeActions==true){ 
        const list_AS = ActionSet.value; list_AC = ActionList.value;
        await app.batchPlay([{"_obj":"play","_target":[{"_name": list_AC,"_ref":"action"},{"_name": list_AS,"_ref":"actionSet"}]}], { });
        };
        ////////::::::::::::::::::::::
        
        /////// COLORMODO
        const colorModo = document.querySelector("#listModo")
        switch(colorModo.selectedIndex){
            case 0: modo="RGBColorMode"; break;
            case 1: modo= "CMYKColorMode"; break;
            case 2: modo= "grayscaleMode"; break;
        };
        await app.batchPlay([{"_obj":"convertMode","flatten":true,"to":{"_class":modo}}]);
        if(indexListaMaterial !=5){await configsImagensPrint()}
        await salvarDocumentos()
            ////////::::::::::::::::::::::
    } catch (error) {alert(error)}
};

function focarJanela() {
    try {
        function focar() { document.querySelector("#D11confDLGfocus").focus(), 16 }
        setTimeout(focar, 150);
    } catch (error) {}
}

// Função para remover um item da lista pelo índice
function removeItemByIndex(index) {
    if (index !== -1) { // Verifica se o índice é válido
        const divParaRemover = document.querySelector(`.task:nth-child(${index + 1})`); // Encontra o elemento pai da div a ser removida
        if (divParaRemover) {
            divParaRemover.remove(); // Remove o elemento da lista
            acessarDoc.splice(index, 1); // Remove o item do array
            document.getElementById("D11TxtDocItens").textContent = `Lista de Documentos: ${acessarDoc.length} itens`;
            statusListaDocs();
            filtrarDocs = false;
            setTimeout(() => { document.getElementById('D11confDLGfocus').focus(); }, 150);
        }
    }
}

async function  selItemAtualConfig(m){
    /////////// SELECIONAR ITEM NA INTERFACE
    itensDocsKey = [];
    seldocumentKey=[]
    itensClassNomes = document.getElementsByClassName("docsNomes");
    for (let item of itensClassNomes) {
        dataOriginal = item.getAttribute("data-original");
        if (dataOriginal) {
        itensDocsKey.push(item);
        seldocumentKey.push(dataOriginal)
        }
    }
    prevBtn = Array.from(document.getElementsByClassName("preview"));
    for (const prevBtnsx of  prevBtn) { prevBtnsx.classList.remove("btnIconsDSel");}

    for (let item of itensClassNomes) { item.classList.remove("selectItemOK"); }
    const itemSelecionado = itensDocsKey[m]; 
    itemSelecionado.classList.add("selectItemOK");
    await acessarDocumento(seldocumentKey[m]);
    focarJanela();
}

// Adiciona um listener de teclado para remover itens da lista pelo atalho
document.addEventListener("keydown", function(event) {
        if (event.keyCode === 82) { // Verifica se a tecla pressionada é 'R'
            event.preventDefault(); // Evita comportamento padrão da tecla 'R' (como recarregar a página)
            removeItemByIndex(indexAtalho); // Remove o item da lista usando o índice do atalho
            selItemAtualConfig(indexAtalho)// seleciona o prox item
        }
});

function dadosStatusUI(){
    try {
        acabamentoLJ= acabamento.value;
        if(acabamentoLJ===undefined || indexListaMaterial===2){acabamentoLJ="Sem Acabamento"; contador=0}
        statusUI = `Acabamento : ${acabamentoLJ }`;
        document.querySelector("#statusJanela").innerHTML=statusUI;
    } catch (e) {alert(e) }
}

////// CARREGAR JALELA PRINCIPAL
async function dlgSaveDocs() {
    ////SELECIONA O DOCUMENTO ATIVIO NA LISTA DE DOCUMENTOS
    try {
        const result = await  app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'itemIndex' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
        indexDA = await result["0"].itemIndex;
    } catch (error) {  }
    fetch('html/D11SaveDocs.html').then(response => response.text()).then(data => {
        try {
            D11dlg = document.querySelector("#dlgSaveDoc");
            D11dlg.showModal({ title: `PS-fxrios: Image Process UXP -2024!`, resize: "both", size: { width:439, height:600}})
            D11dlg.innerHTML = data; 
            D11dlg.addEventListener('load', evt => { setTimeout(() =>{ document.getElementById('D11confDLGfocus').focus();}, 150) });
            document.querySelector("#D11confDLGfocus").checked=true
            if(document.querySelector("#D11confDLGfocus").checked == true){ obterDocumentos();  eventosJanelaD11(); }
            //////// DICAS DE ATALHO
            document.querySelector('#D11CkMRetrato').setAttribute("title", "Modo Retato • Tecla: D")
        } catch (error) {}
    });
};


//////////////// FUNÇAO PARA ALTERAR VALOR DO INPUT COM ATALHOS
// let bordaInicial =  document.querySelector("#D11BdSize").value
// let BordaSizec = document.querySelector("#D11BdSize");

// document.addEventListener('keydown', saveDocsKey);
//    async function saveDocsKey(event) {
//     BordaSizec.value = bordaInicial;
//     if (event.keyCode === 39) {
//         BordaSizec.value = Number(BordaSizec.value) +1;
//     }
//     if (event.keyCode === 37) {
//         if(BordaSizec.value !==0){ BordaSizec.value = Number(BordaSizec.value) -1;}
//      }
//    // bordaInicial = BordaSizec.value;
// }