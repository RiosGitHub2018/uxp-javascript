async function openModal() {
	const dlg = document.querySelector("#dlgAjuste");
	fetch("pags/AJColor.html").then(function(respnse) {
	return respnse.text();}).then(function(externoHTML)
	{dlg.show({ title: "Ajuste de Cores", resize: "both", size: { width: 350}})
	 dlg.innerHTML = externoHTML;
	////// TODOS OS addEventListener AQUI!
	abasConfgs();
	EventListeners();
	AjustConfig();
	corregarLista();
	////===
	})
}

function EventListeners(){
    document.querySelector("#sld1").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {	
		setAjustColor("sld1", func.target.value); document.querySelector("#vsld1").innerHTML = func.target.value+"%";
	 })}) ////===
    ////// SLIDER VERMELHO
	 document.querySelector("#sld2").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {	
		setAjustColor("sld2", func.target.value); document.querySelector("#vsld2").innerHTML = func.target.value+"%";
	 })}) ////===
	 ////// SLIDER VERDE
	 document.querySelector("#sld3").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {	
		setAjustColor("sld3", func.target.value); document.querySelector("#vsld3").innerHTML = func.target.value+"%";
	 })}) ////===
	 ////// SLIDER MAGENTA
	 document.querySelector("#sld4").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {	
		setAjustColor("sld4", func.target.value); document.querySelector("#vsld4").innerHTML = func.target.value+"%";
	 })}) ////===
	 ////// SLIDER AMARELO
	 document.querySelector("#sld5").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {	
		setAjustColor("sld5", func.target.value); document.querySelector("#vsld5").innerHTML = func.target.value+"%";
	 })}) ////===
	 ////// SLIDER AZUL
	 document.querySelector("#sld6").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {	
		setAjustColor("sld6", func.target.value); document.querySelector("#vsld6").innerHTML = func.target.value+"%";
	 })}) ////===
	 ////// SLIDER CLAREAR
	 document.querySelector("#sld7").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {	
		setAjustColor("sld7", func.target.value); document.querySelector("#vsld7").innerHTML = func.target.value+"%";
	 })}) ////===
	 ////// SLIDER ESCURECER
	 document.querySelector("#sld8").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {	
		setAjustColor("sld8", func.target.value); document.querySelector("#vsld8").innerHTML = func.target.value+"%";
	 })}) ////===
	 ////// SLIDER SATURE
	 document.querySelector("#sld9").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {	
		setAjustColor("sld9", func.target.value); document.querySelector("#vsld9").innerHTML = func.target.value+"%";
	 })}) ////===
	 ////// SLIDER DESATURE
	 document.querySelector("#sld10").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {	
		setAjustColor("sld10", func.target.value); document.querySelector("#vsld10").innerHTML = func.target.value+"%";
	 })}) ////===
	 ////// SLIDER CONSTRASTE
	 document.querySelector("#sld11").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {	
		setAjustColor("sld11", func.target.value); document.querySelector("#vsld11").innerHTML = func.target.value+"%";
	 })}) ////===
	 ////// SLIDER SOMBRA
	 document.querySelector("#sld12").addEventListener("change", async (func) => {
        await core.executeAsModal(async () => {	
		setAjustColor("sld12", func.target.value); document.querySelector("#vsld12").innerHTML = func.target.value+"%";
	 })}) ////===
	  ////// PREVIEW CHECKBOX
	 document.querySelector("#preview").addEventListener("change",  evt => {
		if(evt.target.checked){preveiwFX(100)}else{preveiwFX(0)}
	})
	document.querySelector("#ok").addEventListener("click", async evt => {
		await core.executeAsModal( async() => {preveiwFX(100); document.querySelector('#dlgAjuste').close('OK')})
	})
	document.querySelector("#cancel").addEventListener("click", async evt => {
		await core.executeAsModal( async() => {document.querySelector('#dlgAjuste').close('OK')})
	})
	document.querySelector("#resetar").addEventListener("click", async evt => {
		await core.executeAsModal( async() => {	resetar() })
	})
}

 ////// RESETA TDS VALORES
