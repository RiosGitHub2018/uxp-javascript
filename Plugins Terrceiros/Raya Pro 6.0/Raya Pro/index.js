var _fuzziness = 100;
var _fuzStep = 20;

const app = require("photoshop").app;
const action = require("photoshop").action;

const host = require("uxp").host;
const {entrypoints} = require("uxp");

const dialogs = require("./lib/dialogs.js");

var zeLayerNames = {"Zone Vignette":"vignette","Zone Cool":"cool","Zone Warm":"warm","Zone Orton":"orton","Zone Saturation":"saturate","Zone Desaturate":"desaturate","Zone Vibrance":"vibrance","Zone Darken":"darken","Zone Details":"details","Zone Brighten":"brighten"};
var zeSliderNames = {"vignette":"Zone Vignette","cool":"Zone Cool","warm":"Zone Warm","orton":"Zone Orton","saturate":"Zone Saturation","desaturate":"Zone Desaturate","vibrance":"Zone Vibrance","darken":"Zone Darken","details":"Zone Details","brighten":"Zone Brighten"};

var locale = host.uiLocale;
const localesSupported = {
	"fr_FR":true,
	"it_IT":true,
	"es_ES":true,
	"de_DE":true	
};

const localisedStrings = 
{
	"pressAuto":
	{
		"default":"Press Auto Dark or Auto Bri first, then press the numbered buttons to see the masks.",
	"fr_FR":"Appuyez d'abord sur Auto Noir ou Auto Clair, puis sur les touches numérotées pour voir les masques.",
	"it_IT":"Premi prima Auto Scuro o Auto Chiaro, quindi premi i pulsanti numerati per vedere le maschere",
	"es_ES":"Presionar primero Somb Auto o Luces Auto, y luego los botones numerados para ver las máscaras.",
		"de_DE":"Drücke zuerst auf Auto Dunkel oder Auto Hell und dann auf die nummerierten Tasten, um die Masken zu sehen."
	},
	"pressFix":
	{
		"default":"Press Fix first, then press the numbered buttons to see the masks.",
	"fr_FR":"Appuyez d'abord sur Fix, puis sur les touches numérotées pour voir les masques.",
	"it_IT":"Premi prima Fix, quindi premi i pulsanti numerati per vedere le maschere",
	"es_ES":"Presionar primero Fix, y luego los botones numerados para ver las máscaras.",
		"de_DE":"Drücke zuerst auf Fix und dann auf die nummerierten Tasten, um die Masken zu sehen."
	}
}

/*
<span class="default">Press Auto Dark or Auto Bri first, then press the numbered buttons to see the masks.</span>
<span class="fr_FR">Appuyez d'abord sur Auto Noir ou Auto Clair, puis sur les touches numérotées pour voir les masques.</span>
<span class="it_IT">Premi prima Auto Scuro o Auto Chiaro, quindi premi i pulsanti numerati per vedere le maschere</span>
<span class="es_ES">Presionar primero Somb Auto o Luces Auto, y luego los botones numerados para ver las máscaras.</span>
<span class="de_DE">Drücke zuerst auf Auto Dunkel oder Auto Hell und dann auf die nummerierten Tasten, um die Masken zu sehen.</span>

*/

function uncheckAll(id)
{
	$("#"+id).children().removeClass("checked");
}

function getChecked(id)
{
	return $("#"+id).children(".checked").first().attr("name");
	
}

function localisedAlert(key)
{
	if(!localisedStrings[key][locale])
		return localisedStrings[key]["default"];
	
	return localisedStrings[key][locale];	
}

function urlClick(url) {
	require('uxp').shell.openExternal(url);
}

function listener()
{
	resetSliders();
	resetZeUI();
}

function onLoaded()
{
	if(!localesSupported[locale])
		locale = "default";
	$(".container").addClass(locale);
	
	action.addNotificationListener(
		[
			{event:"select"}
		], listener
	);
}

entrypoints.setup({
    panels: {
        "com.rayapro.zoneeditor.uxp": {
             show(event) {
                 event.node.appendChild(document.querySelector("#panel_ze"));
             }
        }, 
        "com.rayapro.hub.uxp": {
             show(event) {
                 event.node.appendChild(document.querySelector("#panel_hub"));
             }
        }, 
		"com.rayapro.colourcentre.uxp": {
            show(event) {
                event.node.appendChild(document.querySelector("#panel_cc"));
            }
        },
		"com.rayapro.dodgeburn.uxp": {
            show(event) {
                event.node.appendChild(document.querySelector("#panel_db"));
            }
        },
		"com.rayapro.filters.uxp": {
            show(event) {
                event.node.appendChild(document.querySelector("#panel_ff"));
            }
        },
		"com.rayapro.instamask.uxp": {
            show(event) {
                event.node.appendChild(document.querySelector("#panel_im"));
            }
        },
		"com.rayapro.precisionmasks.uxp": {
            show(event) {
                event.node.appendChild(document.querySelector("#panel_pm"));
            }
        },
		"com.rayapro.quickblending.uxp": {
            show(event) {
                event.node.appendChild(document.querySelector("#panel_qb"));
            }
        }
    }
});


function maxValue(sliderName)
{
	document.querySelector("#"+sliderName).value = 255;
    updateBlends();
}

function minValue(sliderName)
{
    document.querySelector("#"+sliderName).value = "0";
    updateBlends();
}

function deactivateSliders()
{    
	document.querySelector("#darkGreySlider").disabled = true;
	document.querySelector("#darkRedSlider").disabled = true;
	document.querySelector("#darkGreenSlider").disabled = true;
	document.querySelector("#darkBlueSlider").disabled = true;
	
	document.querySelector("#brightGreySlider").disabled = true;
	document.querySelector("#brightRedSlider").disabled = true;
	document.querySelector("#brightGreenSlider").disabled = true;
	document.querySelector("#brightBlueSlider").disabled = true;
}

function activateSliders()
{
	document.querySelector("#darkGreySlider").disabled = false;
	document.querySelector("#darkRedSlider").disabled = false;
	document.querySelector("#darkGreenSlider").disabled = false;
	document.querySelector("#darkBlueSlider").disabled = false;
	
	document.querySelector("#brightGreySlider").disabled = false;
	document.querySelector("#brightRedSlider").disabled = false;
	document.querySelector("#brightGreenSlider").disabled = false;
	document.querySelector("#brightBlueSlider").disabled = false;
	

    
    

}


function toggleZeVisibility(layerId)
{
	console.log(layerId);
	var layerName = zeSliderNames[layerId];
	runScript_ze("Toggle Visibility",layerName);
}

function resetZESliders() {

	for(var prop in zeSliderNames)
	{
		document.querySelector("#"+prop+"Slider").value = "0";
	}


}

function applyZESlider(sliderName)
{
	var value = document.querySelector("#"+sliderName+"Slider").value;
	runScript_ze("Update Opacity",[value,zeSliderNames[sliderName]]);
}


var channelIds = {
	"RGB":"RGB",
	"Red":"red",
	"Green":"grain",
	"Blue":"blue"
};

function getImMaskChannel()
{
	
	var channel = getChecked("imMaskChannel");
	if(!channel) channel = "RGB";
	return channelIds[channel];
}

function activate()
{
    activateSliders();
    resetSliders();
    updateBlends();
}

function apply()
{
    deactivateSliders();
    resetSliders();
}

function cancel()
{
    
    resetSliders();
    updateBlends();
}

async function updateBlends()
{
    runScript_qb('updateBlends', [document.querySelector("#darkGreySlider").value,
	document.querySelector("#darkRedSlider").value,
	document.querySelector("#darkGreenSlider").value,
	document.querySelector("#darkBlueSlider").value,
    document.querySelector("#brightGreySlider").value,
	document.querySelector("#brightRedSlider").value,
	document.querySelector("#brightGreenSlider").value,
	document.querySelector("#brightBlueSlider").value
	]);
}

function resetSliders()
{
	
    document.querySelector("#darkGreySlider").value = "0";
	document.querySelector("#darkRedSlider").value = "0";
	document.querySelector("#darkGreenSlider").value = "0";
	document.querySelector("#darkBlueSlider").value = "0";
	
    document.querySelector("#brightGreySlider").value = 255;
	document.querySelector("#brightRedSlider").value = 255;
	document.querySelector("#brightGreenSlider").value = 255;
	document.querySelector("#brightBlueSlider").value = 255;

}

function resetZeUI()
{
	if(app.activeDocument.activeLayers[0].name!="Zone Editor") return;
	//get opacity and vis values form ze layers, set in panel
	var zoneSet = app.activeDocument.activeLayers[0];

	for(var i=0;i<zoneSet.children.length;i++)
	{
		var _name = zoneSet.children[i].name;
		if(zeLayerNames[_name])
		{
			var value = zoneSet.children[i].opacity;
			if(!value) value = "0";
			document.querySelector("#"+zeLayerNames[_name]+"Slider").value = value;
			
			var vis = zoneSet.children[i].visible;
			$("#"+zeLayerNames[_name]+"vis").removeClass("on");
			
			if(vis)
				$("#"+zeLayerNames[_name]+"Vis").addClass("on");
			else
				$("#"+zeLayerNames[_name]+"Vis").removeClass("on");
		}
		
	}
}

function resetDarkSliders()
{
    document.querySelector("#darkGreySlider").value = "0";
	document.querySelector("#darkRedSlider").value = "0";
	document.querySelector("#darkGreenSlider").value = "0";
	document.querySelector("#darkBlueSlider").value = "0";

    updateBlends();
}

async function resetBrightSliders()
{
    document.querySelector("#brightGreySlider").value = 255;
	document.querySelector("#brightRedSlider").value = 255;
	document.querySelector("#brightGreenSlider").value = 255;
	document.querySelector("#brightBlueSlider").value = 255;
    

    updateBlends();

 }

async function updateDarkSliderValues()
{    
 
    updateBlends();
   
 }

async function updateBrightSliderValues()
{    
 
    updateBlends();
   
}

async function resetImSliders() {

    document.querySelector("#shadowsSlider").value = "0";
    document.querySelector("#midtoneSlider").value = 50;
    document.querySelector("#highlightsSlider").value = 255;
	
    document.querySelector("#shadowsSliderValue").textContent = "0";
    document.querySelector("#midtoneSliderValue").textContent = 50;
    document.querySelector("#highlightsSliderValue").textContent = 255;
	
	


}

async function updateImSliderValues() {



    document.querySelector("#shadowsSliderValue").textContent = document.querySelector("#shadowsSlider").value ? document.querySelector("#shadowsSlider").value : "0";
    document.querySelector("#midtoneSliderValue").textContent = document.querySelector("#midtoneSlider").value ? document.querySelector("#midtoneSlider").value : "0" ;
    document.querySelector("#highlightsSliderValue").textContent = document.querySelector("#highlightsSlider").value ? document.querySelector("#highlightsSlider").value : "0";

	
	await loadOrCreateBackupMask();


	
    runScript_im('updateMaskLevels', [document.querySelector("#shadowsSlider").value, document.querySelector("#midtoneSlider").value, document.querySelector("#highlightsSlider").value]);
}

function createLuminosityMask() {
    resetFuzziness();
    runScript_im('LuminosityMask', _fuzziness);
}

function createColorRangeMask() {
    resetFuzziness();
    runScript_im('ColorRangeMask', _fuzziness);
}

function decreaseLuminosityMaskFuzziness() {
    decreaseFuzziness();
    runScript_im('ChangeLuminosityMaskFuzziness', _fuzziness);
}

function increaseLuminosityMaskFuzziness() {
    increaseFuzziness();
    runScript_im('ChangeLuminosityMaskFuzziness', _fuzziness);
}

function decreaseColorMaskFuzziness() {
    decreaseFuzziness();
    runScript_im('ChangeColorMaskFuzziness', _fuzziness);
}

function increaseColorMaskFuzziness() {
    increaseFuzziness();
    runScript_im('ChangeColorMaskFuzziness', _fuzziness);
}


function resetFuzziness() {
    _fuzziness = 100;
    document.querySelector("#increaseColButton").disabled = false;
    document.querySelector("#increaseLumButton").disabled = false;

    document.querySelector("#decreaseColButton").disabled = false;
    document.querySelector("#decreaseLumButton").disabled = false;

}

function increaseFuzziness() {
    _fuzziness += _fuzStep;
    document.querySelector("#decreaseColButton").disabled = false;
    document.querySelector("#decreaseLumButton").disabled = false;

    if (_fuzziness >= 200) {
        _fuzziness = 200;
        document.querySelector("#increaseColButton").disabled = true;
        document.querySelector("#increaseLumButton").disabled = true;
    } else {
        document.querySelector("#increaseColButton").disabled = false;
        document.querySelector("#increaseLumButton").disabled = false;
    }
}

function decreaseFuzziness() {
    _fuzziness -= _fuzStep;
    document.querySelector("#increaseColButton").disabled = false;
    document.querySelector("#increaseLumButton").disabled = false;

    if (_fuzziness <= 0) {
        _fuzziness = 0;
        document.querySelector("#decreaseColButton").disabled = true;
        document.querySelector("#decreaseLumButton").disabled = true;
    } else {
        document.querySelector("#decreaseColButton").disabled = false;
        document.querySelector("#decreaseLumButton").disabled = false;
    }
}

async function runAction(actionSet,actionName)
{
	const actionTree = app.actionTree;
	var mySet = undefined;
	for(var i=0;i<actionTree.length;i++)
		if(actionTree[i].name==actionSet)
		{
			mySet = actionTree[i];
			break;
		}
		
	if(!mySet) return;
	var myAction = undefined;
	for(var i=0;i<mySet.actions.length;i++)
		if(mySet.actions[i].name==actionName)
		{
			myAction = mySet.actions[i];
			break;
		}
		if(myAction)
			myAction.play();
};

function openTutorial() {
	var ddValue = document.querySelector("#tutorialDD").value;
	var myUrl = _tutorialUrls[ddValue];
	if(!myUrl) myUrl = "https://www.shutterevolve.com/raya-pro-tutorial";
	require('uxp').shell.openExternal(myUrl);
}

async function deleteLayerMask() {
    try {
        var _obj = {
            "_obj": "delete",
            "_target": [{
                "_ref": "channel",
                "_enum": "channel",
                "_value": "mask"
            }]
        };

        return await action.batchPlay([_obj], {});
    } catch (e) {
       
    }
}

