btnPrint = document.querySelector("#ms_func1");
btnPrint.addEventListener("click", () => {
    /////// RESETAR EVENTOS DE TODAS AS JANELAS
    dialogsEventsFalse();
    //////////////////////////////
    getwDOC = app.activeDocument.width;
    gethDOC = app.activeDocument.height;
    janImprimirDoc();
    async  function temporizador2() { await getImageThumbnail("thumb")}; setTimeout(temporizador2, 100);
});

 ////// CARREGAR JALELA PRINCIPAL
 async function janImprimirDoc() {
    D2PrintEventos=true;
    fetch('html/D2Print.html').then(response => response.text()).then(data => {
    D2Print = document.querySelector("#dlgImprimir");
    D2Print.show({ title: `PS-fxrios Print: ${app.activeDocument.name}`, resize: "both", size: { width: 550, height:350}})
    D2Print.innerHTML = data;
        ////// TODOS OS addEventListener AQUI!
          ouvitesEventsFucs();
   });
 };
 
 checadoCK2 = true;
//////////////////////////////////////////
///////// TODAS AS FUNÇÕES AQUI!
function ouvitesEventsFucs(){
    try {
        colunacResetClasss(".colunaC", '.D2altura' ); //////// RESETAR BOTÃO SELECIONADO
        
        lista1 = document.getElementById("listQualidade");
        lista1.selectedIndex = 2;
        Qualidade="C";
    
        lista1.addEventListener("change", function(){
            if(lista1.selectedIndex === 0){Qualidade="A";}
            else if(lista1.selectedIndex === 1){Qualidade="B";}
            else if(lista1.selectedIndex === 2){Qualidade="C";}
            else if(lista1.selectedIndex === 3){Qualidade="D";}
            statusPrint();
        });
        ///// FUNÇÃO  VALIDA CHECKBOX EXIBIR LOGO
        const ck2 = document.getElementById("checkPrint");
    
        // ck2.addEventListener("click", function() { tggCheckboxKey("#checkPrint")});
        ///////::::::::::::::::::::::::::::::::::::
        ///// FUNÇÃO SETAS  INPUT TEXT
        const cont = 1;
        copias = document.getElementById("copias"); 
        const setaCM = document.getElementById("D2setaCM");
        const setaBX  = document.getElementById("D2setaBX");
    
        setaCM.addEventListener("click", async function(){
            copias.value =Number(copias.value)+ Number(cont); statusPrint();
        });
    
        setaBX.addEventListener("click",async function(){
            copias.value =Number(copias.value) - Number(cont); 
            if(copias.value==0){copias.value=1}; statusPrint();
        });
         /////// SETAS  INPUT TEXT::::::::::::::::::::::::::::::::
    
        /////// BOTÕES DE RÁEDIO SETTINGS
        rd1 = document.getElementById("D2rd1");
        rd2 = document.getElementById("D2rd2");
   
       if( getwDOC >1654 ){ radioSellect = 1 }else{ radioSellect = 0 };

        ////////// SELECIONAR A OPÇAO RADIO POR NUMERO - FINAL
        radioIndexMc(); ////////// SELECIONAR A OPÇAO RADIO POR NUMERO
        radioChecado(); /////// VERIFICA RADIO BOTÕES
    
        const radios = document.getElementsByClassName("radio");
        const radioBtn = Array.from(radios);
        for(let i = 0; i < radioBtn.length; i++){ 
            radioBtn[i].addEventListener('click', (event) => {
                for(let i = 0; i < radioBtn.length; i++){
                    index = radioBtn.indexOf(event.currentTarget);
                    radioBtn[i].classList.remove('rchecado');
                }
                event.currentTarget.classList.add('rchecado');
                radioChecado(); /////// VERIFICA RADIO BOTÕES
                statusPrint();
            })
        }
        /////// RÁEDIO SETTINGS ::::::::::::::::::::::::
    
        ///// FUNÇÃO DOS BOTÕES 
        btn1 = document.querySelector("#btn1");
        btn2 = document.querySelector("#btn2");
        btn3 = document.querySelector("#btn3");
        btn4 = document.querySelector("#btn4");
        btn5 = document.querySelector("#btn5");
        btn6 = document.querySelector("#btn6");
        btn7 = document.querySelector("#iconMD");
        btnP = document.querySelector("#btnP");
        txtR1= document.querySelector("#D2txt_rd1");
    
        //////VERIFICAR SE O DOCUMENTO ESTÁ EM MODO RETRATO
        if( getwDOC >gethDOC ){btn5.classList.add('elem-Desabilitado'); btn7.textContent="z"}
        else{btn6.classList.add('elem-Desabilitado'); btn7.textContent="6"};
         if( getwDOC >1654 ){ 
                btn5.classList.add('elem-Desabilitado');
                rd1.classList.add('elem-Desabilitado');
                txtR1.classList.add('label-Desabilitado'); statusPrint();
        };///////::::::::::::::::::::::::::::::::::::
    
       ///////// FUNÇÃO IMPRIMIR
        btn1.addEventListener("click", async () => {
                try { D2Print.close('OK'); await configsPrints();} catch (err) { };
          });
       
        ///////// FUNÇÃO FECHA JANELA
       btn2.addEventListener("click", () => {D2Print.close('OK');D2PrintEventos=false});
       btn5.addEventListener("click", () => { rotacionarFolha(1)});
       btn6.addEventListener("click", () => { rotacionarFolha(2)});       
       btn4.addEventListener("click", () => { filadeIMpressao()}); 
       btnP.addEventListener("click", () => { 
        try {
            D2Print.close('OK'); 
            shell.openPath(`${dirPlugin}/suport/epsonPrefs.vbs`);} catch (err) { alert(err) }
        });       
             
        ///////::::::::::::::::::::::::::::::::::::
        statusPrint(); focarJanela(); configsAtalho();
    } catch (err) {}
}////////TODAS AS FUNÇÕES AQUI!::::::::::::::::

