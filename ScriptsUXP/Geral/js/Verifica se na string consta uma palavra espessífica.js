const str = "Y:\MATRIZ\16.03.2023\SHOPP\Josy 315276";
const word = "SHOP" || "SHOPP" ;

if (str.includes(word)) {
  console.log(`A palavra ${word} foi encontrada na string`);
} else {
  console.log(`A palavra ${word} não foi encontrada na string`);
}

//OU
/*const str = "Esta é uma string com uma palavra específica.";
const regex = /específica/;

if (regex.test(str)) {
  console.log(`A palavra "${regex.source}" foi encontrada na string.`);
} else {
  console.log(`A palavra "${regex.source}" não foi encontrada na string.`);
}*/