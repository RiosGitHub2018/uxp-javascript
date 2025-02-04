var aRgbHex = '0096ff'.match(/.{1,2}/g);
var aRgb = [  parseInt(aRgbHex[0], 16),   parseInt(aRgbHex[1], 16),  parseInt(aRgbHex[2], 16) ];
alert(aRgb );