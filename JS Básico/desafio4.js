const prompt = require("prompt-sync")();

let listaDeCompras = [];


function adicionarItem(listaDeCompras, nome) {
    listaDeCompras.push(nome)
}

function removerItem(lista, nome) {
    const index = lista.indexOf(nome);

    if (index === -1) {
        console.log("Item não encontrado.");
        return;
    }

    lista.splice(index, 1);
    console.log("Item removido com sucesso!");
}


function exibirLista(listaDeCompras) {
    if (listaDeCompras.length === 0) {
        console.log("A lista está vazia.");
        return;
    }

    for (let item of listaDeCompras) {
        console.log(item);
    }
}


while (true) {
    console.log("Adicionar um item.(1)")
    console.log("Remover um item.(2)")
    console.log("Exibir os itens.(3)")
    console.log("Sair do progama.(4)")

    let opcao = Number(prompt("Digite a opção o qual deseja executar: "));

    switch (opcao) {
        case 1:
            console.log("")
            let nomeAdicionar = prompt("Digite o nome do item que deseja adicionar: ")
            adicionarItem(listaDeCompras, nomeAdicionar);
            console.log("Item adicionado!")
            console.log("")
            break;
        case 2:
            console.log("")
            let nomeRemover = prompt("Digite o nome do produto que deseja remover: ")
            removerItem(listaDeCompras, nomeRemover);
            console.log("Item removido!")
            console.log("")
            break;
        case 3:
            console.log("")
            console.log("Lista de produtos:")
            exibirLista(listaDeCompras);
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