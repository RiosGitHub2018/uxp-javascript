var destino = Folder(decodeURI(app.activeDocument.path)); 
if((fldr = Folder(destino)) &&(lngth = (fls = fldr.getFiles()).length)) {
str = ''; re = /.*(\(\d+\)|\d+)(?=\.)/; while(fls.length)
(fle = fls.shift()).rename((nme = decodeURI(fle.name))
.replace(re, function(v) {return 'PG_'+ ('00' + v.split(/\D/).join('')).slice(-3)})),
str += " ✔  "+ decodeURI(fle.name) + ' ➔  '+ "[ "+nme+" ]" + '\n'; 
} 
