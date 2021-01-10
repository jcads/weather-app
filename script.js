const form = document.querySelector("form");
const button = document.querySelector("button");
const searchIcon = document.querySelector(".fa-search");
button.addEventListener("click", handleClick);
searchIcon.addEventListener("click", handleClick);

// based on weather id
const weatherIcon = {
  2: "wu-tstorms",
  3: "wu-chancerain",
  5: "wu-rain",
  6: "wu-snow",
  7: "wu-hazy",
  8: "wu-cloudy",
  9: "wu-clear"
};

async function getWeatherData(city) {
  const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=be1b6339eebe391c30c07d12a933e795`, {mode: 'cors'});

  if (response.status === 400 || response.status === 404) {
    return;
  } else {
    const data = await response.json();

    const weather = {
      id: data.weather[0].id,
      desc: data.weather[0].description,
      main: data.weather[0].main,
      country: data.sys.country,
      mainTemp: {
        f: KtoFahrenheit(data.main.temp),
        c: KtoCelsius(data.main.temp)
      },
      temps: {
        feelsLike: {
          f: KtoFahrenheit(data.main.feels_like),
          c: KtoCelsius(data.main.feels_like)
        }
      },
      humidity: data.main.humidity, 
      city: data.name.toUpperCase()
    };
    
    return weather;
  }
}

function displayWeatherDeets(weather) { 
  if (weather) {
    const location = document.querySelector(".location");
    const description = document.querySelector(".description span");
    const feelsLike = document.querySelector(".feelsLike span");
    const humidity = document.querySelector(".humidity span");
    const temp = document.querySelector(".condition h1");

    location.innerHTML = `${weather.city}, ${weather.country}`;
    description.innerHTML = weather.desc;
    feelsLike.innerHTML = weather.temps.feelsLike.c;
    humidity.innerHTML = weather.humidity;
    temp.innerHTML = `${weather.mainTemp.c} &#176;C`;
    displayWeatherIcon(weather.id);
  } else throwErrMsg();
}

function displayWeatherIcon(id) {
  id = (id == 800 ? 9 : Math.floor(id / 100));
  const icon = document.querySelector(".condition i");
  const classLen = icon.classList.length;
  const oldIcon = icon.classList[classLen - 1];
  const newIcon = weatherIcon[id];

  icon.classList.replace(oldIcon, newIcon);
}

async function handleClick(e) {
  e.preventDefault();
  let city = document.querySelector("#city").value;
  let weather = await getWeatherData(city);
  displayWeatherDeets(weather);
  form.reset();
}

function KtoCelsius(kelvinTemp) {
  return Math.round(kelvinTemp - 273.15); 
}

function KtoFahrenheit(kelvinTemp) {
  return Math.round((kelvinTemp - 1.8) - 459.97)
}

function throwErrMsg() {
  console.log("error");
}




