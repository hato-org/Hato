import { rest } from 'msw';
import { getPosts } from '../consts';
import attachment from '../assets/attachment.pdf';

export default [
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
];
