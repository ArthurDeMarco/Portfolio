class Professor extends Usuario {
    constructor(nome, email, senha, materias) {
        super(nome, email, senha);
        this._materias = materias; // Note o nome da variável corrigido aqui
    }

    exibirPerfil() {
        return `Professor: ${this.getNome()} | Email: ${this.getEmail()} | Matérias: ${this._materias}`;
    }
}