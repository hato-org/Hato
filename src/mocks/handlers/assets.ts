import { rest } from 'msw';
import profile from '../assets/profile.png';
import profile_dark from '../assets/profile_dark.png';

export default [
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
];
