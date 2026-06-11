import { queryOptions } from "@tanstack/react-query";
import {
  getWeatherResponse,
  getPositionByCity,
} from "../../entities/weather/weatherApi";

export const weatherQueries = {
  all: () => ["weather"] as const,

  // Погода по городу
  byCity: (city: string) =>
    queryOptions({
      queryKey: [...weatherQueries.all(), "city", city] as const,
      queryFn: () => getWeatherResponse(city),
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут в кэше
      enabled: false,
      retry: 1,
    }),

  // Геокодинг (координаты по городу)
  coordinates: (city: string) =>
    queryOptions({
      queryKey: [...weatherQueries.all(), "geo", city] as const,
      queryFn: () => getPositionByCity(city),
      staleTime: Infinity,
      enabled: false,
    }),
};