function hasLayerMask() {
    var res = action.batchPlay(
        [{
            "_obj": "get",
            "_target": {
                "_ref": [{
                    "_property": "userMaskEnabled"
                }, {
                    "_ref": "layer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }]
            }
        }], {
            "synchronousExecution": true
        });
    if (res[0].userMaskEnabled == true) return true;
    return false;
}


async function createInstaMask() {
    await action.batchPlay([
		
        {
            "_obj": "select",
            "_target": {
                "_ref": "channel",
                "_enum": "channel",
                "_value": "RGB"
            },
            "makeVisible": false,
            "_options": {
                "dialogOptions": "silent"
            }
        },
		{
            "_obj": "make",
            "_target": {
                "_ref": "adjustmentLayer"
            },
            "using": {
                "_obj": "adjustmentLayer",
                "type": {
                    "_obj": "curves",
                    "presetKind": {
                        "_enum": "presetKindType",
                        "_value": "presetKindDefault"
                    }
                }
            },
            "_options": {
                "dialogOptions": "silent"
            }
        },
        {
            "_obj": "select",
            "_target": {
                "_ref": "channel",
                "_enum": "channel",
                "_value": "RGB"
            },
            "makeVisible": false,
            "_options": {
                "dialogOptions": "silent"
            }
        },
        {
            "_obj": "set",
            "_target": {
                "_ref": "layer",
                "_enum": "ordinal",
                "_value": "targetEnum"
            },
            "to": {
                "_obj": "layer",
                "name": "InstaMask"
            },
            "_options": {
                "dialogOptions": "silent"
            }
        }
    ], {});

    const currLayer = app.activeDocument.activeLayers[0];
    await app.activeDocument.createLayerGroup({
        name: "InstaMask Group",
        fromLayers: [currLayer]
    });
    await action.batchPlay([{
        "_obj": "select",
        "_target": {
            "_ref": "layer",
            "_name": "InstaMask"
        },
        "makeVisible": false,
        "_options": {
            "dialogOptions": "silent"
        }
    }], {});
};

async function showColorPicker() {
    return await action.batchPlay([{
        _obj: "showColorPicker"
    }], {});
}

async function getLabColor(colorObj) {
    let colorSpace = {
        _obj: "convertColorToSpace",
        _target: { _ref: "application" }, 
        color: colorObj,
        colorSpace: {
            _enum: "colorSpace",
            _value: "lab"
        }
    };

    var res = await action.batchPlay([colorSpace], {});
    return res[0].color;
};

async function deleteLayerMask() {
    try {
        var _obj = {
            "_obj": "delete",
            "_target": [{
                "_ref": "channel",
                "_enum": "channel",
                "_value": "mask"
            }]
        };

        return await action.batchPlay([_obj], {});
    } catch (e) {
        console.log(e)
    }
}

//switch to mask
async function showLayerMask() {

			
    var _obj = { "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, 
			"makeVisible": true, "_options": { "dialogOptions": "dontDisplay" } };

    return await action.batchPlay([_obj], {});
}

//switch back from mask 
async function deselectLayerMask() {

			
    var _obj = {
   "_obj": "select",
   "_target": [
      {
         "_ref": "channel",
         "_enum": "channel",
         "_value": "RGB"
      }
   ],
   "makeVisible": false
};

    return await action.batchPlay([_obj], {});
}

//select mask
async function selectLayerMask() {
	
var _obj = { "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, 
		"makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } };

return await action.batchPlay([_obj], {});

}

async function hideMaskChannels() {
    var _obj = {
        "_obj": "hide",
        "_target": [{
            "_ref": "channel",
            "_enum": "channel",
            "_value": "mask"
        }],
        "_isCommand": true
    }
    return await action.batchPlay([_obj], {});
}

async function deleteMaskChannels() {
    //TODO - add channel ids (?)
    var _obj = {
        "_obj": "delete",
        "_target": [{
            "_ref": "channel",
            "_enum": "ordinal",
            "_value": "targetEnum"
        }],
        "_isCommand": true
    };

    return await action.batchPlay([_obj], {});
}

async function removeInstaMask() {

    try {
		var _obj1 = {
   "_obj": "select",
   "_target": [
      {
         "_ref": "layer",
         "_name": "InstaMask Group"
      }
   ],
   "makeVisible": false
};
        var _obj = {
            "_obj": "delete",
            "_target": [{
                    "_ref": "layer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                },
                {
                    "_ref": "layer",
                    "_name": "InstaMask Group"
                }
            ]
        };
		
       await action.batchPlay([_obj1,_obj], {});
    } catch (e) {
        console.log(e)
    }
	
	
}

async function instaMaskExists()
{
	
	for(var i=0;i<app.activeDocument.layerTree.length;i++)
		if(app.activeDocument.layerTree[i].name=="InstaMask Group")
			return true;
	
	return false;
}

async function selectInstaMask()
{
    await action.batchPlay([{
        "_obj": "select",
        "_target": {
            "_ref": "layer",
            "_name": "InstaMask"
        },
        "makeVisible": false,
        "_options": {
            "dialogOptions": "silent"
        }
    }], {});
}

function hasLayerMask() {
    var res = action.batchPlay(
        [{
            "_obj": "get",
            "_target": {
                "_ref": [{
                    "_property": "userMaskEnabled"
                }, {
                    "_ref": "layer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }]
            }
        }], {
            "synchronousExecution": true
        });
    if (res[0].userMaskEnabled == true) return true;
    return false;
}

function backupMaskExists() {
	console.log("backup exists");
    var res = action.batchPlay(
        [
			{
				   "_obj": "select",
				   "_target": [
				      {
				         "_ref": "channel",
				         "_name": "InstaMask Mask Backup"
				      }
				   ]
				},
				
				{
				   "_obj": "get",
				   "_target": [
				      {
				         "_property": "channelName"
				      },
				      {
				         "_ref": "channel",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
				      }
				   ]
				}], {
				   synchronousExecution: true
				});
				
				
				console.log(res);
    if (res.length>1 && res[1].channelName && res[1].channelName == "InstaMask Mask Backup") return true;
    return false;
}


async function loadOrCreateBackupMask()
{
	console.log("load or create backup");
	await selectInstaMask();

	if(backupMaskExists())
		
	await action.batchPlay([
		{
		   "_obj": "select",
		   "_target": [
		      {
		         "_ref": "channel",
		         "_enum": "channel",
		         "_value": "mask"
		      }
		   ],
		   "_isCommand": true
		},
		
		{
	   "_obj": "applyImageEvent",
	   "with": {
	      "_obj": "calculation",
	      "to": {
	         "_ref": "channel",
	         "_name": "InstaMask Mask Backup"
	      },
	      "preserveTransparency": true
	   }
	}

	], {});
	else
		await createBackupMask();

	
	
}

async function createBackupMask()
{
	console.log("create backup");
	await action.batchPlay([
		{
		   "_obj": "select",
		   "_target": [
		      {
		         "_ref": "channel",
		         "_enum": "channel",
		         "_value": "mask"
		      }
		   ],
		   "_isCommand": true
		},
			{
			   "_obj": "duplicate",
			   "_target": [
			      {
			         "_ref": "channel",
			         "_enum": "ordinal",
			         "_value": "targetEnum"
			      }
			   ],
			   "_isCommand": true
			},
			{
			   "_obj": "set",
			   "_target": [
			      {
			         "_ref": "channel",
			         "_enum": "ordinal",
			         "_value": "targetEnum"
			      }
			   ],
			   "to": {
			      "_obj": "channel",
			      "name": "InstaMask Mask Backup"
			   }
			},
			{
			   "_obj": "hide",
			   "null": [
			      {
			         "_ref": "channel",
			         "_name": "InstaMask Mask Backup"
			      }
			  ]
			},
			{
			   "_obj": "show",
			   "null": [
			      {
			         "_ref": "channel",
			         "_name": "InstaMask Mask"
			      }
			  ]
			},
			{
			   "_obj": "select",
			   "_target": [
			      {
			         "_ref": "channel",
			         "_enum": "channel",
			         "_value": "mask"
			      }
			   ],
			   "_isCommand": true
			}
		], {});	
}

async function loadBackupMask()
{
	
	await selectInstaMask();
	
	if(backupMaskExists())
		
	await action.batchPlay([
		{
		   "_obj": "select",
		   "_target": [
		      {
		         "_ref": "channel",
		         "_enum": "channel",
		         "_value": "mask"
		      }
		   ],
		   "_isCommand": true
		},
		
		{
	   "_obj": "applyImageEvent",
	   "with": {
	      "_obj": "calculation",
	      "to": {
	         "_ref": "channel",
	         "_name": "InstaMask Mask Backup"
	      },
	      "preserveTransparency": true
	   }
	}

	], {});
	
	
	
}

async function deleteBackupMask()
{
	var check = backupMaskExists();
	if(!check) return;
	
	var res = await action.batchPlay([{
	   "_obj": "select",
	   "_target": [
	      {
	         "_ref": "channel",
	         "_name": "InstaMask Mask Backup"
	      }
	   ],
       "_options": {
           "dialogOptions": "silent"
       }
	}], {});

	action.batchPlay([{
	   "_obj": "delete",
	   "_target": [
	      {
	         "_ref": "channel",
	         "_enum": "ordinal",
	         "_value": "targetEnum"
	      }
	   ]
	}
	], {});

	
}

async function selectBlending()
{
    await action.batchPlay([{
        "_obj": "select",
        "_target": {
            "_ref": "layer",
            "_name": "Blending"
        },
        "makeVisible": false,
        "_options": {
            "dialogOptions": "silent"
        }
    }], {});
}


async function showDarkFixLayer(n)
{

	try{
		var fixGroup = undefined;
		for(var i=0;i<app.activeDocument.layerTree.length;i++)
			if(app.activeDocument.layerTree[i].name=="Dark Fix Temp")
			{
			fixGroup = app.activeDocument.layerTree[i];
			break;
			}
		if(!fixGroup)
			{
				app.showAlert(localisedAlert("pressFix"));
				return;
			}
			
		}catch(e){console.log(e)}
	
	
	for(var i=1;i<=9;i++)
	await action.batchPlay([
		{
		   "_obj": "hide",
		   "_target": [
		      {
		         "_ref": "layer",
				  "_name": "Dark Fix "+i.toString()
		      }
		   ],
		   "_isCommand": true
		}
	], {});
	
	await action.batchPlay([
		{
		   "_obj": "hide",
		   "_target": [
		      {
		         "_ref": "layer",
		         "_name": "Original Dark Blend"
		      }
		   ],
		   "_isCommand": true
		}], {});
		
		await action.batchPlay([{
		   "_obj": "show",
		   "_target": [
		      {
		         "_ref": "layer",
		         "_name": "Dark Fix "+n
		      }
		   ],
		   "_isCommand": true
		},
		{
		   "_obj": "select",
		   "_target": [
		      {
		         "_ref": "layer",
		         "_name": "Dark Fix "+n
		      }
		   ],
		   "makeVisible": false
		}], {});
		
		
}


async function blendIf(darkGrey,darkRed,darkGreen,darkBlue,brightGrey,brightRed,brightGreen,brightBlue,_name)
{
	
	if(!darkGrey) darkGrey=0;
	if(!darkRed) darkRed =0;
	if(!darkGreen) darkGreen = 0;
	if(!darkBlue) darkBlue = 0;
	
	if(!brightGrey) brightGrey=0;
	if(!brightRed) brightRed =0;
	if(!brightGreen) brightGreen = 0;
	if(!brightBlue) brightBlue = 0;
	console.log(darkGrey,darkRed,darkGreen,darkBlue,brightGrey,brightRed,brightGreen,brightBlue,_name);
	action.batchPlay([
	{
	   "_obj": "set",
	   "_target": [
	      {
	         "_ref": "layer",
	         "_enum": "ordinal",
	         "_value": "targetEnum"
	      }
	   ],
	   "to": {
	      "_obj": "layer",
	      "blendRange": [
	         {
	            "_obj": "blendRange",
	            "channel": {
	               "_ref": "channel",
	               "_enum": "channel",
	               "_value": "gray"
	            },
	            "srcBlackMin": 0,
	            "srcBlackMax": 0,
	            "srcWhiteMin": brightGrey,
	            "srcWhiteMax": 255,
	            "destBlackMin": 0,
	            "destBlackMax": darkGrey,
	            "destWhiteMin": 255,
	            "desaturate": 255
	         },
	         {
	            "_obj": "blendRange",
	            "channel": {
	               "_ref": "channel",
	               "_enum": "channel",
	               "_value": "red"
	            },
	            "srcBlackMin": 0,
	            "srcBlackMax": 0,
	            "srcWhiteMin": brightRed,
	            "srcWhiteMax": 255,
	            "destBlackMin": 0,
	            "destBlackMax": darkRed,
	            "destWhiteMin": 255,
	            "desaturate": 255
	         },
	         {
	            "_obj": "blendRange",
	            "channel": {
	               "_ref": "channel",
	               "_enum": "channel",
	               "_value": "grain"
	            },
	            "srcBlackMin": 0,
	            "srcBlackMax": 0,
	            "srcWhiteMin": brightGreen,
	            "srcWhiteMax": 255,
	            "destBlackMin": 0,
	            "destBlackMax": darkGreen,
	            "destWhiteMin": 255,
	            "desaturate": 255
	         },
	         {
	            "_obj": "blendRange",
	            "channel": {
	               "_ref": "channel",
	               "_enum": "channel",
	               "_value": "blue"
	            },
	            "srcBlackMin": 0,
	            "srcBlackMax": 0,
	            "srcWhiteMin": brightBlue,
	            "srcWhiteMax": 255,
	            "destBlackMin": 0,
	            "destBlackMax": darkBlue,
	            "destWhiteMin": 255,
	            "desaturate": 255
	         }
	      ],
	      "layerEffects": {
	         "_obj": "layerEffects",
	         "scale": {
	            "_unit": "percentUnit",
	            "_value": 100
	         }
	      }
	   }
	}
	], {
	   "modalBehavior": "fail",
	   "synchronousExecution": false,
		historyStateInfo:{
			name:_name,
			target:
			{
				_ref:"document",
				_enum:"ordinal",
				_value:"targetEnum"
			}
		}
	});
}

const _tutorialUrls = {
	"Getting Started":"https://www.shutterevolve.com/getting-started-uxp/",
	"Luminosity Masks":"https://www.shutterevolve.com/luminosity-masks-uxp/",
	"Exposure Blending Masterclass":"https://www.shutterevolve.com/exposure-blend-like-an-expert-uxp/",
	"Dodge and Burn":"https://www.shutterevolve.com/dodge-and-burn-uxp/",
	"Colour Centre":"https://www.shutterevolve.com/colour-centre-uxp/",
	"Quick Blending":"https://www.shutterevolve.com/quick-blending-uxp/",
	"Precision Masks":"https://www.shutterevolve.com/precision-masks-uxp/",
	"Filter and Finish":"https://www.shutterevolve.com/filters-and-finish-uxp/",
	"Sign Up":"https://www.shutterevolve.com/the-free-beginners-photoshop-course-for-photographers/"
}; 	

function runScript_cc(func, arg) {
	if(!app.documents.length) return;
	runScriptAsync_cc(func, arg);
}

function runScript_db(func, arg) {
	if(!app.documents.length) return;
	runScriptAsync_db(func, arg);
}

function runScript_ff(func, arg) {
	if(!app.documents.length) return;
	runScriptAsync_ff(func, arg);
}

function runScript_hub(func, arg) {
	if(!app.documents.length) return;
	runScriptAsync_hub(func, arg);
}

function runScript_im(func, arg) {
	if(!app.documents.length) return;
	
	
	//setting channel for masks as rgb/red/green/blue, based on switch
	if(func.indexOf("Bright ")==0 || func.indexOf("Dark ")==0 || func.indexOf("Midtone ")==0)
		arg = [getImMaskChannel()];
	
	runScriptAsync_im(func, arg);
}

function runScript_pm(func, arg) {
	if(!app.documents.length) return;
	runScriptAsync_pm(func, arg);
}

function runScript_qb(func, arg) {
	if(!app.documents.length) return;
	runScriptAsync_qb(func, arg);
}


function runScript_ze(func, arg) {
	if(!app.documents.length) return;
	runScriptAsync_ze(func, arg);
}

async function runScriptAsync_ze(func, arg) {
    try {
		console.log(func);
        switch (func) {
		case "Toggle Visibility":
			{
				var docRef = app.activeDocument;
				var allLayers = docRef.layers;
				var layerName = arg;
				for(var i=0;i<allLayers.length;i++)
				{ 
					console.log(i);
					console.log(allLayers[i].name);
					if(allLayers[i].name==layerName)
					{
						allLayers[i].visible=!allLayers[i].visible;
						
						$("#"+zeLayerNames[layerName]+"Vis").removeClass("on");
						
						if (allLayers[i].visible)
							$("#"+zeLayerNames[layerName]+"Vis").addClass("on");
						else
							$("#"+zeLayerNames[layerName]+"Vis").removeClass("on");
						
						break;
					}
				}
			}
			break;
		case "Update Opacity":
			{
				console.log(arg);
				var docRef = app.activeDocument;
				var allLayers = docRef.layers;
				console.log(allLayers);
				if(!arg[0]) 
				var value=0;
					else
				var value = Number(arg[0]);
				var layerName = arg[1];
				console.log(layerName);
				for(var i=0;i<allLayers.length;i++)
				{ 
					console.log(i);
					console.log(allLayers[i].name);
					if(allLayers[i].name==layerName)
					{
						allLayers[i].opacity=value;
						break;
					}
				}
			}
			break;
			
		case "Reset":
		{
			resetZESliders();
			var docRef = app.activeDocument;
			var allLayers = docRef.layers;
			var myLayers = [];
			var myLayerNames = ["Zone Vignette","Zone Cool","Zone Warm","Zone Orton","Zone Saturation","Zone Desaturate","Zone Vibrance","Zone Darken","Zone Details","Zone Brighten"].join(",");
			for(var i=0;i<allLayers.length;i++)
			{
				if(myLayerNames.indexOf(allLayers[i].name)!=-1)
					allLayers[i].opacity=0;
			}
			
			await action.batchPlay([({_obj:"collapseAllGroupsEvent", _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Delete Target Mask":
		{
		await action.batchPlay([
		({_obj:"select", _target:[({_ref:"channel", _enum:"channel", _value:"mask"})], makeVisible:false, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"delete", _target:[({_ref:"channel", _enum:"ordinal", _value:"targetEnum"})], _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Target Blacks":
		{
			await deleteLayerMask();
		await action.batchPlay([
		({_obj:"make", new:{_class:"channel"}, at:({_ref:"channel", _enum:"channel", _value:"mask"}), using:{_enum:"userMaskEnabled", _value:"revealAll"}, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"select", _target:[({_ref:"channel", _enum:"channel", _value:"mask"})], makeVisible:false, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, invert:true, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, invert:true, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, invert:true, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, invert:true, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}, _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Target Shadows":
		{
			await deleteLayerMask();
		await action.batchPlay([
		({_obj:"make", new:{_class:"channel"}, at:({_ref:"channel", _enum:"channel", _value:"mask"}), using:{_enum:"userMaskEnabled", _value:"revealAll"}, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"select", _target:[({_ref:"channel", _enum:"channel", _value:"mask"})], makeVisible:false, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, invert:true, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}, _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Target Midtones":
		{
			await deleteLayerMask();
		await action.batchPlay([
		({_obj:"colorRange", colors:{_enum:"colors", _value:"midtones"}, midtonesFuzziness:100, midtonesLowerLimit:131, midtonesUpperLimit:162, colorModel:0, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"make", new:{_class:"channel"}, at:({_ref:"channel", _enum:"channel", _value:"mask"}), using:{_enum:"userMaskEnabled", _value:"revealSelection"}, _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Target Highlights":
		{
			await deleteLayerMask();
		await action.batchPlay([
		({_obj:"make", new:{_class:"channel"}, at:({_ref:"channel", _enum:"channel", _value:"mask"}), using:{_enum:"userMaskEnabled", _value:"revealAll"}, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"select", _target:[({_ref:"channel", _enum:"channel", _value:"mask"})], makeVisible:false, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}, _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Target Whites":
		{
			await deleteLayerMask();
		await action.batchPlay([
		({_obj:"make", new:{_class:"channel"}, at:({_ref:"channel", _enum:"channel", _value:"mask"}), using:{_enum:"userMaskEnabled", _value:"revealAll"}, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"select", _target:[({_ref:"channel", _enum:"channel", _value:"mask"})], makeVisible:false, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}, _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}, _options:{dialogOptions:"dontDisplay"}})
		],{});
		}
		break;
		case "Del Brighten":
		{
		await action.batchPlay([
		({_obj:"select", _target:[({_ref:"layer", _name:"Zone Brighten"})], makeVisible:false, layerID:[30], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], layerID:[157], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"collapseAllGroupsEvent", _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Del Details":
		{
		await action.batchPlay([
		({_obj:"select", _target:[({_ref:"layer", _name:"Zone Details"})], makeVisible:false, layerID:[41], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], layerID:[157], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"collapseAllGroupsEvent", _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Del Darken":
		{
		await action.batchPlay([
		({_obj:"select", _target:[({_ref:"layer", _name:"Zone Darken"})], makeVisible:false, layerID:[31], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], layerID:[157], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"collapseAllGroupsEvent", _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Del Vibrance":
		{
		await action.batchPlay([
		({_obj:"select", _target:[({_ref:"layer", _name:"Zone Vibrance"})], makeVisible:false, layerID:[348], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], layerID:[157], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"collapseAllGroupsEvent", _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Del Desaturate":
		{
		await action.batchPlay([
		({_obj:"select", _target:[({_ref:"layer", _name:"Zone Desaturate"})], makeVisible:false, layerID:[33], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], layerID:[157], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"collapseAllGroupsEvent", _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Del Saturation":
		{
		await action.batchPlay([
		({_obj:"select", _target:[({_ref:"layer", _name:"Zone Saturation"})], makeVisible:false, layerID:[34], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], layerID:[157], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"collapseAllGroupsEvent", _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Del Orton":
		{
		await action.batchPlay([
		({_obj:"select", _target:[({_ref:"layer", _name:"Zone Orton"})], makeVisible:false, layerID:[350], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], layerID:[157], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"collapseAllGroupsEvent", _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Del Warm":
		{
		await action.batchPlay([
		({_obj:"select", _target:[({_ref:"layer", _name:"Zone Warm"})], makeVisible:false, layerID:[351], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], layerID:[157], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"collapseAllGroupsEvent", _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Del Cool":
		{
		await action.batchPlay([
		({_obj:"select", _target:[({_ref:"layer", _name:"Zone Cool"})], makeVisible:false, layerID:[352], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], layerID:[157], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"collapseAllGroupsEvent", _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Del Vignette":
		{
		await action.batchPlay([
		({_obj:"select", _target:[({_ref:"layer", _name:"Zone Vignette"})], makeVisible:false, layerID:[353], _options:{dialogOptions:"dontDisplay"}}), 
		({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], layerID:[157], _options:{dialogOptions:"dontDisplay"}}),  
		({_obj:"collapseAllGroupsEvent", _options:{dialogOptions:"dontDisplay"}})],{});
		}
		break;
		case "Apply Zone Editor":
		{
			
			//delete if exists?
			/*
			try{
			await action.batchPlay([ 
				({_obj:"delete", _target:[({_ref:"layer", _name:"Zone Editor"})], _options:{dialogOptions:"dontDisplay"}})],{});
			}catch(e){}
			*/
			
			resetZESliders();
			
			action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 29, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Zone Brighten" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "white" }, "opacity": { "_unit": "percentUnit",
			"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
			"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 30, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Zone Darken" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "black" }, "opacity": { "_unit": "percentUnit",
			"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
			"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_class": "vibrance" } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Zone Vibrance" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
			"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "vibrance" ,"vibrance": 100 }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "delete","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "blackAndWhite" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "red": 40, "yellow": 60, "$Grn ": 40, "cyan": 60, "blue": 20, "magenta": 80, "useTint": false, "tintColor": { "_obj": "RGBColor" ,"red": 225.000457763672, "$Grn ": 211.000671386719, "blue": 179.001159667969 } } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Zone Desaturate" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "delete","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
			"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_class": "vibrance" } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "delete","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Zone Saturation" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "vibrance" ,"saturation": 100 }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
			"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Zone Orton" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "gaussianBlur","radius": { "_unit": "pixelsUnit",
			"_value": 24.9 }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "levels","presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "levelsAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "input": [
				0,
				242
			] }
			], "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
			"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "luminosity" } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 67.06, "a": 32, "b": 120 }, "density": 25, "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "photoFilter" ,"density": 50 }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "delete","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Zone Warm" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
			"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 67.06, "a": 32, "b": 120 }, "density": 25, "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 61, "a": -59, "b": -119 }, "density": 39 }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Zone Cool" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "delete","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
			"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 37, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Zone Vignette" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "black" }, "opacity": { "_unit": "percentUnit",
			"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"fillOpacity": { "_unit": "percentUnit",
			"_value": 0 }, "layerEffects": { "_obj": "layerEffects" ,"scale": { "_unit": "percentUnit",
			"_value": 100 }, "gradientFill": { "_obj": "gradientFill" ,"enabled": true, "present": true, "showInDialog": true, "mode": { "_enum": "blendMode", "_value": "softLight" }, "opacity": { "_unit": "percentUnit",
			"_value": 38 }, "gradient": { "_obj": "gradientClassEvent" ,"name": "Custom", "gradientForm": { "_enum": "gradientForm", "_value": "customStops" }, "interfaceIconFrameDimmed": 4096, "colors": [
				{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 0, "midpoint": 50 },
				{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 4096, "midpoint": 50 }
			], "transparency": [
				{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
			"_value": 100 }, "location": 0, "midpoint": 50 },
				{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
			"_value": 0 }, "location": 4096, "midpoint": 50 }
			] }, "angle": { "_unit": "angleUnit",
			"_value": 90 }, "type": { "_enum": "gradientType", "_value": "radial" }, "reverse": true, "dither": false, "align": true, "scale": { "_unit": "percentUnit",
			"_value": 150 }, "offset": { "_obj": "paint" ,"horizontal": { "_unit": "percentUnit",
			"_value": 0 }, "vertical": { "_unit": "percentUnit",
			"_value": 0 } } } } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": [{ "_property": "layerEffects" }, { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }]}, "to": { "_obj": "layerEffects" ,"scale": { "_unit": "percentUnit",
			"_value": 100 }, "gradientFill": { "_obj": "gradientFill" ,"enabled": true, "present": true, "showInDialog": true, "mode": { "_enum": "blendMode", "_value": "softLight" }, "opacity": { "_unit": "percentUnit",
			"_value": 68 }, "gradient": { "_obj": "gradientClassEvent" ,"name": "Custom", "gradientForm": { "_enum": "gradientForm", "_value": "customStops" }, "interfaceIconFrameDimmed": 4096, "colors": [
				{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 0, "midpoint": 50 },
				{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 4096, "midpoint": 50 }
			], "transparency": [
				{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
			"_value": 100 }, "location": 0, "midpoint": 50 },
				{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
			"_value": 0 }, "location": 4096, "midpoint": 50 }
			] }, "angle": { "_unit": "angleUnit",
			"_value": 90 }, "type": { "_enum": "gradientType", "_value": "radial" }, "reverse": true, "dither": false, "align": true, "scale": { "_unit": "percentUnit",
			"_value": 150 }, "offset": { "_obj": "paint" ,"horizontal": { "_unit": "percentUnit",
			"_value": 0 }, "vertical": { "_unit": "percentUnit",
			"_value": 0 } } } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
			"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Zone Darken" }, "makeVisible": false, "layerID": [
				451
			], "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "overlay" } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Zone Brighten" }, "makeVisible": false, "layerID": [
				450
			], "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "overlay" } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "delete","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Temp" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Temp1" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Temp" }, "makeVisible": false, "layerID": [
				88
			], "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
				88
			], "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Temp1" }, "makeVisible": false, "layerID": [
				90
			], "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "invert", "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "vividLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "surfaceBlur","radius": { "_unit": "pixelsUnit",
			"_value": 34 }, "threshold": 36, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Zone Details" }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Temp1" }, "makeVisible": false, "layerID": [
				93
			], "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
				93
			], "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Zone Details" }, "makeVisible": false, "layerID": [
				500
			], "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "overlay" } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
			"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], { "synchronousExecution": true });
			
			var docRef = app.activeDocument;
			var allLayers = docRef.layers;
			var myLayers = [];
			var myLayerNames = ["Zone Vignette","Zone Cool","Zone Warm","Zone Orton","Zone Saturation","Zone Desaturate","Zone Vibrance","Zone Darken","Zone Details","Zone Brighten"].join(",");
			for(var i=0;i<allLayers.length;i++)
			{
				if(myLayerNames.indexOf(allLayers[i].name)!=-1)
					myLayers.push(allLayers[i]);
			}
			await docRef.createLayerGroup({name:"Zone Editor",fromLayers:myLayers}); 	
		}
		break;
		
		case "Undo": {
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "historyState", "_enum": "ordinal", "_value": "previous" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		
		case "Redo": {
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "historyState", "_enum": "ordinal", "_value": "next" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		
		
		}//switch end
    } catch (e) {
        console.log(e + ":" + e.line);
    }

}

async function runScriptAsync_qb(func, arg) {

    try {
        switch (func) {
		case "updateBlends":
				{
	                var docRef = app.activeDocument;
	                var layerRef = docRef.activeLayers[0];
	                var historyName = "Blend "+layerRef.name;
	                   /*
	                try{
	                if(docRef.activeHistoryState.name == historyName) 
	                        docRef.activeHistoryState = docRef.historyStates[docRef.historyStates.length-2];
	                }catch(e){
                    
	                }  
	               */
	                     
	                blendIf(arg[0],arg[1],arg[2],arg[3],arg[4],arg[5],arg[6],arg[7],historyName);
	              
                
	          
				}
				break;
				case "Gradient Mask Soft": {
			
				action.batchPlay([({_obj:"make", _target:[({_ref:"contentLayer"})], using:{_obj:"contentLayer", type:{_obj:"gradientLayer", reverse:true, angle:{_unit:"angleUnit", _value:90}, type:{_enum:"gradientType", _value:"linear"}, gradient:{_obj:"gradientClassEvent", name:"Foreground to Background", gradientForm:{_enum:"gradientForm", _value:"customStops"}, interfaceIconFrameDimmed:4096, colors:[({_obj:"colorStop", color:{_obj:"RGBColor", red:255, grain:255, blue:255}, type:{_enum:"colorStopType", _value:"userStop"}, location:0, midpoint:50}), ({_obj:"colorStop", color:{_obj:"RGBColor", red:0, grain:0, blue:0}, type:{_enum:"colorStopType", _value:"userStop"}, location:4096, midpoint:50})], transparency:[({_obj:"transferSpec", opacity:{_unit:"percentUnit", _value:100}, location:0, midpoint:50}), ({_obj:"transferSpec", opacity:{_unit:"percentUnit", _value:100}, location:4096, midpoint:50})]}}}}), ({_obj:"set", _target:[({_ref:"channel", _property:"selection"})], to:{_ref:"channel", _enum:"channel", _value:"RGB"}}), ({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})]}), ({_obj:"make", new:{_class:"channel"}, at:{_ref:"channel", _enum:"channel", _value:"mask"}, using:{_enum:"userMaskEnabled", _value:"revealSelection"}})], {  });
				};
				break;
				case "Refine Mask": {
				await selectLayerMask();
				action.batchPlay([{ "_obj": "refineSelectionEdge","refineEdgeBorderRadius": { "_unit": "pixelsUnit",
				"_value": 0 }, "refineEdgeBorderContrast": { "_unit": "percentUnit",
				"_value": 0 }, "refineEdgeSmooth": 0, "refineEdgeFeatherRadius": { "_unit": "pixelsUnit",
				"_value": 0 }, "refineEdgeChoke": { "_unit": "percentUnit",
				"_value": 0 }, "refineEdgeAutoRadius": false, "refineEdgeDecontaminate": false, "refineEdgeOutput": { "_enum": "refineEdgeOutput", "_value": "selectionOutputToUserMask" }, "_options": { "dialogOptions": "display" } }], {  });
				};
				break;


        } //switch end

    } catch (e) {
        console.log(e + ":" + e.line);
    }
}

async function runScriptAsync_pm(func, arg) {

    try {
        switch (func) {

			case "Auto Dark": {
				
				if(hasLayerMask()) await deleteLayerMask();
				
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Blending" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			
			app.activeDocument.activeLayers[0].visible = false;
		
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "1" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "2" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			
			await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "3" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "4" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "5" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "6" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "1" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelectionContinuous" }, "makeVisible": false, "layerID": [
				6,
				8,
				9,
				10,
				11,
				12
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 13, "layerSectionEnd": 14, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Precision Masks" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Blending" }, "makeVisible": false, "layerID": [
				3
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			
	await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, 
			"makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": [{ "_ref": "channel", "_enum": "channel", "_value": "mask" },{"_ref": "layer",
               "_name": "1"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "show","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
		
			case "Auto Bright": {
				app.activeDocument.activeLayers[0].visible = true;
				if(hasLayerMask()) await deleteLayerMask();
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Blending" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "1" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Blending" }, "makeVisible": false, "layerID": [
				3
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "invert", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "temp" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "1" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "2" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "3" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "4" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "5" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "6" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "1" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelectionContinuous" }, "makeVisible": false, "layerID": [
				6,
				8,
				9,
				10,
				11,
				12
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 13, "layerSectionEnd": 14, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Precision Masks" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "temp" }, "makeVisible": false, "layerID": [
				7
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
				7
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Blending" }, "makeVisible": false, "layerID": [
				3
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			
	await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, 
			"makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		
			
			await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": [{ "_ref": "channel", "_enum": "channel", "_value": "mask" },{"_ref": "layer",
			               "_name": "1"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "PM 1": {
				if(app.activeDocument.activeLayers[0].name!="Blending")
				{
					app.showAlert(localisedAlert("pressAuto"));
					break;	
				};
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, 
				"makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		
			
				await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": [{ "_ref": "channel", "_enum": "channel", "_value": "mask" },{"_ref": "layer",
				               "_name": "1"}]}, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "PM 2": {
				if(app.activeDocument.activeLayers[0].name!="Blending")
				{
					app.showAlert(localisedAlert("pressAuto"));
					break;	
				};
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, 
				"makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		
			
				await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": [{ "_ref": "channel", "_enum": "channel", "_value": "mask" },{"_ref": "layer",
				               "_name": "2"}]}, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "PM 3": {
				if(app.activeDocument.activeLayers[0].name!="Blending")
				{
					app.showAlert(localisedAlert("pressAuto"));
					break;	
				};
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, 
				"makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		
			
				await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": [{ "_ref": "channel", "_enum": "channel", "_value": "mask" },{"_ref": "layer",
				               "_name": "3"}]}, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "PM 6": {
				if(app.activeDocument.activeLayers[0].name!="Blending")
				{
					app.showAlert(localisedAlert("pressAuto"));
					break;	
				};
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, 
				"makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		
			
				await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": [{ "_ref": "channel", "_enum": "channel", "_value": "mask" },{"_ref": "layer",
				               "_name": "6"}]}, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "PM 5": {
				if(app.activeDocument.activeLayers[0].name!="Blending")
				{
					app.showAlert(localisedAlert("pressAuto"));
					break;	
				};
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, 
				"makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		
			
				await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": [{ "_ref": "channel", "_enum": "channel", "_value": "mask" },{"_ref": "layer",
				               "_name": "5"}]}, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "PM 4": {
				if(app.activeDocument.activeLayers[0].name!="Blending")
				{
					app.showAlert(localisedAlert("pressAuto"));
					break;	
				};
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, 
				"makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		
			
				await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": [{ "_ref": "channel", "_enum": "channel", "_value": "mask" },{"_ref": "layer",
				               "_name": "4"}]}, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Select": {
				var res = await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Precision Masks" }, "makeVisible": false, "_options": { "dialogOptions": "silent" } }], { });
			
				if(res[0].message)
				{
					app.showAlert("No Precision mask to select");
					
				}
				else
				{
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Precision Masks" }, "makeVisible": false, "layerID": [
				30
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Blended" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
				}
			};
			break;
			
			case "Adjust": {
				await selectBlending();
				await showLayerMask();
				await action.batchPlay([
				{
				   "_obj": "levels",
				   "presetKind": {
				      "_enum": "presetKindType",
				      "_value": "presetKindDefault"
				   },
				   "_options": { "dialogOptions": "display" }
				}
				], {});
				await deselectLayerMask();
			}
			break;


			case "Cancel Blend": {
				var res = await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Precision Masks" }, "makeVisible": false, "_options": { "dialogOptions": "silent" } }], { });
				if(res[0].message)
				{
					app.showAlert("No Precision mask to cancel");
				}
				else
				{
				await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
				await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Blending Canceled" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
				
	            if (hasLayerMask())
	                await deleteLayerMask();
					
				}
				};
			break;
	
			
			case "Add colour": {
			await action.batchPlay([
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "Blending"
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "channel",
        _property: "selection"
      })
    ],
    to: {
      _ref: "channel",
      _enum: "channel",
      _value: "mask"
    }
  }),
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "adjustmentLayer"
      })
    ],
    using: {
      _obj: "adjustmentLayer",
      type: {
        _obj: "curves",
        presetKind: {
          _enum: "presetKindType",
          _value: "presetKindDefault"
        }
      }
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "1"
    }
  }),
  ({
    _obj: "copyToLayer"
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "2"
    }
  }),
  ({
    _obj: "copyToLayer"
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "3"
    }
  }),
  ({
    _obj: "copyToLayer"
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "4"
    }
  }),
  ({
    _obj: "copyToLayer"
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "5"
    }
  }),
  ({
    _obj: "copyToLayer"
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "6"
    }
  }),
  ({
    _obj: "colorRange",
    fuzziness: 100,
    minimum: {
      _obj: "labColor",
      luminance: 43.04,
      a: 67.04,
      b: 52.1
    },
    maximum: {
      _obj: "labColor",
      luminance: 43.04,
      a: 67.04,
      b: 52.1
    },
    colorModel: 0,
	"_options": { "dialogOptions": "display" }
  }),
  ({
    _obj: "fill",
    using: {
      _enum: "fillContents",
      _value: "white"
    },
    opacity: {
      _unit: "percentUnit",
      _value: 100
    },
    mode: {
      _enum: "blendMode",
      _value: "normal"
    }
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "5"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "fill",
    using: {
      _enum: "fillContents",
      _value: "white"
    },
    opacity: {
      _unit: "percentUnit",
      _value: 90
    },
    mode: {
      _enum: "blendMode",
      _value: "normal"
    }
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "4"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "fill",
    using: {
      _enum: "fillContents",
      _value: "white"
    },
    opacity: {
      _unit: "percentUnit",
      _value: 80
    },
    mode: {
      _enum: "blendMode",
      _value: "normal"
    }
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "3"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "fill",
    using: {
      _enum: "fillContents",
      _value: "white"
    },
    opacity: {
      _unit: "percentUnit",
      _value: 70
    },
    mode: {
      _enum: "blendMode",
      _value: "normal"
    }
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "2"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "fill",
    using: {
      _enum: "fillContents",
      _value: "white"
    },
    opacity: {
      _unit: "percentUnit",
      _value: 60
    },
    mode: {
      _enum: "blendMode",
      _value: "normal"
    }
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "1"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "fill",
    using: {
      _enum: "fillContents",
      _value: "white"
    },
    opacity: {
      _unit: "percentUnit",
      _value: 50
    },
    mode: {
      _enum: "blendMode",
      _value: "normal"
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "channel",
        _property: "selection"
      })
    ],
    to: {
      _enum: "ordinal",
      _value: "none"
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "channel",
        _property: "selection"
      })
    ],
    to: {
      _ref: "channel",
      _enum: "ordinal",
      _value: "targetEnum"
    }
  }),
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "adjustmentLayer"
      })
    ],
    using: {
      _obj: "adjustmentLayer",
      type: {
        _obj: "curves",
        presetKind: {
          _enum: "presetKindType",
          _value: "presetKindDefault"
        }
      }
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "Original"
    }
  }),
  ({
    _obj: "applyImageEvent",
    with: {
      _obj: "calculation",
      to: {
        _ref: [
          ({
            _ref: "channel",
            _enum: "channel",
            _value: "mask"
          }),
          ({
            _ref: "layer",
            _name: "1"
          })
        ]
      },
      preserveTransparency: true
    }
  }),

  
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "6"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "1"
      })
    ],
    selectionModifier: {
      _enum: "selectionModifierType",
      _value: "addToSelectionContinuous"
    },
    makeVisible: false
  }),
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "layerSection"
      })
    ],
    from: {
      _ref: "layer",
      _enum: "ordinal",
      _value: "targetEnum"
    },
    layerSectionStart: 83,
    layerSectionEnd: 84,
    name: "Group 1"
  }),
  
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "Colour"
    }
  })
], {});

