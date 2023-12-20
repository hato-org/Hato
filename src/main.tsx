import '@fontsource/josefin-sans';
// import '@fontsource/noto-sans-jp';
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
import App from './App';
import theme from './theme';
import './global.css';

import '@/utils/recoil_migration';

import { createIDBPersister } from './modules/common/querypersist';

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
  </React.StrictMode>,
);
