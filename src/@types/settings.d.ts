interface Settings {
  userId: string;
  account: {
    type: Type;
    grade: GradeCode;
    class: ClassCode;
    course: CourseCode;
  };
  theme: {
    dark: boolean;
  };
  notification: {
    push: WebPushServiceId[];
  };
}
