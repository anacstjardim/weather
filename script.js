function search() {
  var city = document.getElementById("city").value;
  city = city.trim();
  if (city === "") {
    document.getElementById("msg").innerHTML = "Type a city name first";
    document.getElementById("msg").className = "msg err";
    document.getElementById("weather").style.display = "none";
    return;
  }

  document.getElementById("weather").style.display = "none";

  var url1 = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1";
  fetch(url1)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (!data.results || data.results.length === 0) {
        document.getElementById("msg").innerHTML = "City not found";
        document.getElementById("msg").className = "msg err";
        return;
      }
      var lat = data.results[0].latitude;
      var lon = data.results[0].longitude;
      var name = data.results[0].name;
      var country = data.results[0].country || data.results[0].country_code || "";
      if (country) name = name + ", " + country;

      var url2 = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto";
      fetch(url2)
        .then(function(response) {
          return response.json();
        })
        .then(function(data2) {
          var cur = data2.current;
          if (!cur) {
            document.getElementById("msg").innerHTML = "No data";
            document.getElementById("msg").className = "msg err";
            return;
          }
          document.getElementById("cityName").innerHTML = name;
          document.getElementById("temp").innerHTML = Math.round(cur.temperature_2m);
          document.getElementById("weatherEmoji").innerHTML = getEmoji(cur.weather_code) + " (" + cur.weather_code + ")";
          document.getElementById("desc").innerHTML = getDesc(cur.weather_code);
          document.getElementById("hum").innerHTML = cur.relative_humidity_2m;
          document.getElementById("wind").innerHTML = cur.wind_speed_10m;
          document.getElementById("msg").innerHTML = "";
          document.getElementById("msg").className = "msg";
          document.getElementById("weather").style.display = "block";
        });
    })
    .catch(function() {
      document.getElementById("msg").innerHTML = "Something went wrong try again";
      document.getElementById("msg").className = "msg err";
    });
}

function getDesc(code) {
  if (code === 0) return "Clear";
  if (code >= 1 && code <= 3) return "Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Cloudy";
}
//getting emojis on just to make Jason happy
function getEmoji(code) {
  if (code === 0) return "\u2600";
  if (code >= 1 && code <= 3) return "\u2601";
  if (code >= 45 && code <= 48) return "\u2593";
  if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return "\u2614";
  if (code >= 71 && code <= 77 || code >= 85 && code <= 86) return "\u2744";
  if (code >= 95 && code <= 99) return "\u26C8";
  return "\u2601";
}
