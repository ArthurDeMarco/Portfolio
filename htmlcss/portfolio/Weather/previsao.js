const apiKey = "4e6331ca01ba169ea086d2c46ad8a45f";
const lang = "pt_br";
const units = "metric";


const cardEl = document.querySelector(".card")
const iconEl = document.querySelector(".icon")
const tempEl = document.querySelector("h2")
const feelsLikeEl = document.querySelector(".feels-like span")
const tempMinEl = document.querySelector(".min")
const tempMaxEl = document.querySelector(".max")
const humidityEl = document.querySelector(".humidity span")
const windImgEl = document.querySelector(".wind img")
const windTextEl = document.querySelector(".wind span")
const inputEl = document.querySelector(".input input")
const buttonEl = document.querySelector(".input button")

async function callApi () {
    try {
        const city = inputEl.value || "Curitiba";

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}&lang=${lang}`
        );
        
        const data = await response.json();
        
        // 1. Definição correta do ícone dinâmico
        const icon = data.weather[0].icon;
        iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        // 2. Preenchimento dos dados
        tempEl.innerHTML = Math.round(data.main.temp) + "°";
        feelsLikeEl.innerHTML = Math.round(data.main.feels_like) + "°";
        tempMinEl.innerHTML = Math.round(data.main.temp_min) + "°";
        tempMaxEl.innerHTML = Math.round(data.main.temp_max) + "°";
        humidityEl.innerHTML = data.main.humidity + "%";
        windTextEl.innerHTML = data.wind.speed.toLocaleString();

        // 3. Rotação da seta do vento
        windImgEl.style.transform = `rotate(${data.wind.deg}deg)`;

        cardEl.classList.add("active");
    } catch (err) {
        console.error("Erro na requisição:", err);
        cardEl.classList.remove("active");
        // O alerta só deve aparecer se não houver valor inicial ou se a busca falhar
        if (inputEl.value) alert("Cidade não encontrada.");
    }
}

buttonEl.addEventListener("click", callApi);

callApi();