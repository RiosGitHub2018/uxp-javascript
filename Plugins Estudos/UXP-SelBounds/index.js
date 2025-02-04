const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;

document.querySelector("#importIMG").addEventListener("click", async evt => {
	 await core.executeAsModal( async() => {
		getSelectionBounds()
	})
})

async function getSelectionBounds() {
    try {
        const result = await app.batchPlay([{
            "_obj": "get",
            "_target": [{
                "_property": "selection"
            }, {
                "_ref": "document",
                "_enum": "ordinal",
                "_value": "targetEnum"
            }]
        }], {
            "synchronousExecution": false,
        });
        const left = result[0].selection.left._value;
        const top = result[0].selection.top._value;
        const right = result[0].selection.right._value;
        const bottom = result[0].selection.bottom._value;
        selBounds = [left, top, right, bottom];
        selectionExists = true;
		
		const largura = right-left + "px";
		const alturas = bottom-top + "px";
		//app.showAlert(selBounds); app.showAlert("Largura: " + largura + "  -  Altura: " + alturas);
		document.querySelector('#largura').textContent = "Largura: "+ largura; 
		document.querySelector('#altura').textContent = "Altura: "+ alturas; 

    } catch (e) {
        selectionExists = false;
    }
}
