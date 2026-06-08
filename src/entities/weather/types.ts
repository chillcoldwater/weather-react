import { z } from "zod";

// То что вернули с поиска по API (положение города)
export const GeoResponseSchema = z.object({
  results: z.array(z.object({
    name: z.string(),
    latitude: z.number(),
    longitude: z.number()
  }))
});

// Схема для позиции города
export const CityResponseSchema = z.object({
  city: z.string(),
  latitude: z.number(),
  longitude: z.number()
});

// Схема для погодного ответа
export const WeatherResponseSchema = z.object({
  city: z.string(),
  provider: z.string(),
  temperatureCelsius: z.number(),
  windSpeed: z.number(),
  observedAt: z.string(),
  cached: z.boolean().optional()
});

export type CityResponse = z.infer<typeof CityResponseSchema>;
export type WeatherResponse = z.infer<typeof WeatherResponseSchema>;