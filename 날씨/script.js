const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');

async function checkWeather(city){
    const api_key = "b3e69e64c21867fe1e5ddb524f67998a";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    try {
        const weather_data = await fetch(url).then(response => response.json());

        if(weather_data.cod === `404`){
            location_not_found.style.display = "flex";
            weather_body.style.display = "none";
            console.log("error");
            return;
        }

        console.log("run");
        location_not_found.style.display = "none";
        weather_body.style.display = "flex";
        temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
        description.innerHTML = `${weather_data.weather[0].description}`;
        humidity.innerHTML = `${weather_data.main.humidity}%`;
        wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

        getForecast(city); // 예보 정보 가져오기
    } catch (error) {
        console.log("날씨 데이터를 가져오는 중 에러 발생: ", error);
    }
}

async function getForecast(city) {
    const api_key = "b3e69e64c21867fe1e5ddb524f67998a";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}`;

    try {
        const forecastData = await fetch(url).then(response => response.json());

        const forecasts = forecastData.list.reduce((acc, forecast) => {
            const date = forecast.dt_txt.split(' ')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(forecast);
            return acc;
        }, {});

        const weatherBody = document.querySelector('.weather-body');
        const existingForecastContainer = document.querySelector('.forecast-container');

        if (existingForecastContainer) {
            existingForecastContainer.remove();
        }

        const forecastContainer = document.createElement('div');
        forecastContainer.classList.add('forecast-container', 'smaller');

        let count = 0;
        for (const date in forecasts) {
            if (count >= 6) {
                break;
            }

            const today = new Date().toLocaleDateString('en-US').split('/');
            const currentDate = `${today[2]}-${today[0].padStart(2, '0')}-${today[1].padStart(2, '0')}`;

            if (date !== currentDate) {
                const forecastBox = document.createElement('div');
                forecastBox.classList.add('forecast-box');

                const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

                const temperatures = forecasts[date].map(item => item.main.temp - 273.15);
                const averageTemp = (temperatures.reduce((sum, temp) => sum + temp, 0)) / temperatures.length;
                const roundedAvgTemp = Math.round(averageTemp);

                const weatherIcon = forecasts[date][0].weather[0].icon;
                const iconUrl = `http://openweathermap.org/img/w/${weatherIcon}.png`;

                const forecastInfo = `
                    <p>${day}</p>
                    <img src="${iconUrl}" alt="Weather Icon" style="width: 50px; height: 35px;">
                    <p>${roundedAvgTemp}°C</p>
                `;
                forecastBox.innerHTML = forecastInfo;
                forecastContainer.appendChild(forecastBox);

                count++;
            }
        }

        weatherBody.appendChild(forecastContainer);
    } catch (error) {
        console.log("날씨 예보 데이터를 가져오는 중 에러 발생: ", error);
    }
}

searchBtn.addEventListener('click', () => {
    const city = inputBox.value;
    checkWeather(city);
});