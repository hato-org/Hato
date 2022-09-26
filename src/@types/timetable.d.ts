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

interface CourseInfo {
  name: string;
  count: number;
  category: string;
}
