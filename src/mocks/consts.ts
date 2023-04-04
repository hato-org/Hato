import {
  parse,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
} from 'date-fns/esm';

const random = <T>(options: T[]) =>
  options[Math.floor(Math.random() * options.length)];

export const user: User = {
  _id: '62efdafbe2291854ca4b18e0',
  role: 'user',
  avatar: 'https://hato.cf/hato.png',
  type: 'hs',
  grade: 2,
  class: 4,
  course: 'lib1',
  email: 'hato-mock@example.com',
  apiKey: 'dummy_apikey',
  name: '屋代 太郎',
  contributionCount: 0,
  createdAt: '2022-08-07T15:32:11.470Z',
};

export const note: Note = {
  _id: '63bd71fb55ebfd18790aaaa0',
  date: new Date('2023-01-09T15:00:00.000Z'),
  target: [
    {
      name: '1組',
      short_name: '1',
      type: 'hs',
      grade_num: 2,
      class_num: 1,
      student_count: 40,
    },
    {
      name: '2組',
      short_name: '2',
      type: 'hs',
      grade_num: 2,
      class_num: 2,
      student_count: 40,
    },
    {
      name: '3組',
      short_name: '3',
      type: 'hs',
      grade_num: 2,
      class_num: 3,
      student_count: 40,
    },
    {
      name: '4組',
      short_name: '4',
      type: 'hs',
      grade_num: 2,
      class_num: 4,
      student_count: 40,
    },
    {
      name: '5組',
      short_name: '5',
      type: 'hs',
      grade_num: 2,
      class_num: 5,
      student_count: 40,
    },
    {
      name: '6組',
      short_name: '6',
      type: 'hs',
      grade_num: 2,
      class_num: 6,
      student_count: 40,
    },
    {
      name: '7組',
      short_name: '7',
      type: 'hs',
      grade_num: 2,
      class_num: 7,
      student_count: 40,
    },
  ],
  message: 'Mock note',
  owner: 'hato-mock@example.com',
};

export const courses: CourseInfo[] = [
  {
    name: '文系1',
    short_name: '文1',
    student_count: 0,
    category: 'liberal',
    code: 'lib1',
  },
  {
    name: '文系2',
    short_name: '文2',
    student_count: 0,
    category: 'liberal',
    code: 'lib2',
  },
  {
    name: '文系3',
    short_name: '文3',
    student_count: 0,
    category: 'liberal',
    code: 'lib3',
  },
  {
    name: '理系1',
    short_name: '理1',
    student_count: 0,
    category: 'science',
    code: 'sci1',
  },
  {
    name: '理系2',
    short_name: '理2',
    student_count: 0,
    category: 'science',
    code: 'sci2',
  },
  {
    name: '理系3',
    short_name: '理3',
    student_count: 0,
    category: 'science',
    code: 'sci3',
  },
];

export const subjects = [
  { code: 'mathAlpha', name: '数学α', description: '' },
  { code: 'mathBeta', name: '数学β', description: '' },
  { code: 'basicChemistry', name: '化学基礎', description: '' },
  { code: 'advancedChemistry', name: '化学', description: '' },
  { code: 'basicBiology', name: '生物基礎', description: '' },
  { code: 'advancedBiology', name: '生物', description: '' },
  { code: 'basicPhysics', name: '物理基礎', description: '' },
  { code: 'advancedPhysics', name: '物理', description: '' },
  { code: 'basicEarthScience', name: '地学基礎', description: '' },
  { code: 'worldHistory', name: '世界史', description: '' },
  { code: 'jpHistory', name: '日本史', description: '' },
  { code: 'geography', name: '地理', description: '' },
  { code: 'geo-history', name: '地理 / 日本史', description: '' },
  { code: 'modernSociety', name: '現代社会', description: '' },
  { code: 'communicationEnglish', name: 'コミュ英', description: '' },
  { code: 'expressionEnglish', name: '英語表現', description: '' },
  { code: 'modernJapanese', name: '現代文', description: '' },
  { code: 'classicJapanese', name: '古典', description: '' },
  { code: 'basicHomeEconomics', name: '家庭基礎', description: '' },
  { code: 'physicalEducation', name: '体育', description: '' },
  { code: 'healthEducation', name: '保健', description: '' },
  { code: 'art', name: '芸術', description: '' },
  { code: 'inquiryLearning', name: '課題探究', description: '' },
  { code: 'LHR', name: 'LHR', description: '' },
  { code: 'lunch', name: '昼食', description: '' },
  { code: 'cleaning', name: '掃除', description: '' },
];

export const periods = [
  { start: 1, end: 1, startAt: '08:45', endAt: '09:30' },
  { start: 2, end: 2, startAt: '09:40', endAt: '10:25' },
  { start: 3, end: 3, startAt: '10:35', endAt: '11:20' },
  { start: 4, end: 4, startAt: '11:30', endAt: '12:15' },
  { start: 5, end: 5, startAt: '13:15', endAt: '14:00' },
  { start: 6, end: 6, startAt: '14:10', endAt: '14:55' },
];

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

export const getPosts = () =>
  Array.from({ length: 15 }).map(() => ({
    _id: Math.random().toString(32).substring(2),
    title: random([
      '投稿の例',
      '学年通信○○号',
      '自転車ヘルメット努力義務化',
      '卒業式について',
      '入学式について',
    ]),
    attachments: [
      {
        id: 'hato_post_attachment',
        name: '資料1.pdf',
        fileType: 'application/pdf',
        url: 'https://demo.hato.cf/資料1.pdf',
      },
    ],
    tags: [
      random([
        {
          label: '校内',
          value: 'private',
          color: '',
        },
        {
          label: '校外',
          value: 'public',
          color: '',
        },
      ]),
    ],
    contact: 'post-contact@example.com',
    owner: '屋代 太郎',
    createdAt: '2022-01-10T15:00:00.000Z',
  }));

export const scienceRoom = {
  _id: '63e7c3799d7d91ad089939fd',
  date: '2023-02-12T15:00:00.000Z',
  createdAt: '2023-02-11T16:34:01.452Z',
  roomTable: [
    {
      name: '技術室',
      table: ['\n', '\n', '\n', '中１理科\n１－２', '\n', '\n'],
    },
    {
      name: '化学',
      table: ['\n', '\n', '化学\n②理２', '\n', '化学\n２－７', '\n'],
    },
    {
      name: '実験室',
      table: ['\n', '', '\n', '', '予備実験', '予備実験'],
    },
    {
      name: '物理',
      table: [
        '',
        '\n',
        '物理基礎\n②理１',
        '\n',
        '物理基礎\n②理３',
        '物理基礎\n②理２',
      ],
    },
    {
      name: '生物',
      table: ['', '', '', '', '', '\n'],
    },
    {
      name: '講義室',
      table: ['\n', '', '', '中３英語'],
    },
    {
      name: '地学',
      table: ['\n', '\n', '', '', '', '\n'],
    },
    {
      name: 'HR1',
      table: ['', '\n', '\n', '\n', '\n', '化学\n②理３'],
    },
    {
      name: 'HR2',
      table: [
        '化学基礎\n１－２',
        '\n',
        '化学基礎\n１－３',
        '\n',
        '化学\n１－７',
        '化学基礎\n１－５',
      ],
    },
    {
      name: 'HR3',
      table: [
        '生物基礎\n１－６',
        '\n',
        '生物基礎\n１－２',
        '理数生物\n１－７',
        '\n',
        '生物基礎\n１－３',
      ],
    },
  ],
  updatedAt: '2023-02-13T06:15:00.594Z',
};
