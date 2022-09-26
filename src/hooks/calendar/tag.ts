import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useClient } from '../../modules/client';

// eslint-disable-next-line import/prefer-default-export
export const useAllTagList = () => {
  const { client } = useClient();

  return useQuery<Tag[], AxiosError>(
    ['calendar', 'tag'],
    async () =>
      (await client.post<Tag[]>('/calendar/tags/search', { q: '' })).data
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
