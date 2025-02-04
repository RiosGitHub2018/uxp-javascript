const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const fs = require('uxp').storage.localFileSystem;
const shell=require("uxp").shell;
const Constants = require('photoshop').constants;
const alert = app.showAlert;
const os = require('os') ;
const Usuario = os.homedir().replace(/\\/g, '/');
const photoshop = require("photoshop");
const imaging = photoshop.imaging;
const kSRGBProfile = "sRGB IEC61966-2.1";
const aFolder = require('uxp').storage.Folder




 ////// RENOMEIA ARQUIVOS
 document.querySelector("#btn25").addEventListener("click",  evt => {
       obterListaArquivosPasta()
})



 ////// RENOMEIA ARQUIVOS
 document.querySelector("#btn24").addEventListener("click",  evt => {
        const naoRenomear = ["Capa.jpg"];
        const diretório = app.activeDocument.path.replace(/\\[^\\]*$/, "").replace(/\\/g, "/");
        renomeiaAquivos(diretório, naoRenomear,  "Pag", 3); //// diretório/nome/digitos_
})

 ////// xxxxxxxxxxxxxxxxxxxxxxxxx
document.querySelector("#btn23").addEventListener("click",  evt => {
	  importAtnFiles()
})

 ////// REINICIAR O PHOTOSHOP
document.querySelector("#btn22").addEventListener("click",  evt => {
	 core.executeAsModal(() => {
          shell.openPath("C:/Users/Mauricio/Desktop/ReiniciarPhotoshop.vbs");
	 })
})

 ////// OBTER DADOS SNAPSHOTS
document.querySelector("#btn21").addEventListener("click",  evt => {
	 core.executeAsModal(() => {
		const activeDocument = app.activeDocument;
		const layers = app.activeDocument.activeLayers

		layers.forEach((quadro) => {
		app.batchPlay( [{"_obj":"select","_target":[{"_name":quadro.name,"_ref":"layer"}],"makeVisible":false}], {});
		///////// RESULTADO 
		alert(quadro.name)//// SUBSTIRU PELO EVENTOS Q ADICIONA AS IMAGENS
		});
	 })

})


 ////// OBTER DADOS SNAPSHOTS
document.querySelector("#btn20").addEventListener("click",  evt => {
    core.executeAsModal( async() => {
            const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'count' }, { _ref: "snapshotClass", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
			const pinned = result[0].count;
				 alert(pinned)
     /////////////FINAL EXECUTEADMODAL/////////////
     })
})


  ///////// IMPORTAR TEXTO EXTENO
document.getElementById('btn19').addEventListener('click', async () => {
    await core.executeAsModal(async () => {
			const fs = require('uxp').storage.localFileSystem;
			const listArquivos = await fs.getFileForOpening();
			if (!listArquivos) {
				// no listArquivos selected
				alert("no listArquivos selected")
				return;
			}
			const text = await listArquivos.read();
			alert(text)                    
    })
})

  ////////// EXECUTAR SCRIPTS JSX
document.getElementById('btn18').addEventListener('click', async () => {
    await core.executeAsModal(async () => {
        var jsxArquivos = "C:/Users/Pichau/AppData/Roaming/Adobe/CEP/extensions/Ps-fxrios/host/1DLG-Savedoc.jsx" ;//"jsx/1DLG-Savedoc.jsx" 
        await exexutarJSXfile(jsxArquivos)                         
    })
})

async function exexutarJSXfile(jsxFile) {  
	const entrada = await fs.getEntryWithUrl(jsxFile); 
	const token = await fs.createSessionToken(entrada)
	await app.batchPlay([{ "_obj": "AdobeScriptAutomation Scripts","javaScript": {"_path": token,"_kind": "local"},"javaScriptMessage": "JSM","_isCommand": true,"_options": {"dialogOptions": "dontDisplay"}}], {});
}

