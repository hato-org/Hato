interface User {
  _id: string;
  role: 'admin' | 'user';
  avatar: string;
  email: string;
  name: string;
  type: Type;
  grade: number;
  class: 'A' | 'B' | number;
  course: Course;
  apiKey: string;
  contributionCount: number;
  createdAt: string;
}

interface GoogleCredentialResponse {
  credential: string;
}

type Type = 'hs' | 'jhs';

type Course =
  | 'libA'
  | 'libB'
  | 'libC'
  | 'libZ'
  | 'sciD'
  | 'sciE'
  | 'sciX'
  | 'sciY';
