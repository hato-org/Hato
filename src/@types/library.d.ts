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

interface DetailedBook {
  author: string[];
  class: string[];
  free: string[];
  holdings_count: number;
  id: string;
  isbn: string;
  normalized_isbn: string;
  page: `${number}p`;
  pubdate: (string | number)[];
  publisher: string[];
  raw_holdings: BookHolding[];
  size: `${number}cm`;
  source_count: number;
  source_systemid: null;
  source_timestamp: [];
  source_type: string[];
  source_url: string;
  timestamp: string;
  title: string[];
  title_exact: string;
  url: string;
  volume: string[];
}

interface BookHolding {
  callno: string;
  id: string;
  library: string;
  place: string;
  status: string;
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
