class PSCombobox extends HTMLElement {
    constructor() {
        super();
        this.options = [];
        this._selectedIndex = -1;
        this._originalObjects = [];
        this._isInputMode = false;
    }

    connectedCallback() {
        this.options = JSON.parse(this.getAttribute('data-options') || '[]');
        this.render();
        this.attachEventListeners();

        const initialIndex = parseInt(this.getAttribute('data-selected-index'), 10)
        if (!isNaN(initialIndex) && initialIndex >= 0 && initialIndex < this.options.length) {
            this.selectedIndex = initialIndex 
        } else {
            this.selectedIndex = 0;
        }

        if (this.hasAttribute('disabled')) {
            this.disable();
        }
    }

    render() {
        this.innerHTML = `
        <style>
            ps-combobox {
                display: inline-block;
                position: relative;
                font-family: Arial, sans-serif;
                width: 100%;
                height: 20px;
                color: var(--psfx-texto-color);
            }

            .ps-combobox-container {
                display: flex;
                align-items: center;
                user-select: none;
                height: 24px;
                border: 1px solid var(--psfx-borda-elemento-color);
                padding-left: 1px;
                background-color: var(--psfx-bg-detalhes-color); 
            }

            .ps-combobox-container:hover {
                border: 1px solid var(--psfx-borda-elemento-color-2);
            }

            .ps-combobox-input {
                width: 100%;
                height: 23px;
                flex-grow: 1;
                border: 0px;
                font-size: 12px;
                padding: 4px;
                cursor: text;
                margin: 0px;
                padding-left: 6px;
                font-family: Arial, sans-serif;
            }

            .ps-combobox-text {
                width: 100%;
                height: 20px;
                flex-grow: 1;
                border: 0px;
                font-size: 12px;
                padding: 1px;
                cursor: pointer;
                margin: 0px;
                padding-left: 9px;
                font-family: Arial, sans-serif;
                background: transparent;
                display: flex;
                align-items: center;
            }

            .ps-combobox-arrow {
                cursor: pointer;
                padding: 0 2px;
                background-color: var(--psfx-bg-detalhes-claro-color);
                margin-right: 2px;
                fill: var(--psfx-texto-color);
             }

            .ps-combobox-options {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background-color: var( --psfx-bg-options-list-color);
                border: 1px solid var(--psfx-ui-borda-forte-color);
                box-shadow: var(--psfx-box-shadow:);
                max-height: 144px;
                overflow-y: auto;
                z-index: 1000;
                margin-top: 5px;
                box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
            }

            .ps-combobox-option {
                padding: 3px;
                padding-left: 10px;
                cursor: pointer;
                color: var(--psfx-texto-options-list-color);
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .ps-combobox-option:hover {
                background-color: #60adf5;
                color: #ffffff;
            }

            .ps-combobox-option.selected {
                background-color: var(--psfx-borda-elemento-color);
                color: var(--psfx-texto-color);
            }

            .ps-combobox-option-svg {
                display: none;
                color: var(--psfx-texto-color)
            }

            .ps-combobox-option.selected .ps-combobox-option-svg {
                display: block;
                margin-right: 5px;
            }

            .desabilitar {
                background-image: none; 
                background-color: var(--psfx-bg-detalhes-color); 
                color: #7b7b7b;
                fill: #7b7b7b !important;
            }

            .desabilitarImp {
                color: #7b7b7b;
            }
        </style>
        
        <div class="ps-combobox-container">
            <div class="ps-combobox-text">${this.options[this._selectedIndex] || ''}</div>
            <input type="text" class="ps-combobox-input" value="${this.options[this._selectedIndex] || ''}" style="display: none;">
            <span class="ps-combobox-arrow">
                <svg id="bgSeta" xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="12">
                    <path class="setas" id="seta" d="M4,7.01a1,1,0,0,1,1.7055-.7055l3.289,3.286,3.289-3.286a1,1,0,0,1,1.437,1.3865l-.0245.0245L9.7,11.7075a1,1,0,0,1-1.4125,0L4.293,7.716A.9945.9945,0,0,1,4,7.01Z" fill= var(--psfx-texto-color) />
                </svg>
            </span>
        </div>
        <div class="ps-combobox-options">
            ${this.options.map((option, index) => `
                <div class="ps-combobox-option" data-index="${index}">
                    ${option}
                    <svg xmlns="http://www.w3.org/2000/svg" class="ps-combobox-option-svg" height="12" width="12" viewBox="0 0 16 16" fill="none">
                        <path class="fill" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z"  fill="#60adf5"/>
                    </svg>
                </div>
            `).join('')}
        </div>
        `;
    }

