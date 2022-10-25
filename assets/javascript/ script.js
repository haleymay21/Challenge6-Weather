var apiKey = "a6be1a9b05d32cd56cf0dbc1b1e567cb";
var searchBtn = document.querySelector("#btn-search");
var city = "";
var forecast = document.querySelector("#forecast-cards");
var cityName = document.querySelector("#city-name");

// click function to get the city entered in input box and search it in apiURL //
searchBtn.onclick = function getCity() {
  forecast.className = "show";
  city = document.getElementById("search-city").value.trim();
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  document.getElementById("city-date").innerHTML = moment().format("L");

  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var weather = data;
      document.getElementById("city-name").innerHTML = weather.name;
      document.getElementById("temp").innerHTML =
        "Temperature: " + weather.main.temp;
      document.getElementById("humidity").innerHTML =
        "Humidity: " + weather.main.humidity;
      document.getElementById("wind").innerHTML =
        "Wind Speed: " + weather.wind.speed;

      var lat = weather.coord.lat;
      var lon = weather.coord.lon;
      var apiURL2 = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
      var apiURL3 = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      return fetch(apiURL2)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          var span = document.getElementById("uv");
          span.textContent = data.value;
          return fetch(apiURL3)
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
            });
        });
    });
};
