const action = require("photoshop").action;
const core = require("photoshop").core;
const app = require("photoshop").app;
const alert = app.showAlert;
const doc = app.activeDocument;  


document.querySelector("#sld1").addEventListener("change", async (func) => {
 // await core.executeAsModal(async () => {
    document.querySelector("#vsld1").innerHTML = func.target.value
   // alert(func.target.value)
 // })
}) 
//
//alert(document.querySelector("#vsld1").value)