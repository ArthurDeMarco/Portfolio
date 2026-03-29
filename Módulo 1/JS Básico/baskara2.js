const a = 1;
const b = 2;
const c = 0;

    delta = Math.pow(b, 2) - 4 * a * c;

if (a == 0) {
    console.log("Nao se pode colocar um valor igual a zero")
} else if (delta < 0) {
    console.log("O delta nao pode ser menor que zero, isso resulta em nenhuma raiz real.")
} else if (delta == 0) {
    var x1 = (-b + Math.sqrt(delta)) / (2 * a);
    console.log("Existe apenas uma raiz: " + x1)
} else {
    var x1 = (-b + Math.sqrt(delta)) / (2 * a);
    var x2 = (-b - Math.sqrt(delta)) / (2 * a);
    console.log("Existem duas raizes reais: " + x1 + " " + x2)
}

