import { rest } from 'msw';
import { getSportInfo, getUpcomingMatch, sports, streams } from '../consts';

const API_URL = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.host}/api`
  : import.meta.env.VITE_API_URL;

export default [
  rest.get(`${API_URL}/classmatch/sports`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(sports))
  ),
  rest.get(`${API_URL}/classmatch/streams`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(streams))
  ),
  rest.get(`${API_URL}/classmatch/:sportId`, (req, res, ctx) => {
    const sportId = String(req.params.sportId) as ClassmatchSportId;

    return res(ctx.status(200), ctx.json(getSportInfo(sportId)));
  }),
  rest.get(`${API_URL}/classmatch/tournament/upcoming`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(getUpcomingMatch()))
  ),
];
