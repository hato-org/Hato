import { rest } from 'msw';
import { courses, getDaySchedule, getNotes, periods } from '../consts';
import { random } from '../utils';

export default [
  rest.get('*/timetable/note', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getNotes(random([1, 2, 3]))))
  ),
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
];
