interface Book {
  author: string;
  holdings: number[];
  id: string;
  isbn: string;
  pubdate: string;
  publisher: string;
  source: string;
  title: string;
  url: { [holding: number]: string };
  volume: string;
}

interface LibrarySearchParams {
  free?: string;
  title?: string;
  author?: string;
  publisher?: string;
  ndc?: string;
  year_start?: string;
  year_end?: string;
  isbn?: string;
}

interface LibrarySearchResponse {
  books: Book[];
  count: number;
  errors: string[];
  hash: string;
  messages: string[];
  query: LibrarySearchParams;
  remains: string[];
  running: boolean;
  uuid: string;
  version: number;
}

interface LibrarySearchDiffResponse
  extends Omit<LibrarySearchResponse, 'books'> {
  books_diff: {
    insert: Book[];
    update: Book[];
  };
}
