const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const fs = require("uxp").storage.localFileSystem;
const alert = app.showAlert;

const wDoc=document.querySelector("#sizeL");
const hDoc=document.querySelector("#sizeA");
const rDoc=document.querySelector("#resol");

try {
  document.getElementById('btn1').addEventListener('click', async () => {
      fachar = document.getElementById("fechar")
      await core.executeAsModal(async () => { await salvarDocumento()})
    })
  
    async function salvarDocumento(){
        if(app.activeDocument == null){app.showAlert("Não existe nenhum documento aberto para salvar!")}
           else{ if(fachar.checked){ await app.batchPlay([{"_obj":"close","forceNotify":false,"saving":{"_enum":"yesNo","_value":"yes"}}],{})} 
           else {await app.batchPlay([{"_obj":"save"}],{}) };
          }
    }
  //////// =========
  const btnsLista = document.getElementById('container');
  
  function carregarItens(){
      core.executeAsModal( async() => {
            await app.batchPlay( [{"_obj":"select","_target":[{"_ref":"moveTool"}]}], { synchronousExecution: false, });
            document.querySelector("#et1").addEventListener('input', async () => {
                textBusca =  document.querySelector("#et1").value
                await filtrarItensLista(textBusca); 
            })
            const descritor = ["presetManager", "application"] 
            const result = await app.batchPlay([{_obj: 'get', _target: [{ _property: descritor[0] }, { _ref: descritor[1], _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
            const textBtns = result[0].presetManager[7].name;
            btnsLista.innerHTML = textBtns.map(btn =>{ return `<div id="bg" class="btns item" value="${btn}" >${btn}</div>`}).join('');
            const presets = textBtns;
  
            function filtrarItensLista(busca){
              const presetsFilter = presets.filter(pessoa => pessoa.startsWith(busca));
              btnsLista.innerHTML =""; 
              for (var i = 0; i < presetsFilter.length; i++) {
              btnsLista.insertAdjacentHTML("beforeend", `<div id="bg" class="btns item" value="${presetsFilter[i]}" >${presetsFilter[i]}</div>`);   
            }
          }
      })
      document.querySelector("#et1").value=""
  }
  
  btnsLista.addEventListener('click', envetList);
  
  async function envetList(e) {
     if (e.target.matches('.item')) {
         try {
          const btnBG = btnsLista.querySelectorAll('#bg');
          btnBG.forEach(button => button.classList.remove('clicado'));
          e.target.classList.add('clicado');
          preset = e.target.getAttribute("value"); 
          core.executeAsModal( async() => {
            await app.batchPlay( [{"_obj":"select","_target":[{"_ref":"cropTool"}]}], { synchronousExecution: false, });
            await app.batchPlay([{"_obj":"select","_target":[{"_name":preset,"_ref":"toolPreset"}]}], { synchronousExecution: false, });  
          })
          document.querySelector('#dlgPresets').close('OK');
         } catch (err) {alert(err)}
     }
  }
    ////////FECHAR DIALOGO PRESETS///
  document.addEventListener("keydown", function(event) {
      if (event.key == "Enter") {  document.querySelector('#dlgPresets').close('OK'); }
      if (event.key == "Enter") {salvarDocumento()}
    });
  

  document.querySelector("#btnClose").addEventListener("click", async () => {
    document.querySelector('#dlgPresets').close('OK');
    });
  
  //////////////////////////////
  document.querySelector("#btn2").addEventListener("click", async () => {
        btnsLista.innerHTML = "";
        carregarItens();
        document.querySelector("#dlgPresets").show({ title: "Crop Pressets!", resize: "both", size: { width:180, height: 200 } })
        //////// FOCA NA CAIXA DE TEXTO E HABILITA ATALHOS DO TECLADO
        function temporizador() { document.querySelector("#et1").focus(), 16 }
        setTimeout(temporizador, 100);
  });
  
  const site1 = "cutout.pro/photo-enhancer-sharpener-upscaler/upload";
  const site2 = "clipdrop.co/remove-background";
  const site3 = "translate.google.com.br"; //"cleanpng.com/free/holi.html";    
  const site4 = "pexels.com/pt-br/";
  const site6 = "clipdrop.co/uncrop";
  const site7 = "stylar.ai";    
  const site8 = "google.com.br";   
  
  document.getElementById('btn3').addEventListener('click', async () => {
    await core.executeAsModal(async () => {
      document.querySelector("#dlg").show({ title: "Acesso a conteúdo web!", resize: "both", size: { width:700, height: 60 } })
      paginasID(`https://www.${site1}`);
    })
  })
  
  document.getElementById('btnSite1').addEventListener('click', () =>{ paginasID(`https://www.${site1}`); expArquivos() });
  document.getElementById('btnSite2').addEventListener('click', () =>{ paginasID(`https://www.${site2}`); expArquivos() });
  document.getElementById('btnSite3').addEventListener('click', () =>{ paginasID(`https://${site3}`)});
  document.getElementById('btnSite4').addEventListener('click', () =>{ paginasID(`https://www.${site4}`)});
  document.getElementById('btnSite6').addEventListener('click', () =>{ paginasID(`https://www.${site6}`)});
  document.getElementById('btnSite7').addEventListener('click', () =>{ paginasID(`https://${site7}`)}); 
  document.getElementById('btnSite8').addEventListener('click', () =>{ paginasID(`https://www.${site8}`)}); 
  // document.getElementById('btnSite5').addEventListener('click', () =>{
  //      busca = document.getElementById("busca").value; paginasID(`https://${busca}`)
  // })
  
  async function paginasID(site){ document.getElementById("sites").setAttribute("src", site)};
    
  ///// RESEISE DOC
  //////=====
  document.getElementById('btn6').addEventListener('click', async () => {
    await core.executeAsModal(async () => {  await  resizeDocument() },{"interactive": true})
  });
  ///// OBTEM PROPRIESDADES 
  document.getElementById('btn5').addEventListener('click', async () => {
      setTimeout(() =>document.querySelector("#sizeL").focus(), 16);
      await core.executeAsModal(async () => {  await  dadosDocument() })
  })
  ///// OBTEM PROPRIESDADES 
  document.getElementById('btn7').addEventListener('click', async () => {
     setTimeout(() =>document.querySelector("#sizeL").focus(), 16);
     await core.executeAsModal(async () => {  await acessDocument(-1)})
  })
  ///// OBTEM PROPRIESDADES 
  document.getElementById('btn8').addEventListener('click', async () => {
      setTimeout(() =>document.querySelector("#sizeL").focus(), 16);
      await core.executeAsModal(async () => {  await acessDocument(1)})
  })
  
 function dadosDocument(){
     try {
        largura=app.activeDocument.width;
        altura=app.activeDocument.height;
        resol=app.activeDocument.resolution.toFixed(0);
        mode=app.activeDocument.mode;
        horizontal=largura*2.54/resol; vertical =altura*2.54/resol;
  
        if(mode == "RGBColorMode" ){btpixel=3; md =" - RGB"}
        else if(mode == "CMYKColorMode"){btpixel=4; md =" - CMYK"}
        else if(mode == "grayscaleMode"){btpixel=1; md =" - GrayScale"}
  
        megabytes=(largura*altura* btpixel) / (1024 * 1024);
        document.getElementById('mb-result').innerHTML=`Size: ${megabytes.toFixed(1) }M ${md}`;
  
        wDoc.value=horizontal.toFixed(1);
        hDoc.value=vertical.toFixed(1);
        rDoc.value=resol;
      } 
      catch (err) { alert("Nenhum documento encontrado!")}
  }
  /////////////////
  ////====
  document.getElementById('sizeL').addEventListener('input', funcSizeL);
  document.getElementById('sizeA').addEventListener('input', funcSizeA);
  document.getElementById('resol').addEventListener('input', dadosDocumentx);
  ////====
  
  async function funcSizeL(){
      try {
          LarguraB=wDoc.value.replace(",", ".");
          proporcao=LarguraB/largura; AlturaB=altura * proporcao;
          hDoc.value=AlturaB.toFixed(1); dadosDocumentx();
      } catch (err) {};
  }
  /////////////////
  ////====
  async function funcSizeA(){
      try {
          AlturaB=hDoc.value.replace(",", ".")
          proporcao=AlturaB/altura; LarguraB=largura * proporcao;
          wDoc.value=LarguraB.toFixed(1); dadosDocumentx()
      } catch (err) {};
  }
  
  /////////////////
  ////====
  function dadosDocumentx(){
    try {
          resol=Number(rDoc.value)
          largura=Number(wDoc.value.replace(",", "."))/2.54*resol
          altura= Number(hDoc.value.replace(",", "."))/2.54*resol
          console.log(largura); console.log(altura)
          megabytes=(largura*altura* Number(btpixel))/(1024 * 1024);
          document.querySelector('#mb-result').innerHTML=`Size: ${megabytes.toFixed(1).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}M`;
    } catch (err) {console.log(err) }
  }
  
  async function resizeDocument(){
      app.batchPlay([{"_obj":"imageSize","height":{"_unit":"pixelsUnit","_value": altura},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"resolution":{"_unit":"densityUnit","_value":resol},"width":{"_unit":"pixelsUnit","_value": largura}}], {});
      app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"fitOnScreen"}]}], {});
      app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"zoomOut"}]}], {});
  }
} catch (err) {alert(err)}


