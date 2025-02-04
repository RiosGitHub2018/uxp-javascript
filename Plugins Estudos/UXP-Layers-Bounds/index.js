const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;

document.querySelector("#importIMG").addEventListener("click", async evt => {
	 await core.executeAsModal( async() => {
		getSelectionBounds()






	})
})

async function getSelectionBounds() {
		bounds = app.activeDocument.activeLayers[0].bounds; 
		
		const largura = bounds.right - bounds.left + "px";
		const alturas = bounds.bottom - bounds.top + "px";

		document.querySelector('#largura').textContent = "Largura: "+ largura; 
		document.querySelector('#altura').textContent = "Altura: "+ alturas; 

}


alert(app.foregroundColor.rgb.hexValue)