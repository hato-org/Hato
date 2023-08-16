import { rest } from 'msw';
import { courses, getClasses, grades, subjects } from '../consts';

export default [
  rest.get('*/info/grade', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(grades))
  ),
  rest.get('*/info/class*', (req, res, ctx) => {
    const type = (req.url.searchParams.get('type') as Type) ?? 'hs';
    const gradeCode = req.url.searchParams.get('grade') as GradeCode;

    return res(ctx.status(200), ctx.json(getClasses(type, gradeCode)));
  }),
  rest.get('*/info/course', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(courses))
  ),
  rest.get('*/info/subject', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(subjects))
  ),
];
