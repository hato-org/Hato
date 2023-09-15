import { IconType } from 'react-icons';
import {
  TbBallBaseball,
  TbBallBasketball,
  TbBallFootball,
  TbBallTennis,
  TbBallVolleyball,
} from 'react-icons/tb';
import { FaTableTennis, FaFutbol } from 'react-icons/fa';
import { IoFootball } from 'react-icons/io5';
import { GiShuttlecock } from 'react-icons/gi';

// eslint-disable-next-line import/prefer-default-export
export const sportIcon: Record<ClassmatchSportId, IconType> = {
  futsal: FaFutbol,
  volleyball: TbBallVolleyball,
  volleyballf: TbBallVolleyball,
  tennis: TbBallTennis,
  tabletennis: FaTableTennis,
  softball: TbBallBaseball,
  football: IoFootball,
  handball: TbBallFootball,
  handballf: TbBallFootball,
  badminton: GiShuttlecock,
  basketball: TbBallBasketball,
  basketballf: TbBallBasketball,
};
