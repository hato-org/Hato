import axios, { AxiosError } from 'axios';
import { useRecoilValue } from 'recoil';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { convertToLocalId } from '@/modules/library';
import { librarySearchAtom } from '@/store/library';

export const useBookInfoById = (
  id: string,
  options?: Omit<UseQueryOptions<DetailedBook>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    ...options,
    queryKey: ['library', 'book', id, 'detail'],
    queryFn: async ({ signal }) =>
      (
        await axios.get<DetailedBook>(
          `https://private.calil.jp/bib/gk-2004103-auf08/${convertToLocalId(
            id,
          )}.json`,
          { signal },
        )
      ).data,
  });

export const useBookInfoByISDN = (isbn: string) =>
  useQuery({
    queryKey: ['library', 'book', isbn],
    queryFn: async ({ signal }) => {
      const books = [];
      let running;
      let version = 1;
      const res = (
        await axios.get<LibrarySearchResponse>(
          'https://unitrad.calil.jp/v1/search',
          { params: { isbn, region: 'gk-2004103-auf08' }, signal },
        )
      ).data;
      books.push(...res.books);
      running = res.running;
      while (running) {
        // wait 500ms for polling
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => {
          setTimeout(r, 500);
        });
        const pollingRes = (
          await axios.get<LibrarySearchDiffResponse>( // eslint-disable-line no-await-in-loop
            'https://unitrad.calil.jp/v1/polling',
            { params: { uuid: res.uuid, version, diff: 1 } },
          )
        ).data;
        // eslint-disable-next-line no-continue
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
    AxiosError,
    'free' | 'detail'
  >,
) => {
  const { free, ...params } = useRecoilValue(librarySearchAtom);

  return useMutation<LibrarySearchResponse, AxiosError, 'free' | 'detail'>({
    ...options,
    mutationKey: ['library', 'search', { free, ...params }],
    mutationFn: async (type) => {
      const books = [];
      let count;
      let version = 1;
      let running;
      const res = (
        await axios.get<LibrarySearchResponse>(
          'https://unitrad.calil.jp/v1/search',
          {
            params: {
              ...params,
              free: type === 'free' ? free : undefined,
              region: 'gk-2004103-auf08',
            },
          },
        )
      ).data;
      books.push(...res.books);
      running = res.running;
      count = res.count;

      while (running) {
        // wait 500ms for polling
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => {
          setTimeout(r, 500);
        });
        const pollingRes = (
          await axios.get<LibrarySearchDiffResponse>( // eslint-disable-line no-await-in-loop
            'https://unitrad.calil.jp/v1/polling',
            { params: { uuid: res.uuid, version, diff: 1 } },
          )
        ).data;
        // eslint-disable-next-line no-continue
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
