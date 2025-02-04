const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;


document.querySelector("#btn_adn").addEventListener( "click", async evt => { 
	nomePreset = document.getElementById("textfield").value 
	document.getElementById("select").insertAdjacentHTML("beforeend", `<sp-menu-item>${nomePreset}</sp-menu-item>`); 
});

document.querySelector("#btn_rep").addEventListener( "click", async evt => { 
	//////?????
});