import Clock from './Clock';
import Timetable from './Timetable';
import Events from './Events';
import Error from './Error';
import Info from './Info';
import Hatoboard from './Hatoboard';
import Transit from './Transit';
import Scienceroom from './Scienceroom';
import Classmatch from './Classmatch';

export default {
  Clock,
  Timetable,
  Events,
  Error,
  Info,
  Hatoboard,
  Transit,
  Scienceroom,
  Classmatch,
};

export const cardComponentMap: Record<string, React.ComponentType> = {
  clock: Clock,
  timetable: Timetable,
  transit: Transit,
  events: Events,
  hatoboard: Hatoboard,
  scienceroom: Scienceroom,
  classmatch: Classmatch,
};
