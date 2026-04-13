import { getDefaultStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const jwtAtom = atomWithStorage<string | null>(
  'hato.auth',
  null,
  undefined,
  { getOnInit: true },
);

export const userAtom = atomWithStorage<User | null>(
  'hato.user',
  null,
  undefined,
  { getOnInit: true },
);

/**
 * React のコンポーネントツリー外から認証状態をクリアする。
 * ky の afterResponse フックなど、hooks が使えない場面で利用。
 */
export const clearAuth = () => {
  const store = getDefaultStore();
  store.set(jwtAtom, null);
  store.set(userAtom, null);
};
