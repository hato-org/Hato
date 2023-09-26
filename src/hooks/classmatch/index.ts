import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useClient } from '@/modules/client';

export const useClassmatchSports = (
  { year, season }: { year: number; season: ClassmatchSeason },
  options?: UseQueryOptions<ClassmatchSport[], AxiosError>,
) => {
  const { client } = useClient();

  return useQuery<ClassmatchSport[], AxiosError>(
    ['classmatch', year, season, 'sports'],
    async () =>
      (await client.get('/classmatch/sports', { params: { year, season } }))
        .data,
    options,
  );
};

export const useClassmatchSportInfo = (
  {
    year,
    season,
    sport,
  }: {
    year?: number;
    season: ClassmatchSeason;
    sport?: ClassmatchSportId;
  },
  options?: UseQueryOptions<ClassmatchSportInfo, AxiosError>,
) => {
  const { client } = useClient();

  return useQuery<ClassmatchSportInfo, AxiosError>(
    ['classmatch', year, season, sport],
    async () =>
      (
        await client.get(`/classmatch/${sport}`, {
          params: { year, season },
        })
      ).data,
    options,
  );
};

export const useClassmatchLiveStreams = ({
  year,
  season,
}: {
  year: number;
  season: ClassmatchSeason;
}) => {
  const { client } = useClient();

  return useQuery<ClassmatchLiveStream[], AxiosError>(
    ['classmatch', year, season, 'livestreams'],
    async () =>
      (await client.get('/classmatch/streams', { params: { year, season } }))
        .data,
  );
};

export const useClassmatchHistory = () => {
  const { client } = useClient();

  return useQuery<ClassmatchHistory[], AxiosError>(
    ['classmatch', 'history'],
    async () => (await client.get('/classmatch/history')).data,
  );
};

export const useClassmatchUpcomingList = ({
  year,
  season,
  type,
  grade,
  class: classNum,
}: {
  year?: number;
  season: ClassmatchSeason;
  type?: Type;
  grade?: string;
  class?: string;
}) => {
  const { client } = useClient();

  return useQuery<ClassmatchTournamentUpcoming[], AxiosError>(
    ['classmatch', year, season, 'upcoming', type, grade, classNum],
    async () =>
      (
        await client.get('/classmatch/tournament/upcoming', {
          params: { year, season, type, grade, class: classNum },
        })
      ).data,
    {
      enabled: !!(year && season && type && grade && classNum),
    },
  );
};

export const useClassmatchMutation = ({
  year,
  season,
  sport,
  id,
}: {
  year?: number;
  season?: ClassmatchSeason;
  sport?: ClassmatchSportId;
  id: string;
}) => {
  const toast = useToast({
    position: 'top-right',
    duration: 1000,
  });
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation<
    ClassmatchTournament,
    AxiosError,
    Partial<ClassmatchTournament>
  >(
    async (tournament) =>
      (
        await client.post('/classmatch/tournament', tournament, {
          params: { year, season, sport, id },
        })
      ).data,
    {
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
    },
  );
};
