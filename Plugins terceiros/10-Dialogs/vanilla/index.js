const app = require("photoshop").app;
const action = require("photoshop").action;

const host = require("uxp").host;
const {entrypoints} = require("uxp");

document.getElementById('btn_01').addEventListener('click', async () => {
    await action.batchPlay([{"_obj":"hueSaturation","adjustment":[{"_obj":"hueSatAdjustmentV2","hue":0,"lightness":0,"saturation":-100}],"colorize":false,"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}}], { });
});