////// OBTER RECENTE FILES
document.querySelector("#btn17").addEventListener("click",  evt => {
    core.executeAsModal( async() => {
        const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'adjustment' }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
        const ajust =  result[0].adjustment[0]._obj;
        if(ajust== "colorBalance"){
            const cyan = result[0].adjustment[0].midtoneLevels[0];
            const magenta = result[0].adjustment[0].midtoneLevels[1];
            const yellow = result[0].adjustment[0].midtoneLevels[2];
            alert(`Cyan: ${cyan}/nMagenta: ${magenta}/nYellow: ${yellow}`);
         }
        if(ajust == "brightnessEvent"){
            const brilho = result[0].adjustment[0].brightness;
            const contraste = result[0].adjustment[0].center;
            alert(`Brilho: ${brilho}/ncontraste: ${contraste}`);
        } 
        if(ajust == "hueSaturation"){
            const hue = result[0].adjustment[0].adjustment[0].hue;
            const ligh = result[0].adjustment[0].adjustment[0].lightness;
            const satu = result[0].adjustment[0].adjustment[0].saturation;
            alert(`Hue: ${hue}/nSaturation: ${satu}/nLightness: ${ligh}`);
        } 
      //   /////////////FINAL EXECUTEADMODAL/////////////
    })
})

 ////// OBTER RECENTE FILES
document.querySelector("#btn16").addEventListener("click",  evt => {
    core.executeAsModal( async() => {
		array=[];
		const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'recentFileEntries' }, { _ref: "application", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
		const pinned = result[0].recentFileEntries[1].path
		//alert(`Lista recentes: ${pinned}`);
			recentes = result[0].recentFileEntries;
			for(i=0;i <recentes.length;i++){
				array.push(result[0].recentFileEntries[i].path);			
			}
		alert(array);
		
		
		//console.log(`Lista recentes: ${pinned}`);
     /////////////FINAL EXECUTEADMODAL/////////////
     })
})

 ////// OBTER LARGURA E ALTURA SA CAMADA
document.querySelector("#btn15").addEventListener("click",  evt => {
    core.executeAsModal( async() => {
            const result1 = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'resolution' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
            const  resol  = result1[0].resolution._value;
            const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'selection' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
            const left   = result[0].selection.left._value; 
            const right = result[0].selection.right._value;
            const botn = result[0].selection.bottom._value;
            const top   = result[0].selection.top._value; 
		
		 alert(`left: ${left}px/nright: ${right}px/nbottom: ${botn}px/ntop: ${top}px `)
     /////////////FINAL EXECUTEADMODAL/////////////
     })
})

  ////// OOTER O VALOR DA OPACIDADE DA CAMADA
document.querySelector("#btn1").addEventListener("click",  evt => {
    core.executeAsModal( async() => {
        const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'opacity' }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
        const opacity = result[0].opacity*39.22/100;

        alert( `Opacidade: ${opacity.toFixed(0)}%` )    
        /////////////FINAL EXECUTEADMODAL/////////////
     })
})

 ////// OBTER LARGURA E ALTURA SA CAMADA
document.querySelector("#btn2").addEventListener("click",  evt => {
    core.executeAsModal( async() => {
       const result1 = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'resolution' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
       const  resol  = result1[0].resolution._value;
        const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'bounds' }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
        const left   = result[0].bounds.left._value; 
        const right = result[0].bounds.right._value;
        const botn = result[0].bounds.bottom._value;
        const top   = result[0].bounds.top._value; 
        const largura = `${right- left}`*2.54/resol;
        const altura   = `${botn-top}`*2.54/resol
        alert(`Largura: ${largura.toFixed(2)} cm/n  Altura: ${altura.toFixed(2)} cm`)
     /////////////FINAL EXECUTEADMODAL/////////////
     })
})

////// OOTER A COR DA CAMADA
document.querySelector("#btn3").addEventListener("click",  evt => {
    core.executeAsModal( async() => {
        const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'color' }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
        const  cor  = result[0].color._value;

        alert( `Camada da Cor: ${cor}` )    
    /////////////FINAL EXECUTEADMODAL/////////////
  })
})

 ////// OBTER LARGURA E ALTURA SA CAMADA
 document.querySelector("#btn4").addEventListener("click",  evt => {
    core.executeAsModal( async() => {
        try {
            const result1 = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'resolution' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
            const  resol  = result1[0].resolution._value;
            const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'selection' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
            const left   = result[0].selection.left._value; 
            const right = result[0].selection.right._value;
            const botn = result[0].selection.bottom._value;
            const top   = result[0].selection.top._value; 
            const largura = `${right- left}`*2.54/resol;
            const altura   = `${botn-top}`*2.54/resol
            alert(`Largura: ${largura.toFixed(2)} cm/n  Altura: ${altura.toFixed(2)} cm`)
        } catch (e) {alert("SELECIONE A ÁREA!")}
     /////////////FINAL EXECUTEADMODAL/////////////
     })
})

