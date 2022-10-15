interface Subject {
  name: string;
  description: string;
}

interface CurrentTimetable {
  timetable: Subject[];
  period: number;
  week: 'A' | 'B';
  course: CourseInfo;
}

interface Note {
  _id: string;
  date: Date;
  lunch?: boolean;
  cleaning?: boolean;
  target?: ClassInfo[];
  message?: string;
  owner: string;
}
