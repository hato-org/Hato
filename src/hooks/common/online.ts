import { useState, useEffect, useCallback } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useIsOnline = () => {
  const [online, setOnline] = useState(navigator.onLine);

  const onOnline = useCallback(() => setOnline(true), []);
  const onOffline = useCallback(() => setOnline(false), []);

  useEffect(() => {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return online;
};