////// OBTER VALOR DO FX SMARTOBJECT
document.querySelector("#btn5").addEventListener("click",  evt => {
    core.executeAsModal( async() => {
        const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'smartObject' }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
        const  fx  = result[0].smartObject.filterFX[0].filter.radius._value;
        const  nome  = result[0].smartObject.filterFX[0].name;
        alert( `FX: ${nome}/nValor: ${fx}` )    
    /////////////FINAL EXECUTEADMODAL/////////////
  })
})

////// OBTER O FORMATO DO ARQUIVO
document.querySelector("#btn6").addEventListener("click",  evt => {
    core.executeAsModal( async() => {
      const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'format' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
      const  formato  = result[0].format;
      if( formato == undefined){alert("Esse documento/nainda não foi salvo!"); return }
      alert( `Formato Doc:  "${formato}"`)   
    /////////////FINAL EXECUTEADMODAL/////////////
  })
})

////// OBTER O FORMATO DO ARQUIVO
document.querySelector("#btn7").addEventListener("click",  evt => {
  core.executeAsModal( async() => {
      const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'resolution' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
      const  resol  = result[0].resolution._value;
      alert( `Resolução Doc: ${resol} Dpi` )    
    /////////////FINAL EXECUTEADMODAL/////////////
  })
})

////// OBTER O FORMATO DO ARQUIVO
document.querySelector("#btn8").addEventListener("click",  evt => {
  core.executeAsModal( async() => {
      const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'recentFiles' }, { _ref: "application", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
      const  recentFiles = result[0].recentFiles[0]._path
      alert( `Aberto Recente: ${recentFiles}` )
    /////////////FINAL EXECUTEADMODAL/////////////
  })
})

////// DOCUMENTO EXISTE?
document.querySelector("#btn9").addEventListener("click",  evt => {
  core.executeAsModal( async() => {
      ////// VERIFICA SE EXISTE UM DOCUMENTO 
      const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'documentID' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
      const  resposta =  result[0].documentID
      alert( `ID documento: ${resposta}` )
    /////////////FINAL EXECUTEADMODAL/////////////
  })
})


////// HISTOGRAM
document.querySelector("#btn10").addEventListener("click",  evt => {
  core.executeAsModal( async() => {
      ////// VERIFICA SE EXISTE UM DOCUMENTO 
      try {
        const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'histogram' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
        lumin =  result[0].histogram;
        var luminosidade =  lumin.indexOf(Math.max(...lumin));
        alert(luminosidade)
      } catch (err) {alert(err) }
    /////////////FINAL EXECUTEADMODAL/////////////
  })
})




////// fonsts
document.querySelector("#btn11").addEventListener("click",  evt => {
  core.executeAsModal( async() => {
      ////// VERIFICA SE EXISTE UM DOCUMENTO 
      // const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'fontList' }, { _ref: "application", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
      // const lista =  result[0].fontList.fontFamilyName;
      // if ( lista.includes("UXPSfxIcon")) {alert("Icons já instalados!"); }
      // else { alert("Instalar Icons"); }
      const fontesSystem = [];
      const entry =  await fs.getEntryWithUrl("listArquivos://C:/Windows/Fonts");
      const files = await entry.getEntries();
      
      for (let i = 0; i < files.length; i++) { fontesSystem.push(files[i].name); }
      const lista =  fontesSystem; alert(lista)
      if ( lista.includes("UXPSfxIcon.ttf")) {alert("Icons já instalados!"); }
      else { /*installFontIcons();*/ alert("Fonte naão instalada") }
    /////////////FINAL EXECUTEADMODAL/////////////
  })
})

