import { useColorModeValue } from '@chakra-ui/react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Helmet } from 'react-helmet-async';
import ErrorFallback from './components/common/ErrorFallback';
import { GlobalLoading } from './components/common/Loading';
import UpdatePrompt from './components/common/UpdatePrompt';
import usePageTracking from './hooks/common/ga4';
import Router from './routes';

function App() {
  usePageTracking();
  const themeColor = useColorModeValue('white', '#121212');

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      <Helmet>
        <meta name="theme-color" content={themeColor} />
      </Helmet>
      <Suspense fallback={<GlobalLoading />}>
        <UpdatePrompt />
        <Router />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
