import { vi } from 'vitest';
import type { WeatherResponse } from '../../../entities/weather/types';

export const mockWeatherData: WeatherResponse = {
  city: 'Moscow',
  provider: "Open Meteo",
  temperatureCelsius: 25.1,
  windSpeed: 10,
  observedAt: "11 июня в 02:45",
  cached: true
};

export const mockGeoData = {
  results: [
    {
      id: 1,
      name: 'Moscow',
      latitude: 55.7558,
      longitude: 37.6173,
      country: 'RU',
    },
  ],
};

export const mockApi = {
  getWeatherResponse: vi.fn(),
  getPositionByCity: vi.fn(),
};

vi.mock('../../../entities/weather/weatherApi', () => ({
  getWeatherResponse: mockApi.getWeatherResponse,
  getPositionByCity: mockApi.getPositionByCity,
}));