import { rest } from 'msw';
import { eventTags, getEvents } from '../consts';

export default [
  rest.get('*/calendar/event', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getEvents()))
  ),
  rest.post('*/calendar/event', async (req, res, ctx) =>
    res(ctx.status(200), ctx.json(await req.json()))
  ),
  rest.post('*/calendar/tags/search', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(eventTags))
  ),
];
