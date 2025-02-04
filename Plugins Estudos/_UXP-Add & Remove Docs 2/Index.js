const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;


funcaoPrincipal()
function funcaoPrincipal(){
       try {
            core.executeAsModal( async() => {

                   obterDocumentos();
                   criarListaDocumentos()

                  /////// VISUALISTA O DOCUMENTO CLICADO
                  document.getElementById("listaNomes").addEventListener("click", function(event) {
                      if (event.target.classList.contains("preview")) {
                          const nome= event.target.getAttribute('data-nome');
                          acessarDocumento(nome);
                      }
                  });
                  ///////////////::::::::::::::::::::::::::::

                  /////// REMOVENDO ITENS DA LISTA
                  document.getElementById("listaNomes").addEventListener("click", function(event) {
                    if (event.target.classList.contains("delete")) {
                          const index=  event.target.getAttribute('data-id')
                          const id = event.target.dataset.id;
                          const divParaRemover = document.getElementById("item" + id);
                          divParaRemover.parentNode.removeChild(divParaRemover);
                          acessarDoc.splice(index, 1);
                      }
                    });
                    ///////////////::::::::::::::::::::::::::::
  
                    /////// OBETR ALISTA DE DOCUEMNTOS EXISTENTES
                    document.getElementById("addDoc").addEventListener("click", function(){
                          const listaNomes = document.getElementById("listaNomes");
                          listaNomes.innerHTML = "";
                          obterDocumentos(); criarListaDocumentos();
                      });
                    ///////////////::::::::::::::::::::::::::::

                    /////// OBETR ALISTA DE DOCUEMNTOS EXISTENTES
                    document.getElementById("exibir").addEventListener("click", function(){
                          processarConfigs()
                    });
                    ///////////////::::::::::::::::::::::::::::
             
        });
      } catch (e) {alert(e) }
};


 
function tamanhoDocs(){
    resolucao= app.activeDocument.resolution;
    wsDoc = Number(app.activeDocument.width*2.54/resolucao).toFixed(1);
    hsDoc = Number(app.activeDocument.height*2.54/resolucao).toFixed(1);
    if(wsDoc > hsDoc){ tamanho=`Tamanho: ${hsDoc} x ${wsDoc}cm`}
    else{ tamanho=`Tamanho: ${wsDoc}  x ${hsDoc} cm`}
    document.getElementById("sizeDos").innerHTML= tamanho;
}

//// PERCORRE SOMENTE OS DOCUMENTOS OBTIDOS NA LISTA PELO ID
async function processarConfigs(){
    core.executeAsModal( async() => {
        for (var i=0;i<acessarDoc.length;i++){
            conteudo= acessarDoc[i]; 
            await app.batchPlay([{"_obj":"select","_target":[{"_name":conteudo,"_ref":"document"}]}], {});
            alert("Configurações  aqui")
        }
    })
};

//// PREVISUALIZA O DOCUMENTO AO PASSAR O MOUSE SOBRE O ITEM
async function acessarDocumento(conteudo){
    core.executeAsModal( async() => {
            await app.batchPlay([{"_obj":"select","_target":[{"_name":conteudo,"_ref":"document"}]}], {});
            tamanhoDocs()
    })
}


///////// FUNÇÕES AQUI    XXXXXXXXXXXXXXXXXXXXXXXXX
function  obterDocumentos(){
    acessarDoc=[];
    ImgConteudo = app.documents;
    for(i = 0; i < ImgConteudo.length; i++){ acessarDoc.push(ImgConteudo[i].name) }
}
              
/////// CRIAR ITENS COM OPÇOES DE REMOVER E VISUALIZAR 
function criarListaDocumentos(){
    for(i = 0; i < acessarDoc.length; i++){
    document.getElementById("listaNomes").insertAdjacentHTML("beforeend", `
            <div  id="item${i}"   class="task Itens"  style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                <label  style="font-size: 11px; color: #f7f7f7; margin: 2px;">${acessarDoc[i]}</label>
                <div style="display: flex;">
                      <div  class="preview btnIcons" data-nome="${acessarDoc[i]}" style="font-size: 11px;">i</div>
                      <div  class="delete btnIcons " data-id="${i}" >M</div>
                </div>
            </div>
        `
        );
    }
};
/////////////////xxxxxxxxxxxxxxxxxx
