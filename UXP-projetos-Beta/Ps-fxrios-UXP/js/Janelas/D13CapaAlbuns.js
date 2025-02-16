dgmBtn11 = document.querySelector("#dgm-btn4");
dgmBtn11.addEventListener("click", () => {
    D13CPalbuns()
})

function D13CPalbuns() {
    try {
        // Verifica se o modal já existe no DOM e remove se necessário
        let existingDialog = document.getElementById("dialogo");
        if (existingDialog) { existingDialog.remove(); }
        dialog = document.createElement("dialog");
        dialog.id = "dialogo";
        document.body.appendChild(dialog);
        dialog.showModal({ title: `PS-fxrios: Configs Capa Albuns!`, resize: "none", size: { width: 325, height: 336 }, });
        es1.css("#dialogo", {padding: "15px" });
        configsD13CPalbuns();
        colunacResetClasss(".D13ColunaBbotns", '.D13altura'); //////// RESETAR BOTÃO SELECIONADO
    } catch (error) { alert(error) }
};


function configsD13CPalbuns() {
    let conteudo = document.createElement("div"); dialog.appendChild(conteudo);
    conteudo.innerHTML = `
        <style>
           .D13altura{
                width: 295px;
                height: 25px;
                font-size: 11px;
                line-height: 1.8;
            }
            .bgInput{ background-color: #666666;}       
        </style>

        <div style="width: 300px; display: flex;">
            <div id="D13ColunaA" style="width: 251px; height: 100%; display: flex; flex-direction: column; "></div>
            <sp-checkbox  id="D13focus" size="s" style="position: absolute; top: -50px;" ></sp-checkbox >
            <div id="albumFotobook" style="width:100%; height: 20px; display: flex; justify-content: center; align-items: center;">
            <sp-radio-group row style="padding: 3px; width: 200px;">
            <sp-radio  class="radiobtnx" checked><label class="sp-radio-txt" >Album</label></sp-radio>
            <sp-radio  class="radiobtnx" ><label class="sp-radio-txt"  style="margin-left: 2px;">FotoBook</label></sp-radio>
            </sp-radio-group>
            </div>
                <div id="PainelServicos" style="width:100%; background-color: var(--cor-bg-medio); border: var(--cor-borda-setas) ; display: flex; padding: 10px; flex-direction: column;align-items: flex-end; margin: 1px;">
                <div id="grupoRadios"></div>
                <div id="PainelOpcoes" ></div> 
                <div id="PainelTipo" ></div>
            </div>
            <div id="PainlTamanho" style="width:100%; background-color: var(--cor-bg-medio); border: var(--cor-borda-setas) ; display: flex; padding: 10px; flex-direction: column;align-items: flex-end; margin: 1px">
            <div id="ftbPrestes" ></div>
            <div id="inputLargura" class="albunSize" ></div> 
            <div id="inputAltura" class="albunSize" ></div>
            </div>
            <div id="PainelLaminas" style="width:100%; background-color: var(--cor-bg-medio); border: var(--cor-borda-setas) ; display: flex;  flex-direction: column;align-items: flex-end; padding: 10px; margin: 1px"></div>
            <div class="D13ColunaB" style="width: 107px; height: 100%; display: flex; flex-direction: column; align-items: center; margin-left: 10px;">
            <div class="D13ColunaBbotns">
                  <div class="btnMedio D13altura btn-Executar" id="D13Btn1" style="width: 83px; margin: 1px;">Processar</div>
                  <div class="btnMedio D13altura" id="D13Btn2" style="width: 83px; margin: 1px;">Cancelar</div>
                  <div class="btnMedio D13altura" id="D13Btn3" style="width: 83px; margin: 1px;">Renomear</div>
             </div>
                  <sp-checkbox  id="D13Guias" size="s" checked><label class="sp-checkbox-txt" >Add Guias</label></sp-checkbox >
            </div>
        </div>
    `;

    /////////////////// PAINEL CONFIG
    P01 = [
        "#D13ColunaA", /////// ID DA ÁREA DO PAINEL
        "100%", ///// LARGURA DO PAINEL
        "100%", ///// ALTURA DO PAINEL
        "#PainelColunaA",  //// ID DO CONTEUDO DO PAINEL
        "var(--cor-bordaDefalu)", ///// COR DA BORDA DO PAINEL
        "2px",  //// BORDER RADIOS DO PAINEL
        "Preferências",  //// TITULO DO PAINEL 
        "var(--cor-bg-default)", //// COR BG TITULO 
        "#conteudoPainel1", /// CONTEÚDO DO PAINEL
        "flex-start"  ///// ALINHAR CONTEÚDO NO PAINEL
    ];
    painelMD(P01[0], P01[1], P01[2], P01[3], P01[4], P01[5], P01[6], P01[7], P01[8], P01[9]);//////PAINEL 1
    ////////////:::::::::::::::::::::
    s1("#conteudoPainel1").appendChild(s1("#albumFotobook"));
    es1.css("#conteudoPainel1", { width: "100%", justifycontent: "center", padding: "10px" });


    s1("#conteudoPainel1").appendChild(s1("#PainelServicos"));
    P02 = [
        "#grupoRadios", "100%", "100%", "#PainelColunaA", "var(--cor-bordaClara)",
        "4px", "Tipo de serviço", "var(--cor-bg-medio)", "#conteudoPainel2", "flex-start"
    ];
    painelMD(P02[0], P02[1], P02[2], P02[3], P02[4], P02[5], P02[6], P02[7], P02[8], P02[9]);//////PAINEL 2
    s1("#conteudoPainel2").appendChild(s1("#albumFotobook"));
    s1("#PainelServicos").appendChild(s1("#grupoRadios"));

    /////////// ADD TEMPLATE LISTA SERVIÇO
    s1("#PainelServicos").appendChild(s1("#PainelOpcoes"));
    const list1itens = ["Capa", "Luva", "Maleta"];
    dropdowListMD("#PainelOpcoes", "Opçõs:", "flex", "#List01", list1itens, 110);

    /////////// ADD TEMPLATE LISTA MODELO
    s1("#PainelServicos").appendChild(s1("#PainelTipo"));
    const list1itens2 = ["Padrão", "Magnética"];
    dropdowListMD("#PainelTipo", "Tipo:", "flex", "#List02", list1itens2, 110);

    /////////// ADD TEMPLATE LISTA PRESETS DO FOTOBOOK
    s1("#PainlTamanho").appendChild(s1("#ftbPrestes"));
    const list1itens3 = ["15x20","15x21","20x20","20x30","25x30","30x30"];
    dropdowListMD("#ftbPrestes", "Modelo:", "flex", "#List03", list1itens3, 110);


    /////////// INSERIR O GRUPO DENTRO DO PAINEL PRINCIPA
    s1("#conteudoPainel1").appendChild(s1("#PainlTamanho"));
    /////////// ADD TEMPLATE INPUT LARGURA
    s1("#PainlTamanho").appendChild(s1("#inputLargura"));
    inputNumberMD("#inputLargura", "Largura: cm", "flex", "50", "et01", "setP1", "setN1");
    es1.on('#setP1', 'click', () => { inputNumber(1, "#et01"); });
    es1.on('#setN1', 'click', () => { inputNumber(-1, "#et01") });

    /////////// ADD TEMPLATE INPUT ALTURA
    s1("#PainlTamanho").appendChild(s1("#inputAltura"));
    inputNumberMD("#inputAltura", "Altura: cm", "flex", "50", "et02", "setP2", "setN2");
    es1.on('#setP2', 'click', () => { inputNumber(1, "#et02"); });
    es1.on('#setN2', 'click', () => { inputNumber(-1, "#et02") });

    /////////// ADD TEMPLATE INPUT QUANTIDADE LAMINAS
    s1("#conteudoPainel1").appendChild(s1("#PainelLaminas"));
    inputNumberMD("#PainelLaminas", "Laminas", "flex", "50", "et03", "setP3", "setN3");
    es1.on('#setP3', 'click', () => { inputNumber(1, "#et03"); });
    es1.on('#setN3', 'click', () => { inputNumber(-1, "#et03") });

    //////// EVENTOS COLUNA B
    es1.on('#D13Btn1', 'click', async function () {
        //dialog.resizeTo( 325, 336);
       await processConfigs()
    });
    es1.on('#D13Btn2', 'click', function () { dialog.close(); });
    es1.on('#D13Btn3', 'click', async function () {
        try {
           
            /////FUNÇÃO PARA RENOMEAR OS ARQUIVOS
            const caminho = app.activeDocument.path.replace(/\\[^\\]*$/, "");
            await renamePaginas(caminho );
            const divider = "______________________________________"
            const nomes = ["RENOMEAÇÃO DE LÂMINAS", divider];
            conteudoA.forEach((elemenA, index) => { nomes.push( `Nome: ${elemenA}    Para: ${conteudoB[index]}`)});
            nomes.push(divider,"RENOMEADAS COM SUCESSO!");
            alert( nomes.join("\n"))
        } catch (error) { consele.log(error) }
    });

    D13_rds = document.querySelectorAll('.radiobtnx');
    D13_rds.forEach((radio, index )=> {     
        radio.addEventListener('click', ()=> {
            radioOpcoes = index;  radioBtnExecutar( radioOpcoes);
        });
    });

    //////////////::::::::::::::::
    dadosIniciasD13();  
    radioBtnExecutar(radioOpcoes);
    focarJanela();
    configsAtalhoD13();
};

