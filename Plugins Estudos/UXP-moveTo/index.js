const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const alert = app.showAlert;
const fs = require('uxp').storage.localFileSystem;

 //// CRIA UMA SUPASTA 
document.querySelector("#btnSalvar ").addEventListener("click", async evt => {
    let folder = await fs.getEntryWithUrl("file://C:/Folder");
    let file = await folder.getEntry("myFile.png");
    // Here you add your code to check if SubFolder exists and if not create it
    let subfolder = await folder.getEntry("SubFolder");
    await file.moveTo(subfolder);
});

document.querySelector("#btnMovertodos").addEventListener("click", async evt => {
		await core.executeAsModal( async () => {
		laminas =[]
		const folder = await fs.getEntryWithUrl(app.activeDocument.path.replace(/\\[^\\]*$/, "").replace(/\\/g, "/"));  
		const files = await folder.getEntries();
        //// VERIFICA SE AS IMAGENS JÁ FORAM  RENOEADAS
		let fileExists = false;
		for (const file of files) { if (file.name === "PG-001.jpg") { fileExists = true; break; }}
		if (fileExists) { alert('Todos o aqruivos desse diretório já foram renoeados!'); return} 
        /////::::::::::::::::::
		for (const file of files) {	laminas.push(file.name) } 
		var ondenar = laminas ;

		ondenar.sort((a, b) => a.toString().localeCompare(b.toString(), undefined, { numeric: true }));
		let itensParaRemover = ["capa.jpg", "Capa.jpg", "CAPA.jpg", "cover.jpg", "COVER.jpg"];
		let imagem = ondenar.filter(function(item) {return !itensParaRemover.includes(item);});

		for (let i = 0; i < imagem.length; i++) {
			let ordemDoc =  imagem[i].replace(/\D/g, '').padStart(3, '0'); //image_001 , .padStart(2, '0') = image_01
			let file = await folder.getEntry(imagem[i]);
			await file.moveTo(folder, { newName: `PG-${ordemDoc}.jpg`, overwrite: true });
		  }
	})
});







document.querySelector("#btnPastavz").addEventListener("click", async evt => {
		const folder = await fs.getEntryWithUrl("file://D:/Testes"); // fs.readdirSync(directoryPath);
		const files = await folder.getEntries();
		if(files.length==0){alert('O diretório está vazio.');}
		else {alert('O diretório não está vazio.'); }
});






document.querySelector("#btnFilexist").addEventListener("click", async evt => {
		const folder = await fs.getEntryWithUrl("file://D:/Testes");
		const files = await folder.getEntries();
	
		let fileExists = false;
		for (const file of files) { if (file.name === "Scanner_01.jpg") { fileExists = true; break; }}
	
		if (fileExists) { alert('O arquivo "Scanner_01.jpg" existe no diretório.');	} 
		else {alert('O arquivo "Scanner_01.jpg" não existe no diretório.');
		}
});