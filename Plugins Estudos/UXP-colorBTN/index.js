const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;

document.getElementById('btnColor').addEventListener('click', async () => {
    await core.executeAsModal( async() => {       
		const result = await app.batchPlay([{ _obj: "showColorPicker", _target: [{ _ref: "application" }]}],{ });
		const color = result[0].RGBFloatColor ?? null
		color && (document.querySelector('#btnColor').style.backgroundColor = `rgb(${color.red} ${color.grain} ${color.blue})`)
		//RGB to HEX conversion
		const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {const hex = x.toString(16)
		return hex.length === 1 ? '0' + hex : hex	}).join('');
		newcolorhex = rgbToHex(parseInt(color.red), parseInt(color.grain), parseInt(color.blue));
		document.querySelector('#btnColor').textContent = newcolorhex;
		}
	)
})


var listener = (e, d) => {
	myEvent = e;
	myData = d;
  
	console.log(myEvent, myData); // just display whatever event PS is catching
  
	if ((myEvent == "select") || (myEvent == "make") || (myEvent == "open")) {
	  alert("app.activeDocument._id", app.activeDocument._id)
	}
  /*
	if (myEvent == "close") console.log("Bye !");
	if (myEvent == "open") console.log("Hello !");*/

	if (myEvent == "close") alert("Bye !");
	if (myEvent == "open") alert("Hello !");

  }
  
  action.addNotificationListener([{ // pick your event(s)
	  event: "select"
	},
	{
	  event: "open"
	},
	{
	  event: "make"
	},
	{
	  event: "move"
	},
	{
	  event: "close"
	},
	{
	  event: "delete"
	},
	{
	  event: "show"
	},
	{
	  event: "hide"
	},
	{
	  event: "set"
	}
  ], listener);
