/*####################################################
#   Name:   weather.js
#   Usage:  fetch weather data from asked location, show symbol, weather descripition and temperature with voice. 
#           
#   Args: location="city name"
#
#   Date: 15.11.24
#   Author: jpeant
#####################################################*/


async function getCoordinatesForLocation(city) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city},Finland&format=json`);
      const data = await response.json();
      if (data.length > 0) {
        const location = data[0];
        return { lat: location.lat, lon: location.lon };
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
    return null;
  }
  
  async function fetchWeather(lat, lon, city) {
    try {
      const response = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`);
      const data = await response.json();
      const timeseries = data.properties.timeseries[0];
      const temperature = Math.round(timeseries.data.instant.details.air_temperature);
      const weatherSymbol = timeseries.data.next_1_hours.summary.symbol_code;
      const weatherDescription = getWeatherDescription(weatherSymbol);
  
      document.querySelector('.temperature').textContent = `${temperature}°C`;
      document.querySelector('.weather-icon').src = `https://raw.githubusercontent.com/metno/weathericons/89e3173756248b4696b9b10677b66c4ef435db53/weather/png/${weatherSymbol}.png`;
      document.querySelector('.weather-desc').textContent = weatherDescription;
  
      const message = `Paikassa ${city}, sää on tällä hetkellä: ${weatherDescription} Ja lämpötila on ${temperature} astetta`;
      responsiveVoice.speak(message, "Finnish Female", { rate: 0.8 });
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  }
  
  function getWeatherDescription(symbolCode) {
    const descriptionMapping = {
      "clearsky_day": "Kirkas päivä, eli taivas on pilvetön.",
      "clearsky_night": "Kirkas yö, eli taivas on pilvetön.",
      "cloudy": "Pilvinen, eli taivas on pilvien peittämä.",
      "fair_day": "Enimmäkseen selkeää päivä, eli aurinko paistaa runsaasti.",
      "fair_night": "Enimmäkseen selkeää yö, eli taivas on melkein pilvetön.",
      "fog": "Sumuinen, eli ilma on samea.",
      "heavyrain": "Rankkasadetta, sataa vettä paljon.",
      "heavyrainandthunder": "Rankka sadetta ja ukkosta, eli sataa vettä paljon ja ukkostaa.",
      "heavyrainshowers_day": "Rankkoja sadekuuroja, eli välillä sataa vettä paljon.",
      "heavyrainshowers_night": "Rankkoja sadekuuroja, eli välillä sataa vettä paljon.",
      "heavyrainshowersandthunder_day": "Rankkoja sadekuuroja ja ukkosta, eli välillä sataa vettä paljon ja ukkostaa.",
      "heavyrainshowersandthunder_night": "Rankkoja sadekuuroja ja ukkosta, eli välillä sataa vettä paljon ja ukkostaa.",
      "heavysleet": "Rankkaa räntäsadetta, eli sataa räntää paljon.",
      "heavysleetandthunder": "Rankkaa räntäsadetta ja ukkosta, eli sataa räntää ja ukkostaa.",
      "heavysleetshowers_day": "Rankkoja räntäkuuroja, eli välillä sataa räntää paljon.",                
      "heavysleetshowers_night": "Rankkoja räntäkuuroja, eli välillä sataa räntää paljon.",
      "heavysleetshowersandthunder_day": "Rankkoja räntäkuuroja ja ukkosta, eli välillä sataa räntää paljon ja ukkostaa.",
      "heavysleetshowersandthunder_night": "Rankkoja räntäkuuroja ja ukkosta, eli välillä sataa räntää paljon ja ukkostaa.",
      "heavysnow": "Rankkaa lumisadetta, eli sataa lunta paljon.",
      "heavysnowandthunder": "Rankkaa lumisadetta ja ukkosta, eli sataa lunta paljon ja ukkostaa.",
      "heavysnowshowers_day": "Rankkoja lumikuuroja, eli välillä sataa lunta paljon.",
      "heavysnowshowers_night": "Rankkoja lumikuuroja, eli välillä sataa lunta paljon.",
      "heavysnowshowersandthunder_day": "Rankkoja lumikuuroja ja ukkosta, eli välillä sataa lunta paljon ja ukkostaa.",
      "heavysnowshowersandthunder_night": "Rankkoja lumikuuroja ja ukkosta, eli välillä sataa lunta paljon ja ukkostaa.",
      "lightrain": "Kevyttä sadetta, eli sataa vettä vähän.",
      "lightrainandthunder": "Kevyttä sadetta ja ukkosta, eli vettä sataa ja ukkostaa.",
      "lightrainshowers_day": "Kevyitä sadekuuroja, eli sataa vettä vähän.",
      "lightrainshowers_night": "Kevyitä sadekuuroja, eli sataa vettä vähän.",
      "lightrainshowersandthunder_day": "Kevyitä sadekuuroja ja ukkosta, eli välillä sataa vettä vähän ja ukkostaa.",
      "lightrainshowersandthunder_night": "Kevyitä sadekuuroja ja ukkosta, eli välillä sataa vettä vähän ja ukkostaa.",
      "lightsleet": "Kevyttä räntäsadetta, eli sataa räntää vähän.",
      "lightsleetandthunder": "Kevyttä räntäsadetta ja ukkosta, eli välillä sataa räntää vähän ja ukkostaa.",
      "lightsleetshowers_day": "Kevyitä räntäkuuroja, eli välillä sataa räntää vähän.",
      "lightsleetshowers_night": "Kevyitä räntäkuuroja, eli välillä sataa räntää vähän.",
      "lightssleetshowersandthunder_day": "Kevyitä räntäkuuroja ja ukkosta, eli välillä sataa räntää vähän ja ukkostaa.",
      "lightssleetshowersandthunder_night": "Kevyitä räntäkuuroja ja ukkosta, eli välillä sataa räntää vähän ja ukkostaa.",
      "lightsnow": "Kevyttä lumisadetta, eli sataa lunta vähän.",
      "lightsnowandthunder": "Kevyttä lumisadetta ja ukkosta, eli välillä sataa lunta vähän ja ukkostaa.",
      "lightsnowshowers_day": "Kevyitä lumikuuroja, eli välillä sataa lunta vähän.",
      "lightsnowshowers_night": "Kevyitä lumikuuroja, eli välillä sataa lunta vähän.",
      "lightssnowshowersandthunder_day": "Kevyitä lumikuuroja ja ukkosta, eli välillä sataa lunta vähän ja ukkostaa.",
      "lightssnowshowersandthunder_night": "Kevyitä lumikuuroja ja ukkosta, eli välillä sataa lunta vähän ja ukkostaa.",
      "partlycloudy_day": "Puolipilvinen, eli aurinko paistaa ajoittain.",
      "partlycloudy_night": "Puolipilvinen, eli taivas on pilvinen ajoittain.",
      "rain": "Sateinen, eli sataa vettä.",
      "rainandthunder": "Sadetta ja ukkosta, eli sataa vettä ja ukkostaa.",
      "rainshowers_day": "Sadekuuroja, eli välillä sataa vettä.",
      "rainshowers_night": "Sadekuuroja, eli välillä sataa vettä.",
      "rainshowersandthunder_day": "Sadekuuroja ja ukkosta, eli välillä sataa vettä ja ukkostaa.",
      "rainshowersandthunder_night": "Sadekuuroja ja ukkosta, eli välillä sataa vettä ja ukkostaa.",
      "sleet": "Räntäsateinen, eli sataa räntää.",
      "sleetandthunder": "Räntäsadetta ja ukkosta, eli sataa räntää ja ukkostaa.",
      "sleetshowers_day": "Räntäsadekuuroja, eli välillä sataa räntää.",
      "sleetshowers_night": "Räntäsadekuuroja, eli välillä sataa räntää.",
      "sleetshowersandthunder_day": "Räntäkuuroja ja ukkosta, eli välillä sataa räntää ja ukkostaa.",
      "sleetshowersandthunder_night": "Räntäkuuroja ja ukkosta, eli välillä sataa räntää ja ukkostaa.",
      "snow": "Lumisateinen, eli sataa lunta.",
      "snowandthunder": "Lumisadetta ja ukkosta, eli sataa lunta ja ukkostaa.",
      "snowshowers_day": "Lumisadekuuroja, eli välillä sataa lunta.",
      "snowshowers_night": "Lumisadekuuroja, eli välillä sataa lunta.",
      "snowshowersandthunder_day": "Lumikuuroja ja ukkosta, eli välillä sataa lunta ja ukkostaa.",
      "snowshowersandthunder_night": "Lumikuuroja ja ukkosta, eli välillä sataa lunta ja ukkostaa.",
      "thunderstorm": "Ukkosmyrsky, eli ukkostaa."
    };
    return descriptionMapping[symbolCode] || "epäselvä";
  }
  
  async function init() {
    const city = getLocationFromUrl();
    document.querySelector('.loca').textContent = `Sää: ${city}`;
  
    const coordinates = await getCoordinatesForLocation(city);
    if (coordinates) {
      await fetchWeather(coordinates.lat, coordinates.lon, city);
    } else {
      document.querySelector('.lat').textContent = 'Koordinaatteja ei löydy';
    }
  }
  
  function getLocationFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('location') || 'Paikkakunta ei määritelty';
  }
  
  init();
