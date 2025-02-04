var cadForm = document.getElementById("cad-usuario-form");

cadForm.addEventListener("submit", (e) => {
    
    e.preventDefault(); // não recarrega a pagina
    //Recebe os dados do formulário
    
    var nome_usuario = document.getElementById("nome_usuario").value;
    var email_usuario = document.getElementById("email_usuario").value;
    console.log(nome_usuario); 
    console.log(email_usuario);

    let usuarios = new Array(); //O Array() é usado para cirar um array de objetos

    if(localStorage.hasOwnProperty("usuarios")){
        // recupera os valores da propriedade usuarios do locaStorare
        // converte a string para objeto [{....}]
        usuarios = JSON.parse(localStorage.getItem("usuarios")); 
    }

    // adiciona um novo objeto no array criado
    usuarios.push({nome_usuario, email_usuario});
    // salva no localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    document.getElementById("conteudo").insertAdjacentHTML('beforeend', "Nome: " + nome_usuario + "<br>E-mail: " + email_usuario + "<br><hr>");
});

/// TUTORIAL AQUI: https://youtu.be/SOWUsAKvho4