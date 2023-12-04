import { useToast } from '@chakra-ui/react';
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useClient } from '@/modules/client';

export const useClassmatchSports = (
  { year, season }: { year: number; season: ClassmatchSeason },
  options?: Omit<UseQueryOptions<ClassmatchSport[]>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: ['classmatch', year, season, 'sports'],
    queryFn: async () =>
      (
        await client.get<ClassmatchSport[]>('/classmatch/sports', {
          params: { year, season },
        })
      ).data,
  });
};

export const useClassmatchSportInfo = (
  {
    year,
    season,
    sport,
  }: {
    year: number;
    season: ClassmatchSeason;
    sport?: ClassmatchSportId;
  },
  options?: Omit<UseQueryOptions<ClassmatchSportInfo>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['classmatch', year, season, sport],
    queryFn: async () =>
      (
        await client.get<ClassmatchSportInfo>(`/classmatch/${sport}`, {
          params: { year, season },
        })
      ).data,
    ...options,
  });
};

export const useClassmatchLiveStreams = ({
  year,
  season,
}: {
  year: number;
  season: ClassmatchSeason;
}) => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['classmatch', year, season, 'livestreams'],
    queryFn: async () =>
      (
        await client.get<ClassmatchLiveStream[]>('/classmatch/streams', {
          params: { year, season },
        })
      ).data,
  });
};

export const useClassmatchHistory = () => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['classmatch', 'history'],
    queryFn: async () =>
      (await client.get<ClassmatchHistory[]>('/classmatch/history')).data,
  });
};

export const useClassmatchUpcomingList = ({
  year,
  season,
  type,
  grade,
  class: classNum,
}: {
  year: number;
  season: ClassmatchSeason;
  type?: Type;
  grade?: string;
  class?: string;
}) => {
  const { client } = useClient();

  return useQuery({
    queryKey: [
      'classmatch',
      year,
      season,
      'upcoming',
      { type, grade, class: classNum },
    ],
    queryFn: async () =>
      (
        await client.get<ClassmatchTournamentUpcoming[]>(
          '/classmatch/tournament/upcoming',
          {
            params: { year, season, type, grade, class: classNum },
          },
        )
      ).data,
    enabled: !!(year && season && type && grade && classNum),
  });
};

export const useClassmatchMutation = ({
  year,
  season,
  sport,
  id,
}: {
  year: number;
  season: ClassmatchSeason;
  sport: ClassmatchSportId;
  id: string;
}) => {
  const toast = useToast({
    position: 'top-right',
    duration: 1000,
  });
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async (tournament: Partial<ClassmatchTournament>) =>
      (
        await client.post<ClassmatchTournament>(
          '/classmatch/tournament',
          tournament,
          {
            params: { year, season, sport, id },
          },
        )
      ).data,
    retry: 5,
    onSuccess: (data) => {
      queryClient.setQueryData(['classmatch', year, season, sport], data);
      toast({
        title: '更新しました。',
        status: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: '更新に失敗しました',
        description: error.message,
        status: 'error',
      });
    },
  });
};
