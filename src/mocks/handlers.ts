/* eslint-disable import/no-extraneous-dependencies, import/prefer-default-export */
import { rest } from 'msw';
import {
  note,
  user,
  subjects,
  periods,
  courses,
  getDaySchedule,
  getPosts,
  scienceRoom,
  getEvents,
  eventTags,
} from './consts';
import attachment from './attachment.pdf';
import profile from './profile.png';
import profile_dark from './profile_dark.png';

export const handlers = [
  rest.post('*/login', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ user, jwt: 'dummy_jwt' }))
  ),
  rest.get('*/user', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ user, jwt: 'dummy_refreshed_jwt' }))
  ),
  rest.get('*/assets/profile', async (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.body(
        await (
          await ctx.fetch(
            req.url.searchParams.get('dark') === '' ? profile_dark : profile
          )
        ).arrayBuffer()
      )
    )
  ),
  rest.get('*/info/grade', (req, res, ctx) => {
    const gradeList = [
      {
        name: '中学1年',
        short_name: '中1',
        type: 'jhs',
        grade_num: 1,
        student_count: 80,
      },
      {
        name: '中学2年',
        short_name: '中2',
        type: 'jhs',
        grade_num: 2,
        student_count: 80,
      },
      {
        name: '中学3年',
        short_name: '中3',
        type: 'jhs',
        grade_num: 3,
        student_count: 80,
      },
      {
        name: '高校1年',
        short_name: '高1',
        type: 'hs',
        grade_num: 1,
        student_count: 280,
      },
      {
        name: '高校2年',
        short_name: '高2',
        type: 'hs',
        grade_num: 2,
        student_count: 280,
      },
      {
        name: '高校3年',
        short_name: '高3',
        type: 'hs',
        grade_num: 3,
        student_count: 280,
      },
    ];

    return res(ctx.status(200), ctx.json(gradeList));
  }),
  rest.get('*/info/class*', (req, res, ctx) => {
    const type = req.url.searchParams.get('type');
    const gradeNum = Number(req.url.searchParams.get('grade'));

    const classList =
      type === 'hs'
        ? [
            {
              name: '1組',
              short_name: '1',
              type: 'hs',
              grade_num: gradeNum,
              class_num: 1,
              student_count: 40,
            },
            {
              name: '2組',
              short_name: '2',
              type: 'hs',
              grade_num: gradeNum,
              class_num: 2,
              student_count: 40,
            },
            {
              name: '3組',
              short_name: '3',
              type: 'hs',
              grade_num: gradeNum,
              class_num: 3,
              student_count: 40,
            },
            {
              name: '4組',
              short_name: '4',
              type: 'hs',
              grade_num: gradeNum,
              class_num: 4,
              student_count: 40,
            },
            {
              name: '5組',
              short_name: '5',
              type: 'hs',
              grade_num: gradeNum,
              class_num: 5,
              student_count: 40,
            },
            {
              name: '6組',
              short_name: '6',
              type: 'hs',
              grade_num: gradeNum,
              class_num: 6,
              student_count: 40,
            },
            {
              name: '7組',
              short_name: '7',
              type: 'hs',
              grade_num: gradeNum,
              class_num: 7,
              student_count: 40,
            },
          ]
        : [
            {
              name: 'A組',
              short_name: 'A',
              type: 'jhs',
              grade_num: gradeNum,
              class_num: 1,
              student_count: 40,
            },
            {
              name: 'B組',
              short_name: 'B',
              type: 'jhs',
              grade_num: gradeNum,
              class_num: 2,
              student_count: 40,
            },
          ];

    return res(ctx.status(200), ctx.json(classList));
  }),
  rest.get('*/info/course', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(courses))
  ),
  rest.get('*/info/subject', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(subjects))
  ),
  rest.get('*/timetable/note', (req, res, ctx) => {
    const notes = [note];

    return res(ctx.status(200), ctx.json(notes));
  }),
  rest.post('*/timetable/note', async (req, res, ctx) =>
    res(ctx.status(200), ctx.json(await req.json()))
  ),
  rest.get('*/timetable/period', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(periods))
  ),
  rest.post('*/timetable/schedule', async (req, res, ctx) =>
    res(ctx.status(200), ctx.json(await req.json()))
  ),
  rest.get('*/timetable', (req, res, ctx) =>
    res(ctx.json(courses.map((course) => getDaySchedule({ course }))))
  ),
  rest.post('*/timetable', async (req, res, ctx) =>
    res(ctx.status(200), ctx.json(await req.json()))
  ),
  rest.get('*/calendar/event', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getEvents()))
  ),
  rest.post('*/calendar/event', async (req, res, ctx) =>
    res(ctx.status(200), ctx.json(await req.json()))
  ),
  rest.post('*/calendar/tags/search', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(eventTags))
  ),
  rest.get('*/post', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getPosts()))
  ),
  rest.get('*/post/attachment/*', async (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.body(await (await ctx.fetch(attachment)).arrayBuffer())
    )
  ),
  rest.get('*/post/*', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getPosts()[1]))
  ),
  rest.get('*/scienceroom', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(scienceRoom))
  ),
];
