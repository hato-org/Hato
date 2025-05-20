import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';
import { useClient } from '@/modules/client';
import { jwtAtom, userAtom } from '@/store/auth';
import { useToast } from '@chakra-ui/react';

export const useUser = () => {
  const { client } = useClient();
  const [user, setUser] = useAtom(userAtom);
  const setJWT = useSetAtom(jwtAtom);

  return useQuery({
    queryKey: ['user', user?._id],
    queryFn: async ({ signal }) => {
      const res = (await client.get<LoginResponse>('/user', { signal })).data;
      setJWT(res.jwt);
      setUser(res.user);
      return res.user;
    },
    refetchInterval: 1000 * 60 * 10, // Refresh every 10 mins
    initialData: user!,
    enabled: !!user,
  });
};

export const useUserMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast({ position: 'top-right', duration: 1500 });
  const { client } = useClient();
  const { data: user } = useUser();
  const setUser = useSetAtom(userAtom);

  return useMutation({
    mutationFn: async (newUser: Partial<User>) =>
      (
        await client.post<User>('/user', {
          ...newUser,
          _id: user?._id,
        })
      ).data,
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      queryClient.setQueryData(['user', newUser._id], newUser);
      setUser(newUser);
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      toast({
        title: 'エラーが発生しました',
        description: err.description,
      });
    },
  });
};

export const useUserInfo = (
  id: string,
  options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: ['user', id],
    queryFn: async ({ signal }) =>
      (await client.get<User>(`/user/${id}`, { signal })).data,
  });
};
