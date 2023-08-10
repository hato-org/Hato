type WebPushServiceId = 'timetable' | 'event' | 'hatoboard' | 'transit';

interface PushPayload {
  timestamp: number;
  title: string;
  body: string;
  path?: string;
}
