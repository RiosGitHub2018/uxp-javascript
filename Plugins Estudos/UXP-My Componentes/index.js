const action = require("photoshop").action;
const core = require("photoshop").core;
const app = require("photoshop").app;
const alert = app.showAlert;
const doc = app.activeDocument;  

/////// BOTÕES DE RÁEDIO SETTINGS
const radios = document.getElementsByClassName("radio");
const radioBtn = Array.from(radios);
for(let i = 0; i < radioBtn.length; i++){ 
    radioBtn[i].addEventListener('click', (event) => {
    for(let i = 0; i < radioBtn.length; i++){radioBtn[i].classList.remove('rd-checado');}
        event.currentTarget.classList.add('rd-checado');
        document.querySelector("#textBtntadio").textContent= event.currentTarget.textContent;
    })
}

//////===
/////// CHECKBOX SETTINGS
const checkbox = document.getElementById("meuBotao");
var ckecked = false;

checkbox.addEventListener("click", function() {
    if (ckecked === false) {  checkbox.classList.add('cb-checado'); ckecked =true; } 
    else { checkbox.classList.remove('cb-checado'); ckecked = false; }
    document.querySelector("#textCheckbox").textContent=  `Checkbox =  ${ckecked}`;
});

//////===
/////// SISTEMA DE ABAS SETTINGS
// const conteudo = document.querySelectorAll(".tabConteudo");
// const radios = document.getElementsByClassName("radio");
// const radioBtn = Array.from(radios);


// for(let i = 0; i < radioBtn.length; i++){ 
//     radioBtn[i].addEventListener('click', (event) => {
//         for(let i = 0; i < radioBtn.length; i++)
//         { index = radioBtn.indexOf(event.currentTarget); radioBtn[i].classList.remove('rd-checado');}
//         event.currentTarget.classList.add('rd-checado');
//         //document.querySelector("#textBtntadio").textContent= event.currentTarget.textContent;
//         ////////////////////
//         for (let i = 0; i < conteudo.length; i++) {
//            conteudo[i].style.display="none"; conteudo[index].style.display =" block";
//           };
//     });
// };
//////===