async function atualizarThumb(m){
    if(m==1){rotote = -90.0}else{rotote = 90.0}
    await rotacionarDOC(rotote); // await janImprimirDoc(); 
    await getImageThumbnail("thumb")
}

///////// FUNÇÃO IMPRIR::::::::::::::::::
async function configsPrints(){  
    if(D2PrintEventos==false){return}
    D2PrintEventos=false;
    try {
        printJSX = `${dirPlugin}suport/jsx/Prints`; 
        PtA4ID_0 = `${printJSX}/print A4 ID_0.jsx`;   
        PtA4ID_1 = `${printJSX}/print A4 ID_1.jsx`;
        PtA4ID_2 = `${printJSX}/print A4 ID_2.jsx`; 
        PtA4ID_3 = `${printJSX}/print A4 ID_3.jsx`;    
        PtA3ID_0 = `${printJSX}/print A3 ID_0.jsx`;   
        PtA3ID_1 = `${printJSX}/print A3 ID_1.jsx`;
        PtA3ID_2 = `${printJSX}/print A3 ID_2.jsx`; 
        PtA3ID_3 = `${printJSX}/print A3 ID_3.jsx`;        
        closeDoc =  `${printJSX}/closeDoc.jsx`;   
       
        await core.executeAsModal(async () => {
           copias = document.getElementById("copias").value; 
           if( copias==1){ f="folha", q= 1 }else{f="folhas", q= copias };

            if(Qualidade =="A"){
                if(folha =="A4"){ alert(`Impressão de Teste:\nAdicione ${q} ${f} A4`);
                  for(let i = 0; i < copias; i++){exexutarJSXfile(PtA4ID_0); } 
                }    
                else{alert(`Impressão de Teste:\nAdicione ${q} ${f} A3`); 
                 for(let i = 0; i < copias; i++){exexutarJSXfile(PtA3ID_0);} 
                }
            }
            else if(Qualidade =="B"){
                if(folha =="A4"){alert(`Impressão qualidade Baixa:\nAdicione ${q} ${f} A4`);
                 for(let i = 0; i < copias; i++){exexutarJSXfile(PtA4ID_1);}
                }
                else{alert(`Impressão qualidade Baixa:\nAdicione ${q} ${f} A3`); 
                for(let i = 0; i < copias; i++){exexutarJSXfile(PtA3ID_1);}
                 }
            }
            else if(Qualidade =="C"){
                if(folha =="A4"){alert(`Impressão qualidade Média:\nAdicione ${q} ${f} A4`); 
                for(let i = 0; i < copias; i++){exexutarJSXfile(PtA4ID_2);}
                 }
                else{alert(`Impressão qualidade Média:\nAdicione ${q} ${f} A3`);
                 for(let i = 0; i < copias; i++){exexutarJSXfile(PtA3ID_2);} 
                }
            }
            else if(Qualidade =="D"){
                if(folha =="A4"){alert(`Impressão qualidade Alta:\nAdicione ${q} ${f} A4`); 
                for(let i = 0; i < copias; i++){exexutarJSXfile(PtA4ID_3);}
                  }
                else{alert(`Impressão qualidade Alta:\nAdicione ${q} ${f} A3`); 
                for(let i = 0; i < copias; i++){exexutarJSXfile(PtA3ID_3);}
             }};
            if(checadoCK2 ==true){exexutarJSXfile(closeDoc)} 
       });
    } catch (err) {alert(err)}
};

