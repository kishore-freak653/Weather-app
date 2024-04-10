import { useState, useEffect } from "react";
import "./App.css";

/*  Images */
import SearchIcon from "./assets/search (3).png";
import ClearSunnyIcon from "./assets/shiny.jpg";
import CloudyIcon from "./assets/Cloudy.png";
import RainyIcon from "./assets/Rainygif.gif";
import DrizzleIcon from "./assets/Drizzle.png";
import WindyIcon from "./assets/WINDY.gif";
import HumidityIcon from "./assets/Humi.png";
import SnowIcon from "./assets/SNow.png";
import StormIcon from "./assets/storm.png";
import LoadingGif from "./assets/LOADING.gif";

function WeatherDetails({
  icon,
  temp,
  city,
  country,
  lat,
  log,
  wind,
  humidity,
}) {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Weather Icon" />
      </div>
      <div className="temp">{temp}℃</div>
      <div className="Location">{city}</div>
      <div className="Country">{country}</div>
      <div className="coordinates">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">Longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={HumidityIcon} alt="Humidity Icon" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={WindyIcon} alt="Windy Icon" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind}km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  const [text, setText] = useState("ALASKA");
  const [icon, setIcon] = useState(SnowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("ALASKA");
  const [country, setCountry] = useState("US");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(null); // Initialize with null instead of undefined
  const [wind, setWind] = useState(null); // Initialize with null instead of undefined
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": ClearSunnyIcon,
    "01n": ClearSunnyIcon,
    "02d": CloudyIcon,
    "02n": CloudyIcon,
    "03d": DrizzleIcon,
    "03n": DrizzleIcon,
    "04d": DrizzleIcon,
    "04n": DrizzleIcon,
    "09d": RainyIcon,
    "09n": RainyIcon,
    "10d": RainyIcon,
    "10n": RainyIcon,
    "11n": SnowIcon,
    "11d": SnowIcon,
    "13d": SnowIcon,
    "13n": SnowIcon,
    "15n": StormIcon,
  };

  const search = async () => {
    setLoading(true);

    let api_key = "f839d5abe92736d9b6e1c84017afe90d";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (data.cod === "404") {
        console.error("City Not Found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main?.humidity);
      setWind(data.wind?.speed);
      setTemp(Math.floor(data.main?.temp));
      setCity(data.name);
      setCountry(data.sys?.country);
      setLat(data.coord?.lat);
      setLog(data.coord?.lon);

      if (data.weather && data.weather.length > 0) {
        const weatherIconCode = data.weather[0].icon;
        setIcon(weatherIconMap[weatherIconCode] || SunnyIcon); // Set default icon if not found in the map
      } else {
        console.error("Weather data not available");
        // Set a default icon or handle this scenario as needed
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError(
        "An Error Occurred While Fetching Weather Data: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon" onClick={search}>
            <img src={SearchIcon} alt="Search" />
          </div>
        </div>

        {loading && (
          <div className="Loading-message">
            <img src={LoadingGif} alt="Loading..." />
            LOADING....
          </div>
        )}

        {error && <div className="Error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not Found</div>}

        {!loading && !cityNotFound && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            log={log}
            humidity={humidity}
            wind={wind}
          />
        )}
        <p className="copyright">
          Designed by <span>Kishore</span>
        </p>
      </div>
    </>
  );
}

export default App;
