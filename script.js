var cityInput = document.getElementById("city");
var btn = document.getElementById("btn");
var msg = document.getElementById("msg");
var weatherDiv = document.getElementById("weather");

function search() {
  var city = cityInput.value;
  city = city.trim();
  if (city === "") {
    msg.textContent = "Type a city name";
    msg.className = "msg err";
    weatherDiv.style.display = "none";
    return;
  }

  weatherDiv.style.display = "none";

  var geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1";
  fetch(geoUrl)
    .then(function(res) {
      return res.json();
    })
    .then(function(geoData) {
      if (!geoData.results || geoData.results.length === 0) {
        msg.textContent = "City not found";
        msg.className = "msg err";
        return;
      }
      var lat = geoData.results[0].latitude;
      var lon = geoData.results[0].longitude;
      var name = geoData.results[0].name;
      var country = geoData.results[0].country || geoData.results[0].country_code || "";
      if (country) name = name + ", " + country;

      var weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto";
      return fetch(weatherUrl).then(function(res) {
        return res.json();
      }).then(function(weatherData) {
        var cur = weatherData.current;
        if (!cur) {
          msg.textContent = "No data";
          msg.className = "msg err";
          return;
        }
        document.getElementById("cityName").textContent = name;
        document.getElementById("temp").textContent = Math.round(cur.temperature_2m);
        document.getElementById("weatherEmoji").textContent = getWeatherEmoji(cur.weather_code) + " (" + cur.weather_code + ")";
        document.getElementById("desc").textContent = weatherDesc(cur.weather_code);
        document.getElementById("hum").textContent = cur.relative_humidity_2m;
        document.getElementById("wind").textContent = cur.wind_speed_10m;
        msg.textContent = "";
        weatherDiv.style.display = "block";
      });
    })
    .catch(function() {
      msg.textContent = "Something went wrong try again";
      msg.className = "msg err";
    });
}

function weatherDesc(code) {
  if (code === 0) return "Clear";
  if (code >= 1 && code <= 3) return "Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Cloudy";
}

function getWeatherEmoji(code) {
  if (code === 0) return "\u2600";
  if (code >= 1 && code <= 3) return "\u2601";
  if (code >= 45 && code <= 48) return "\u2593";
  if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return "\u2614";
  if (code >= 71 && code <= 77 || code >= 85 && code <= 86) return "\u2744";
  if (code >= 95 && code <= 99) return "\u26C8";
  return "\u2601";
}

btn.onclick = search;
cityInput.onkeydown = function(e) {
  if (e.key === "Enter") search();
};
