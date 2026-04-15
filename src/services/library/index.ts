import ky, { HTTPError } from 'ky';
import { useAtomValue } from 'jotai';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { convertToLocalId } from '@/modules/library';
import { librarySearchAtom } from '@/store/library';
import { queryKeys } from '../queryKeys';

export const useBookInfoById = (
  id: string,
  options?: Omit<UseQueryOptions<DetailedBook>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    ...options,
    queryKey: queryKeys.library.bookDetail(id),
    queryFn: async ({ signal }) =>
      await ky
        .get(
          `https://private.calil.jp/bib/gk-2004103-auf08/${convertToLocalId(
            id,
          )}.json`,
          { signal },
        )
        .json<DetailedBook>(),
  });

export const useBookInfoByISDN = (isbn: string) =>
  useQuery({
    queryKey: queryKeys.library.bookByIsbn(isbn),
    queryFn: async ({ signal }) => {
      const books = [];
      let running;
      let version = 1;
      const res = await ky
        .get('https://unitrad.calil.jp/v1/search', {
          searchParams: { isbn, region: 'gk-2004103-auf08' },
          signal,
        })
        .json<LibrarySearchResponse>();
      books.push(...res.books);
      running = res.running;
      while (running) {
        signal.throwIfAborted();
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, 500);
          signal.addEventListener(
            'abort',
            () => {
              clearTimeout(timer);
              reject(signal.reason);
            },
            { once: true },
          );
        });
        const pollingRes = await ky
          .get('https://unitrad.calil.jp/v1/polling', {
            searchParams: { uuid: res.uuid, version, diff: 1 },
            signal,
          })
          .json<LibrarySearchDiffResponse>();
        if (!pollingRes) continue;
        books.push(...pollingRes.books_diff.insert);

        running = pollingRes.running;
        version = pollingRes.version;
      }

      return books[0];
    },
  });

export const useLibrarySearch = (
  options?: UseMutationOptions<
    LibrarySearchResponse,
    HTTPError,
    'free' | 'detail'
  >,
) => {
  const { free, ...params } = useAtomValue(librarySearchAtom);

  return useMutation<LibrarySearchResponse, HTTPError, 'free' | 'detail'>({
    ...options,
    mutationKey: queryKeys.library.search({ free, ...params }),
    mutationFn: async (type) => {
      const books = [];
      let count;
      let version = 1;
      let running;
      const MAX_POLLS = 120; // 最大60秒 (500ms × 120)
      let polls = 0;
      const res = await ky
        .get('https://unitrad.calil.jp/v1/search', {
          searchParams: {
            ...params,
            ...(type === 'free' ? { free } : {}),
            region: 'gk-2004103-auf08',
          },
        })
        .json<LibrarySearchResponse>();
      books.push(...res.books);
      running = res.running;
      count = res.count;

      while (running && polls < MAX_POLLS) {
        polls++;
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
        const pollingRes = await ky
          .get('https://unitrad.calil.jp/v1/polling', {
            searchParams: { uuid: res.uuid, version, diff: 1 },
          })
          .json<LibrarySearchDiffResponse>();
        if (!pollingRes) continue;
        books.push(...pollingRes.books_diff.insert);
        running = pollingRes.running;
        version = pollingRes.version;
        count = pollingRes.count;
      }

      return { ...res, books, count };
    },
  });
};
