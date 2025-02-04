const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const alert = app.showAlert;
const fs = require('uxp').storage.localFileSystem;
const legendaExib  = document.getElementById("imge-name");
subPasta = document.getElementById("categoriaList");
radioAction = "Importar";
subPastaItems=[];

//////// BLOCO COM TODAS AS CONFIGURAÇÕES
core.executeAsModal(async () => {
    ////// BOTÃO FUNC PARA ADD UM SERVIDOR
	document.getElementById("Servidor-add").addEventListener("click", async evt => {
		localStorage.removeItem("subPastaInicial");
		const directory = await fs.getFolder(); //abre uma tela que permite escolher a pasta
		const persistentToken = await fs.createPersistentToken(directory);//cria um token persistente para a pasta
		localStorage.setItem('directory', JSON.stringify(persistentToken)); //associa o token criado à entrada da pasta
        ////INFORMA O NOME DAS SUBPASTAS E ADD AO ARRAY
		const pastaMain = await directory.getEntries();
		for (let subPastas of pastaMain) {subPastaItems.push(subPastas.name)};  
		///// ARMAZENA O NOME DA PASTA INICIAL NO LOCASTORAG
		localStorage.setItem('subPastaInicial', JSON.stringify(subPastaItems[0]));
		listaIndexzero = await JSON.parse(localStorage.getItem("subPastaInicial"));
		////// CARRREGA IMAGENS E ATUALIZA A LISTA
		carregarGaleria(listaIndexzero); carregarLista();
       	document.querySelector(".menu").style.display = 'none';
		document.querySelector(".Servidor").style.display = 'none';
		document.querySelector("#imge-name").disabled=false;
	});
    /////////===

	listaIndexzero = await JSON.parse(localStorage.getItem("subPastaInicial"));
	///EXIBE TELA DE SERIDOR NAO ENCONTRADO SE A CHAVE "listaIndexzero" RETORNAR NULL
	if(listaIndexzero== null) {	document.querySelector(".Servidor").style.display = 'block'; }
	else{document.querySelector("#imge-name").disabled=false;}

	try {
		carregarGaleria(listaIndexzero);
		function carregarGaleria(subpastaNome) {
			core.executeAsModal(async () => {
				tokenBusca = await JSON.parse(localStorage.getItem("directory")); //selecione o token salvo
				const Servidor = await fs.getEntryForPersistentToken(tokenBusca); //extrai o caminho da pasta persistente
				pastaPrincipal =   Servidor.nativePath.replace(/\\/g, "/") ; 
				subpasta = subpastaNome;
				const entry = await fs.getEntryWithUrl(`file:${pastaPrincipal}/${subpasta}/`);
				const mainEntries = await entry.getEntries();

				var imagemGaleria = document.getElementById("imagem-galeria");
				imagemGaleria.innerHTML = "";
				// Buscar todas as imagens na pasta
				var imagens = mainEntries;
				//////////////////////
				imagens.forEach(function (filename) {
					const img = document.createElement('img');
					img.src = filename;
					img.id = filename.name;
					var name = document.createElement('name');
					name.textContent = filename.name.match(/(.*)\.[^\.]+$/)[1];
					const fotos = document.createElement('fotos');
					fotos.classList.add('image-fotos');
					fotos.appendChild(img).classList.add('aparence');
					fotos.appendChild(name).classList.add('legenda');
					imagemGaleria.appendChild(fotos);
				});
				////////////////////
			const images = document.querySelectorAll('.aparence');
				images.forEach((btnImage) => {
					btnImage.addEventListener('click', async (event) => {
						images.forEach((btnImage) => { btnImage.classList.remove('selecionado') });
						event.target.classList.add('selecionado');
						arquivo = btnImage.id;
						await importIMG();
					});
				});
			})
		legendaExib.checked=false;	
		}
	} 
	catch (err) {alert(err)};
	/////////===
	///// OBTEM A LITA DAS SUBPASTAS
	carregarLista();
	function carregarLista(){
		core.executeAsModal(async () => {
			subPasta.innerHTML = "";
			const directory = await fs.getEntryWithUrl(`file:${pastaPrincipal}`);
			const token = await fs.createSessionToken(directory);
			const SessionToken = await fs.getEntryForSessionToken(token);
			const pastaMain = await SessionToken.getEntries();
			for (let subPastas of pastaMain) {subPasta.insertAdjacentHTML("beforeend", `<option>${subPastas.name}</option>`);};  
		});
	}
  ///////=== 
	subPasta.addEventListener("change", evt => {carregarGaleria(subPasta.value) });
})
////===
///////////////////////////////////
///// FUNC IMPORTAR IMAGENS
async function importIMG() {
	core.executeAsModal(async () => {
		const entry = await fs.getEntryWithUrl(`file:${pastaPrincipal}/${subpasta}/${arquivo}`);
		const token = fs.createSessionToken(entry);
		if( radioAction == "Importar"){
			await app.batchPlay([{ "_obj": "open", "documentID": 139, "dontRecord": false, "forceNotify": true, "null": { "_kind": "local", "_path": token }, "template": false }], { synchronousExecution: false, });
		}
		else if (radioAction == "Inserir na Imagem") {
			 ////// VERIFICA SE EXISTE UM DOCUMENTO 
			 const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'documentID' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
			 const  resposta =  result[0].documentID
			 if(resposta == undefined){alert(`Não á nenhum documento\r na sua área de trabalho!`); return;}
			 await app.batchPlay([{ "_obj": "placeEvent", "freeTransformCenterState": { "_enum": "quadCenterState", "_value": "QCSAverage" }, "linked": true, "null": { "_kind": "local", "_path": token }, "offset": { "_obj": "offset", "horizontal": { "_unit": "distanceUnit", "_value": 0.0 }, "vertical": { "_unit": "distanceUnit", "_value": 0.0 } }, "replaceLayer": { "_obj": "placeEvent", "to": { "_id": 6, "_ref": "layer" } } }], { synchronousExecution: false, });
		}
		else if (radioAction == "Inserir na seleção") {
			const result = await app.batchPlay([{ _obj: 'get', _target: [{ _property: 'selection' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" }] }], {});
			if(result[0].solid == undefined){alert("Você não selecionou a área!"); return };
			await app.batchPlay([{ "_obj": "duplicate", "_target": [{ "_property": "selection", "_ref": "channel" }] }], { synchronousExecution: false, });
			await app.batchPlay([{ "_obj": "placeEvent", "freeTransformCenterState": { "_enum": "quadCenterState", "_value": "QCSAverage" }, "linked": true, "null": { "_kind": "local", "_path": token }, "offset": { "_obj": "offset", "horizontal": { "_unit": "distanceUnit", "_value": 0.0 }, "vertical": { "_unit": "distanceUnit", "_value": 0.0 } }, "replaceLayer": { "_obj": "placeEvent", "to": { "_id": 6, "_ref": "layer" } } }], { synchronousExecution: false, });
			await enquadraSelect();
		}
		else if (radioAction == "Substituir") {
			const result = await app.batchPlay([{ _obj: 'get', _target: [{ _property: 'layerKind' }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }] }], {});
			if(result[0].layerKind !=5 ){alert(`Transforme a camada atual\r    em Smart Object!`)}
			await app.batchPlay([{ "_obj": "set", "_target": [{ "_property": "selection", "_ref": "channel" }], "to": { "_enum": "channel", "_ref": "channel", "_value": "transparencyEnum" } }], { synchronousExecution: false, });
			await app.batchPlay([{ "_obj": "duplicate", "_target": [{ "_property": "selection", "_ref": "channel" }] }], { synchronousExecution: false, });
			await app.batchPlay([{ "_obj": "placedLayerReplaceContents", "layerID": 3, "null": { "_kind": "local", "_path": token } }], { synchronousExecution: false, });
			await enquadraSelect();
		}
	});
}
//////====
//////EXIBIR NOMES DAS IMAGENS
legendaExib.addEventListener("click", evt => { if(legendaExib.checked==true){legendas(1)} else{legendas(0)}});
function legendas(m){
	const images = document.querySelectorAll('.legenda');
	images.forEach((btnImage) => {	images.forEach((btnImage) => { btnImage.setAttribute("style", `opacity:${m}`) })});
}
///====
///////////////////
////// OBTER LARGURA E ALTURA SA CAMADA
async function enquadraSelect() {
	core.executeAsModal(async (executionContext) => {
		let hostControl = executionContext.hostControl; let documentID = app.activeDocument.id;
		let suspensionID = await hostControl.suspendHistory({ "documentID": documentID, "name": "Importar" });
		//// REFAZ A SELECAO
		await app.batchPlay([{ "_obj": "set", "_target": [{ "_property": "selection", "_ref": "channel" }], "to": { "_name": "Alpha 1", "_ref": "channel" } }], { synchronousExecution: false, });
		//// OBTEM OS LIMITES DAS SELECAO
		const result = await app.batchPlay([{ _obj: 'get', _target: [{ _property: 'selection' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" }] }], { synchronousExecution: false, });
		const botn = result[0].selection.bottom._value;
		const top = result[0].selection.top._value;
		const altura = `${botn - top}`;
		await app.batchPlay([{ "_obj": "align", "_target": [{ "_enum": "ordinal", "_ref": "layer", "_value": "targetEnum" }], "alignToCanvas": false, "using": { "_enum": "alignDistributeSelector", "_value": "ADSCentersH" } }], { synchronousExecution: false, });
		await app.batchPlay([{ "_obj": "align", "_target": [{ "_enum": "ordinal", "_ref": "layer", "_value": "targetEnum" }], "alignToCanvas": false, "using": { "_enum": "alignDistributeSelector", "_value": "ADSCentersV" } }], { synchronousExecution: false, });
		await app.batchPlay([{ "_obj": "set", "_target": [{ "_property": "selection", "_ref": "channel" }], "to": { "_enum": "ordinal", "_value": "none" } }], { synchronousExecution: false, });
		await app.batchPlay([{ "_obj": "select", "_target": [{ "_name": "Alpha 1", "_ref": "channel" }] }, { "_obj": "delete", "_target": [{ "_enum": "ordinal", "_ref": "channel", "_value": "targetEnum" }] }], { synchronousExecution: false, });
		//// REDIMENSIONA A IMAGEM COM ALTURA OBTIDA DA SELECAO
		const camada = app.activeDocument.layers[0]
		const resolucao = app.activeDocument.resolution
		const camadaH = Number(altura);
		const height = camada.bounds.height;
		const newheight = camadaH * 1 * 100 / height;
		await camada.scale(newheight, newheight);
	})
}
/////====
///////// MUNU AUXILIAR
var menu = document.querySelectorAll(".menu");
if (document.addEventListener) {
  document.addEventListener('contextmenu', function(e) {menu[0].style.display = 'block';e.preventDefault();}, false);
}
/////====
//////FUNCION ZOOM
document.getElementById("zoomA").addEventListener("click", evt => {
	imagemSize(154); document.querySelector(".menu").style.display = 'none';
});

document.getElementById("zoomD").addEventListener("click", evt => {
	imagemSize(75); document.querySelector(".menu").style.display = 'none';
});

document.getElementById("close").addEventListener("click", evt => {
	document.querySelector(".menu").style.display = 'none';
});

function imagemSize(a){
	const conteudo = document.querySelectorAll('.aparence');
	conteudo.forEach((thumbs) => {conteudo.forEach((thumbs) => { 
		thumbs.style.width =`${a}px`; thumbs.style.height = `${a}px`;
	})});
}

/////// BOTÕES DE RÁEDIO SETTINGS
const elementos = document.getElementsByClassName("btn-radio");
const radioBtn = Array.from(elementos);
for(let i = 0; i < radioBtn.length; i++){ 
	radioBtn[i].addEventListener('click', (event) => {
	for(let i = 0; i < radioBtn.length; i++){radioBtn[i].classList.remove('btn-radio-checked');}
		event.currentTarget.classList.add('btn-radio-checked');
        radioAction = event.currentTarget.textContent;
	})
}
//////===