async function resetar(){
	sliders = document.getElementsByClassName("slider");
	valors = document.getElementsByClassName("valoes"); 
	for (var i=0;i<sliders.length;i++){	document.getElementById(sliders[i].id).value=0;}
	for (var i=0;i<sliders.length;i++){	document.getElementById(valors[i].id).innerHTML ="0%"};
	const doc = app.activeDocument;
	doc.layers.forEach(layer =>{if (layer.kind == "group"){ layer.layers.forEach(camada =>{ camada.opacity=0 })}})
}

async function setAjustColor(nome, opacity) {
	const doc = app.activeDocument;
	doc.layers.forEach(layer =>{if (layer.kind == "group"){ layer.layers.forEach(camada =>{ if (camada.name == nome){camada.opacity = opacity }})} 
	})
	await app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}], { });
}

 function AjustConfig(){
	try {
	   nomes = [];
	   ////// VERIFICA SE A CAMADA AjustColor JÁ CARREGOU
	   const docLayers = app.activeDocument.layers;
		for (let i=0; i< docLayers.length; i++) {nomes.push(docLayers[i].name)}
		if(nomes.includes('AjustColor') == false){
			core.executeAsModal(async () => { loadAjustes(); })
		}
	} catch (e) {alert(e)}
}

async function loadAjustes() {
    const fs = require("uxp").storage.localFileSystem;
    const pluginFolder = await fs.getPluginFolder();
    const theTemplate = await pluginFolder.getEntry("icons/AjustColor.psd");
    const token = await fs.createSessionToken(theTemplate)
    await app.batchPlay([
        {"ID":64,"_obj":"placeEvent","freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"null":{"_kind":"local","_path":token},"offset":{"_obj":"offset","horizontal":{"_unit":"pixelsUnit","_value":0.0},"vertical":{"_unit":"pixelsUnit","_value":0.0}},"replaceLayer":{"_obj":"placeEvent","to":{"_id":64,"_ref":"layer"}}},
        // Convert To Layers
        {"_obj":"placedLayerConvertToLayers"},
        // Set current layer
        {"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","mode":{"_enum":"blendMode","_value":"passThrough"}}},
        // Select layer “Background”
        {"_obj":"select","_target":[{"_name":"Background","_ref":"layer"}],"layerID":[1],"makeVisible":false},
		// Layer Via Copy
		{"_obj":"copyToLayer"},
		// Shadow/Highlight
		{"_obj":"adaptCorrect","blackClip":0.01,"center":0,"colorCorrection":20,"highlightMode":{"_obj":"adaptCorrectTones","amount":{"_unit":"percentUnit","_value":0.0},"radius":30,"width":{"_unit":"percentUnit","_value":50.0}},"shadowMode":{"_obj":"adaptCorrectTones","amount":{"_unit":"percentUnit","_value":100.0},"radius":30,"width":{"_unit":"percentUnit","_value":50.0}},"whiteClip":0.01},
		// Set current layer
		{"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","name":"sld12"}},
		// Make
		{"_obj":"make","at":{"_enum":"channel","_ref":"channel","_value":"mask"},"new":{"_class":"channel"},"using":{"_enum":"userMaskEnabled","_value":"revealAll"}},
		// Set current layer
		{"_obj":"set","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"to":{"_obj":"layer","opacity":{"_unit":"percentUnit","_value":0.0}}},
		// Move current layer
		{"_obj":"move","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}],"adjustment":false,"layerID":[53],"to":{"_index":3,"_ref":"layer"},"version":5},
		// Select backward layer
        {"_obj":"select","_target":[{"_enum":"ordinal","_ref":"layer","_value":"backwardEnum"}],"layerID":[1],"makeVisible":false}
    ], {});
 }

 async function preveiwFX(opc){
	await core.executeAsModal(async () => {
	mydoc = app.activeDocument; 
	mydoc.layers.forEach(camada =>{if(camada.name == "AjustColor"){camada.opacity = opc }})
	await app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}], { });
	})
 }