    attachEventListeners() {
        const container = this.querySelector('.ps-combobox-container');
        const input = this.querySelector('.ps-combobox-input');
        const textDiv = this.querySelector('.ps-combobox-text');
        const arrow = this.querySelector('.ps-combobox-arrow');
        const optionsContainer = this.querySelector('.ps-combobox-options');
    
        const updateFilteredOptions = (filterValue) => {
            this._filteredOptions = this.options
                .map((option, index) => ({ option, index }))
                .filter(({ option }) => 
                    option.toLowerCase().includes(filterValue.toLowerCase())
                );
    
            optionsContainer.innerHTML = this._filteredOptions
                .map(({ option, index }) => `
                    <div class="ps-combobox-option ${index === this._selectedIndex ? 'selected' : ''}" data-index="${index}">
                        ${option}
                        <svg xmlns="http://www.w3.org/2000/svg" class="ps-combobox-option-svg" height="12" width="12" viewBox="0 0 16 16" fill="none" style="display: ${index === this._selectedIndex ? 'block' : 'none'}">
                            <path class="fill" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z" fill="#60adf5"/>
                        </svg>
                    </div>
                `).join('');
        };
    
        const toggleOptions = () => {
            if (this.hasAttribute('disabled')) return;
            const newDisplay = optionsContainer.style.display === 'block' ? 'none' : 'block';
            optionsContainer.style.display = newDisplay;
            
            if (newDisplay === 'block') {
                updateFilteredOptions('');
            }
        };
    
        const updateInputWithSelectedOption = () => {
            if (this._selectedIndex >= 0 && this._selectedIndex < this.options.length) {
                const selectedOption = this.options[this._selectedIndex];
                input.value = selectedOption;
            }
        };
    
        const switchToInput = () => {
            if (this.hasAttribute('disabled')) return;
            
            textDiv.style.display = 'none';
            input.style.display = 'block';
            input.focus();
            input.select();
            this._isInputMode = true;
            optionsContainer.style.display = 'block';
            updateFilteredOptions('');
        };
    
        const switchToText = () => {
            input.style.display = 'none';
            textDiv.style.display = 'flex';
            this._isInputMode = false;
            optionsContainer.style.display = 'none';
            
            const inputValue = input.value.trim();
            if (inputValue !== '') {
                textDiv.textContent = inputValue;
                
                const existingIndex = this.options.indexOf(inputValue);
                if (existingIndex !== -1) {
                    this._selectedIndex = existingIndex;
                } else {
                    this._selectedIndex = -1;
                }
            }
        };
    
        document.addEventListener("keydown", (event) => {
            if (!optionsContainer.style.display || optionsContainer.style.display === "none") return;
    
            if (event.key === "ArrowDown") {
                event.preventDefault();
                const currentFilteredIndex = this._filteredOptions.findIndex(
                    ({ index }) => index === this._selectedIndex
                );
                if (currentFilteredIndex === -1 || currentFilteredIndex === this._filteredOptions.length - 1) {
                    this._selectedIndex = this._filteredOptions[0]?.index ?? -1;
                } else {
                    this._selectedIndex = this._filteredOptions[currentFilteredIndex + 1].index;
                }
                updateInputWithSelectedOption();
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                const currentFilteredIndex = this._filteredOptions.findIndex(
                    ({ index }) => index === this._selectedIndex
                );
                if (currentFilteredIndex <= 0) {
                    this._selectedIndex = this._filteredOptions[this._filteredOptions.length - 1]?.index ?? -1;
                } else {
                    this._selectedIndex = this._filteredOptions[currentFilteredIndex - 1].index;
                }
                updateInputWithSelectedOption();
            } else if (event.key === "Enter") {
                event.preventDefault();
                if (this._selectedIndex >= 0) {
                    const selectedOption = this.options[this._selectedIndex];
                    textDiv.textContent = selectedOption;
                    input.value = selectedOption;
                    this.dispatchEvent(new CustomEvent('optionSelected', {
                        detail: {
                            selectedIndex: this._selectedIndex,
                            value: selectedOption,
                            originalObject: this._originalObjects[this._selectedIndex]
                        }
                    }));
                    switchToText();
                }
                return;
            } else if (event.key === "Escape") {
                optionsContainer.style.display = "none";
                return;
            }
    
            const options = this.querySelectorAll('.ps-combobox-option');
            options.forEach((option) => {
                const originalIndex = parseInt(option.getAttribute('data-index'));
                if (originalIndex === this._selectedIndex) {
                    option.classList.add('selected');
                    option.querySelector('.ps-combobox-option-svg').style.display = 'block';
                    option.scrollIntoView({ block: 'nearest' });
                } else {
                    option.classList.remove('selected');
                    option.querySelector('.ps-combobox-option-svg').style.display = 'none';
                }
            });
        });
    
        textDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            switchToInput();
        });
    
        arrow.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!this._isInputMode) {
                toggleOptions();
            } else {
                toggleOptions();
            }
        });
    
        input.addEventListener('input', () => {
            const filterValue = input.value;
            optionsContainer.style.display = 'block';
            updateFilteredOptions(filterValue);
        });
    
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const inputValue = input.value.trim();
                
                if (inputValue !== '') {
                    const existingIndex = this.options.findIndex(
                        option => option.toLowerCase() === inputValue.toLowerCase()
                    );
        
                    if (existingIndex !== -1) {
                        this._selectedIndex = existingIndex;
                        const selectedOption = this.options[this._selectedIndex];
                        const originalObject = this._originalObjects[this._selectedIndex];
                        
                        this.dispatchEvent(new CustomEvent('optionSelected', {
                            detail: {
                                selectedIndex: this._selectedIndex,
                                value: selectedOption,
                                originalObject: originalObject
                            }
                        }));
                    } else {
                        this.dispatchEvent(new CustomEvent('newValueEntered', {
                            detail: {
                                value: inputValue
                            }
                        }));
                    }
                    input.value = inputValue;
                }
                
                switchToText();
            } else if (e.key === 'Escape') {
                switchToText();
            }
        });
    
        optionsContainer.addEventListener('click', (e) => {
            const optionElement = e.target.closest('.ps-combobox-option');
            if (optionElement) {
                const options = this.querySelectorAll('.ps-combobox-option');
                options.forEach(opt => {
                    opt.classList.remove('selected');
                    opt.querySelector('.ps-combobox-option-svg').style.display = 'none';
                });
                optionElement.classList.add('selected');
                optionElement.querySelector('.ps-combobox-option-svg').style.display = 'block';
                
                this.selectedIndex = parseInt(optionElement.getAttribute('data-index'));
                this.dispatchEvent(new CustomEvent('optionSelected', {
                    detail: {
                        selectedIndex: this._selectedIndex,
                        value: this.value,
                        originalObject: this._originalObjects[this._selectedIndex]
                    }
                }));
                switchToText();
            }
        });
    
        document.addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
                switchToText();
            }
        });
    }

    addOption(item, originalObject = null) {
        this._originalObjects.push(originalObject || item);
        this.options.push(item);
        
        const optionsContainer = this.querySelector('.ps-combobox-options');
        const newOptionIndex = this.options.length - 1;
        const newOptionElement = document.createElement('div');
        newOptionElement.className = 'ps-combobox-option';
        newOptionElement.setAttribute('data-index', newOptionIndex);
        newOptionElement.innerHTML = `
            ${item}
            <svg xmlns="http://www.w3.org/2000/svg" class="ps-combobox-option-svg" height="12" width="12" viewBox="0 0 16 16" fill="none">
                <path class="fill" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z"  fill="#60adf5"/>
            </svg>
        `;

        optionsContainer.appendChild(newOptionElement);
    }

    updateSelected() {
        const input = this.querySelector('.ps-combobox-input');
        const textDiv = this.querySelector('.ps-combobox-text');
        
        if (this._selectedIndex === -1) {
            const customValue = textDiv.textContent;
            input.value = customValue;
        } else {
            const selectedValue = this.options[this._selectedIndex];
            input.value = selectedValue;
            textDiv.textContent = selectedValue;
        }

        const options = this.querySelectorAll('.ps-combobox-option');
        options.forEach((option, index) => {
            const svg = option.querySelector('.ps-combobox-option-svg');
            if (index === this._selectedIndex) {
                option.classList.add('selected');
                if (svg) svg.style.display = 'block';
            } else {
                option.classList.remove('selected');
                if (svg) svg.style.display = 'none';
            }
        });
    }

    get selectedIndex() {
        return this._selectedIndex;
    }

    set selectedIndex(value) {
        if (value >= 0 && value < this.options.length) {
            this._selectedIndex = value;
            this.updateSelected();
        } else {
            console.warn('selectedIndex fora do intervalo.');
        }
    }

    get value() {
        const input = this.querySelector('.ps-combobox-input');
        const inputValue = input.value;
        
        const matchedIndex = this.options.findIndex(option => 
            option.toLowerCase() === inputValue.toLowerCase()
        );

        if (matchedIndex !== -1) {
            this._selectedIndex = matchedIndex;
            return this.options[matchedIndex];
        }
        
        return inputValue;
    }

    disable() {
        this.setAttribute('disabled', 'true');
        const input = this.querySelector('.ps-combobox-input');
        const textDiv = this.querySelector('.ps-combobox-text');
        const setasvg = this.querySelector('#seta');
        const bgseta = this.querySelector('#bgSeta');
        const arrow = this.querySelector('.ps-combobox-arrow');
        const container = this.querySelector('.ps-combobox-container');
    
        if (input) input.style.display = 'none';
        if (textDiv) {
            textDiv.style.color = '#7b7b7b';
            textDiv.style.backgroundColor = "var(--psfx-bg-detalhes-color)";
            textDiv.style.cursor = 'default';
        }
    
        if (setasvg) setasvg.classList.add('desabilitar');
        if (bgseta) bgseta.classList.add('desabilitar');
        if (arrow) {
            arrow.style.pointerEvents = 'none';
            arrow.classList.add('desabilitar');
        }
        if (container) container.classList.add('desabilitar');
    }
    
    enable() {
        this.removeAttribute('disabled');
        const input = this.querySelector('.ps-combobox-input');
        const textDiv = this.querySelector('.ps-combobox-text');
        const setasvg = this.querySelector('#seta');
        const bgseta = this.querySelector('#bgSeta');
        const arrow = this.querySelector('.ps-combobox-arrow');
        const container = this.querySelector('.ps-combobox-container');
    
        if (textDiv) {
            textDiv.style.color = '';
            textDiv.style.backgroundColor= '';
            textDiv.style.cursor = 'pointer';
        }
    
        if (setasvg) setasvg.classList.remove('desabilitar');
        if (bgseta) bgseta.classList.remove('desabilitar');
        if (arrow) {
            arrow.style.pointerEvents = 'auto';
            arrow.classList.remove('desabilitar');
        }
        if (container) container.classList.remove('desabilitar');
    }
}

