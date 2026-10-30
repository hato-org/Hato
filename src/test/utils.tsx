import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';
import { Provider as ChakraUIProvider } from '@/components/ui/provider';

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
          <ChakraUIProvider defaultTheme="light">{children}</ChakraUIProvider>
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
