const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Digite o valor do produto: ', (a) => {
    rl.question('O produto possui desconto? (s/n): ', (b) => {

        a = Number(a);
        b = b.toLowerCase();

        let desconto = 10; // desconto fixo
        let min = 12;
        let max = 25;

        let ICMS = Math.floor(Math.random() * (max - min + 1)) + min;

        let novoValor;
        let valorImposto;
        let valorSemImposto;

        if (b === 's') {
            novoValor = a - (a * desconto / 100);
            valorImposto = novoValor + (novoValor * ICMS / 100);

            console.log("O valor do produto original é:", a);
            console.log("Desconto aplicado:", desconto + "%");
            console.log("Valor com desconto:", novoValor);
            console.log("Valor após desconto + imposto:", valorImposto);
            console.log("O valor do ICMS é: " + ICMS);
        } else {
            valorSemImposto = a + (a * ICMS / 100);
            console.log("O valor do produto original é:", a);
            console.log("Valor após imposto:", valorSemImposto);
            console.log("O valor do ICMS é: " + ICMS);
        }

        rl.close();
    });
});
