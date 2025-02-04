class PSDropdownlist extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Criar o Shadow DOM
        this.options = [];
        this._selectedIndex = -1;
        this._originalObjects = [];
        this._submenus = [];
    }
  
    get selectedObject() {
        return this._originalObjects[this._selectedIndex];
    }
  
    connectedCallback() {
        try {
            const itemElements = this.querySelectorAll('ms-item, ms-divider');
            if (itemElements.length > 0) {
                // Limpar arrays antes de popular
                this.options = [];
                this._originalObjects = [];
                this._submenus = [];
    
                itemElements.forEach((item) => {
                    if (item.tagName === 'MS-ITEM') {
                        const text = item.textContent.trim();
                        this.options.push(text);
                        this._originalObjects.push(item.dataset.object ? JSON.parse(item.dataset.object) : null);
                        
                        const subitensAttr = item.getAttribute('subitem');
                        if (subitensAttr) {
                            try {
                                const subitens = JSON.parse(subitensAttr.replace(/'/g, '"'));
                                this._submenus.push(subitens);
                            } catch (error) {
                                console.error('Erro ao processar subitens', error);
                                this._submenus.push(null);
                            }
                        } else {
                            this._submenus.push(null);
                        }
                    }
                });
            }
    
            this.render();
            this.attachEventListeners();
    
            const initialIndex = parseInt(this.getAttribute('data-selected-index'), 10);
            if (!isNaN(initialIndex) && initialIndex >= 0 && initialIndex < this.options.length) {
                this.selectedIndex = initialIndex;
            } else {
                // Encontrar o primeiro índice não-nulo
                const firstValidIndex = this.options.findIndex(option => option !== null);
                this.selectedIndex = firstValidIndex !== -1 ? firstValidIndex : 0;
            }
    
            if (this.hasAttribute('disabled')) {
                this.disable();
            }
        } catch (error) {
            console.log(error);
        }
    }
  
    render() {
        this.shadowRoot.innerHTML = `
        <style>
        :host {
            display: inline-block;
            position: relative;
            font-family: Arial, sans-serif;
            width: 300px;
            height: 20px;
            color: var(--psfx-texto-color);
        }

        .ms-dropdownlist-container {
            display: flex;
            align-items: center;
            user-select: none;
            height: 24px;
            border: 1px solid var(--psfx-borda-elemento-color);
            padding-left: 1px;
            background-color: var(--psfx-bg-detalhes-color); 
            cursor: pointer;
        }

        .ms-dropdownlist-container:hover {
            border: 1px solid var(--psfx-borda-elemento-color-2);
        }

        .ms-dropdownlist-text {
            width: 100%;
            height: 20px;
            flex-grow: 1;
            border: 0px;
            font-size: 12px;
            padding: 1px;
            margin: 0px;
            padding-left: 9px;
            font-family: Arial, sans-serif;
            background: transparent;
            display: flex;
            align-items: center;
        }

        .ms-dropdownlist-arrow {
            cursor: pointer;
            padding: 0 2px;
            background-color: var(--psfx-bg-detalhes-claro-color);
            margin-right: 2px;
            fill: var(--psfx-texto-color);
        }

        .ms-dropdownlist-indicador {
            cursor: pointer;
            fill: var(--psfx-texto-options-list-color);
        }

        .ms-dropdownlist-options {
            display: none;
            position: relative;
            top:-4px;
            left: 0;
            right: 0;
            background-color: var( --psfx-bg-options-list-color);
            border: 1px solid var(--psfx-ui-borda-forte-color);
            box-shadow: var(--psfx-box-shadow);
            max-height: 144px;
            overflow-y: auto;
            z-index: 1000;
            margin-top: 5px;
            box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
        }

        .ms-dropdownlist-options.show {
            display: block;
        }

        .ms-dropdownlist-option {
            padding: 3px;
            padding-left: 10px;
            cursor: pointer;
            color: var(--psfx-texto-options-list-color);
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
        }

        .ms-dropdownlist-option:hover {
            background-color: #bcddfc;
        }

        .ms-dropdownlist-option.selected {
            background-color: #d4d3d3;
            color: var(--psfx-texto-options-list-color);
        }

        .ms-dropdownlist-option-svg {
            display: none;
            color: var(--psfx-texto-color)
        }

        .ms-dropdownlist-option.selected .ms-dropdownlist-option-svg {
            display: block;
            margin-right: 5px;
        }

        .ms-dropdownlist-submenu {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(255, 255, 255, 0.9);
            border: 2px solid var(--psfx-borda-elemento-color);
            border-left: 0px;
            z-index: 9999;
            min-width: 150px; 
        }
        
        .ms-dropdownlist-submenu.show {
            display: block;
        }
        
        .ms-dropdownlist-submenu-option {
            padding: 3px;
            padding-left: 10px;
            cursor: pointer;
            color: black;
            font-size: 12px;
            border-bottom: 1px solid #ccc;
        }
        
        .ms-dropdownlist-submenu-option:hover {
            background-color: #60adf5; 
            color: white;
        }

        .ms-dropdownlist-divider {
            height: 1px;
            background-color: var(--psfx-borda-elemento-color-2);
            margin: 2px 0;
            pointer-events: none;
        }
        </style>
        
        <div class="ms-dropdownlist-container">
            <div class="ms-dropdownlist-text">${this.options[this._selectedIndex] || ''}</div>
            <span class="ms-dropdownlist-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="12">
                    <path d="M4,7.01a1,1,0,0,1,1.7055-.7055l3.289,3.286,3.289-3.286a1,1,0,0,1,1.437,1.3865l-.0245.0245L9.7,11.7075a1,1,0,0,1-1.414,0L4.7055,7.7155A1,1,0,0,1,4,7.01Z"></path>
                </svg>
            </span>
        </div>
        <div class="ms-dropdownlist-options">
            ${Array.from(this.children).map((child) => {
                if (child.tagName === 'MS-DIVIDER') {
                    return `<div class="ms-dropdownlist-divider"></div>`;
                }
                
                if (child.tagName === 'MS-ITEM') {
                    const text = child.textContent.trim();
                    const subitensAttr = child.getAttribute('subitem');
                    const subitens = subitensAttr ? JSON.parse(subitensAttr.replace(/'/g, '"')) : null;
                    
                    return `
                           <div class="ms-dropdownlist-option${this._selectedIndex === this.options.indexOf(text) ? ' selected' : ''}" data-index="${this.options.indexOf(text)}">
                            <span>${text}</span>
                            ${subitens ? `
                              <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="13">
                              <rect opacity="0" width="18" height="18" /><path class="ms-dropdownlist-indicador" d="M12,9a.994.994,0,0,1-.2925.7045l-3.9915,3.99a1,1,0,1,1-1.4355-1.386l.0245-.0245L9.5905,9,6.3045,5.715A1,1,0,0,1,7.691,4.28l.0245.0245,3.9915,3.99A.994.994,0,0,1,12,9Z" />
                             </svg>
                            ` : ''}
                            <svg xmlns="http://www.w3.org/2000/svg" class="ms-dropdownlist-option-svg" height="12" width="12" viewBox="0 0 16 16" fill="none">
                                <path class="fill" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0=0,15.656,3.8625Z"  fill="var(--psfx-texto-options-list-color)"/>
                            </svg>
                            ${subitens ? `
                                <div class="ms-dropdownlist-submenu">
                                    ${subitens.map((subitem, subindex) => `
                                        <div class="ms-dropdownlist-submenu-option" data-subindex="${subindex}">• ${subitem}</div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `;
                }
                return '';
            }).join('')}
        </div>
    `;
     
        // Resto do método render anterior (código de eventos de submenu)
        this.shadowRoot.querySelectorAll('.ms-dropdownlist-submenu-option').forEach(submenuOption => {
            submenuOption.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Subitem clicado:', submenuOption.textContent);
                
                const parentOption = submenuOption.closest('.ms-dropdownlist-option');
                const parentIndex = parseInt(parentOption.getAttribute('data-index'));
                const subitemIndex = parseInt(submenuOption.getAttribute('data-subindex'));
        
                const textDiv = this.shadowRoot.querySelector('.ms-dropdownlist-text');
                textDiv.textContent = submenuOption.textContent.replace(/•/g, '');
        
                this.dispatchEvent(new CustomEvent('optionSelected', {
                    detail: {
                        selectedIndex: parentIndex,
                        value: this.options[parentIndex],
                        subitem: submenuOption.textContent.replace(/•/g, ''),
                        subitemIndex: subitemIndex,
                        originalObject: this._originalObjects[parentIndex]
                    }
                }));
        
                const optionsContainer = this.shadowRoot.querySelector('.ms-dropdownlist-options');
                optionsContainer.style.display = 'none';
                this.shadowRoot.querySelectorAll('.ms-dropdownlist-submenu').forEach(sm => sm.classList.remove('show'));
            });
        });
        
        // Resto do código de eventos de opções com submenu
        this.shadowRoot.querySelectorAll('.ms-dropdownlist-option').forEach((optionEl, index) => {
            if (this._submenus[index]) {
                optionEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const submenu = optionEl.querySelector('.ms-dropdownlist-submenu');
                    
                    console.log('Submenu encontrado:', submenu);
        
                    if (!submenu) {
                        console.warn('Nenhum submenu encontrado para este item:', optionEl);
                        return;
                    }
        
                    const isVisible = submenu.classList.contains('show');
                    this.shadowRoot.querySelectorAll('.ms-dropdownlist-submenu').forEach(sm => sm.classList.remove('show'));
                    if (!isVisible) submenu.classList.add('show');
                });
            }
        });
    }
  
    attachEventListeners() {
        const container = this.shadowRoot.querySelector('.ms-dropdownlist-container');
        const textDiv = this.shadowRoot.querySelector('.ms-dropdownlist-text');
        const arrow = this.shadowRoot.querySelector('.ms-dropdownlist-arrow');
        const optionsContainer = this.shadowRoot.querySelector('.ms-dropdownlist-options');
 
        const toggleOptions = () => {
            if (this.hasAttribute('disabled')) return;
            optionsContainer.style.display = 
                optionsContainer.style.display === 'block' ? 'none' : 'block';
        };
 
        arrow.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleOptions();
        });
 
        textDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleOptions();
        });
 
        optionsContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            const submenuOptionElement = e.target.closest('.ms-dropdownlist-submenu-option');
            const optionElement = e.target.closest('.ms-dropdownlist-option');
      
            if (submenuOptionElement) {
                const parentOption = submenuOptionElement.closest('.ms-dropdownlist-option');
                const parentIndex = parseInt(parentOption.getAttribute('data-index'));
                const subitemIndex = Array.from(parentOption.querySelectorAll('.ms-dropdownlist-submenu-option')).indexOf(submenuOptionElement);
                const selectedSubitem = submenuOptionElement.textContent.trim();
                textDiv.textContent = selectedSubitem;
 
                this.dispatchEvent(new CustomEvent('optionSelected', {
                    detail: {
                        selectedIndex: parentIndex,
                        value: this.options[parentIndex],
                        subitem: selectedSubitem,
                        subitemIndex: subitemIndex,
                        originalObject: this._originalObjects[parentIndex]
                    }
                }));
 
                optionsContainer.style.display = 'none';
            } 
            else if (optionElement) {
                const options = this.shadowRoot.querySelectorAll('.ms-dropdownlist-option');
                options.forEach(opt => opt.classList.remove('selected'));
                optionElement.classList.add('selected');
 
                const index = parseInt(optionElement.getAttribute('data-index'));
                this.selectedIndex = index;
 
                this.dispatchEvent(new CustomEvent('optionSelected', {
                    detail: {
                        selectedIndex: index,
                        value: this.value,
                        originalObject: this._originalObjects[index]
                    }
                }));
 
                optionsContainer.style.display = 'none';
            }
        });
 
        document.addEventListener('click', (e) => {
            if (!this.contains(e.target) && !this.shadowRoot.contains(e.target)) {
                optionsContainer.style.display = 'none';
            }
        });
    }
 
    addOption(item, originalObject = null) {
        this._originalObjects.push(originalObject || item);
        this.options.push(item);
        
        const optionsContainer = this.shadowRoot.querySelector('.ms-dropdownlist-options');
        const newOptionIndex = this.options.length - 1;
        const newOptionElement = document.createElement('div');
        newOptionElement.className = 'ms-dropdownlist-option';
        newOptionElement.setAttribute('data-index', newOptionIndex);
    
        // Verificar se o objeto tem as propriedades 'icon' e 'color'
        if (originalObject && originalObject.icon && originalObject.color) {
            newOptionElement.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <ms-icon   id="btnIcone${newOptionIndex}"  icon="${originalObject.icon}"  size="13px"  color="${originalObject.color}"  style="margin-left: -5px; margin-right: 5px;"> </ms-icon>
                    ${item}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="ms-dropdownlist-option-svg" height="12" width="12" viewBox="0 0 16 16" fill="none">
                    <path class="fill" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0=0,15.656,3.8625Z"  fill="var(--psfx-texto-options-list-color)"/>
                </svg>
            `;
        } else {
            newOptionElement.innerHTML = `
                ${item}
                <svg xmlns="http://www.w3.org/2000/svg" class="ms-dropdownlist-option-svg" height="12" width="12" viewBox="0 0 16 16" fill="none">
                    <path class="fill" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0=0,15.656,3.8625Z"  fill="var(--psfx-texto-options-list-color)"/>
                </svg>
            `;
        }
    
        optionsContainer.appendChild(newOptionElement);
    }

    // Novo método para adicionar divisores em uma posição específica
    addDividerAt(index) {
        try {
            const optionsContainer = this.shadowRoot.querySelector('.ms-dropdownlist-options');
            const allElements = Array.from(optionsContainer.children);
    
            const newDivider = document.createElement('div');
            newDivider.className = 'ms-dropdownlist-divider';
    
            if (index >= 0 && index < allElements.length) {
                optionsContainer.insertBefore(newDivider, allElements[index]);
            } else {
                optionsContainer.appendChild(newDivider);
            }
        } catch (error) {}
        
    }


  
    updateSelected() {
        const textDiv = this.shadowRoot.querySelector('.ms-dropdownlist-text');
        const options = this.shadowRoot.querySelectorAll('.ms-dropdownlist-option');
    
        options.forEach((option) => {
            option.classList.remove('selected');
        });
    
        if (this._selectedIndex !== -1) {
            const selectedOption = options[this._selectedIndex];
            selectedOption.classList.add('selected');
    
            const selectedValue = this.options[this._selectedIndex];
            textDiv.textContent = selectedValue;
        } else {
           textDiv.textContent = '';
        }
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
        return this._selectedIndex !== -1 ? this.options[this._selectedIndex] : '';
    }
  
    disable() {
        this.setAttribute('disabled', 'true');
        const textDiv = this.shadowRoot.querySelector('.ms-dropdownlist-text');
        const setasvg = this.shadowRoot.querySelector('#seta');
        const bgseta = this.shadowRoot.querySelector('#bgSeta');
        const arrow = this.shadowRoot.querySelector('.ms-dropdownlist-arrow');
        const container = this.shadowRoot.querySelector('.ms-dropdownlist-container');
    
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
        const textDiv = this.shadowRoot.querySelector('.ms-dropdownlist-text');
        const setasvg = this.shadowRoot.querySelector('#seta');
        const bgseta = this.shadowRoot.querySelector('#bgSeta');
        const arrow = this.shadowRoot.querySelector('.ms-dropdownlist-arrow');
        const container = this.shadowRoot.querySelector('.ms-dropdownlist-container');
    
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
  
customElements.define('ms-dropdownlist', PSDropdownlist);

