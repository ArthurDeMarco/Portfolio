const form = document.getElementById('formValidacao');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o refresh da página

    // Definição das Regex
    const regexNome = /^[A-Za-zÀ-ÿ\s]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexCPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    // Função auxiliar para validar cada campo
    function validarCampo(id, regex) {
        const input = document.getElementById(id);
        const span = input.nextElementSibling; // Pega o span logo abaixo do input
        const valor = input.value;

        if (regex.test(valor)) {
            // Caso Válido
            input.style.borderColor = "green";
            span.textContent = "Válido ✅";
            span.style.color = "green";
            return true;
        } else {
            // Caso Inválido
            input.style.borderColor = "red";
            span.textContent = "Inválido ❌";
            span.style.color = "red";
            return false;
        }
    }

    // Executa a validação de todos
    const nomeValido = validarCampo('nome', regexNome);
    const emailValido = validarCampo('email', regexEmail);
    const cpfValido = validarCampo('cpf', regexCPF);

    if (nomeValido && emailValido && cpfValido) {
        console.log("Formulário pronto para envio!");
        // Aqui você poderia enviar os dados para um banco ou API
    }
});