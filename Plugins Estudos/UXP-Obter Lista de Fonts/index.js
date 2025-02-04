const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const fs = require('uxp').storage.localFileSystem;
const alert = app.showAlert;

document.querySelector("#result").addEventListener("click", () => {
   document.querySelector('.lista').style.display ="flex"
});

const btns = document.getElementById('container');
const result = document.getElementById('result');

core.executeAsModal( async() => {
        // ///// OBTEM SOMENTE FONTE DA PASTA ADOBE EM COMUN FILES
        // await core.executeAsModal( async () => {
        //       getFiles = [];
        //      // const path = "E:/•Library"
        //       const path = "C:/Program Files/Common Files/Adobe/Fonts";
        //       const entry = await fs.getEntryWithUrl(`file:${path}`); 
        //       const theFolder = entry;
        //       const mainEntries = await theFolder.getEntries();
        //       for (let mainEntry of mainEntries) {if (mainEntry.isFile) {getFiles.push(mainEntry.name.match(/(.*)\.[^\.]+$/)[1]);}}
        //       for (var i = 0; i < getFiles.length; i++) { btns.insertAdjacentHTML("beforeend", `<div id="bg" class="btns item" value="${getFiles[i]}" >${getFiles[i]}</div>`)};
        //   })
    /// OBTEM TODAS AS FONTES DO SITEMA
    const result2 = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'fontList' }, { _ref: "application", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
    const textBtns = result2[0].fontList.fontName;
    
    btns.innerHTML = textBtns.map(btn =>{ return `<div id="bg" class="btns item" value="${btn}" >${btn}</div>`}).join('');
    result.innerHTML = textBtns[115]
})



btns.addEventListener('click', envetList);

function envetList(e) {
    if (e.target.matches('.item')) {
        result.innerHTML = e.target.getAttribute("value");
        const btnBG = btns.querySelectorAll('#bg');
        btnBG.forEach(button => button.classList.remove('clicado'));
        e.target.classList.add('clicado');
        document.querySelector('.lista').style.display ="flex";
        alert(e.target.getAttribute("value"))
        nameFonts(e.target.getAttribute("value"))
    }
}


// const btns = document.getElementById("container");
// const textBtn = [ "Item 1", "Item 2",  "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8", "Item 9", "Item 10"]
// for(i=0; i <textBtn.length;i++){
//     btns.insertAdjacentHTML('beforeend', `<sp-action-button size="s" value="${textBtn[i]}" class="btns" >${textBtn[i]}</sp-action-button>`);
//      if(textBtn.length<5){ btns.style.overflow ="none"; btns.style.height="100%" };
// }

// const btn = document.querySelectorAll(".btns")
//     for (var i = 0; i < btn.length; i++) {
//         btn[i].addEventListener('click', function (event) {
//         document.getElementById("result").innerHTML = event.target.getAttribute("value");      
//     });
// }
