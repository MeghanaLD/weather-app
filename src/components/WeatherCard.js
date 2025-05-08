import React from "react";

function WeatherCard({ weather, unit }) {
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const windDirection = (deg) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(deg / 45) % 8];
  };

  return (
    <div className="card">
      <h2>
        📍 {weather.name}, {weather.sys.country}
      </h2>
      <p className="main-desc">
        {weather.weather[0].main} - {weather.weather[0].description}
      </p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
        alt="weather icon"
        title="Weather Icon"
      />
      <p>
        🌡️ Temperature: {weather.main.temp} {tempUnit}
      </p>
      <p>
        🥵 Feels like: {weather.main.feels_like} {tempUnit}
      </p>
      <p>💧 Humidity: {weather.main.humidity}%</p>
      <p>
        🌬️ Wind: {weather.wind.speed} m/s {windDirection(weather.wind.deg)}
      </p>
    </div>
  );
}

export default WeatherCard;
