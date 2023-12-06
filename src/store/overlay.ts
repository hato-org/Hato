import { atomWithStorage } from 'jotai/utils';

interface Overlay {
  menu: boolean;
  cardOrder: boolean;
  whatsNew: boolean;
  userScheduleEditor: string | false;
  userSubjectEditor: string | false;
  classmatchTournament:
    | { year: number; season: ClassmatchSeason; sport: ClassmatchSportId }
    | undefined;
}

export const overlayAtom = atomWithStorage<Overlay>('hato.overlay', {
  menu: false,
  cardOrder: false,
  whatsNew: false,
  userScheduleEditor: false,
  userSubjectEditor: false,
  classmatchTournament: undefined,
});
