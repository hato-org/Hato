import ky from 'ky';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { jwtAtom, clearAuth } from '@/store/auth';
import { API_URL } from '@/config/api';

export const useClient = () => {
  const jwt = useAtomValue(jwtAtom);

  const client = useMemo(
    () =>
      ky.create({
        prefix: API_URL,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        timeout: 1000 * 15,
        hooks: {
          afterResponse: [
            ({ response }) => {
              if (response.status === 401) {
                clearAuth();
                window.location.replace(
                  `/login?return_to=${encodeURIComponent(window.location.pathname + window.location.search)}`,
                );
              }
            },
          ],
        },
      }),
    [jwt],
  );

  return {
    client,
  };
};
