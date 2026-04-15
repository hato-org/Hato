import { useToast } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useSetAtom } from 'jotai';
import ky from 'ky';
import { useNavigate } from 'react-router';
import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
import { useQueryClient } from '@tanstack/react-query';
import { jwtAtom, userAtom } from '@/store/auth';
import { unregister } from '@/utils/serviceWorker';
import { API_URL } from '@/config/api';

export const useAuth = (scopes?: string[]) => {
  const queryClient = useQueryClient();
  const setUser = useSetAtom(userAtom);
  const [loginLoading, setLoginLoading] = useState(false);
  const setJWT = useSetAtom(jwtAtom);
  const toast = useToast({
    position: 'top-right',
    variant: 'left-accent',
  });
  const navigate = useNavigate();

  const onFail = useCallback(
    (
      error: Pick<CodeResponse, 'error' | 'error_description' | 'error_uri'>,
    ) => {
      // eslint-disable-next-line no-console
      console.error('Error occurred while logging in:', error);

      toast({
        title: 'ログインでエラーが発生しました',
        status: 'error',
      });
    },
    [toast],
  );

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      setLoginLoading(true);
      const { jwt, user: userData } = await ky
        .post('auth/login', {
          prefix: API_URL,
          json: { code },
        })
        .json<LoginResponse>();

      setJWT(jwt);
      setUser(userData);

      queryClient.setQueryDefaults(['user', userData._id], {
        staleTime: 1000 * 60 * 10, // 10 mins
        gcTime: Infinity,
        refetchInterval: 1000 * 60 * 10, // 10 mins
      });
      queryClient.setQueryData(['user', userData._id], userData);

      queryClient.invalidateQueries({ queryKey: ['google'] });

      toast({
        title: `${userData.name}でログインしました。`,
        status: 'success',
      });
      setLoginLoading(false);
    },
    onError: (err) => {
      onFail(err);
    },
    flow: 'auth-code',
    hosted_domain: 'g.nagano-c.ed.jp',
    scope: scopes?.join(' '),
  });

  const logout = useCallback(() => {
    setJWT(null);
    setUser(null);
    queryClient.clear();
    unregister();
    navigate('/');
  }, [setUser, setJWT, queryClient, navigate]);

  return { loginLoading, login, logout };
};
