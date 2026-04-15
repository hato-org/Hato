import { createStore } from 'jotai';
import { cards, dashboardEditModeAtom, cardOrderAtom } from '@/store/dashboard';

describe('dashboard', () => {
  describe('cards', () => {
    it('has 7 cards', () => {
      expect(cards).toHaveLength(7);
    });

    it('each card has id, name, and description', () => {
      for (const card of cards) {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('description');
        expect(card.id).toBeTruthy();
        expect(card.name).toBeTruthy();
        expect(card.description).toBeTruthy();
      }
    });

    it('all card ids are unique', () => {
      const ids = cards.map((card) => card.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('dashboardEditModeAtom', () => {
    it('defaults to false', () => {
      const store = createStore();
      expect(store.get(dashboardEditModeAtom)).toBe(false);
    });
  });

  describe('cardOrderAtom', () => {
    let store: ReturnType<typeof createStore>;

    beforeEach(() => {
      localStorage.clear();
      store = createStore();
    });

    it('defaults to [timetable, events, hatoboard]', () => {
      expect(store.get(cardOrderAtom)).toEqual([
        'timetable',
        'events',
        'hatoboard',
      ]);
    });

    it('can be updated', () => {
      const newOrder = ['clock', 'transit', 'timetable'];
      store.set(cardOrderAtom, newOrder);
      expect(store.get(cardOrderAtom)).toEqual(newOrder);
    });
  });
});
