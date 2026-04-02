angular.module('escolaApp')
.service('UsuarioService', function() {
    
    // Requisito: Array privado de usuarios
    var usuarios = [
        { nome: "Arthur", tipo: "Aluno", dataCadastro: new Date() },
        { nome: "Ricardo", tipo: "Professor", dataCadastro: new Date() }
    ];

    // Requisito: Método listar()
    this.listar = function() {
        return usuarios;
    };

    // Requisito: Método adicionar(usuario)
    this.adicionar = function(usuario) {
        var copia = angular.copy(usuario);
        copia.dataCadastro = new Date();
        usuarios.push(copia);
    };

    // Requisito: Método remover(index)
    this.remover = function(index) {
        usuarios.splice(index, 1);
    };
});