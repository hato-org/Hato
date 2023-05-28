// eslint-disable-next-line import/prefer-default-export
export const getYouTubeID = (url?: string) =>
  url?.match(
    // eslint-disable-next-line no-useless-escape
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|live\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
  )?.[1];