////// COPIAR PARA OUTRA PASTA
document.querySelector("#btn12").addEventListener("click",  evt => {
  core.executeAsModal( async() => { copyTo() })
})

////// SALVAR PARA WEB
document.querySelector("#btn13").addEventListener("click",  evt => {
	core.executeAsModal( async() => { await saveToweb(); })   
})

////// SALVAR CAMADAS
document.querySelector("#btn14").addEventListener("click",  evt => {
	core.executeAsModal( async() => { await saveCamadas();})   
})
//////////////////////////////
/////////////:::::::::::::::::::



async function saveToweb() {
    const entrada = await fs.getEntryWithUrl("listArquivos://C:/Users/Cliente/Desktop"); 
	const  folder = await fs.createSessionToken(entrada)
    await app.batchPlay( [{"_obj":"export","using":{"$DIDr":true,"$EICC":true,"$Mtt":true,"$MttB":255,"$MttG":255,"$MttR":255,"$Op":{"_enum":"$SWOp","_value":"$OpSa"},"$SHTM":false,"$SImg":true,"$SWch":{"_enum":"$STch","_value":"$CHsR"},"$SWmd":{"_enum":"$STmd","_value":"$MDCC"},"$SWsl":{"_enum":"$STsl","_value":"$SLAl"},"$obCS":{"_enum":"$STcs","_value":"$CS01"},"$obIA":false,"$obIP":"","$ohAA":true,"$ohAC":{"_enum":"$SToc","_value":"$OC03"},"$ohCA":false,"$ohEn":{"_enum":"$STen","_value":"$EN00"},"$ohIC":true,"$ohIZ":true,"$ohIn":-1,"$ohLE":{"_enum":"$STle","_value":"$LE03"},"$ohQA":true,"$ohTC":{"_enum":"$SToc","_value":"$OC03"},"$ohXH":false,"$olCS":false,"$olEC":{"_enum":"$STst","_value":"$ST00"},"$olNC":[{"$ncTp":{"_enum":"$STnc","_value":"$NC00"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC19"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC28"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC24"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC24"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC24"},"_obj":"$SCnc"}],"$olSH":{"_enum":"$STsp","_value":"$SP04"},"$olSV":{"_enum":"$STsp","_value":"$SP04"},"$olWH":{"_enum":"$STwh","_value":"$WH01"},"$ovCB":true,"$ovCM":false,"$ovCU":true,"$ovCW":true,"$ovFN":"estampa_02.png","$ovNC":[{"$ncTp":{"_enum":"$STnc","_value":"$NC01"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC20"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC02"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC19"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC06"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC24"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC24"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC24"},"_obj":"$SCnc"},{"$ncTp":{"_enum":"$STnc","_value":"$NC22"},"_obj":"$SCnc"}],"$ovSF":true,"$ovSN":"images","_obj":"SaveForWeb","format":{"_enum":"$IRFm","_value":"$PN24"},"in":{"_kind":"local","_path":folder},"interfaceIconFrameDimmed":false,"transparency":true}}], { synchronousExecution: false, });
}


async function saveCamadas() {
    try {
        await core.executeAsModal( async() => {
            const entrada = await fs.getEntryWithUrl("listArquivos://C:/Users/Cliente/Desktop"); 
            const  folder = await fs.createSessionToken(entrada)
            await app.batchPlay( [{"_obj":"javaScriptOptionsClass","bmpDepth":"BMPDepthType.TWENTYFOUR","destination":folder,"fileNamePrefix":"","fileType":7.0,"icc":true,"jpegQuality":"8","message":"Export Layers To Files action settings","pdfEncoding":"PDFEncoding.JPEG","pdfJpegQuality":"8","png24Interlaced":false,"png24Transparency":true,"png24Trim":true,"png8Interlaced":false,"png8Transparency":true,"png8Trim":true,"psdMaxComp":true,"targaDepth":"TargaBitsPerPixels.TWENTYFOUR","tiffCompression":"TIFFEncoding.NONE","tiffJpegQuality":"8","visibleOnly":true}], { synchronousExecution: false, });
        });
    } catch (err) {alert(err) }
}
/////////////////////////////////////
////////::::::::::::::::::::::::::::::

