import { atom, createStore } from 'jotai';
import { atomWithRefresh } from '@/utils/atoms';

describe('atomWithRefresh', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it('creates a readable and writable atom', () => {
    const refreshable = atomWithRefresh(() => 'hello');
    expect(store.get(refreshable)).toBe('hello');
    // write (refresh) should not throw
    store.set(refreshable);
  });

  it('returns the value from the provided function', () => {
    const refreshable = atomWithRefresh(() => 42);
    expect(store.get(refreshable)).toBe(42);
  });

  it('re-evaluates on refresh', () => {
    let counter = 0;
    const refreshable = atomWithRefresh(() => ++counter);

    expect(store.get(refreshable)).toBe(1);

    store.set(refreshable);
    expect(store.get(refreshable)).toBe(2);

    store.set(refreshable);
    expect(store.get(refreshable)).toBe(3);
  });

  it('can derive from other atoms', () => {
    const baseAtom = atom(10);
    const refreshable = atomWithRefresh((get) => get(baseAtom) * 2);

    expect(store.get(refreshable)).toBe(20);

    store.set(baseAtom, 5);
    expect(store.get(refreshable)).toBe(10);
  });
});
