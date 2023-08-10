import { useToast } from '@chakra-ui/react';
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useClient } from '@/modules/client';
import { jwtAtom, userAtom } from '@/store/auth';

export const useUser = () => {
  const { client } = useClient();
  const [user, setUser] = useRecoilState(userAtom);
  const setJWT = useSetRecoilState(jwtAtom);

  return useQuery<User, AxiosError>(
    ['user', user?._id],
    async () => {
      const res = (await client.get<LoginResponse>('/user')).data;

      setJWT(res.jwt);
      return res.user;
    },
    {
      refetchInterval: 1000 * 60 * 10,
      initialData: user!,
      onSuccess: (newUser) => {
        setUser(newUser);
      },
      enabled: !!user,
    }
  );
};

export const useUserMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { client } = useClient();
  const { data: user } = useUser();
  const setUser = useSetRecoilState(userAtom);

  return useMutation<User, AxiosError, Partial<User>>(
    async (newUser) =>
      (
        await client.post('/user', {
          ...newUser,
          _id: user?._id,
        })
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
};

export const useUserInfo = (
  { id }: { id?: string },
  options: UseQueryOptions<User, AxiosError>
) => {
  const { client } = useClient();

  return useQuery<User, AxiosError>(
    ['user', id],
    async () => (await client.get(`/user/${id}`)).data,
    options
  );
};
