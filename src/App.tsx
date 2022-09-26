import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/common/ErrorFallback';
import { GlobalLoading } from './components/common/Loading';
import usePageTracking from './hooks/common/ga4';
import Router from './routes';

function App() {
  usePageTracking();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      <Suspense fallback={<GlobalLoading />}>
        <Router />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
