import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";

function Weather() {
  const location = useLocation();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(true);
  const [shouldRedirectHome, setShouldRedirectHome] = useState(false);

  const query = new URLSearchParams(location.search);
  const city = query.get("city");
  const lat = query.get("lat");
  const lon = query.get("lon");

  const API_KEY = "28cd605d09233c617bcb847c6c96ce55";

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        let weatherUrl = "";
        if (city) {
          weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`;
        } else if (lat && lon) {
          weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
        } else {
          throw new Error("No location specified");
        }

        const weatherRes = await fetch(weatherUrl);
        if (!weatherRes.ok) throw new Error("City not found");
        const weatherData = await weatherRes.json();
        setWeatherData(weatherData);

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}&units=${unit}`
        );
        if (!forecastRes.ok) throw new Error("Forecast not found");
        const forecastData = await forecastRes.json();

        // Process forecast data to get one entry per day
        const dailyData = [];
        const map = new Map();
        for (let item of forecastData.list) {
          const date = item.dt_txt.split(" ")[0];
          if (!map.has(date)) {
            map.set(date, item);
          }
        }
        map.forEach((value) => dailyData.push(value));
        setForecastData(dailyData.slice(0, 3));
      } catch (err) {
        alert(err.message);
        setShouldRedirectHome(true); // Safe redirect
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, lat, lon, unit]);

  useEffect(() => {
    if (shouldRedirectHome) {
      navigate("/");
      setShouldRedirectHome(false);
    }
  }, [shouldRedirectHome, navigate]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  return (
    <div className="weather-page">
      <div className="top-bar">
        <button
          className="back-button"
          style={{ marginRight: "10px" }}
          onClick={() => navigate("/")}
        >
          🔙 Back
        </button>
        <button className="unit-button" onClick={toggleUnit}>
          {unit === "metric" ? "Switch to °F" : "Switch to °C"}
        </button>
      </div>
      {loading ? (
        <p>Loading weather...</p>
      ) : (
        <>
          <WeatherCard weather={weatherData} unit={unit} />
          <div className="forecast-container">
            {forecastData.map((forecast, index) => (
              <ForecastCard key={index} forecast={forecast} unit={unit} />
            ))}
          </div>
          <p className="date-time">{new Date().toLocaleString()}</p>
        </>
      )}
    </div>
  );
}

export default Weather;
