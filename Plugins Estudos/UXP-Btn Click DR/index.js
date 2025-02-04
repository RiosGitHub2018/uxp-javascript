const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;

 var menu = document.querySelectorAll(".menu");
    if (document.addEventListener) {
      document.addEventListener('contextmenu', function(e) {
        menu[0].style.display = 'block';
        menu[0].style.marginLeft = e.clientX + 'px';
        menu[0].style.marginTop = e.clientY + 'px';
        e.preventDefault();
      }, false);
    } else {
      document.attachEvent('oncontextmenu', function() {
        menu[0].style.display = 'block';
        menu[0].style.marginLeft = e.clientX + 'px';
        menu[0].style.marginTop = e.clientY + 'px';
        window.event.returnValue = false;
      });
    }