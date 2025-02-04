const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const alert = app.showAlert;

var doc = app.activeDocument;  
var currentStatus = doc.activeHistoryState;  

document.getElementById('btn').addEventListener('click', async () => {
     await core.executeAsModal(async () => { openModal()})
})

///// FUNÇÃO QUE AS TAGS DO HTML EXTERNO
async function openModal() {
        const dlg = document.querySelector("#dlg");
        fetch("pags/modal.html").then(function(respnse) {
        return respnse.text();}).then(function(externoHTML)
        {dlg.show({ title: "Dialog", resize: "both", size: { width: 260, height: 100}})
         dlg.innerHTML = externoHTML;
        ////// TODOS OS addEventListener AQUI!
        EventListeners();
        ////===
    })
}

function EventListeners(){
    document.getElementById('btn2').addEventListener('click', async () =>{
        await core.executeAsModal(async () => {myfunction()})
    }) ////===
    ////// SLIDER OPACIDADE
    document.querySelector("#opacity").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {opacidade(func.target.value);})
    }) ////===
    ////// SLIDER AJUST VERMELHO
    document.querySelector("#vermelho").addEventListener("change", async (func) => {
       await core.executeAsModal(async () => {ajustRed(func.target.value);})
    }) ////===
    ////// SLIDER AJUST VERMELHO
    document.querySelector("#sature").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {ajustSature(func.target.value);})
     }) ////===
    
}


function myfunction(){alert("Scripts aqui!")}

async function opacidade(valor){
    await app.batchPlay([{"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","opacity":{"_unit":"percentUnit","_value":valor}}}],{});
}

async function ajustRed(valor){
     doc.activeHistoryState = currentStatus;
     await app.batchPlay([{"_obj":"colorBalance","midtoneLevels":[valor,0,0]}],{});
}

async function ajustSature(valor){
    doc.activeHistoryState = currentStatus;
    await app.batchPlay([{"_obj":"hueSaturation","adjustment":[{"_obj":"hueSatAdjustmentV2","hue":0,"lightness":0,"saturation":Number(valor)}],"colorize":false,"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}}],{});
}

// //code by Timothy_Bennett
// const path = "modal.html";
// const externoHTML = await fetch(path).text();
// const dlg = document.querySelector("#dlg");
// dlg.innerHTML = externoHTML;
// console.log(externoHTML)

