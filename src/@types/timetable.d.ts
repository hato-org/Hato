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
  date: Date;
  message: string;
}
