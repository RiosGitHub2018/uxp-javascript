// Receber o seletor do formulário
var cadForm = document.getElementById("cad-usuario-form");

// Aguardar o usuário clicar no botão cadastrar do formulário
cadForm.addEventListener("submit", (e) => {

    // Não recarregar a página
    e.preventDefault();

    // Receber os dados do formulário
    var nome_usuario = document.getElementById("nome_usuario").value;
    var email_usuario = document.getElementById("email_usuario").value;
    console.log(nome_usuario);
    console.log(email_usuario);

    // O Array() é usado para criar Array de objetos
    let usuarios = new Array();

    // Verifica se a propriedade no localStorage
    if(localStorage.hasOwnProperty("usuarios")){
        // Recuperar os valores da propriedade usuarios do localStorage
        // Converte de String para Object
        usuarios = JSON.parse(localStorage.getItem("usuarios"));
    }

    // Adiciona um novo objeto no array criado
    usuarios.push({nome_usuario, email_usuario});

    // Salva no localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    document.getElementById("conteudo").insertAdjacentHTML('beforeend', "Nome: " + nome_usuario + "<br>E-mail: " + email_usuario + "<br><hr>");
});

/// TUTORIAL AQUI: https://youtu.be/SOWUsAKvho4