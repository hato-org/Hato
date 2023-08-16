import { parse } from 'date-fns/esm';
import { random } from '../utils';
import { periods, subjects } from './info';

export const getDaySchedule = ({ course }: { course: CourseInfo }) => {
  const date = new Date();
  return {
    _id: '63b6edd65ab4b3660e72ee46',
    date,
    timetable: periods.map((period) => ({
      ...period,
      startAt: parse(period.startAt, 'HH:mm', date),
      endAt: parse(period.endAt, 'HH:mm', date),
      subject: random(subjects),
    })),
    schedule: {
      week: random(['A', 'B']),
      day: random([1, 2, 3, 4, 5]),
      irregular: false,
    },
    target: [{ type: 'hs', grade: 2, class: 4, course: course.code }],
    meta: {
      type: 'hs',
      grade: 2,
      class: 4,
      course,
    },
  };
};

export const getNotes = (count: number): Note[] =>
  Array.from({ length: count }).map(() => ({
    _id: '63bd71fb55ebfd18790aaaa0',
    date: new Date('2023-01-09T15:00:00.000Z'),
    target: [
      {
        name: '1組',
        shortName: '1',
        type: 'hs',
        gradeCode: '2',
        classCode: '1',
        studentCount: 40,
      },
      {
        name: '2組',
        shortName: '2',
        type: 'hs',
        gradeCode: '2',
        classCode: '2',
        studentCount: 40,
      },
      {
        name: '3組',
        shortName: '3',
        type: 'hs',
        gradeCode: '2',
        classCode: '3',
        studentCount: 40,
      },
      {
        name: '4組',
        shortName: '4',
        type: 'hs',
        gradeCode: '2',
        classCode: '4',
        studentCount: 40,
      },
      {
        name: '5組',
        shortName: '5',
        type: 'hs',
        gradeCode: '2',
        classCode: '5',
        studentCount: 40,
      },
      {
        name: '6組',
        shortName: '6',
        type: 'hs',
        gradeCode: '2',
        classCode: '6',
        studentCount: 40,
      },
      {
        name: '7組',
        shortName: '7',
        type: 'hs',
        gradeCode: '2',
        classCode: '7',
        studentCount: 40,
      },
    ],
    message: random(['5分短縮授業', '購買なし', '掃除なし・昼食あり']),
    owner: 'hato-mock@example.com',
  }));