async function copyTo(){
      let folder = await fs.getEntryWithUrl("listArquivos://C:/Users/Pichau/Desktop/Entrada");
      let listArquivos = await folder.getEntry("UXPSfxIcon.ttf");
      // Here you add your code to check if SubFolder exists and if not create it
     // let subfolder = await folder.getEntry("myfolder"); // 
      const nfolder = await fs.getEntryWithUrl("listArquivos://C:/Users/Pichau/Desktop/Destino");  
      //await listArquivos.moveTo(subfolder);
      await listArquivos.copyTo(nfolder );
}


//// COMANDO PARA INSTALAR A FONTE REFERENTE AOS INCONES
async function installFontIcons(){
  try {
      const pluginFolder = await fs.getPluginFolder();
       const fontIcons = await pluginFolder.getEntry("lib/UXPSfxIcon.exe");
      shell.openPath(fontIcons.nativePath);
    } 
    catch (err) {alert(err) }
}
////////



//////  TESTES
document.querySelector("#btn0").addEventListener("click", async evt => {
     const dorso = 1;
     await vincadoTarget(dorso);
     await vincadoTarget(3.6+dorso);
}) 


async function vincadoTarget(valores){
  await core.executeAsModal( async() => {
        const valor = valores;
        const resol = app.activeDocument.resolution;
        const dorso = valor/2.54*resol/2;
        const wsDOC = app.activeDocument.width/2;
        const hsDOC  = app.activeDocument.height;
        await app.batchPlay( [{"_obj":"make","_target":[{"_ref":"colorSampler"}],"position":{"_obj":"paint","horizontal":{"_unit":"pixelsUnit","_value": wsDOC},"vertical":{"_unit":"pixelsUnit","_value":100}}}], { synchronousExecution: false, });
        const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'colorSamplerList' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
        const R = result[0].colorSamplerList[0].color.red;
        const G = result[0].colorSamplerList[0].color.grain;
        const B = result[0].colorSamplerList[0].color.blue;
        const c = new app.SolidColor(); c.rgb.red = R; c.rgb.green = G; c.rgb.blue = B
        luminosidade = Math.round(0.299*c.rgb.red + 0.587*c.rgb.green + 0.114*c.rgb.blue);
       await app.batchPlay( [{"_obj":"make","_target":[{"_ref":"layer"}],"layerID":2}, {"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":hsDOC},"left":{"_unit":"pixelsUnit","_value":wsDOC-dorso},"right":{"_unit":"pixelsUnit","_value":wsDOC+dorso},"top":{"_unit":"pixelsUnit","_value":0.0}}}], { synchronousExecution: false, });
       await app.batchPlay( [{"_obj":"stroke","color":{"_obj":"HSBColorClass","brightness":0.0,"hue":{"_unit":"angleUnit","_value":0.0},"saturation":100.0},"location":{"_enum":"strokeLength","_value":"inside"},"mode":{"_enum":"blendMode","_value":"normal"},"opacity":{"_unit":"percentUnit","_value":100.0},"width":2},{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}], { synchronousExecution: false, });
       await app.batchPlay( [{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"allEnum"}},{"_obj":"contract","by":{"_unit":"pixelsUnit","_value":30},"selectionModifyEffectAtCanvasBounds":true},{"_obj":"delete"},{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"to":{"_enum":"ordinal","_value":"none"}}], { synchronousExecution: false, });
      },{"interactive": true});
}



