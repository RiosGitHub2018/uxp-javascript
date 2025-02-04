/*ENTENDENDO COMO O USO DE WHILE EM JS
    Em português, "while" pode ser traduzido como "enquanto" ou "à medida que". 
    Em programação, "while" é uma palavra-chave usada para criar loops, que são 
    estruturas de controle que permitem que um bloco de código seja executado
    repetidamente, enquanto uma condição for verdadeira.
    A sintaxe básica de um loop while é a seguinte:
*/

// • 1: Para imprimir os números de 1 a 10:
let i = 1;
while (i <= 10) {
    console.log(i);
    i++;
}
////////////////////////////////////////////
// • 2 Para calcular o somatório dos números de 1 a 10:
// let i = 1;
// let soma = 0;
// while (i <= 10) {
//     soma += i;
//     i++;
// }
// console.log("O somatório é", soma);
//////////////////////////////////

//• 3: Para jogar um jogo da adivinhação:

const numeroSecreto = 1234;
let chute;
while (chute !== numeroSecreto) {
    console.log("Digite um número: ");
    chute = Number(prompt());
    if (chute > numeroSecreto) {
        console.log("O número é menor.");
    } else if (chute < numeroSecreto) {
        console.log("O número é maior.");
    }
}
console.log("Parabéns! Você acertou!");
///////////////////////////

// • 4 Para executar uma operação repetidamente até que o resultado seja desejado:
let numero = 1;
while (numero <= 100) {
    if (numero % 2 === 0) {
        console.log(numero);
    }
    numero++;
}