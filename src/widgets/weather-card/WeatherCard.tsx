import React from "react";
import type { WeatherResponse } from "../../entities/weather/types";
import classes from "./WeatherCard.module.css";

interface WeatherCardProps {
  weather: WeatherResponse;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
}) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <h2 className={classes.city}>{weather.city}</h2>
        {weather.cached && <span className={classes.cached}>из кэша</span>}
      </div>

      <div className={classes.content}>
        <div className={classes.temperature}>
          <span className={classes.tempValue}>
            {weather.temperatureCelsius}
          </span>
          <span className={classes.tempUnit}>°C</span>
        </div>

        <div className={classes.details}>
          <div className={classes.detailItem}>
            <span className={classes.detailLabel}>Ветер:</span>
            <span className={classes.detailValue}>
              {(weather.windSpeed * 1000 / 3600).toPrecision(2)} м/с
            </span>
          </div>

          <div className={classes.detailItem}>
            <span className={classes.detailLabel}>Обновлено:</span>
            <span className={classes.detailValue}>
              {formatTime(weather.observedAt)} по UTC
            </span>
          </div>

          <div className={classes.detailItem}>
            <span className={classes.detailLabel}>Провайдер:</span>
            <span className={classes.detailValue}>{weather.provider}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
