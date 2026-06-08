import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import { WeatherSearch } from '../features/weather-search/WeatherSearch'

function App() {

  return (
    <MantineProvider>
      <WeatherSearch/>
    </MantineProvider>
  )
}

export default App
