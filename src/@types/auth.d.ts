interface User {
  _id: string;
  role: 'admin' | 'user';
  avatar: string;
  email: string;
  name: string;
  type: Type;
  grade: GradeCode;
  class: ClassCode;
  course: CourseCode;
  apiKey: string;
  contributionCount: number;
  createdAt: string;
}

interface LoginResponse {
  jwt: string;
  user: User;
}

interface GoogleCredentialResponse {
  credential: string;
}
