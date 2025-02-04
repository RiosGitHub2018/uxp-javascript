const action = require("photoshop").action;
const core = require("photoshop").core;
const app = require("photoshop").app;
const alert = app.showAlert;
const doc = app.activeDocument;  

document.querySelector("#btnSite5").addEventListener("click", async evt => {
    await core.executeAsModal(async () => {
      await loadAjustes()
       })
})

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
        {"_obj":"select","_target":[{"_name":"Background","_ref":"layer"}],"layerID":[1],"makeVisible":false}
    ], {});
 }




document.querySelector("#Niveis").addEventListener("change", async (func) => {
  await core.executeAsModal(async () => {
    //setAjustColor("Niveis+", func.target.value)
    await app.batchPlay([{"_obj":"set","_target":[{"_enum":"ordinal","_ref":"framedGroupSection","_value":"targetEnum"}],"to":{"_obj":"shapeStyle","fillContents":{"_obj":"solidColorLayer","color":{"_obj":"RGBColor","blue":0.0,"grain":0.0,"red":0.0}},"strokeStyle":{"_obj":"strokeStyle","fillEnabled":true,"strokeEnabled":true,"strokeStyleLineWidth":{"_unit":"pixelsUnit","_value":func.target.value},"strokeStyleVersion":2}}}], { });
  })
}) 





document.querySelector("#Niveis2").addEventListener("change", async (func) => {
  await core.executeAsModal(async () => { setAjustColor("Niveis-", func.target.value)})
}) 

document.querySelector("#aj-magenta").addEventListener("change", async (func) => {
   await core.executeAsModal(async () => { setAjustColor("Magenta", func.target.value)})
}) 

document.querySelector("#aj-verde").addEventListener("change", async (func) => {
	  await core.executeAsModal(async () => {setAjustColor("Verde", func.target.value) })
 }) 

 document.querySelector("#Contraste").addEventListener("change", async (func) => {
  await core.executeAsModal(async () => {setAjustColor("Contraste", func.target.value) })
}) 

 document.querySelector("#Sdw-lights").addEventListener("change", async (func) => {
  await core.executeAsModal(async () => {setAjustColor("Sdw-lights", func.target.value) })
}) 

async function setAjustColor(nome, opacity) {
    try {
      const doc = app.activeDocument;
       doc.layers.forEach(layer =>{
        if (layer.kind == "group"){ layer.layers.forEach(camada =>{ if (camada.name == nome){camada.opacity = opacity }})} 
      })
    } catch (err) {
     console.log(err);
    }
     // Clear History States of current document
    await app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}], { });
}

document.querySelector("#preview").addEventListener("change",  evt => {
     if(evt.target.checked){preveiwFX(100)}else{preveiwFX(0)}
})

async function preveiwFX(opc){
    await core.executeAsModal(async () => {
    mydoc = app.activeDocument; 
    mydoc.layers.forEach(camada =>{if(camada.name == "AjustColor"){camada.opacity = opc }})
    await app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}], { });
    })
}

// nomes=[]
// const docLayers = doc.layers;
// for (let i=0; i< docLayers.length; i++) {nomes.push(docLayers[i].name)}
// if(nomes.includes('AjustColor') ==false){}
