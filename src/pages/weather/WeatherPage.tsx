// WeatherPage.tsx - ЕДИНСТВЕННЫЙ useQuery
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { WeatherSearch } from "../../features/weather-search/WeatherSearch";
import { WeatherCard } from "../../widgets/weather-card/WeatherCard";
import { WeatherHistory } from "../../features/history/WeatherHistory";
import { weatherQueries } from '../../shared/api/weatherQueries';

export const WeatherPage = () => {
  const [currentCity, setCurrentCity] = useState<string>('');
  const [citiesHistory, setCitiesHistory] = useState<string[]>([]);

  const { 
    data: weather, 
    isLoading, 
    error, 
    refetch 
  } = useQuery(weatherQueries.byCity(currentCity))

  const handleSearch = (city: string) => {
    setCurrentCity(city);
    setTimeout(()=>refetch(), 0);
  };

  useEffect(() => {
    if (weather && currentCity) {
      setCitiesHistory(prev => [currentCity, ...prev.filter(c => c !== currentCity)]);
    }
  }, [weather, currentCity]);

  let pageState: 'initial' | 'loading' | 'success' | 'empty' | 'error' = 'initial';
  
  if (isLoading) pageState = 'loading';
  else if (error) pageState = 'error';
  else if (weather) pageState = 'success';
  else if (currentCity) pageState = 'empty';
  else pageState = 'initial';

  return (
    <div>
      <WeatherSearch 
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      <WeatherHistory
        onChosen={(city) => handleSearch(city)}
        citiesHistory={citiesHistory}
      />
      {pageState === 'loading' && <div>Загрузка погоды...</div>}
      {pageState === 'error' && <div>Ошибка: {error?.message}</div>}
      {pageState === 'empty' && <div>Город "{currentCity}" не найден</div>}
      {pageState === 'success' && weather && (
        <WeatherCard weather={weather} />
      )}
      
    </div>
  );
};