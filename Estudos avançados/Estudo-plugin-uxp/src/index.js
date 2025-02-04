const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;

import './componentes/number-field.js';
import './componentes/field-set.js';

// const numberField = document.querySelector('#teste_nf');
// numberField.addEventListener('change', () => {
//     document.querySelector('#texto').textContent = numberField.value;
// });

// // Teste para mudar o valor programaticamente
// setTimeout(() => {
//     numberField.value = 190;
//     document.querySelector('#texto').textContent = numberField.value;
// }, 30);



const fieldset = document.querySelector('#pn1');

document.getElementById('disableButton').addEventListener('click', () => {
    fieldset.disable(); // Desabilita o fieldset
});

document.getElementById('enableButton').addEventListener('click', () => {
    fieldset.enable(); // Habilita o fieldset
});


const numberField = document.querySelector('#teste_nf');
numberField.addEventListener('change', () => {
    document.querySelector('#texto').textContent = numberField.value;
});

setTimeout(() => { fieldset.disable();}, 30); // Desabilita o fieldset

