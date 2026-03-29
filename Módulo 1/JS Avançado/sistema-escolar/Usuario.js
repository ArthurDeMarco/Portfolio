class Usuario {
    constructor(nome, email, senha) {
        this._nome = nome;
        this._email = email;
        this._senha = senha;
    }

    getNome() { return this._nome; }
    getEmail() { return this._email; }
    getSenha() { return this._senha; }

    exibirPerfil() {
        return `Nome: ${this.getNome()} | Email: ${this.getEmail()}`;
    }

    getNome() {
        return this._nome;
    }

    setNome(nome) {
        this._nome = nome;
    }

       getEmail() {
        return this._email;
    }

    setEmail(email) {
        this._email = email;
    }

       getSenha() {
        return this._senha;
    }

    setSenha(senha) {
        this._senha = senha;
    }

}
