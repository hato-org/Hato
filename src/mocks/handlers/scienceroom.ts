import { rest } from 'msw';
import { scienceRoom } from '../consts';

export default [
  rest.get('*/scienceroom', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(scienceRoom))
  ),
];
