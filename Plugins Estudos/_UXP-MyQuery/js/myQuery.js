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

////////////// FUNÇAO TEMPLATE PARA CAIXA DE TEXTO NUMERAL COM SETAS
////DIV PAI NO HTML / TEXTO REF / LARGURA / ID INPUT / TAMNHO W / ID-SETA+ / ID-SETA-
function inputNumberMD(inputIDx, tx, txtINExib, largura, Q, sp,sn) {
    s1(inputIDx).innerHTML = `
        <style>
            .cssSetas {
                font-family: var(--font-Icons);
                color: var(--font-principal-cor);
                font-size: 9px;
                background-color: var(--cor-bg-btn-aba);
                width: 13px;
                height: 9px;
                display: flex;
                justify-content: center;
                padding-left: 2px;
            }
        </style>
        <div style="display: flex; align-items: center; margin: 3px;">
            <label id="iptlabel" style="font-size: 12px; color: var(--font-principal-cor); margin-right: 5px;">${tx}</label>
            <input type="number" id="${Q}" style="width: ${largura}px; padding: 2px; height: 22px; margin: 0px; padding-top: -2px;" value="1">
            <div style="display: flex; flex-direction: column; padding: 1px; border: var(--cor-borda-setas); border-radius: 0 4px 4px 0">
                <div id="${sp}" class="cssSetas">=</div>
                <div id="${sn}" class="cssSetas">></div>
            </div>
        </div>
    `;
    es1.css("#iptlabel", { display: `${txtINExib}`});
};

////////////// FUNÇAO TEMPLATE PARA CAIXA DE TEXTO
function inputTextoMD(idHTML, txt, txtITExib, txtValue, largurax){
    s1(idHTML).innerHTML = `
    <div style="width: 100%;display: flex; align-items: center; margin: 3px;">
        <label id="iptlabel" style="font-size: 12px; color: var(--font-principal-cor); margin-right: 2px">${txt}</label>
        <input type="text" id="textox" style="width: 90px; padding: 2px;width: ${largurax}px; height: 22px; margin: 0px; padding-top: -2px;" value="${txtValue}">
    </div>
    `;
    es1.css("#iptlabel", { display: `${txtITExib}`});
};

////////DROPDOWLIST( ID-DIV HTML, TEXTO LISTA, OCULTAR TEXTO, ID-LISTA, ARRAY-ITENS, LARGURA-LISTA)
function dropdowListMD(element, textList, txtlistExib, lista, itens, w) {
    s1(element).innerHTML =`
        <div style="width: 100%; display: flex; align-items: center; margin: 1px;">
        <label id="textList" style="font-size: 12px; color: var(--font-principal-cor); margin-right: 5px">${textList}</label>
        <select id="${lista.replace("#", "")}" style="margin: 2px;"></select>
        </div>
    `;
    itens.forEach(item => {s1(lista).innerHTML += `<option value="${item}">${item }</option>`});
    es1.css(lista, { width: `${w}px`, transform:" translateX(-4px)"});
    es1.css("#textList", { display: `${txtlistExib}`});
};

///////// PAINLEL TEMPLATE
function painelMD(element, width, height, idPainel, borda, bradios, tituloPainel, idContPainel){
    s1(element).innerHTML =`
        <div id="modelPainelA" style=" transform: translateX(-10px); width: ${width}; height: ${height}; margin: 10px; display: flex; align-items: center; border: ${borda};  border-radius: ${bradios}; position: relative;">
         <div id="${idPainel.replace("#", "")}" style="position: absolute; top: -1em; left: 5px; background-color: var(--cor-bg-escuro); color:  var(--font-principal-cor) ; display: block; padding: 5px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; ">
            <dt >${tituloPainel}</dt >
            </div>
            <div id="${idContPainel.replace("#", "")}"  style="display: flex;  flex-direction: column; justify-content: center; align-items: center; padding: 10px;"></div>
        </div>
    `;
};

///////// CHECKBOX TEMPLATE
function checkboxMD(element, idCkeck, textCbk){
    s1(element).innerHTML =`
        <sp-checkbox id="${idCkeck.replace("#", "")}" size="s" style="margin-left: 10px;">
        <label  style=" transform: translate(-5px, 1px); font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: var(--font-principal-cor);" >${textCbk}</label>
        </sp-checkbox >
    `
};



