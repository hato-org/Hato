import { HTTPError } from 'ky';
import '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: HTTPError;
  }
}
