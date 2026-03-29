const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let numeroAleatorio = Math.floor(Math.random() * 100) + 1;
let contador = 0;

function perguntar() {
  rl.question(
    'Tente adivinhar o valor do número aleatório (1 a 100): ', (entrada) => {
      let num = Number(entrada);
      contador++;

      if (num > numeroAleatorio) {
        console.log("O número digitado é maior que o número aleatório!");
        perguntar();
      } else if (num < numeroAleatorio) {
        console.log("O número digitado é menor que o número aleatório!");
        perguntar();
      } else {
        console.log("Você acertou em " + contador + " tentativas!");
        rl.close();
      }
    }
  );
}

perguntar();