async function exexutarJSXfile(jsxFile) {  
    entrada = await fs.getEntryWithUrl(jsxFile); 
    token = await fs.createSessionToken(entrada)
    await app.batchPlay([{ "_obj": "AdobeScriptAutomation Scripts","javaScript": {"_path": token,"_kind": "local"},"javaScriptMessage": "JSM","_isCommand": true,"_options": {"dialogOptions": "dontDisplay"}}], {});
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
    D2Print.addEventListener("close", () => {
        document.removeEventListener('keydown', printsKey);
    });
    ////////MATER A JANELA SEMPRE FOCADA
    document.querySelector(".janelaBase").addEventListener('click', (event) => { focarJanela();})
    /////////////:::::::::

    ////////////// ATALHOS CONFIGSXXXXXXXXXXXX
    document.addEventListener("keydown", printsKey);
    async function printsKey(event) {
            if (event.keyCode === 13) {
                try { D2Print.close('OK'); await configsPrints();} catch (err) { };
            } 
            else if(event.keyCode == 27) {D2Print.close('OK');}  //// SAIR DA JANELA
            else if(event.keyCode == 67) {alert("CLASSIC")}  //// SAIR DA JANELA
            ////////// AJUSTAR COMPLEMENTARES
            else if(event.keyCode ==37) {quantCopiasADD( -1)} ////MOVERA PARA ESQUEDA
            else if(event.keyCode ==39) {quantCopiasADD(+1)} ////MOVERA PARA DIREITA
            else if(event.keyCode ==38) {qualidadeLista( -1)} ////MOVERA PARA ESQUEDA
            else if(event.keyCode ==40) {qualidadeLista(+1);} ////MOVERA PARA DIREITA
            else if(event.keyCode ==82) { toggleRotacionarKey()} ////ROTACIONAR FOLHA
            else if(event.keyCode ==80) {tggCheckboxKey("#checkPrint")} //// IMPRIMIR E FCHAR
        };
        //////// PRECESSO FINAL POR ATALHOS FINAL       
        ///////////////:::::::::::::::::::::::::::::::::::::::::::
    };

    ////////// ALTERAR QUANTIDADE DE COPIAS
    function quantCopiasADD(method){
        const copias = document.getElementById("copias")
        if(copias.value===1){copias.value=2}
        copias.value = parseFloat(copias.value)+method;
        statusPrint();
    }
    
    //////// STATUS DOS DADOS DE IMPRESSÃO
    function statusPrint(){
        document.querySelector("#statusPrint").innerHTML=`Status: Folha: ${folha}• ${copias.value} Copias  • Qual.: ${lista1.value}`
    };

    //////// MARCAR/DESMARCAR CHECKBOXS
    function tggCheckboxKey(e) {
        let checkbox = document.querySelector(e);
        checkbox.checked = !checkbox.checked;
        focarJanela(); 
    };

    //////// ALTERANDO A QUALIDADE DE IMPRESSÃO
    function qualidadeLista(method) {
        let newIndex = lista1.selectedIndex + method;
        if (newIndex >= 0 && newIndex < lista1.options.length) {
            lista1.selectedIndex = newIndex; 
            statusPrint();
        };
    };

     //////////////::::::::::::::::::  
     toggleRotacionar= false;
     function toggleRotacionarKey() {
         if ( toggleRotacionar) { rotacionarFolha(2);  toggleRotacionar = false; } 
         else { rotacionarFolha(1);  toggleRotacionar = true; };
         statusPrint(); focarJanela();  
     };

     toggleFilaimpres = false;
     function filadeIMpressao(){
         if ( toggleFilaimpres) { D2Print.resizeTo( 550, 350); toggleFilaimpres = false; } 
         else { D2Print.resizeTo( 550, 650); toggleFilaimpres = true; };
    };
 
 
    //////////ROTACIONA FOLHA DE IMPRESSÃO
    function rotacionarFolha(folha){
        if( gethDOC >3007 ){return};
        if(folha==1){
            atualizarThumb(2);
            btn5.classList.add('elem-Desabilitado'); 
            btn6.classList.remove('elem-Desabilitado'); 
            btn7.textContent="z"; radioSellect =1; radioIndexMc(); radioChecado();
            rd1.classList.add('elem-Desabilitado');
            txtR1.classList.add('label-Desabilitado'); 
        }
        else{
            atualizarThumb(1);
            btn6.classList.add('elem-Desabilitado'); 
            btn5.classList.remove('elem-Desabilitado');
            btn7.textContent="6";  radioSellect =0; radioIndexMc(); radioChecado();
            rd1.classList.remove('elem-Desabilitado');
            txtR1.classList.remove('label-Desabilitado'); 
        };
        statusPrint();  limparHistorico();
    };
 
     ////////// SELECIONAR A OPÇAO RADIO POR NUMERO
     function radioIndexMc(){   
         rd1.classList.remove('rchecado');
         rd2.classList.remove('rchecado');
         if (radioSellect === 0) { rd1.classList.add('rchecado');} 
         else if (radioSellect === 1) { rd2.classList.add('rchecado'); } 
     }
 
     //////// AÇÃO QIE VERIFICA QUAL BAOTÃO CHECADO
     function radioChecado() {
     ////////// VERIFICA QUAL BOTÃO TEM A CLASSE 'rchecado'
         if (rd1.classList.contains('rchecado')) { folha ="A4"};
         if (rd2.classList.contains('rchecado')) { folha ="A3"};
     }
     ///////::::::::::::::::::::::::
 