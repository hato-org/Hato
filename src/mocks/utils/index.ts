// eslint-disable-next-line import/prefer-default-export
export const random = <T>(options: T[]) =>
  options[Math.floor(Math.random() * options.length)];
