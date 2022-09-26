import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/common/ErrorFallback';
import { GlobalLoading } from './components/common/Loading';
import UpdatePrompt from './components/common/UpdatePrompt';
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
        <UpdatePrompt />
        <Router />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
