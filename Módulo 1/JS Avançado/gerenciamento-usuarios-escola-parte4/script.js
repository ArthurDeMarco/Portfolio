angular.module('escolaApp')
.controller('AppController', function($scope, UsuarioService) {
    
    $scope.usuarios = UsuarioService.listar();
    $scope.novoUsuario = { nome: "", email: "", tipo: "Aluno" };
    $scope.carregando = false; // Controle do loading

    $scope.salvar = function() {
        $scope.carregando = true; // Começa a "animação"

        // Chama o service que retorna a Promise
        UsuarioService.salvar($scope.novoUsuario)
            .then(function(mensagem) {
                alert(mensagem);
                // Limpa o formulário
                $scope.novoUsuario = { nome: "", email: "", tipo: "Aluno" };
                // Reseta o estado do formulário no Angular (limpa os erros)
                $scope.userForm.$setUntouched();
            })
            .finally(function() {
                $scope.carregando = false; // Para o loading, independente de erro ou sucesso
            });
    };
});