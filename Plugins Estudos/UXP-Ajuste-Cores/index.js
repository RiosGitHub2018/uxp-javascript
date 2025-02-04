const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;
const {abasConfgs} = require("./js/abas.js");
const {openModal, EventListeners, resetar, AjustConfig, loadAjustes, preveiwFX} = require("./js/AJColor.js");

document.querySelector("#btnAjuste").addEventListener("click", async () => openModal());
///// FUNÇÃO QUE AS TAGS DO HTML EXTERNO

