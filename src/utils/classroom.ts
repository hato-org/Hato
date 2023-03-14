import type { classroom_v1 } from 'googleapis';

// eslint-disable-next-line import/prefer-default-export
export const generateDateFromGCDate = ({
  date,
  timeOfDay,
}: {
  date?: classroom_v1.Schema$Date;
  timeOfDay?: classroom_v1.Schema$TimeOfDay;
}) =>
  new Date(
    date?.year ?? 0,
    (date?.month ?? 0) - 1,
    date?.day ?? 0,
    (timeOfDay?.hours ?? 0) + 9,
    timeOfDay?.minutes ?? 0,
    timeOfDay?.seconds ?? 0
  );
