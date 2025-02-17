(function(global) {
    'use strict';
    var e = {};
    
    // Seleciona um único elemento
    e.$ = function(selector) {
        return document.querySelector(selector);
    };

    // Seleciona múltiplos elementos
    e.$$ = function(selector) {
        return document.querySelectorAll(selector);
    };

    // Adiciona um evento a um único elemento
    e.on = function(selector, event, handler) {
        var element = e.$(selector);
        if (element) {
            element.addEventListener(event, handler);
        }
    };

    // Adiciona um evento a múltiplos elementos
    e.onAll = function(selector, event, handler) {
        var elements = e.$$(selector);
        elements.forEach(function(element) {
            element.addEventListener(event, handler);
        });
    };

    // Define estilos CSS em um único elemento
    e.css = function(selector, styles) {
        var element = e.$(selector);
        if (element) {
            Object.keys(styles).forEach(function(style) {
                element.style[style] = styles[style];
            });
        }
    };

    // Define estilos CSS em múltiplos elementos
    e.cssAll = function(selector, styles) {
        var elements = e.$$(selector);
        elements.forEach(function(element) {
            Object.keys(styles).forEach(function(style) {
                element.style[style] = styles[style];
            });
        });
    };

    // Classe para criar o componente numberField
    e.numberField = function(selector, options) {
        var container = e.$(selector);

        if (!container) {
            alert('Elemento contêiner não encontrado.');
            return;
        }

        // Estilos padrão para o componente
        var defaultStyles = {
            width: options.width || '100px',
            height: options.height || '25px',
            value: options.value || 0,
            disabled: options.disabled || false,
            txtLabel: options.txtLabel || '',
            classAdd: options.classAdd || '',
            labelTranslateX: options.labelTranslateX || '-3px', // Novo parâmetro para deslocamento
            labelTranslateY: options.labelTranslateY || '8px'  // Novo parâmetro para deslocamento
        };

        // Criar o label
        var label = document.createElement('sp-label');
        label.textContent = defaultStyles.txtLabel;
        label.style.color = "#bebebe";
        label.style.transform = `translate(${defaultStyles.labelTranslateX}, ${defaultStyles.labelTranslateY})`;

        // Criar o input
        var input = document.createElement('input');
        input.type = 'number';
        input.value = defaultStyles.value;
        input.style.width = defaultStyles.width;
        input.style.height = defaultStyles.height;
        input.style.verticalAlign = 'middle';
        input.style.margin = "0px";
        input.style.padding = "4px";

        input.disabled = defaultStyles.disabled;
        if (defaultStyles.classAdd) {
            input.classList.add(defaultStyles.classAdd);
        }
   
        // Criar container das setas
        var arrowsContainer = document.createElement('div');
        arrowsContainer.style.display = 'inline-block';
        arrowsContainer.style.height = defaultStyles.height;
        arrowsContainer.style.verticalAlign = 'middle';
        arrowsContainer.style.marginLeft = '0'; // Remover margem à esquerda
        arrowsContainer.style.width = '17px'; // Largura do contêiner
        arrowsContainer.style.color = '#eeebeb'; // Cor do texto
        arrowsContainer.style.fontSize = '8px'; // Tamanho da fonte
        arrowsContainer.style.textAlign = 'center'; // Alinhamento do texto
        arrowsContainer.style.padding = '0px'; // Padding do contêiner
        arrowsContainer.style.fontFamily = 'UXPSfxIcon'; // Fonte do contêiner

        // Criar div do botão de incremento (+)
        var incrementButton = document.createElement('div');
        incrementButton.style.cursor = 'pointer';
        incrementButton.style.textAlign = 'center';
        incrementButton.style.height = '50%';
        incrementButton.style.border = '1px solid #706f6f';
        incrementButton.style.boxSizing = 'border-box';
        incrementButton.textContent = '<'; // Adicionar o símbolo "+" dentro da div
        incrementButton.style.borderBottom = 'none';
        incrementButton.style.display = "flex";
        incrementButton.style.alignItems = "center";
        incrementButton.style.justifyContent = "center";

        // Criar div do botão de decremento (-)
        var decrementButton = document.createElement('div');
        decrementButton.style.cursor = 'pointer';
        decrementButton.style.textAlign = 'center';
        decrementButton.style.height = '49%';
        decrementButton.style.border = '1px solid #706f6f';
        decrementButton.style.boxSizing = 'border-box';
        decrementButton.textContent = '>'; // Adicionar o símbolo "-" dentro da div
        decrementButton.style.display = "flex";
        decrementButton.style.alignItems = "center";
        decrementButton.style.justifyContent = "center";

        // Adicionar evento de clique para incrementar o valor
        incrementButton.addEventListener('click', function() {
            input.value = parseInt(input.value) + 1;
            // Disparar manualmente o evento input
            input.dispatchEvent(new Event('input'));
        });

        // Adicionar evento de clique para decrementar o valor
        decrementButton.addEventListener('click', function() {
            input.value = parseInt(input.value) - 1;
            // Disparar manualmente o evento input
            input.dispatchEvent(new Event('input'));
        });

        // Agrupar os botões de incremento e decremento
        arrowsContainer.appendChild(incrementButton);
        arrowsContainer.appendChild(decrementButton);

        // Adicionar o label, input e as setas no container principal
        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(arrowsContainer);

        // Expor o valor do input para quem usa o componente
        this.getValue = function() {
            return parseFloat(input.value); // Retorna como número
        };

        // Permitir alterar o valor programaticamente
        this.setValue = function(newValue) {
            input.value = newValue;
        };

        // Permitir desabilitar o campo
        this.disable = function() {
            input.disabled = true;
        };

        // Permitir habilitar o campo
        this.enable = function() {
            input.disabled = false;
        };

    };

    // Expor a biblioteca para o ambiente global
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = e;
    } else { global.e = e;}

    ///////CRIAÇÃO DE PAINEIS XXXXXXXXXXXXXXXXXXX
    e.fieldsetfx = function(selector, options) {
        var container = e.$(selector);

        if (!container) {
            alert('Elemento contêiner não encontrado.');
            return;
        }

        // Estilos padrão para o componente
        var defaultStyles = {
            width: options.width || '100%',
            height: options.height || '100%',
            disabled: options.disabled || false,
            legend: options.legend || '',
            conteudo: options.conteudo || '', // Id de uma div no HTML
            bcground: options.bcground || '#535353',
        };

        // Criar a div que simula o fieldset
        var fieldsetDiv = document.createElement('div');
        fieldsetDiv.style.width = defaultStyles.width;
        fieldsetDiv.style.height = defaultStyles.height;
        fieldsetDiv.style.position = 'relative'; // Para que a legenda possa ser posicionada dentro dele
        fieldsetDiv.style.border = '1px solid #424242'; // Bordas do fieldset
        fieldsetDiv.style.paddingTop = '20px'; // Espaço para a legenda

        // Adicionar Flexbox para centralizar o conteúdo
        fieldsetDiv.style.display = 'flex'; // Ativa o Flexbox
        fieldsetDiv.style.flexDirection = 'column'; // Direção da flexão vertical
        fieldsetDiv.style.alignItems = 'center'; // Alinha o conteúdo horizontalmente ao centro
        fieldsetDiv.style.justifyContent = 'center'; // Alinha o conteúdo verticalmente ao centro
        fieldsetDiv.style.boxSizing = 'border-box'; // Inclui bordas e preenchimento nas dimensões
        fieldsetDiv.style.borderRadius = '5px'; // Ou qualquer valor de raio que preferir
        fieldsetDiv.style.backgroundColor = defaultStyles.bcground

        // Criar o label que simula a legend
        var legendLabel = document.createElement('sp-label');
        legendLabel.textContent = defaultStyles.legend;
        legendLabel.style.color = '#eee9e9';
        legendLabel.style.fontSize = '12px';
        legendLabel.style.position = 'absolute'; // Posicionamento absoluto
        legendLabel.style.top = '-8px'; // Ajuste da posição do topo
        legendLabel.style.left = '10px'; // Deslocamento para a esquerda
        legendLabel.style.padding = '0 5px'; // Adicionando padding
        legendLabel.style.background = 'linear-gradient(0deg, rgba(83,83,83,0) 55%, rgba(83,83,83,1) 55%, rgba(83,83,83,1) 100%)'; // Fundo com gradiente
        legendLabel.style.zIndex = '1'; // Certifique-se de que a legenda esteja acima do campo

        // Criar a div que pode conter o conteúdo do fieldset
        var conteudoDiv = document.createElement('div');
        conteudoDiv.style.width = '100%';
        conteudoDiv.style.height = 'calc(100% - 40px)'; // Para manter espaço para a legenda
        conteudoDiv.style.display = 'flex'; // Ativar Flexbox
        conteudoDiv.style.alignItems = 'center'; // Alinhar verticalmente
        conteudoDiv.style.justifyContent = 'center'; // Alinhar horizontalmente
        conteudoDiv.style.position = 'absolute'; // Para que possamos controlar a posição
        conteudoDiv.style.top = '20px'; // Espaço para a legenda
        conteudoDiv.style.left = '0';
        conteudoDiv.style.textAlign = 'center'; // Garantir que o texto fique centralizado

        // Se houver conteúdo, mover o conteúdo diretamente para o fieldset
        var contentElement = e.$(`#${defaultStyles.conteudo}`);
        if (contentElement) {
            conteudoDiv.appendChild(contentElement); // Mover o conteúdo original para o fieldset
        } else {
            alert('Conteúdo não encontrado.');
        }

        // Adicionar a legenda e o conteúdo dentro do fieldset
        fieldsetDiv.appendChild(legendLabel); // A legenda é filha do fieldsetDiv
        fieldsetDiv.appendChild(conteudoDiv); // O conteúdo é adicionado ao fieldsetDiv
        // Adicionar o fieldset ao container
        container.appendChild(fieldsetDiv);

        // Função para desabilitar o campo
        this.disable = function() {
            fieldsetDiv.disabled = true;
            fieldsetDiv.style.opacity = '0.5'; // Visualmente desabilitar
        };

        // Função para habilitar o campo
        this.enable = function() {
            fieldsetDiv.disabled = false;
            fieldsetDiv.style.opacity = '1'; // Restaurar opacidade normal
        };

        // Função para alterar a legenda programaticamente
        this.setLegend = function(newLegend) {
            legendLabel.textContent = newLegend;
        };
    };
   //////////////////////////


   
   /////COMPONENTE DROPDOWLIST
   e.dropdownList = function(selector, options) {
    var container = e.$(selector);

    if (!container) {
        alert('Elemento contêiner não encontrado.');
        return;
    }

    // Estilos padrão para o componente
    var defaultStyles = {
        width: options.width || '190px',
        height: options.height || '25px',
        legend: options.legend || 'Legend:',
        itens: options.itens || [],
        indexSel: options.indexSel || 0
    };

    // Estilizar o container para alinhar os itens horizontalmente
    container.style.display = 'flex';
    container.style.alignItems = 'center'; // Para alinhar verticalmente os itens

    // Criar o label (legend)
    var label = document.createElement('sp-label');
    label.textContent = defaultStyles.legend;
    label.style.color = "#eee9e9";
    label.style.fontSize = "12px";
    label.style.marginRight = "-5px"; // Margem entre o label e o select
    label.style.marginLeft = "10px"; // Margem entre o label e o select

    // Criar o elemento select
    var select = document.createElement('select');
    select.style.width = defaultStyles.width;
    select.style.height = defaultStyles.height;

    // Adicionar opções dinamicamente
    defaultStyles.itens.forEach(function(item, index) {
        var option = document.createElement('option');
        option.value = item;
        option.textContent = item;

        if (index === defaultStyles.indexSel) {
            option.selected = true;
        }

        select.appendChild(option);
    });

    // Adicionar o select e o label ao container
    container.appendChild(label);
    container.appendChild(select);

    // Evento change
    select.addEventListener('change', function() {
        var selectedIndex = select.selectedIndex;
        var selectedValue = select.value; // Obter valor do item selecionado
        var selectedText = select.options[selectedIndex].text; // Obter texto do item selecionado
        if (options.onChange) {
            options.onChange(selectedValue); // Passar valor para a função onChange se fornecida
        }
    });

    // Métodos para interagir com o dropdown
    this.getValue = function() {
        return select.value; // Retorna o valor do item selecionado
    };

    this.setValue = function(index) {
        if (index >= 0 && index < select.options.length) {
            select.selectedIndex = index;
        }
    };

    this.getSelectedText = function() {
        return select.options[select.selectedIndex].text; // Retorna o texto do item selecionado
    };

    // Novo método para obter o índice do item selecionado
    this.getSelectedIndex = function() {
        return select.selectedIndex; // Retorna o índice do item selecionado
    };
};

   //////////::::::::::::::::::::::::::::::::

    ////////////////////////////////////////////////////////////
   ////////// DESABILITAR/HABILITAR COMPONENTES
   e.disabled = function(selector, isDisabled) {
    var container = e.$(selector);

    if (!container) {
        alert('Elemento contêiner não encontrado.');
        return;
    }

    // Percorre todos os elementos filhos da div
    var children = container.querySelectorAll('*');

    children.forEach(function(child) {
        // Verifica se é uma tag `label`
        if (child.tagName.toLowerCase() === 'label' || "sp-label") {
            if (isDisabled) {
                child.style.color = '#a0a0a0'; // Cor para modo desabilitado
            } else {
                child.style.color = '#e4e2e2'; // Cor para modo habilitado
            }
        }

        // Verifica se é uma tag `div`
        if (child.tagName.toLowerCase() === 'div' ) {
            if (isDisabled) {
                child.style.backgroundColor = '#555555'; // Cor para modo desabilitado
            } else {
                child.style.backgroundColor = '#535353'; // Cor para modo habilitado
            }
        }

        // Verifica se é um input ou select
        if (['input', 'select'].includes(child.tagName.toLowerCase())) {
            if (isDisabled) {
                child.disabled = true; // Desabilita inputs e selects
            } else {
                child.disabled = false; // Habilita inputs e selects
            }
        }

        // Desabilitar clique se estiver no modo desabilitado
        if (isDisabled) {child.style.pointerEvents = 'none';} 
        else { child.style.pointerEvents = ''; }
    });
};

////////// DESABILITAR/HABILITAR COMPONENTES
/////////////xxxxxxxxxxxxxxxxxxxxxxxxxx
    
})(this);

