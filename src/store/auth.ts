import { getDefaultStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { createVersionedStorage } from '@/utils/versionedStorage';

const jwtStorage = createVersionedStorage<string | null>({
  version: 1,
  migrate: (old) => (typeof old === 'string' ? old : null),
});

export const jwtAtom = atomWithStorage<string | null>(
  'hato.auth',
  null,
  jwtStorage,
  { getOnInit: true },
);

const userStorage = createVersionedStorage<User | null>({
  version: 1,
  migrate: (old) => (old && typeof old === 'object' ? (old as User) : null),
});

export const userAtom = atomWithStorage<User | null>(
  'hato.user',
  null,
  userStorage,
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

/**
 * React のコンポーネントツリー外から認証情報を更新する。
 * トークンリフレッシュ時に利用。
 */
export const updateAuth = (jwt: string, user: User) => {
  const store = getDefaultStore();
  store.set(jwtAtom, jwt);
  store.set(userAtom, user);
};
