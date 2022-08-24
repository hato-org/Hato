import { useQuery } from "@tanstack/react-query";

export const useEvents = ({
  grade,
  class: schoolClass,
  course,
  date,
}: {
  grade: number;
  class: number;
  course: Course;
  date: Date;
}) => {
  return useQuery([]);
};
