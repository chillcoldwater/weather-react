import { Autocomplete, Button } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import classes from "./WeatherSearch.module.css";

const cities = ["Moscow", "Murmansk", "Berlin", "Paris"];

const weatherSchema = z.object({
  city: z.string().min(2, "Название города должно содержать минимум 2 символа"),
});

type WeatherFormData = z.infer<typeof weatherSchema>;

interface WeatherSearchProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export const WeatherSearch = ({ onSearch, isLoading }: WeatherSearchProps) => {
  const {
    control,
    handleSubmit,
    formState: {errors, isValid },
    setValue,
    clearErrors,
  } = useForm<WeatherFormData>({
    resolver: zodResolver(weatherSchema),
    defaultValues: { city: "" },
    mode: "onSubmit",
  });

  const onSubmit = (data: WeatherFormData) => {
    if (data.city.trim()) {
      onSearch(data.city);
    }
  };

  const handleOptionSubmit = (selectedCity: string) => {
    setValue("city", selectedCity);
    clearErrors("city");
    handleSubmit(onSubmit)();
  };

    const handleChange = (value: string, onChange: (value: string) => void) => {
    onChange(value);
    if (errors.city) {
      clearErrors("city");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            onChange={(value) => handleChange(value, field.onChange)}
            label="Город"
            placeholder="Введите название..."
            limit={5}
            data={cities}
            loading={isLoading}
            onOptionSubmit={handleOptionSubmit}
            rightSection={
              <Button
                variant="subtle"
                size="compact-xs"
                type="submit"
                disabled={!field.value?.trim() || !isValid || isLoading}
              >
                Поиск
              </Button>
            }
            error={errors.city?.message}
            rightSectionWidth="auto"
            classNames={{
              option: classes.customOption,
              dropdown: classes.customDropdown,
            }}
          />
        )}
      />
    </form>
  );
};
