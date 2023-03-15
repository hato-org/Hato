import type { classroom_v1 } from 'googleapis';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useClient } from '@/modules/client';

// eslint-disable-next-line import/prefer-default-export
export const useGCAnnouncements = (
  courseId: string,
  options?: UseQueryOptions<
    classroom_v1.Schema$ListAnnouncementsResponse,
    AxiosError
  >
) => {
  const { client } = useClient();

  return useQuery<classroom_v1.Schema$ListAnnouncementsResponse, AxiosError>(
    ['google', courseId, 'announcements'],
    async () =>
      (await client.get(`/classroom/course/${courseId}/announcement`)).data,
    {
      enabled: !!courseId,
      ...options,
    }
  );
};

export const useGCAnnouncement = (
  { courseId, id }: { courseId?: string; id?: string },
  options: UseQueryOptions<classroom_v1.Schema$Announcement, AxiosError>
) => {
  const { client } = useClient();

  return useQuery<classroom_v1.Schema$Announcement, AxiosError>(
    ['google', 'announcement', courseId, id],
    async () =>
      (await client.get(`/classroom/course/${courseId}/announcement/${id}`))
        .data,
    {
      enabled: !!courseId && !!id,
      ...options,
    }
  );
};

export const useGCMyAnnouncements = () => {
  const { client } = useClient();

  return useQuery<
    classroom_v1.Schema$ListAnnouncementsResponse['announcements'],
    AxiosError
  >(
    ['google', 'me', 'announcements'],
    async () => (await client.get('/classroom/announcement/me')).data
  );
};
