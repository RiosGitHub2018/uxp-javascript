const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const fs = require('uxp').storage.localFileSystem;
const shell=require("uxp").shell;
const Constants = require('photoshop').constants;
const alert = app.showAlert;
const os = require('os') ;
const Usuario = os.homedir().replace(/\\/g, '/'); 
const photoshop = require("photoshop");
const imaging = photoshop.imaging;
const kSRGBProfile = "sRGB IEC61966-2.1";
anchorPos = require('photoshop').constants.AnchorPosition
const cpu = os.cpus()
const memoria = os.totalmem()


////// OUVITES DE EVENTOS
 iconBtns = document.querySelectorAll('.svg-icon')
 iconBtns[0].addEventListener("click", function(){
  alert("Icone 01 OK")
 });

 iconBtns[1].addEventListener("click", function(){
  alert("Icone 02 OK")
 });

  
  async function initSvgIcons() {
    const icons = document.querySelectorAll('.svg-icon');
        icons.forEach(async (element, index) => {
        // Adiciona um id dinâmico se não existir
        const id = element.id || `svg-icon-${index}`;
        element.id = id;
        
        const size = element.dataset.size || "20px";
        const icone = element.dataset.icon;
        const fill = element.dataset.fill || "#b8b8b8";
        
        const response = await fetch(`/icons/svg/${icone}.svg`);
        if (!response.ok) {
            throw new Error(`Failed to load icon: ${icone}`);
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
    });
}

// Inicializa todos os ícones com uma única chamada
initSvgIcons();