/////XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//////////////////////////////////////////////////////
////////// METHODOS UXP AQUI  ///////////////

/////// OBTER DINAMICAMENTE OS DADOS
function dadosIniciasD13(){
    const dadosObterD13 = localStorage.getItem('D13DadosSave');
    if(dadosObterD13 !==null) { 
        const dadosOBJ = JSON.parse(dadosObterD13);
        s1("#et03").value = dadosOBJ.d01
        s1("#et02").value = dadosOBJ.d02
        s1("#et01").value = dadosOBJ.d03
        s1("#List01").selectedIndex= dadosOBJ.d04
        s1("#List02").selectedIndex= dadosOBJ.d05;   
        s1("#List03").selectedIndex= dadosOBJ.d06;  
        convasSizeAlterar= dadosOBJ.d07;
        radioOpcoes = dadosOBJ.d08;
    }
    else{
        s1("#et03").value = 20;
        s1("#et02").value = 25;
        s1("#et01").value = 50;
        s1("#List01").selectedIndex=0;  
        s1("#List02").selectedIndex=0;   
        s1("#List03").selectedIndex=1;  
        convasSizeAlterar=true;
        radioOpcoes = 0;
    }
}////////:::::::::::::::::::::::::

/////// SALVAR  DINAMICAMENTE OS DADOS
function SalvarDadosD13(){
    const dadosD13 = {
        d01: s1("#et03").value,
        d02: s1("#et02").value,
        d03: s1("#et01").value,
        d04: s1("#List01").selectedIndex,
        d05: s1("#List02").selectedIndex,
        d06: s1("#List03").selectedIndex,
        d07: convasSizeAlterar= convasSizeAlterar,
        d08: radioOpcoes = radioOpcoes,
        }; localStorage.setItem('D13DadosSave', JSON.stringify(dadosD13));
};
/////////:::::::::::::::::::::;
   
