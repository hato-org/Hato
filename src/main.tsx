import '@fontsource/josefin-sans';
import '@fontsource-variable/noto-sans-jp';
import '@fontsource/inter';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DevTools } from 'jotai-devtools';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import App from './App';
import theme from './theme';
import './global.css';

import '@/utils/recoil_migration';

import { createIDBPersister } from './modules/common/querypersist';

function RootErrorFallback({ error }: FallbackProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100dvh',
        padding: '2rem',
        fontFamily: '-apple-system, Inter, "Noto Sans JP Variable", sans-serif',
        textAlign: 'center',
      }}
    >
      <div>
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}
        >
          アプリケーションの初期化に失敗しました
        </h1>
        <p
          style={{
            color: '#666',
            marginBottom: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1.5rem',
            background: '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          再読み込み
        </button>
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
      staleTime: 1000 * 60 * 5, // Stale time (5 mins)
    },
  },
});

const persister = createIDBPersister();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <ChakraProvider theme={theme}>
        <HelmetProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={{
                persister,
                maxAge: 1000 * 60 * 60 * 24, // 24 hours
              }}
            >
              <ColorModeScript />
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
              <DevTools />
            </PersistQueryClientProvider>
          </GoogleOAuthProvider>
        </HelmetProvider>
      </ChakraProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
