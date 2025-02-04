const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const alert = app.showAlert;
const fs = require('uxp').storage.localFileSystem;
const shell=require("uxp").shell;


const radios = document.getElementsByClassName("radiobtn");
const radioBtn = Array.from(radios);
try {
    for(let i = 0; i < radioBtn.length; i++){ 
        radioBtn[i].addEventListener('click', (event) => {
            for(let i = 0; i < radioBtn.length; i++){ 
                index = radioBtn.indexOf(event.currentTarget); 
                radioBtn[i].checked=false; 
            }
            event.currentTarget.checked=true;
            tamanho = event.currentTarget.getAttribute('data-tm'); 
           // alert( `Index: ${index+1}\nTamanho: ${tamanho}`)
           document.getElementById("result").innerHTML=`Index: ${index+1}<br>Tamanho: ${tamanho}`
          /////////////////////
        })
    }
} catch (err) {alert(err)}