/*var colorGroup = await app.activeDocument.createLayerGroup({
    name: "Colour",
    fromLayers: [currLayer]
});*/
			};
			break;
	
			
			case "Subtract Colour": {
			await action.batchPlay([({_obj:"set", _target:[({_ref:"channel", _property:"selection"})], to:{_ref:"channel", _enum:"ordinal", _value:"targetEnum"}}), ({_obj:"make", _target:[({_ref:"adjustmentLayer"})], using:{_obj:"adjustmentLayer", type:{_obj:"curves", presetKind:{_enum:"presetKindType", _value:"presetKindDefault"}}}}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"1"}}), ({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"2"}}), ({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"3"}}), ({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"4"}}), ({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"5"}}), ({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"6"}}), ({_obj:"colorRange", fuzziness:100, minimum:{_obj:"labColor", luminance:90.69, a:6.93, b:-2.82}, maximum:{_obj:"labColor", luminance:90.69, a:6.93, b:-2.82}, colorModel:0, "_options": { "dialogOptions": "display" }}), ({_obj:"fill", using:{_enum:"fillContents", _value:"black"}, opacity:{_unit:"percentUnit", _value:100}, mode:{_enum:"blendMode", _value:"normal"}}), ({_obj:"select", _target:[({_ref:"layer", _name:"5"})], makeVisible:false}), ({_obj:"fill", using:{_enum:"fillContents", _value:"black"}, opacity:{_unit:"percentUnit", _value:90}, mode:{_enum:"blendMode", _value:"normal"}}), ({_obj:"select", _target:[({_ref:"layer", _name:"4"})], makeVisible:false}), ({_obj:"fill", using:{_enum:"fillContents", _value:"black"}, opacity:{_unit:"percentUnit", _value:80}, mode:{_enum:"blendMode", _value:"normal"}}), ({_obj:"select", _target:[({_ref:"layer", _name:"3"})], makeVisible:false}), ({_obj:"fill", using:{_enum:"fillContents", _value:"black"}, opacity:{_unit:"percentUnit", _value:70}, mode:{_enum:"blendMode", _value:"normal"}}), ({_obj:"select", _target:[({_ref:"layer", _name:"2"})], makeVisible:false}), ({_obj:"fill", using:{_enum:"fillContents", _value:"black"}, opacity:{_unit:"percentUnit", _value:60}, mode:{_enum:"blendMode", _value:"normal"}}), ({_obj:"select", _target:[({_ref:"layer", _name:"1"})], makeVisible:false}), ({_obj:"fill", using:{_enum:"fillContents", _value:"black"}, opacity:{_unit:"percentUnit", _value:50}, mode:{_enum:"blendMode", _value:"normal"}}), ({_obj:"set", _target:[({_ref:"channel", _property:"selection"})], to:{_enum:"ordinal", _value:"none"}}), ({_obj:"set", _target:[({_ref:"channel", _property:"selection"})], to:{_ref:"channel", _enum:"ordinal", _value:"targetEnum"}}), ({_obj:"make", _target:[({_ref:"adjustmentLayer"})], using:{_obj:"adjustmentLayer", type:{_obj:"curves", presetKind:{_enum:"presetKindType", _value:"presetKindDefault"}}}}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Original"}}), ({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"mask"}), ({_ref:"layer", _name:"1"})]}, preserveTransparency:true}}), 
				({_obj:"select", _target:[({_ref:"layer", _name:"6"})], makeVisible:false}), ({_obj:"select", _target:[({_ref:"layer", _name:"1"})], selectionModifier:{_enum:"selectionModifierType", _value:"addToSelectionContinuous"}, makeVisible:false}), ({_obj:"make", _target:[({_ref:"layerSection"})], from:{_ref:"layer", _enum:"ordinal", _value:"targetEnum"}, layerSectionStart:186, layerSectionEnd:187, name:"Group 1"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Colour"}})
			], { });
			
			};
			break;
			case "colour 4": {
				if(app.activeDocument.activeLayers[0].name!="Blending")
				{
					app.showAlert(localisedAlert("pressAuto"));
					break;	
				};
			await action.batchPlay([{
   "_obj": "applyImageEvent",
   "with": {
      "_obj": "calculation",
      "to": {
         "_ref": [
            {
               "_ref": "channel",
               "_enum": "channel",
               "_value": "mask"
            },
            {
               "_ref": "layer",
               "_name": "4"
            }
         ]
      },
      "preserveTransparency": true
   }
}], { });

			};
			break;
			case "colour 5": {
				if(app.activeDocument.activeLayers[0].name!="Blending")
				{
					app.showAlert(localisedAlert("pressAuto"));
					break;	
				};
				await action.batchPlay([{
	   "_obj": "applyImageEvent",
	   "with": {
	      "_obj": "calculation",
	      "to": {
	         "_ref": [
	            {
	               "_ref": "channel",
	               "_enum": "channel",
	               "_value": "mask"
	            },
	            {
	               "_ref": "layer",
	               "_name": "5"
	            }
	         ]
	      },
	      "preserveTransparency": true
	   }
	}], { });
			};
			break;
			case "colour 6": {
				if(app.activeDocument.activeLayers[0].name!="Blending")
				{
					app.showAlert(localisedAlert("pressAuto"));
					break;	
				};
				await action.batchPlay([{
	   "_obj": "applyImageEvent",
	   "with": {
	      "_obj": "calculation",
	      "to": {
	         "_ref": [
	            {
	               "_ref": "channel",
	               "_enum": "channel",
	               "_value": "mask"
	            },
	            {
	               "_ref": "layer",
	               "_name": "6"
	            }
	         ]
	      },
	      "preserveTransparency": true
	   }
	}], { });
			};
			break;
			case "colour 1": {
				if(app.activeDocument.activeLayers[0].name!="Blending")
				{
					app.showAlert(localisedAlert("pressAuto"));
					break;	
				};
				await action.batchPlay([{
	   "_obj": "applyImageEvent",
	   "with": {
	      "_obj": "calculation",
	      "to": {
	         "_ref": [
	            {
	               "_ref": "channel",
	               "_enum": "channel",
	               "_value": "mask"
	            },
	            {
	               "_ref": "layer",
	               "_name": "1"
	            }
	         ]
	      },
	      "preserveTransparency": true
	   }
	}], { });
			};
			break;
			case "colour 2": {
				if(app.activeDocument.activeLayers[0].name!="Blending")
				{
					app.showAlert(localisedAlert("pressAuto"));
					break;	
				};
				await action.batchPlay([{
	   "_obj": "applyImageEvent",
	   "with": {
	      "_obj": "calculation",
	      "to": {
	         "_ref": [
	            {
	               "_ref": "channel",
	               "_enum": "channel",
	               "_value": "mask"
	            },
	            {
	               "_ref": "layer",
	               "_name": "2"
	            }
	         ]
	      },
	      "preserveTransparency": true
	   }
	}], { });
			};
			break;
			case "colour 3": {
				if(app.activeDocument.activeLayers[0].name!="Blending")
				{
					app.showAlert(localisedAlert("pressAuto"));
					break;	
				};
				await action.batchPlay([{
	   "_obj": "applyImageEvent",
	   "with": {
	      "_obj": "calculation",
	      "to": {
	         "_ref": [
	            {
	               "_ref": "channel",
	               "_enum": "channel",
	               "_value": "mask"
	            },
	            {
	               "_ref": "layer",
	               "_name": "3"
	            }
	         ]
	      },
	      "preserveTransparency": true
	   }
	}], { });
			};
			break;
			
			
			case "Select Colours": {
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Colour" }, "makeVisible": false, "layerID": [
				52
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Blended" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Cancel Colours": {
				await selectBlending();
				await showLayerMask();
				await action.batchPlay([{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "mask"
				            },
				            {
				               "_ref": "layer",
				               "_name": "Original"
				            }
				         ]
				      },
				      "preserveTransparency": true
				   },
				   "_isCommand": true
				}], { });
				
				await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Colour" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
				await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
				await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Blending Canceled" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Dark Blend 2": {
				
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Original Dark Blend" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Dark Fix 1" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Dark Fix 2" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Dark Fix 3" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Dark Fix 4" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Dark Fix 5" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Dark Fix 6" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Dark Fix 7" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Dark Fix 8" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Dark Fix 9" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
				24
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 1" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelectionContinuous" }, "makeVisible": false, "layerID": [
				15,
				16,
				17,
				18,
				19,
				20,
				21,
				22,
				23
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 25, "layerSectionEnd": 26, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Dark Fix Temp" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "hide","_target": [
				{ "_ref": "layer", "_name": "Original Dark Blend" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "hide","_target": [
				{ "_ref": "layer", "_name": "Dark Fix 2" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 1" }, "makeVisible": false, "layerID": [
				15
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "adaptCorrect","shadowMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 10 }, "width": { "_unit": "percentUnit",
			"_value": 10 }, "radius": 1000 }, "highlightMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 0 }, "width": { "_unit": "percentUnit",
			"_value": 0 }, "radius": 0 }, "blackClip": 0.1, "whiteClip": 0.01, "center": 0, "colorCorrection": 20, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 2" }, "makeVisible": false, "layerID": [
				16
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "hide","_target": [
				{ "_ref": "layer", "_name": "Dark Fix 1" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "show","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "adaptCorrect","shadowMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 20 }, "width": { "_unit": "percentUnit",
			"_value": 20 }, "radius": 1000 }, "highlightMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 0 }, "width": { "_unit": "percentUnit",
			"_value": 0 }, "radius": 0 }, "blackClip": 0.01, "whiteClip": 0.01, "center": 0, "colorCorrection": 20, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "show","_target": [
				{ "_ref": "layer", "_name": "Dark Fix 3" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 3" }, "makeVisible": false, "layerID": [
				17
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "hide","_target": [
				{ "_ref": "layer", "_name": "Dark Fix 2" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "adaptCorrect","shadowMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 30 }, "width": { "_unit": "percentUnit",
			"_value": 30 }, "radius": 1000 }, "highlightMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 0 }, "width": { "_unit": "percentUnit",
			"_value": 0 }, "radius": 0 }, "blackClip": 0.01, "whiteClip": 0.01, "center": 0, "colorCorrection": 20, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 4" }, "makeVisible": false, "layerID": [
				18
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "hide","_target": [
				{ "_ref": "layer", "_name": "Dark Fix 3" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "show","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "adaptCorrect","shadowMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 40 }, "width": { "_unit": "percentUnit",
			"_value": 40 }, "radius": 1000 }, "highlightMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 0 }, "width": { "_unit": "percentUnit",
			"_value": 0 }, "radius": 0 }, "blackClip": 0.01, "whiteClip": 0.01, "center": 0, "colorCorrection": 20, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "hide","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 5" }, "makeVisible": false, "layerID": [
				19
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "show","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "adaptCorrect","shadowMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 50 }, "width": { "_unit": "percentUnit",
			"_value": 50 }, "radius": 1000 }, "highlightMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 0 }, "width": { "_unit": "percentUnit",
			"_value": 0 }, "radius": 0 }, "blackClip": 0.01, "whiteClip": 0.01, "center": 0, "colorCorrection": 20, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 6" }, "makeVisible": false, "layerID": [
				20
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "hide","_target": [
				{ "_ref": "layer", "_name": "Dark Fix 5" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "show","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "adaptCorrect","shadowMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 60 }, "width": { "_unit": "percentUnit",
			"_value": 60 }, "radius": 1000 }, "highlightMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 0 }, "width": { "_unit": "percentUnit",
			"_value": 0 }, "radius": 0 }, "blackClip": 0.01, "whiteClip": 0.01, "center": 0, "colorCorrection": 20, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "hide","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 7" }, "makeVisible": false, "layerID": [
				21
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "show","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "adaptCorrect","shadowMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 70 }, "width": { "_unit": "percentUnit",
			"_value": 70 }, "radius": 1000 }, "highlightMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 0 }, "width": { "_unit": "percentUnit",
			"_value": 0 }, "radius": 0 }, "blackClip": 0.01, "whiteClip": 0.01, "center": 0, "colorCorrection": 20, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 8" }, "makeVisible": false, "layerID": [
				22
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "hide","_target": [
				{ "_ref": "layer", "_name": "Dark Fix 7" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "show","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "adaptCorrect","shadowMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 80 }, "width": { "_unit": "percentUnit",
			"_value": 80 }, "radius": 1000 }, "highlightMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 0 }, "width": { "_unit": "percentUnit",
			"_value": 0 }, "radius": 0 }, "blackClip": 0.01, "whiteClip": 0.01, "center": 0, "colorCorrection": 20, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 9" }, "makeVisible": false, "layerID": [
				23
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "hide","_target": [
				{ "_ref": "layer", "_name": "Dark Fix 8" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "show","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "adaptCorrect","shadowMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 90 }, "width": { "_unit": "percentUnit",
			"_value": 90 }, "radius": 1000 }, "highlightMode": { "_obj": "adaptCorrectTones" ,"amount": { "_unit": "percentUnit",
			"_value": 0 }, "width": { "_unit": "percentUnit",
			"_value": 0 }, "radius": 0 }, "blackClip": 0.01, "whiteClip": 0.01, "center": 0, "colorCorrection": 20, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "hide","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "show","_target": [
				{ "_ref": "layer", "_name": "Dark Fix 1" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 1" }, "makeVisible": false, "layerID": [
				15
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			
			case "Select Dark 2": {
			await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Dark Blended Fix" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix Temp" }, "makeVisible": false, "layerID": [
				13
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "ungroupLayersEvent","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 9" }, "makeVisible": false, "layerID": [
				11
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 8" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
				10,
				11
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 7" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
				9,
				10,
				11
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 6" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
				8,
				9,
				10,
				11
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 5" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
				7,
				8,
				9,
				10,
				11
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 4" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
				6,
				7,
				8,
				9,
				10,
				11
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 3" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
				5,
				6,
				7,
				8,
				9,
				10,
				11
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 2" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
				4,
				5,
				6,
				7,
				8,
				9,
				10,
				11
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix 1" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				10,
				11
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				10,
				11
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Original Dark Blend" }, "makeVisible": false, "layerID": [
				2
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "hide","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Blended Fix" }, "makeVisible": false, "layerID": [
				15
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "show","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;

			break;
			
			case "Dark 1": {
				
				showDarkFixLayer(1);

			};
			break;
			case "Dark 2": {
			showDarkFixLayer(2);

			};
			break;
			case "Dark 3": {
			showDarkFixLayer(3);

			};
			break;
			case "Dark 6": {
			showDarkFixLayer(6);
		
			};
			break;
			case "Dark 5": {
			showDarkFixLayer(5);
			};
			break;
			case "Dark 4": {
				showDarkFixLayer(4);
			};
			break;
			case "Dark 7": {
			showDarkFixLayer(7);
			};
			break;
			case "Dark 8": {
			showDarkFixLayer(8);
			};
			break;
			case "Dark 9": {
				showDarkFixLayer(9);
			};
			break;
			case "Cancel Dark": {
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark Fix Temp" }, "makeVisible": false, "layerID": [
				50
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Dark Blended" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "show","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
          


        } //switch end

    } catch (e) {
        console.log(e + ":" + e.line);
    }
}

