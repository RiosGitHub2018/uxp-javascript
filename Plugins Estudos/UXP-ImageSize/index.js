const action=require("photoshop").action;
const core=require("photoshop").core;
const app=window.require("photoshop").app;
const fs=require("uxp").storage.localFileSystem;
const alert=app.showAlert;

const wDoc=document.querySelector("#sizeL");
const hDoc=document.querySelector("#sizeA");
const rDoc=document.querySelector("#resol");

///// RESEISE DOC
//////=====
document.getElementById('btn2').addEventListener('click', async () => {
  await core.executeAsModal(async () => {  await  resizeDocument() })
});
///// OBTEM PROPRIESDADES 
//////=====
document.getElementById('btn1').addEventListener('click', async () => {
    await core.executeAsModal(async () => {  await  dadosDocument() })
    setTimeout(() => document.querySelector("#sizeL").focus(), 16);
  })

async function dadosDocument(){
    try {
      largura=app.activeDocument.width;
      altura=app.activeDocument.height;
      resol=app.activeDocument.resolution.toFixed(0);
      mode=app.activeDocument.mode;
      const horizontal=largura*2.54/resol
      const vertical =altura*2.54/resol

      if(mode == "RGBColorMode" ){btpixel=3}
      else if(mode == "CMYKColorMode"){btpixel=4}
      else if(mode == "grayscaleMode"){btpixel=1}

      megabytes=(largura*altura* btpixel) / (1024 * 1024);
      document.getElementById('mb-result').innerHTML=`Size: ${megabytes.toFixed(1) }M`;

      wDoc.value=horizontal.toFixed(1);
      hDoc.value=vertical.toFixed(1);
      rDoc.value=resol;
    } catch (err) {alert(err)}
}
/////////////////
////====
document.getElementById('sizeL').addEventListener('input', async () => {await  atalizarLargura() })

async function atalizarLargura(){
    try {
        LarguraB=wDoc.value.replace(",", ".");
        proporcao=LarguraB/largura;
        AlturaB=altura * proporcao;
        hDoc.value=AlturaB.toFixed(1);
         dadosDocumentx()
    } catch (err) {}
}
/////////////////
////====
document.getElementById('sizeA').addEventListener('input', async () => { atalizarAltura();})

async function atalizarAltura(){
    try {
        AlturaB=hDoc.value.replace(",", ".")
        proporcao=AlturaB/altura;
        LarguraB=largura * proporcao;
        wDoc.value=LarguraB.toFixed(1);
        await  dadosDocumentx()
    } catch (err) {}
}
/////////////////
////====

document.getElementById('resol').addEventListener('input', async () => {
    dadosDocumentx()
})

/////////////////
////====
function dadosDocumentx(){
  try {
        resol=Number(rDoc.value)
        largura=Number(wDoc.value.replace(",", "."))/2.54*resol
        altura= Number(hDoc.value.replace(",", "."))/2.54*resol
        console.log(largura); console.log(altura)
        megabytes=(largura*altura* Number(btpixel))/(1024 * 1024);
        document.querySelector('#mb-result').innerHTML=`Size: ${megabytes.toFixed(1).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') }M`;
  } catch (err) {console.log(err) }
}


async function resizeDocument(){
    app.batchPlay([{"_obj":"imageSize","height":{"_unit":"pixelsUnit","_value": altura},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"resolution":{"_unit":"densityUnit","_value":resol},"width":{"_unit":"pixelsUnit","_value": largura}}], {});
    app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"fitOnScreen"}]}], {});
    app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"zoomOut"}]}], {});
}
