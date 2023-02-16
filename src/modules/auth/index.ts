import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userAtom } from '@/store/auth';
import { unregister } from '@/utils/serviceWorker';

const API_URL = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.host}/api`
  : import.meta.env.VITE_API_URL;

// eslint-disable-next-line import/prefer-default-export
export const useAuth = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useRecoilState(userAtom);
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

  const login = useCallback(
    async ({ credential }: GoogleCredentialResponse) => {
      try {
        // サーバーにユーザーデータ問い合わせ
        const { user: userdata } = await getToken(credential);

        // 返却されたJWTとユーザーデータをatomに格納
        setUser(userdata);

        queryClient.setQueryDefaults(['user'], {
          staleTime: 1000 * 60 * 10, // 10 mins
          cacheTime: Infinity,
          refetchInterval: 1000 * 60 * 10, // 10 mins
          onSuccess: (newUser: User) => {
            setUser(newUser);
            console.log('Userdata updated');
          },
        });
        queryClient.setQueryData(['user', userdata._id], userdata);

        toast({
          title: `${userdata.name}でログインしました。`,
          status: 'success',
        });

        navigate('/dashboard');
      } catch (error) {
        onFail(error);
      }
    },
    [toast, setUser, navigate, onFail, queryClient]
  );

  const logout = useCallback(() => {
    setUser(null);
    queryClient.clear();
    unregister();
    navigate('/');
  }, [setUser, queryClient, navigate]);

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

  return { login, logout, update };
};

const getToken = async (credential: string) => {
  const res = await axios.post(
    '/user/login',
    { token: credential },
    {
      baseURL: API_URL,
    }
  );

  if (res.status !== 200) throw Error('Failed to acquire token');

  return res.data;
};
