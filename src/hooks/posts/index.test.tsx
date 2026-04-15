import { renderHook } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { pinnedPostAtom } from '@/store/posts';
import { usePinnedPosts } from '@/hooks/posts';

function createWrapper(store: ReturnType<typeof createStore>) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  Wrapper.displayName = 'JotaiTestWrapper';
  return Wrapper;
}

const posts = [{ _id: 'id1' }, { _id: 'id2' }, { _id: 'id3' }] as Post[];

describe('usePinnedPosts', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it('filters posts by pinned IDs', () => {
    store.set(pinnedPostAtom, ['id1', 'id3']);
    const { result } = renderHook(() => usePinnedPosts(posts), {
      wrapper: createWrapper(store),
    });
    expect(result.current).toEqual([{ _id: 'id1' }, { _id: 'id3' }]);
  });

  it('returns undefined when posts is undefined', () => {
    store.set(pinnedPostAtom, ['id1']);
    const { result } = renderHook(() => usePinnedPosts(undefined), {
      wrapper: createWrapper(store),
    });
    expect(result.current).toBeUndefined();
  });

  it('returns empty array when no posts match pinned IDs', () => {
    store.set(pinnedPostAtom, ['nonexistent']);
    const { result } = renderHook(() => usePinnedPosts(posts), {
      wrapper: createWrapper(store),
    });
    expect(result.current).toEqual([]);
  });

  it('returns all posts when all are pinned', () => {
    store.set(pinnedPostAtom, ['id1', 'id2', 'id3']);
    const { result } = renderHook(() => usePinnedPosts(posts), {
      wrapper: createWrapper(store),
    });
    expect(result.current).toEqual(posts);
  });

  it('returns empty array when pinned list is empty', () => {
    store.set(pinnedPostAtom, []);
    const { result } = renderHook(() => usePinnedPosts(posts), {
      wrapper: createWrapper(store),
    });
    expect(result.current).toEqual([]);
  });
});
