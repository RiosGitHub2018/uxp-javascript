var string = "Z:/MATRIZ/17.05.2023/Iranildes";
var array = string.split("/");
var dir = array[1];
console.log(dir); // MATRIZ


var string = "Z:/MATRIZ/17.05.2023/SHOP/Natalia Fonseca";
var regex = /(\d{2}\.\d{2}\.\d{4})\/(\w+)/;
var match = string.match(regex);
if (match) {
    var date = match[1];
    var dir = match[2];
    console.log(date); // 17.05.2023
    console.log(dir); // SHOP
} else {
    console.log("Nenhum diretório encontrado");
}