// Atalhos para selecionar elementos
var s1 = e.$;  // Elemento único
var s2 = e.$$; // Múltiplos elementos
var es1 = e; // Biblioteca principal


////////CARREGAR  ICONES SVG
async function initSvgIcons(csvg) {
    const icons = document.querySelectorAll(csvg);

    // Função para carregar e renderizar o ícone
    async function loadIcon(element, index) {
        // Adiciona um id dinâmico se não existir
        const id = element.id || `svg-icon-${index}`;
        element.id = id;

        const size = element.dataset.size || "20px";
        const icone = element.dataset.icon || "icon009.svg"
        const fill = element.dataset.fill || "#b8b8b8";
        try {
            const response = await fetch(`/icons/svg/${icone}.svg`);
            if (!response.ok) {
                alert(`Failed to load icon: ${icone}`);
            }
            const svgCode = await response.text();

            element.innerHTML = `
                <style>
                    .${id} {
                        width: ${size};
                        height: ${size};
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .${id} svg,
                    .${id} svg path,
                    .${id} svg rect,
                    .${id} svg circle,
                    .${id} svg polygon {
                        width: 100% !important;
                        height: 100% !important;
                        fill: ${fill} !important;
                    }
                </style>
                <div class="${id}">${svgCode}</div>
            `;
        } catch (error) {}
    }

    // Carrega todos os ícones inicialmente
    icons.forEach(async (element, index) => {  await loadIcon(element, index); });

    // Retorna uma função para atualizar dinamicamente os ícones
    return async function updateIcon(selector, newFill, nicons) {
        const targetElement = document.querySelector(selector);
        if (targetElement) {
            targetElement.dataset.fill = newFill; // Atualiza o dataset.fill
            targetElement.dataset.icon =  nicons;
            const index = Array.from(icons).indexOf(targetElement); // Obtém o índice do elemento
            await loadIcon(targetElement, index); // Recarrega o ícone com o novo fill
        } else {
            alert("Element not found:", selector);
        }
    };
};
////////////::::::::::::::::::


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
            <input type="number" id="${Q}" class="edittxt" style="width: ${largura}px; padding: 2px; height: 22px; margin: 0px; padding-top: -2px;" value="1">
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
        <div style="width: 100%; display: flex; align-items: center;  justify-content: center; margin: 1px;">
        <label id="textList" style="font-size: 12px; color: var(--font-principal-cor);">${textList}</label>
        <select id="${lista.replace("#", "")}" class="listTarget" style="margin: 2px;"></select>  
        </div>
    `;
    itens.forEach(item => {s1(lista).innerHTML += `<option value="${item}">${item }</option>`});  
    es1.css(lista, { width: `${w}px`, transform:" translateX(-0px)"});
    es1.css("#textList", { display: `${txtlistExib}`});
};

///////// PAINLEL TEMPLATE
function painelMD(element, width, height, idPainel, borda, bradios, tituloPainel, tituloBG, idContPainel,alinhar){
    s1(element).innerHTML =`
        <div id="modelPainelA" style=" transform: translateX(-10px); width: ${width}; height: ${height}; margin: 10px; display: flex; align-items: ${alinhar}; border: ${borda};  border-radius: ${bradios}; position: relative;">
         <div id="${idPainel.replace("#", "")}" style="position: absolute; top: -1em; left: 5px; background-color: ${tituloBG}; color:  var(--font-principal-cor) ; display: block; padding: 5px 5px 0 5px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; ">
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



