// Weather Dashboard - OpenWeatherMap API
// Get a free API key at https://openweathermap.org/ and replace YOUR_API_KEY below

var API_KEY = "YOUR_API_KEY";

var locationInput = document.getElementById("location");
var btn = document.getElementById("btn");
var msg = document.getElementById("msg");
var weatherDiv = document.getElementById("weather");

function search() {
  var q = locationInput.value.trim();
  if (q === "") {
    msg.textContent = "Please enter a location (city name or postal code)";
    msg.className = "msg err";
    weatherDiv.style.display = "none";
    return;
  }

  weatherDiv.style.display = "none";

  // 1. Geocoding: convert location to lat and lon
  var geoUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + encodeURIComponent(q) + "&limit=1&appid=" + API_KEY;
  fetch(geoUrl)
    .then(function(res) {
      if (!res.ok) throw new Error("Request failed");
      return res.json();
    })
    .then(function(geoData) {
      if (!geoData || geoData.length === 0) {
        msg.textContent = "Location not found. Try another city or postal code.";
        msg.className = "msg err";
        return;
      }
      var lat = geoData[0].lat;
      var lon = geoData[0].lon;
      var locationName = geoData[0].name;

      // 2. Fetch current weather for that lat/lon
      var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + API_KEY;
      return fetch(weatherUrl).then(function(res) {
        if (!res.ok) throw new Error("Weather request failed");
        return res.json();
      }).then(function(weatherData) {
        // 3. Select only the data needed: name, temperature, weather description
        var name = weatherData.name;
        var temp = weatherData.main.temp;
        var description = weatherData.weather[0].description;

        // 4. Update the dashboard UI
        document.getElementById("locationName").textContent = name;
        document.getElementById("temp").textContent = Math.round(temp);
        document.getElementById("tempUnit").textContent = "C";
        document.getElementById("desc").textContent = description;
        msg.textContent = "";
        weatherDiv.style.display = "block";
      });
    })
    .catch(function(err) {
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        msg.textContent = "Network error. Check your connection and try again.";
      } else if (API_KEY === "YOUR_API_KEY") {
        msg.textContent = "Please add your OpenWeatherMap API key in script.js";
      } else {
        msg.textContent = "Something went wrong. Please try again.";
      }
      msg.className = "msg err";
    });
}

btn.onclick = search;
locationInput.onkeydown = function(e) {
  if (e.key === "Enter") search();
};
