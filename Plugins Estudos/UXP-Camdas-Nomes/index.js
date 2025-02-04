const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;

document.querySelector("#importIMG").addEventListener("click", async evt => {
	 await core.executeAsModal( async() => {
		getDocLayers();
	})
})

async function getDocLayers() {
	try {
		const myDoc = app.activeDocument;
		const docLayers = myDoc.layers;
        document.getElementById("layers").innerHTML = "";
		for (let i=0; i< docLayers.length; i++) {
			camadas = docLayers[i].name;
			document.getElementById("layers").insertAdjacentHTML('beforeend', "<ul><li>"+ camadas + "</li></ul>");
			}
			document.getElementById("total").innerHTML = "Total: " + docLayers.length + " Camadas";
		} 
	catch (e){};
}

