(function(global) {
    'use strict';
    var e = {};
    // Função para selecionar um único elemento
    /*EXEMPLO:
    alert(e$('#elemento').textContent)*/
    e.$ = function(selector) {
        return document.querySelector(selector);
    };
    //////////////////////////////////////////////////////////////
    // Função para selecionar múltiplos elementos
    /*EXEMPLO:
    e.$$('.test2').forEach(el => el.click());
    alert(e$$('.myClass')[0].textContent)*/
    e.$$ = function(selector) {
        return document.querySelectorAll(selector);
    };
    //////////////////////////////////////////////////////////////

    // Função para adicionar um evento a um único elemento
    e.on = function(selector, event, handler) {
        var element = e.$(selector);
        if (element) {
            element.addEventListener(event, handler);
        }
    };
    // Função para adicionar um evento a múltiplos elementos
    e.onAll = function(selector, event, handler) {
        var elements = e.$$(selector);
        elements.forEach(function(element) {
            element.addEventListener(event, handler);
        });
    };
    // Função para definir estilos CSS em um único elemento
    e.css = function(selector, styles) {
        var element = e.$(selector);
        if (element) {
            Object.keys(styles).forEach(function(style) {
                element.style[style] = styles[style];
            });
        }
    };
    // Função para definir estilos CSS em múltiplos elementos
    e.cssAll = function(selector, styles) {
        var elements = e.$$(selector);
        elements.forEach(function(element) {
            Object.keys(styles).forEach(function(style) {
                element.style[style] = styles[style];
            });
        });
    };
    // Expor a biblioteca para o ambiente global
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = e;
    } else {
        global.e = e;
    }
})(this);

var s1=e.$;  //////// ATUAL ELEMENTO
var s2=e.$$; ////////VARIOS  ELEMENTOS
var es1 = e;

///////// EXIBIR MENSAGEM DE ALERTA DA UI
function msgShowAlert(msg) {
    const modalSA = document.querySelector("#alertModal");
    modalSA.innerHTML = `
        <div style="display: flex; flex-direction: column; ">
            <div style="display: flex; padding: 30px; background-color: rgb(254, 255, 254); align-items: center; margin-bottom: -20px; justify-content: center;">
                <label style="font-family: iconsFont; font-size: 50px; margin-right: 10px; color: rgb(69, 114, 173);">q</label>
                <label style="font-size: 14px;">${msg}</label>
            </div>
            <div style="padding: 10px; background-color: rgb(212, 211, 211); display: flex; justify-content: end; align-items: center;">
                <button id="a-mdBtn1" class="btbDefault" autofocus>Ok</button>
            </div>
        </div>
    `;
    const saModalOK = modalSA.querySelector('#a-mdBtn1');
    saModalOK.removeEventListener('click', fecharAlert);
    saModalOK.addEventListener('click', fecharAlert);
    function fecharAlert() { es1.css('#alertModal', { display: 'none' });}
    // Exibe o modal
    es1.css('#alertModal', { display: 'flex' });
};


///////// EXIBIR MENSAGEM DE CONFIRMA DA UI
function msgConfirma(msg, callback) {
    const modal = document.querySelector("#confrmaModal");
    modal.innerHTML = `
        <div style="display: flex; flex-direction: column; ">
            <div style="display: flex; padding: 30px; background-color: rgb(254, 255, 254); align-items: center; margin-bottom: -20px; justify-content: center;">
                <label style="font-family: iconsFont; font-size: 50px; margin-right: 10px; color: rgb(69, 114, 173);">W</label>
                <label style="font-size: 14px;">${msg}</label>
            </div>
            <div style="padding: 10px; background-color: rgb(212, 211, 211); display: flex; justify-content: end; align-items: center;">
                <button id="mdBtn1" class="btbDefault" autofocus>Ok</button>
                <button id="mdBtn2" class="btbDefault">Cancelar</button>
            </div>
        </div>
    `;
    const okButton = modal.querySelector('#mdBtn1');
    const cancelButton = modal.querySelector('#mdBtn2');

    // Remove event listeners antigos, se houver
    okButton.removeEventListener('click', handleOkClick);
    cancelButton.removeEventListener('click', handleCancelClick);

    // Adiciona novos event listeners
    okButton.addEventListener('click', handleOkClick);
    cancelButton.addEventListener('click', handleCancelClick);

    function handleOkClick() {
        es1.css('#confrmaModal', { display: 'none' });
        if (typeof callback === 'function') {
            callback(); // Executa a função passada como argumento
        }
    }

    function handleCancelClick() { es1.css('#confrmaModal', { display: 'none' });  }
    // Exibe o modal
    es1.css('#confrmaModal', { display: 'flex' });
};


    //////FORMATAÇÃO NO FORMATO PREÇO
    function formatarPrecos(elementos) {
        elementos.forEach(elemento => {
            const input = document.getElementById(elemento);
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, "");
                value = (value / 100).toFixed(2) + "";
                value = value.replace(".", ",");
                value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
                e.target.value = "R$ " + value;
            });
        });
    };


  ////////////FORMATAÇÃO DE TAMANHOS
  function formatarMedidas(elementos) {
    elementos.forEach(id => {
        const input = document.getElementById(id);

        input.addEventListener('input', function(e) {
            let value = input.value.replace(/ cm/g, '').trim(); // Remove "cm" temporariamente
            input.value = `${value} cm`; // Adiciona "cm" ao final
        });

        input.addEventListener('keydown', function(e) {
            if ((e.key === 'Backspace' || e.key === 'Delete') && input.value.endsWith('cm')) {
                e.preventDefault(); // Evita remover "cm"
                let value = input.value.slice(0, -4); // Remove o número anterior
                if (value.length > 0) {
                    input.value =`${value} cm`; // Mantém "cm"
                } else {
                    input.value = ''; // Permite apagar todo o conteúdo
                }
            }
        });
        input.addEventListener('focus', function() {
            // Remove temporariamente "cm" para facilitar a edição do número
            if (input.value === 'cm') {
                input.value = '';
            } else {
                input.value = input.value.replace(/cm/g, '').trim();
            }
        });
    });
}



