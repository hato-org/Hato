import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

function renderWithRouter(
  store: ReturnType<typeof createStore>,
  initialEntries: string[],
) {
  const router = createMemoryRouter(
    [
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
    ],
    { initialEntries },
  );

  return render(
    <JotaiProvider store={store}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </JotaiProvider>,
  );
}

describe('RequireLogin', () => {
  it('renders child content when JWT exists', () => {
    const store = createStore();
    store.set(jwtAtom, 'valid-token');

    renderWithRouter(store, ['/']);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.getByTestId('page-container')).toBeInTheDocument();
  });

  it('redirects to /login when JWT is null', () => {
    const store = createStore();
    store.set(jwtAtom, null);

    renderWithRouter(store, ['/']);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('includes the current pathname in return_to', () => {
    const store = createStore();
    store.set(jwtAtom, null);

    const router = createMemoryRouter(
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
      { initialEntries: ['/dashboard'] },
    );

    render(
      <JotaiProvider store={store}>
        <ChakraProvider theme={theme}>
          <RouterProvider router={router} />
        </ChakraProvider>
      </JotaiProvider>,
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(router.state.location.search).toContain('return_to=/dashboard');
  });

  it('includes search params in return_to', () => {
    const store = createStore();
    store.set(jwtAtom, null);

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <RequireLogin />,
          children: [{ index: true, element: <div>Content</div> }],
        },
        {
          path: '/login',
          element: <div data-testid="login-page">Login</div>,
        },
      ],
      { initialEntries: ['/?tab=overview'] },
    );

    render(
      <JotaiProvider store={store}>
        <ChakraProvider theme={theme}>
          <RouterProvider router={router} />
        </ChakraProvider>
      </JotaiProvider>,
    );

    expect(router.state.location.pathname).toBe('/login');
    expect(router.state.location.search).toContain('return_to=/?tab=overview');
  });
});