module.exports = {
    openModal, EventListeners, resetar, AjustConfig, loadAjustes, preveiwFX
}

////// PEDEFINISSÕES CONFIG
async function corregarLista() {
	try {
		const list_MD = document.getElementById("list_MD");
		conteudo_Obj = new Array();
		//// RESGATA DO LOCALSTORAG SE NAO EXISTIR ADICIONA OS ITENS PADROES:
		conteudo_Obj = JSON.parse(localStorage.getItem("ajustSave")) || [
			{Legenda: '✅  Default',	sld1: 0, sld2: 0, sld3: 0, sld4: 0, sld5: 0, sld6: 0, sld7: 0, sld8: 0, sld9: 0, sld10: 0, sld11: 0, sld12: 0,}, 
		];	
		ajustSave = conteudo_Obj.map(function (itemList) { return itemList.Legenda });
		////////// FUNC ADD OS ITENS DO ARRAY NA LISTA
		for (var i = 0; i < ajustSave.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<option>${ajustSave[i]}</option>`);}
	   console.log(conteudo_Obj);
	}
	 catch (e) {alert(e)}

     ///////// JS PREDEFINIÇÕES //---------
	 document.querySelector("#list_MD").addEventListener("change", evt => {
			textSelectItens();
		})

	async function textSelectItens(){
		array_sldID = ["sld1", "sld2", "sld3", "sld4", "sld5", "sld6", "sld7", "sld8", "sld9", "sld10", "sld11", "sld12"];
		array_value = ["vsld1", "vsld2","vsld3","vsld4","vsld5","vsld6","vsld7","vsld8","vsld9","vsld10","vsld11","vsld12"];
		try {
			const list_MD = document.getElementById("list_MD");
			sel = list_MD.selectedIndex;
			sld1 = conteudo_Obj.map(function (itemList) { return itemList.sld1; })[sel];
			sld2 = conteudo_Obj.map(function (itemList) { return itemList.sld2; })[sel];
			sld3 = conteudo_Obj.map(function (itemList) { return itemList.sld3; })[sel];
			sld4 = conteudo_Obj.map(function (itemList) { return itemList.sld4; })[sel];
			sld5 = conteudo_Obj.map(function (itemList) { return itemList.sld5; })[sel];
			sld6 = conteudo_Obj.map(function (itemList) { return itemList.sld6; })[sel];
			sld7 = conteudo_Obj.map(function (itemList) { return itemList.sld7; })[sel];
			sld8 = conteudo_Obj.map(function (itemList) { return itemList.sld8; })[sel];
			sld9 = conteudo_Obj.map(function (itemList) { return itemList.sld9; })[sel];
			sld10 = conteudo_Obj.map(function (itemList) { return itemList.sld10; })[sel];
			sld11= conteudo_Obj.map(function (itemList) { return itemList.sld11; })[sel];
			sld12= conteudo_Obj.map(function (itemList) { return itemList.sld12; })[sel];

			array_ajust = [sld1,sld2,sld3,sld4,sld5,sld6,sld7,sld8,sld9,sld10,sld11,sld12];
			sliders = document.getElementsByClassName("slider");
			for (var i=0;i<array_ajust.length;i++){	
				for (var i=0;i<sliders.length;i++){ document.getElementById(sliders[i].id).value= array_ajust[i]}
					for (var i=0;i<array_sldID.length;i++){
						for (var i=0;i<array_value.length;i++){
							await core.executeAsModal(async () => {	
							setAjustColor(array_sldID[i], array_ajust[i]); document.getElementById(array_value[i]).innerHTML = array_ajust[i]+"%";
							}) ////===
						}
					}
				}
			} 
		catch (err) {	alert(err)}
	}
    ///// CRIAÇÃO DE PRESSETES
	document.querySelector("#AddPresets").addEventListener("click", async () => {
		dlgPresets(); document.querySelector("#et_new_preset").value = "";
	});

	function dlgPresets() {
		document.querySelector("#dlgPresets").show({ title: "Pressets", resize: "both", size: { width: 290, height: 60 } })
		setTimeout(() => document.querySelector("#et_new_preset").focus(), 16);
	}

      ///////////////////////
	  function savePresets() { novoItemADD(); }; 

	  function novoItemADD(){
		const list_MD = document.getElementById("list_MD");
		try {
			nomePreset = "✅  " + document.getElementById("et_new_preset").value;
			var presetsExistents = conteudo_Obj.map(function (itemList) {return itemList.Legenda});
			if(nomePreset == "✅  ") {alert("Adicione nome do preset!"); return;}
			else if(presetsExistents.includes(nomePreset) == true) {alert("Esse preset já consta na lista, adicione outro nome!"); return;}
			else{
				document.querySelector('#dlgPresets').close('OK');
				v1 = document.querySelector("#sld1").value;
				v2 = document.querySelector("#sld2").value;
				v3 = document.querySelector("#sld3").value;
				v4 = document.querySelector("#sld4").value;
				v5 = document.querySelector("#sld5").value;
				v6 = document.querySelector("#sld6").value;
				v7 = document.querySelector("#sld7").value;
				v8 = document.querySelector("#sld8").value;
				v9 = document.querySelector("#sld9").value;
				v10 = document.querySelector("#sld10").value;
				v11 = document.querySelector("#sld11").value;
				v12 = document.querySelector("#sld12").value;
				conteudo_Obj.push({ Legenda: nomePreset,	sld1: v1, sld2: v2, sld3: v3, sld4: v4, sld5: v5, sld6: v6, sld7: v7, sld8: v8, sld9: v9, sld10: v10, sld11: v11, sld12: v12}); 
				var ajustSave = conteudo_Obj.map(function (itemList) { return itemList.Legenda });
				localStorage.setItem("ajustSave", JSON.stringify(conteudo_Obj));
				list_MD.innerHTML = "";
				for (var i = 0; i < ajustSave.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<option>${ajustSave[i]}</option>`); }
				document.querySelectorAll('#list_MD option:last-child').item(0).selected = true;
			}
		}
		catch (err) {alert(err)}
	}
	////////// REMOVE ITEM SELECIONADDO
	document.querySelector("#btnRemover").addEventListener("click", async evt => {
		const list_MD = document.getElementById("list_MD");
		const item = Number(list_MD.selectedIndex);
		if (item ==0) { app.showAlert("Esse ítem não pode ser deletado!") }
		else { conteudo_Obj.splice(item, 1); atualizaLista(); }
		document.querySelectorAll('#list_MD option:last-child').item(0).selected = true;
		textSelectItens();
	});

     ///////////////////////
	  function atualizaLista() {
		const list_MD = document.getElementById("list_MD");
		var ajustSave = conteudo_Obj.map(function (itemList) { return itemList.Legenda });
		localStorage.setItem("ajustSave", JSON.stringify(conteudo_Obj)); //// Salva no localStorage
		conteudo_Obj = JSON.parse(localStorage.getItem("ajustSave"));  //// Resgata do localStorage
		list_MD.innerHTML = "";  //// Esvazia a lista;
		for (var i = 0; i < ajustSave.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<option>${ajustSave[i]}</option>`); } //// Adiciona os itens atualizados;
	}
      //////////////////////

	document.querySelector("#btnOK").addEventListener("click", async () => {
		savePresets(); 	textSelectItens();
	});
	
	document.querySelector("#btnClose").addEventListener("click", async () => {
		document.querySelector('#dlgPresets').close('OK');
	});
}