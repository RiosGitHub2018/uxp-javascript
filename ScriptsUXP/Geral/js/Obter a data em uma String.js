const str = "Y:\\MATRIZ\\16.03.2023\\SHOP\\Josy 315276";
const regex = /\d{2}\.\d{2}\.\d{4}/; // expressão regular para buscar a data no formato DD.MM.AAAA
const match = str.match(regex); // busca a data na string

if (match) {
  const data = match[0]; // a primeira ocorrência encontrada
  console.log(data); // imprime "16.03.2023"
} else {
  console.log("Data não encontrada na string.");
}