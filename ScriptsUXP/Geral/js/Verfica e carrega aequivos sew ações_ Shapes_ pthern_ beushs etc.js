async function importAtnFiles() {
    const fs = require('uxp').storage.localFileSystem;
    const atnFile = await fs.getFileForOpening({ types: ["atn"] });
    const ActionSetName = action.validateReference({_ref: "actionSet", _name: atnFile.name.match(/(.*)\.[^\.]+$/)[1]})
    if(ActionSetName == true){alert(`"${atnFile.name}" já foi carregado!`)}
    else{app.open(atnFile);}
}
await importAtnFiles();