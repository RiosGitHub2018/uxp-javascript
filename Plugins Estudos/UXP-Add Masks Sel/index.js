const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;
borderSize = 0; blue = 255; grain = 255; red = 255; contagem = 0;
maskmoldes = true;

///////// ENVETOS CONFIGURALÇAO DA BORDA
const close = document.querySelector(".frameConf");
document.querySelector("#c01").addEventListener("click",  evt => {
  core.executeAsModal( async() => { red = 255; grain =255; blue= 255; ColorBorder(borderSize, blue, grain, red); });
 // close.style.display = "none";
})

document.querySelector("#c02").addEventListener("click",  evt => {
  core.executeAsModal( async() => { red = 0; grain =0; blue= 0; ColorBorder(borderSize, blue, grain, red) });
  //close.style.display = "none";
})

document.querySelector("#c03").addEventListener("click",  evt => {
  core.executeAsModal( async() => { red = 88; grain =177;   blue= 255; ColorBorder(borderSize, blue, grain, red) });
  //close.style.display = "none";
})

document.querySelector("#c04").addEventListener("click",  evt => {
  core.executeAsModal( async() => { red = 245; grain =255;   blue= 107; ColorBorder(borderSize, blue, grain, red) });
  //close.style.display = "none";
})

document.querySelector("#c05").addEventListener("click",  evt => {
  core.executeAsModal( async() => { red = 255; grain =107;   blue= 107; ColorBorder(borderSize, blue, grain, red) });
  //close.style.display = "none";
})

document.querySelector("#border").addEventListener("change", async (func) => {
  await core.executeAsModal(async () => {  borderSize = func.target.value; ColorBorder(borderSize, blue, grain, red) });
}) 

document.querySelector("#r1").addEventListener("click",  evt => {
  core.executeAsModal( async() => {  await statusBorder(); document.querySelector(".frameConf").style.display = "block";
  })
})
/////=====


//////  FECHAR CONFIGURALÇAO DA BORDA
document.querySelector("#close").addEventListener("click",  evt => {
  core.executeAsModal( async() => { 
    document.querySelector(".frameConf").style.display = "none";
  })
})

//////  ADICIONAR MASCARAS/FRAMES
document.querySelector("#btn1").addEventListener("click",  evt => {
    core.executeAsModal( async() => { await  maskConfis() },{"interactive": true}/*REMOVE A JANELA DE PROGRESSO*/)
})

  //////  ADICIONAR IMAGENS NAS FRAMES
  document.querySelector("#btn2").addEventListener("click",  evt => {
     core.executeAsModal( async() => { await  obterCamadas()},{"interactive": true})  
})

//////  OBTER VALORES INICIAIS
async function statusBorder(){
    try {
      const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'AGMStrokeStyleInfo' }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false,});
      borderSize = result[0].AGMStrokeStyleInfo.strokeStyleLineWidth._value; document.querySelector("#border").value= borderSize;
      red   = result[0].AGMStrokeStyleInfo.strokeStyleContent.color.red;
      grain = result[0].AGMStrokeStyleInfo.strokeStyleContent.color.grain;
      blue  = result[0].AGMStrokeStyleInfo.strokeStyleContent.color.blue;
      /////// OBERT CORES
     } 
    catch (e) {}
}

