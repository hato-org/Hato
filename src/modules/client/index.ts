import axios from 'axios';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/store/auth';

// eslint-disable-next-line import/prefer-default-export
export const useClient = () => {
  const user = useRecoilValue(userAtom);

  const API_URL = import.meta.env.PROD
    ? 'https://api.hato.cf:11117'
    : `${window.location.protocol}//${window.location.host}/api`;

  const client = useMemo(
    () =>
      axios.create({
        baseURL: API_URL,
        headers: {
          'X-APIKEY': user?.apiKey || '',
        },
      }),
    [user, API_URL]
  );

  return {
    client,
  };
};