async function runScriptAsync_im(func, arg) {

    try {
        switch (func) {
            case "View Live": {
				if(!(await instaMaskExists()))
				{
					app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
				break;
				}
                action.batchPlay([{
                        "_obj": "select",
                        "_target": {
                            "_ref": "layer",
                            "_name": "InstaMask"
                        },
                        "makeVisible": false,
                        "_options": {
                            "dialogOptions": "silent"
                        }
                    },
                    {
                        "_obj": "hide",
                        "_target": [{
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        }],
                        "_options": {
                            "dialogOptions": "silent"
                        }
                    }
                ], {});
            }
            break;
        case "View Mask": {
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
            await selectInstaMask();
			showLayerMask();
        }
        break;
        case "Auto Align All Layers": {
            action.batchPlay([{
                    "_obj": "selectAllLayers",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "align",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "using": {
                        "_enum": "alignDistributeSelector",
                        "_value": "ADSContent"
                    },
                    "apply": {
                        "_enum": "projection",
                        "_value": "auto"
                    },
                    "vignette": false,
                    "radialDistort": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
        }
        break;

        case "Cancel":
            await removeInstaMask();
			await deleteBackupMask();
            break;

        case "White":

            var res = hasLayerMask();
            if (res) {
                await deleteLayerMask();
            }
			
            action.batchPlay([{
                "_obj": "make",
                "new": {
                    "_class": "channel"
                },
                "at": {
                    "_ref": "channel",
                    "_enum": "channel",
                    "_value": "mask"
                },
                "using": {
                    "_enum": "userMaskEnabled",
                    "_value": "revealAll"
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});
            break;
        case "Black":

            var res = hasLayerMask();
            if (res) {
                await deleteLayerMask();
            }

            action.batchPlay([{
                "_obj": "make",
                "new": {
                    "_class": "channel"
                },
                "at": {
                    "_ref": "channel",
                    "_enum": "channel",
                    "_value": "mask"
                },
                "using": {
                    "_enum": "userMaskEnabled",
                    "_value": "hideAll"
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});
            break;

        case "Show Layer":
            action.batchPlay([{
                "_obj": "show",
                "_target": [{
                    "_ref": "layer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }],
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});
            break;

        case "Hide Layer":
            action.batchPlay([{
                "_obj": "hide",
                "_target": [{
                    "_ref": "layer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }],
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});
            break;

        case "Hide Ants":
            action.batchPlay([{
                "_obj": "select",
                "_target": {
                    "_ref": "menuItemClass",
                    "_enum": "menuItemType",
                    "_value": "toggleShowExtras"
                },
                "_options": {
                    "dialogOptions": "display"
                }
            }], {});
            break;

        case "Deselect":
            action.batchPlay([{
				
				   "_obj": "set",
				   "_target": [
				      {
				         "_ref": "channel",
				         "_property": "selection"
				      }
				   ],
				   "to": {
				      "_enum": "ordinal",
				      "_value": "none"
				   },
				   
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});
            break;

        case "Open ACR":
            action.batchPlay([{
                "_obj": "placedLayerEditContents",
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});
            break;

        case "Undo":
            action.batchPlay([{
                "_obj": "select",
                "_target": {
                    "_ref": "historyState",
                    "_enum": "ordinal",
                    "_value": "previous"
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});
            break;


        case "Bright 1":
            await removeInstaMask();
			await deleteBackupMask();
            await createInstaMask();
			await selectLayerMask();
			
            await action.batchPlay([
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]//RGB, Red, Green, Blue
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				}
            ], {});
			showLayerMask();
            break;

        case "Bright 2":

            await removeInstaMask();
			await deleteBackupMask();
            await createInstaMask();
			await selectLayerMask();
			
            await action.batchPlay([
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				}
            ], {});
			showLayerMask();
            break;

        case "Bright 3":

            await removeInstaMask();
			await deleteBackupMask();
            await createInstaMask();
			await selectLayerMask();
			
            await action.batchPlay([
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				}
            ], {});
			showLayerMask();
            break;

        case "Bright 4":

            await removeInstaMask();
			await deleteBackupMask();
            await createInstaMask();
			await selectLayerMask();
			
            await action.batchPlay([
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				}
            ], {});
			showLayerMask();
            break;

        case "Bright 5":

            await removeInstaMask();
			await deleteBackupMask();
            await createInstaMask();
			await selectLayerMask();
			
            await action.batchPlay([
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				}
            ], {});
			showLayerMask();
            break;


        case "Bright 6":

            await removeInstaMask();
			await deleteBackupMask();
            await createInstaMask();
			await selectLayerMask();
			
            await action.batchPlay([
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": arg[0]
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				}
            ], {});
			showLayerMask();
            break;

        case "Colour Mask":
            await removeInstaMask();
			await deleteBackupMask();
            await createInstaMask();
            action.batchPlay([{
                    "_obj": "colorRange",
                    "fuzziness": 83,
                    "minimum": {
                        "_obj": "labColor",
                        "luminance": 94.41,
                        "a": -0.73,
                        "b": -2.95
                    },
                    "maximum": {
                        "_obj": "labColor",
                        "luminance": 94.41,
                        "a": -0.73,
                        "b": -2.95
                    },
                    "colorModel": 0,
                    "_options": {
                        "dialogOptions": "display"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "makeVisible": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Dark 1":
            await removeInstaMask();
			await deleteBackupMask();
            await createInstaMask();
			await selectLayerMask();
			
            await action.batchPlay([
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				}
            ], {});
			showLayerMask();
            break;

        case "Dark 2":
            await removeInstaMask();
			await deleteBackupMask();
            await createInstaMask();
			await selectLayerMask();
			
            await action.batchPlay([
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				}
            ], {});
			showLayerMask();
            break;

        case "Dark 3":
            await removeInstaMask();
			await deleteBackupMask();
            await createInstaMask();
			await selectLayerMask();
			
            await action.batchPlay([
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				}
            ], {});
			showLayerMask();
            break;


        case "Dark 4":
            await removeInstaMask();
			await deleteBackupMask();
            await createInstaMask();
			await selectLayerMask();
			
            await action.batchPlay([
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				}
            ], {});
			showLayerMask();
            break;

        case "Dark 5":
            await removeInstaMask();
			await deleteBackupMask();
            await createInstaMask();
			await selectLayerMask();
			
            await action.batchPlay([
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				}
            ], {});
			showLayerMask();
            break;


        case "Dark 6":
            await removeInstaMask();
			await deleteBackupMask();
            await createInstaMask();
			await selectLayerMask();
			
            await action.batchPlay([
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "RGB"
				            },
				            {
				               "_ref": "layer",
				               "_enum": "ordinal",
				               "_value": "merged"
				            }
				         ]
				      },
					  "invert":true,
				      "calculation": {
				         "_enum": "calculationType",
				         "_value": "multiply"
				      },
				      "preserveTransparency": true
				   }
				}
            ], {});
			showLayerMask();
            break;

        case "Saturation Mask":
			
			await removeInstaMask();
			await deleteBackupMask();
          await  action.batchPlay([{
                    "_obj": "make",
                    "_target": {
                        "_ref": "adjustmentLayer"
                    },
                    "using": {
                        "_obj": "adjustmentLayer",
                        "type": {
                            "_obj": "levels",
                            "presetKind": {
                                "_enum": "presetKindType",
                                "_value": "presetKindDefault"
                            }
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "temp"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "mergeVisible",
                    "duplicate": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "Saturation Layer"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
				{
				   "_obj": "$HsbP",
				   "input": {
				      "_enum": "colorSpace",
				      "_value": "RGBColor"
				   },
				   "output": {
				      "_enum": "colorSpace",
				      "_value": "HSBColorEnum"
				   }
				},
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "temp"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "Saturation Layer"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "Saturation Layer"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "grain"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});


            await createInstaMask();
		



           await action.batchPlay([{
   "_obj": "applyImageEvent",
   "with": {
      "_obj": "calculation",
      "to": {
         "_ref": [
            {
               "_ref": "channel",
               "_enum": "channel",
               "_value": "grain"
            },
            {
               "_ref": "layer",
               "_name": "Saturation Layer"
            }
         ]
      },
      "calculation": {
         "_enum": "calculationType",
         "_value": "multiply"
      },
      "preserveTransparency": true
   }
},
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "Saturation Layer"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "makeVisible": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
			await selectInstaMask();
			showLayerMask();
            break;

        case "Midtone 2":
            await removeInstaMask();
await deleteBackupMask();
            await action.batchPlay([
				({
				  _obj: "make",
				  new: {
				    _class: "channel"
				  },
				  using: {
				    _obj: "calculation",
				    to: {
				      _ref: [
				        ({
				          _ref: "channel",
				          _enum: "channel",
				          _value: "gray"
				        }),
				        ({
				          _ref: "layer",
				          _enum: "ordinal",
				          _value: "merged"
				        })
				      ]
				    },
				    source2: {
				      _ref: [
				        ({
				          _ref: "channel",
				          _enum: "channel",
				          _value: "gray"
				        }),
				        ({
				          _ref: "layer",
				          _enum: "ordinal",
				          _value: "merged"
				        })
				      ]
				    }
				  }
				}),
				({
				  _obj: "set",
				  _target: [
				    ({
				      _ref: "channel",
				      _enum: "ordinal",
				      _value: "targetEnum"
				    })
				  ],
				  to: {
				    _obj: "channel",
				    name: "Bright 1"
				  }
				}),
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "channel",
                        "name": "Bright 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "make",
                    "new": {
                        "_class": "channel"
                    },
                    "using": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "gray"
                        },
                        "invert": true,
                        "source2": {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "gray"
                        },
                        "invertSource2": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "channel",
                        "name": "Dark 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "make",
                    "new": {
                        "_class": "channel"
                    },
                    "using": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Bright 2"
                        },
                        "invert": true,
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "source2": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "invertSource2": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "channel",
                        "name": "Midtone 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                }
            ], {});

            await createInstaMask();

            await action.batchPlay([{
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Midtone 2"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Midtone 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Dark 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Bright 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                }
            ], {});
			showLayerMask();
            break;

        case "Midtone 3":
            await removeInstaMask();
await deleteBackupMask();


            await action.batchPlay([
			    ({
			      _obj: "make",
			      new: {
			        _class: "channel"
			      },
			      using: {
			        _obj: "calculation",
			        to: {
			          _ref: [
			            ({
			              _ref: "channel",
			              _enum: "channel",
			              _value: "gray"
			            }),
			            ({
			              _ref: "layer",
			              _enum: "ordinal",
			              _value: "merged"
			            })
			          ]
			        },
			        source2: {
			          _ref: [
			            ({
			              _ref: "channel",
			              _enum: "channel",
			              _value: "gray"
			            }),
			            ({
			              _ref: "layer",
			              _enum: "ordinal",
			              _value: "merged"
			            })
			          ]
			        }
			      }
			    }),
			    ({
			      _obj: "set",
			      _target: [
			        ({
			          _ref: "channel",
			          _enum: "ordinal",
			          _value: "targetEnum"
			        })
			      ],
			      to: {
			        _obj: "channel",
			        name: "Bright 1"
			      }
			    }),
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "channel",
                        "name": "Bright 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "make",
                    "new": {
                        "_class": "channel"
                    },
                    "using": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "gray"
                        },
                        "invert": true,
                        "source2": {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "gray"
                        },
                        "invertSource2": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "channel",
                        "name": "Dark 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "make",
                    "new": {
                        "_class": "channel"
                    },
                    "using": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Bright 2"
                        },
                        "invert": true,
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "source2": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "invertSource2": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "channel",
                        "name": "Midtone 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                }
            ], {});

            await createInstaMask();

            await action.batchPlay([{
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Midtone 2"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Midtone 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Dark 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Bright 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                }
            ], {});
			showLayerMask();
			break;

        case "Midtone 4":
            await removeInstaMask();
await deleteBackupMask();
            await action.batchPlay([({
			      _obj: "make",
			      new: {
			        _class: "channel"
			      },
			      using: {
			        _obj: "calculation",
			        to: {
			          _ref: [
			            ({
			              _ref: "channel",
			              _enum: "channel",
			              _value: "gray"
			            }),
			            ({
			              _ref: "layer",
			              _enum: "ordinal",
			              _value: "merged"
			            })
			          ]
			        },
			        source2: {
			          _ref: [
			            ({
			              _ref: "channel",
			              _enum: "channel",
			              _value: "gray"
			            }),
			            ({
			              _ref: "layer",
			              _enum: "ordinal",
			              _value: "merged"
			            })
			          ]
			        }
			      }
			    }),
			    ({
			      _obj: "set",
			      _target: [
			        ({
			          _ref: "channel",
			          _enum: "ordinal",
			          _value: "targetEnum"
			        })
			      ],
			      to: {
			        _obj: "channel",
			        name: "Bright 1"
			      }
			    }),
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "channel",
                        "name": "Bright 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "make",
                    "new": {
                        "_class": "channel"
                    },
                    "using": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "gray"
                        },
                        "invert": true,
                        "source2": {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "gray"
                        },
                        "invertSource2": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "channel",
                        "name": "Dark 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "make",
                    "new": {
                        "_class": "channel"
                    },
                    "using": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Bright 2"
                        },
                        "invert": true,
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "source2": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "invertSource2": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "channel",
                        "name": "Midtone 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                }
            ], {});

            await createInstaMask();

            await action.batchPlay([{
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Midtone 2"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Midtone 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Dark 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Bright 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                }
            ], {});
			showLayerMask();
            break;

        case "Midtone 5":
            await removeInstaMask();
await deleteBackupMask();
            await action.batchPlay([({
			      _obj: "make",
			      new: {
			        _class: "channel"
			      },
			      using: {
			        _obj: "calculation",
			        to: {
			          _ref: [
			            ({
			              _ref: "channel",
			              _enum: "channel",
			              _value: "gray"
			            }),
			            ({
			              _ref: "layer",
			              _enum: "ordinal",
			              _value: "merged"
			            })
			          ]
			        },
			        source2: {
			          _ref: [
			            ({
			              _ref: "channel",
			              _enum: "channel",
			              _value: "gray"
			            }),
			            ({
			              _ref: "layer",
			              _enum: "ordinal",
			              _value: "merged"
			            })
			          ]
			        }
			      }
			    }),
			    ({
			      _obj: "set",
			      _target: [
			        ({
			          _ref: "channel",
			          _enum: "ordinal",
			          _value: "targetEnum"
			        })
			      ],
			      to: {
			        _obj: "channel",
			        name: "Bright 1"
			      }
			    }),
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "channel",
                        "name": "Bright 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "make",
                    "new": {
                        "_class": "channel"
                    },
                    "using": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "gray"
                        },
                        "invert": true,
                        "source2": {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "gray"
                        },
                        "invertSource2": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "channel",
                        "name": "Dark 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "make",
                    "new": {
                        "_class": "channel"
                    },
                    "using": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Bright 2"
                        },
                        "invert": true,
                        "calculation": {
                            "_enum": "calculationType",
                            "_value": "multiply"
                        },
                        "source2": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "invertSource2": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "channel",
                        "name": "Midtone 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                }
            ], {});

            await createInstaMask();

            await action.batchPlay([{
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Midtone 2"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Midtone 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Dark 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Bright 2"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "dontDisplay"
                    }
                }
            ], {});
			showLayerMask();
            break;

        case "Edge Mask":
            await removeInstaMask();
await deleteBackupMask();
            await action.batchPlay([{
                    "_obj": "make",
                    "_target": {
                        "_ref": "adjustmentLayer"
                    },
                    "using": {
                        "_obj": "adjustmentLayer",
                        "type": {
                            "_obj": "levels",
                            "presetKind": {
                                "_enum": "presetKindType",
                                "_value": "presetKindDefault"
                            }
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "temp"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "mergeVisible",
                    "duplicate": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "temp1"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "temp"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "temp1"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "make",
                    "new": {
                        "_obj": "channel",
                        "colorIndicates": {
                            "_enum": "maskIndicator",
                            "_value": "maskedAreas"
                        },
                        "color": {
                            "_obj": "RGBColor",
                            "red": 255,
                            "grain": 0,
                            "blue": 0
                        },
                        "opacity": 50
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": "channel",
				         "_enum": "channel",
				         "_value": "RGB"
				      },
				      "preserveTransparency": true
				   }
				},
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "channel",
                        "name": "temp chan"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "findEdges",
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "levels",
                    "presetKind": {
                        "_enum": "presetKindType",
                        "_value": "presetKindDefault"
                    },
                    "_options": {
                        "dialogOptions": "display"
                    }
                },
                {
                    "_obj": "gaussianBlur",
                    "radius": {
                        "_unit": "pixelsUnit",
                        "_value": 2.9
                    },
                    "_options": {
                        "dialogOptions": "display"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});


            await createInstaMask();
			await selectInstaMask();
            await action.batchPlay([
				
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "temp chan"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
				
				{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "temp1"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "temp chan"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "makeVisible": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
			
			await selectInstaMask();
			showLayerMask();
            break;

        case "Keep":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "duplicate",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "name": "Keep",
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "make",
                    "_target": {
                        "_ref": "adjustmentLayer"
                    },
                    "using": {
                        "_obj": "adjustmentLayer",
                        "type": {
                            "_obj": "curves",
                            "presetKind": {
                                "_enum": "presetKindType",
                                "_value": "presetKindDefault"
                            }
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Keep"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "Original"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Keep"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
			
            break;

        case "Add To Mask 16":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await deleteBackupMask();
            await action.batchPlay([{
   "_obj": "applyImageEvent",
   "with": {
      "_obj": "calculation",
      "to": {
         "_ref": [
            {
               "_ref": "channel",
               "_enum": "channel",
               "_value": "mask"
            },
            {
               "_ref": "layer",
               "_name": "Original"
            }
         ]
      },
      "calculation": {
         "_enum": "calculationType",
         "_value": "add"
      },
      "scale": 1,
      "offset": 0,
      "preserveTransparency": true
   }
},
{
   "_obj": "delete",
   "_target": [
      {
         "_ref": "layer",
         "_name": "Original"
      }
   ]
}
            ], {});
			showLayerMask();
            break;

        case "Subtract To Mask 16":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await deleteBackupMask();

            await action.batchPlay([
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "Original"
      })
    ],
    makeVisible: true
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "Original"
      })
    ],
    makeVisible: true
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "channel",
        _property: "selection"
      })
    ],
    to: {
      _ref: "channel",
      _enum: "ordinal",
      _value: "targetEnum"
    }
  }),
  ({
    _obj: "subtract",
    _target: [
      ({
        _ref: "channel",
        _enum: "channel",
        _value: "mask"
      }),
      ({
        _ref: "layer",
        _name: "InstaMask"
      })
    ],
    from: {
      _ref: "channel",
      _property: "selection"
    }
  }),
  ({
    _obj: "delete",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ]
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "InstaMask Group"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "InstaMask Group"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "delete",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ]
  }),
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "adjustmentLayer"
      })
    ],
    using: {
      _obj: "adjustmentLayer",
      type: {
        _obj: "curves",
        presetKind: {
          _enum: "presetKindType",
          _value: "presetKindDefault"
        }
      }
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "InstaMask"
    }
  }),
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "layerSection"
      })
    ],
    from: {
      _ref: "layer",
      _enum: "ordinal",
      _value: "targetEnum"
    },
    layerSectionStart: 216,
    layerSectionEnd: 217,
    name: "Group 1"
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "InstaMask Group"
    }
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "InstaMask"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "InstaMask"
      })
    ],
    makeVisible: false
  })
], {});
			showLayerMask();
            break;

        case "Refine Mask":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
