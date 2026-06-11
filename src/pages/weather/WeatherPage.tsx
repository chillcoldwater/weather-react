// WeatherPage.tsx
import { WeatherSearch } from "../../features/weather-search/WeatherSearch";
import { WeatherCard } from "../../widgets/weather-card/WeatherCard";
import { useState, useRef } from "react";
import type { WeatherResponse } from "../../entities/weather/types";
import { WeatherHistory } from "../../features/history/WeatherHistory";

type PageState = 'initial' | 'loading' | 'success' | 'empty' | 'error';

export const WeatherPage = () => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [citiesHistory, setCitiesHistory] = useState<string[]>([]);
  const [pageState, setPageState] = useState<PageState>('initial');
  const searchRef = useRef<{ triggerSearch: () => void; getCurrentCity: () => string; setCity: (city : string) => void } | null>(null);

  const handleWeatherLoaded = (data: WeatherResponse) => {
    setWeather(data);
    setPageState('success');
  };

  const handleCityChosen = (city: string) => {
    searchRef.current?.setCity(city)
    searchRef.current?.triggerSearch();
  };

  return (
    <div>
      <WeatherSearch
        ref={searchRef}
        onWeatherLoaded={handleWeatherLoaded}
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