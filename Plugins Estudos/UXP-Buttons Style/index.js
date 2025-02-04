const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;




document.querySelector("#btnMedio_func1").addEventListener("click", async evt => {
	await core.executeAsModal( async() => {	app.showAlert("btnMedio_func1") })
 })