const { entrypoints } = require("uxp");

document.getElementById("show-dialog").addEventListener("click", () => {
  const dialog = document.createElement("dialog");
  document.appendChild(dialog);
  const resizeButton = document.createElement("div");
  resizeButton.innerText = "Click to resize";

  resizeButton.style.color="#ffffff"
  resizeButton.style.backgroundColor="#405e8b"
  resizeButton.style.height="30px"

  resizeButton.addEventListener("click", () => { toggleDisabled() ;});




    toggleDisabledAtivado = true;
    function toggleDisabled() {
        if (toggleDisabledAtivado) {
          dialog.resizeTo( 200, 600 );  toggleDisabledAtivado = false;
        } else {
          dialog.resizeTo( 200, 200 );  toggleDisabledAtivado = true;
        };
    };



  dialog.appendChild(resizeButton);
  dialog.show({ "size": {"width": 200, "height": 200 }
  });
  dialog.style.height="200px"

});