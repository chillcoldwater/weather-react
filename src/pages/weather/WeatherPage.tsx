import { WeatherSearch } from "../../features/weather-search/WeatherSearch";
import { WeatherCard } from "../../widgets/weather-card/WeatherCard";
import { useState, useRef } from "react";
import type { WeatherResponse } from "../../entities/weather/types";
import { WeatherHistory } from "../../features/history/WeatherHistory";

export const WeatherPage = () => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [value, setValue] = useState<string>("");
  const [citiesHistory, setCitiesHistory] = useState<string[]>([]);
  const searchRef = useRef<{ triggerSearch: () => void } | null>(null);

  const handleWeatherLoaded = (data: WeatherResponse) => {
    setWeather(data);
  };
  const handleCityChosen = (data: string) => {
    setValue(data);
    setTimeout(() => {
      searchRef.current?.triggerSearch();
    }, 0);
  };
  return (
    <div>
      <WeatherSearch
        ref={searchRef}
        onWeatherLoaded={handleWeatherLoaded}
        value={value}
        setValue={setValue}
        citiesHistory={citiesHistory}
        setCitiesHistory={setCitiesHistory}
      />
      <WeatherHistory
        onChosen={handleCityChosen}
        citiesHistory={citiesHistory}
      />
      {weather && <WeatherCard weather={weather} />}
    </div>
  );
};