///////////////////////////////////////////////
/// FUNÇÃO ADD MASCARAS NA SELEÇÃO
async function maskConfis(){
      /// OBTEM TODOS OS LIMITES DA SELEÇÃO:
      try {
        const coln = Number(document.querySelector("#txt1").value)
        const row = Number(document.querySelector("#txt2").value)
        const lineSize = Number(document.querySelector("#txt3").value)

        const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'selection' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
        const left   = result[0].selection.left._value;        //-->  Bounds[0]
        const right = result[0].selection.right._value;      //-->  Bounds[2]
        const top   = result[0].selection.top._value;        //-->  Bounds[1]
        const botn = result[0].selection.bottom._value;   //-->  Bounds[3]

        if(coln ==""){alert("Adicione a quntidade de Colunas!"); return}
        else if(row ==""){alert("Adicione a quntidade de Linhaa!"); return}
        else if(lineSize ==""){alert("Adicione o tamanho do espaçamento!"); return}

        const lineAdjW = lineSize/row;
        const lineAdjH = lineSize/coln;
        const sWidth  = (parseFloat(right)-parseFloat(left))/coln-lineSize+lineSize/(coln); 
        const sHeight = (parseFloat(botn)-parseFloat(top))/row-lineSize+lineSize/( row); 
        const leftSide = parseFloat (right); topSide = parseFloat (top);
   
        for(var i=0;i<row;i++){  
        let leftSide = parseFloat (left);  
          for(var j=0;j<coln;j++){  
              await  Create_Rectangle (topSide, leftSide, topSide + sHeight, leftSide + sWidth)
                leftSide += sWidth + lineSize}  
                topSide += sHeight  +lineSize;
                }

               async function Create_Rectangle(t,l,b,r) {  
                contagem = Number(contagem)+1 ;  
                await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":b},"left":{"_unit":"pixelsUnit","_value":l},"right":{"_unit":"pixelsUnit","_value":r},"top":{"_unit":"pixelsUnit","_value": t}}}], { synchronousExecution: false, });
                //// OPÇÃO: FRAMES PADÕES:
                if( maskmoldes == true){ 
                  await app.batchPlay( [{"_obj":"make","_target":[{"_ref":"framedGroupSection"}],"framedGroupRect":{"_obj":"classFloatRect","bottom":b,"left":l,"right":r,"top":t}}], { synchronousExecution: false, });
                }
                else{ await shapeToframe(b,l,r,t, shapeName); /*OPÇÃO: SHAPES TO FRAMES:*/};
                //app.activeDocument.activeLayers[0].name= "Frame " + contagem 
                /////////////////////
                await  ColorBorder(borderSize, blue, grain, red); ///// ADICIONAR BORDA
           }
         await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}], { synchronousExecution: false, });
      } 
      catch (err) {alert("Adicione uma seleção\n ao documento!")}
}

////////////////////////////////////////
/// FUNÇÃO ADD IMAGENS =====
async function obterCamadas(){
    try {
     /////////////////
      const targetFrames=[];
      const activeLayers = app.activeDocument.activeLayers;
 
      if(activeLayers.length == 0){ alert("Você não selecionou as camadas!"); return};
      activeLayers.forEach( camada  => camada.selected = false);
      
      activeLayers.forEach((camada, idx) => {camada.selected = true; targetFrames.push(activeLayers[idx].name);});
      activeLayers.forEach( camada  => camada.selected = true);
      for(var i = 0;i<targetFrames.length; i++){ 
            targetFrames[i];
            await app.batchPlay( [{"_obj":"select","_target":[{"_name":targetFrames[i],"_ref":"layer"}],"makeVisible":false}], {});
            await statusBorder();
            await ColorBorder(1000, 0, 0, 0);  ///// ADICIONAR BORDAawait  ColorBorder(1000); ///// ADICIONAR BORDA
            await importImagens();
         }
      activeLayers.forEach( camada  => camada.selected = true);
    } catch (e) {}
}

