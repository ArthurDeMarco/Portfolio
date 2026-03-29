const app = angular.module('escolaApp', []);

app.controller('AppController', function($scope) {
    
    // Variável simples
    $scope.mensagem = "Bem-vindo ao sistema de cadastro escolar";

    // Objeto usuário
    $scope.usuario = {
        nome: "João",
        tipo: "Aluno"
    };

    // A função PRECISA estar aqui dentro
    $scope.alternarUsuario = function() {
        if ($scope.usuario.tipo === "Aluno") {
            $scope.usuario = { nome: "Dr. Ricardo", tipo: "Professor" };
        } else {
            $scope.usuario = { nome: "João", tipo: "Aluno" };
        }
    };

    // A listagem PRECISA estar aqui dentro
    $scope.materias = ["JavaScript", "AngularJS", "HTML5", "CSS3"];

}); 