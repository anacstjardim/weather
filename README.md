# Weather Dashboard (W05)

A simple weather dashboard that shows current weather for a city. Uses the Open-Meteo API (https://open-meteo.com/).

https://anacstjardim.github.io/weather/

## What it does

- Enter a city name and click Search or press Enter
- Uses Open-Meteo Geocoding to get latitude and longitude, then fetches current weather
- Shows: location (city + country), temperature (C), emoji with weather code, description, humidity, wind speed
- Error messages if the city is not found or the request fails

## How to run

1. Open the project folder
2. Open `index.html` in your browser

## API

- **Geocoding:** `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1`
- **Weather:** `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=...`

## Files

- `index.html` – search input, message, weather result
- `style.css` – layout and styles
- `script.js` – geocoding, weather fetch, UI update, error handling

## Tech

- HTML5, CSS3, JavaScript
