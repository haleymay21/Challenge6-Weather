var apiKey = "a6be1a9b05d32cd56cf0dbc1b1e567cb";
var searchBtn = document.querySelector("#btn-search");
var city = "";
var forecast = document.querySelector("#forecast-cards");
var uvIndex = document.querySelector("#uvIndex");
var cityName = document.querySelector("#city-name");
var historyArray = JSON.parse(localStorage.getItem("history")) || [];

// creates history buttons when city is searched //
function makeButtons(cityName) {
  var newButton = document.createElement("button");
  newButton.textContent = cityName;
  newButton.setAttribute("class", "historyBtns");
  newButton.addEventListener("click", function () {});

  $(".history").append(newButton);
}

// clearing local storage and deleting history buttons with clear button //
for (var i = 0; i < historyArray.length; i++) {
  makeButtons(historyArray[i]);
}

$("#btn-clear").on("click", function () {
  $(".history").empty();
  localStorage.clear();
});

// click function to grab city entered in input box, search it in apiURL, and show hidden boxes//
searchBtn.onclick = function getCity() {
  forecast.className = "show";
  uvIndex.className = "show";
  // creates the value for city to use in api url //
  city = document.getElementById("search-city").value.trim();
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  // using moment to show current date in top column and next 5 dates in each forecast card //
  document.getElementById("city-date").innerHTML = moment().format("L");
  makeButtons(city);
  historyArray.push(city);
  localStorage.setItem("history", JSON.stringify(historyArray));
  // first api fetch request //
  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var weather = data;
      // inserts current weather info into html for top column //
      document.getElementById("city-name").innerHTML = weather.name;
      document.getElementById("temp").innerHTML =
        "Temperature: " + weather.main.temp;
      document.getElementById("humidity").innerHTML =
        "Humidity: " + weather.main.humidity;
      document.getElementById("wind").innerHTML =
        "Wind Speed: " + weather.wind.speed;
      $("#icon1").empty();
      var icon1 = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
      );
      $("#icon1").append(icon1);

      // sets variables to use in next 2 api URLs //
      var lat = weather.coord.lat;
      var lon = weather.coord.lon;
      // api url for UV index //
      var apiURL2 = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
      // api URL for 5 day forecast //
      var apiURL3 = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

      // fetch request for UV index //
      return fetch(apiURL2)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // sets uv index into html//
          var span = document.getElementById("uv");
          span.textContent = data.value;

          // fetch request for 5 day forecast
          return fetch(apiURL3)
            .then((response) => response.json())
            .then((data) => {
              // console.log(data);
              $("#5DayForecast").empty();
              for (var i = 4; i < data.list.length; i += 8) {
                console.log(data.list[i]);
                var forecastCard = $("<div>").addClass("col card future");
                var date = $("<p>")
                  .addClass("date")
                  .text(moment.unix(data.list[i].dt).format("l"));
                var temp = $("<p>")
                  .addClass("temp")
                  .text("temp: " + data.list[i].main.temp);
                var humidity = $("<p>")
                  .addClass("humidity")
                  .text("humidity: " + data.list[i].main.humidity);
                var wind = $("<p>")
                  .addClass("wind")
                  .text("wind speed: " + data.list[i].wind.speed + " mph");
                var icon = $("<img>").attr(
                  "src",
                  "http://openweathermap.org/img/w/" +
                    data.list[i].weather[0].icon +
                    ".png"
                );
                forecastCard.append(date, icon, temp, humidity, wind);
                $("#5DayForecast").append(forecastCard);
              }
            });
        });
    });
};
