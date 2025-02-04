const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;

document.querySelector("#dialogButton").addEventListener
( "click", async () => document.querySelector("#testDialog").show({title: "Modal window", resize: "both",size: {  width: 250, height: 100}}));

//Duplicates the current file and arranges the two side by side on the screen
document.querySelector("#func2amp").addEventListener("click", async evt => {
	 await core.executeAsModal( async() => {
		//await app.batchPlay([{"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"documentID":103,"name":"Montagem13 "}], { });
	    //await app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"2upVertical"}]}], { }).then(result => console.log(result), error => console.log(error));
	    await app.batchPlay([{"descriptor": {"_obj":"colorBalance","highlightLevels":[0,0,0],"midtoneLevels":[0,0,0],"preserveLuminosity":true,"shadowLevels":[0,0,0]}, "options": {"dialogOptions": "display"}}], { }).then(result => console.log(result), error => console.log(error));
	})
})


