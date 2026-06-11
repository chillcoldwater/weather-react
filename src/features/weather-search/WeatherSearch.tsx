import { Autocomplete, Button } from "@mantine/core";
import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import classes from "./WeatherSearch.module.css";
import { getWeatherResponse } from "../../entities/weather/weatherApi";
import type { WeatherResponse } from "../../entities/weather/types";

const cities = ["Moscow", "Murmansk", "Berlin", "Paris"];

const weatherSchema = z.object({
  city: z
    .string()
    .min(2, "Название города должно содержать минимум 2 символа")
});

type WeatherFormData = z.infer<typeof weatherSchema>;

interface WeatherSearchProps {
  onWeatherLoaded?: (weather: WeatherResponse) => void;
  citiesHistory: string[];
  setCitiesHistory: (arr: string[] | ((prev: string[]) => string[])) => void;
}

export const WeatherSearch = forwardRef<
  { triggerSearch: () => void; getCurrentCity: () => string; setCity: (city : string) => void },
  WeatherSearchProps
>(({ onWeatherLoaded, citiesHistory, setCitiesHistory }, ref) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useForm<WeatherFormData>({
    resolver: zodResolver(weatherSchema),
    defaultValues: {
      city: "",
    },
    mode: "onChange",
  });

  const performWeatherSearch = async (searchValue: string) => {
    if (!searchValue.trim()) return;

    try {
      const result = await getWeatherResponse(searchValue);

      if (onWeatherLoaded) {
        onWeatherLoaded(result);
        
        setCitiesHistory((prev: string[]) => {
          const newCities = [searchValue, ...prev];
          return newCities.filter((city, index) => city !== newCities[index + 1]);
        });
      }
    } catch (err: any) {
      console.error("Ошибка получения погоды:", err);
      
      setError("city", {
        type: "manual",
        message: err.message || "Не удалось найти город. Проверьте название или попробуйте позже.",
      });
    }
  };

  const onSubmit = async (data: WeatherFormData) => {
    // Очищаем ошибку перед новым запросом
    clearErrors("city");
    
    try {
      await performWeatherSearch(data.city);
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  const handleOptionSubmit = (selectedCity: string) => {
    setValue("city", selectedCity);
    handleSubmit(onSubmit)();
  };

  useImperativeHandle(ref, () => ({
    triggerSearch: () => {
      handleSubmit(onSubmit)();
    },
    getCurrentCity: () => {
      return getValues("city");
    },
    setCity: (city : string) => {
      setValue("city", city)
    }
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            label="Город"
            placeholder="Введите название..."
            limit={5}
            data={cities}
            loading={isSubmitting}
            onOptionSubmit={handleOptionSubmit}
            rightSection={
              <Button
                variant="subtle"
                size="compact-xs"
                type="submit"
                disabled={!field.value?.trim() || !isValid || isSubmitting}
              >
                Поиск
              </Button>
            }
            rightSectionWidth="auto"
            error={errors.city?.message}
            classNames={{
              option: classes.customOption,
              dropdown: classes.customDropdown,
            }}
          />
        )}
      />
    </form>
  );
});