import { rest } from 'msw';
import { user } from '../consts';

export default [
  rest.post('*/login', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ user, jwt: 'dummy_jwt' }))
  ),
  rest.get('*/user', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ user, jwt: 'dummy_refreshed_jwt' }))
  ),
  rest.get('*/user/*', (req, res, ctx) => res(ctx.status(200), ctx.json(user))),
];
