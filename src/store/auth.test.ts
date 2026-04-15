import { getDefaultStore } from 'jotai';
import { jwtAtom, userAtom, clearAuth, updateAuth } from '@/store/auth';

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear();
    const store = getDefaultStore();
    store.set(jwtAtom, null);
    store.set(userAtom, null);
  });

  describe('jwtAtom', () => {
    it('defaults to null', () => {
      const store = getDefaultStore();
      expect(store.get(jwtAtom)).toBeNull();
    });
  });

  describe('userAtom', () => {
    it('defaults to null', () => {
      const store = getDefaultStore();
      expect(store.get(userAtom)).toBeNull();
    });
  });

  describe('clearAuth', () => {
    it('sets jwt and user to null', () => {
      const store = getDefaultStore();
      store.set(jwtAtom, 'some-token');
      store.set(userAtom, { _id: 'u1', name: 'Test' } as User);

      clearAuth();

      expect(store.get(jwtAtom)).toBeNull();
      expect(store.get(userAtom)).toBeNull();
    });
  });

  describe('updateAuth', () => {
    it('sets jwt and user to provided values', () => {
      const store = getDefaultStore();
      const user = { _id: 'u1', name: 'Test User' } as User;

      updateAuth('new-token', user);

      expect(store.get(jwtAtom)).toBe('new-token');
      expect(store.get(userAtom)).toEqual(user);
    });
  });

  describe('clearAuth after updateAuth', () => {
    it('resets jwt and user to null', () => {
      const store = getDefaultStore();
      const user = { _id: 'u1', name: 'Test User' } as User;

      updateAuth('token', user);
      expect(store.get(jwtAtom)).toBe('token');
      expect(store.get(userAtom)).toEqual(user);

      clearAuth();
      expect(store.get(jwtAtom)).toBeNull();
      expect(store.get(userAtom)).toBeNull();
    });
  });
});
