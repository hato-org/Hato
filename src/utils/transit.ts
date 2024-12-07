import { differenceInMinutes, differenceInSeconds, format } from 'date-fns/esm';

export const formatTimeStringToDate = (date: Date, timeString?: string) =>
  new Date(
    `${format(date, 'yyyy-MM-dd')}T${timeString?.padStart(5, '0')}:00+0900`,
  );

export const formatTimeDifference = (dateLeft: Date, dateRight: Date) => {
  const diffSec = differenceInSeconds(dateLeft, dateRight);
  const diffMin = differenceInMinutes(dateLeft, dateRight);

  return `${diffMin}:${Math.abs(diffSec - 60 * diffMin)
    .toString()
    .padStart(2, '0')}`;
};

export const dayNumberToString = (day: number) => {
  switch (day) {
    case 0:
      return 'sunday';
    case 6:
      return 'saturday';
    default:
      return 'weekdays';
  }
};
