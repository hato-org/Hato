import axios from 'axios';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { jwtAtom } from '@/store/auth';

const API_URL = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.host}/api`
  : import.meta.env.VITE_API_URL;

// eslint-disable-next-line import/prefer-default-export
export const useClient = () => {
  const jwt = useRecoilValue(jwtAtom);

  const client = useMemo(
    () =>
      axios.create({
        baseURL: API_URL,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        timeout: 1000 * 15,
        timeoutErrorMessage: 'Timeout exceeded',
      }),
    [jwt]
  );

  return {
    client,
  };
};