function radioBtnExecutar( radioOpcoes){
D13_rds=document.querySelectorAll('.radiobtnx');
D13_rds.forEach(element => {element.checked=false });
switch (radioOpcoes) {
    case 0: radioBtnConfig("flex", "none", false, 336); D13_rds[0].checked=true; break; ///// ALBUM CONFIG
    case 1: radioBtnConfig("none", "flex", true, 305);  D13_rds[1].checked=true; break; ///// FOTOBOOK CONFIG
    };
    s1("#List02").selectedIndex=0;
};

 async function radioBtnConfig(pr1, pr2, pr3, pr4){
    try {
        exibirImputsSize(pr1); s1("#ftbPrestes").style.display = pr2;
        s1("#List02").disabled=pr3;
        await dialog.resizeTo( 325, pr4);
    } catch (error) {alert(error) }
 };

function exibirImputsSize(method){
    aSize = document.querySelectorAll('.albunSize');
    aSize.forEach((itemSize, index )=> { itemSize.style.display =method })
};

//////////VALIDAR LISTA OPÇÃO
es1.on('#List01', 'change', function() { 
    if(s1("#List01").selectedIndex !=0){ s1("#List02").disabled=true;  s1("#List02").selectedIndex=0}  
    else{ s1("#List02").disabled=false;}
 });

