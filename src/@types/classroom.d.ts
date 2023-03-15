import type { classroom_v1 } from 'googleapis';

type GCTimeline =
  | (classroom_v1.Schema$Announcement & {
      type: 'announcement';
      title?: undefined;
    })
  | (classroom_v1.Schema$CourseWork & { type: 'courseWork'; text?: undefined })
  | (classroom_v1.Schema$CourseWorkMaterial & {
      type: 'courseWorkMaterial';
      text?: undefined;
    });