//////////// FUNÇÃO PARA CONVERTER NUMEROS POR EXTENSO
const numerosPorExtenso = {
    0: "zero",
    1: "um",
    2: "dois",
    3: "três",
    4: "quatro",
    5: "cinco",
    6: "seis",
    7: "sete",
    8: "oito",
    9: "nove",
    10: "dez",
    11: "onze",
    12: "doze",
    13: "treze",
    14: "quatorze",
    15: "quinze",
    16: "dezesseis",
    17: "dezessete",
    18: "dezoito",
    19: "dezenove",
    20: "vinte",
    30: "trinta",
    40: "quarenta",
    50: "cinquenta",
    60: "sessenta",
    70: "setenta",
    80: "oitenta",
    90: "noventa",
    100: "cem",
    200: "duzentos",
    300: "trezentos",
    400: "quatrocentos",
    500: "quinhentos",
    600: "seiscentos",
    700: "setecentos",
    800: "oitocentos",
    900: "novecentos",
    1000: "mil"
};

function converterParteInteiraPorExtenso(numero) {
    if (numero in numerosPorExtenso) return numerosPorExtenso[numero];
    let extenso = "";
    if (numero >= 1000) {
        const milhares = Math.floor(numero / 1000);
        if (milhares > 1) {
            extenso += converterParteInteiraPorExtenso(milhares) + " mil";
        } else {
            extenso += "mil";
        }
        numero %= 1000;
        if (numero > 0) {
            extenso += " e ";
        }
    }
    if (numero >= 100) {
        if (numero === 100) {
            extenso += "cem";
        } else if (numero > 200) {
            extenso += numerosPorExtenso[Math.floor(numero / 100) * 100];
        } else {
            extenso += "cento";
        }
        numero %= 100;
        if (numero > 0) extenso += " e ";
    }
    if (numero > 0) {
        if (numero < 20) {
            extenso += numerosPorExtenso[numero];
        } else {
            extenso += numerosPorExtenso[Math.floor(numero / 10) * 10];
            if (numero % 10 > 0) {
                extenso += " e " + numerosPorExtenso[numero % 10];
            }
        }
    }
    return extenso.trim();
}

function converterNumeroPorExtenso(numeroFormatado) {
    // Remove o ponto de milhar e substitui a vírgula por ponto
    const numeroLimpo = numeroFormatado.replace('.', '').replace(',', '.');
    
    // Separa a parte inteira da parte decimal
    const [parteInteira, parteDecimal] = numeroLimpo.split('.');
    
    // Converte a parte inteira para texto por extenso
    let extenso = converterParteInteiraPorExtenso(parseInt(parteInteira));
    
    // Adiciona "reais" à parte inteira
    extenso += parteInteira === "1" ? " real" : " reais";
    
    // Adiciona a parte decimal se houver
    if (parteDecimal) {
        const centavos = parseInt(parteDecimal.padEnd(2, '0'));
        if (centavos > 0) {
            extenso += ` e ${converterParteInteiraPorExtenso(centavos)} centavo${centavos !== 1 ? 's' : ''}`;
        }
    }
    
    return extenso;
}

// // Exemplos de uso
// console.log(converterNumeroPorExtenso("1,00"));      // um real
// console.log(converterNumeroPorExtenso("1,01"));      // um real e um centavo
// console.log(converterNumeroPorExtenso("1.000,00"));  // mil reais
// console.log(converterNumeroPorExtenso("1.001,10"));  // mil e um reais e dez centavos
// console.log(converterNumeroPorExtenso("1.100,00"));  // mil e cem reais
// console.log(converterNumeroPorExtenso("1.101,00"));  // mil cento e um reais
// console.log(converterNumeroPorExtenso("11.107,29")); // onze mil cento e sete reais e vinte e nove centavos


  function formatNumber(value) {
    // Converte o valor para string e substitui o ponto por vírgula
    let formattedValue = value.toString().replace('.', ',');
    // Adiciona o ponto de milhar se houver 4 ou mais dígitos antes da vírgula
    formattedValue = formattedValue.replace(/^(\d{1,3})(\d{3}),/, '$1.$2,');
    
    return formattedValue;
  }
  
  ////////// DESLOCAR ELEMENTOSS
  function deslocarElemento(elemento, dscX, dscY, xma, xmi,  yma, ymi) {
    let arrastando = false;
    let offsetX, offsetY;
    const ofsset = document.querySelector(elemento);
    
    ofsset.addEventListener('mousedown', iniciarArraste);
    document.addEventListener('mousemove', mover);
    document.addEventListener('mouseup', pararArraste);

    function iniciarArraste(e) {
        arrastando = true;
        const rect = ofsset.getBoundingClientRect();
        offsetX = e.clientX - rect.left - dscX;
        offsetY = e.clientY - rect.top - dscY;
        ofsset.style.position = 'absolute';
    }

    function mover(e) {
        if (arrastando) {
            // Calcular a nova posição do modal, compensando o deslocamento inicial
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // Restringir o movimento dentro dos limites especificados
            newX = Math.max(xma, Math.min(newX, xmi));           
            newY = Math.max(yma, Math.min(newY, ymi));

            // Aplicar as novas coordenadas ao ofsset
            ofsset.style.left = `${newX}px`;
            ofsset.style.top = `${newY}px`;
        }
    }

    function pararArraste() {
        arrastando = false;
    }
}

  