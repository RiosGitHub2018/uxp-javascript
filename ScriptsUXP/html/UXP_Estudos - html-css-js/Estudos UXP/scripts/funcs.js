async function removeSature() {
    await action.batchPlay([{"_obj":"hueSaturation","adjustment":[{"_obj":"hueSatAdjustmentV2","hue":0,"lightness":0,"saturation":-100}],"colorize":false,"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}}], { });
	await action.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document"}]}], { });
	//await action.batchPlay([{ _obj: "showColorPicker", _target: [{ _ref: "application" }]}],{ }); ////// showColorPiker
}

async function ajNiveis() {
    await action.batchPlay([{"_obj":"levels","adjustment":[{"_obj":"levelsAdjustment","channel":{"_enum":"channel","_ref":"channel","_value":"composite"},"gamma":1.00}],"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"},"_options": { "dialogOptions": "display" }}], { });		
	await action.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document"}]}], { });
}

async function curvas(){
    await action.batchPlay([{"_obj":"curves","adjustment":[{"_obj":"curvesAdjustment","channel":{"_enum":"channel","_ref":"channel","_value":"composite"},"curve":[{"_obj":"paint","horizontal":0.0,"vertical":0.0},{"_obj":"paint","horizontal":127.0,"vertical":127.0},{"_obj":"paint","horizontal":255.0,"vertical":255.0}]}],"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"},"_options": { "dialogOptions": "display" }}], { });		
	await action.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document"}]}], { });
}

async function desfazer(){
	//await action.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document"}]},{"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}], { });
	//await action.batchPlay([{"_obj":"play","_target":[{"_name":"Action 3","_ref":"action"},{"_name":"Set 1","_ref":"actionSet"}]}], { });
	await action.batchPlay([{"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"documentID":103,"name":"Montagem13 "},{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"2upVertical"}]}], { });
 }

/*
async function desfazer(){
	/*const fs = require('uxp').storage.localFileSystem;
	let entry = await fs.getFileForOpening();//getFileForOpening();
	let token = fs.createSessionToken(entry);
	await action.batchPlay([{"_obj":"placedLayerReplaceContents","layerID":3,"null":{"_kind":"local","_path":token}}], { });
	//console.log(entry);
 }
*/
module.exports = {
    removeSature, ajNiveis, curvas, desfazer
}


