import type { ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import type { RenderOptions }  from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
  },
});

interface WrapperProps {
  children: React.ReactNode;
}

export const createWrapper = () => {
  const queryClient = createTestQueryClient();
  
  return function Wrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme="auto">
          {children}
        </MantineProvider>
      </QueryClientProvider>
    );
  };
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const Wrapper = createWrapper();
  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

export { customRender as render };
export { screen, waitFor, within, act, fireEvent } from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';