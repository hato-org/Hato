import type { classroom_v1 } from 'googleapis';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useClient } from '@/modules/client';
import { queryKeys } from '../queryKeys';

export const useGCAnnouncements = (
  courseId: string,
  options?: Omit<
    UseQueryOptions<classroom_v1.Schema$ListAnnouncementsResponse>,
    'queryKey' | 'queryFn'
  >,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: queryKeys.google.announcements(courseId),
    queryFn: async ({ signal }) =>
      await client
        .get(`classroom/course/${courseId}/announcement`, { signal })
        .json<classroom_v1.Schema$ListAnnouncementsResponse>(),
    enabled: !!courseId,
  });
};

export const useGCAnnouncement = (
  { courseId, id }: { courseId?: string; id?: string },
  options?: Omit<
    UseQueryOptions<classroom_v1.Schema$Announcement>,
    'queryKey' | 'queryFn'
  >,
) => {
  const { client } = useClient();

  return useQuery({
    queryKey: queryKeys.google.announcement(courseId, id),
    queryFn: async ({ signal }) =>
      await client
        .get(`classroom/course/${courseId}/announcement/${id}`, { signal })
        .json<classroom_v1.Schema$Announcement>(),
    enabled: !!courseId && !!id,
    ...options,
  });
};

export const useGCMyAnnouncements = () => {
  const { client } = useClient();

  return useQuery({
    queryKey: queryKeys.google.myAnnouncements(),
    queryFn: async ({ signal }) =>
      await client
        .get('classroom/announcement/me', { signal })
        .json<classroom_v1.Schema$ListAnnouncementsResponse['announcements']>(),
  });
};
