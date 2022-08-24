import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/common/ErrorFallback";
import usePageTracking from "./hooks/common/ga4";
import { Router } from "./routes";

function App() {
  usePageTracking();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      <Suspense fallback="loading...">
        <Router />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
