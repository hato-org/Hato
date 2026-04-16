import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { theme } from '@/theme';
import { jwtAtom } from '@/store/auth';
import RequireLogin from '@/components/login/RequireLogin';

// Navigate の遷移先を記録するためのモック
const navigatedTo = vi.fn<[string]>();

vi.mock('@/hooks/common/ga4', () => ({
  default: vi.fn(),
}));

vi.mock('@/components/layout/PageContainer', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-container">{children}</div>
  ),
}));

// ScrollRestoration は MemoryRouter（非データルーター）では使えないためモック
vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    ScrollRestoration: () => null,
  };
});

/**
 * /login ルートで現在の location を記録するコンポーネント
 */
function LoginCapture() {
  const loc = useLocation();
  navigatedTo(loc.pathname + loc.search);
  return <div data-testid="login-page">Login</div>;
}

beforeEach(() => {
  localStorage.clear();
  navigatedTo.mockClear();
});

function renderWithMemoryRouter(
  store: ReturnType<typeof createStore>,
  initialEntries: string[],
  protectedPath = '/',
) {
  render(
    <JotaiProvider store={store}>
      <ChakraProvider theme={theme}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path={protectedPath} element={<RequireLogin />}>
              <Route index element={<div>Protected Content</div>} />
            </Route>
            <Route path="/login" element={<LoginCapture />} />
          </Routes>
        </MemoryRouter>
      </ChakraProvider>
    </JotaiProvider>,
  );
}

describe('RequireLogin', () => {
  it('renders child content when JWT exists', async () => {
    const store = createStore();
    store.set(jwtAtom, 'valid-token');

    renderWithMemoryRouter(store, ['/']);

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
    expect(screen.getByTestId('page-container')).toBeInTheDocument();
  });

  it('redirects to /login when JWT is null', async () => {
    const store = createStore();
    store.set(jwtAtom, null);

    renderWithMemoryRouter(store, ['/']);

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  it('includes the current pathname in return_to', async () => {
    const store = createStore();
    store.set(jwtAtom, null);

    renderWithMemoryRouter(store, ['/dashboard'], '/dashboard');

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
    expect(navigatedTo).toHaveBeenCalledWith(
      expect.stringContaining('return_to=/dashboard'),
    );
  });

  it('includes search params in return_to', async () => {
    const store = createStore();
    store.set(jwtAtom, null);

    renderWithMemoryRouter(store, ['/?tab=overview']);

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
    expect(navigatedTo).toHaveBeenCalledWith(
      expect.stringContaining('return_to=/?tab=overview'),
    );
  });
});