async function criarDocConfigs(){
    try {
        resol = 250;
        paginas =parseFloat(s1("#et03").value.toString().replace(/,/g, ".")); 
        switch (radioOpcoes) {
            case 0:
                wDados=parseFloat(s1("#et01").value.toString().replace(/,/g, "."))+1;   
                hDados= parseFloat(s1("#et02").value.toString().replace(/,/g, "."))+1; 
                tamnhoFont= 75;
                convasSizeAlterar=true;
                dorsoSizeCM = paginas*2*0.06; ////VALOR EM CENTIMETRO
                break;
            case 1:
                try {
                    if(s1("#List01").selectedIndex !=0){convasSizeAlterar=true}
                    else{convasSizeAlterar=false;}
                    if(s1("#List03").selectedIndex==0){ sizeFBk= "20x15"}
                    else if(s1("#List03").selectedIndex==1){ sizeFBk= "21x15"}
                    else{sizeFBk = s1("#List03").value;}
                    wDados= Number(sizeFBk.split("x")[1])*2; 

                    if(sizeFBk.split("x")[0] ==20){ hDados = 20.3}
                    else if(sizeFBk.split("x")[0] ==20){ hDados = 20.3}
                    else if(sizeFBk.split("x")[0] ==21){ hDados = 21}
                    else if(sizeFBk.split("x")[0] ==25){ hDados = 30.4}
                    else if(sizeFBk.split("x")[0] ==30){ hDados = 30.4}
                    if(wDados>30){ tamnhoFont= 75;} else{ tamnhoFont= 40;}
                    dorsoSizeCM = paginas*2*0.06; ////VALOR EM CENTIMETRO
                } catch (error) {alert(error)}
              break;
        };
        dorsoSizePT = parseFloat(dorsoSizeCM)*72/2.54;  //// CONVERTER VALOR EM PONTOS
        dorsoMetade= parseFloat(dorsoSizeCM/2.54*resol)/2; ////METADE DORSO
        largura = wDados*72/2.54;
        ///// FONTE DOS TEXTOS
        
        await albumConfigs();
    } catch (error) {alert(error);}

};

//////// ALBUM CAPA ACABAMENTO CONFIG
async function albumConfigs(){
    try {
        switch (s1("#List01").selectedIndex) {
            case 0:
                /////// CAPA PADRÃO
                if(s1("#List02").selectedIndex==0){
                    opcao="Capa Padrão"; guiasCdorso=true;
                    await newDocument(opcao, largura+dorsoSizePT, hDados*72/2.54, dorsoSizePT, 170);
                }
                else{
                    /////// CAPA MAGNÉTICA
                    opcao="Capa Magnética"; guiasCdorso=false;
                    await newDocument(opcao, Number(largura/2)-269.3, hDados*72/2.54, dorsoSizePT, 170);
                };
                if(radioOpcoes==0){await exibirTodososDocs();}
             break;

            case 1:
                opcao="Luva";  guiasCdorso=true;
                if(radioOpcoes==0){
                     await newDocument(opcao, largura+dorsoSizePT+102, hDados*72/2.54+45, dorsoSizePT+46, 351);
                    }
                else{
                     dorsoMetade = dorsoMetade-17.15;
                     await newDocument(opcao, largura+dorsoSizePT+34.3, hDados*72/2.54+24.9, dorsoSizePT+34.3, 346);
                };
                await exibirTodososDocs();  
            break;

            case 2:
                opcao="Maleta - Tampa"; guiasCdorso=false;
                if(app.documents.length >= 1){
                    confiramar(`Essa operação requer o fechamento de todos os documentos existentes. Você deseja fechá-los e continuar?`);
                    es1.on('#confirm_btn2"', 'click', async()=> {
                    dlg.close('OK');  await fecarTodososDocs(); await maletaConfig();
                    })
                } else{maletaConfig()}
            break;
            default: break;
        };
        SalvarDadosD13();
    } catch (error) {alert(error); console.log(error)}
};


