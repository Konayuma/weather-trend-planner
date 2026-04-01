import React from 'react';

function CurrentWeather({ city, currentTemperature, condition }) {
  return (
    <section className="current-weather" aria-label="Current weather">
      <div className="current-weather__title">{city}</div>
      <div className="current-weather__content">
        <p>Current Temperature: {currentTemperature}°C</p>
        <p>Condition: {condition}</p>
      </div>
    </section>
  );
}

export default CurrentWeather;