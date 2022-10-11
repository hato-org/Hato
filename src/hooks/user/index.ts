import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRecoilState } from 'recoil';
import { useClient } from '@/modules/client';
import { userAtom } from '@/store/auth';

// eslint-disable-next-line import/prefer-default-export
export const useUser = () => {
  const { client } = useClient();
  const [user, setUser] = useRecoilState(userAtom);

  return useQuery<User, AxiosError>(
    ['user', user?._id],
    async () => (await client.get('/user')).data,
    {
      initialData: user!,
      onSuccess: (newUser) => {
        setUser(newUser);
      },
    }
  );
};
