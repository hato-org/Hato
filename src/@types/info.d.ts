type Course =
  | 'libA'
  | 'libB'
  | 'libC'
  | 'libZ'
  | 'sciD'
  | 'sciE'
  | 'sciX'
  | 'sciY';

type CourseCategory = 'liberal' | 'science';

interface CourseInfo {
  name: string;
  short_name: string;
  student_count: number;
  category: CourseCategory;
  code: Course;
}

type CourseList = CourseInfo[];

interface GradeInfo {
  name: string;
  short_name: string;
  type: Type;
  grade_num: number;
  student_count: number;
}

type GradeList = GradeInfo[];

interface ClassInfo {
  name: string;
  short_name: string;
  type: string;
  class_num: number;
  student_count: number;
}

type ClassList = ClassInfo[];
