import React, { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherChart from './components/WeatherChart';
import WeatherInsights from './components/WeatherInsights';
import { fetchWeather, processForecast } from './utils/api';
import './App.css';

const defaultForecast = [
  { day: 'Mon', temp: 23.2 },
  { day: 'Tue', temp: 27.3 },
  { day: 'Wed', temp: 23.1 },
  { day: 'Thu', temp: 25.2 },
  { day: 'Thu', temp: 22.7 },
  { day: 'Fri', temp: 25.5 },
  { day: 'Sat', temp: 22.8 },
  { day: 'Sat', temp: 24.9 },
  { day: 'Sun', temp: 24.6 },
  { day: 'Sun', temp: 26.6 },
];

const fallbackWeather = {
  city: 'London',
  currentTemperature: 18,
  condition: 'Cloudy',
};

const fallbackInsights = [
  'Best day to go out: Friday (18°C)',
  'Rain expected on Thursday',
  'Very hot day expected on Saturday (34°C)',
];

const conditionMap = {
  Clouds: 'Cloudy',
  Rain: 'Rainy',
  Drizzle: 'Drizzle',
  Clear: 'Clear',
  Snow: 'Snowy',
  Thunderstorm: 'Stormy',
  Mist: 'Mist',
  Fog: 'Fog',
  Haze: 'Haze',
};

function formatDay(dateString) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(`${dateString}T00:00:00Z`));
}

function getCondition(item) {
  const weatherMain = item?.weather?.[0]?.main;
  const weatherDescription = item?.weather?.[0]?.description;

  if (weatherMain && conditionMap[weatherMain]) {
    return conditionMap[weatherMain];
  }

  if (weatherDescription) {
    return weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
  }

  return fallbackWeather.condition;
}

function buildInsights(dailyForecast, forecastList) {
  if (dailyForecast.length === 0) {
    return fallbackInsights;
  }

  const groupedByDate = forecastList.reduce((accumulator, item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!accumulator[date]) {
      accumulator[date] = [];
    }
    accumulator[date].push(item);
    return accumulator;
  }, {});

  const bestDay = dailyForecast.reduce((lowest, entry) => (entry.temp < lowest.temp ? entry : lowest), dailyForecast[0]);

  const rainyDay = dailyForecast.find((entry) => {
    const items = groupedByDate[entry.date] || [];
    return items.some((item) => (item.pop ?? 0) > 0.6 || item.weather?.some((weather) => /rain/i.test(weather.main)));
  });

  const hottestDay = dailyForecast.reduce((highest, entry) => (entry.temp > highest.temp ? entry : highest), dailyForecast[0]);
  const coldestDay = dailyForecast.reduce((lowest, entry) => (entry.temp < lowest.temp ? entry : lowest), dailyForecast[0]);

  const temperatureInsight =
    hottestDay.temp > 35
      ? `Very hot day expected on ${hottestDay.day} (${Math.round(hottestDay.temp)}°C)`
      : coldestDay.temp < 5
        ? `Cold warning on ${coldestDay.day} (${Math.round(coldestDay.temp)}°C)`
        : `Warmest day expected on ${hottestDay.day} (${Math.round(hottestDay.temp)}°C)`;

  return [
    `Best day to go out: ${bestDay.day} (${Math.round(bestDay.temp)}°C)`,
    rainyDay ? `Rain expected on ${rainyDay.day}` : 'No rain expected in the forecast',
    temperatureInsight,
  ];
}

function App() {
  const [city, setCity] = useState('London');
  const [forecast, setForecast] = useState(defaultForecast);
  const [weather, setWeather] = useState(fallbackWeather);
  const [insights, setInsights] = useState(fallbackInsights);

  const loadWeather = async (searchCity) => {
    const nextCity = searchCity.trim() || 'London';
    setCity(nextCity);

    try {
      const data = await fetchWeather(nextCity);
      const dailyForecast = processForecast(data).slice(0, 7).map((entry) => ({
        day: entry.day || formatDay(entry.date),
        date: entry.date,
        temp: Number(entry.temp.toFixed(1)),
      }));

      const currentWeather = data.list[0];

      setWeather({
        city: data.city?.name || nextCity,
        currentTemperature: Math.round(currentWeather.main.temp),
        condition: getCondition(currentWeather),
      });
      setForecast(dailyForecast.length > 0 ? dailyForecast : defaultForecast);
      setInsights(buildInsights(dailyForecast.length > 0 ? dailyForecast : defaultForecast, data.list));
    } catch (error) {
      console.error('Unable to load weather data:', error);
      setWeather({
        city: nextCity,
        currentTemperature: fallbackWeather.currentTemperature,
        condition: fallbackWeather.condition,
      });
      setForecast(defaultForecast);
      setInsights(fallbackInsights);
    }
  };

  useEffect(() => {
    loadWeather(city);
  }, []);

  const handleSearch = (searchCity) => {
    loadWeather(searchCity);
  };

  return (
    <div className="app-shell">
      <div className="browser-frame">
        <div className="browser-topbar" aria-hidden="true">
          <span />
          <span />
          <span />
          <div className="browser-address" />
        </div>

        <main className="app-main">
          <SearchBar initialCity={city} onSearch={handleSearch} />
          <CurrentWeather city={weather.city} currentTemperature={weather.currentTemperature} condition={weather.condition} />
          <WeatherChart forecastData={forecast} />
          <WeatherInsights insights={insights} />
        </main>
      </div>
    </div>
  );
}

export default App;