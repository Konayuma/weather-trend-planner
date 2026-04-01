import React, { useEffect, useState } from 'react';

function SearchBar({ initialCity = 'London', onSearch }) {
  const [city, setCity] = useState(initialCity);

  useEffect(() => {
    setCity(initialCity);
  }, [initialCity]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(city);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label htmlFor="city-input">Enter city:</label>
      <input
        id="city-input"
        type="text"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        aria-label="City"
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;