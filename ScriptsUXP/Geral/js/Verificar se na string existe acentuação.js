const string = "Olá, mundo!";
// Converte a string para a forma NFD.
const normalizedString = string.normalize("NFD");
// Se a string for maior que a string original, ela possui acentuação.
const hasAccent = normalizedString.length > string.length;
// Imprime o resultado.
if(hasAccent == true){console.log("Possue Acentuação")}
else{console.log("Não possue Acentuação")}