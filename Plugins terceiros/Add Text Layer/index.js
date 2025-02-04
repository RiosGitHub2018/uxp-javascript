const app = require('photoshop').app;

async function camadaText_add() {
	let textName_value = document.getElementById("textName").value;
	if(textName_value =="" ){app.showAlert("Adicione um nome")}
	else{	await funcCam_text(textName_value);}
}

async function funcCam_text(theText) {
	const btp = {"_obj": "make","_target": [{"_ref": "textLayer"}],"using": {"_obj": "textLayer","textKey": theText,"textShape": [{"_obj": "textShape","char": {"_enum": "char","_value": "box"},"bounds": {"_obj": "rectangle","top": 100,"left": 100,"bottom": 400,"right": 500}}],"textStyleRange": [{"_obj": "textStyleRange","from": 0,"to": theText.length,"textStyle": {"_obj": "textStyle","fontName": "Myriad Pro","fontStyleName": "Bold","size": {"_unit": "pointsUnit","_value": 36},"color": {"_obj": "RGBColor","red": 100,"green": 0,"blue": 240},}}]} };
	return await require("photoshop").core.executeAsModal(async () => {	await require('photoshop').action.batchPlay([btp], {});});
}
