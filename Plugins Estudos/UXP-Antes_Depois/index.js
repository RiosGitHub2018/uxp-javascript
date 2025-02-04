const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;

document.querySelector("#inicio").addEventListener("click", async evt => {
	await core.executeAsModal( async() => {
		const nome = app.activeDocument.name;
		const st= [];
        app.activeDocument.historyStates.forEach(h => st.push(h.name));
		const editcao = st[1];
		if(editcao== "Config-Doc"){}else{
			app.activeDocument.activeHistoryState = app.activeDocument.historyStates[0];
			app.batchPlay([{"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}],{ });
			app.batchPlay([{"_obj":"make","_target":[{"_ref":"snapshotClass"}],"from":{"_property":"currentHistoryState","_ref":"historyState"},"name":nome,"using":{"_enum":"historyState","_value":"fullDocument"}}],{ });
		}
   })
})

document.querySelector("#start").addEventListener("click", async evt => {
	await core.executeAsModal( async() => {	funStart();  })
})

document.querySelector("#antes").addEventListener("click", async evt => {
	await core.executeAsModal( async() => {	funcAntes() })
})

document.querySelector("#antes").addEventListener("click", async evt => {
	await core.executeAsModal( async() => {	funcAntes() })
})

async function funcAntes(){
	const doc = app.activeDocument;  
	document.querySelector("#antes").style.display = "none";
	document.querySelector("#depois").style.display = "flex";
    doc.activeHistoryState = doc.historyStates [0];
}

document.querySelector("#depois").addEventListener("click", async evt => {
	await core.executeAsModal( async() => {
		funcDepois()
   })
})

async function funcDepois(){
	const doc = app.activeDocument;  
	document.querySelector("#antes").style.display = "flex";
	document.querySelector("#depois").style.display = "none";
    doc.activeHistoryState = doc.historyStates[doc.historyStates.length-1];
}

async function funStart(){
	const doc = app.activeDocument;  
	doc.activeHistoryState = doc.historyStates [1];
	app.batchPlay([{"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}],{ });
	doc.activeHistoryState = doc.historyStates[doc.historyStates.length-1];
	app.batchPlay([{"_obj":"make","_target":[{"_ref":"snapshotClass"}],"from":{"_property":"currentHistoryState","_ref":"historyState"},"name":"Config-Doc","using":{"_enum":"historyState","_value":"fullDocument"}}],{ });

	 if(document.querySelector("#ck_limpar").checked == true){
		app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}],{ });
		 }
}
