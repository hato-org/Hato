import ky from 'ky';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { jwtAtom } from '@/store/auth';

const API_URL = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.host}/api`
  : import.meta.env.VITE_API_URL;

export const useClient = () => {
  const jwt = useAtomValue(jwtAtom);

  const client = useMemo(
    () =>
      ky.create({
        prefix: API_URL,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        timeout: 1000 * 15,
      }),
    [jwt],
  );

  return {
    client,
  };
};
