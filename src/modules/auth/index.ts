import { useToast } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jwtAtom, userAtom } from '@/store/auth';
import { unregister } from '@/utils/serviceWorker';

const API_URL = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.host}/api`
  : import.meta.env.VITE_API_URL;

// eslint-disable-next-line import/prefer-default-export
export const useAuth = (scopes?: string[]) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useRecoilState(userAtom);
  const [loginLoading, setLoginLLoading] = useState(false);
  const setJWT = useSetRecoilState(jwtAtom);
  const toast = useToast({
    position: 'top-right',
    variant: 'left-accent',
  });
  const navigate = useNavigate();

  const onFail = useCallback(
    (error: any) => {
      console.error('Error occurred while logging in:', error);

      toast({
        title: 'ログインでエラーが発生しました',
        status: 'error',
      });
    },
    [toast]
  );

  // const login = useCallback(
  //   async ({ credential }: GoogleCredentialResponse) => {
  //     try {
  //       // サーバーにユーザーデータ問い合わせ
  //       const { user: userdata } = await getToken(credential);

  //       // 返却されたJWTとユーザーデータをatomに格納
  //       setUser(userdata);

  //       queryClient.setQueryDefaults(['user', userdata._id], {
  //         staleTime: 1000 * 60 * 10, // 10 mins
  //         cacheTime: Infinity,
  //         refetchInterval: 1000 * 60 * 10, // 10 mins
  //         onSuccess: (newUser: User) => {
  //           setUser(newUser);
  //           console.log('Userdata updated');
  //         },
  //       });
  //       queryClient.setQueryData(['user', userdata._id], userdata);

  //       toast({
  //         title: `${userdata.name}でログインしました。`,
  //         status: 'success',
  //       });

  //       navigate('/dashboard');
  //     } catch (error) {
  //       onFail(error);
  //     }
  //   },
  //   [toast, setUser, navigate, onFail, queryClient]
  // );

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      setLoginLLoading(true);
      const {
        status,
        data: { jwt, user: userData },
      } = await axios.post<LoginResponse>(
        '/user/login',
        { code },
        { baseURL: API_URL }
      );
      if (status !== 200) throw Error('Failed to acquire userdata');

      setJWT(jwt);
      setUser(userData);

      queryClient.setQueryDefaults(['user', userData._id], {
        staleTime: 1000 * 60 * 10, // 10 mins
        cacheTime: Infinity,
        refetchInterval: 1000 * 60 * 10, // 10 mins
        onSuccess: (newUser) => {
          setUser(newUser);
          console.log('Userdata updated');
        },
      });
      queryClient.setQueryData(['user', userData._id], userData);

      queryClient.invalidateQueries(['google']);

      toast({
        title: `${userData.name}でログインしました。`,
        status: 'success',
      });
      setLoginLLoading(false);
    },
    onError: (err) => {
      onFail(err);
      console.error(err);
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

  const update = useMutation<User, AxiosError, Partial<User>>(
    async (newUser) =>
      (
        await axios.post(
          '/user',
          {
            ...newUser,
            _id: user?._id,
          },
          {
            baseURL: API_URL,
          }
        )
      ).data,
    {
      onSuccess: (newUser) => {
        queryClient.invalidateQueries(['user', 'profile']);
        queryClient.setQueryData(['user', newUser._id], newUser);
        setUser(newUser);
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: '保存できませんでした',
          description: error.message,
          status: 'error',
        });
      },
    }
  );

  return { loginLoading, login, logout, update };
};
