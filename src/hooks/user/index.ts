import { UseQueryOptions, useQuery } from '@tanstack/react-query';
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
