type Week = 'A' | 'B';

interface Period {
  subject?: SubjectInfo; // Subject information
  // type: Type; // School type
  // grade: number[]; // Grade
  // class: number[]; // Class
  // course: Course[]; // Course
  start: number; // Start period index
  end: number; // End period index
  startAt: string; // Start time
  endAt: string; // End time
  location?: string; // Location
  teacher?: string; // Teacher
  event?: string[]; // Related event ID
}

interface CurrentTimetable {
  timetable: SubjectInfo[];
  period: number;
  week: Week;
  course: CourseInfo;
}

interface DaySchedule {
  _id?: string;
  date: string;
  timetable: Period[];
  schedule: {
    week: Week;
    day: Day;
  };
  target: {
    type: Type;
    grade: Number;
    class: Number;
    course?: Course;
  }[];
  meta: {
    type: Type;
    grade: number;
    class: number;
    course: CourseInfo;
  };
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
