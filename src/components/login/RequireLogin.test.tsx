import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { theme } from '@/theme';
import { jwtAtom } from '@/store/auth';
import RequireLogin from '@/components/login/RequireLogin';

vi.mock('@/hooks/common/ga4', () => ({
  default: vi.fn(),
}));

vi.mock('@/components/layout/PageContainer', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-container">{children}</div>
  ),
}));

beforeEach(() => {
  localStorage.clear();
});

function renderWithRouter(
  store: ReturnType<typeof createStore>,
  initialEntries: string[],
  routes?: Parameters<typeof createMemoryRouter>[0],
) {
  const defaultRoutes = [
    {
      path: '/',
      element: <RequireLogin />,
      children: [
        { index: true, element: <div>Protected Content</div> },
        { path: 'dashboard', element: <div>Dashboard Content</div> },
      ],
    },
    {
      path: '/login',
      element: <div data-testid="login-page">Login</div>,
    },
  ];

  const router = createMemoryRouter(routes ?? defaultRoutes, {
    initialEntries,
  });

  render(
    <JotaiProvider store={store}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </JotaiProvider>,
  );

  return router;
}

describe('RequireLogin', () => {
  it('renders child content when JWT exists', async () => {
    const store = createStore();
    store.set(jwtAtom, 'valid-token');

    renderWithRouter(store, ['/']);

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
    expect(screen.getByTestId('page-container')).toBeInTheDocument();
  });

  it('redirects to /login when JWT is null', async () => {
    const store = createStore();
    store.set(jwtAtom, null);

    renderWithRouter(store, ['/']);

    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  it('includes the current pathname in return_to', async () => {
    const store = createStore();
    store.set(jwtAtom, null);

    const router = renderWithRouter(
      store,
      ['/dashboard'],
      [
        {
          path: '/dashboard',
          element: <RequireLogin />,
          children: [{ index: true, element: <div>Dashboard Content</div> }],
        },
        {
          path: '/login',
          element: <div data-testid="login-page">Login</div>,
        },
      ],
    );

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
    });
    expect(router.state.location.search).toContain('return_to=/dashboard');
  });

  it('includes search params in return_to', async () => {
    const store = createStore();
    store.set(jwtAtom, null);

    const router = renderWithRouter(store, ['/?tab=overview']);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
    });
    expect(router.state.location.search).toContain('return_to=/?tab=overview');
  });
});
