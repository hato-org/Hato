import type { classroom_v1 } from 'googleapis';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useClient } from '@/modules/client';

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
    queryKey: ['google', courseId, 'announcements'],
    queryFn: async () =>
      (
        await client.get<classroom_v1.Schema$ListAnnouncementsResponse>(
          `/classroom/course/${courseId}/announcement`,
        )
      ).data,
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
    queryKey: ['google', 'announcement', courseId, id],
    queryFn: async () =>
      (
        await client.get<classroom_v1.Schema$Announcement>(
          `/classroom/course/${courseId}/announcement/${id}`,
        )
      ).data,
    enabled: !!courseId && !!id,
    ...options,
  });
};

export const useGCMyAnnouncements = () => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['google', 'me', 'announcements'],
    queryFn: async () =>
      (
        await client.get<
          classroom_v1.Schema$ListAnnouncementsResponse['announcements']
        >('/classroom/announcement/me')
      ).data,
  });
};
