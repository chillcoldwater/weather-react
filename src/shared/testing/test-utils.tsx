import type { ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

export const renderWithMantine = (ui: ReactElement) => {
  return rtlRender(
    <MantineProvider defaultColorScheme="light">
      {ui}
    </MantineProvider>
  );
};

export { screen, waitFor, within } from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';