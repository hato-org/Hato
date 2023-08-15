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

interface DefaultPeriod extends Period {
  startAt: string;
  endAt: string;
}

interface Division {
  date: Date;
  week: 'A' | 'B';
  day: Day;
  irregular: boolean;
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
    irregular: boolean;
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

interface Schedule {
  date: Date | string;
  week: Week;
  day: Day;
  schedule: {
    type: Type;
    grade: number;
    timetable: {
      index: number;
      startAt: string;
      endAt: string;
    }[];
  }[];
  irregular: boolean;
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
