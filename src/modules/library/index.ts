// eslint-disable-next-line import/prefer-default-export
export const generateISBN13 = (isbn: string) => {
  const isbnNumber = isbn.replaceAll('-', '');
  if (isbnNumber.length === 13) return isbn;

  const checkDigit =
    10 -
    ((9 +
      7 * 3 +
      8 +
      Number(isbnNumber[0]) * 3 +
      Number(isbnNumber[1]) +
      Number(isbnNumber[2]) * 3 +
      Number(isbnNumber[3]) +
      Number(isbnNumber[4]) * 3 +
      Number(isbnNumber[5]) +
      Number(isbnNumber[6]) * 3 +
      Number(isbnNumber[7]) +
      Number(isbnNumber[8]) * 3) %
      10);

  const isbn13 = `978${isbnNumber.substring(0, 9)}${checkDigit}`;
  return isbn13;
};

export const convertToLocalId = (id: string) =>
  id.match(/^Negima_GK_2004103-(.*)/)?.[1] || id;