async function importAtnFiles() {
        const dependencias = [
            { nome: "Ps-fx Service", formato: "atn", referent: "actionSet" },
            { nome: "xmbcrios03",   formato: "csh", referent: "customShape"},
            { nome: "xmbcrios03",   formato: "asl", referent: "style" },
            { nome: "xmbcrios03",   formato: "abr", referent: "brush" },
            { nome: "xmbcrios03",   formato: "pat", referent: "pattern" }
        ];
        
        dependencias.forEach(async (arquivo ) => {
              try {
                    await core.executeAsModal(async () => {
                        const nome = arquivo.nome;
                        const formato = arquivo.formato;
                        const referent = arquivo.referent;
                        const pluginFolder = await fs.getPluginFolder();
                        const fileCarregar  = await pluginFolder.getEntry(`lib/suport/${nome}.${formato}`);
                        const presetCrops = await pluginFolder.getEntry("lib/suport/xmbcrios03.tpl");
                        const token = await fs.createSessionToken(presetCrops)
                        const ActionSetName = action.validateReference({_ref: referent, _name: fileCarregar.name.match(/(.*)\.[^\.]+$/)[1]})
                        if(ActionSetName == true){alert(`"${fileCarregar.name}" já foi carregado!`)}
                        else{
                          app.open(fileCarregar);
                          await app.batchPlay( [{"_obj":"set","_target":[{"_property":"toolPreset","_ref":"property"},{"_enum":"ordinal","_ref":"application","_value":"targetEnum"}],"to":{"_kind":"local","_path":token}}]);
                        }
                  },{"interactive": true});
            } catch (err) {alert(err)}
            /////// CARREGAR PRESETS DE CORTE 'CROP'
            
        });
}


////////////////////////
async function renomeiaAquivos(caminho, naoRenomear, novoNome, digitos ){
      try {
          const aFolder = await fs.getEntryWithUrl(caminho);
          const listArquivos = await aFolder.getEntries();
          conteudo = [];
         
          for (const aquivo of listArquivos) {
              if (aquivo.isFile) {
                  const nomeArquivo = aquivo.name;
                   ////// OBTEM SOMENTE AQUIVOS QUE NÃO CONSTAM NO ARRAY [naoRenomear]
                  if (!naoRenomear.includes(nomeArquivo)) { conteudo.push(nomeArquivo);}
              }
          }
          //// OBTEM O NOME DA EXTENSÃO DE UM SOS ARQUIVOS
          const segundoItem = conteudo[2];
          const extensao = segundoItem.split(".")[1];
          // FUNÇÃO QUE ORGANIZA NUMERICAMENTE OS ARQUIVOS
          function ordemNumerica(a, b) {
              const numA = parseInt(a.match(/\d+/)[0], 10);
              const numB = parseInt(b.match(/\d+/)[0], 10);
              return numA - numB;
          }
          // ATUALIZA O ARRAY COM A ORDEM CRESCENTE
          conteudo.sort(ordemNumerica);

          let cont = 1;
          for (const arquivo of conteudo) {
              const listaNomes = await aFolder.getEntry(arquivo);
              const decimal = `${cont}`.padStart(digitos, "0"); // ADICIONA O Nº DE CASAS DECIMAIS
              await aFolder.renameEntry(listaNomes, `${novoNome}_${decimal}.${extensao}`);
              cont++;
          }
      } catch (err) { alert("Esso nemo já exite! Adicione um outro nome.");}
}


////////// CRIAR UMA SUBPASTA
async function criarPasta(diretorio, folderName){
  try {
     const fs = require('uxp').storage.localFileSystem;
     const entrada = await fs.getEntryWithUrl(diretorio); 
     const token = await fs.createSessionToken(entrada)
     const folder = await fs.getEntryForSessionToken(token);
     await folder.createFolder(folderName );
  } catch (err) {}
 }
 
 
 async function obterListaArquivosPasta(){
  try {

      await core.executeAsModal( async () => {
            getFiles = [];
            //const path = "E:/•Library"
            const path = "C:/Users/Pichau/Desktop/Paisagem";
            const entry = await fs.getEntryWithUrl(`file:${path}`); 
            const token = await fs.createSessionToken(entry)
            const theFolder = await fs.getEntryForSessionToken(token);
            const mainEntries = await theFolder.getEntries();

              for (let mainEntry of mainEntries) {
               if (mainEntry.isFile) {getFiles.push(mainEntry);} 
              }
			  
			  const imagensJpg = getFiles.filter(item => item.endsWith("jpg"));

			  
			  getFiles.forEach(docs =>{
				 alert(docs)
				 app.open(docs)
			  })
					  
			  
     })
    } catch (err) {alert(err)}
}


