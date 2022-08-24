import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useAuth } from "../../modules/auth";
import { useClient } from "../../modules/client";

export const useAllTagList = () => {
  const { client } = useClient();

  return useQuery<Tag[], AxiosError>(
    ["calendar", "tag"],
    async () => {
      return (await client.post<Tag[]>("/calendar/tags/search", { q: "" }))
        .data;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};

// export const useTagFilter = () => {
//   const { data: tagList } = useAllTagList();
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const { data } = useQuery(["calendar", "filter"], () => [
//     ...(tagList?.filter((tag) => tag.value === "全校") ?? []),
//     ...(tagList?.filter(
//       (tag) => tag.value === `${user?.grade}${user?.class}`
//     ) ?? []),
//   ]);

//   const setter = (updater: (oldTag: Tag[]) => Tag[]) => {
//     queryClient.setQueryData(['calendar', 'filter'], updater);
//   }

//   return [data, setter] as const

// 	// return [
//   //   ...(tagList?.filter((tag) => tag.value === "全校") ?? []),
//   //   ...(tagList?.filter((tag) => tag.value === `${user?.grade}${user?.class}`) ??
//   //     []),
//   // ];

//   // return [tag, setTag] // as [Tag[], React.Dispatch<React.SetStateAction<Tag[]>>];
// }
