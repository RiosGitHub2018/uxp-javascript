const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;

acessarDoc = []
listNomes = document.getElementById("listaNomes");

InserirItensex() ;removerItens()
document.getElementById("exibir").addEventListener("click", function(){
      processarConfigs()
})

document.getElementById("addDoc").addEventListener("click", function(){
    listNomes.innerHTML = "";
    InserirItensex(); removerItens(); 
});


function InserirItensex(){
        core.executeAsModal( async() => {
              acessarDoc=[];
              ImgConteudo = app.documents;
              for(i = 0; i < ImgConteudo.length; i++){
              //  app.documents[i];   
               // app.activeDocument = app.documents[i]
                acessarDoc.push({ nome: ImgConteudo[i].name, id: app.activeDocument._id } )
                listNomes.insertAdjacentHTML("beforeend", `<div class="Itens"> <div id="${acessarDoc[i].id}" class="btnIcons" >M</div><label  class="txtDoc">${acessarDoc[i].nome}</label></div>`);
            }
        });
};
       
////// REMOVE O ITEM SELECIONADO || ACESSAR O DOCUMENTO VIA LISTA
function removerItens(){
    core.executeAsModal( async() => {
        try {
            remover = document.getElementsByClassName("Itens");
            removeBtn = Array.from(remover);
            for(let i = 0; i < removeBtn.length; i++){ 
                ///////// PREVISUALIZA O DOCUMENTO AO PASSAR O MOUSE SOBRE O ITEM
                removeBtn[i].addEventListener('mouseover', (event) => {
                    const index = removeBtn.indexOf(event.currentTarget); 
                  //  acessarDocumento(acessarDoc[index ].id);
                    acessarDocumento(acessarDoc[index ].nome);
                    tamanhoDocs()
                 });
                 ////////XXXXXXXXXXXXXXXXXXXXXXX
                ///////// REMOVE O  ITEM DA LISTAR
                removeBtn[i].addEventListener('click', (event) => {
                    const index = removeBtn.indexOf(event.currentTarget); 
                    acessarDoc.splice(index, 1);
                    listNomes.innerHTML = "";
                    for (let i = 0; i < acessarDoc.length; i++){
                        listNomes.insertAdjacentHTML("beforeend", `<div class="Itens"> <div id="${acessarDoc[i].id}" class="btnIcons" >M</div><label  class="txtDoc">${acessarDoc[i].nome}</label></div>`);
                    }
                    removerItens()
                });
            }
        } catch (error) { alert(error); }
    });
};


//// PERCORRE SOMENTE OS DOCUMENTOS OBTIDOS NA LISTA PELO ID
async function processarConfigs(){
    core.executeAsModal( async() => {
        for (var i=0;i<acessarDoc.length;i++){
           // conteudo= acessarDoc[i].id
           //await app.batchPlay([{"_obj":"select","_target":[{"_id":conteudo,"_ref":"document"}]}], {});
            conteudo= acessarDoc[i].nome
            await app.batchPlay([{"_obj":"select","_target":[{"_name":conteudo,"_ref":"document"}]}], {});
            alert("Configurações  aqui")
        }
    })
};


//// PREVISUALIZA O DOCUMENTO AO PASSAR O MOUSE SOBRE O ITEM
async function acessarDocumento(conteudo){
    core.executeAsModal( async() => {
           //await app.batchPlay([{"_obj":"select","_target":[{"_id":conteudo,"_ref":"document"}]}], {});
            await app.batchPlay([{"_obj":"select","_target":[{"_name":conteudo,"_ref":"document"}]}], {});
    })
}
tamanhoDocs()
 
function tamanhoDocs(){
    resolucao= app.activeDocument.resolution;
    wsDoc = Number(app.activeDocument.width*2.54/resolucao).toFixed(1);
    hsDoc = Number(app.activeDocument.height*2.54/resolucao).toFixed(1);
    if(wsDoc > hsDoc){ tamanho=`Tamanho: ${hsDoc} x ${wsDoc}cm`}
    else{ tamanho=`Tamanho: ${wsDoc}  x ${hsDoc} cm`}
    document.getElementById("sizeDos").innerHTML= tamanho;
}








/////////////////CÓDIGO FUNCIONAL
// acessarDoc = []
// listNomes = document.getElementById("listaNomes");
// InserirItensex() ;
// removerItens()
// document.getElementById("exibir").addEventListener("click", function(){
//       processarConfigs()
// })

// document.getElementById("addDoc").addEventListener("click", function(){
//     listNomes.innerHTML = "";
//     InserirItensex();
//     removerItens(); // Configura novamente os ouvintes de eventos após adicionar novos itens
// });


// function InserirItensex(){
//         core.executeAsModal( async() => {
//               acessarDoc=[];
//               ImgConteudo = app.documents;
//               for(i = 0; i < ImgConteudo.length; i++){
//                 var doc = app.documents[i];   
//                 app.activeDocument = doc;  
//                 acessarDoc.push({ nome: ImgConteudo[i].name, id: app.activeDocument._id } )
//                 listNomes.insertAdjacentHTML("beforeend", `<div class="Itens"> <div id="${acessarDoc[i].id}" class="btnIcons" >M</div><label  class="txtDoc">${acessarDoc[i].nome}</label></div>`);
//             }
//         });
// }
       
// ////// REMOVE OUVINTES DE EVENTOS  EXISTENTE E ADICIONA NOVOS PARA CADA ITEM 
// function removerItens(){
//     core.executeAsModal( async() => {
//         remover = document.getElementsByClassName("Itens");
//         removeBtn = Array.from(remover);
//         removeBtn.forEach(item => {
//             item.removeEventListener('click', removerItem);
//         });
//         for(let i = 0; i < removeBtn.length; i++){ 
//             removeBtn[i].addEventListener('click', removerItem);
//         }
//     });
// }

// /////////REMOVER O ITEM CLICADO DA LISTA E ATUALIZAR A EXIBIÇÃO DA LISTA SEM ESSE ITEM
// function removerItem(event) {
//     listNomes.innerHTML="";
//     index = removeBtn.indexOf(event.currentTarget); 
//     acessarDoc.splice(index, 1); 
//     for (var i = 0; i < acessarDoc.length; i++) { 
//         listNomes.insertAdjacentHTML("beforeend", `<div class="Itens"> <div id="${acessarDoc[i].id}" class="btnIcons" >M</div><label  class="txtDoc">${acessarDoc[i].nome}</label></div>`);
//     }
//     removerItens();
// }



// //// OBTER CHECKS MARCADOS
// async function processarConfigs(){
//     try {
//         core.executeAsModal( async() => {
//             for (var i=0;i<acessarDoc.length;i++){
//                 conteudo= acessarDoc[i].id
//                 await app.batchPlay([{"_obj":"select","_target":[{"_id":conteudo,"_ref":"document"}]}], {});
//                 alert("Eventos aqui")
//             }
//         })
//     } 
//   catch (e) {alert(e)}
// }
      
