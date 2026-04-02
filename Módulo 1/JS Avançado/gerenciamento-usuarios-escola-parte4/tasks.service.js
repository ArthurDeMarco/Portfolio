angular.module('escolaApp')
.service('UsuarioService', function($q, $timeout) { // Injetamos $q e $timeout
    var usuarios = [];

    this.listar = function() { return usuarios; };

    this.salvar = function(usuario) {
        var defer = $q.defer(); // Cria a "promessa"

        // Simula o atraso da API (2 segundos)
        $timeout(function() {
            var copia = angular.copy(usuario);
            copia.dataCadastro = new Date();
            usuarios.push(copia);

            defer.resolve("Usuário cadastrado com sucesso!"); // Promessa cumprida!
        }, 2000);

        return defer.promise; 
    };
});