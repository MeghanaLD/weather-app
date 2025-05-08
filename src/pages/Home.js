import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBox from "../components/SearchBox";

function Home() {
  const navigate = useNavigate();
  const [recentCities, setRecentCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityError, setCityError] = useState(false); // Flag for failed city

  const API_KEY = "28cd605d09233c617bcb847c6c96ce55";

  useEffect(() => {
    const storedCities = JSON.parse(localStorage.getItem("recentCities")) || [];
    setRecentCities(storedCities);
  }, []);

  useEffect(() => {
    if (cityError) {
      // Navigate safely after render
      navigate("/");
      setCityError(false);
    }
  }, [cityError, navigate]);

  const handleCityClick = async (city) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      if (!res.ok) {
        throw new Error("City not found");
      }
      await res.json();
      navigate(`/weather?city=${city}`);
    } catch (err) {
      alert("City not found. Please check.");
      setCityError(true); // Triggers safe navigation in useEffect
    } finally {
      setLoading(false);
    }
  };
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          // Navigate to Weather page with lat/lon in query
          navigate(`/weather?lat=${lat}&lon=${lon}`);
        },
        (error) => {
          alert("Failed to retrieve location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const deleteCity = (city) => {
    const updatedCities = recentCities.filter((item) => item !== city);
    setRecentCities(updatedCities);
    localStorage.setItem("recentCities", JSON.stringify(updatedCities));
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="welcome-text">🌤️ Welcome to WeatherVista</h1>
        <div style={{ textAlign: "center" }}>
          <p className="tagline">
            Discover the weather around the world instantly!
          </p>
          <SearchBox />
          <button className="location-button" onClick={handleUseMyLocation}>
            📍 Use Current Location
          </button>
          {loading && <div className="loading">Loading...</div>}

          {recentCities.length > 0 && (
            <div className="recent-cities">
              <h3>Recently Searched:</h3>
              <div
                className="city-buttons"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                {recentCities.map((city, index) => (
                  <div
                    key={index}
                    className="city-item"
                    style={{
                      background: "#007bff",
                      color: "white",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "250px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCityClick(city)}
                  >
                    <span style={{ flexGrow: 1, textAlign: "left" }}>
                      {city}
                    </span>
                    <span
                      className="delete-icon"
                      style={{ marginLeft: "10px" }}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering city click
                        deleteCity(city);
                      }}
                    >
                      ❌
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
