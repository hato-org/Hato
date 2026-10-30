import '@fontsource/josefin-sans';
import '@fontsource-variable/noto-sans-jp';
import '@fontsource/inter';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from '@/components/ui/provider';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import App from './App';
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

// jotai-devtools 0.10 以降はスタイルの明示 import が必要 (約 1MB のため開発時のみ読み込む)
const JotaiDevTools = import.meta.env.DEV
  ? React.lazy(async () => {
      try {
        await import('jotai-devtools/styles.css');
        const { DevTools } = await import('jotai-devtools');
        return { default: DevTools };
      } catch {
        // 開発用ツールの読み込み失敗でアプリ全体を落とさない
        return { default: () => null };
      }
    })
  : () => null;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <Provider defaultTheme="system" enableSystem>
        <HelmetProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={{
                persister,
                maxAge: 1000 * 60 * 60 * 24, // 24 hours
              }}
            >
              <App />
              <Toaster />
              <ReactQueryDevtools initialIsOpen={false} />
              <React.Suspense fallback={null}>
                <JotaiDevTools />
              </React.Suspense>
            </PersistQueryClientProvider>
          </GoogleOAuthProvider>
        </HelmetProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);