await deleteBackupMask();
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "refineSelectionEdge",
                    "refineEdgeBorderRadius": {
                        "_unit": "pixelsUnit",
                        "_value": 0
                    },
                    "refineEdgeBorderContrast": {
                        "_unit": "percentUnit",
                        "_value": 0
                    },
                    "refineEdgeSmooth": 0,
                    "refineEdgeFeatherRadius": {
                        "_unit": "pixelsUnit",
                        "_value": 0
                    },
                    "refineEdgeChoke": {
                        "_unit": "percentUnit",
                        "_value": 0
                    },
                    "refineEdgeAutoRadius": false,
                    "refineEdgeDecontaminate": false,
                    "refineEdgeOutput": {
                        "_enum": "refineEdgeOutput",
                        "_value": "refineEdgeOutputUserMask"
                    },
                    "_options": {
                        "dialogOptions": "display"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "show",
                    "_target": [{
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    }],
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "hide",
                    "_target": [{
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "red"
                        },
                        {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "grain"
                        },
                        {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "blue"
                        }
                    ],
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Blur Mask":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
await deleteBackupMask();
            action.batchPlay([{
                    "_obj": "gaussianBlur",
                    "radius": {
                        "_unit": "pixelsUnit",
                        "_value": 8.9
                    },
                    "_options": {
                        "dialogOptions": "display"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "show",
                    "_target": [{
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    }],
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "hide",
                    "_target": [{
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "red"
                        },
                        {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "grain"
                        },
                        {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "blue"
                        }
                    ],
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Map":

            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
				{
				   "_obj": "set",
				   "_target": [
				      {
				         "_ref": "channel",
				         "_property": "selection"
				      }
				   ],
				   "to": {
				      "_ref": "channel",
				      "_enum": "ordinal",
				      "_value": "targetEnum"
				   }
				},
                {
                    "_obj": "make",
                    "_target": {
                        "_ref": "layer"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "Map"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "fill",
                    "using": {
                        "_enum": "fillContents",
                        "_value": "color"
                    },
                    "color": {
                        "_obj": "HSBColorClass",
                        "hue": {
                            "_unit": "angleUnit",
                            "_value": 0
                        },
                        "saturation": 93.3333333333333,
                        "brightness": 100
                    },
                    "opacity": {
                        "_unit": "percentUnit",
                        "_value": 100
                    },
                    "mode": {
                        "_enum": "blendMode",
                        "_value": "normal"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
				{
				   "_obj": "set",
				   "_target": [
				      {
				         "_ref": "channel",
				         "_property": "selection"
				      }
				   ],
				   "to": {
				      "_enum": "ordinal",
				      "_value": "none"
				   }
				}
            ], {});
            break;

        case "X":

            await action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "Map"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "show",
                    "_target": [{
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    }],
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
			await selectInstaMask();
			showLayerMask();
            break;

        case "Image":
           // var _name = app.activeDocument.title;
            var _obj = {
   "_obj": "make",
   "new": {
      "_class": "document"
   },
   "using": {
      "_obj": "calculation",
      "to": {
         "_ref": [
            {
               "_ref": "channel",
               "_enum": "ordinal",
               "_value": "targetEnum"
            },
            {
               "_ref": "layer",
               "_name": "InstaMask"
            }
         ]
      },
      "source2": {
         "_ref": [
            {
               "_ref": "channel",
               "_enum": "ordinal",
               "_value": "targetEnum"
            },
            {
               "_ref": "layer",
               "_name": "InstaMask"
            }
         ]
      }
   }
};

            var _obj2 = {
                "_obj": "convertMode",
                "to": {
                    "_class": "grayscaleMode"
                }
            };

			await selectInstaMask();
            await action.batchPlay([
				_obj, _obj2], {});
			//app.activeDocument.name = _name;
            break;



        case "Selection":
            await action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
					"_obj": "set",
					"_target": [
						{
							"_ref": "channel",
							"_property": "selection"
						}
					],
					"to": {
						"_ref": "channel",
						"_enum": "ordinal",
						"_value": "targetEnum"
					},
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
			//selectLayerMask();
            break;


        case "Select White":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await selectInstaMask();
			await action.batchPlay([{
				"_obj": "set",
				"_target": [
					{
						"_ref": "channel",
						"_property": "selection"
					}
				],
				"to": {
					"_ref": "channel",
					"_enum": "ordinal",
					"_value": "targetEnum"
				},
                "_options": {
                    "dialogOptions": "silent"
                }
            }
       	 	], {});
			
            await removeInstaMask();
            if (hasLayerMask()) {
                await deleteLayerMask();
            }


            await action.batchPlay([{
                    "_obj": "make",
                    "new": {
                        "_class": "channel"
                    },
                    "at": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "using": {
                        "_enum": "userMaskEnabled",
                        "_value": "hideAll"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "show",
                    "_target": [{
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    }],
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
					{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }
				,
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "menuItemClass",
                        "_enum": "menuItemType",
                        "_value": "toggleShowExtras"
                    },
                    "_options": {
                        "dialogOptions": "display"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "paintbrushTool"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
				{
				   "_obj": "set",
				   "_target": [
				      {
				         "_ref": "color",
				         "_property": "foregroundColor"
				      }
				   ],
				   "to": {
				      "_obj": "labColor",
				      "luminance": 100,
				      "a": 0,
				      "b": 0
				   },
				   "source": "photoshopPicker"
				}
            ], {});
			selectLayerMask();
            break;


        case "Select Black":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await selectInstaMask();
			await action.batchPlay([{
				"_obj": "set",
				"_target": [
					{
						"_ref": "channel",
						"_property": "selection"
					}
				],
				"to": {
					"_ref": "channel",
					"_enum": "ordinal",
					"_value": "targetEnum"
				},
                "_options": {
                    "dialogOptions": "silent"
                }
            }
       	 	], {});
			
            await removeInstaMask();
            if (hasLayerMask()) {
                await deleteLayerMask();
            }


            await action.batchPlay([{
                    "_obj": "make",
                    "new": {
                        "_class": "channel"
                    },
                    "at": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "using": {
                        "_enum": "userMaskEnabled",
                        "_value": "revealAll"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "show",
                    "_target": [{
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    }],
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
					{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }
				,
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "menuItemClass",
                        "_enum": "menuItemType",
                        "_value": "toggleShowExtras"
                    },
                    "_options": {
                        "dialogOptions": "display"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "paintbrushTool"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
				{
				   "_obj": "set",
				   "_target": [
				      {
				         "_ref": "color",
				         "_property": "foregroundColor"
				      }
				   ],
				   "to": {
				      "_obj": "labColor",
				      "luminance": 0,
				      "a": 0,
				      "b": 0
				   },
				   "source": "photoshopPicker"
				}
            ], {});
			selectLayerMask();
            break;

        case "Test Blend":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
            if (app.activeDocument.activeLayers[0].name == "InstaMask") {
                app.showAlert("ERROR - Please select the layer you wish to test the mask on, then press Test. We can't test the mask when the InstaMask layer is selected", "IMPORTANT - Please read");
                break;
            };
            if (hasLayerMask()) {
                await deleteLayerMask();
            }

            await action.batchPlay([
				{
   "_obj": "make",
   "new": {
      "_class": "channel"
   },
   "at": {
      "_ref": "channel",
      "_enum": "channel",
      "_value": "mask"
   },
   "using": {
      "_enum": "userMaskEnabled",
      "_value": "revealAll"
   },
   "_isCommand": true
},
				
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "mask"
				            },
				            {
				               "_ref": "layer",
				               "_name": "InstaMask"
				            }
				         ]
				      },
				      "preserveTransparency": true
				   },
				  
				},
			
				
				{
				   "_obj": "select",
				   "_target": [
				      {
				         "_ref": "channel",
				         "_enum": "channel",
				         "_value": "RGB"
				      }
				   ],
				   "makeVisible": false
				}
            ], {});
            break;

        case "Cancel test":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
            if (hasLayerMask()) {
                await deleteLayerMask();
            };
			await selectInstaMask();
			showLayerMask();
            break;

  
        case "Live":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
            if (app.activeDocument.activeLayers[0].name == "InstaMask") {
                app.showAlert("ERROR - Please select the layer you wish to test the mask on, then press Test. We can't test the mask when the InstaMask layer is selected", "IMPORTANT - Please read");
                break;
            };
            if (hasLayerMask()) {
                await deleteLayerMask();
            }


           await action.batchPlay([{
                    "_obj": "hide",
                    "_target": [{
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    }],
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "copyToLayer",
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "temp"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "show",
                    "_target": [{
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    }],
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "temp"
                    },
                    "makeVisible": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
				{
				   "_obj": "make",
				   "new": {
				      "_class": "channel"
				   },
				   "at": {
				      "_ref": "channel",
				      "_enum": "channel",
				      "_value": "mask"
				   },
				   "using": {
				      "_enum": "userMaskEnabled",
				      "_value": "revealAll"
				   }
				},
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "mask"
				            },
				            {
				               "_ref": "layer",
				               "_name": "InstaMask"
				            }
				         ]
				      },
				      "preserveTransparency": true
				   }
				},
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "menuItemClass",
                        "_enum": "menuItemType",
                        "_value": "newView"
                    },
                    "_options": {
                        "dialogOptions": "display"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "menuItemClass",
                        "_enum": "menuItemType",
                        "_value": "tileVertically"
                    },
                    "_options": {
                        "dialogOptions": "display"
                    }
                }
            ], {});
			showLayerMask();
            break;

        case "End Live":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
            action.batchPlay([
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

           
        case "Apply Mask":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
            if (app.activeDocument.activeLayers[0].name == "InstaMask") {
                app.showAlert("ERROR - Please select the layer you wish to test the mask on, then press Test. We can't test the mask when the InstaMask layer is selected", "IMPORTANT - Please read");
                break;
            };
            if (hasLayerMask()) {
                await deleteLayerMask();
            }
await deleteBackupMask();
            await action.batchPlay([
				{
   "_obj": "make",
   "new": {
      "_class": "channel"
   },
   "at": {
      "_ref": "channel",
      "_enum": "channel",
      "_value": "mask"
   },
   "using": {
      "_enum": "userMaskEnabled",
      "_value": "revealAll"
   },
   "_isCommand": true
},
				
				{
				   "_obj": "applyImageEvent",
				   "with": {
				      "_obj": "calculation",
				      "to": {
				         "_ref": [
				            {
				               "_ref": "channel",
				               "_enum": "channel",
				               "_value": "mask"
				            },
				            {
				               "_ref": "layer",
				               "_name": "InstaMask"
				            }
				         ]
				      },
				      "preserveTransparency": true
				   }
				  
				}
            ], {});
			
			removeInstaMask();
            break;

        case "DB":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await deleteBackupMask();
           action.batchPlay([({_obj:"select", _target:[({_ref:"layer", _name:"InstaMask Group"})], makeVisible:false}), ({_obj:"select", _target:[({_ref:"layer", _name:"InstaMask Group"})], makeVisible:false}), ({_obj:"ungroupLayersEvent", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})]}), ({_obj:"make", _target:[({_ref:"layer"})]}), ({_obj:"fill", using:{_enum:"fillContents", _value:"gray"}, opacity:{_unit:"percentUnit", _value:100}, mode:{_enum:"blendMode", _value:"normal"}}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", mode:{_enum:"blendMode", _value:"softLight"}}}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Dodge & Burn"}}), ({_obj:"select", _target:[({_ref:"layer", _name:"InstaMask"})], makeVisible:false}), ({_obj:"select", _target:[({_ref:"layer", _name:"InstaMask"})], makeVisible:false}), ({_obj:"make", new:{_class:"channel"}, at:{_ref:[({_ref:"channel", _enum:"channel", _value:"mask"}), ({_ref:"layer", _name:"Dodge & Burn"})]}, using:{_ref:[({_ref:"channel", _enum:"channel", _value:"mask"}), ({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})]}, duplicate:true}), ({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})]}), ({_obj:"select", _target:[({_ref:"layer", _name:"Dodge & Burn"})], makeVisible:false}), ({_obj:"select", _target:[({_ref:"layer", _name:"Dodge & Burn"})], makeVisible:false}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"D&B"}})
            ], {});
			
		
            break;

        case "Sharpen":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await deleteBackupMask();
			
		
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "ungroupLayersEvent",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "temp"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "mergeVisible",
                    "duplicate": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "Sharpen"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "temp"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
				{
							    _obj: "make",
							    new: {
							      _class: "channel"
							    },
							    at: {
							      _ref: [
							        ({
							          _ref: "channel",
							          _enum: "channel",
							          _value: "mask"
							        }),
							        ({
							          _ref: "layer",
							          _name: "Sharpen"
							        })
							      ]
							    },
							    using: {
							      _ref: [
							        ({
							          _ref: "channel",
							          _enum: "channel",
							          _value: "mask"
							        }),
							        ({
							          _ref: "layer",
							          _enum: "ordinal",
							          _value: "targetEnum"
							        })
							      ]
							    },
							    duplicate: true
							  },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "Sharpen"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "temp"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "Sharpen"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "mode": {
                            "_enum": "blendMode",
                            "_value": "overlay"
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "highPass",
                    "radius": {
                        "_unit": "pixelsUnit",
                        "_value": 4.5
                    },
                    "_options": {
                        "dialogOptions": "display"
                    }
                }
            ], {});
            break;

        case "Noise":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await deleteBackupMask();
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "ungroupLayersEvent",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "temp"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "mergeVisible",
                    "duplicate": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "newPlacedLayer",
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "Noise"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "denoise",
                    "colorNoise": {
                        "_unit": "percentUnit",
                        "_value": 45
                    },
                    "sharpen": {
                        "_unit": "percentUnit",
                        "_value": 25
                    },
                    "removeJPEGArtifact": false,
                    "channelDenoise": [{
                            "_obj": "channelDenoiseParams",
                            "channel": {
                                "_ref": "channel",
                                "_enum": "channel",
                                "_value": "composite"
                            },
                            "amount": 6,
                            "edgeFidelity": 60
                        },
                        {
                            "_obj": "channelDenoiseParams",
                            "channel": {
                                "_ref": "channel",
                                "_enum": "channel",
                                "_value": "red"
                            },
                            "amount": 0
                        },
                        {
                            "_obj": "channelDenoiseParams",
                            "channel": {
                                "_ref": "channel",
                                "_enum": "channel",
                                "_value": "grain"
                            },
                            "amount": 0
                        },
                        {
                            "_obj": "channelDenoiseParams",
                            "channel": {
                                "_ref": "channel",
                                "_enum": "channel",
                                "_value": "blue"
                            },
                            "amount": 0
                        }
                    ],
                    "preset": "Default",
                    "_options": {
                        "dialogOptions": "display"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "temp"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
				{
				    _obj: "make",
				    new: {
				      _class: "channel"
				    },
				    at: {
				      _ref: [
				        ({
				          _ref: "channel",
				          _enum: "channel",
				          _value: "mask"
				        }),
				        ({
				          _ref: "layer",
				          _name: "Noise"
				        })
				      ]
				    },
				    using: {
				      _ref: [
				        ({
				          _ref: "channel",
				          _enum: "channel",
				          _value: "mask"
				        }),
				        ({
				          _ref: "layer",
				          _enum: "ordinal",
				          _value: "targetEnum"
				        })
				      ]
				    },
				    duplicate: true
				  },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "Noise"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Add Curves":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await deleteBackupMask();
			
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "duplicate",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "name": "Insta",
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "make",
                    "_target": {
                        "_ref": "adjustmentLayer"
                    },
                    "using": {
                        "_obj": "adjustmentLayer",
                        "type": {
                            "_obj": "curves",
                            "presetKind": {
                                "_enum": "presetKindType",
                                "_value": "presetKindDefault"
                            }
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Insta"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Insta"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Add Levels":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await deleteBackupMask();
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "duplicate",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "name": "Insta",
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "make",
                    "_target": {
                        "_ref": "adjustmentLayer"
                    },
                    "using": {
                        "_obj": "adjustmentLayer",
                        "type": {
                            "_obj": "levels",
                            "presetKind": {
                                "_enum": "presetKindType",
                                "_value": "presetKindDefault"
                            }
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Insta"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Insta"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Add Saturation":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
		await deleteBackupMask();
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "duplicate",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "name": "Insta",
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "make",
                    "_target": {
                        "_ref": "adjustmentLayer"
                    },
                    "using": {
                        "_obj": "adjustmentLayer",
                        "type": {
                            "_obj": "hueSaturation",
                            "presetKind": {
                                "_enum": "presetKindType",
                                "_value": "presetKindDefault"
                            },
                            "colorize": false
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Insta"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Insta"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Add Orton":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await deleteBackupMask();
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "duplicate",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "name": "Insta",
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "make",
                    "_target": {
                        "_ref": "adjustmentLayer"
                    },
                    "using": {
                        "_obj": "adjustmentLayer",
                        "type": {
                            "_obj": "levels",
                            "presetKind": {
                                "_enum": "presetKindType",
                                "_value": "presetKindDefault"
                            }
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "temp"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "mergeVisible",
                    "duplicate": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "Orton"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "temp"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "Orton"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "newPlacedLayer",
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "opacity": {
                            "_unit": "percentUnit",
                            "_value": 30
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "gaussianBlur",
                    "radius": {
                        "_unit": "pixelsUnit",
                        "_value": 37.4
                    },
                    "_options": {
                        "dialogOptions": "display"
                    }
                },
                {
                    "_obj": "make",
                    "new": {
                        "_class": "channel"
                    },
                    "at": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "using": {
                        "_enum": "userMaskEnabled",
                        "_value": "revealAll"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Insta"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Insta"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Add Detail":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await deleteBackupMask();
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "duplicate",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "name": "Insta",
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "make",
                    "_target": {
                        "_ref": "adjustmentLayer"
                    },
                    "using": {
                        "_obj": "adjustmentLayer",
                        "type": {
                            "_obj": "levels",
                            "presetKind": {
                                "_enum": "presetKindType",
                                "_value": "presetKindDefault"
                            }
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "temp"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "mergeVisible",
                    "duplicate": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "Sharpen"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "temp"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "Sharpen"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "newPlacedLayer",
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "mode": {
                            "_enum": "blendMode",
                            "_value": "overlay"
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "make",
                    "new": {
                        "_class": "channel"
                    },
                    "at": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "using": {
                        "_enum": "userMaskEnabled",
                        "_value": "revealAll"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Insta"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "highPass",
                    "radius": {
                        "_unit": "pixelsUnit",
                        "_value": 43
                    },
                    "_options": {
                        "dialogOptions": "display"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "Detail"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Insta"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Add Vibrancy":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await deleteBackupMask();
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "duplicate",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "name": "Insta",
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "make",
                    "_target": {
                        "_ref": "adjustmentLayer"
                    },
                    "using": {
                        "_obj": "adjustmentLayer",
                        "type": {
                            "_class": "vibrance"
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Insta"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Insta"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Add Filter":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await deleteBackupMask();
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "RGB"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "duplicate",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "name": "Insta",
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "make",
                    "_target": {
                        "_ref": "adjustmentLayer"
                    },
                    "using": {
                        "_obj": "adjustmentLayer",
                        "type": {
                            "_obj": "photoFilter",
                            "color": {
                                "_obj": "labColor",
                                "luminance": 67.06,
                                "a": 32,
                                "b": 120
                            },
                            "density": 25,
                            "preserveLuminosity": true
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "applyImageEvent",
                    "with": {
                        "_obj": "calculation",
                        "to": {
                            "_ref": "channel",
                            "_name": "Insta"
                        },
                        "preserveTransparency": true
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_name": "Insta"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "delete",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Save Channel":
			if(!(await instaMaskExists()))
			{
				app.showAlert("Please create an InstaMask by using the numbered buttons above before using this function");
			break;
			}
			await deleteBackupMask();
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "layer",
                        "_name": "InstaMask Group"
                    },
                    "makeVisible": false,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "ungroupLayersEvent",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "layer",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "layer",
                        "name": "Saved Mask"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Brush IM White":
			await deleteBackupMask();
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "paintbrushTool"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
					
					   "_obj": "set",
					   "_target": [
					      {
					         "_ref": "color",
					         "_property": "foregroundColor"
					      }
					   ],
					   "to": {
					      "_obj": "labColor",
					      "luminance": 100,
					      "a": 0,
					      "b": 0
					   },
					   "source": "photoshopPicker",
					  
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Brush IM Black":
		await deleteBackupMask();
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "paintbrushTool"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
					
					   "_obj": "set",
					   "_target": [
					      {
					         "_ref": "color",
					         "_property": "foregroundColor"
					      }
					   ],
					   "to": {
					      "_obj": "labColor",
					      "luminance": 0,
					      "a": 0,
					      "b": 0
					   },
					   "source": "photoshopPicker",
					  
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Small Brush":
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "paintbrushTool"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "brush",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "brush",
                        "masterDiameter": {
                            "_unit": "pixelsUnit",
                            "_value": 10
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "Large Brush":
            action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "paintbrushTool"
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "set",
                    "_target": {
                        "_ref": "brush",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    },
                    "to": {
                        "_obj": "brush",
                        "masterDiameter": {
                            "_unit": "pixelsUnit",
                            "_value": 2000
                        }
                    },
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
            break;

        case "increaseBrush250":
            var diff = 250;
            var brushSize = action.batchPlay([{
                "_obj": "get",
                "_target": [{
                        "_property": "currentToolOptions"
                    },
                    {
                        "_ref": "application",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    }
                ]
            }], {
                synchronousExecution: true
            });
            brushSize = brushSize[0].currentToolOptions.brush.diameter._value;

            action.batchPlay([{
                "_obj": "set",
                "_target": {
                    "_ref": "brush",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                },
                "to": {
                    "_obj": "brush",
                    "masterDiameter": {
                        "_unit": "pixelsUnit",
                        "_value": brushSize + diff
                    }
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});
            break;

        case "decreaseBrush250":
            var diff = -250;
            var brushSize = action.batchPlay([{
                "_obj": "get",
                "_target": [{
                        "_property": "currentToolOptions"
                    },
                    {
                        "_ref": "application",
                        "_enum": "ordinal",
                        "_value": "targetEnum"
                    }
                ]
            }], {
                synchronousExecution: true
            });

            brushSize = brushSize[0].currentToolOptions.brush.diameter._value;

            action.batchPlay([{
                "_obj": "set",
                "_target": {
                    "_ref": "brush",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                },
                "to": {
                    "_obj": "brush",
                    "masterDiameter": {
                        "_unit": "pixelsUnit",
                        "_value": brushSize + diff
                    }
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});
            break;



        case "LuminosityMask":


            await removeInstaMask();
await deleteBackupMask();
            await action.batchPlay([{
                "_obj": "make",
                "_target": {
                    "_ref": "adjustmentLayer"
                },
                "using": {
                    "_obj": "adjustmentLayer",
                    "name": "tmp",
                    "type": {
                        "_obj": "brightnessEvent",
                        "useLegacy": false
                    }
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});


            var tmpLayer = app.activeDocument.activeLayers[0];



            await action.batchPlay([{
                "_obj": "mergeVisible",
                "duplicate": true,
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});
            var tmpLayer2 = app.activeDocument.activeLayers[0];


            await showColorPicker();

            var _labColor = await getLabColor(app.foregroundColor);
            var _l = _labColor.luminance;
            var _a = _labColor.a;
            var _b = _labColor.b;

            await action.batchPlay([{
                "_obj": "colorRange",
                "fuzziness": 100,
                "minimum": {
                    "_obj": "labColor",
                    "luminance": _l,
                    "a": -128,
                    "b": -128
                },
                "maximum": {
                    "_obj": "labColor",
                    "luminance": _l,
                    "a": 127,
                    "b": 127
                },
                "colorModel": 0,
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});




            tmpLayer.delete();
            tmpLayer2.delete();

            await createInstaMask();
            showLayerMask();
            break;

        case "ChangeLuminosityMaskFuzziness":
            await removeInstaMask();
			await deselectLayerMask();
            var _labColor = await getLabColor(app.foregroundColor);
            var _l = _labColor.luminance;
            var tmpLayer = await app.activeDocument.createLayer();

            await action.batchPlay([{
                "_obj": "colorRange",
                "fuzziness": arg,
                "minimum": {
                    "_obj": "labColor",
                    "luminance": _l,
                    "a": -128,
                    "b": -128
                },
                "maximum": {
                    "_obj": "labColor",
                    "luminance": _l,
                    "a": 127,
                    "b": 127
                },
                "colorModel": 0,
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});

            await tmpLayer.delete();

            await createInstaMask();
            showLayerMask();

            break;




        case "ColorRangeMask":



            await removeInstaMask();
await deleteBackupMask();
            await action.batchPlay([{
                "_obj": "make",
                "_target": {
                    "_ref": "adjustmentLayer"
                },
                "using": {
                    "_obj": "adjustmentLayer",
                    "name": "tmp",
                    "type": {
                        "_obj": "brightnessEvent",
                        "useLegacy": false
                    }
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});


            var tmpLayer = app.activeDocument.activeLayers[0];



            await action.batchPlay([{
                "_obj": "mergeVisible",
                "duplicate": true,
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});
            var tmpLayer2 = app.activeDocument.activeLayers[0];


            await showColorPicker();

            var _labColor = await getLabColor(app.foregroundColor);
            var _l = _labColor.luminance;
            var _a = _labColor.a;
            var _b = _labColor.b;

            await action.batchPlay([{
                "_obj": "colorRange",
                "fuzziness": 100,
                "minimum": {
                    "_obj": "labColor",
                    "luminance": _l,
                    "a": _a,
                    "b": _b
                },
                "maximum": {
                    "_obj": "labColor",
                    "luminance": _l,
                    "a": _a,
                    "b": _b
                },
                "colorModel": 0,
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});

            

            tmpLayer.delete();
            tmpLayer2.delete();

            await createInstaMask();
            showLayerMask();

            break;

        case "updateMaskLevels":
			//var maskExists = await instaMaskExists();
			//if(!maskExists) break;
			//await showLayerMask();
			await loadOrCreateBackupMask();
		
			if(!arg[0]) arg[0]=0;
			if(!arg[1]) arg[1]=0;
			if(!arg[2]) arg[2]=0;
            var shadValue = Number(arg[0]);
            var highValue = Number(arg[2]);
            var midValue = Number(arg[1]) / 100;
            //0-100
            //0.01 - 9.99
            //1=50
            //gamma = log((x-b)/(w-b)) / log(.5)
            // 

            var gammaValue = Math.log((midValue - shadValue / 255) / (highValue / 255 - shadValue / 255)) / Math.log(0.5);

            gammaValue = Math.min(gammaValue, 9.99);
            gammaValue = Math.max(gammaValue, 0.01);

            await action.batchPlay([{
                    "_obj": "select",
                    "_target": {
                        "_ref": "channel",
                        "_enum": "channel",
                        "_value": "mask"
                    },
                    "makeVisible": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
                {
                    "_obj": "levels",
                    "presetKind": {
                        "_enum": "presetKindType",
                        "_value": "presetKindCustom"
                    },
                    "adjustment": [{
                        "_obj": "levelsAdjustment",
                        "channel": {
                            "_ref": "channel",
                            "_enum": "ordinal",
                            "_value": "targetEnum"
                        },
                        "input": [
                            shadValue,
                            highValue
                        ],
                        "gamma": gammaValue
                    }],
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
            ], {});
			showLayerMask();
            break;

        case "ChangeColorMaskFuzziness":

            await removeInstaMask();
			await deselectLayerMask();

            var _labColor = await getLabColor(app.foregroundColor);
            var _l = _labColor.luminance;
            var _a = _labColor.a;
            var _b = _labColor.b;

            var tmpLayer = await app.activeDocument.createLayer();

            await action.batchPlay([{
                "_obj": "colorRange",
                "fuzziness": arg,
                "minimum": {
                    "_obj": "labColor",
                    "luminance": _l,
                    "a": _a,
                    "b": _b
                },
                "maximum": {
                    "_obj": "labColor",
                    "luminance": _l,
                    "a": _a,
                    "b": _b
                },
                "colorModel": 0,
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});


            await tmpLayer.delete();

            await createInstaMask();
            showLayerMask();
            break;

		case "Close":
			//action.batchPlay([{ "_obj": "select","_target": { "_ref": "menuItemClass", "_name": "InstaMask" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
			break;


        } //switch end

    } catch (e) {
        console.log(e + ":" + e.line);
    }
}

async function runScriptAsync_hub(func, arg) {


	switch (func) {
		case "align": {
		await action.batchPlay([{ "_obj": "selectAllLayers","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "align","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "using": { "_enum": "alignDistributeSelector", "_value": "ADSContent" }, "apply": { "_enum": "projection", "_value": "auto" }, "vignette": false, "radialDistort": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Delete Layer": {
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Apply to highlights": {
			if(hasLayerMask()) await deleteLayerMask();
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		
			
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to":{"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Apply to shadows": {
			if(hasLayerMask()) await deleteLayerMask();
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to":{"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Adjust": {
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": true, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "levels","presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "_options": { "dialogOptions": "display" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Undo": {
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "historyState", "_enum": "ordinal", "_value": "previous" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Del Layer Mask": {
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
    case "Merge ND":
        action.batchPlay([{
                    "_obj": "mergeVisible",
                    "duplicate": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
        ], {});
        break;
	case "stackAll":
        var allDocs = app.documents;
        for(var i=0;i<app.documents.length;i++)
            allDocs.push(app.documents[i]);

            var targetDoc = undefined;

            for(var i=allDocs.length-1;i>=0;i--)
            {

                app.activeDocument = allDocs[i];
                if(!targetDoc) 
                {
					await action.batchPlay([{
   "_obj": "duplicate",
   "_target": [
      {
         "_ref": "document",
         "_enum": "ordinal",
         "_value": "first"
      }
   ]
}
        ], {});
                 targetDoc  = app.documents[app.documents.length-1];
                 allDocs[i].closeWithoutSaving();
                continue;
                }

                	await allDocs[i].mergeVisibleLayers();
                

                try{
                   await action.batchPlay([
					
					{
					   "_obj": "delete",
					   "_target": [
					      {
					         "_ref": "layer",
					         "_enum": "ordinal",
					         "_value": "hidden"
					      }
					   ]
					}
					 ], {});
                }catch(e){}
				
				 await action.batchPlay([
				{
				   "_obj": "duplicate",
				   "_target": [
				      {
				         "_ref": "layer",
				         "_enum": "ordinal",
				         "_value": "targetEnum"
				      }
				   ],
				   "to": {
				      "_ref": "document",
				      "_name": targetDoc.title
				   }
				}
				], {});
                //allDocs[i].duplicateLayers(allDocs[i].layers[0],targetDoc);
                allDocs[i].closeWithoutSaving();
            }
		break;
    
			//action.batchPlay([], {});

	}

}

async function runScriptAsync_ff(func, arg) {

	switch (func) {
	case "Enhance Details":

		
		action.batchPlay([({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"temp"}}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", opacity:{_unit:"percentUnit", _value:1}}}), 
		
	    {
	                        "_obj": "mergeVisible",
	                        "duplicate": true,
	                        "_options": {
	                            "dialogOptions": "silent"
	                        }
	    },
		 ({_obj:"copyToLayer"}), ({_obj:"invert"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", mode:{_enum:"blendMode", _value:"vividLight"}}}), 
		({_obj:"surfaceBlur",  "_options": {
        "dialogOptions": "display"
    },radius:{_unit:"pixelsUnit", _value:34}, threshold:36}), 
	({_obj:"mergeLayersNew"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Detail Enhancer"}}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", mode:{_enum:"blendMode", _value:"overlay"}}}), ({_obj:"select", _target:[({_ref:"layer", _name:"temp"})], makeVisible:false}), ({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})]}), ({_obj:"select", _target:[({_ref:"layer", _name:"Detail Enhancer"})], makeVisible:false})], {});
		
		break;
		
	case "JM (c) Width":
		var myValue = await dialogs.prompt("How wide do you need your image in pixels?", "", "0");
		
		if(myValue.which!=1 || myValue.value<=0) return;
		myValue = parseInt(myValue.value);
		
		await action.batchPlay([({_obj:"duplicate", _target:[({_ref:"document", _enum:"ordinal", _value:"first"})]}), ({_obj:"make", _target:[({_ref:"adjustmentLayer"})], using:{_obj:"adjustmentLayer", type:{_obj:"curves", presetKind:{_enum:"presetKindType", _value:"presetKindDefault"}}}}), ({_obj:"flattenImage"}), ({_obj:"set", _target:[({_ref:"layer", _property:"background"})], to:{_obj:"layer", name:"Not Sharpened", opacity:{_unit:"percentUnit", _value:100}, mode:{_enum:"blendMode", _value:"normal"}}}), ({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"not s temp"}}), ({_obj:"mergeLayersNew"}), ({_obj:"imageSize", width:{_unit:"pixelsUnit", _value:myValue* 1.67}, resolution:{_unit:"densityUnit", _value:300}, constrainProportions:true, interfaceIconFrameDimmed:{_enum:"interpolationType", _value:"bicubic"}}), ({_obj:"copyToLayer"}), ({_obj:"make", new:{_class:"channel"}, at:{_ref:"channel", _enum:"channel", _value:"mask"}, using:{_enum:"userMaskEnabled", _value:"revealAll"}}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Sharpened"}}), ({_obj:"sharpen"}), ({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Sharpened More"}}), ({_obj:"sharpen"}), ({_obj:"copyToLayer"}), 
		({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Extra Sharp For Larger Images"}}), 
		{
		   "_obj": "hide",
		   "null": [
		      {
		         "_ref": "layer",
		         "_enum": "ordinal",
		         "_value": "targetEnum"
		      }
		   ],
		 },
		({_obj:"sharpen"}), ({_obj:"imageSize", width:{_unit:"pixelsUnit", _value:myValue}, resolution:{_unit:"densityUnit", _value:300}, constrainProportions:true, interfaceIconFrameDimmed:{_enum:"interpolationType", _value:"bicubic"}}), ({_obj:"select", _target:[({_ref:"layer", _name:"Not Sharpened"})], makeVisible:false}), ({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"ns temp"}}), ({_obj:"mergeLayersNew"}),{
                    "_obj": "select",
                    "_target": {
                        "_ref": "menuItemClass",
                        "_enum": "menuItemType",
                        "_value": "actualPixels"
                    }
                }]
		, {modalBehavior:"wait"});
		
		var convert = await dialogs.confirm("Do you want to convert the colour profile to sRGB (recommended for the Web)?");
		if(convert.which==1)
		await action.batchPlay([
		({_obj:"convertToProfile", _target:[({_ref:"document", _enum:"ordinal", _value:"targetEnum"})], to:"sRGB IEC61966-2.1", intent:{_enum:"intent", _value:"colorimetric"}, mapBlack:true, dither:true, flatten:false, rasterizePlaced:false, shadowMode:-1})]
				, {modalBehavior:"wait"});
				
		
		dialogs.alert("Sharpening Complete");
		break;
		
	case "JM (c) Height":
		var myValue = await dialogs.prompt("How high do you need your image in pixels?", "", "0");
		
		if(myValue.which!=1 || myValue.value<=0) return;
		myValue = parseInt(myValue.value);
		
		await action.batchPlay([({_obj:"duplicate", _target:[({_ref:"document", _enum:"ordinal", _value:"first"})]}), ({_obj:"make", _target:[({_ref:"adjustmentLayer"})], using:{_obj:"adjustmentLayer", type:{_obj:"curves", presetKind:{_enum:"presetKindType", _value:"presetKindDefault"}}}}), ({_obj:"flattenImage"}), ({_obj:"set", _target:[({_ref:"layer", _property:"background"})], to:{_obj:"layer", name:"Not Sharpened", opacity:{_unit:"percentUnit", _value:100}, mode:{_enum:"blendMode", _value:"normal"}}}), ({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"not s temp"}}), ({_obj:"mergeLayersNew"}), ({_obj:"imageSize", height:{_unit:"pixelsUnit", _value:myValue* 1.67}, resolution:{_unit:"densityUnit", _value:300}, constrainProportions:true, interfaceIconFrameDimmed:{_enum:"interpolationType", _value:"bicubic"}}), ({_obj:"copyToLayer"}), ({_obj:"make", new:{_class:"channel"}, at:{_ref:"channel", _enum:"channel", _value:"mask"}, using:{_enum:"userMaskEnabled", _value:"revealAll"}}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Sharpened"}}), ({_obj:"sharpen"}), ({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Sharpened More"}}), ({_obj:"sharpen"}), ({_obj:"copyToLayer"}), 
		({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Extra Sharp For Larger Images"}}), 
		{
		   "_obj": "hide",
		   "null": [
		      {
		         "_ref": "layer",
		         "_enum": "ordinal",
		         "_value": "targetEnum"
		      }
		   ],
		 },
		({_obj:"sharpen"}), ({_obj:"imageSize", height:{_unit:"pixelsUnit", _value:myValue}, resolution:{_unit:"densityUnit", _value:300}, constrainProportions:true, interfaceIconFrameDimmed:{_enum:"interpolationType", _value:"bicubic"}}), ({_obj:"select", _target:[({_ref:"layer", _name:"Not Sharpened"})], makeVisible:false}), ({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"ns temp"}}), ({_obj:"mergeLayersNew"}),{
                    "_obj": "select",
                    "_target": {
                        "_ref": "menuItemClass",
                        "_enum": "menuItemType",
                        "_value": "actualPixels"
                    }
                }]
		, {modalBehavior:"wait"});
		
		var convert = await dialogs.confirm("Do you want to convert the colour profile to sRGB (recommended for the Web)?");
		if(convert.which==1)
		await action.batchPlay([
		({_obj:"convertToProfile", _target:[({_ref:"document", _enum:"ordinal", _value:"targetEnum"})], to:"sRGB IEC61966-2.1", intent:{_enum:"intent", _value:"colorimetric"}, mapBlack:true, dither:true, flatten:false, rasterizePlaced:false, shadowMode:-1})]
				, {modalBehavior:"wait"});
				
		
		dialogs.alert("Sharpening Complete");
		break;
		
		case "Colour Pop": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "channelMixer" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "red": { "_obj": "channelMatrix" ,"red": { "_unit": "percentUnit",
		"_value": 100 } }, "$Grn ": { "_obj": "channelMatrix" ,"$Grn ": { "_unit": "percentUnit",
		"_value": 100 } }, "blue": { "_obj": "channelMatrix" ,"blue": { "_unit": "percentUnit",
		"_value": 100 } } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "channelMixer" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "red": { "_obj": "channelMatrix" ,"red": { "_unit": "percentUnit",
		"_value": 91 }, "$Grn ": { "_unit": "percentUnit",
		"_value": 136 }, "blue": { "_unit": "percentUnit",
		"_value": -200 } }, "$Grn ": { "_obj": "channelMatrix" ,"red": { "_unit": "percentUnit",
		"_value": 2 }, "$Grn ": { "_unit": "percentUnit",
		"_value": 45 }, "blue": { "_unit": "percentUnit",
		"_value": 48 } }, "blue": { "_obj": "channelMatrix" ,"red": { "_unit": "percentUnit",
		"_value": 127 }, "blue": { "_unit": "percentUnit",
		"_value": 0 } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Colour Mix" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Hue Adjust" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 4, "beginRamp": 135, "beginSustain": 165, "endSustain": 195, "endRamp": 225, "hue": 8, "saturation": -17, "lightness": 20 },
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 6, "beginRamp": 255, "beginSustain": 285, "endSustain": 315, "endRamp": 345, "hue": -38, "saturation": -36, "lightness": 0 }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Hue Adjust" }, "makeVisible": false, "layerID": [
			12
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"adjustment": [
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 4, "beginRamp": 135, "beginSustain": 165, "endSustain": 195, "endRamp": 225, "hue": 25, "saturation": 5, "lightness": 20 },
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 6, "beginRamp": 255, "beginSustain": 285, "endSustain": 315, "endRamp": 345, "hue": -24, "saturation": -43, "lightness": 0 }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Colour Mix" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
			11,
			12
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 13, "layerSectionEnd": 14, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Infrared" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Infrared" }, "makeVisible": false, "layerID": [
			21
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
		"_value": 30 } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
		"_value": 100 } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 0, "vertical": 8 },
			{ "_obj": "paint" ,"horizontal": 96, "vertical": 76 },
			{ "_obj": "paint" ,"horizontal": 213, "vertical": 207 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] },
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "red" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 10, "vertical": 0 },
			{ "_obj": "paint" ,"horizontal": 238, "vertical": 255 }
		] },
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "grain" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 15, "vertical": 0 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] },
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "blue" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 0, "vertical": 25 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Colour Pop" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "curves" ,"adjustment": [
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 0, "vertical": 20 },
			{ "_obj": "paint" ,"horizontal": 132, "vertical": 99 },
			{ "_obj": "paint" ,"horizontal": 213, "vertical": 207 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] },
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "blue" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 0, "vertical": 52 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Infrared" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
			26,
			28
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 29, "layerSectionEnd": 30, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Colour Pop" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Cinematic Green": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "hueSatAdjustmentV2" ,"hue": 0, "saturation": -40, "lightness": 0 }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Soften Colours" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Green Shadows" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 8, "vertical": 16 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] },
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "grain" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 15, "vertical": 29 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] },
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "blue" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 27, "vertical": 25 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 238 }
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "levelsAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "input": [
			0,
			240
		], "gamma": 0.86 }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Contrast gr" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Green Shadows" }, "makeVisible": false, "layerID": [
			17
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "curves" ,"adjustment": [
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 8, "vertical": 16 },
			{ "_obj": "paint" ,"horizontal": 101, "vertical": 90 },
			{ "_obj": "paint" ,"horizontal": 186, "vertical": 186 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 7, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "black" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"fillOpacity": { "_unit": "percentUnit",
		"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": [{ "_property": "layerEffects" }, { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }]}, "to": { "_obj": "layerEffects" ,"scale": { "_unit": "percentUnit",
		"_value": 100 }, "gradientFill": { "_obj": "gradientFill" ,"enabled": true, "present": true, "showInDialog": true, "mode": { "_enum": "blendMode", "_value": "softLight" }, "opacity": { "_unit": "percentUnit",
		"_value": 34 }, "gradient": { "_obj": "gradientClassEvent" ,"name": "Custom", "gradientForm": { "_enum": "gradientForm", "_value": "customStops" }, "interfaceIconFrameDimmed": 4096, "colors": [
			{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 0, "midpoint": 50 },
			{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 4096, "midpoint": 50 }
		], "transparency": [
			{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
		"_value": 80 }, "location": 0, "midpoint": 50 },
			{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
		"_value": 0 }, "location": 4096, "midpoint": 50 }
		] }, "angle": { "_unit": "angleUnit",
		"_value": 90 }, "type": { "_enum": "gradientType", "_value": "radial" }, "reverse": true, "dither": false, "align": true, "scale": { "_unit": "percentUnit",
		"_value": 150 }, "offset": { "_obj": "paint" ,"horizontal": { "_unit": "percentUnit",
		"_value": 0 }, "vertical": { "_unit": "percentUnit",
		"_value": 0 } } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Vignette" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Contrast gr" }, "makeVisible": false, "layerID": [
			107
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Soften Colours" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelectionContinuous" }, "makeVisible": false, "layerID": [
			41,
			42,
			44,
			43
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 45, "layerSectionEnd": 46, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Cinematic Green" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Autumn Colours": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 2, "beginRamp": 37, "beginSustain": 90, "endSustain": 120, "endRamp": 149, "hue": -103, "saturation": 0, "lightness": 0 }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Autumn Colours" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Cold City": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Reduce Yellows" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 1, "beginRamp": 315, "beginSustain": 345, "endSustain": 15, "endRamp": 45, "hue": 0, "saturation": -35, "lightness": 0 },
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 2, "beginRamp": 15, "beginSustain": 45, "endSustain": 75, "endRamp": 105, "hue": 0, "saturation": -59, "lightness": 0 },
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 6, "beginRamp": 255, "beginSustain": 285, "endSustain": 315, "endRamp": 345, "hue": 0, "saturation": -24, "lightness": 0 }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Deep Blue" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		

		
		await action.batchPlay([{ "_obj": "set","_target": [
		      {
		         "_ref": "color",
		         "_property": "foregroundColor"
		      }
		   ], "to": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
		"_value": 241.408081054688 }, "saturation": 34.5098039215686, "brightness": 23.5294117647059 }, "source": "photoshopPicker", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		
		
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "foregroundColor" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "hardLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "overlay" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
		"_value": 73 } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Inject Blues" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer"  }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			5
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "colorBalance" ,"shadowLevels": [
			0,
			0,
			0
		], "midtoneLevels": [
			0,
			0,
			0
		], "highlightLevels": [
			0,
			0,
			0
		], "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Inject Blues" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "colorBalance" ,"shadowLevels": [
			-6,
			0,
			6
		], "highlightLevels": [
			-13,
			-2,
			18
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Protect Shadows" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "levelsAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "output": [
			8,
			255
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 7, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "black" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"fillOpacity": { "_unit": "percentUnit",
		"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": [{ "_property": "layerEffects" }, { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }]}, "to": { "_obj": "layerEffects" ,"scale": { "_unit": "percentUnit",
		"_value": 100 }, "gradientFill": { "_obj": "gradientFill" ,"enabled": true, "present": true, "showInDialog": true, "mode": { "_enum": "blendMode", "_value": "softLight" }, "opacity": { "_unit": "percentUnit",
		"_value": 34 }, "gradient": { "_obj": "gradientClassEvent" ,"name": "Custom", "gradientForm": { "_enum": "gradientForm", "_value": "customStops" }, "interfaceIconFrameDimmed": 4096, "colors": [
			{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 0, "midpoint": 50 },
			{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 4096, "midpoint": 50 }
		], "transparency": [
			{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
		"_value": 80 }, "location": 0, "midpoint": 50 },
			{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
		"_value": 0 }, "location": 4096, "midpoint": 50 }
		] }, "angle": { "_unit": "angleUnit",
		"_value": 90 }, "type": { "_enum": "gradientType", "_value": "radial" }, "reverse": true, "dither": false, "align": true, "scale": { "_unit": "percentUnit",
		"_value": 150 }, "offset": { "_obj": "paint" ,"horizontal": { "_unit": "percentUnit",
		"_value": 0 }, "vertical": { "_unit": "percentUnit",
		"_value": 0 } } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Vignette" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Reduce Yellows" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelectionContinuous" }, "makeVisible": false, "layerID": [
			3,
			4,
			6,
			7
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 8, "layerSectionEnd": 9, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Cold City" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Magic Green": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Contrast" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "levelsAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "input": [
			10,
			239
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Midtones Kick" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
		"_value": 50 } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 0, "vertical": 0 },
			{ "_obj": "paint" ,"horizontal": 85, "vertical": 69 },
			{ "_obj": "paint" ,"horizontal": 176, "vertical": 204 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "curves" ,"adjustment": [
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 0, "vertical": 0 },
			{ "_obj": "paint" ,"horizontal": 79, "vertical": 71 },
			{ "_obj": "paint" ,"horizontal": 163, "vertical": 208 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 3, "beginRamp": 75, "beginSustain": 105, "endSustain": 135, "endRamp": 165, "hue": 0, "saturation": 33, "lightness": 0 }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Greens" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"adjustment": [
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 2, "beginRamp": 15, "beginSustain": 45, "endSustain": 75, "endRamp": 105, "hue": 0, "saturation": 23, "lightness": 0 }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Orton" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "calculation": { "_enum": "calculationType", "_value": "multiply" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "screen" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "newPlacedLayer", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "gaussianBlur","radius": { "_unit": "pixelsUnit",
		"_value": 41.5 }, "_options": { "dialogOptions": "display" } }], {  });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Brights Boost" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "levelsAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "input": [
			0,
			232
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "hide","_target": [
			{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "show","_target": [
			{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "historyState", "_enum": "ordinal", "_value": "previous" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "hide","_target": [
			{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "show","_target": [
			{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "colorBalance" ,"shadowLevels": [
			0,
			0,
			0
		], "midtoneLevels": [
			0,
			0,
			0
		], "highlightLevels": [
			0,
			0,
			0
		], "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "colorBalance" ,"shadowLevels": [
			0,
			2,
			-15
		], "midtoneLevels": [
			0,
			0,
			-5
		], "highlightLevels": [
			0,
			-8,
			-8
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Boost Greens" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 7, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "black" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"fillOpacity": { "_unit": "percentUnit",
		"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": [{ "_property": "layerEffects" }, { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }]}, "to": { "_obj": "layerEffects" ,"scale": { "_unit": "percentUnit",
		"_value": 100 }, "gradientFill": { "_obj": "gradientFill" ,"enabled": true, "present": true, "showInDialog": true, "mode": { "_enum": "blendMode", "_value": "softLight" }, "opacity": { "_unit": "percentUnit",
		"_value": 34 }, "gradient": { "_obj": "gradientClassEvent" ,"name": "Custom", "gradientForm": { "_enum": "gradientForm", "_value": "customStops" }, "interfaceIconFrameDimmed": 4096, "colors": [
			{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 0, "midpoint": 50 },
			{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 4096, "midpoint": 50 }
		], "transparency": [
			{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
		"_value": 80 }, "location": 0, "midpoint": 50 },
			{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
		"_value": 0 }, "location": 4096, "midpoint": 50 }
		] }, "angle": { "_unit": "angleUnit",
		"_value": 90 }, "type": { "_enum": "gradientType", "_value": "radial" }, "reverse": true, "dither": false, "align": true, "scale": { "_unit": "percentUnit",
		"_value": 150 }, "offset": { "_obj": "paint" ,"horizontal": { "_unit": "percentUnit",
		"_value": 0 }, "vertical": { "_unit": "percentUnit",
		"_value": 0 } } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Vignette" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "levelsAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "output": [
			7,
			255
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Protect Shadows" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Contrast" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelectionContinuous" }, "makeVisible": false, "layerID": [
			9,
			10,
			11,
			13,
			14,
			15,
			16
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 17, "layerSectionEnd": 18, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Magical Green Landscape" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "BW Drama": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "blackAndWhite" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "red": 40, "yellow": 60, "$Grn ": 40, "cyan": 60, "blue": 20, "magenta": 80, "useTint": false, "tintColor": { "_obj": "RGBColor" ,"red": 225.000457763672, "$Grn ": 211.000671386719, "blue": 179.001159667969 } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "BW" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Kick" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "levelsAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "input": [
			10,
			237
		], "gamma": 0.69, "output": [
			10,
			255
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "hardLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Details BW" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "highPass","radius": { "_unit": "pixelsUnit",
		"_value": 89.9 }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "BW" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelectionContinuous" }, "makeVisible": false, "layerID": [
			3,
			4,
			5
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 6, "layerSectionEnd": 7, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "BW Drama" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Details BW" }, "makeVisible": false, "layerID": [
			5
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "addNoise","distort": { "_enum": "distort", "_value": "uniformDistribution" }, "noise": { "_unit": "percentUnit",
		"_value": 15.36 }, "monochromatic": false, "": 497914, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Optional Noise" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "hide","_target": [
			{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 7, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "black" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"fillOpacity": { "_unit": "percentUnit",
		"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": [{ "_property": "layerEffects" }, { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }]}, "to": { "_obj": "layerEffects" ,"scale": { "_unit": "percentUnit",
		"_value": 100 }, "gradientFill": { "_obj": "gradientFill" ,"enabled": true, "present": true, "showInDialog": true, "mode": { "_enum": "blendMode", "_value": "softLight" }, "opacity": { "_unit": "percentUnit",
		"_value": 34 }, "gradient": { "_obj": "gradientClassEvent" ,"name": "Custom", "gradientForm": { "_enum": "gradientForm", "_value": "customStops" }, "interfaceIconFrameDimmed": 4096, "colors": [
			{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 0, "midpoint": 50 },
			{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 4096, "midpoint": 50 }
		], "transparency": [
			{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
		"_value": 80 }, "location": 0, "midpoint": 50 },
			{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
		"_value": 0 }, "location": 4096, "midpoint": 50 }
		] }, "angle": { "_unit": "angleUnit",
		"_value": 90 }, "type": { "_enum": "gradientType", "_value": "radial" }, "reverse": true, "dither": false, "align": true, "scale": { "_unit": "percentUnit",
		"_value": 150 }, "offset": { "_obj": "paint" ,"horizontal": { "_unit": "percentUnit",
		"_value": 0 }, "vertical": { "_unit": "percentUnit",
		"_value": 0 } } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Vignette" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Infrared": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "channelMixer" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "red": { "_obj": "channelMatrix" ,"red": { "_unit": "percentUnit",
		"_value": 100 } }, "$Grn ": { "_obj": "channelMatrix" ,"$Grn ": { "_unit": "percentUnit",
		"_value": 100 } }, "blue": { "_obj": "channelMatrix" ,"blue": { "_unit": "percentUnit",
		"_value": 100 } } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "channelMixer" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "red": { "_obj": "channelMatrix" ,"red": { "_unit": "percentUnit",
		"_value": 91 }, "$Grn ": { "_unit": "percentUnit",
		"_value": 136 }, "blue": { "_unit": "percentUnit",
		"_value": -200 } }, "$Grn ": { "_obj": "channelMatrix" ,"red": { "_unit": "percentUnit",
		"_value": 2 }, "$Grn ": { "_unit": "percentUnit",
		"_value": 45 }, "blue": { "_unit": "percentUnit",
		"_value": 48 } }, "blue": { "_obj": "channelMatrix" ,"red": { "_unit": "percentUnit",
		"_value": 127 }, "blue": { "_unit": "percentUnit",
		"_value": 0 } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Colour Mix" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Hue Adjust" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 4, "beginRamp": 135, "beginSustain": 165, "endSustain": 195, "endRamp": 225, "hue": 8, "saturation": -17, "lightness": 20 },
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 6, "beginRamp": 255, "beginSustain": 285, "endSustain": 315, "endRamp": 345, "hue": -38, "saturation": -36, "lightness": 0 }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Hue Adjust" }, "makeVisible": false, "layerID": [
			12
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"adjustment": [
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 4, "beginRamp": 135, "beginSustain": 165, "endSustain": 195, "endRamp": 225, "hue": 25, "saturation": 5, "lightness": 20 },
			{ "_obj": "hueSatAdjustmentV2" ,"localRange": 6, "beginRamp": 255, "beginSustain": 285, "endSustain": 315, "endRamp": 345, "hue": -24, "saturation": -43, "lightness": 0 }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Colour Mix" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
			11,
			12
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 13, "layerSectionEnd": 14, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Infrared" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Ancient Photo": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "blackAndWhite" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "red": 40, "yellow": 60, "$Grn ": 40, "cyan": 60, "blue": 20, "magenta": 80, "useTint": false, "tintColor": { "_obj": "RGBColor" ,"red": 225.000457763672, "$Grn ": 211.000671386719, "blue": 179.001159667969 } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "BW" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Kick" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "levelsAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "input": [
			10,
			237
		], "gamma": 0.69, "output": [
			10,
			255
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "hardLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Details BW" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "highPass","radius": { "_unit": "pixelsUnit",
		"_value": 89.9 }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "BW" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelectionContinuous" }, "makeVisible": false, "layerID": [
			3,
			4,
			5
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 6, "layerSectionEnd": 7, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "BW Drama" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Details BW" }, "makeVisible": false, "layerID": [
			5
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "addNoise","distort": { "_enum": "distort", "_value": "uniformDistribution" }, "noise": { "_unit": "percentUnit",
		"_value": 15.36 }, "monochromatic": false, "": 497914, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Optional Noise" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 7, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "black" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"fillOpacity": { "_unit": "percentUnit",
		"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": [{ "_property": "layerEffects" }, { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }]}, "to": { "_obj": "layerEffects" ,"scale": { "_unit": "percentUnit",
		"_value": 100 }, "gradientFill": { "_obj": "gradientFill" ,"enabled": true, "present": true, "showInDialog": true, "mode": { "_enum": "blendMode", "_value": "softLight" }, "opacity": { "_unit": "percentUnit",
		"_value": 34 }, "gradient": { "_obj": "gradientClassEvent" ,"name": "Custom", "gradientForm": { "_enum": "gradientForm", "_value": "customStops" }, "interfaceIconFrameDimmed": 4096, "colors": [
			{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 0, "midpoint": 50 },
			{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 4096, "midpoint": 50 }
		], "transparency": [
			{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
		"_value": 80 }, "location": 0, "midpoint": 50 },
			{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
		"_value": 0 }, "location": 4096, "midpoint": 50 }
		] }, "angle": { "_unit": "angleUnit",
		"_value": 90 }, "type": { "_enum": "gradientType", "_value": "radial" }, "reverse": true, "dither": false, "align": true, "scale": { "_unit": "percentUnit",
		"_value": 150 }, "offset": { "_obj": "paint" ,"horizontal": { "_unit": "percentUnit",
		"_value": 0 }, "vertical": { "_unit": "percentUnit",
		"_value": 0 } } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Vignette" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 67.06, "a": 32, "b": 120 }, "density": 25, "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "photoFilter" ,"color": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
		"_value": 35.123291015625 }, "saturation": 70.5882352941177, "brightness": 67.4509803921569 }, "density": 89 }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Sepia" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Reduce Noise": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "temp" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Reduce Noise" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "temp" }, "makeVisible": false, "layerID": [
			114
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			114
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Reduce Noise" }, "makeVisible": false, "layerID": [
			115
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "newPlacedLayer", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "denoise","colorNoise": { "_unit": "percentUnit",
		"_value": 45 }, "sharpen": { "_unit": "percentUnit",
		"_value": 25 }, "removeJPEGArtifact": false, "channelDenoise": [
			{ "_obj": "channelDenoiseParams" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "amount": 6, "edgeFidelity": 60 },
			{ "_obj": "channelDenoiseParams" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "red" }, "amount": 0 },
			{ "_obj": "channelDenoiseParams" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "grain" }, "amount": 0 },
			{ "_obj": "channelDenoiseParams" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "blue" }, "amount": 0 }
		], "preset": "Default", "_options": { "dialogOptions": "display" } }], {  });
		};
		break;
		
		case "Remove CA": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "temp" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Remove CA" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "temp" }, "makeVisible": false, "layerID": [
			117
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			117
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Remove CA" }, "makeVisible": false, "layerID": [
			118
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "color" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "gaussianBlur","radius": { "_unit": "pixelsUnit",
		"_value": 19.4 }, "_options": { "dialogOptions": "display" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "invert", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "paintbrushTool" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		
		await action.batchPlay([{ "_obj": "set","_target": [
		      {
		         "_ref": "color",
		         "_property": "foregroundColor"
		      }
		   ], "to": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
		"_value": 0 }, "saturation": 0, "brightness": 100 }, "source": "photoshopPicker", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		
		break;
		case "Soft Vignette": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 7, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "black" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"fillOpacity": { "_unit": "percentUnit",
		"_value": 0 } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": [{ "_property": "layerEffects" }, { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }]}, "to": { "_obj": "layerEffects" ,"scale": { "_unit": "percentUnit",
		"_value": 100 }, "gradientFill": { "_obj": "gradientFill" ,"enabled": true, "present": true, "showInDialog": true, "mode": { "_enum": "blendMode", "_value": "softLight" }, "opacity": { "_unit": "percentUnit",
		"_value": 34 }, "gradient": { "_obj": "gradientClassEvent" ,"name": "Custom", "gradientForm": { "_enum": "gradientForm", "_value": "customStops" }, "interfaceIconFrameDimmed": 4096, "colors": [
			{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 0, "midpoint": 50 },
			{ "_obj": "colorStop" ,"color": { "_obj": "RGBColor" ,"red": 0, "$Grn ": 0, "blue": 0 }, "type": { "_enum": "colorStopType", "_value": "userStop" }, "location": 4096, "midpoint": 50 }
		], "transparency": [
			{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
		"_value": 80 }, "location": 0, "midpoint": 50 },
			{ "_obj": "transferSpec" ,"opacity": { "_unit": "percentUnit",
		"_value": 0 }, "location": 4096, "midpoint": 50 }
		] }, "angle": { "_unit": "angleUnit",
		"_value": 90 }, "type": { "_enum": "gradientType", "_value": "radial" }, "reverse": true, "dither": false, "align": true, "scale": { "_unit": "percentUnit",
		"_value": 150 }, "offset": { "_obj": "paint" ,"horizontal": { "_unit": "percentUnit",
		"_value": 0 }, "vertical": { "_unit": "percentUnit",
		"_value": 0 } } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Vignette" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Man Vignette": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Dark" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 0, "vertical": 8 },
			{ "_obj": "paint" ,"horizontal": 192, "vertical": 168 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 0, "vertical": 0 },
			{ "_obj": "paint" ,"horizontal": 172, "vertical": 190 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Bright" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "invert", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "invert", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Bright" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
			22,
			23
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 24, "layerSectionEnd": 25, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Manual Vignette" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "paintbrushTool" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": [
		      {
		         "_ref": "color",
		         "_property": "foregroundColor"
		      }
		   ], "to": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
		"_value": 0 }, "saturation": 0, "brightness": 100 }, "source": "photoshopPicker", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Dark" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Sharpen Full": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "begin" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Sharpen" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "begin" }, "makeVisible": false, "layerID": [
			2
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			2
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Sharpen" }, "makeVisible": false, "layerID": [
			3
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "blackAndWhite" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "red": 40, "yellow": 60, "$Grn ": 40, "cyan": 60, "blue": 20, "magenta": 80, "useTint": false, "tintColor": { "_obj": "RGBColor" ,"red": 225.000457763672, "$Grn ": 211.000671386719, "blue": 179.001159667969 } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeLayersNew", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "hardLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "newPlacedLayer", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "highPass","radius": { "_unit": "pixelsUnit",
		"_value": 2.8 }, "_options": { "dialogOptions": "display" } }], {  });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		
		
		case "Edge Dodge": {
		
			
await action.batchPlay([
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "adjustmentLayer"
      })
    ],
    using: {
      _obj: "adjustmentLayer",
      type: {
        _obj: "levels",
        presetKind: {
          _enum: "presetKindType",
          _value: "presetKindDefault"
        }
      }
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "temp"
    }
  }),
  ({
    _obj: "mergeVisible", "duplicate": true
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "Sharpen"
    }
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "temp"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "delete",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ]
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "Sharpen"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "newPlacedLayer"
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "channel",
        _property: "selection"
      })
    ],
    to: {
      _enum: "ordinal",
      _value: "allEnum"
    }
  }),
  ({
    _obj: "copyEvent"
  }),
  ({
    _obj: "make",
    new: {
      _obj: "channel",
      colorIndicates: {
        _enum: "maskIndicator",
        _value: "maskedAreas"
      },
      color: {
        _obj: "RGBColor",
        red: 255,
        grain: 0,
        blue: 0
      },
      opacity: 50
    }
  }),
  ({
    _obj: "paste",
    antiAlias: {
      _enum: "antiAliasType",
      _value: "antiAliasNone"
    },
    as: {
      _class: "pixel"
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "channel",
        _property: "selection"
      })
    ],
    to: {
      _enum: "ordinal",
      _value: "none"
    }
  }),
  ({
    _obj: "findEdges"
  }),
  ({
    _obj: "gaussianBlur",
    radius: {
      _unit: "pixelsUnit",
      _value: 3.7
    }
  }),
  ({
    _obj: "levels",
    presetKind: {
      _enum: "presetKindType",
      _value: "presetKindCustom"
    },
    adjustment: [
      ({
        _obj: "levelsAdjustment",
        channel: {
          _ref: "channel",
          _enum: "ordinal",
          _value: "targetEnum"
        },
        input: [
          152,
          241
        ],
        gamma: 0.51
      })
    ],
	"_options": { "dialogOptions": "display" }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "channel",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "channel",
      name: "Edge Find"
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "channel",
        _property: "selection"
      })
    ],
    to: {
      _ref: "channel",
      _enum: "ordinal",
      _value: "targetEnum"
    }
  }),
  ({
    _obj: "make",
    new: {
      _class: "channel"
    },
    at: {
      _ref: "channel",
      _enum: "channel",
      _value: "mask"
    },
    using: {
      _enum: "userMaskEnabled",
      _value: "revealSelection"
    }
  }),
  {
     "_obj": "select",
     "_target": [
        {
           "_ref": "channel",
           "_enum": "channel",
           "_value": "RGB"
        }
     ],
     "makeVisible": false
  },
  ({
    _obj: "unsharpMask",
    amount: {
      _unit: "percentUnit",
      _value: 190
    },
    radius: {
      _unit: "pixelsUnit",
      _value: 1.9
    },
    threshold: 0,
	"_options": { "dialogOptions": "display" }
  }),
  ({
    _obj: "delete",
    _target: [
      ({
        _ref: "channel",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ]
  })
], {});
			
			
		};
			
		break;
		case "freq sep 16": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "temp" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Global" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "temp" }, "makeVisible": false, "layerID": [
			333
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			333
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Global" }, "makeVisible": false, "layerID": [
			334
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Local" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "hide","_target": [
			{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Global" }, "makeVisible": false, "layerID": [
			3
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "gaussianBlur","radius": { "_unit": "pixelsUnit",
		"_value": 15.3 }, "_options": { "dialogOptions": "display" } }], {  });
		await action.batchPlay([{ "_obj": "show","_target": [
			{ "_ref": "layer", "_name": "Local" }
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Local" }, "makeVisible": false, "layerID": [
			4
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		
		
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {
		         "_ref": [
		            {
		               "_ref": "channel",
		               "_enum": "channel",
		               "_value": "RGB"
		            },
		            {
		               "_ref": "layer",
		               "_name": "Global"
		            }
		         ]
		      }, "invert": true, "calculation": { "_enum": "calculationType", "_value": "add" }, "scale": 2, "offset": 0 }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "linearLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Global" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
			6,
			7
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 8, "layerSectionEnd": 9, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "JM Frequency Separation" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
			
		break;
		case "Jm Frequency Sep": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Begin" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Global" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Begin" }, "makeVisible": false, "layerID": [
			7
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			7
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Global" }, "makeVisible": false, "layerID": [
			14
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Local" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "hide","_target": [
			{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Global" }, "makeVisible": false, "layerID": [
			3
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "gaussianBlur","radius": { "_unit": "pixelsUnit",
		"_value": 15.3 }, "_options": { "dialogOptions": "display" } }], {  });
		await action.batchPlay([{ "_obj": "show","_target": [
			{ "_ref": "layer", "_name": "Local" }
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Local" }, "makeVisible": false, "layerID": [
			4
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {
		         "_ref": [
		            {
		               "_ref": "channel",
		               "_enum": "channel",
		               "_value": "RGB"
		            },
		            {
		               "_ref": "layer",
		               "_name": "Global"
		            }
		         ]
		      }, "calculation": { "_enum": "calculationType", "_value": "subtract" }, "scale": 2, "offset": 128 }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "linearLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Global" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
			6,
			7
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 8, "layerSectionEnd": 9, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "JM Frequency Separation" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Reveal Sensor Dust": {
		await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "unsharpMask","amount": { "_unit": "percentUnit",
		"_value": 383 }, "radius": { "_unit": "pixelsUnit",
		"_value": 6 }, "threshold": 0, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "multiply" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "blackAndWhite" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "red": 40, "yellow": 60, "$Grn ": 40, "cyan": 60, "blue": 20, "magenta": 80, "useTint": false, "tintColor": { "_obj": "RGBColor" ,"red": 225.000457763672, "$Grn ": 211.000671386719, "blue": 179.001159667969 } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeLayersNew", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeLayersNew", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "hueSatAdjustmentV2" ,"hue": 0, "saturation": -100, "lightness": 0 }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeLayersNew", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "levelsAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "input": [
			0,
			229
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeLayersNew", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "unsharpMask","amount": { "_unit": "percentUnit",
		"_value": 78 }, "radius": { "_unit": "pixelsUnit",
		"_value": 17.9 }, "threshold": 0, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Reveal Sensor Dust" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Enahnce Details": {
		await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "temp" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
		"_value": 1 } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "invert", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "vividLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "surfaceBlur","radius": { "_unit": "pixelsUnit",
		"_value": 34 }, "threshold": 36, "_options": { "dialogOptions": "display" } }], {  });
		await action.batchPlay([{ "_obj": "mergeLayersNew", "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Detail Enhancer" }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "overlay" } }, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "temp" }, "makeVisible": false, "layerID": [
			148
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			148
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Detail Enhancer" }, "makeVisible": false, "layerID": [
			149
		], "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "sRGB": {
		await action.batchPlay([{ "_obj": "convertToProfile","_target": { "_ref": "document", "_enum": "ordinal", "_value": "targetEnum" }, "to": "sRGB IEC61966-2.1", "intent": { "_enum": "intent", "_value": "colorimetric" }, "mapBlack": true, "dither": true, "flatten": false, "rasterizePlaced": false, "shadowMode": -1, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "Adobe": {
		await action.batchPlay([{ "_obj": "convertToProfile","_target": { "_ref": "document", "_enum": "ordinal", "_value": "targetEnum" }, "to": "Adobe RGB (1998)", "intent": { "_enum": "intent", "_value": "colorimetric" }, "mapBlack": true, "dither": true, "flatten": false, "rasterizePlaced": false, "shadowMode": -1, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "ProPhoto": {
		await action.batchPlay([{ "_obj": "convertToProfile","_target": { "_ref": "document", "_enum": "ordinal", "_value": "targetEnum" }, "to": "ProPhoto RGB", "intent": { "_enum": "intent", "_value": "colorimetric" }, "mapBlack": true, "dither": true, "flatten": false, "rasterizePlaced": false, "shadowMode": -1, "_options": { "dialogOptions": "dontDisplay" } }], {  });
		};
		break;
		case "save_psd": {
			//const _title = app.activeDocument.title.replace(/\..+$/g,"");
			//let entry = await require('uxp').storage.localFileSystem.getFileForSaving(_title+".psd");
			action.batchPlay([{ "_obj": "save","copy": true, "as": { "_obj": "photoshop35Format" }, "_options": { "dialogOptions": "display" } }], { "synchronousExecution": true })
		};
		break;
		case "save_psb": {
		//	const _title = app.activeDocument.title.replace(/\..+$/g,"");
		//	let entry = await require('uxp').storage.localFileSystem.getFileForSaving(_title+".psb");
			//app.activeDocument.saveAs.psb(entry);
			action.batchPlay([{ "_obj": "save","copy": true, "as": { "_obj": "largeDocumentFormat" }, "_options": { "dialogOptions": "display" } }], { "synchronousExecution": true })
		};
		break;
		case "save_jpg": {
			
			//var myValue = await dialogs.promptSlider("JPEG Quality", "", "");
		
		
		//	if(myValue.which!=1) return;
			//myValue = parseInt(Math.ceil(myValue.value/100*12));
			
			//const _title = app.activeDocument.title.replace(/\..+$/g,"");
		//	let entry = await require('uxp').storage.localFileSystem.getFileForSaving(_title+".jpg");
			//await action.batchPlay([{ "_obj": "save","as": { "_obj": "JPEG", "extendedQuality": myValue, "matteColor": { "_enum": "matteColor", "_value": "none" } }, "in": { "_path": entry, "_kind":"local"}, "copy": true, "_options": { "dialogOptions": "display", modalBehavior:"wait" } }])
			action.batchPlay([{ "_obj": "save","copy": true, "as": { "_obj": "JPEG" },"_options": { "dialogOptions": "display" } }], { "synchronousExecution": true })
			
		
		};
		break;
		case "save_tiff": {
			//const _title = app.activeDocument.title.replace(/\..+$/g,"");
			//let entry = await require('uxp').storage.localFileSystem.getFileForSaving(_title+".tif");
			//app.activeDocument.save(entry);
			
			action.batchPlay([{ "_obj": "save","copy": true, "as": { "_obj": "TIFF" }, "_options": { "dialogOptions": "display" } }], { "synchronousExecution": true })
		};
		break;
		
    
			//action.batchPlay([], {});

	}

}

async function runScriptAsync_db(func, arg) {


	switch (func) {
    case "Dodge":
        action.batchPlay([{
                "_obj": "select",
                "_target": {
                    "_ref": "dodgeTool"
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            }
        ], {});
        break;
    case "Burn":
        action.batchPlay([{
                "_obj": "select",
                "_target": {
                    "_ref": "burnInTool"
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            }
        ], {});
        break;
    case "Merge ND":
        action.batchPlay([{
                    "_obj": "mergeVisible",
                    "duplicate": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                }
        ], {});
        break;
	case "Orton Effect":
        action.batchPlay([
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "adjustmentLayer"
      })
    ],
    using: {
      _obj: "adjustmentLayer",
      type: {
        _obj: "levels",
        presetKind: {
          _enum: "presetKindType",
          _value: "presetKindDefault"
        }
      }
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "temp"
    }
  }),
  {
                      "_obj": "mergeVisible",
                      "duplicate": true,
                      "_options": {
                          "dialogOptions": "silent"
                      }
  },
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "Orton Effect"
    }
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "temp"
      })
    ],
    selectionModifier: {
      _enum: "selectionModifierType",
      _value: "addToSelection"
    },
    makeVisible: false
  }),
  ({
    _obj: "mergeLayersNew"
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      opacity: {
        _unit: "percentUnit",
        _value: 30
      }
    }
  }),
  ({
    _obj: "gaussianBlur",
    radius: {
      _unit: "pixelsUnit",
      _value: 47.2
    },
    "_options": {
        "dialogOptions": "display"
    }
  }),
  ({
    _obj: "levels",
    presetKind: {
      _enum: "presetKindType",
      _value: "presetKindCustom"
    },
    "_options": {
        "dialogOptions": "display"
    },
    adjustment: [
      ({
        _obj: "levelsAdjustment",
        channel: {
          _ref: "channel",
          _enum: "channel",
          _value: "composite"
        },
        input: [
          8,
          227
		]
		      })
		    ]
		  })
		], {});
        break;
		

		case "Dodge Highlights": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 8, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Highlights" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		
	
		
		await action.batchPlay([{
   "_obj": "applyImageEvent",
   "with": {
      "_obj": "calculation",
      "to": {
         "_ref": [
            {
               "_ref": "channel",
               "_enum": "channel",
               "_value": "RGB"
            },
            {
               "_ref": "layer",
               "_enum": "ordinal",
               "_value": "merged"
            }
         ]
      },
      "calculation": {
         "_enum": "calculationType",
         "_value": "multiply"
      },
      "preserveTransparency": true
   },
   "_isCommand": true
}], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "makeVisible": true, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "levels","presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "_options": { "dialogOptions": "display" } }], { });
		
		
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{
   "_obj": "reset",
   "_target": [
      {
         "_ref": "color",
         "_property": "colors"
      }
   ],
   "_isCommand": true
}], { });
		await action.batchPlay([{
   "_obj": "exchange",
   "_target": [
      {
         "_ref": "color",
         "_property": "colors"
      }
   ],
   "_isCommand": true
}], { });
		};
		break;
		case "Midtones DB": {
			
			action.batchPlay(
			[({_obj:"make", _target:[({_ref:"adjustmentLayer"})], using:{_obj:"adjustmentLayer", type:{_obj:"levels", presetKind:{_enum:"presetKindType", _value:"presetKindDefault"}}}}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Bright temp"}}), ({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Dark temp"}}), ({_obj:"copyToLayer"}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Mdtone"}}), ({_obj:"select", _target:[({_ref:"layer", _name:"Bright temp"})], makeVisible:false}), ({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, preserveTransparency:true}}), ({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}}), ({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}}), ({_obj:"select", _target:[({_ref:"layer", _name:"Dark temp"})], makeVisible:false}), ({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, invert:true, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}}), ({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, invert:true, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}}), ({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, invert:true, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}}), ({_obj:"select", _target:[({_ref:"layer", _name:"Mdtone"})], makeVisible:false}), ({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})]}), ({_obj:"set", _target:[({_ref:"channel", _property:"selection"})], to:{_enum:"ordinal", _value:"allEnum"}}), ({_obj:"subtract", _target:[({_ref:"channel", _enum:"channel", _value:"mask"}), ({_ref:"layer", _name:"Bright temp"})], from:{_ref:"channel", _property:"selection"}}), ({_obj:"subtract", _target:[({_ref:"channel", _enum:"ordinal", _value:"targetEnum"})], from:{_ref:"channel", _property:"selection"}}), ({_obj:"make", _target:[({_ref:"layer"})]}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Midtones DB"}}), ({_obj:"make", new:{_class:"channel"}, at:{_ref:"channel", _enum:"channel", _value:"mask"}, using:{_enum:"userMaskEnabled", _value:"revealSelection"}}), 
		{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, 
				"makeVisible": true, "_options": { "dialogOptions": "dontDisplay" } },
				{ "_obj": "select","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "makeVisible": true, "_options": { "dialogOptions": "dontDisplay" } },
				 ({_obj:"levels", presetKind:{_enum:"presetKindType", _value:"presetKindDefault"}, "_options": { "dialogOptions": "display" }}), 
				({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", mode:{_enum:"blendMode", _value:"softLight"}}}), ({_obj:"select", _target:[({_ref:"layer", _name:"Dark temp"})], makeVisible:false}), ({_obj:"select", _target:[({_ref:"layer", _name:"Bright temp"})], selectionModifier:{_enum:"selectionModifierType", _value:"addToSelection"}, makeVisible:false}), ({_obj:"delete", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})]}), ({_obj:"select", _target:[({_ref:"layer", _name:"Midtones DB"})], makeVisible:false})], {});
			}
		break;
		case "Burn Shadows": {
			
			 action.batchPlay([({_obj:"make", _target:[({_ref:"layer"})]}), ({_obj:"make", new:{_class:"channel"}, at:{_ref:"channel", _enum:"channel", _value:"mask"}, using:{_enum:"userMaskEnabled", _value:"revealAll"}}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", name:"Shadows"}}), ({_obj:"set", _target:[({_ref:"layer", _enum:"ordinal", _value:"targetEnum"})], to:{_obj:"layer", mode:{_enum:"blendMode", _value:"overlay"}}}), ({_obj:"applyImageEvent", with:{_obj:"calculation", to:{_ref:[({_ref:"channel", _enum:"channel", _value:"RGB"}), ({_ref:"layer", _enum:"ordinal", _value:"merged"})]}, invert:true, calculation:{_enum:"calculationType", _value:"multiply"}, preserveTransparency:true}}), 
		{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, 
				"makeVisible": true, "_options": { "dialogOptions": "dontDisplay" } },
			{ "_obj": "select","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "makeVisible": true, "_options": { "dialogOptions": "dontDisplay" } },
			({_obj:"levels", presetKind:{_enum:"presetKindType", _value:"presetKindDefault"},"_options": { "dialogOptions": "display" }}),
			{
			   "_obj": "select",
			   "_target": [
			      {
			         "_ref": "channel",
			         "_enum": "channel",
			         "_value": "RGB"
			      }
			   ],
			   "makeVisible": false
			},
			 ({_obj:"reset", _target:[({_ref:"color", _property:"colors"})]})], {});
			
			
		};
		break;
		
		case "50 grey": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "gray" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "hide","_target": [
			{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "show","_target": [
			{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "D&B" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Curves": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 0, "vertical": 0 },
			{ "_obj": "paint" ,"horizontal": 54, "vertical": 32 },
			{ "_obj": "paint" ,"horizontal": 211, "vertical": 229 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Curves DB" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "invert", "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "paintbrushTool" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		
		await action.batchPlay([{ "_obj": "set","_target": [
		      {
		         "_ref": "color",
		         "_property": "foregroundColor"
		      }
		   ], "to": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
		"_value": 0 }, "saturation": 0, "brightness": 100 }, "source": "photoshopPicker", "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;

		case "Sponge": {
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "saturationTool" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Overlay": {
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "overlay" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Soft Light": {
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Vivid Light": {
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "vividLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Brush": {
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "paintbrushTool" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Small Brush": {
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "paintbrushTool" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "brush", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "brush" ,"masterDiameter": { "_unit": "pixelsUnit",
		"_value": 10 } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Large Brush": {
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "paintbrushTool" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "brush", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "brush" ,"masterDiameter": { "_unit": "pixelsUnit",
		"_value": 2000 } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
    case "increaseBrush250":
        var diff = 250;
        var brushSize = action.batchPlay([{
            "_obj": "get",
            "_target": [{
                    "_property": "currentToolOptions"
                },
                {
                    "_ref": "application",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }
            ]
        }], {
            synchronousExecution: true
        });
        brushSize = brushSize[0].currentToolOptions.brush.diameter._value;

        action.batchPlay([{
            "_obj": "set",
            "_target": {
                "_ref": "brush",
                "_enum": "ordinal",
                "_value": "targetEnum"
            },
            "to": {
                "_obj": "brush",
                "masterDiameter": {
                    "_unit": "pixelsUnit",
                    "_value": brushSize + diff
                }
            },
            "_options": {
                "dialogOptions": "silent"
            }
        }], {});
        break;

    case "decreaseBrush250":
        var diff = -250;
        var brushSize = action.batchPlay([{
            "_obj": "get",
            "_target": [{
                    "_property": "currentToolOptions"
                },
                {
                    "_ref": "application",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }
            ]
        }], {
            synchronousExecution: true
        });

        brushSize = brushSize[0].currentToolOptions.brush.diameter._value;

        action.batchPlay([{
            "_obj": "set",
            "_target": {
                "_ref": "brush",
                "_enum": "ordinal",
                "_value": "targetEnum"
            },
            "to": {
                "_obj": "brush",
                "masterDiameter": {
                    "_unit": "pixelsUnit",
                    "_value": brushSize + diff
                }
            },
            "_options": {
                "dialogOptions": "silent"
            }
        }], {});
        break;
	
		break;
		
    case "White Brush":
        action.batchPlay([{
                "_obj": "select",
                "_target": {
                    "_ref": "paintbrushTool"
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            },
            {
				
				   "_obj": "set",
				   "_target": [
				      {
				         "_ref": "color",
				         "_property": "foregroundColor"
				      }
				   ],
				   "to": {
				      "_obj": "labColor",
				      "luminance": 100,
				      "a": 0,
				      "b": 0
				   },
				   "source": "photoshopPicker",
				  
                "_options": {
                    "dialogOptions": "silent"
                }
            }
        ], {});
        break;

    case "Black Brush":
        action.batchPlay([{
                "_obj": "select",
                "_target": {
                    "_ref": "paintbrushTool"
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            },
            {
				
				   "_obj": "set",
				   "_target": [
				      {
				         "_ref": "color",
				         "_property": "foregroundColor"
				      }
				   ],
				   "to": {
				      "_obj": "labColor",
				      "luminance": 0,
				      "a": 0,
				      "b": 0
				   },
				   "source": "photoshopPicker",
				  
                "_options": {
                    "dialogOptions": "silent"
                }
            }
        ], {});
        break;
		
		
		case "Pink Brush": {
		await action.batchPlay([{
                "_obj": "select",
                "_target": {
                    "_ref": "paintbrushTool"
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            },
			{ "_obj": "set","_target": [
				      {
				         "_ref": "color",
				         "_property": "foregroundColor"
				      }
				   ], "to": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
		"_value": 310.58349609375 }, "saturation": 60.7843137254902, "brightness": 100 }, "source": "photoshopPicker", "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Orange Brush": {
		await action.batchPlay([{
                "_obj": "select",
                "_target": {
                    "_ref": "paintbrushTool"
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            },{ "_obj": "set","_target": [
				      {
				         "_ref": "color",
				         "_property": "foregroundColor"
				      }
				   ], "to": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
		"_value": 21.1761474609375 }, "saturation": 76.4705882352941, "brightness": 100 }, "source": "photoshopPicker", "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Beige Brush": {
		await action.batchPlay([{
                "_obj": "select",
                "_target": {
                    "_ref": "paintbrushTool"
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            },{ "_obj": "set","_target": [
				      {
				         "_ref": "color",
				         "_property": "foregroundColor"
				      }
				   ], "to": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
		"_value": 35.2935791015625 }, "saturation": 48.2352941176471, "brightness": 99.6078431372549 }, "source": "photoshopPicker", "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "eye dropper manual": {
		    var _obj = {
		   "_obj": "select",
		   "_target": [
		      {
		         "_ref": "channel",
		         "_enum": "channel",
		         "_value": "RGB"
		      }
		   ],
		   "makeVisible": false
		};

		action.batchPlay([_obj,{
                "_obj": "select",
                "_target": {
                    "_ref": "eyedropperTool"
                },
                "_options": {
                    "dialogOptions": "silent"
                }
            }], {});
		};
		break;
		case "Detail Shadows": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "temp" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Detail Shadows" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "temp" }, "makeVisible": false, "layerID": [
			67
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			67
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Detail Shadows" }, "makeVisible": false, "layerID": [
			68
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "blackAndWhite","presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "red": 40, "yellow": 60, "$Grn ": 40, "cyan": 60, "blue": 20, "magenta": 80, "useTint": false, "tintColor": { "_obj": "RGBColor" ,"red": 225.000457763672, "$Grn ": 211.000671386719, "blue": 179.001159667969 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "vividLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "overlay" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "highPass","radius": { "_unit": "pixelsUnit",
		"_value": 118.7 }, "_options": { "dialogOptions": "display" } }], { });
		await action.batchPlay([{ "_obj": "hide","_target": [
			{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "show","_target": [
			{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "makeVisible": true, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "makeVisible": true, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "levels","presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "_options": { "dialogOptions": "display" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Detail Shadows Done" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Detail Highlights": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "temp" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Detail Shadows" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "temp" }, "makeVisible": false, "layerID": [
			67
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			67
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Detail Shadows" }, "makeVisible": false, "layerID": [
			68
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "blackAndWhite","presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "red": 40, "yellow": 60, "$Grn ": 40, "cyan": 60, "blue": 20, "magenta": 80, "useTint": false, "tintColor": { "_obj": "RGBColor" ,"red": 225.000457763672, "$Grn ": 211.000671386719, "blue": 179.001159667969 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "vividLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "overlay" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "highPass","radius": { "_unit": "pixelsUnit",
		"_value": 118.7 }, "_options": { "dialogOptions": "display" } }], { });
		await action.batchPlay([{ "_obj": "hide","_target": [
			{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "show","_target": [
			{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "makeVisible": true, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "makeVisible": true, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "levels","presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "_options": { "dialogOptions": "display" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Detail Shadows" }, "makeVisible": false, "layerID": [
			76
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Detail Highlights" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Detail Highlights Done" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Glow Free": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 18, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "screen" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
		"_value": 30 } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Glow Free" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "paintbrushTool" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Contrast Zones": {
		await action.batchPlay([
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "adjustmentLayer"
      })
    ],
    using: {
      _obj: "adjustmentLayer",
      type: {
        _obj: "levels",
        presetKind: {
          _enum: "presetKindType",
          _value: "presetKindDefault"
        }
      }
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "temp"
    }
  }),
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "adjustmentLayer"
      })
    ],
    using: {
      _obj: "adjustmentLayer",
      type: {
        _obj: "curves",
        presetKind: {
          _enum: "presetKindType",
          _value: "presetKindDefault"
        }
      }
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "Highlights 1"
    }
  }),
  ({
    _obj: "applyImageEvent",
    with: {
      _obj: "calculation",
      to: {
        _ref: [
          ({
            _ref: "channel",
            _enum: "channel",
            _value: "RGB"
          }),
          ({
            _ref: "layer",
            _enum: "ordinal",
            _value: "merged"
          })
        ]
      },
      calculation: {
        _enum: "calculationType",
        _value: "multiply"
      },
      preserveTransparency: true
    }
  }),
  ({
    _obj: "copyToLayer"
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "Highlights 2"
    }
  }),
  ({
    _obj: "applyImageEvent",
    with: {
      _obj: "calculation",
      to: {
        _ref: [
          ({
            _ref: "channel",
            _enum: "channel",
            _value: "RGB"
          }),
          ({
            _ref: "layer",
            _enum: "ordinal",
            _value: "merged"
          })
        ]
      },
      calculation: {
        _enum: "calculationType",
        _value: "multiply"
      },
      preserveTransparency: true
    }
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "temp"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "delete",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ]
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "Highlights 2"
      })
    ],
    makeVisible: false
  }),
  ({ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "Shad temp"
    }
  }),
  ({
    _obj: "invert"
  }),
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "adjustmentLayer"
      })
    ],
    using: {
      _obj: "adjustmentLayer",
      type: {
        _obj: "blackAndWhite",
        presetKind: {
          _enum: "presetKindType",
          _value: "presetKindDefault"
        },
        red: 40,
        yellow: 60,
        grain: 40,
        cyan: 60,
        blue: 20,
        magenta: 80,
        useTint: false,
        tintColor: {
          _obj: "RGBColor",
          red: 225.000457763672,
          grain: 211.000671386719,
          blue: 179.001159667969
        }
      }
    }
  }),
  ({ "_obj": "mergeLayersNew", "_options": { "dialogOptions": "dontDisplay" } }),
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "adjustmentLayer"
      })
    ],
    using: {
      _obj: "adjustmentLayer",
      type: {
        _obj: "curves",
        presetKind: {
          _enum: "presetKindType",
          _value: "presetKindDefault"
        }
      }
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "Shadows 1"
    }
  }),
  ({
    _obj: "applyImageEvent",
    with: {
      _obj: "calculation",
      to: {
        _ref: [
          ({
            _ref: "channel",
            _enum: "channel",
            _value: "RGB"
          }),
          ({
            _ref: "layer",
            _enum: "ordinal",
            _value: "merged"
          })
        ]
      },
      calculation: {
        _enum: "calculationType",
        _value: "multiply"
      },
      preserveTransparency: true
    }
  }),
  ({
    _obj: "copyToLayer"
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "Shadows 2"
    }
  }),
  ({
    _obj: "applyImageEvent",
    with: {
      _obj: "calculation",
      to: {
        _ref: [
          ({
            _ref: "channel",
            _enum: "channel",
            _value: "RGB"
          }),
          ({
            _ref: "layer",
            _enum: "ordinal",
            _value: "merged"
          })
        ]
      },
      calculation: {
        _enum: "calculationType",
        _value: "multiply"
      },
      preserveTransparency: true
    }
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "Shad temp"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "delete",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ]
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "Shadows 2"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "Shadows 1"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "channel",
        _property: "selection"
      })
    ],
    to: {
      _enum: "ordinal",
      _value: "allEnum"
    }
  }),
  ({
    _obj: "subtract",
    _target: [
      ({
        _ref: "channel",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    from: {
      _ref: "channel",
      _property: "selection"
    }
  }),
  ({
    _obj: "subtract",
    _target: [
      ({
        _ref: "channel",
        _enum: "channel",
        _value: "mask"
      }),
      ({
        _ref: "layer",
        _name: "Highlights 1"
      })
    ],
    from: {
      _ref: "channel",
      _property: "selection"
    }
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "Shadows 2"
      })
    ],
    makeVisible: false
  }),
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "adjustmentLayer"
      })
    ],
    using: {
      _obj: "adjustmentLayer",
      type: {
        _obj: "curves",
        presetKind: {
          _enum: "presetKindType",
          _value: "presetKindDefault"
        }
      }
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "Midtones 1"
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "channel",
        _property: "selection"
      })
    ],
    to: {
      _enum: "ordinal",
      _value: "allEnum"
    }
  }),
  ({
    _obj: "subtract",
    _target: [
      ({
        _ref: "channel",
        _enum: "channel",
        _value: "mask"
      }),
      ({
        _ref: "layer",
        _name: "Shadows 2"
      })
    ],
    from: {
      _ref: "channel",
      _property: "selection"
    }
  }),
  ({
    _obj: "subtract",
    _target: [
      ({
        _ref: "channel",
        _enum: "channel",
        _value: "mask"
      }),
      ({
        _ref: "layer",
        _name: "Highlights 2"
      })
    ],
    from: {
      _ref: "channel",
      _property: "selection"
    }
  }),
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "adjustmentLayer"
      })
    ],
    using: {
      _obj: "adjustmentLayer",
      type: {
        _obj: "curves",
        presetKind: {
          _enum: "presetKindType",
          _value: "presetKindDefault"
        }
      }
    }
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "Midtones 2"
    }
  }),
  ({
    _obj: "select",
    _target: [
      ({
        _ref: "layer",
        _name: "Highlights 1"
      })
    ],
    selectionModifier: {
      _enum: "selectionModifierType",
      _value: "addToSelectionContinuous"
    },
    makeVisible: false
  }),
  ({
    _obj: "make",
    _target: [
      ({
        _ref: "layerSection"
      })
    ],
    from: {
      _ref: "layer",
      _enum: "ordinal",
      _value: "targetEnum"
    },
    layerSectionStart: 223,
    layerSectionEnd: 224,
    name: "Group 1"
  }),
  ({
    _obj: "set",
    _target: [
      ({
        _ref: "layer",
        _enum: "ordinal",
        _value: "targetEnum"
      })
    ],
    to: {
      _obj: "layer",
      name: "Contrast Zones"
    }
  })
], { });

