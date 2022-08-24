import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuth } from "../../modules/auth";
import { useClient } from "../../modules/client";
import { useApi } from "../common/api";

export const useCurrentTable = (queryKey?: string[]) => {
  const { user } = useAuth();
  const { client } = useClient();

  const params = {
    type: user?.type,
    grade: user?.grade,
    class: user?.class,
    course: user?.course,
  };

  return useQuery<CurrentTimetable, AxiosError>(
    [...(queryKey ?? []), "timetable", params],
    async () => {
      return (await client.get("/timetable/v1.1/now", { params })).data;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  // return useApi<CurrentTimetable, AxiosError, any, any>(
  //   [
  //     "/timetable/v1.1/now",
  //     {
  //       type: user?.type,
  //       grade: user?.grade,
  //       class: user?.class,
  //       course: user?.course,
  //     },
  //     ...(queryKey || []),
  //   ],
  //   {
  //     refetchOnMount: false,
  //     refetchOnWindowFocus: false,
  //   }
  // );
};

export const useTable = (
  {
    grade,
    class: schoolClass,
    course,
  }: {
    grade: number;
    class: number;
    course: Course;
  },
  queryKey?: string[]
) => {
  const { client } = useClient();

  return useQuery([...(queryKey ?? []), "timetable"], async () => {
    return (
      await client.get("/timetable/v1.1", {
        params: {
          grade,
          class: schoolClass,
          course,
        },
      })
    ).data;
  }, {
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  // return useApi<any, AxiosError, any, any>([
  //   "/timetable/v1.1",
  //   {
  //     grade,
  //     class: schoolClass,
  //     course,
  //   },
  //   ...(queryKey || []),
  // ]);
};

