import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import { WeatherPage } from '../pages/weather/WeatherPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,      // 1 минута дефолтная свежесть
      gcTime: 5 * 60 * 1000,     // 5 минут данные живут в кэше
      retry: 1,
      refetchOnWindowFocus: false, 
    },
  },
});
function App() {

  return (
    <QueryClientProvider client={queryClient}>
    <MantineProvider>
      <WeatherPage/>
    </MantineProvider>
    </QueryClientProvider>

  )
}

export default App
