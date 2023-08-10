import { IconType } from 'react-icons';
import { TbBallBaseball, TbBallTennis, TbBallVolleyball } from 'react-icons/tb';
import { FaTableTennis, FaFutbol } from 'react-icons/fa';

// eslint-disable-next-line import/prefer-default-export
export const sportIcon: Record<ClassmatchSportId, IconType> = {
  futsal: FaFutbol,
  volleyball: TbBallVolleyball,
  volleyballf: TbBallVolleyball,
  tennis: TbBallTennis,
  tabletennis: FaTableTennis,
  softball: TbBallBaseball,
};
