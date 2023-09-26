type WebPushServiceId =
  | 'timetable'
  | 'event'
  | 'hatoboard'
  | 'transit'
  | 'classmatch';

interface PushPayload {
  timestamp: number;
  title: string;
  body: string;
  path?: string;
}