break;
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "temp" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Highlights 1" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		
		await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Highlights 2" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "temp" }, "makeVisible": false, "layerID": [
			296
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			296
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Highlights 2" }, "makeVisible": false, "layerID": [
			298
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], { });
		
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Shad temp" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "invert", "_options": { "dialogOptions": "dontDisplay" } }], { });
		
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "blackAndWhite" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "red": 40, "yellow": 60, "$Grn ": 40, "cyan": 60, "blue": 20, "magenta": 80, "useTint": false, "tintColor": { "_obj": "RGBColor" ,"red": 225.000457763672, "$Grn ": 211.000671386719, "blue": 179.001159667969 } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "mergeLayersNew", "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Shadows 1" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Shadows 2" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Shad temp" }, "makeVisible": false, "layerID": [
			299
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			299
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Shadows 2" }, "makeVisible": false, "layerID": [
			302
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Shadows 1" }, "makeVisible": false, "layerID": [
			301
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
	
		try{
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": [{ "_property": "selection" }, ]}, "to": { "_enum": "ordinal", "_value": "allEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "subtract","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "from": { "_ref": [{ "_property": "selection" }, ]}, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "subtract","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "from": { "_ref": [{ "_property": "selection" }, ]}, "_options": { "dialogOptions": "dontDisplay" } }], { });
	}catch(e){}
		
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Shadows 2" }, "makeVisible": false, "layerID": [
			313
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Midtones 1" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		
		try{
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": [{ "_property": "selection" }, ]}, "to": { "_enum": "ordinal", "_value": "allEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "subtract","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "from": { "_ref": [{ "_property": "selection" }, ]}, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "subtract","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "from": { "_ref": [{ "_property": "selection" }, ]}, "_options": { "dialogOptions": "dontDisplay" } }], { });
	}catch(e){}
		
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Midtones 2" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Highlights 1" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelectionContinuous" }, "makeVisible": false, "layerID": [
			308,
			309,
			312,
			313,
			316,
			317
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 318, "layerSectionEnd": 319, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Contrast Zones" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "S-Curve": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 0, "vertical": 0 },
			{ "_obj": "paint" ,"horizontal": 60, "vertical": 38 },
			{ "_obj": "paint" ,"horizontal": 173, "vertical": 193 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "S-Curve" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Darken Sky": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 55, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "black" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Darken Sky" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Bright Highlights": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Bright Highlights" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "curves" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "curvesAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "curve": [
			{ "_obj": "paint" ,"horizontal": 0, "vertical": 0 },
			{ "_obj": "paint" ,"horizontal": 215, "vertical": 248 },
			{ "_obj": "paint" ,"horizontal": 255, "vertical": 255 }
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Protect Shadows": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
			{ "_obj": "levelsAdjustment" ,"channel": { "_ref": "channel", "_enum": "channel", "_value": "composite" }, "output": [
			10,
			255
		] }
		] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Protect Shadows" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Brighten Shadows": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 53, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "white" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
		"_value": 20 } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Brighten Shadows" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Fake HDR": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 56, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "black" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Highlights" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 57, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Shadows" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "white" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
		"_value": 20 } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Highlights" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
			56,
			57
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 58, "layerSectionEnd": 59, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Fake HDR" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		
		case "OE Bright": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "temp" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Orton Effect Bright" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "temp" }, "makeVisible": false, "layerID": [
			81
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			81
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Orton Effect Bright" }, "makeVisible": false, "layerID": [
			82
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "screen" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
		"_value": 32 } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "gaussianBlur","radius": { "_unit": "pixelsUnit",
		"_value": 29.1 }, "_options": { "dialogOptions": "display" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Orton Effect Warm": {
		await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "temp1" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
		"_value": 1 } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "orton 1" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "temp1" }, "makeVisible": false, "layerID": [
			4
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			4
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "orton 1" }, "makeVisible": false, "layerID": [
			5
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "temp" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "copyToLayer", "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Orton " }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "screen" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "temp" }, "makeVisible": false, "layerID": [
			22
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			22
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Orton " }, "makeVisible": false, "layerID": [
			23
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "gaussianBlur","radius": { "_unit": "pixelsUnit",
		"_value": 186 }, "_options": { "dialogOptions": "display" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 24, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Warm" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "gray" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 67.06, "a": 32, "b": 120 }, "density": 25, "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "photoFilter" ,"color": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
		"_value": 44.000244140625 }, "saturation": 91.9996948195621, "brightness": 91.9996948195621 }, "density": 72 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "groupEvent","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "mergeLayersNew", "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Orton " }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
			23,
			24
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 26, "layerSectionEnd": 27, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Warm Orton" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "OE Cold": {
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "levels" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "temp" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "mergeVisible","duplicate": true, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Orton Effect Bright" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "temp" }, "makeVisible": false, "layerID": [
			81
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			81
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Orton Effect Bright" }, "makeVisible": false, "layerID": [
			82
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "screen" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
		"_value": 32 } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "gaussianBlur","radius": { "_unit": "pixelsUnit",
		"_value": 29.1 }, "_options": { "dialogOptions": "display" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 99, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Cold" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": [
		      {
		         "_ref": "color",
		         "_property": "foregroundColor"
		      }
		   ], "to": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
		"_value": 234.349365234375 }, "saturation": 60.7843137254902, "brightness": 72.156862745098 }, "source": "photoshopPicker", "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "foregroundColor" }, "opacity": { "_unit": "percentUnit",
		"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "softLight" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"opacity": { "_unit": "percentUnit",
		"_value": 75 } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Orton Effect Bright" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
			98,
			99
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 100, "layerSectionEnd": 101, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Orton Effect Cold" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
	
		case "align": {
	
		};
		break;
		case "stackAll": {
		};
		break;
		case "Delete Layer": {
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerID": [
			3
		], "_options": { "dialogOptions": "dontDisplay" } }], { });
		
		};
		break;
		case "Apply to highlights": {
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Apply to shadows": {
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "make","new": { "_class": "channel" }, "at": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "using": { "_enum": "userMaskEnabled", "_value": "revealAll" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "applyImageEvent","with": { "_obj": "calculation" ,"to": {"_ref":[{"_ref": "channel", "_enum": "channel", "_value": "RGB" },{"_ref": "layer", "_enum": "ordinal", "_value": "merged"}]}, "invert": true, "calculation": { "_enum": "calculationType", "_value": "multiply" }, "preserveTransparency": true }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Adjust": {
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": true, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "levels","presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "_options": { "dialogOptions": "display" } }], { });
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Undo": {
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "historyState", "_enum": "ordinal", "_value": "previous" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		case "Del Layer Mask": {
		await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
		await action.batchPlay([{ "_obj": "delete","_target": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
		};
		break;
		
		
			//action.batchPlay([], {});

	}

}

async function runScriptAsync_cc(func, arg) {


	switch (func) {
		case "Colour Correct 1":
			action.batchPlay(
				[
					({
						_obj: "make",
						_target: [
							({
								_ref: "adjustmentLayer"
							})
						],
						using: {
							_obj: "adjustmentLayer",
							type: {
								_obj: "levels",
								presetKind: {
									_enum: "presetKindType",
									_value: "presetKindDefault"
								}
							}
						}
					}),
					({
						_obj: "set",
						_target: [
							({
								_ref: "layer",
								_enum: "ordinal",
								_value: "targetEnum"
							})
						],
						to: {
							_obj: "layer",
							name: "temp"
						}
					}),
	                {
	                    "_obj": "mergeVisible",
	                    "duplicate": true,
	                    "_options": {
	                        "dialogOptions": "silent"
	                    }
	                },
					({
						_obj: "set",
						_target: [
							({
								_ref: "layer",
								_enum: "ordinal",
								_value: "targetEnum"
							})
						],
						to: {
							_obj: "layer",
							name: "Colour Corrected"
						}
					}),
					({
						_obj: "select",
						_target: [
							({
								_ref: "layer",
								_name: "temp"
							})
						],
						makeVisible: false
					}),
					({
						_obj: "delete",
						_target: [
							({
								_ref: "layer",
								_enum: "ordinal",
								_value: "targetEnum"
							})
						]
					}),
					({
						_obj: "select",
						_target: [
							({
								_ref: "layer",
								_name: "Colour Corrected"
							})
						],
						makeVisible: false
					}),
					({
						_obj: "matchColor",
						lightness: 100,
						colorRange: 100,
						fade: 0,
						neutralizeColor: true,
						selection: true,
						noReference: true
					})
				], {});
			break;
		case "Correct 2":
			action.batchPlay([({
					_obj: "make",
					_target: [
						({
							_ref: "adjustmentLayer"
						})
					],
					using: {
						_obj: "adjustmentLayer",
						type: {
							_obj: "curves",
							presetKind: {
								_enum: "presetKindType",
								_value: "presetKindDefault"
							}
						}
					}
				}),
				({
					_obj: "set",
					_target: [
						({
							_ref: "layer",
							_enum: "ordinal",
							_value: "targetEnum"
						})
					],
					to: {
						_obj: "layer",
						name: "Colour Correct 2"
					}
				}),
				({
					_obj: "set",
					_target: [
						({
							_ref: "adjustmentLayer",
							_enum: "ordinal",
							_value: "targetEnum"
						})
					],
					to: {
						_obj: "curves",
						presetKind: {
							_enum: "presetKindType",
							_value: "presetKindCustom"
						},
						adjustment: [
							({
								_obj: "curvesAdjustment",
								channel: {
									_ref: "channel",
									_enum: "channel",
									_value: "composite"
								},
								autoBlackWhite: true,
								autoNeutrals: true
							}),
							({
								_obj: "curvesAdjustment",
								channel: {
									_ref: "channel",
									_enum: "channel",
									_value: "red"
								},
								curve: [
									({
										_obj: "paint",
										horizontal: 0,
										vertical: 0
									}),
									({
										_obj: "paint",
										horizontal: 252,
										vertical: 255
									})
								]
							}),
							({
								_obj: "curvesAdjustment",
								channel: {
									_ref: "channel",
									_enum: "channel",
									_value: "grain"
								},
								curve: [
									({
										_obj: "paint",
										horizontal: 20,
										vertical: 0
									}),
									({
										_obj: "paint",
										horizontal: 255,
										vertical: 252
									})
								]
							}),
							({
								_obj: "curvesAdjustment",
								channel: {
									_ref: "channel",
									_enum: "channel",
									_value: "blue"
								},
								curve: [
									({
										_obj: "paint",
										horizontal: 5,
										vertical: 0
									}),
									({
										_obj: "paint",
										horizontal: 255,
										vertical: 248
									})
								]
							})
						]
					}
				})
			], {})
			break;
		case "Correct 3":
			action.batchPlay([({
					_obj: "make",
					_target: [
						({
							_ref: "adjustmentLayer"
						})
					],
					using: {
						_obj: "adjustmentLayer",
						type: {
							_obj: "levels",
							presetKind: {
								_enum: "presetKindType",
								_value: "presetKindDefault"
							}
						}
					}
				}),
				({
					_obj: "set",
					_target: [
						({
							_ref: "layer",
							_enum: "ordinal",
							_value: "targetEnum"
						})
					],
					to: {
						_obj: "layer",
						name: "temp"
					}
				}),
                {
                    "_obj": "mergeVisible",
                    "duplicate": true,
                    "_options": {
                        "dialogOptions": "silent"
                    }
                },
				({
					_obj: "set",
					_target: [
						({
							_ref: "layer",
							_enum: "ordinal",
							_value: "targetEnum"
						})
					],
					to: {
						_obj: "layer",
						name: "Colour Correct 3"
					}
				}),
				({
					_obj: "select",
					_target: [
						({
							_ref: "layer",
							_name: "temp"
						})
					],
					makeVisible: false
				}),
				({
					_obj: "delete",
					_target: [
						({
							_ref: "layer",
							_enum: "ordinal",
							_value: "targetEnum"
						})
					]
				}),
				({
					_obj: "select",
					_target: [
						({
							_ref: "layer",
							_name: "Colour Correct 3"
						})
					],
					makeVisible: false
				}),
				({
					_obj: "levels",
					autoBlackWhite: true,
					autoNeutrals: true
				})
			], {});
			break;
		case "Warm Highlights":
			action.batchPlay([({
					_obj: "make",
					_target: [
						({
							_ref: "adjustmentLayer"
						})
					],
					using: {
						_obj: "adjustmentLayer",
						type: {
							_obj: "photoFilter",
							color: {
								_obj: "labColor",
								luminance: 67.06,
								a: 32,
								b: 120
							},
							density: 25,
							preserveLuminosity: true
						}
					}
				}),
				({
					_obj: "set",
					_target: [
						({
							_ref: "layer",
							_enum: "ordinal",
							_value: "targetEnum"
						})
					],
					to: {
						_obj: "layer",
						name: "Warm Highlights"
					}
				}),
				({
					_obj: "set",
					_target: [
						({
							_ref: "adjustmentLayer",
							_enum: "ordinal",
							_value: "targetEnum"
						})
					],
					to: {
						_obj: "photoFilter",
						color: {
							_obj: "labColor",
							luminance: 67,
							a: 32,
							b: 120
						},
						density: 51
					}
				}),
				({
					_obj: "applyImageEvent",
					 "with": {
						_obj: "calculation",
						to: {
							_ref: [
								({
									_ref: "channel",
									_enum: "channel",
									_value: "RGB"
								}),
								({
									_ref: "layer",
									_enum: "ordinal",
									_value: "merged"
								})
							]
						},
						calculation: {
							_enum: "calculationType",
							_value: "multiply"
						},
						preserveTransparency: true
					}
				}),
				({
					_obj: "applyImageEvent",
					 "with": {
						_obj: "calculation",
						to: {
							_ref: [
								({
									_ref: "channel",
									_enum: "channel",
									_value: "RGB"
								}),
								({
									_ref: "layer",
									_enum: "ordinal",
									_value: "merged"
								})
							]
						},
						calculation: {
							_enum: "calculationType",
							_value: "multiply"
						},
						preserveTransparency: true
					}
				}),
				({
					_obj: "applyImageEvent",
					 "with": {
						_obj: "calculation",
						to: {
							_ref: [
								({
									_ref: "channel",
									_enum: "channel",
									_value: "RGB"
								}),
								({
									_ref: "layer",
									_enum: "ordinal",
									_value: "merged"
								})
							]
						},
						calculation: {
							_enum: "calculationType",
							_value: "multiply"
						},
						preserveTransparency: true
					}
				})
			], {});
			break;
			
			case "Colour Brightness Tool": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "blackAndWhite" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "red": 40, "yellow": 60, "$Grn ": 40, "cyan": 60, "blue": 20, "magenta": 80, "useTint": false, "tintColor": { "_obj": "RGBColor" ,"red": 225.000457763672, "$Grn ": 211.000671386719, "blue": 179.001159667969 } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "luminosity" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "blackAndWhite" ,"red": 30, "yellow": 89, "$Grn ": 59, "cyan": 70, "blue": 11, "magenta": 41 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Colour Adjust" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Black White": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "blackAndWhite" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "red": 40, "yellow": 60, "$Grn ": 40, "cyan": 60, "blue": 20, "magenta": 80, "useTint": false, "tintColor": { "_obj": "RGBColor" ,"red": 225.000457763672, "$Grn ": 211.000671386719, "blue": 179.001159667969 } } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Manual Correct": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layer" }, "layerID": 36, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "fill","using": { "_enum": "fillContents", "_value": "gray" }, "opacity": { "_unit": "percentUnit",
			"_value": 100 }, "mode": { "_enum": "blendMode", "_value": "normal" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"mode": { "_enum": "blendMode", "_value": "difference" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "thresholdClassEvent" ,"level": 128 } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "thresholdClassEvent" ,"level": 10 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Cold": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 67.06, "a": 32, "b": 120 }, "density": 25, "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Cold" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 61, "a": -59, "b": -119 }, "density": 10 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Colder": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 67.06, "a": 32, "b": 120 }, "density": 25, "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Colder" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 61, "a": -59, "b": -119 }, "density": 20 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Coldest": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 67.06, "a": 32, "b": 120 }, "density": 25, "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Coldest" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 61, "a": -59, "b": -119 }, "density": 35 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Warm": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 67.06, "a": 32, "b": 120 }, "density": 25, "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "photoFilter" ,"color": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
			"_value": 44.000244140625 }, "saturation": 91.9996948195621, "brightness": 91.9996948195621 } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Warm" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Warmer": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 67.06, "a": 32, "b": 120 }, "density": 25, "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "photoFilter" ,"color": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
			"_value": 44.000244140625 }, "saturation": 91.9996948195621, "brightness": 91.9996948195621 }, "density": 45 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Warmer" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Warmest": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 67.06, "a": 32, "b": 120 }, "density": 25, "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Warmest" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "photoFilter" ,"color": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
			"_value": 44.000244140625 }, "saturation": 91.9996948195621, "brightness": 91.9996948195621 }, "density": 65 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Vivid Colours": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"hue": 0, "saturation": 15, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Colours" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_class": "vibrance" } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "vibrance" ,"vibrance": 15 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "groupEvent","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Colours" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "layer", "_name": "Colours" }, "selectionModifier": { "_enum": "selectionModifierType", "_value": "addToSelection" }, "makeVisible": false, "layerID": [
				62,
				63
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "layerSection" }, "from": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "layerSectionStart": 64, "layerSectionEnd": 65, "name": "Group 1", "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Vivid Colours" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Vivid Greens": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"localRange": 3, "beginRamp": 75, "beginSustain": 105, "endSustain": 135, "endRamp": 165, "hue": 0, "saturation": 50, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Vivid Greens" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Vivid Cyans": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"localRange": 4, "beginRamp": 135, "beginSustain": 165, "endSustain": 195, "endRamp": 225, "hue": 0, "saturation": 50, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Vivid Cyans" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Vivid Reds": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"localRange": 1, "beginRamp": 315, "beginSustain": 345, "endSustain": 15, "endRamp": 45, "hue": 0, "saturation": 50, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Vivid Reds" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Vivid Yellows": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"localRange": 2, "beginRamp": 15, "beginSustain": 45, "endSustain": 75, "endRamp": 105, "hue": 0, "saturation": 50, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Vivid Yellows" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Vivid Mag": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"localRange": 6, "beginRamp": 255, "beginSustain": 285, "endSustain": 315, "endRamp": 345, "hue": 0, "saturation": 50, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Vivid Magentas" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Vivid Blues": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"localRange": 5, "beginRamp": 195, "beginSustain": 225, "endSustain": 255, "endRamp": 285, "hue": 0, "saturation": 40, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Vivid Blues" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Less Colour": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"hue": 0, "saturation": -40, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Less Colour" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Less Green": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"localRange": 2, "beginRamp": 15, "beginSustain": 45, "endSustain": 75, "endRamp": 105, "hue": 0, "saturation": 0, "lightness": 0 },
				{ "_obj": "hueSatAdjustmentV2" ,"localRange": 3, "beginRamp": 75, "beginSustain": 105, "endSustain": 135, "endRamp": 165, "hue": 0, "saturation": -40, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Less Green" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Less Cyan": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"localRange": 4, "beginRamp": 135, "beginSustain": 165, "endSustain": 195, "endRamp": 225, "hue": 0, "saturation": -40, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Less Cyan" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Less Red": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"localRange": 1, "beginRamp": 315, "beginSustain": 345, "endSustain": 15, "endRamp": 45, "hue": 0, "saturation": -40, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Less Red" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Less Yellow": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"localRange": 2, "beginRamp": 15, "beginSustain": 45, "endSustain": 75, "endRamp": 105, "hue": 0, "saturation": -40, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Less Yellow" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Less Magenta": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"localRange": 6, "beginRamp": 255, "beginSustain": 285, "endSustain": 315, "endRamp": 345, "hue": 0, "saturation": -40, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Less Magenta" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			case "Desat Blues(1)": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindDefault" }, "colorize": false } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Less Blue" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "hueSaturation" ,"presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "hueSatAdjustmentV2" ,"localRange": 5, "beginRamp": 195, "beginSustain": 225, "endSustain": 255, "endRamp": 285, "hue": 0, "saturation": -40, "lightness": 0 }
			] }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			
			case "Shadows": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 67.06, "a": 32, "b": 120 }, "density": 25, "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Cold Shadows" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "photoFilter" ,"color": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
			"_value": 232.937622070312 }, "saturation": 87.4509803921569, "brightness": 91.7647058823529 }, "density": 51 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			
			await action.batchPlay([{
   "_obj": "applyImageEvent",
   "with": {
      "_obj": "calculation",
      "to": {
         "_ref": [
            {
               "_ref": "channel",
               "_enum": "channel",
               "_value": "RGB"
            },
            {
               "_ref": "layer",
               "_enum": "ordinal",
               "_value": "merged"
            }
         ]
      },
      "invert": true,
      "calculation": {
         "_enum": "calculationType",
         "_value": "multiply"
      },
      "preserveTransparency": true
   },
   "_isCommand": true
}], { });
			
			await action.batchPlay([{ "_obj": "levels","presetKind": { "_enum": "presetKindType", "_value": "presetKindCustom" }, "adjustment": [
				{ "_obj": "levelsAdjustment" ,"channel": { "_ref": "channel", "_enum": "ordinal", "_value": "targetEnum" }, "input": [
				39,
				246
			] }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			
			case "Highlights": {
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 67.06, "a": 32, "b": 120 }, "density": 25, "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "photoFilter" ,"color": { "_obj": "HSBColorClass" ,"hue": { "_unit": "angleUnit",
			"_value": 232.937622070312 }, "saturation": 87.4509803921569, "brightness": 91.7647058823529 }, "density": 39 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			
			await action.batchPlay([{
   "_obj": "applyImageEvent",
   "with": {
      "_obj": "calculation",
      "to": {
         "_ref": [
            {
               "_ref": "channel",
               "_enum": "channel",
               "_value": "RGB"
            },
            {
               "_ref": "layer",
               "_enum": "ordinal",
               "_value": "merged"
            }
         ]
      },
      "calculation": {
         "_enum": "calculationType",
         "_value": "multiply"
      },
      "preserveTransparency": true
   },
   "_isCommand": true
}], { });
			await action.batchPlay([{
   "_obj": "applyImageEvent",
   "with": {
      "_obj": "calculation",
      "to": {
         "_ref": [
            {
               "_ref": "channel",
               "_enum": "channel",
               "_value": "RGB"
            },
            {
               "_ref": "layer",
               "_enum": "ordinal",
               "_value": "merged"
            }
         ]
      },
      "calculation": {
         "_enum": "calculationType",
         "_value": "multiply"
      },
      "preserveTransparency": true
   },
   "_isCommand": true
}], { });

			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Cold Highlights" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "show","_target": [
				{ "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }
			], "_options": { "dialogOptions": "dontDisplay" } }], { });
			};
			break;
			
			case "Warm Shadows": {
				
	
				
				
			await action.batchPlay([{ "_obj": "make","_target": { "_ref": "adjustmentLayer" }, "using": { "_obj": "adjustmentLayer" ,"type": { "_obj": "photoFilter" ,"color": { "_obj": "labColor" ,"luminance": 67.06, "a": 32, "b": 120 }, "density": 25, "preserveLuminosity": true } }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "adjustmentLayer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "photoFilter" ,"density": 49 }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "RGB" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "set","_target": { "_ref": "layer", "_enum": "ordinal", "_value": "targetEnum" }, "to": { "_obj": "layer" ,"name": "Warm Shadows" }, "_options": { "dialogOptions": "dontDisplay" } }], { });
			await action.batchPlay([{ "_obj": "select","_target": { "_ref": "channel", "_enum": "channel", "_value": "mask" }, "makeVisible": false, "_options": { "dialogOptions": "dontDisplay" } }], { });
			
			
			await action.batchPlay([{
   "_obj": "applyImageEvent",
   "with": {
      "_obj": "calculation",
      "to": {
         "_ref": [
            {
               "_ref": "channel",
               "_enum": "channel",
               "_value": "RGB"
            },
            {
               "_ref": "layer",
               "_enum": "ordinal",
               "_value": "merged"
            }
         ]
      },
	  invert:true,
      "calculation": {
         "_enum": "calculationType",
         "_value": "multiply"
      },
      "preserveTransparency": true
   },
   "_isCommand": true
}], { });

			await action.batchPlay([{
   "_obj": "applyImageEvent",
   "with": {
      "_obj": "calculation",
      "to": {
         "_ref": [
            {
               "_ref": "channel",
               "_enum": "channel",
               "_value": "RGB"
            },
            {
               "_ref": "layer",
               "_enum": "ordinal",
               "_value": "merged"
            }
         ]
      },
	  invert:true,
      "calculation": {
         "_enum": "calculationType",
         "_value": "multiply"
      },
      "preserveTransparency": true
   }
}], { });

			await action.batchPlay([{
   "_obj": "applyImageEvent",
   "with": {
      "_obj": "calculation",
      "to": {
         "_ref": [
            {
               "_ref": "channel",
               "_enum": "channel",
               "_value": "RGB"
            },
            {
               "_ref": "layer",
               "_enum": "ordinal",
               "_value": "merged"
            }
         ]
      },
	  invert:true,
      "calculation": {
         "_enum": "calculationType",
         "_value": "multiply"
      },
      "preserveTransparency": true
   }
}], { });
			};
			break;


	}

}