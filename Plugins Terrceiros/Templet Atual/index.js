const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;

document.getElementById('btnColor').addEventListener('click', async () => {
    await core.executeAsModal(() => {       
		//app.batchPlay([{ _obj: "showColorPicker", _target: [{ _ref: "application" }]}],{ });
		//document.querySelector('#btnColor').style.backgroundColor = `hsl(${app.foregroundColor.hsb.hue} ${app.foregroundColor.hsb.saturation}% ${app.foregroundColor.hsb.brightness}%)`;
		const result = app.batchPlay([{ _obj: "showColorPicker", _target: [{ _ref: "application" }]}],{ });
		const color = result[0].RGBFloatColor ?? null
		//color && document.querySelector('#btnColor').style.backgroundColor = `rgb(${color.red} ${color.grain} ${color.blue})`
		color && (document.querySelector('#btnColor').style.backgroundColor = `rgb(${color.red} ${color.grain} ${color.blue})`)
		console.log(color.red, color.grain, color.blue);
		}
	)
})



document.getElementById('btnColor2').addEventListener('click', async () => {
    await core.executeAsModal(() => {   
		corHex ="f45929";
        var aRgbHex = corHex.match(/.{1,2}/g);
		app.batchPlay([{"_obj":"set","_target":[{"_property":"foregroundColor","_ref":"color"}],"source":"photoshopPicker","to":{"_obj":"RGBColor","blue":parseInt(aRgbHex[2], 16),"grain":parseInt(aRgbHex[1], 16),"red":parseInt(aRgbHex[0], 16)}}],{ });

})})

























/*

    document.getElementById('Folhagem').addEventListener('click', async () => {
        await core.executeAsModal(() => {       
            app.batchPlay([{"_obj":"make","documentID":632,"new":{"_obj":"document","depth":8,"fill":{"_enum":"fill","_value":"transparency"},"height":{"_unit":"distanceUnit","_value":850.3936922729803},"mode":{"_class":"RGBColorMode"},"pixelScaleFactor":1.0,"profile":"sRGB IEC61966-2.1","resolution":{"_unit":"densityUnit","_value":304.8000030517578},"width":{"_unit":"distanceUnit","_value":850.3936922729803}}}])
            app.batchPlay([{"_obj":"make","_target":[{"_ref":"good"}],"guideTarget":{"_enum":"guideTarget","_value":"guideTargetCanvas"},"new":{"_obj":"good","_target":[{"_id":632,"_ref":"document"},{"_index":1,"_ref":"good"}],"kind":{"_enum":"kind","_value":"document"},"orientation":{"_enum":"orientation","_value":"horizontal"},"position":{"_unit":"distanceUnit","_value":425.19684613649016}}}])
            app.batchPlay([{"_obj":"make","_target":[{"_ref":"good"}],"guideTarget":{"_enum":"guideTarget","_value":"guideTargetCanvas"},"new":{"_obj":"good","_target":[{"_id":632,"_ref":"document"},{"_index":2,"_ref":"good"}],"kind":{"_enum":"kind","_value":"document"},"orientation":{"_enum":"orientation","_value":"vertical"},"position":{"_unit":"distanceUnit","_value":425.19684613649016}}}])
            app.batchPlay([{"_obj":"set","_target":[{"_property":"selection","_ref":"channel"}],"antiAlias":true,"to":{"_obj":"ellipse","bottom":{"_unit":"distanceUnit","_value":773.8582599684121},"left":{"_unit":"distanceUnit","_value":245.1968479387093},"right":{"_unit":"distanceUnit","_value":707.2440874070286},"top":{"_unit":"distanceUnit","_value":311.81102050009278}}}])
            app.batchPlay([{"_obj":"make","_target":[{"_ref":"path"}],"from":{"_property":"selection","_ref":"selectionClass"},"tolerance":{"_unit":"pixelsUnit","_value":2.0}}])
            app.batchPlay([{"_obj":"transform","_target":[{"_enum":"ordinal","_ref":"path","_value":"targetEnum"}],"angle":{"_unit":"angleUnit","_value":55.68386009758416},"freeTransformCenterState":{"_enum":"quadCenterState","_value":"QCSAverage"},"offset":{"_obj":"offset","horizontal":{"_unit":"distanceUnit","_value":0.0},"vertical":{"_unit":"distanceUnit","_value":-5.3710316496068997e-14}}}])
            app.batchPlay([{"_obj":"decoRenderTree","decoScriptFile":{"_kind":"local","_path":"C:\\Program Files\\Adobe\\Adobe Photoshop CC 2015.5\\Presets\\Deco\\Tree.jsx"},"decoScriptParameters":"({mTreeType:13, lightDirection:180, tilt:0, leavesAmount:100, leavesSize:200, leavesHeight:190, trunkWidth:17, defaultLeaves:false, leavesType:9, leavesColor:false, stemsColor:false, flatLeaves:false, noiseLeaves:false, flatStems:false, leavesLock:false, randShape:false, arrange:22.3, stemColor:[0.54117647058824, 0.50196078431373, 0.38823529411765], leafColor:[0.8156862745098, 0.59607843137255, 0.26666666666667]})","mode":{"_enum":"blendMode","_value":"normal"},"opacity":{"_unit":"percentUnit","_value":100.0},"using":{"_enum":"fillContents","_value":"pattern"},"_options": { "dialogOptions": "display" }}])
            app.batchPlay([])
            app.batchPlay([])
            app.batchPlay([])
            app.batchPlay([])
            app.batchPlay([])
            app.batchPlay([])
            app.batchPlay([])
        })
})





const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')
console.log(rgbToHex(255, 5, 255)); // #FF05FF
*/