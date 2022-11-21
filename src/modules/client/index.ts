import axios from 'axios';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/store/auth';

const API_URL = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.host}/api`
  : import.meta.env.VITE_API_URL;

// eslint-disable-next-line import/prefer-default-export
export const useClient = () => {
  const user = useRecoilValue(userAtom);

  const client = useMemo(
    () =>
      axios.create({
        baseURL: API_URL,
        headers: {
          'X-APIKEY': user?.apiKey || '',
        },
        timeout: 1000 * 3,
        timeoutErrorMessage: 'Timeout exceeded',
      }),
    [user]
  );

  return {
    client,
  };
};
