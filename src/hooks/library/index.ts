import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRecoilValue } from 'recoil';
import { librarySearchParamsSelector } from '@/store/library';

// eslint-disable-next-line import/prefer-default-export
export const useLibrarySearch = () => {
  const params = useRecoilValue(librarySearchParamsSelector);

  return useMutation<
    LibrarySearchResponse,
    AxiosError,
    Partial<LibrarySearchParams> | undefined
  >(async (p) => {
    const books = [];
    let count;
    let version = 1;
    let running;
    const res = (
      await axios.get<LibrarySearchResponse>(
        'https://unitrad.calil.jp/v1/search',
        { params, ...p }
      )
    ).data;
    console.log(res);
    books.push(...res.books);
    running = res.running;
    count = res.count;

    while (running) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => {
        setTimeout(r, 500);
      });
      const pollingRes = (
        await axios.get<LibrarySearchDiffResponse>( // eslint-disable-line no-await-in-loop
          'https://unitrad.calil.jp/v1/polling',
          { params: { uuid: res.uuid, version, diff: 1 } }
        )
      ).data;
      // eslint-disable-next-line no-continue
      if (!pollingRes) continue;
      console.log(pollingRes);
      books.push(...pollingRes.books_diff.insert);
      running = pollingRes.running;
      version = pollingRes.version;
      count = pollingRes.count;
    }
    return { ...res, books, count };
  });
};

export const useBookInfo = (isbn: string) =>
  useQuery(['library', 'book', isbn], async () => {
    const books = [];
    let running;
    let version = 1;
    const res = (
      await axios.get<LibrarySearchResponse>(
        'https://unitrad.calil.jp/v1/search',
        { params: { isbn, region: 'gk-2004103-auf08' } }
      )
    ).data;
    books.push(...res.books);
    running = res.running;
    while (running) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => {
        setTimeout(r, 500);
      });
      const pollingRes = (
        await axios.get<LibrarySearchDiffResponse>( // eslint-disable-line no-await-in-loop
          'https://unitrad.calil.jp/v1/polling',
          { params: { uuid: res.uuid, version, diff: 1 } }
        )
      ).data;
      // eslint-disable-next-line no-continue
      if (!pollingRes) continue;
      console.log(pollingRes);
      books.push(...pollingRes.books_diff.insert);

      running = pollingRes.running;
      version = pollingRes.version;
    }

    return books[0];
  });
