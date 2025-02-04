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


////FORMATAÇÃO DATA TIPO: "Teresina-Pi, 14 de setembro de 2024"
////formatarData("Teresina-Pi");
function formatarData(localidade){
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', options);
    dataAtual = `${localidade}, ${formattedDate}`;
};

////FORMATAÇÃO DATA
function dataConfigs(){
    const dataAtual = new Date();
    ano = dataAtual.getFullYear();
    horas = dataAtual.getHours();
    minutos = dataAtual.getMinutes();
    segundos = dataAtual.getSeconds();
    // Formatar o horário (adicionando zero à esquerda se necessário)
    const horarioFormatado = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    orçamentoID = `${ano}${horas.toString().padStart(2, '0')}${minutos.toString().padStart(2, '0')}${segundos.toString().padStart(2, '0')}`;

    function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês é zero-indexado
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
    }

    const dataVencimento = new Date(dataAtual);
    dataVencimento.setDate(dataVencimento.getDate() + 30);
    dataFormatadaA = formatarData(dataAtual);
    dataFormatadaB = formatarData(dataVencimento);
};


////FORMATAÇÃO NO FORMATO PREÇO
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

 ////FORMATAÇÃO DE TELEFONE
function formatatTelefone(elementos) {
    elementos.forEach(elemento => {
        document.getElementById(elemento).addEventListener('input', function (e) {
            let value = e.target.value;e.target.value = formatar2(value);
        });
    });
    
    function formatar2(value) {
        // Remove todos os caracteres não numéricos
        let value2 = value.replace(/\D/g, '');
        // Função para formatar um único número
        function formatarNumero(numero) {
        if (numero.length === 11) {
            return numero.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4'); // Celular com DDD
        } else if (numero.length === 10) {
            return numero.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3'); // Residencial com DDD
        } else if (numero.length === 9) {
            return numero.replace(/(\d{1})(\d{4})(\d{4})/, '$1 $2-$3'); // Celular sem DDD
        } else if (numero.length === 8) {
            return numero.replace(/(\d{4})(\d{4})/, '$1-$2'); // Residencial sem DDD
        }
        return numero; // Retorna sem formatação se não se encaixar nos padrões acima
        }
        // Verifica se há dois números (separados por /)
        if (value2.includes('/') || value2.length > 11) {
        let numeros = value2.split('/');
        if (numeros.length === 1) {
            // Se não houver '/', divide a string em dois números
            let primeiroNumero = value2.slice(0, 10); // Pega os primeiros 10 dígitos (DDD + número residencial)
            let segundoNumero = value2.slice(10);     // Pega o resto dos dígitos
            // Se o primeiro número for celular (11 dígitos), ajusta a divisão
            if (value2[2] === '9') {
            primeiroNumero = value2.slice(0, 11);
            segundoNumero = value2.slice(11);
            }
            numeros = [primeiroNumero, segundoNumero];
        }
        // Formata cada número individualmente
        numeros = numeros.map(num => formatarNumero(num.trim()));
        // Retorna ambos os números separados por uma barra "/"
        return numeros.join(' / ');
        } else {
        // Se houver apenas um número, formata-o diretamente
        return formatarNumero(value2);
        }
    }
 };
////////////::::::::::::::::::::::::::::::::::::::::



function formatCPFOrCNPJ(elementos) {
    elementos.forEach(elemento => {
      document.getElementById(elemento).addEventListener('input', function (e) {
        let value = e.target.value;
        e.target.value = formatar(value);
      });
    });
  
    function formatar(value) {
      value = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
      if (value.length <= 11) {
        // Formatação de CPF
        return value
            .replace(/(\d{3})(\d)/, '$1.$2') // CAPTURA OS PRIMEIROS 3 DÍGITOS (\d{3}) E O PRÓXIMO DÍGITO (\d), INSERE UM PONTO ENTRE ELES ($1.$2)
            .replace(/(\d{3})(\d)/, '$1.$2') // REPETE O PROCESSO PARA O PRÓXIMO BLOCO DE 3 DÍGITOS, INSERINDO MAIS UM PONTO ENTRE ELES ($1.$2)
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // CAPTURA OS ÚLTIMOS 3 DÍGITOS E 1 OU 2 DÍGITOS FINAIS, INSERE UM TRAÇO ENTRE ELES ($1-$2)
      } else {
        // Formatação de CNPJ
        return value
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        }
    }
};
////////////FORMATAÇÃO INSCRIÇÃO MUNICIPAL
function formatINSCMUN(elementos) {
    elementos.forEach(elemento => {
    document.getElementById(elemento).addEventListener('input', function (e) {
        let value = e.target.value;
        e.target.value = formatar(value);
        });
    });

    function formatar(value) {
        value = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        return value.replace(/(\d{6})(\d)/, '$1-$2');
    }
};

////////////FORMATAÇÃO INSCRIÇÃO ESTADUAL
function formatINSCEST(elementos) {
    elementos.forEach(elemento => {
    document.getElementById(elemento).addEventListener('input', function (e) {
        let value = e.target.value; e.target.value = formatar2(value);
         });
    });

    function formatar2(value) {
    value2 = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    ///FORMATAR ESCRIÇÃO ESTADUAL
    return value2
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1})$/, '$1-$2');
    }
}


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

//FORMATAÇÃO NO FORMATO PREÇO
function formatarValor(valor) {
    let valorNumerico = parseFloat(valor); // Converte a string para um número decimal
    let valorFormatado = valorNumerico.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    });
    return valorFormatado;
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

function numeroExtenso(numeroFormatado) {
    const numeroLimpo = numeroFormatado.replace('.', '').replace(',', '.');
    const [parteInteira, parteDecimal] = numeroLimpo.split('.');
    let extenso = converterParteInteiraPorExtenso(parseInt(parteInteira));
    extenso += parteInteira === "1" ? " Real" : " Reais";
    if (parteDecimal) {
        const centavos = parseInt(parteDecimal.padEnd(2, '0'));
        if (centavos > 0) {
            extenso += ` e ${converterParteInteiraPorExtenso(centavos)} Centavo${centavos !== 1 ? 's' : ''}`;
        }
    }
    return  extenso.charAt(0).toUpperCase() +  extenso.slice(1).toLowerCase();;
    //return extenso.toUpperCase();
};
// Exemplos de uso
console.log(numeroExtenso("1,00"));      // um real

function formatNumber(value) {
let formattedValue = value.toString().replace('.', ',');
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
};
function pararArraste() { arrastando = false;  }
}

