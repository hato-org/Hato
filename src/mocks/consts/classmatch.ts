import { random } from '../utils';

export const sports = [
  {
    id: 'volleyball',
    name: 'バレーボール',
  },
  {
    id: 'softball',
    name: 'ソフトボール',
  },
  {
    id: 'tennis',
    name: 'テニス',
  },
];

export const streams = [];

export const getUpcomingMatch = () =>
  Array.from({ length: random([4, 6, 8]) })
    .map(() => ({
      location: random([
        '一体A面',
        '一体C面',
        '二体D面',
        '校庭A面',
        '校庭B面',
        'テニスコート',
      ]),
      startAt: new Date(
        Date.now() + random([0, 1000 * 60 * 20, 1000 * 60 * 40, 1000 * 60 * 60])
      ).toISOString(),
      endAt: null,
      matchId: Math.random().toString(),
      name: random(['バレーボール', 'ソフトボール', 'テニス']),
      id: 'volleyball',
    }))
    .sort((a, b) => Date.parse(a.startAt ?? '') - Date.parse(b.startAt ?? ''));

export const getSportInfo = (sportId: ClassmatchSportId) => {
  const sport = sports.find(({ id }) => id === sportId);

  return {
    id: sport?.id,
    name: sport?.name,
    map: 'ground',
    tournament: {
      id: '0',
      participants: [
        {
          point: 24,
          from: '1-1',
          type: 'teacher',
          grade: '',
          class: '',
        },
        {
          point: 3,
          from: '1-0',
          type: 'hs',
          grade: '3',
          class: '5',
        },
      ],
      meta: {
        location: '校庭A面',
        startAt: '2023-06-08T06:20:00.000Z',
        endAt: null,
      },
      match: [
        {
          id: '1-0',
          participants: [
            {
              point: 1,
              from: '1-0-0',
              type: 'hs',
              grade: '3',
              class: '6',
            },
            {
              point: 2,
              from: '1-0-1',
              type: 'hs',
              grade: '3',
              class: '5',
            },
          ],
          meta: {
            location: '校庭A面',
            startAt: '2023-06-08T05:10:00.000Z',
            endAt: null,
          },
          match: [
            {
              id: '1-0-0',
              participants: [
                {
                  point: 3,
                  from: '1-0-0-0',
                  type: 'hs',
                  grade: '3',
                  class: '2',
                },
                {
                  point: 10,
                  from: '1-0-0-1',
                  type: 'hs',
                  grade: '3',
                  class: '6',
                },
              ],
              meta: {
                location: '校庭A面',
                startAt: '2023-06-08T04:00:00.000Z',
                endAt: null,
              },
              match: [
                {
                  id: '1-0-0-0',
                  participants: [
                    {
                      point: 16,
                      from: '1-0-0-0-0',
                      type: 'hs',
                      grade: '3',
                      class: '2',
                    },
                    {
                      point: 2,
                      from: '1-0-0-0-1',
                      type: 'hs',
                      grade: '1',
                      class: '1',
                    },
                  ],
                  meta: {
                    location: '校庭A面',
                    startAt: '2023-06-07T03:10:00.000Z',
                    endAt: null,
                  },
                  match: [
                    {
                      id: '1-0-0-0-0',
                      participants: [
                        {
                          point: 12,
                          from: '1-0-0-0-0-0',
                          type: 'hs',
                          grade: '3',
                          class: '2',
                        },
                        {
                          point: 1,
                          from: '1-0-0-0-0-1',
                          type: 'hs',
                          grade: '2',
                          class: '6',
                        },
                      ],
                      meta: {
                        location: '校庭C面',
                        startAt: '2023-06-07T01:50:00.000Z',
                        endAt: null,
                      },
                      match: [
                        {
                          id: '1-0-0-0-0-0',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '3',
                            class: '2',
                          },
                        },
                        {
                          id: '1-0-0-0-0-1',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '2',
                            class: '6',
                          },
                        },
                      ],
                      editHistory: [
                        {
                          userId: '6431c75be531c04d67d87b0c',
                          date: '2023-06-02T09:52:52.177Z',
                        },
                        {
                          userId: '647fd23da360f609fef7720c',
                          date: '2023-06-07T00:51:11.863Z',
                        },
                        {
                          userId: '6431c75be531c04d67d87b0c',
                          date: '2023-06-07T02:50:50.417Z',
                        },
                      ],
                    },
                    {
                      id: '1-0-0-0-1',
                      participants: [],
                      meta: {
                        location: null,
                        startAt: null,
                        endAt: null,
                      },
                      class: {
                        type: 'hs',
                        grade: '1',
                        class: '1',
                      },
                    },
                  ],
                  editHistory: [
                    {
                      userId: '63ea263132db1bc048a1457b',
                      date: '2023-06-07T04:24:06.375Z',
                    },
                  ],
                },
                {
                  id: '1-0-0-1',
                  participants: [
                    {
                      point: 1,
                      from: '1-0-0-1-1',
                      type: 'hs',
                      grade: '1',
                      class: '5',
                    },
                    {
                      point: 8,
                      from: '1-0-0-1-0',
                      type: 'hs',
                      grade: '3',
                      class: '6',
                    },
                  ],
                  meta: {
                    location: '校庭A面',
                    startAt: '2023-06-07T04:30:00.000Z',
                    endAt: null,
                  },
                  match: [
                    {
                      id: '1-0-0-1-0',
                      participants: [
                        {
                          point: 0,
                          from: '1-0-0-1-0-0',
                          type: 'hs',
                          grade: '1',
                          class: '2',
                        },
                        {
                          point: 19,
                          from: '1-0-0-1-0-1',
                          type: 'hs',
                          grade: '3',
                          class: '6',
                        },
                      ],
                      meta: {
                        location: '校庭B面',
                        startAt: '2023-06-07T00:30:00.000Z',
                        endAt: null,
                      },
                      match: [
                        {
                          id: '1-0-0-1-0-0',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '1',
                            class: '2',
                          },
                        },
                        {
                          id: '1-0-0-1-0-1',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '3',
                            class: '6',
                          },
                        },
                      ],
                      editHistory: [
                        {
                          userId: '6431c75be531c04d67d87b0c',
                          date: '2023-06-07T01:37:11.297Z',
                        },
                      ],
                    },
                    {
                      id: '1-0-0-1-1',
                      participants: [],
                      meta: {
                        location: null,
                        startAt: null,
                        endAt: null,
                      },
                      class: {
                        type: 'hs',
                        grade: '1',
                        class: '5',
                      },
                    },
                  ],
                  editHistory: [
                    {
                      userId: '6431c75be531c04d67d87b0c',
                      date: '2023-06-07T05:24:34.218Z',
                    },
                  ],
                },
              ],
              editHistory: [
                {
                  userId: '6431c75be531c04d67d87b0c',
                  date: '2023-06-08T05:09:39.649Z',
                },
                {
                  userId: '6431c75be531c04d67d87b0c',
                  date: '2023-06-08T05:09:40.758Z',
                },
              ],
            },
            {
              id: '1-0-1',
              participants: [
                {
                  point: 7,
                  from: '1-0-1-1',
                  type: 'hs',
                  grade: '3',
                  class: '5',
                },
                {
                  point: 5,
                  from: '1-0-1-0',
                  type: 'hs',
                  grade: '3',
                  class: '7',
                },
              ],
              meta: {
                location: '校庭B面',
                startAt: '2023-06-08T04:00:00.000Z',
                endAt: null,
              },
              match: [
                {
                  id: '1-0-1-0',
                  participants: [
                    {
                      point: 27,
                      from: '1-0-1-0-0',
                      type: 'hs',
                      grade: '3',
                      class: '7',
                    },
                    {
                      point: 1,
                      from: '1-0-1-0-1',
                      type: 'jhs',
                      grade: '3',
                      class: 'A',
                    },
                  ],
                  meta: {
                    location: '校庭B面',
                    startAt: '2023-06-07T03:10:00.000Z',
                    endAt: null,
                  },
                  match: [
                    {
                      id: '1-0-1-0-0',
                      participants: [
                        {
                          point: 15,
                          from: '1-0-1-0-0-0',
                          type: 'hs',
                          grade: '3',
                          class: '7',
                        },
                        {
                          point: 3,
                          from: '1-0-1-0-0-1',
                          type: 'hs',
                          grade: '2',
                          class: '4',
                        },
                      ],
                      meta: {
                        location: '校庭A面',
                        startAt: '2023-06-07T01:50:00.000Z',
                        endAt: null,
                      },
                      match: [
                        {
                          id: '1-0-1-0-0-0',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '3',
                            class: '7',
                          },
                        },
                        {
                          id: '1-0-1-0-0-1',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '2',
                            class: '4',
                          },
                        },
                      ],
                      editHistory: [
                        {
                          userId: '6431c75be531c04d67d87b0c',
                          date: '2023-06-07T02:53:35.450Z',
                        },
                      ],
                    },
                    {
                      id: '1-0-1-0-1',
                      participants: [],
                      meta: {
                        location: null,
                        startAt: null,
                        endAt: null,
                      },
                      class: {
                        type: 'jhs',
                        grade: '3',
                        class: 'A',
                      },
                    },
                  ],
                  editHistory: [
                    {
                      userId: '63ea263132db1bc048a1457b',
                      date: '2023-06-07T04:24:26.847Z',
                    },
                  ],
                },
                {
                  id: '1-0-1-1',
                  participants: [
                    {
                      point: 12,
                      from: '1-0-1-1-0',
                      type: 'hs',
                      grade: '3',
                      class: '5',
                    },
                    {
                      point: 1,
                      from: '1-0-1-1-1',
                      type: 'hs',
                      grade: '2',
                      class: '2',
                    },
                  ],
                  meta: {
                    location: '校庭B面',
                    startAt: '2023-06-07T04:30:00.000Z',
                    endAt: null,
                  },
                  match: [
                    {
                      id: '1-0-1-1-0',
                      participants: [
                        {
                          point: 25,
                          from: '1-0-1-1-0-1',
                          type: 'hs',
                          grade: '3',
                          class: '5',
                        },
                        {
                          point: 7,
                          from: '1-0-1-1-0-0',
                          type: 'jhs',
                          grade: '3',
                          class: 'B',
                        },
                      ],
                      meta: {
                        location: '校庭B面',
                        startAt: '2023-06-07T01:50:00.000Z',
                        endAt: null,
                      },
                      match: [
                        {
                          id: '1-0-1-1-0-0',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'jhs',
                            grade: '3',
                            class: 'B',
                          },
                        },
                        {
                          id: '1-0-1-1-0-1',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '3',
                            class: '5',
                          },
                        },
                      ],
                      editHistory: [
                        {
                          userId: '6431c75be531c04d67d87b0c',
                          date: '2023-06-07T02:55:25.675Z',
                        },
                      ],
                    },
                    {
                      id: '1-0-1-1-1',
                      participants: [],
                      meta: {
                        location: null,
                        startAt: null,
                        endAt: null,
                      },
                      class: {
                        type: 'hs',
                        grade: '2',
                        class: '2',
                      },
                    },
                  ],
                  editHistory: [
                    {
                      userId: '6431c75be531c04d67d87b0c',
                      date: '2023-06-07T05:25:27.856Z',
                    },
                  ],
                },
              ],
              editHistory: [
                {
                  userId: '6431c75be531c04d67d87b0c',
                  date: '2023-06-08T05:10:00.788Z',
                },
              ],
            },
          ],
          editHistory: [
            {
              userId: '6431c75be531c04d67d87b0c',
              date: '2023-06-08T07:34:02.223Z',
            },
          ],
        },
        {
          id: '1-1',
          participants: [
            {
              point: 21,
              from: '1-1-0',
              type: 'teacher',
              grade: '',
              class: '',
            },
            {
              point: 1,
              from: '1-1-1',
              type: 'hs',
              grade: '2',
              class: '1',
            },
          ],
          meta: {
            location: '校庭C面',
            startAt: '2023-06-08T05:10:00.000Z',
            endAt: null,
          },
          match: [
            {
              id: '1-1-0',
              participants: [
                {
                  point: 10,
                  from: '1-1-0-0',
                  type: 'teacher',
                  grade: '',
                  class: '',
                },
                {
                  point: 4,
                  from: '1-1-0-1',
                  type: 'hs',
                  grade: '3',
                  class: '3',
                },
              ],
              meta: {
                location: '校庭C面',
                startAt: '2023-06-08T04:00:00.000Z',
                endAt: null,
              },
              match: [
                {
                  id: '1-1-0-0',
                  participants: [
                    {
                      point: 14,
                      from: '1-1-0-0-1',
                      type: 'teacher',
                      grade: '',
                      class: '',
                    },
                    {
                      point: 4,
                      from: '1-1-0-0-0',
                      type: 'hs',
                      grade: '2',
                      class: '5',
                    },
                  ],
                  meta: {
                    location: '校庭C面',
                    startAt: '2023-06-07T03:10:00.000Z',
                    endAt: null,
                  },
                  match: [
                    {
                      id: '1-1-0-0-0',
                      participants: [
                        {
                          point: 2,
                          from: '1-1-0-0-0-1',
                          type: 'hs',
                          grade: '1',
                          class: '4',
                        },
                        {
                          point: 13,
                          from: '1-1-0-0-0-0',
                          type: 'hs',
                          grade: '2',
                          class: '5',
                        },
                      ],
                      meta: {
                        location: '校庭C面',
                        startAt: '2023-06-07T00:30:00.000Z',
                        endAt: null,
                      },
                      match: [
                        {
                          id: '1-1-0-0-0-0',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '2',
                            class: '5',
                          },
                        },
                        {
                          id: '1-1-0-0-0-1',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '1',
                            class: '4',
                          },
                        },
                      ],
                      editHistory: [
                        {
                          userId: '6431c75be531c04d67d87b0c',
                          date: '2023-06-07T01:36:47.168Z',
                        },
                      ],
                    },
                    {
                      id: '1-1-0-0-1',
                      participants: [],
                      meta: {
                        location: null,
                        startAt: null,
                        endAt: null,
                      },
                      class: {
                        type: 'teacher',
                        grade: '',
                        class: '',
                      },
                    },
                  ],
                  editHistory: [
                    {
                      userId: '6431c75be531c04d67d87b0c',
                      date: '2023-06-07T05:24:01.325Z',
                    },
                    {
                      userId: '6431c75be531c04d67d87b0c',
                      date: '2023-06-07T05:24:02.447Z',
                    },
                  ],
                },
                {
                  id: '1-1-0-1',
                  participants: [
                    {
                      point: 2,
                      from: '1-1-0-1-1',
                      type: 'hs',
                      grade: '2',
                      class: '3',
                    },
                    {
                      point: 16,
                      from: '1-1-0-1-0',
                      type: 'hs',
                      grade: '3',
                      class: '3',
                    },
                  ],
                  meta: {
                    location: '校庭C面',
                    startAt: '2023-06-07T04:30:00.000Z',
                    endAt: null,
                  },
                  match: [
                    {
                      id: '1-1-0-1-0',
                      participants: [
                        {
                          point: 9,
                          from: '1-1-0-1-0-1',
                          type: 'hs',
                          grade: '3',
                          class: '3',
                        },
                        {
                          point: 2,
                          from: '1-1-0-1-0-0',
                          type: 'hs',
                          grade: '2',
                          class: '7',
                        },
                      ],
                      meta: {
                        location: '校庭D面',
                        startAt: '2023-06-07T00:30:00.000Z',
                        endAt: null,
                      },
                      match: [
                        {
                          id: '1-1-0-1-0-0',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '2',
                            class: '7',
                          },
                        },
                        {
                          id: '1-1-0-1-0-1',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '3',
                            class: '3',
                          },
                        },
                      ],
                      editHistory: [
                        {
                          userId: '6431c75be531c04d67d87b0c',
                          date: '2023-06-07T01:35:20.669Z',
                        },
                      ],
                    },
                    {
                      id: '1-1-0-1-1',
                      participants: [],
                      meta: {
                        location: null,
                        startAt: null,
                        endAt: null,
                      },
                      class: {
                        type: 'hs',
                        grade: '2',
                        class: '3',
                      },
                    },
                  ],
                  editHistory: [
                    {
                      userId: '6431c75be531c04d67d87b0c',
                      date: '2023-06-07T05:24:56.513Z',
                    },
                  ],
                },
              ],
              editHistory: [
                {
                  userId: '6431c75be531c04d67d87b0c',
                  date: '2023-06-08T05:10:40.435Z',
                },
                {
                  userId: '6431c75be531c04d67d87b0c',
                  date: '2023-06-08T05:10:41.575Z',
                },
              ],
            },
            {
              id: '1-1-1',
              participants: [
                {
                  point: 4,
                  from: '1-1-1-0',
                  type: 'hs',
                  grade: '2',
                  class: '1',
                },
                {
                  from: '1-1-1-1',
                  type: 'hs',
                  grade: '3',
                  class: '4',
                  point: 3,
                },
              ],
              meta: {
                location: '校庭D面',
                startAt: '2023-06-08T04:00:00.000Z',
                endAt: null,
              },
              match: [
                {
                  id: '1-1-1-0',
                  participants: [
                    {
                      point: 1,
                      from: '1-1-1-0-0',
                      type: 'hs',
                      grade: '1',
                      class: '3',
                    },
                    {
                      point: 14,
                      from: '1-1-1-0-1',
                      type: 'hs',
                      grade: '2',
                      class: '1',
                    },
                  ],
                  meta: {
                    location: '校庭D面',
                    startAt: '2023-06-07T03:10:00.000Z',
                    endAt: null,
                  },
                  match: [
                    {
                      id: '1-1-1-0-0',
                      participants: [
                        {
                          point: 8,
                          from: '1-1-1-0-0-1',
                          type: 'hs',
                          grade: '1',
                          class: '3',
                        },
                        {
                          point: 2,
                          from: '1-1-1-0-0-0',
                          type: 'hs',
                          grade: '3',
                          class: '1',
                        },
                      ],
                      meta: {
                        location: '校庭C面',
                        startAt: '2023-06-07T01:50:00.000Z',
                        endAt: null,
                      },
                      match: [
                        {
                          id: '1-1-1-0-0-0',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '3',
                            class: '1',
                          },
                        },
                        {
                          id: '1-1-1-0-0-1',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '1',
                            class: '3',
                          },
                        },
                      ],
                      editHistory: [
                        {
                          userId: '6431c75be531c04d67d87b0c',
                          date: '2023-06-07T02:54:09.498Z',
                        },
                        {
                          userId: '6431c75be531c04d67d87b0c',
                          date: '2023-06-07T02:54:10.614Z',
                        },
                      ],
                    },
                    {
                      id: '1-1-1-0-1',
                      participants: [],
                      meta: {
                        location: null,
                        startAt: null,
                        endAt: null,
                      },
                      class: {
                        type: 'hs',
                        grade: '2',
                        class: '1',
                      },
                    },
                  ],
                  editHistory: [
                    {
                      userId: '63ea263132db1bc048a1457b',
                      date: '2023-06-07T04:24:53.853Z',
                    },
                    {
                      userId: '647ee7e8d7ef4d13dcb34926',
                      date: '2023-06-07T05:39:56.603Z',
                    },
                  ],
                },
                {
                  id: '1-1-1-1',
                  participants: [
                    {
                      point: 13,
                      from: '1-1-1-1-0',
                      type: 'hs',
                      grade: '3',
                      class: '4',
                    },
                    {
                      point: 0,
                      from: '1-1-1-1-1',
                      type: 'hs',
                      grade: '1',
                      class: '7',
                    },
                  ],
                  meta: {
                    location: '校庭D面',
                    startAt: '2023-06-07T04:30:00.000Z',
                    endAt: null,
                  },
                  match: [
                    {
                      id: '1-1-1-1-0',
                      participants: [
                        {
                          point: 12,
                          from: '1-1-1-1-0-0',
                          type: 'hs',
                          grade: '3',
                          class: '4',
                        },
                        {
                          point: 5,
                          from: '1-1-1-1-0-1',
                          type: 'hs',
                          grade: '1',
                          class: '6',
                        },
                      ],
                      meta: {
                        location: '校庭A面',
                        startAt: '2023-06-07T00:30:00.000Z',
                        endAt: null,
                      },
                      match: [
                        {
                          id: '1-1-1-1-0-0',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '3',
                            class: '4',
                          },
                        },
                        {
                          id: '1-1-1-1-0-1',
                          participants: [],
                          meta: {
                            location: null,
                            startAt: null,
                            endAt: null,
                          },
                          class: {
                            type: 'hs',
                            grade: '1',
                            class: '6',
                          },
                        },
                      ],
                      editHistory: [
                        {
                          userId: '63e8684a5eae46d4ed8034c4',
                          date: '2023-06-06T04:23:28.478Z',
                        },
                        {
                          userId: '63e8684a5eae46d4ed8034c4',
                          date: '2023-06-06T04:29:17.081Z',
                        },
                        {
                          userId: '6431c75be531c04d67d87b0c',
                          date: '2023-06-06T05:34:18.748Z',
                        },
                        {
                          userId: '6431c75be531c04d67d87b0c',
                          date: '2023-06-07T01:26:51.390Z',
                        },
                      ],
                    },
                    {
                      id: '1-1-1-1-1',
                      participants: [],
                      meta: {
                        location: null,
                        startAt: null,
                        endAt: null,
                      },
                      class: {
                        type: 'hs',
                        grade: '1',
                        class: '7',
                      },
                    },
                  ],
                  editHistory: [
                    {
                      userId: '647fc152d7ef4d13dcb3511e',
                      date: '2023-06-07T04:17:38.649Z',
                    },
                    {
                      userId: '647fc152d7ef4d13dcb3511e',
                      date: '2023-06-07T04:20:12.164Z',
                    },
                    {
                      userId: '6431c75be531c04d67d87b0c',
                      date: '2023-06-07T05:25:59.469Z',
                    },
                  ],
                },
              ],
              editHistory: [
                {
                  userId: '647fde7ca360f609fef775ac',
                  date: '2023-06-08T05:01:43.671Z',
                },
              ],
            },
          ],
          editHistory: [
            {
              userId: '6431c75be531c04d67d87b0c',
              date: '2023-06-08T06:21:34.896Z',
            },
          ],
        },
      ],
      editHistory: [
        {
          userId: '6431c75be531c04d67d87b0c',
          date: '2023-06-08T07:34:25.168Z',
        },
      ],
    },
  };
};
