const dexContainer = document.getElementById("dexContainer");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");


// carregar países

async function buscarPaises(termo = "") {

    const url = termo
        ? `https://restcountries.com/v3.1/name/${termo}`
        : `https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,languages,currencies`;

    try {

        const response = await fetch(url);

        const data = await response.json();

        data.sort((a, b) => a.name.common.localeCompare(b.name.common));

        renderizarCards(data);

    }

    catch {

        dexContainer.innerHTML =
            "<p class='text-center text-danger'>País não encontrado</p>";

    }

}



// criar cards

function renderizarCards(lista) {

    dexContainer.innerHTML = "";

    lista.forEach((pais, index) => {

        const nome = pais.name.common;

        const capital = pais.capital ? pais.capital[0] : "N/A";

        const card = document.createElement("div");

        card.className = "col";

        card.innerHTML = `

<div class="card text-center p-3 bg-light text-dark">

<img src="${pais.flags.png}">

<small class="text-muted mt-2">
#${(index + 1).toString().padStart(3, "0")}
</small>

<h6 class="fw-bold mt-1">${nome}</h6>

<span class="badge bg-primary">${pais.region}</span>

<button
class="btn btn-dark btn-sm mt-2"
onclick="verDetalhes('${nome}')">

Detalhes

</button>

</div>

`;

        dexContainer.appendChild(card);

    });

}



// mostrar detalhes

async function verDetalhes(nome) {
    const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(nome)}`);
    const data = await response.json();
    const pais = data[0];

    // Chama a troca de fundo
    mudarBackground(nome);

    // Tratamento dos dados para ficar "rico"
    const capital = pais.capital ? pais.capital.join(", ") : "N/A";
    const populacao = pais.population ? pais.population.toLocaleString("pt-BR") : "N/A";
    const regiao = pais.region || "N/A";
    
    // Tratamento de objetos complexos (Idiomas e Moedas)
    const idiomas = pais.languages ? Object.values(pais.languages).join(", ") : "N/A";
    const moedas = pais.currencies 
        ? Object.values(pais.currencies).map(m => `${m.name} (${m.symbol})`).join(", ") 
        : "N/A";

    document.getElementById("modalTitle").innerText = pais.name.common;
    
    document.getElementById("modalBody").innerHTML = `
        <img src="${pais.flags.png}" width="200" class="mb-3 shadow-sm">
        <div class="text-start">
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Região:</strong> ${regiao}</p>
            <p><strong>População:</strong> ${populacao} habitantes</p>
            <p><strong>Idiomas:</strong> ${idiomas}</p>
            <p><strong>Moeda:</strong> ${moedas}</p>
            <p><strong>Sub-região:</strong> ${pais.subregion || "N/A"}</p>
        </div>
    `;

    new bootstrap.Modal(document.getElementById("detailsModal")).show();
}


// mudar background

function mudarBackground(nome) {
    // Esta URL busca imagens de paisagens do país no Pexels/Pixabay via serviço simples
    const url = `https://loremflickr.com/1920/1080/${encodeURIComponent(nome)},landscape/all`;
    
    document.body.style.backgroundImage = `url("${url}")`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed"; // Mantém a imagem fixa ao rolar
}


// eventos

searchButton.addEventListener("click", () => {

    buscarPaises(searchInput.value);

});

searchInput.addEventListener("keypress", e => {

    if (e.key === "Enter") {

        buscarPaises(searchInput.value);

    }

});



// carregar ao abrir

buscarPaises();