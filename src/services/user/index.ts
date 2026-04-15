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
import { queryKeys } from '../queryKeys';

export const useUser = () => {
  const { client } = useClient();
  const [user, setUser] = useAtom(userAtom);
  const setJWT = useSetAtom(jwtAtom);

  return useQuery({
    queryKey: queryKeys.user.detail(user?._id ?? ''),
    queryFn: async ({ signal }) => {
      const res = await client.get('user', { signal }).json<LoginResponse>();
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
      await client
        .post('user', {
          json: {
            ...newUser,
            _id: user?._id,
          },
        })
        .json<User>(),
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      queryClient.setQueryData(queryKeys.user.detail(newUser._id), newUser);
      setUser(newUser);
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      toast({
        title: 'エラーが発生しました',
        description: err.message,
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
    queryKey: queryKeys.user.detail(id),
    queryFn: async ({ signal }) =>
      await client.get(`user/${id}`, { signal }).json<User>(),
  });
};
