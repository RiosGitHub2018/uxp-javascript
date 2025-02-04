//const pasta ='Y:/MATRIZ/15.03.2023/SHOP/Giovanna Rego/aquivo.jpg'
const pasta ='Y:/MATRIZ/15.03.2023/SHOP/aquivo.jpg'
const servidor = pasta.substring(1, pasta.lastIndexOf('/'));
const cliente = servidor.substring(servidor.lastIndexOf('/') + 1);
console.log(cliente);