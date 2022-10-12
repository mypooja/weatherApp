let apiKey = "1fdbaa9554b6e29131fb70def2d34397";
let lon, lat, city;

function handleButtonEvent(event) {
    event.preventDefault();
    forecastEl.innerHTML = "";
    city = searchInputTextEl.value;

    var queryGeoLocation = "http://api.openweathermap.org/geo/1.0/direct?q=" +
                           city + "&limit=1&appid=" + apiKey;
    
    fetch(queryGeoLocation)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        lat = data[0].lat;
        lon = data[0].lon;
        var queryWeather = "https://api.openweathermap.org/data/2.5/forecast?lat=" +
                         lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";


        fetch(queryWeather)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let weatherDate = new Date(data.list[0].dt_txt);
            for (i=0; i<data.list.length; i++) {
                if (weatherDate.getDate() === new Date(data.list[i].dt_txt).getDate()) {
                addWeather(weatherDate, data.list[i].main.temp, data.list[i].main.humidity,
                    data.list[i].weather[0].icon, data.list[i].wind.speed);

                var tempDay = new Date(weatherDate);
                weatherDate.setDate(tempDay.getDate() + 1);
                }
                
                              
            }
        });
      });
}

function addWeather(date, temp, humidity, icon, windspeed) {
    let weatherDiv = document.createElement("div");
    weatherDiv.className = "card";

    let m = moment(date);
    let dateP = document.createElement("p");
    dateP.textContent = m.format("MMM Do YY");

    let iconImg = document.createElement("img")
    iconImg.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

    let tempP = document.createElement("p");
    tempP.textContent = "Temp: " + temp + "F";

    let windspeedP = document.createElement("p");
    windspeedP.textContent = "Wind: " + windspeed + "MPH";

    let humidityP = document.createElement("p");
    humidityP.textContent = "Humidity: " + humidity + " %";

    weatherDiv.appendChild(dateP);
    weatherDiv.appendChild(iconImg);
    weatherDiv.appendChild(tempP);
    weatherDiv.appendChild(windspeedP);
    weatherDiv.appendChild(humidityP);

    forecastEl.appendChild(weatherDiv);
}

var searchInputTextEl = document.getElementById("search-input");

var buttonEl = document.getElementById("search-button");
buttonEl.addEventListener('click', handleButtonEvent);

var forecastEl = document.getElementById("forecast");