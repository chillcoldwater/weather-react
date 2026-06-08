import { WeatherSearch } from "../../features/weather-search/WeatherSearch";
import { WeatherCard } from "../../widgets/weather-card/WeatherCard";
import { useState } from "react";
import type { WeatherResponse } from "../../entities/weather/types";

export const WeatherPage = () => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  const handleWeatherLoaded = (data: WeatherResponse) => {
    setWeather(data);
  };

  return (
    <div>
      <WeatherSearch onWeatherLoaded={handleWeatherLoaded} />
      {weather && <WeatherCard weather={weather} />}
    </div>
  );
};