async function acessDocument(position){
      app.batchPlay([{"_obj":"select","_target":[{"_offset":position,"_ref":"document"}],"documentID":992,"forceNotify":true}], {});
      dadosDocument()
}


///// CARREGAR  SELEÇÃO (CANAL ALPHA)
async function expArquivos() {
      const file = await fs.getFileForOpening();
      if (file) { await app.open(file); } else {return;
      }
}


//////// DETECTA EVENTOS DO PHTOSHOP
const listener = (e, d) => {
    myEvent = e; myData = d;
    if ((myEvent == "open") || (myEvent == "select") || (myEvent == "make") || (myEvent == "crop") || (myEvent == "rotateEventEnum") || (myEvent == "close") || (myEvent == "convertMode")) { 
        dadosDocumentGet() 
    }  
}

action.addNotificationListener([ 
    { event: "select"}, 
    { event: "open"}, 
    { event: "make"}, 
    { event: "move"}, 
    { event: "close"}, 
    { event: "delete"}, 
    { event: "show"}, 
    { event: "hide"},
    { event: "set"}, 
    { event: "crop"},
    { event: "rotateEventEnum"},
    { event: "convertMode"} 
], listener, this.managePanelState);

function  dadosDocumentGet() {
  core.executeAsModal( async () => { 
      if(app.documents.length==0){ 
          wDoc.value=""; hDoc.value=""; rDoc.value="";
          document.querySelector('#mb-result').innerHTML= "";
      }
      else{ await dadosDocument()}
    })
}





const onSelect = (_, descriptor) => {
  if(descriptor._target?.[0]._ref === "layer" && descriptor._target?.[0]._name === "Test Layer 1") {
     alert('A camada com o nome "Test Layer 1" foi selecionada')
  }
}
require("photoshop").action.addNotificationListener(['select'], onSelect);


