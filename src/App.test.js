import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { fetchWeather, processForecast } from './utils/api';

jest.mock('./utils/api', () => ({
  fetchWeather: jest.fn(),
  processForecast: jest.fn(),
}));

const mockedWeatherResponse = {
  city: { name: 'London' },
  list: [
    { dt_txt: '2026-04-01 00:00:00', main: { temp: 21 }, weather: [{ main: 'Clouds', description: 'cloudy' }], pop: 0.1 },
    { dt_txt: '2026-04-01 03:00:00', main: { temp: 22 }, weather: [{ main: 'Clouds', description: 'cloudy' }], pop: 0.1 },
  ],
};

const mockedDailyForecast = [
  { date: '2026-04-01', day: 'Wed', temp: 21 },
  { date: '2026-04-02', day: 'Thu', temp: 19 },
  { date: '2026-04-03', day: 'Fri', temp: 18 },
  { date: '2026-04-04', day: 'Sat', temp: 20 },
  { date: '2026-04-05', day: 'Sun', temp: 22 },
];

beforeEach(() => {
  fetchWeather.mockResolvedValue(mockedWeatherResponse);
  processForecast.mockReturnValue(mockedDailyForecast);
});

test('renders the weather planner layout and loads API weather data', async () => {
  render(<App />);

  expect(screen.getByText(/enter city:/i)).toBeInTheDocument();
  expect(screen.getByText(/london/i)).toBeInTheDocument();
  expect(screen.getByText(/temperature trend/i)).toBeInTheDocument();

  await waitFor(() => expect(fetchWeather).toHaveBeenCalledWith('London'));
  expect(await screen.findByText(/current temperature: 21°c/i)).toBeInTheDocument();
  expect(screen.getByText(/best day to go out: fri \(18°c\)/i)).toBeInTheDocument();
});
