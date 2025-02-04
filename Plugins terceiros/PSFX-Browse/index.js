const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const fs = require("uxp").storage.localFileSystem;
const alert = app.showAlert;


document.getElementById('btn1').addEventListener('click', async () => {
    fachar = document.getElementById("fechar")
    await core.executeAsModal(async () => {
        if(app.activeDocument == null){app.showAlert("Não existe nenhum documento aberto para salvar!")}
        else{ 
            if(fachar.checked){ await app.batchPlay([{"_obj":"close","forceNotify":false,"saving":{"_enum":"yesNo","_value":"yes"}}],{})} 
            else {await app.batchPlay([{"_obj":"save"}],{}) };
          }
      })
  })


const btnsLista = document.getElementById('container');

function carregarItens(){
    core.executeAsModal( async() => {
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
          await app.batchPlay([{"_obj":"select","_target":[{"_name":preset,"_ref":"toolPreset"}]}], { synchronousExecution: false, });  
          await app.batchPlay( [{"_obj":"select","_target":[{"_ref":"cropTool"}]}], { synchronousExecution: false, });
        })
        document.querySelector('#dlgPresets').close('OK');
       } catch (err) {alert(err)}
   }
}

////////FECHAR DIALOGO PRESETS///
document.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {  document.querySelector('#dlgPresets').close('OK');}
  });
document.querySelector("#btnClose").addEventListener("click", async () => {
  document.querySelector('#dlgPresets').close('OK');
  });

//////////////////////////////
document.querySelector("#btn2").addEventListener("click", async () => {
      btnsLista.innerHTML = "";
      carregarItens();
      document.querySelector("#dlgPresets").show({ title: "Crop Pressets!", resize: "both", size: { width:180, height: 200 } })
      setTimeout(() => document.querySelector("#et1").focus(), 16);
});



document.getElementById('btn3').addEventListener('click', async () => {
  await core.executeAsModal(async () => {
    document.querySelector("#dlg").show({ title: "Acesso a conteúdo web!", resize: "both", size: { width: 260, height: 60 } })
     paginasID("https://www.cutout.pro/photo-enhancer-sharpener-upscaler/upload");
  })
})


document.getElementById('btnSite1').addEventListener('click', async () => {
   paginasID("https://www.cutout.pro/photo-enhancer-sharpener-upscaler/upload")
})

document.getElementById('btnSite2').addEventListener('click', async () => {
    paginasID("https://www.cutout.pro/remove-background")
 })

 document.getElementById('btnSite3').addEventListener('click', async () => {
  paginasID("https://www.cleanpng.com/free/holi.html")
})

document.getElementById('btnSite4').addEventListener('click', async () => {
    paginasID("https://www.pexels.com/pt-br/")
})

document.getElementById('btnSite5').addEventListener('click', async () => {
     busca = document.getElementById("busca").value;
     paginasID("https://" + busca)
})

document.getElementById('btnSite6').addEventListener('click', async () => {

  paginasID("https://www.flickr.com/cameraroll")
})

document.getElementById('btnSite7').addEventListener('click', async () => {
  paginasID("https://chat.openai.com/chat")
})

async function paginasID(site){
  document.getElementById("sites").setAttribute("src", site); 
  await core.executeAsModal(async () => {
      try {
      //  await exexutarJSXfile("jsx/dellFiles.jsx");
      } 
      catch (err) { alert(err)}
   })
}



//   ////////// EXECUTAR SCRIPTS JSX
//   document.getElementById('btn2').addEventListener('click', async () => {
//     await core.executeAsModal(async () => {
//         var jsxArquivos = "jsx/script1.jsx" 
//         await exexutarJSXfile(jsxArquivos)                         
//     })
// })

// async function exexutarJSXfile(jsxFile) {  
//       var pluginFolder = await fs.getPluginFolder()
//       try {var filetoken = await fs.createSessionToken(await pluginFolder.getEntry(jsxFile));}
//       catch (e) { app.showAlert("Script não localizado!");}
//       await app.batchPlay([{ "_obj": "AdobeScriptAutomation Scripts","javaScript": {"_path": filetoken,"_kind": "local"},"javaScriptMessage": "JSM","_isCommand": true,"_options": {"dialogOptions": "dontDisplay"}}], {});
// }
// ////=====



// async function actionCommands() {
//   let command;
//   let result;
//   let psAction = require("photoshop").action;

//   // Select brush
//   command = {"_obj":"select","_target":[{"_ref":"paintbrushTool"}]};
//   result = await psAction.batchPlay([command], {});
// }

// async function runModalFunction() {
//   await require("photoshop").core.executeAsModal(actionCommands, {"commandName": "Action Commands"});
// }

// await runModalFunction();
