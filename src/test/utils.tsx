import { render, type RenderOptions } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';
import { theme } from '@/theme';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function AllProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();
  return (
    <MemoryRouter>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </QueryClientProvider>
      </JotaiProvider>
    </MemoryRouter>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export { render, createTestQueryClient };
