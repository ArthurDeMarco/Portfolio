    class CentralDeLuzes {
        static instancia;

        constructor() {
            if (CentralDeLuzes.instancia) {
                return CentralDeLuzes.instancia;
            }
            CentralDeLuzes.instancia = this;
        }

        static getInstance() {
            if (!CentralDeLuzes.instancia) {
                CentralDeLuzes.instancia = new CentralDeLuzes();
            }
            return CentralDeLuzes.instancia;
        }

        ligar(comodo) {
        const elemento = document.getElementById(comodo);
        if (elemento) {
            elemento.classList.add('ligada');
            console.log(`Luz do ${comodo} ligada`);
        }
    }

    desligar(comodo) {
        const elemento = document.getElementById(comodo);
        if (elemento) {
            elemento.classList.remove('ligada');
            console.log(`Luz do ${comodo} desligada`);
        }
    }
}

// Pegamos a nossa central única
const central = CentralDeLuzes.getInstance();

// Selecionamos todos os botões que têm o atributo data-comodo
const botoes = document.querySelectorAll('[data-comodo]');

botoes.forEach(botao => {
    botao.addEventListener('click', () => {
        const comodo = botao.dataset.comodo;
        const acao = botao.dataset.acao; // Podemos ter data-acao="ligar" ou "desligar"

        if (acao === "ligar") {
            central.ligar(comodo);
        } else {
            central.desligar(comodo);
        }
    });
});