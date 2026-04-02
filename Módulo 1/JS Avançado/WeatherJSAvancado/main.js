const apiKey = "4e6331ca01ba169ea086d2c46ad8a45f";
const lang = "pt_br";
const units = "metric";
const app = angular.module("weatherApp", [])

app.controller('WeatherController', function ($scope, $http) {

    $scope.cityName = "";
    $scope.city = "";
    $scope.cardActive = false;
    $scope.temperature = "";
    $scope.feelsLike = "";
    $scope.minTemperature = "";
    $scope.maxTemperature = "";
    $scope.humidity = "";
    $scope.windVelocity = "";
    $scope.windOrientation = "";
    $scope.iconUrl = "";
    $scope.searchQuery = "";
    $scope.backgroundStyle = {};

    $scope.callApi = async () => {
        const city = $scope.searchQuery || localStorage.getItem("city") || "São Paulo";

        const response = await $http.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}&lang=${lang}`
        );

        const data = response.data;

        console.log(data);
        const icon = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        $scope.temperature = Math.round(data.main.temp);
        $scope.feelsLike = Math.round(data.main.feels_like);
        $scope.minTemperature = Math.round(data.main.temp_min);
        $scope.maxTemperature = Math.round(data.main.temp_max);
        $scope.humidity = data.main.humidity.toLocaleString();
        $scope.windVelocity = data.wind.speed.toLocaleString();
        $scope.windOrientation = data.wind.deg;

        const bgUrl = `https://loremflickr.com/1920/1080/${encodeURIComponent(data.name)},landscape/all`;

        $scope.backgroundStyle = {
            'background-image': `url('${bgUrl}')`,
            'background-size': 'cover',
            'background-position': 'center',
            'background-attachment': 'fixed',
            'transition': '0.5s' // Suaviza a troca de imagem
        };

        $scope.cardActive = true;
        $scope.cityName = data.name;
        $scope.searchQuery = "";
        localStorage.setItem("city", data.name)
        $scope.$apply();
    };

    $scope.callApi();
});