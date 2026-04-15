import { atom } from 'jotai';

export const menuAtom = atom(false);
export const cardOrderDrawerAtom = atom(false);
export const whatsNewAtom = atom(false);
export const userScheduleEditorAtom = atom<string | false>(false);
export const userSubjectEditorAtom = atom<string | false>(false);
export const classmatchTournamentAtom = atom<
  | { year: number; season: ClassmatchSeason; sport: ClassmatchSportId }
  | undefined
>(undefined);
