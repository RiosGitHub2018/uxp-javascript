
// Por exemplo, 24 de fevereiro de 2024, 10:17
const dataDesejada = new Date(2024, 1, 24, 14, 46); 

// Obtenha a data e hora atual do sistema
const dataAtual = new Date();

// Verifique se a data e hora atual estão após a data e hora desejadas
if (dataAtual > dataDesejada) {
  alert("Você se excedeu");
} else {
  alert("Deu tudo certo!");
  // Execute a ação desejada se estiver no horário
}
