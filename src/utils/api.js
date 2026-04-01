const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || 'db07efb251b14c5574b20d0f3c3a23e6';

export async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('City not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
}

export function processForecast(data) {
  const dailyTemps = {};

  data.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyTemps[date]) {
      dailyTemps[date] = [];
    }
    dailyTemps[date].push(item.main.temp);
  });

  return Object.keys(dailyTemps).map((date) => {
    const temps = dailyTemps[date];
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    return {
      date,
      day: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(`${date}T00:00:00Z`)),
      temp: avgTemp,
    };
  });
}