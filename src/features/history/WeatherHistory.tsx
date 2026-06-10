import styles from "./WeatherHistory.module.css";

interface WeatherHistoryProps {
  onChosen?: (city: string) => void;
  citiesHistory: string[];
  MAX_HISTORY_BUTTONS?: number;
}
export const WeatherHistory = ({
  onChosen,
  citiesHistory = [],
  MAX_HISTORY_BUTTONS = 5
}: WeatherHistoryProps) => {
  return (
    <div className={styles.historyContainer}>
      {citiesHistory.slice(0, MAX_HISTORY_BUTTONS).map((city, index) => (
        <button key={index} onClick={() => onChosen?.(city)} className={styles.buttonStyle}>
          {city}
        </button>
      ))}
    </div>
  );
};
