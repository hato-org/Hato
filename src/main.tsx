import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RecoilRoot } from 'recoil';
import App from './App';
import theme from './theme';

import { createIDBPersister } from './modules/common/querypersist';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      keepPreviousData: true,
      retry: 2,
      cacheTime: Infinity, // Cache time (Infinity)
      staleTime: 1000 * 60 * 5, // Stale time (5 mins)
    },
  },
});

const persister = createIDBPersister();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <HelmetProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          <RecoilRoot>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </RecoilRoot>
          <ReactQueryDevtools initialIsOpen={false} />
        </PersistQueryClientProvider>
      </HelmetProvider>
    </ChakraProvider>
  </React.StrictMode>
);
