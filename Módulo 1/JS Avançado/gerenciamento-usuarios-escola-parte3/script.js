const app = angular.module('escolaApp', []);

// Controller Principal (Pai)
app.controller('AppController', function ($scope) {
    $scope.mensagem = "Sistema de Gestão de Usuários";
});

// Novo Controller para a Listagem (Filho)
app.controller('ListaController', function ($scope) {
    // Array com os 5 usuários e datas reais
    $scope.usuarios = [
        { nome: "Arthur", tipo: "Aluno", dataCadastro: new Date() },
        { nome: "Ricardo", tipo: "Professor", dataCadastro: new Date(2025, 5, 15) },
        { nome: "Ana", tipo: "Aluno", dataCadastro: new Date(2026, 0, 10) },
        { nome: "Beatriz", tipo: "Professor", dataCadastro: new Date(2024, 11, 20) },
        { nome: "Carlos", tipo: "Aluno", dataCadastro: new Date() }
    ];

    $scope.novoUsuario = { nome: "", tipo: "Aluno" };

    $scope.adicionarUsuario = function () {
        if ($scope.novoUsuario.nome) {
            // Adicionamos a data atual no momento do clique
            $scope.novoUsuario.dataCadastro = new Date();

            // Colocamos no array
            $scope.usuarios.push(angular.copy($scope.novoUsuario));

            // Limpamos o formulário para a próxima entrada
            $scope.novoUsuario.nome = "";
            $scope.novoUsuario.tipo = "Aluno";
        } else {
            alert("Por favor, digite um nome!");
        }
    };

    $scope.removerUsuario = function (usuario) {
        // Encontramos a posição do usuário no array
        const index = $scope.usuarios.indexOf(usuario);

        // Se ele existir (index diferente de -1), removemos 1 item naquela posição
        if (index !== -1) {
            if (confirm("Tem certeza que deseja excluir " + usuario.nome + "?")) {
                $scope.usuarios.splice(index, 1);
            }
        }
    };
});
