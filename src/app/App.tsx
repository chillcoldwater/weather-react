import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import { WeatherPage } from '../pages/weather/WeatherPage';

function App() {

  return (
    <MantineProvider>
      <WeatherPage/>
    </MantineProvider>
  )
}

export default App
