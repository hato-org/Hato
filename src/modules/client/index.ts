import ky from 'ky';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { jwtAtom, clearAuth, updateAuth } from '@/store/auth';
import { API_URL } from '@/config/api';
import router from '@/routes';

/**
 * 同時リフレッシュ防止用ミューテックス。
 * 複数リクエストが同時に 401 を受け取った場合、リフレッシュは1回だけ実行される。
 */
let refreshPromise: Promise<string | null> | null = null;

const refreshToken = async (currentJwt: string): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await ky
        .post('auth/refresh', {
          prefix: API_URL,
          headers: { Authorization: `Bearer ${currentJwt}` },
          timeout: 10_000,
          retry: 0,
        })
        .json<LoginResponse>();

      updateAuth(res.jwt, res.user);
      return res.jwt;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

const navigateToLogin = () => {
  router.navigate(
    `/login?return_to=${encodeURIComponent(window.location.pathname + window.location.search)}`,
  );
};

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
            async (request, _options, response) => {
              if (response.status !== 401) return;

              // リフレッシュ済みリクエストの再 401 はログイン画面へ
              if (request.headers.get('X-Token-Refreshed')) {
                clearAuth();
                navigateToLogin();
                return;
              }

              if (!jwt) {
                clearAuth();
                navigateToLogin();
                return;
              }

              const newJwt = await refreshToken(jwt);
              if (!newJwt) {
                clearAuth();
                navigateToLogin();
                return;
              }

              // 新しいトークンでリトライ
              const retryHeaders = new Headers(request.headers);
              retryHeaders.set('Authorization', `Bearer ${newJwt}`);
              retryHeaders.set('X-Token-Refreshed', 'true');

              const retryResponse = await fetch(request.url, {
                method: request.method,
                headers: retryHeaders,
                body: request.body,
                signal: request.signal,
              });

              if (retryResponse.status === 401) {
                clearAuth();
                navigateToLogin();
              }

              return retryResponse;
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
