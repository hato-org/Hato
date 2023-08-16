import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns/esm';
import { random } from '../utils';

export const getEvents = () => {
  const date = new Date();

  return Array.from({ length: 4 }).map(() => {
    const startAt = random(
      eachDayOfInterval({
        start: startOfMonth(date),
        end: endOfMonth(date),
      })
    );
    const endAt = random(
      eachDayOfInterval({
        start: startAt,
        end: endOfMonth(date),
      })
    );

    return {
      _id: Math.random().toString(32).substring(2),
      title: random(['イベントの例', '夏休み', '読書旬間']),
      startAt,
      endAt,
      isAllDay: true,
      tags: [random(eventTags)],
      url: 'https://example.com/',
      owner: 'hato-mock@example.com',
      external: false,
    };
  });
};

export const eventTags = [
  {
    label: '高1',
    value: 'hs-1',
    color: '',
  },
  {
    label: '高2',
    value: 'hs-2',
    color: '',
  },
  {
    label: '高3',
    value: 'hs-3',
    color: '',
  },
];
