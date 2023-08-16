import { rest } from 'msw';
import { getSportInfo, getUpcomingMatch, sports } from '../consts';

export default [
  rest.get('*/api/classmatch/sports', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(sports))
  ),
  rest.get('*/api/classmatch/:sportId', (req, res, ctx) => {
    const sportId = String(req.params.sportId) as ClassmatchSportId;

    return res(ctx.status(200), ctx.json(getSportInfo(sportId)));
  }),
  rest.get('*/api/classmatch/tournament/upcoming', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getUpcomingMatch()))
  ),
];
