angular.module('escolaApp')
.controller('AppController', function ($scope, UsuarioService) {
    
    $scope.mensagem = "Gestão Escolar - Sistema de Services";

    // Requisito: Listar os usuários no scope vindo do Service
    $scope.usuarios = UsuarioService.listar();

    // Modelo para o formulário
    $scope.novoUsuario = { nome: "", tipo: "Aluno" };

    // Requisito: Adicionar um novo usuário usando o Service
    $scope.adicionar = function () {
        if ($scope.novoUsuario.nome) {
            UsuarioService.adicionar($scope.novoUsuario);
            
            // Limpa o campo após adicionar
            $scope.novoUsuario.nome = "";
        } else {
            alert("Digite um nome para o cadastro.");
        }
    };

    // Requisito: Método remover(index) no controller que chama o service
    $scope.remover = function (index) {
        if (confirm("Deseja realmente remover este registro?")) {
            UsuarioService.remover(index);
        }
    };
});