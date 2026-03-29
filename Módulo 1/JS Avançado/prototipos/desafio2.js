Array.prototype.meuForEach = function(callback) {
    for (let i = 0; i < this.length; i++) {
        callback(this[i], i, this);
    }  
}

[1, 2, 3].meuForEach(n => console.log("Number: ", n));

Array.prototype.meuMap = function(callback) {
    const novoArray = [];
    for (let i = 0; i < this.length; i++) {
        novoArray.push(callback(this[i], i, this));
    }
    return novoArray;
};

const dobrados = [1, 2, 3].meuMap(n => n * 2); 
console.log(dobrados); 

Array.prototype.meuFilter = function(callback) {
    const novoArray = [];
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            novoArray.push(this[i]);
        }
    }
    return novoArray;
};

const pares = [1, 2, 3, 4, 5, 6].meuFilter(n => n % 2 === 0);
console.log(pares); // [2, 4, 6]