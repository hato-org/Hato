import { createStore } from 'jotai';
import {
  menuAtom,
  cardOrderDrawerAtom,
  whatsNewAtom,
  userScheduleEditorAtom,
  userSubjectEditorAtom,
  classmatchTournamentAtom,
} from '@/store/overlay';

describe('overlay atoms', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe('menuAtom', () => {
    it('defaults to false', () => {
      expect(store.get(menuAtom)).toBe(false);
    });

    it('can be set to true', () => {
      store.set(menuAtom, true);
      expect(store.get(menuAtom)).toBe(true);
    });
  });

  describe('cardOrderDrawerAtom', () => {
    it('defaults to false', () => {
      expect(store.get(cardOrderDrawerAtom)).toBe(false);
    });

    it('can be set to true', () => {
      store.set(cardOrderDrawerAtom, true);
      expect(store.get(cardOrderDrawerAtom)).toBe(true);
    });
  });

  describe('whatsNewAtom', () => {
    it('defaults to false', () => {
      expect(store.get(whatsNewAtom)).toBe(false);
    });

    it('can be set to true', () => {
      store.set(whatsNewAtom, true);
      expect(store.get(whatsNewAtom)).toBe(true);
    });
  });

  describe('userScheduleEditorAtom', () => {
    it('defaults to false', () => {
      expect(store.get(userScheduleEditorAtom)).toBe(false);
    });

    it('can be set to a string value', () => {
      store.set(userScheduleEditorAtom, 'schedule-1');
      expect(store.get(userScheduleEditorAtom)).toBe('schedule-1');
    });

    it('can be set back to false', () => {
      store.set(userScheduleEditorAtom, 'schedule-1');
      store.set(userScheduleEditorAtom, false);
      expect(store.get(userScheduleEditorAtom)).toBe(false);
    });
  });

  describe('userSubjectEditorAtom', () => {
    it('defaults to false', () => {
      expect(store.get(userSubjectEditorAtom)).toBe(false);
    });

    it('can be set to a string value', () => {
      store.set(userSubjectEditorAtom, 'subject-1');
      expect(store.get(userSubjectEditorAtom)).toBe('subject-1');
    });

    it('can be set back to false', () => {
      store.set(userSubjectEditorAtom, 'subject-1');
      store.set(userSubjectEditorAtom, false);
      expect(store.get(userSubjectEditorAtom)).toBe(false);
    });
  });

  describe('classmatchTournamentAtom', () => {
    it('defaults to undefined', () => {
      expect(store.get(classmatchTournamentAtom)).toBeUndefined();
    });

    it('can be set to a tournament object', () => {
      const tournament = {
        year: 2024,
        season: 'summer' as ClassmatchSeason,
        sport: 'volleyball' as ClassmatchSportId,
      };
      store.set(classmatchTournamentAtom, tournament);
      expect(store.get(classmatchTournamentAtom)).toEqual(tournament);
    });

    it('can be set back to undefined', () => {
      store.set(classmatchTournamentAtom, {
        year: 2024,
        season: 'summer' as ClassmatchSeason,
        sport: 'volleyball' as ClassmatchSportId,
      });
      store.set(classmatchTournamentAtom, undefined);
      expect(store.get(classmatchTournamentAtom)).toBeUndefined();
    });
  });
});
