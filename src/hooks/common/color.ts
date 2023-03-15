// eslint-disable-next-line import/prefer-default-export
export const useStringHSLColor = (str: string) => {
  const strNum = [...str]
    .map((ch) => ch.charCodeAt(0))
    .reduce((a, b) => a + b, 0);

  const colorAngle = strNum % 360;

  return `hsl(${colorAngle} 60% 60%)`;
};
