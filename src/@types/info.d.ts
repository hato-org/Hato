type Course = 'lib1' | 'lib2' | 'lib3' | 'sci1' | 'sci2' | 'sci3';

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
  grade_num: 1 | 2 | 3;
  student_count: number;
}

type GradeList = GradeInfo[];

interface ClassInfo {
  name: string;
  short_name: string;
  type: Type;
  grade_num: 1 | 2 | 3;
  class_num: number;
  student_count: number;
}

type ClassList = ClassInfo[];

interface SubjectInfo {
  name: string;
  code?: Subject;
  description?: string;
}

type SubjectList = SubjectInfo[];