async function importImagens(){
      const fs = require('uxp').storage.localFileSystem;
      let entry = await fs.getFileForOpening();  
      let token = await fs.createSessionToken(entry); 
      await ColorBorder(borderSize, blue, grain, red)  ///// ADICIONAR BORDA
      //app.activeDocument.activeLayers[0].name=entry.name.match(/(.*)\.[^\.]+$/)[1];
      await app.batchPlay([
          {"_obj":"placeEvent","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"linked":true,"null":{"_kind":"local","_path":token},"offset":{"_obj":"offset","horizontal":{"_unit":"distanceUnit","_value":0.0},"vertical":{"_unit":"distanceUnit","_value":0.0}},"replaceLayer":{"_obj":"placeEvent","from":{"_ref":"layer"},"to":{"_ref":"layer"}}},
          {"descriptor": {"_obj":"transform","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"height":{"_unit":"percentUnit","_value":100},"offset":{"_obj":"offset","horizontal":{"_unit":"distanceUnit","_value":0},"vertical":{"_unit":"distanceUnit","_value":0}},"replaceLayer":{"_obj":"transform","from":{"_id":727,"_ref":"layer"},"to":{"_id":727,"_ref":"layer"}},"width":{"_unit":"percentUnit","_value":100}}, "options": {"dialogOptions": "display"}},
        ], { });
}

async function ColorBorder(borda, blue, grain, red  ) {
    let command = [
      {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"framedGroupSection","_value":"targetEnum"}],"to":{"_obj":"shapeStyle","fillContents":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":0.0,"grain":0.0,"red":0.0}},"strokeStyle":{"_obj":"strokeStyle","fillEnabled":true,"strokeEnabled":true,"strokeStyleLineAlignment":
      {"_enum":"strokeStyleLineAlignment","_value":"strokeStyleAlignInside"}, "strokeStyleLineWidth":{"_unit":"pixelsUnit","_value":borda}, "strokeStyleContent":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":blue,"grain":grain,"red":red}},"strokeStyleVersion":2}}}
    ];
    await app.batchPlay(command, {});
}

async function shapeToframe(b,l,r,t, shape) {
  let command =  [
      {"_obj":"set","_target":[{"_property":"workPath","_ref":"path"}],"to":{"_obj":"customShape","bottom":{"_unit":"pixelsUnit","_value":b},"keyOriginType":9,"left":{"_unit":"pixelsUnit","_value":l},"name": shape,"right":{"_unit":"pixelsUnit","_value":r},"top":{"_unit":"pixelsUnit","_value":t}}},
      {"_obj":"make","_target":[{"_ref":"contentLayer"}],"using":{"_obj":"contentLayer","type":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":255.0,"grain":255.0,"red":255.0}}}},
      {"LockPPI": false, "PreferredResolution": 300.0, "SavedIteratedName": "", "_obj": "make", "_target": [{ "_ref": "framedGroupSection" }], "framedGroupPath": { "_obj": "pathClass", "pathComponents": [{ "_obj": "pathComponent", "shapeOperation": { "_enum": "shapeOperation", "_value": "add" }, "subpathListKey": [{ "_obj": "subpathsList", "closedSubpath": true, "points": [{ "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value":0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }, { "_obj": "pathPoint", "anchor": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "backward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "forward": { "_obj": "paint", "horizontal": { "_unit": "pixelsUnit", "_value": 0 }, "vertical": { "_unit": "pixelsUnit", "_value": 0 } }, "smooth": false }] }] }] }, "framedGroupPathResolution": 300.0, "framedGroupRect": { "_obj": "classFloatRect", "bottom": 787.0, "left": 441.0, "right": 901.0, "top": 374.0 }, "framedGroupType": 4, "name": "Color Fill 1" }   
  ]
  await app.batchPlay(command, {});
}
////======

document.querySelector("#result").addEventListener("click", () => {
  document.querySelector('.lista').style.display ="flex"
  document.querySelector('#configBD').style.display ="none";
});

const btns = document.getElementById('container');
const result = document.getElementById('result');

core.executeAsModal( async() => {
   //const result2 = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'fontList' }, { _ref: "application", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
   const textBtns = ["Default", "Cantos-radius", "Elipse-Basica", "Retang-Sêlo", "Elipse-Sêlo", "Classic-Sêlo" ,"Coração"]; //result2[0].fontList.fontName;
   btns.innerHTML = textBtns.map(btn =>{ return `<div id="bg" class="btns item" value="${btn}" >${btn}</div>`}).join('');
  // result.innerHTML = textBtns[115]
})

btns.addEventListener('click', envetList);

function envetList(e) {
    if (e.target.matches('.item')) {
       selLista = e.target.getAttribute("value");
        result.innerHTML = selLista;
        const btnBG = btns.querySelectorAll('#bg');
        btnBG.forEach(button => button.classList.remove('clicado'));
        e.target.classList.add('clicado');
        document.querySelector('.lista').style.display ="none";
        document.querySelector('#configBD').style.display ="block";
        document.querySelector('#r1').innerHTML = `✅ ${selLista}`;
        custonShape();
    }
}

function custonShape(){
      if( selLista == "Default"){maskmoldes = true}else{ maskmoldes = false};
      if( selLista == "Cantos-radius"){ shapeName = "Pad_Mouse_Retang"}
      else  if(selLista == "Elipse-Sêlo"){ shapeName = "Selo_sombra"}
      else  if( selLista == "Retang-Sêlo"){ shapeName = "SeloBorda_MDiametre"}   
      else  if(selLista == "Classic-Sêlo"){ shapeName = "Classic_selo"}
      else  if( selLista == "Elipse-Basica"){ shapeName = "Redondo_Oval"}
      else  if(selLista == "Coração"){ shapeName = "Coaccao";}
}