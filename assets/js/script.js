let apiKey = "1fdbaa9554b6e29131fb70def2d34397";
let lon, lat, city;

/*Handles Search button click*/
function handleButtonEvent(event) {
    event.preventDefault();
    city = searchInputTextEl.value;
    addCityToLocalStorage(city);
    displayCityWeather(city);
    displayPreviousCities();
}

/*Displays 5 day forecast of the input city*/
function displayCityWeather(city) {
    forecastEl.innerHTML = "";

    var queryGeoLocation = "https://api.openweathermap.org/geo/1.0/direct?q=" +
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

/*Adds weather elements (icon, temp, wind, humidity) in the div for a day*/
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

/*Adds city name to the local storage if not already present in the local storage*/
function addCityToLocalStorage(city) {
    var cityArray = [city];
    var localStorageArray = JSON.parse(localStorage.getItem("cityList"));
    if (localStorageArray) {
        var isCityAlreadyPresentInLocalStorage = localStorageArray.includes(city);
        if (isCityAlreadyPresentInLocalStorage) {
            return;
        }
        cityArray = cityArray.concat(localStorageArray);
    }
    localStorage.setItem("cityList", JSON.stringify(cityArray));
}

/*Displays previously saved cities from the local storage*/
function displayPreviousCities() {
    var localStorageArray = JSON.parse(localStorage.getItem("cityList"));

    if (localStorageArray) {
        previousCitiesEl.innerHTML = "";
        for (i=0; i<localStorageArray.length; i++) {
            let cityP = document.createElement("p");
            cityP.className = "city";
            cityP.textContent = localStorageArray[i];
            previousCitiesEl.appendChild(cityP);
        }
    }
    
}

/*Handles click event on a previously saved city*/
function handleClickOnPreviousCity(event) {
    displayCityWeather(event.target.textContent);
}

var searchInputTextEl = document.getElementById("search-input");

var buttonEl = document.getElementById("search-button");
buttonEl.addEventListener('click', handleButtonEvent);

var forecastEl = document.getElementById("forecast");

var previousCitiesEl = document.getElementById("previousCities");

previousCitiesEl.addEventListener('click', handleClickOnPreviousCity);

displayPreviousCities();