customElements.define('ps-combobox', PSCombobox);



/*
        ///// DOCUMENTAÇÃO DO COMPONENTE
        O PSCombobox é um componente web personalizado que implementa uma caixa de seleção com funcionalidades como pesquisa, navegação por teclado e personalização.

        • Uso Básico
        Atributos HTML
       <ps-combobox data-options='["Brasil", "Argentina", "Chile"]' data-selected-index="3"></ps-combobox>
            data-options: Define as opções disponíveis na combobox.
            data-selected-index: Define o índice do item inicialmente selecionado (exemplo: 3 seleciona o quarto item da lista).
        
        • Manipulação via JavaScript
          Carregar Itens Dinamicamente
              
        const array = [
            { nome: 'João', idade: 25, sexo: "Masculino" },
            { nome: 'Maria', idade: 30, sexo: "Feminino" },
        ];

        const combobox = document.querySelector('ps-combobox');
        setTimeout(() => {
            array.forEach(item => {
                combobox.addOption(item.nome, item); // Exibe `item.nome` e armazena o objeto completo.
            });
            combobox.selectedIndex = 4; // Seleciona o item de índice 4
        }, 90);

        Eventos
        Capturar Seleção
        • combobox.addEventListener('optionSelected', (event) => {
            const { value, originalObject } = event.detail;

            if (originalObject) {
                alert(`Nome: ${value}, Idade: ${originalObject.idade}, Sexo: ${originalObject.sexo}`);
            }
        });
       
       • Ações Personalizadas
         document.querySelector("#botao").addEventListener('click', () => {
            getSelectedItem(); // Obtém as propriedades do item selecionado
            alert(`Nome: ${combobox.value}`); // Exibe o valor selecionado
        });

        Funções Úteis  -------------------------
        • Obter o item selecionado:
        function getSelectedItem() {
            const selected = combobox.selectedObject;
            if (selected) {
                alert(`Nome: ${selected.nome}\nIdade: ${selected.idade}\nSexo: ${selected.sexo}`);
            }
        }

        • Obter item pelo índice:
            function getItemByIndex(index) {
                const selected = combobox._originalObjects[index];
                if (selected) {
                    alert(`Nome: ${selected.nome}\nIdade: ${selected.idade}\nSexo: ${selected.sexo}`);
                }
            }
           
        • Navegação por Teclado
            Seta para cima (↑): Move a seleção para o item anterior.
            Seta para baixo (↓): Move a seleção para o próximo item.
            Enter: Seleciona o item destacado.
            Esc: Fecha o menu de opções.

        • Habilitar ou Desabilitar
            Desabilitar:  combobox.disable();
            Habilitar:     combobox.enable();
*/
