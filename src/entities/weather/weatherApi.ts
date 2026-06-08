import { z } from "zod";
import type { WeatherResponse, CityResponse } from "./types";
import {
  GeoResponseSchema,
  CityResponseSchema,
  WeatherResponseSchema,
} from "./types";

const WeatherApiResponseSchema = z.object({
  current: z.object({
    time: z.string(),
    temperature_2m: z.number(),
    wind_speed_10m: z.number(),
  }),
});

// Функция для получения координат города
export async function getPositionByCity(city: string): Promise<CityResponse> {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&format=json`,
  );
  const rawData = await response.json();
  const validationResult = GeoResponseSchema.safeParse(rawData);
  if (!validationResult.success) {
    console.error("Ошибка валидации геокодера:", validationResult.error.issues);
    throw new Error(`Не удалось найти город: ${city}`);
  }
  const geoData = validationResult.data;
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`Город "${city}" не найден`);
  }
  const firstResult = geoData.results[0];
  const cityResponse: CityResponse = {
    city: firstResult.name,
    latitude: firstResult.latitude,
    longitude: firstResult.longitude,
  };

  const finalValidation = CityResponseSchema.safeParse(cityResponse);
  if (!finalValidation.success) {
    throw new Error("Ошибка формирования данных о городе");
  }

  return finalValidation.data;
}

// Функция для сбора WeatherResponse из города + WeatherAPIResponse
function mapToWeatherResponse(rawData: unknown, city: string): WeatherResponse {
  const validated = WeatherApiResponseSchema.parse(rawData);
  return {
    city: city,
    provider: "Open-Meteo",
    temperatureCelsius: validated.current.temperature_2m,
    windSpeed: validated.current.wind_speed_10m,
    observedAt: validated.current.time,
    cached: false,
  };
}

// Основная функция получения погоды
export async function getWeatherResponse(
  city: string,
): Promise<WeatherResponse> {
  const cityPos = await getPositionByCity(city);
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${cityPos.latitude}&longitude=${cityPos.longitude}&current=temperature_2m,wind_speed_10m`,
  );
  const rawData = await response.json();
  try {
    const weatherResponse = mapToWeatherResponse(rawData, city);
    const finalValidation = WeatherResponseSchema.safeParse(weatherResponse);
    if (!finalValidation.success) {
      throw new Error("Ошибка формирования погодных данных");
    }
    return finalValidation.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Ошибка валидации погодных данных:", error.issues);
      throw new Error("Неверный формат данных от погодного API");
    }
    throw error;
  }
}
