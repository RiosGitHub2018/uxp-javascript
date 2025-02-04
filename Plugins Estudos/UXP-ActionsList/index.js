const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;

const getActionSet = require('photoshop').app.actionTree;
const ActionSet = document.getElementById("list_AS")
const AcrionList = document.getElementById("list_AC")

for (let i=0; i<getActionSet.length; i++){
     ActionSet.insertAdjacentHTML("beforeend", `<sp-menu-item>${getActionSet[i].name}</sp-menu-item>`); 
}

ActionSet.addEventListener("change", evt => {
    AcrionList.innerHTML ="";
    for (let i=0; i<getActionSet.length; i++){ var getActionItens = getActionSet[evt.target.selectedIndex]}
    for (let i=0; i<getActionItens.actions.length; i++){
         AcrionList.insertAdjacentHTML("beforeend", `<sp-menu-item>${getActionItens.actions[i].name}</sp-menu-item>`); 
         AcrionList.selectedIndex = 0;
    }
})

document.querySelector("#btnRun").addEventListener("click",  evt => {
    core.executeAsModal( async() => {
      const list_AS = ActionSet.value; list_AC = AcrionList.value;
      await app.batchPlay([{"_obj":"play","_target":[{"_name": list_AC,"_ref":"action"},{"_name": list_AS,"_ref":"actionSet"}]}], { });
    })
})





/*
document.querySelector("#btnRun").addEventListener("click",  evt => {
core.executeAsModal( async() => {
	async function actionCommands() {
	list_AS = ActionSet.value; list_AC = AcrionList.value;
	psAction = require("photoshop").action;
	await psAction.batchPlay([{"_obj":"play","_target":[{"_name": list_AC,"_ref":"action"},{"_name": list_AS,"_ref":"actionSet"}], "_options": {"dialogOptions": "dontDisplay"}}], {});
	}
	await require("photoshop").core.executeAsModal(actionCommands, {"commandName": "Action Commands"});
	})
})*/