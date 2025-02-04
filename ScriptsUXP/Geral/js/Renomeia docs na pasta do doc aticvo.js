async function renomearDocs(){
    laminas =[]
    const folder = await fs.getEntryWithUrl(app.activeDocument.path.replace(/\\[^\\]*$/, "").replace(/\\/g, "/"));  
    const files = await folder.getEntries();
    for (const file of files) {	laminas.push(file.name) } 
    var ondenar = laminas ;
    ondenar.sort((a, b) => a.toString().localeCompare(b.toString(), undefined, { numeric: true }));
    let itensParaRemover = ["capa.jpg", "Capa.jpg", "CAPA.jpg", "cover.jpg", "COVER.jpg"];
    let imagem = ondenar.filter(function(item) {return !itensParaRemover.includes(item);});
    for (let i = 0; i < imagem.length; i++) {
    let file = await folder.getEntry(imagem[i]);
    await file.moveTo(folder, { newName: `PG_0${i+1}.jpg`, overwrite: true });
    }
}
