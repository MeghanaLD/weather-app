import React from "react";

function ForecastCard({ forecast, unit }) {
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const date = new Date(forecast.dt * 1000);
  const day = date.toLocaleDateString(undefined, { weekday: "long" });
  const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

  return (
    <div className="forecast-card">
      <h3>{day}</h3>
      <img src={iconUrl} alt={forecast.weather[0].description} />
      <p>{forecast.weather[0].main}</p>
      <p>
        🌡️ {forecast.main.temp} {tempUnit}
      </p>
      <p>💧 {forecast.main.humidity}% humidity</p>
      <p>🌬️ {forecast.wind.speed} m/s wind</p>
    </div>
  );
}

export default ForecastCard;
