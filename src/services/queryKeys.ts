/**
 * Query Key Factory
 *
 * クエリキーを一元管理する。TanStack Query のキーを文字列リテラルで
 * 散在させず、型安全にアクセスできるようにする。
 *
 * パターン:
 *   queryKeys.<feature>.all        → 機能全体の invalidation 用
 *   queryKeys.<feature>.detail(id) → 個別リソース
 *   queryKeys.<feature>.list(...)  → フィルタ付きリスト
 */

export const queryKeys = {
  user: {
    all: ['user'] as const,
    detail: (id: string) => ['user', id] as const,
    profile: () => ['user', 'profile'] as const,
  },

  timetable: {
    all: ['timetable'] as const,
    division: (date: { year: number; month: number; day: number }) =>
      ['timetable', 'division', date] as const,
    userSubject: (id: string) => ['timetable', 'usersubject', id] as const,
    userSchedule: (id: string) => ['timetable', 'userschedule', id] as const,
    myUserSchedules: (userId: string) =>
      ['timetable', 'userschedule', 'user', userId] as const,
    note: (date: { year: number; month: number; day: number }) =>
      ['timetable', 'note', date] as const,
  },

  calendar: {
    all: ['calendar'] as const,
    events: (date: { year: number; month: number; day?: number }) =>
      ['calendar', 'events', date] as const,
    event: (id: string) => ['calendar', 'event', id] as const,
  },

  posts: {
    hatoboard: () => ['posts', 'hatoboard'] as const,
    detail: (id: string) => ['post', id] as const,
    attachment: (id: string) => ['post', 'attachment', id] as const,
    attachmentAll: () => ['post', 'attachment'] as const,
  },

  library: {
    bookDetail: (id: string) => ['library', 'book', id, 'detail'] as const,
    bookByIsbn: (isbn: string) => ['library', 'book', isbn] as const,
    search: (params: Record<string, unknown>) =>
      ['library', 'search', params] as const,
  },

  transit: {
    all: ['transit'] as const,
    timetable: (dest: string, kind: string) =>
      ['transit', 'timetable', dest, kind] as const,
    diainfo: () => ['transit', 'diainfo'] as const,
  },

  status: {
    all: ['status'] as const,
    maintenance: () => ['status', 'maintenance'] as const,
    history: (id: string) => ['status', 'history', id] as const,
    servers: () => ['status', 'servers'] as const,
  },

  info: {
    grade: () => ['info', 'grade'] as const,
    classList: (type: string, grade: string) =>
      ['info', 'class', type, grade] as const,
    courseList: (type: string, grade: string) =>
      ['info', 'course', type, grade] as const,
    subjectList: (type: string, grade: string) =>
      ['info', 'subject', type, grade] as const,
  },

  settings: {
    detail: (userId: string) => ['settings', userId] as const,
  },

  scienceroom: {
    table: (date: { y: number; m: number; d: number }) =>
      ['scienceroom', date] as const,
  },

  google: {
    all: ['google'] as const,
    timeline: () => ['google', 'timeline'] as const,
    courseTimeline: (courseId: string) =>
      ['google', courseId, 'timeline'] as const,
    courses: () => ['google', 'courses'] as const,
    course: (courseId: string) => ['google', 'course', courseId] as const,
    announcements: (courseId: string) =>
      ['google', courseId, 'announcements'] as const,
    announcement: (courseId: string, id: string) =>
      ['google', 'announcement', courseId, id] as const,
    myAnnouncements: () => ['google', 'me', 'announcements'] as const,
    courseWork: (courseId: string, id: string) =>
      ['google', 'courseWork', { courseId, id }] as const,
    courseWorkMaterial: (courseId: string, id: string) =>
      ['google', 'courseWorkMaterial', { courseId, id }] as const,
    user: (userId: string) => ['google', 'user', userId] as const,
  },

  classmatch: {
    all: (year: number, season: string) =>
      ['classmatch', year, season] as const,
    sports: (year: number, season: string) =>
      ['classmatch', year, season, 'sports'] as const,
    sport: (year: number, season: string, sport: string) =>
      ['classmatch', year, season, sport] as const,
    livestreams: (year: number, season: string) =>
      ['classmatch', year, season, 'livestreams'] as const,
    history: () => ['classmatch', 'history'] as const,
    upcoming: (
      year: number,
      season: string,
      filter: { type: string; grade: string; class: string },
    ) => ['classmatch', year, season, 'upcoming', filter] as const,
  },
} as const;
