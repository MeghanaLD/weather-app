import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBox() {
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (city.trim() !== "") {
      const storedCities =
        JSON.parse(localStorage.getItem("recentCities")) || [];
      const updatedCities = [
        city,
        ...storedCities.filter((c) => c !== city),
      ].slice(0, 5);
      localStorage.setItem("recentCities", JSON.stringify(updatedCities));
      navigate(`/weather?city=${city}`);
    }
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBox;
