const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const fs = require('uxp').storage.localFileSystem;
const alert = app.showAlert;

const list_MD = document.getElementById("list_MD");
const txtBusca = document.querySelector("#busca-font")
getFiles = ["Arial", "Impact","-"];

//////////////////////////////////////////////////////////////////////////
 ///// OBTEM SOMENTE FONTE DA PASTA ADOBE EM COMUN FILES
core.executeAsModal( async() => {
    try {
        const path = "C:/Program Files/Common Files/Adobe/Fonts";
        const entry = await fs.getEntryWithUrl(`file:${path}`); 
        const theFolder = entry;
        const mainEntries = await theFolder.getEntries();
        for (let mainEntry of mainEntries) {if (mainEntry.isFile) {getFiles.push(mainEntry.name.match(/(.*)\.[^\.]+$/)[1]);}}
        for (var i = 0; i < getFiles.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<option>${getFiles[i]}</option>`)};
        
        ///SISTEMA DE BUSCA DA FOTNTE
        txtBusca.addEventListener('input', async () => { await buscaFontes(txtBusca.value)})  
        async  function  buscaFontes(busca){
            const fontesBusca = getFiles.filter( fontes=> fontes.startsWith(busca));
            list_MD.innerHTML =""; 
            for (var i = 0; i < fontesBusca.length; i++) {list_MD.insertAdjacentHTML("beforeend", `<option>${fontesBusca[i]}</option>`)};
        }
    } catch (err) {alert(err) }
})

///OBTEM E ADICIONA OS VALORES ATUALISADOS
core.executeAsModal( async () => {
    try {
        const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'textKey' }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
        document.querySelector("#ftSize" ).value = result[0].textKey.textStyleRange[0].textStyle.impliedFontSize._value.toFixed(0);
        document.querySelector("#ofsetH").value = result[0].textKey.textStyleRange[0].textStyle.tracking;
        document.querySelector("#scalaH").value = result[0].textKey.textStyleRange[0].textStyle.horizontalScale.toFixed(0);
        document.querySelector("#scalaV").value = result[0].textKey.textStyleRange[0].textStyle.verticalScale.toFixed(0);
    
        const colorR = result[0].textKey.textStyleRange[0].textStyle.color.red;
        const colorG = result[0].textKey.textStyleRange[0].textStyle.color.grain;
        const colorB = result[0].textKey.textStyleRange[0].textStyle.color.blue;
        document.querySelector('#btnColor').style.backgroundColor = `rgb(${colorR} ${colorG} ${colorB})`
        ///OBTEM  O ALINHAMENTO DA CAMADA DE TEXTO
        const textAlihado = result[0].textKey.paragraphStyleRange[0].paragraphStyle.align._value;
        if(textAlihado == "left"){document.querySelector("#btnAlg01").classList.add('selecionado')}
        else if(textAlihado == "center"){document.querySelector("#btnAlg02").classList.add('selecionado')}
        else if(textAlihado == "right"){document.querySelector("#btnAlg03").classList.add('selecionado')}
        /// ALTERA COR DO BG DO BOTÃO CLICADO
        const btnsAlign = document.querySelectorAll(".btn-alinhar-txt");
        btnsAlign.forEach( function(btnClicado) {
            btnClicado.addEventListener('click', () => {
                btnsAlign.forEach( function(d){d.classList.remove('selecionado')});
                btnClicado.classList.add('selecionado');
            });
        });
        ////////// STATUS TYPE OPÇÕES
        const txtCaps = result[0].textKey.textStyleRange[0].textStyle.fontCaps._value;
        const txtBolds= result[0].textKey.textStyleRange[0].textStyle.syntheticBold;
        const txtSubli = result[0].textKey.textStyleRange[0].textStyle.underline._value;
        const txtItalic = result[0].textKey.textStyleRange[0].textStyle.syntheticItalic;
  
        if(txtCaps =="allCaps"){document.querySelector("#txBtn1").classList.add('selecionado');  txtBtn1Funcs()} 
        if(txtBolds ==true){ document.querySelector("#txBtn2").classList.add('selecionado');  txtBtn2Funcs()} 
        if(txtSubli == "underlineOnLeftInVertical"){ document.querySelector("#txBtn3").classList.add('selecionado');  txtBtn3Funcs()} 
        if(txtItalic == true){ document.querySelector("#txBtn4").classList.add('selecionado');  txtBtn4Funcs()} 
        //////==
    }catch (err){}
})

/// FONTE SIZE SLIDER
document.querySelector("#ftSize").addEventListener("change", evt => {
    core.executeAsModal( async () => {
        await app.batchPlay([{"_obj":"set","_target":[{"_property":"textStyle","_ref":"property"},{"_enum":"ordinal","_ref":"textLayer","_value":"targetEnum"}],"to":{"_obj":"textStyle","size":{"_unit":"pixelsUnit","_value":evt.target.value},"textOverrideFeatureName":808465458,"typeStyleOperationType":3}}], { synchronousExecution: false, });
    })
})
////=====

 //////////////////////////////////////////
//// EVENTO PARA AUTERAR A FONTE
document.querySelector("#list_MD").addEventListener("change", async evt => { nameFonts( list_MD.value) })

function nameFonts(name){
    core.executeAsModal( async () => {
        await app.batchPlay( [ { "_obj": "set", "_target": [{ "_property": "textStyle", "_ref": "property" }, { "_enum": "ordinal", "_ref": "textLayer", "_value": "targetEnum" }], "to": { "_obj": "textStyle", "alternateLigatures": false, "altligature": false, "autoKern": { "_enum": "autoKern", "_value": "metricsKern" }, "autoLeading": true, "baseline": { "_enum": "baseline", "_value": "normal" }, "baselineDirection": { "_enum": "baselineDirection", "_value": "withStream" }, "baselineShift": { "_unit": "pointsUnit", "_value": 0.0 }, "characterRotation": 0.0, "color": { "_obj": "RGBColor", "blue": 37.003892585635185, "grain": 37.003892585635185, "red": 255.0 }, "connectionForms": false, "contextualLigatures": false, "diacVPos": { "_enum": "diacVPos", "_value": "diacVPosOpenType" }, "diacXOffset": { "_unit": "pointsUnit", "_value": 0.0 }, "diacYOffset": { "_unit": "pointsUnit", "_value": 0.0 }, "digitSet": { "_enum": "digitSet", "_value": "defaultDigits" }, "dirOverride": { "_enum": "dirOverride", "_value": "dirOverrideDefault" }, "enableWariChu": false, "figureStyle": { "_enum": "figureStyle", "_value": "normal" }, "fill": true, "fillFirst": true, "fillOverPrint": false, "fontAvailable": true, "fontCaps": { "_enum": "fontCaps", "_value": "normal" }, "fontName": name, "fontPostScriptName": name, "fontScript": 0, "fontStyleName": "Regular", "fontTechnology": 1, "fractions": false, "gridAlignment": { "_enum": "gridAlignment", "_value": "roman" }, "horizontalScale": 100.0, "italics": false, "japaneseAlternate": { "_enum": "japaneseAlternate", "_value": "defaultForm" }, "jiDori": 0, "justificationAlternates": false, "kana": false, "kashidas": { "_enum": "kashidas", "_value": "kashidaDefault" }, "leftAki": -1.0, "ligature": true, "lineCap": { "_enum": "lineCap", "_value": "buttCap" }, "lineDashoffset": 0.0, "lineJoin": { "_enum": "lineJoin", "_value": "miterJoin" }, "lineWidth": { "_unit": "pointsUnit", "_value": 0.36003120387631254 }, "markYDistFromBaseline": { "_unit": "pointsUnit", "_value": 0.057415353448220616 }, "miterLimit": { "_unit": "pointsUnit", "_value": 1.4401248155052502 }, "mojiZume": 0.0, "noBreak": false, "oldStyle": false, "ordinals": false, "ornaments": false, "otbaseline": { "_enum": "otbaseline", "_value": "normal" }, "proportionalMetrics": false, "rightAki": -1.0, "ruby": false, "size": { "_unit": "pointsUnit", "_value": 31.99999267514641 }, "strikethrough": { "_enum": "strikethrough", "_value": "strikethroughOff" }, "stroke": false, "strokeOverPrint": false, "stylisticAlternates": false, "stylisticSets": 0, "swash": false, "syntheticBold": true, "syntheticItalic": false, "tcyLeftRight": 0, "tcyUpDown": 0, "textLanguage": { "_enum": "textLanguage", "_value": "standardPortugueseLanguage" }, "textOverrideFeatureName": 808465457, "titling": false, "tracking": 5, "typeStyleOperationType": 3, "underline": { "_enum": "underline", "_value": "underlineOff" }, "underlineOffset": { "_unit": "pointsUnit", "_value": 0.0 }, "verticalScale": 100.0, "wariChuCount": 2, "wariChuJustification": { "_enum": "wariChuJustification", "_value": "wariChuAutoJustify" }, "wariChuLineGap": 0, "wariChuOrphan": 2, "wariChuScale": 0.5, "wariChuWidow": 2 } } ], { synchronousExecution: false, });
    })
}

///// OBTER OS VALORES RGB DA CAMADA DE TEXTO
document.getElementById('btnColor').addEventListener('click', async () => {
    await core.executeAsModal( async() => {       
		const result = await app.batchPlay([{ _obj: "showColorPicker", _target: [{ _ref: "application" }]}],{ });
		const color = result[0].RGBFloatColor ?? null;
		color && (document.querySelector('#btnColor').style.backgroundColor = `rgb(${color.red} ${color.grain} ${color.blue})`)
        await app.batchPlay([{"_obj":"set","_target":[{"_property":"textStyle","_ref":"property"},{"_enum":"ordinal","_ref":"textLayer","_value":"targetEnum"}],"to":{"_obj":"textStyle","color":{"_obj":"RGBColor","blue":color.blue,"grain":color.grain,"red":color.red},"textOverrideFeatureName":808466226,"typeStyleOperationType":3}}],{ });
    })
})

document.getElementById("btnAlg01").addEventListener('click', async () => {
    await core.executeAsModal( async() => {alinharText(0)})
    })
document.getElementById("btnAlg02").addEventListener('click', async () => {
    await core.executeAsModal( async() => {alinharText(1)})
    })
document.getElementById("btnAlg03").addEventListener('click', async () => {
    await core.executeAsModal( async() => {alinharText(2)})
    })

////// ALINHAR O TENTO
async function alinharText(method){
    try {
        const alinhar= ["left", "center","right" ]
        await app.batchPlay([{"_obj":"set","_target":[{"_property":"paragraphStyle","_ref":"property"},{"_enum":"ordinal","_ref":"textLayer","_value":"targetEnum"}],"to":{"_obj":"paragraphStyle","align":{"_enum":"alignmentType","_value":alinhar[method]}}}],{ });
    } catch (err) {alert(err) }
}
/////====

/// SLIDER ESPAÇO LINHAS
document.querySelector("#ofsetV").addEventListener("change", evt => {
    core.executeAsModal( async () => {
        await app.batchPlay([{"_obj":"set","_target":[{"_property":"textStyle","_ref":"property"},{"_enum":"ordinal","_ref":"textLayer","_value":"targetEnum"}],"to":{"_obj":"textStyle","leading":{"_unit":"pointsUnit","_value":evt.target.value},"typeStyleOperationType":3}}], { synchronousExecution: false, });
    })
})
/// SLIDER ESPAÇO LETRAS
document.querySelector("#ofsetH").addEventListener("change", evt => {
    core.executeAsModal( async () => {
        await app.batchPlay([{"_obj":"set","_target":[{"_property":"textStyle","_ref":"property"},{"_enum":"ordinal","_ref":"textLayer","_value":"targetEnum"}],"to":{"_obj":"textStyle","tracking": evt.target.value}}], { synchronousExecution: false, });
    })
})
/// SLIDER SCALA HORIZONTAL
document.querySelector("#scalaH").addEventListener("change", evt => {
    core.executeAsModal( async () => {
        await app.batchPlay([{"_obj":"set","_target":[{"_property":"textStyle","_ref":"property"},{"_enum":"ordinal","_ref":"textLayer","_value":"targetEnum"}],"to":{"_obj":"textStyle","horizontalScale": evt.target.value}}], { synchronousExecution: false, });
    })
})
/// SLIDER SCALA VERTICAL
document.querySelector("#scalaV").addEventListener("change", evt => {
    core.executeAsModal( async () => {
        await app.batchPlay([{"_obj":"set","_target":[{"_property":"textStyle","_ref":"property"},{"_enum":"ordinal","_ref":"textLayer","_value":"targetEnum"}],"to":{"_obj":"textStyle","verticalScale": evt.target.value}}], { synchronousExecution: false, });
    })
})
   

//////// EVENTOS DE TEXTO
const txBtn1 = document.getElementById("txBtn1");
const txBtn2 = document.getElementById("txBtn2");
const txBtn3 = document.getElementById("txBtn3");
const txBtn4 = document.getElementById("txBtn4");

f1a = function() { txBtn1.style.backgroundColor = "#383838" };
f1b = function() { txBtn1.style.backgroundColor = "#535353"};
f2a = function() { txBtn2.style.backgroundColor = "#383838" };
f2b = function() { txBtn2.style.backgroundColor = "#535353"};
f3a = function() { txBtn3.style.backgroundColor = "#383838" };
f3b = function() { txBtn3.style.backgroundColor = "#535353"};
f3a = function() { txBtn3.style.backgroundColor = "#383838" };
f3b = function() { txBtn3.style.backgroundColor = "#535353"};
f4a = function() { txBtn4.style.backgroundColor = "#383838" };
f4b = function() { txBtn4.style.backgroundColor = "#535353"};

async function txtBtn1Funcs() {
    if (txBtn1.classList.contains("f1a")) {  f1b(); txBtn1.classList.remove("f1a"); txBtn1.classList.add("f1b"); await typeOpcoes(1, "A");}
    else { f1a();  txBtn1.classList.remove("f1b"); txBtn1.classList.add("f1a"); await  typeOpcoes(0,  "A")}
};

async  function txtBtn2Funcs() {
    if (txBtn2.classList.contains("f2a")) {  f2b(); txBtn2.classList.remove("f2a"); txBtn2.classList.add("f2b"); await typeOpcoes(2, "B")}
    else { f2a();  txBtn2.classList.remove("f2b"); txBtn2.classList.add("f2a"); await typeOpcoes(3, "B")}
};

async  function txtBtn3Funcs() {
    if (txBtn3.classList.contains("f3a")) {  f3b(); txBtn3.classList.remove("f3a"); txBtn3.classList.add("f3b"); await typeOpcoes(5, "C")}
    else { f3a();  txBtn3.classList.remove("f3b"); txBtn3.classList.add("f3a"); await typeOpcoes(4, "C")}
};

async function txtBtn4Funcs() {
    if (txBtn4.classList.contains("f4a")) {  f4b(); txBtn4.classList.remove("f4a"); txBtn4.classList.add("f4b"); await typeOpcoes(6, "D")}
    else { f4a();  txBtn4.classList.remove("f4b"); txBtn4.classList.add("f4a"); await typeOpcoes(7, "D")}
};

txBtn1.addEventListener("click", txtBtn1Funcs);
txBtn2.addEventListener("click", txtBtn2Funcs);
txBtn3.addEventListener("click", txtBtn3Funcs);
txBtn4.addEventListener("click", txtBtn4Funcs);

//txtBtn4Funcs() 
////////// FUNÇÕES TYPE OPÇÕES
async function typeOpcoes(m, metohod){
  try {
    core.executeAsModal( async () => {
      const type = ["allCaps", "normal", false, true, "underlineOnLeftInVertical", "underlineOff", false, true ];
      if(metohod=="A"){ await app.batchPlay([{"_obj":"set","_target":[{"_property":"textStyle","_ref":"property"},{"_enum":"ordinal","_ref":"textLayer","_value":"targetEnum"}],"to":{"_obj":"textStyle","fontCaps":{"_enum":"fontCaps","_value": type[m]}}}],{ });}
      else if(metohod=="B"){ await app.batchPlay([{"_obj":"set","_target":[{"_property":"textStyle","_ref":"property"},{"_enum":"ordinal","_ref":"textLayer","_value":"targetEnum"}],"to":{"_obj":"textStyle","syntheticBold": type[m]}}],{ });}
      else if(metohod=="C"){ await app.batchPlay([{"_obj":"set","_target":[{"_property":"textStyle","_ref":"property"},{"_enum":"ordinal","_ref":"textLayer","_value":"targetEnum"}],"to":{"_obj":"textStyle","underline":{"_enum":"underline","_value":type[m]}}}],{ });}
      else if(metohod=="D"){ await app.batchPlay([{"_obj":"set","_target":[{"_property":"textStyle","_ref":"property"},{"_enum":"ordinal","_ref":"textLayer","_value":"targetEnum"}],"to":{"_obj":"textStyle","syntheticItalic":type[m]}}],{ });}
    })
  } catch (error) {alert(error)}
}
///////////====

/// DESABILIA TODOS OS ELEMENTOS DA DIV
// var childNodes = document.getElementById("container").getElementsByTagName('*');
// for (var node of childNodes) {
//     node.disabled = true;
//     console.log(childNodes)
// }



