const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;

import './componentes/field-set.js';
import './componentes/number-field.js';



const fieldset = document.querySelector('#pn1');
const numberField = document.querySelector('#teste_nf');



numberField.addEventListener('change', () => {
    document.querySelector('#texto').textContent = `Ordenação: ${numberField.value}`;
});

//setTimeout(() => { fieldset.disable();}, 30); // Desabilita o fieldset

