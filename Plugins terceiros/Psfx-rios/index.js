const app = require("photoshop").app;
const action = require("photoshop").action;

const host = require("uxp").host;
const {entrypoints} = require("uxp");


/////// EXIBE A CAIXA DE DIÁLOGO =============
document.querySelector("#dialogButton").addEventListener( "click",  () => document.querySelector("#testDialog").uxpShowModal(
	{
		title: "Minha janela Modal",
		resize: "both",
		size: {
		  width: 300,
		  height: 300
		}
	  }
	)
);

/////// TESTES FUNÇÕES DO BOTÃO OK =============
document.getElementById('confirma').addEventListener('click', async () => {
    await action.batchPlay([{"_obj":"hueSaturation","adjustment":[{"_obj":"hueSatAdjustmentV2","hue":0,"lightness":0,"saturation":-100}],"colorize":false,"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}}], { });
});



/////// TESTES FUNÇÕES DOS BOTÕES =============
function runScript(func) {
	/*if(!app.documents.length){app.showAlert("Não existe documentos aberto!");}
	else{runScriptAsync(func);}*/
	runScriptAsync(func);
}

async function runScriptAsync(func) {
	switch (func) {
        case "Remove saturation": {
			 await action.batchPlay([{"_obj":"hueSaturation","adjustment":[{"_obj":"hueSatAdjustmentV2","hue":0,"lightness":0,"saturation":-100}],"colorize":false,"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}}], { });
			break;
        };

        case "Copy Layer": {
			await action.batchPlay([{"_obj":"copyToLayer"}], { });				
			break;
        };	

        case "Flip horizontal": {
			await action.batchPlay([{"_obj":"transform","_target":[{"_enum":"ordinal","_ref":"layer"}],"freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"bicubic"},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":0.0},"vertical":{"_unit":"pixelsUnit","_value":0.0}},"width":{"_unit":"percentUnit","_value":-100.0}}], { });				
			break;
        };	
		
		case "Ajuste Niveis": {
			await action.batchPlay([{"_obj":"levels","adjustment":[{"_obj":"levelsAdjustment","channel":{"_enum":"channel","_ref":"channel","_value":"composite"},"gamma":1.00}],"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"},"_options": { "dialogOptions": "display" }}], { });				
			break;
        };

		case "Remover Camada": {
			await action.batchPlay([{"_obj":"delete","_target":[{"_enum":"ordinal","_ref":"layer"}],"layerID":[85]}], { });				
			break;
        };	

		case "Desfazer Tudo": {
			await action.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document"}]},{"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}], { });				
			break;
        };	

		case "Carregar imagem": {
			await action.batchPlay([{"_obj":"open","documentID":134,"_options": { "dialogOptions": "display" }}], { });				
			break;
        };		
		
	}
}

/////// TESTES DUPLICAR E RNOMEAR CAMADAS =============
async function myfunction(){
    //app.showAlert("myfunction");
	//await action.batchPlay([{"_obj":"copyToLayer"}], { });
   //  await app.activeDocument.activeLayers[0].duplicate().then((camada) =>{camada.name= "Rios_${++}"})
	 for (let cmd =1; cmd<4; cmd++){
		 await app.activeDocument.activeLayers[0].duplicate().then((camada) =>{camada.name= `Rios_${cmd}`})
		}
}
document.getElementById("botao").addEventListener("click", myfunction);
/////////


/////// TESTES FUNÇÕES DROPDOWLIST =============
document.querySelector("#select").addEventListener("change", async evt => {
	if(!app.documents.length){app.showAlert("Não existe documentos aberto!");}
	else{
		let listaItens = evt.target.selectedIndex; 
		if(listaItens == 0){await action.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document"}]},{"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}], { });}
		else if(listaItens == 1){ await action.batchPlay([{"_obj":"rotateEventEnum","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"angle":{"_unit":"angleUnit","_value":90.0}}], { });}
		else if(listaItens == 2){ await action.batchPlay([{"_obj":"rotateEventEnum","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"angle":{"_unit":"angleUnit","_value":-90.0}}], { });}
		else if(listaItens == 3){ await action.batchPlay([{"_obj":"rotateEventEnum","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"angle":{"_unit":"angleUnit","_value":180}}], { });}
		////EXIBE O NOME DO ITEM SELECIONADO====
		/*let listaItens = evt.target.value;
		app.showAlert(listaItens);*/
		await action.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"fitOnScreen"}]},{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"zoomOut"}]}], { });
	}
})


/////// EXIBE A CAIXA DE DIÁLOGO =============
document.querySelector("#btn_renCam").addEventListener( "click",  () => document.querySelector("#renCamadas").uxpShowModal(
	{title: "Renomear Camada",	resize: "both",  size: { width: 300,  height: 300}
	  }
	)
);

/////// TESTES DUPLICAR E RNOMEAR CAMADAS =============
async function RM_camadas(){
	const nomeCamada = document.getElementById("txt_camada").value;
    app.activeDocument.activeLayers[0].name = nomeCamada;
}
document.getElementById("btn_renomear").addEventListener("click", RM_camadas);

/////// TESTES SELECIONAR CAMADAS =============
async function sel_camadas(){
   await action.batchPlay([{"_obj":"select","_target":[{"_enum":"ordinal","_ref":"layer","_value":"forwardEnum"}],"layerID":[5],"makeVisible":false}], { });
}
document.getElementById("btn_select").addEventListener("click", sel_camadas);

/////// FUNÇÃO SELECIONA CAMADAS POR NOME =============
async function selsectaLayer(camada){
	await action.batchPlay([{"_obj":"select","_target":[{"_name":camada,"_ref":"layer"}]}], { });
}







