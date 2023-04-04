interface User {
  _id: string;
  role: 'admin' | 'user';
  avatar: string;
  email: string;
  name: string;
  type: Type;
  grade: number;
  class: number;
  course: Course;
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

type Type = 'hs' | 'jhs';
