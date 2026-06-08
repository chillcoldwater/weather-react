import { Autocomplete } from "@mantine/core";
import React, { useState } from "react";
import classes from "./WeatherSearch.module.css";
import { getWeatherResponse } from "../../entities/weather/weatherApi";
import type { WeatherResponse } from "../../entities/weather/types";

const cities = ["Дыня", "Арбуз", "Пряник", "Ананас", "Стекло", "Яблоко"];

export const WeatherSearch = () => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  const handleOptionSubmit = (value: string) => {
    setValue(value);
    handleWeatherSearch(value);
  };

  const handleWeatherSearch = async (searchValue: string) => {
    if (searchValue.trim().length < 2) {
      setError("Название города должно содержать минимум 2 символа");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const result = await getWeatherResponse(searchValue);
      console.log(result);
      setWeather(result);
    } catch (err) {
      setError(err.message);
      console.error("Ошибка получения погоды:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleWeatherSearch(value);
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Autocomplete
        label="Город"
        placeholder="Введите название..."
        value={value}
        onChange={handleChange}
        onOptionSubmit={handleOptionSubmit}
        limit={5}
        data={cities}
        loading={isLoading}
        clearable
        selectFirstOptionOnChange
        error={error}
        classNames={{
          option: classes.customOption,
          dropdown: classes.customDropdown,
        }}
      />
      {weather && (
        <div>
          <h3>Погода в {weather.city}</h3>
          <p>Температура: {weather.temperatureCelsius} C</p>
          <p>Ветер: {weather.windSpeed} км/ч</p>
          <p>Наблюдается: {weather.observedAt}</p>
        </div>
      )}
    </form>
  );
};