/////// MALETA CONFIG
async function maletaConfig(){
        await newDocument(opcao, parseFloat(largura/2)+57, hDados*72/2.54+43, dorsoSizePT, 425); 
        opcao="Maleta - Fundo"; 
        await newDocument(opcao, parseFloat(largura/2)+57, hDados*72/2.54+43, dorsoSizePT, 567); 
        await exibirTodososDocs()
};

async function newDocument(nome, largura, altura, dorsoSizePT, finalSize){
    try {
        await core.executeAsModal(async (executionContext) => {
            await app.batchPlay([
                {"_obj":"reset","_target":[{"_property":"colors","_ref":"color"}]},
                {"_obj":"make","documentID":408,"new":{"_obj":"document","artboard":false,"autoPromoteBackgroundLayer":false,"depth":8,"fill":{"_enum":"fill","_value":"white"},"guides":[],"height":{"_unit":"pixelsUnit","_value":altura},"mode":{"_class":"RGBColorMode"},"name":nome,"pixelScaleFactor":1.0,"profile":"sRGB IEC61966-2.1","resolution":{"_unit":"densityUnit","_value":250.0},"width":{"_unit":"pixelsUnit","_value":largura}}}, {"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}
            ]);

            ////////////SUSPERDE HISTÓRICO: OBS: NESSE CASO LOGO APÓS O DOCUMENTO SER ADICIONADO
            const hostControl = executionContext.hostControl
            const suspensionIDDuplication = await hostControl.suspendHistory({
                historyStateInfo: { name: opcao, target: [{ _ref: "document", _id: photoshop.app.activeDocument.id, }] }
            });

            /////////ADD GUIAS
            if(guiasCdorso==true){
               if(convasSizeAlterar==true){bordaGuia=0} else{bordaGuia=14.2}
               metodGuid = [
                {"_obj":"newGuideLayout","guideLayout":{"$GdCA":0,"$GdCB":255,"$GdCG":132,"$GdCR":74,"_obj":"guideLayout","colCount":2,"colGutter":{"_unit":"distanceUnit","_value":dorsoSizePT},"marginBottom":{"_unit":"distanceUnit","_value":bordaGuia},"marginLeft":{"_unit":"distanceUnit","_value":bordaGuia},"marginRight":{"_unit":"distanceUnit","_value":bordaGuia},"marginTop":{"_unit":"distanceUnit",
                "_value":bordaGuia}},"guideTarget":{"_enum":"guideTarget","_value":"guideTargetCanvas"},"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}}
               ];
            }
            else{
                metodGuid = [ {"_obj":"newGuideLayout","guideLayout":{"$GdCA":0,"$GdCB":255,"$GdCG":132,"$GdCR":74,"_obj":"guideLayout","marginBottom":{"_unit":"distanceUnit","_value":0.0},"marginLeft":{"_unit":"distanceUnit","_value":0.0},"marginRight":{"_unit":"distanceUnit","_value":0.0},"marginTop":{"_unit":"distanceUnit","_value":0.0}},"guideTarget":{"_enum":"guideTarget","_value":"guideTargetCanvas"},"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}}]
             }
             if(s1("#D13Guias").checked==true){ await app.batchPlay(metodGuid );}
            /////////////::::::::::::::::::

           await docSizeObter();
           ////////// CONFIGS DA LISTA TIPO DE CAPA
           if(s1("#List02").selectedIndex ==0){
                if(opcao==="Capa Padrão"){
                    ctrCapa="Contra Capa (VERSO)";
                    frtCapa="Frontal Capa (FRENTE)";
                    await adicionarColorArea(0,0,  parseFloat(gethDOC), parseFloat(getwDOC));
                    await solidColorCamada(195,208,213);
                    await adicionarColorArea(0, parseFloat(getwDOC)/2-dorsoMetade,  parseFloat(gethDOC), parseFloat(getwDOC/2)+dorsoMetade);////////SELECIONA A ÁREA DO DORSO
                    await solidColorCamada(163,180,186);
                    await app.activeDocument.createTextLayer({ name: "datos", contents: `${opcao} - Dorso`, fontSize: tamnhoFont, position: {x: 0, y: 0}, fontName: "Arial"});
                    await app.activeDocument.activeLayers[0].rotate(90);
                    await adicionarColorArea(0,0,  parseFloat(gethDOC), parseFloat(getwDOC));
                    await alignCamada(4, false); await alignCamada(5, true); 
                    await app.activeDocument.createTextLayer({ name: "datos", contents: ctrCapa, fontSize: tamnhoFont, position: {x: 0, y: 0}, fontName: "Arial"});
                    await adicionarColorArea(0,0,  parseFloat(gethDOC), parseFloat(getwDOC)/2-dorsoMetade);
                    await alignCamada(4, false); await alignCamada(5, true); 
                    await app.activeDocument.createTextLayer({ name: "datos", contents: frtCapa, fontSize: tamnhoFont, position: {x: 0, y: 0}, fontName: "Arial"});
                    await app.activeDocument.rotate(180)
                    await adicionarColorArea(0,0,  parseFloat(gethDOC), parseFloat(getwDOC)/2-dorsoMetade);
                    await alignCamada(4, false); await alignCamada(5, true); 
                    await app.activeDocument.rotate(180)
            }
                else if(opcao==="Luva"){
                    ctrCapa= "Luva - Parte Frontal (FRENTE)";
                    frtCapa="Luva - Parte Traseira (VERSO)";
                    await adicionarColorArea(0,0,  parseFloat(gethDOC), parseFloat(getwDOC));
                    await solidColorCamada(195,208,213);
                    await adicionarColorArea(0, parseFloat(getwDOC)/2-dorsoMetade-80,  parseFloat(gethDOC), parseFloat(getwDOC/2)+dorsoMetade+80);////////SELECIONA A ÁREA DO DORSO
                    await solidColorCamada(163,180,186);
                    await app.activeDocument.createTextLayer({ name: "datos", contents: `${opcao} - Dorso (OBS! Texto opcional)`, fontSize: tamnhoFont, position: {x: 0, y: 0}, fontName: "Arial"});
                    await app.activeDocument.activeLayers[0].rotate(90);
                    await adicionarColorArea(0,0,  parseFloat(gethDOC), parseFloat(getwDOC));
                    await alignCamada(4, false); await alignCamada(5, true); 
                    await app.activeDocument.createTextLayer({ name: "datos", contents: ctrCapa, fontSize: tamnhoFont, position: {x: 0, y: 0}, fontName: "Arial"});
                    await adicionarColorArea(0,0,  parseFloat(gethDOC), parseFloat(getwDOC)/2-dorsoMetade);
                    await alignCamada(4, false); await alignCamada(5, true); 
                    await app.activeDocument.createTextLayer({ name: "datos", contents: frtCapa, fontSize: tamnhoFont, position: {x: 0, y: 0}, fontName: "Arial"});
                    await app.activeDocument.rotate(180)
                    await adicionarColorArea(0,0,  parseFloat(gethDOC), parseFloat(getwDOC)/2-dorsoMetade);
                    await alignCamada(4, false); await alignCamada(5, true); 
                    await app.activeDocument.rotate(180)
                 }
                else{
                    await adicionarColorArea(0,0,  parseFloat(gethDOC), parseFloat(getwDOC));
                    await solidColorCamada(195,208,213); 
                    await app.activeDocument.createTextLayer({ name: "datos", contents: opcao, fontSize: tamnhoFont, position: {x: 0, y: 0}, fontName: "Arial"});
                    await adicionarColorArea(0,0,  parseFloat(gethDOC), parseFloat(getwDOC));
                    await alignCamada(4, false); await alignCamada(5, true); 
                };
           }
           else{ 
                await adicionarColorArea(0,0,  parseFloat(gethDOC), parseFloat(getwDOC));
                await solidColorCamada(195,208,213);  tamnhoFont= 60
                await app.activeDocument.createTextLayer({ name: "datos", contents: opcao, fontSize: tamnhoFont, position: {x: 0, y: 0}, fontName: "Arial"});
                await adicionarColorArea(0,0,  parseFloat(gethDOC), parseFloat(getwDOC));
                await alignCamada(4, false); await alignCamada(5, true); 
           };
            
           if (convasSizeAlterar==true) {
                await app.batchPlay([
                    {"_obj":"canvasSize","height":{"_unit":"distanceUnit","_value":finalSize},"horizontal":{"_enum":"horizontalLocation","_value":"center"},"relative":true,"vertical":{"_enum":"verticalLocation","_value":"center"},"width":{"_unit":"distanceUnit","_value":finalSize}},{"_obj":"flattenImage"}
                ]);
           };

            await app.batchPlay([
                   {"_obj":"make","_target":[{"_ref":"contentLayer"}],"using":{"_obj":"contentLayer","type":{"_obj":"patternLayer","pattern":{"ID":"9da54c4f-af67-1174-97eb-edbf1214dab4","_obj":"pattern","name":"NKS5_GraphPaper"},"scale":{"_unit":"percentUnit","_value":319.0}}}},
                   {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","mode":{"_enum":"blendMode","_value":"multiply"}}},
                   {"_obj":"flattenImage"}
            ]);
            await document.querySelector('#processServic').close('OK');

        },{"interactive": true});
    } catch (error) {alert(error); console.log(error)}
}



async function adicionarColorArea(top,left,bottom,right){
    await app.batchPlay([
        {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":bottom},"left":{"_unit":"pixelsUnit","_value":left},"right":{"_unit":"pixelsUnit","_value":right},"top":{"_unit":"pixelsUnit","_value":top}}}
    ]);
}

function docSizeObter(){
    gethDOC = app.activeDocument.height;
    getwDOC = app.activeDocument.width;
}


function processConfigs(){
    dialog.close(); 
    progressDLG("Aquarde Processing . . ."); 
    function evento() { setTimeout(() =>criarDocConfigs());} setTimeout(evento, 500);
}


/////XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//////////////////////////////////////////////////////
////////METODOS JS AQUI ///////////////////////
function focarJanela() {
    try {
        function focar() { document.querySelector("#D13focus").focus(), 16 }
        setTimeout(focar, 150);
    } catch (error) { alert(error) }
};


function inputNumber(vcont, eid) {
    if (s1(eid).value == 1) { s1(eid).value = 2 }
    cont = vcont; s1(eid).value = parseFloat(s1(eid).value) + cont;
};

//////// NAVEGAÇÃO ENTRE INTENS DE LISTA

function alternarLista(method, lista) {
    let newIndex = s1(lista).selectedIndex + method;
    if (newIndex >= 0 && newIndex < s1(lista).options.length) {
        s1(lista).selectedIndex = newIndex;
    };
};


radioBtnExecutar( radioOpcoes)

/////////////////////////////////////////////////////////////
//////////////// ATALHOS CONFIGS  XXXXXXXXXXXXX
function configsAtalhoD13() {
    dialog.addEventListener("close", () => {
        document.removeEventListener('keydown', capaAlbunsKey);
    });
    document.addEventListener('keydown', capaAlbunsKey);

    let currentIndex = 1;
    async function capaAlbunsKey(event) {
        if (event.keyCode === 13) {processConfigs()}
        else if (event.keyCode === 112) {
            var elements = document.querySelectorAll(".edittxt");
            var currentElement = elements[currentIndex];
            if (currentElement) {
                elements.forEach((element) => { element.classList.remove("bgInput"); });
                elements[currentIndex].classList.add("bgInput")
                currentIndex = (currentIndex + 1) % elements.length;
            }
        }
        ////////// ADD VALOR POSITIVO
        else if (event.keyCode === 39) {
            if (currentIndex === 1) { inputNumber(1, "#et01"); }
            else if (currentIndex === 2) { inputNumber(1, "#et02"); }
            else if (currentIndex === 0) { inputNumber(1, "#et03"); }
        }
        ////////// ADD VALOR NEGATIVO
        else if (event.keyCode === 37) {
            if (currentIndex === 1) { inputNumber(-1, "#et01"); }
            else if (currentIndex === 2) { inputNumber(-1, "#et02"); }
            else if (currentIndex === 0) { inputNumber(-1, "#et03"); }
        }
        // ////////// ALTENAR LISTA +
        else if (event.keyCode === 38) {
            if (currentIndex === 1) { alternarLista(-1, "#List01") }
            else if (currentIndex === 2) { alternarLista(-1, "#List02") }
        }
        ////////// ALTENAR LISTA -
        else if (event.keyCode === 40) {
            if (currentIndex === 1) { alternarLista(+1, "#List01") }
            else if (currentIndex === 2) { alternarLista(+1, "#List02") }
        }
        ////////// BT RADIO OPÇÃO ALBUM
        else if (event.keyCode === 65) {
             if(radioOpcoes==0){radioOpcoes=1} else{radioOpcoes=0}
             radioBtnExecutar(radioOpcoes); focarJanela(); 
           }
    };
}


//////////RENOEIAR ARQUIVOS DE UM DIRETÓRIO
async function renamePaginas(caminho ){
    try {
        const aFolder = await fs.getEntryWithUrl(caminho);
        const listArquivos = await aFolder.getEntries();
        conteudoA = [];   //// NOMES ORIGINAIS
        conteudoB = [] ;  //// NOVOS NOMES
        conteudoC = [];   //// NÃO RENOMEAR

        for (const paginasDoc of listArquivos) {
            if (paginasDoc.isFile) {
                const nomeArquivo = paginasDoc.name;
                const paginasJPG = nomeArquivo.split(".")[1];
                ////// OBTEM SOMENTE AQUIVOS JPG e DESCARTA O ARQUIVO ATIVO "CAPA"
                if (!app.activeDocument.name.includes(nomeArquivo) &&paginasJPG=="jpg" ) { conteudoA.push(nomeArquivo);}
                if(paginasJPG !=="jpg"){ conteudoC.push(nomeArquivo)}
            }
        };

         // ATUALIZA O ARRAY COM A ORDEM CRESCENTE
        conteudoA.sort(ordemNumerica);
        let cont = 1;
        for (let i = 0; i < conteudoA.length; i++) {
            const arquivo = conteudoA[i];
            /////////////////////////////
            const listaNomes = await aFolder.getEntry(arquivo);
            const decimal = `${cont}`.padStart( 3, "0"); // ADICIONA O Nº DE CASAS 
             await aFolder.renameEntry( listaNomes, `PAG_${decimal}.jpg`, {overwrite: true});
            conteudoB.push(`PAG_${decimal}.jpg`)
            cont++;
        }
    } catch (err) {alert(err)}
};
////////////////////xxxxxxxxxxxxxxxxxx