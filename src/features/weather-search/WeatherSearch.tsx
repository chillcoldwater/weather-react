import { Autocomplete } from "@mantine/core";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import classes from "./WeatherSearch.module.css";
import { getWeatherResponse } from "../../entities/weather/weatherApi";
import type { WeatherResponse } from "../../entities/weather/types";

const cities = ["Moscow", "Murmansk", "Berlin", "Paris"];

interface WeatherSearchProps {
  onWeatherLoaded?: (weather: WeatherResponse) => void;
  value: string;
  setValue: (value: string) => void;
  citiesHistory: string[];
  setCitiesHistory: (arr: string[]) => void;
}

/* Использовал forwardRef для того чтобы не выносить логику поиска на WeatherPage, а вызывать нужную функцию через ссылку */
export const WeatherSearch = forwardRef<
  { triggerSearch: () => void },
  WeatherSearchProps
>(
  (
    { onWeatherLoaded, value, setValue, citiesHistory, setCitiesHistory },
    ref,
  ) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

        if (onWeatherLoaded) {
          onWeatherLoaded(result);
          const newCities = [searchValue, ...citiesHistory];
          const filteredCities = newCities.filter((elem, index) => elem !== newCities[index - 1]);
          setCitiesHistory(filteredCities);
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Ошибка получения погоды:", err);
      } finally {
        setIsLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      triggerSearch: () => {
        handleWeatherSearch(value);
      },
    }));
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
          error={error}
          classNames={{
            option: classes.customOption,
            dropdown: classes.customDropdown,
          }}
        />
      </form>
    );
  },
);
