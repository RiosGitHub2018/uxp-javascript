try {
    const app = require("photoshop").app;
    const action = require("photoshop").action;
    const core = require("photoshop").core;
    alert = app.showAlert;
    
    D11dlg= document.querySelector("#testDialog")
    document.querySelector("#bt1").addEventListener( "click", async () =>{
            D11dlg.show({title: "Modal window", resize: "both",size: {  width: 250, height: 100}})
            D11dlg.addEventListener('load', evt => {
            setTimeout(() =>{ document.getElementById('et01').focus();}, 150)
            });
            document.getElementById('et01').value=1
        }
    );
          
    
    //////// ALTERAR O VALOR DA BODA
    document.addEventListener("keydown", handleEnterKey);
    async function handleEnterKey(e) {
    if (e.keyCode === 38) {
        BordaSizec = document.querySelector("#et01")
        BordaSizec.value =Number( BordaSizec.value)+1
    } /// BORDA +
    if (e.keyCode === 40) {
          BordaSizec.value =Number( BordaSizec.value)-1
    } /// BORDA -

    if (e.keyCode === 13) {
        alert("Process")
    } /// BORDA -



    }

} catch (error) {alert(error)}