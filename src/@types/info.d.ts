type Type = 'teacher' | 'hs' | 'jhs';

type CourseCode =
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
  shortName: string;
  studentCount: number;
  category: CourseCategory;
  code: CourseCode;
}

type CourseList = CourseInfo[];

type GradeCode = '1' | '2' | '3';

interface GradeInfo {
  name: string;
  shortName: string;
  type: Type;
  gradeCode: GradeCode;
  studentCount: number;
}

type GradeList = GradeInfo[];

type ClassCode = '1' | '2' | '3' | '4' | '5' | '6' | '7' | 'A' | 'B';

interface ClassInfo {
  name: string;
  shortName: string;
  type: Type;
  gradeCode: GradeCode;
  classCode: ClassCode;
  studentCount: number;
}

type ClassList = ClassInfo[];

interface SubjectInfo {
  name: string;
  code?: Subject;
  description?: string;
}

type SubjectList = SubjectInfo[];
