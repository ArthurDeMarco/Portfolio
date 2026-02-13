const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const listaUsuarios = [];

class Usuario {
    constructor(nome, idade, email) {
        this.nome = nome;
        this.idade = idade;
        this.email = email;
    }
}

function adicionarUsuario() {
    let quantidadeUsuarios = Number(prompt("Digite a quantidade de usuários que deseja adicinar: "));
    for (let i = 0; i < quantidadeUsuarios; i++) {
        let nomeUsuario = prompt("Digite o nome do usuário: ");
        let idadeUsuario = Number(prompt("Digite a idade do usuário: "));
        let emailUsuario = prompt("Digite o email do usuário: ");

        const index = listaUsuarios.findIndex(usuario => usuario.email === emailUsuario);

        if (index === -1) {
            const novoUsuario = new Usuario(nomeUsuario, idadeUsuario, emailUsuario);
            listaUsuarios.push(novoUsuario);
            console.log("Usuário adicionado com sucesso.");
        } else {
            console.log("Email já cadastrado, tente novamente.");
        }
    }
}

function removerUsuario() {
    let emailRemover = prompt("Digite o email do usuário que deseja remover: ");

    const index = listaUsuarios.findIndex(usuario => usuario.email === emailRemover);

    if (index === -1) {
        console.log("Usuário não encontrado.");
        return;
    }

    listaUsuarios.splice(index, 1);
    console.log("Usuário removido com sucesso!");
}


function exibirLista() {
    if (listaUsuarios.length === 0) {
        console.log("A lista está vazia.");
        return;
    }

    for (let usuario of listaUsuarios) {
        console.log(usuario);
    }
}


while (true) {
    console.log("Adicionar um novo usuário.(1)")
    console.log("Remover um usuário pelo email.(2)")
    console.log("Listar todos os usuários cadastrados.(3)")
    console.log("Sair do progama.(4)")

    let opcao = Number(prompt("Digite a opção o qual deseja executar: "));

    switch (opcao) {
        case 1:
            console.log("")
            adicionarUsuario();
            console.log("")
            break;
        case 2:
            console.log("")
            removerUsuario();
            console.log("")
            break;
        case 3:
            console.log("")
            console.log("Lista de usuarios:")
            exibirLista();
            console.log("")
            break;
        case 4:
            console.log("")
            console.log("Saindo...")
            process.exit();

        default:
            console.log("Opcão não disponível")
    }
}