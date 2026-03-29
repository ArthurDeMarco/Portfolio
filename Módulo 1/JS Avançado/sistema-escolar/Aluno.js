class Aluno extends Usuario {
    constructor(nome, email, senha, turma) {
        super(nome, email, senha); // Passa os dados para o pai
        this._turma = turma;
    }

    // Sobrescrevendo o método (Polimorfismo)
    exibirPerfil() {
        return `Aluno: ${this.getNome()} | Email: ${this.getEmail()} | Turma: ${this._turma}`;
    }
}