import { useMemo } from 'react';
import {
  Box,
  HStack,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import BackButton from '@/components/layout/BackButton';
import Header from '@/components/nav/Header';
import Card from '@/components/layout/Card';
import TournamentModal from '@/components/classmatch/TournamentModal';
import {
  useClassmatchLiveStreams,
  useClassmatchSports,
} from '@/hooks/classmatch';
import SportButton from '@/components/classmatch/SportButton';
import LiveStream from '@/components/classmatch/LiveStream';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import UpcomingMatch from '@/components/classmatch/UpcomingMatch';
import Info from '@/components/cards/Info';
import Error from '@/components/cards/Error';
import Loading from '@/components/common/Loading';

const year = 2023;

export default function Classmatch2023() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const season = useMemo(
    () => (searchParams.get('season') as ClassmatchSeason) ?? 'spring',
    [searchParams]
  );
  const {
    data: sports,
    isLoading: sportsLoading,
    error: sportsError,
  } = useClassmatchSports({
    year,
    season,
  });
  const {
    data: streams,
    isLoading: streamsLoading,
    error: streamsError,
  } = useClassmatchLiveStreams({
    year,
    season,
  });

  return (
    <Box>
      <Helmet>
        <title>クラスマッチ - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack w="100%">
          <BackButton />
          <Heading size="md" ml={2} py={4}>
            クラスマッチ
          </Heading>
        </HStack>
      </Header>
      <TournamentModal year={year} season={season} />
      <ChakraPullToRefresh
        onRefresh={async () => {
          await queryClient.invalidateQueries(['classmatch']);
        }}
      >
        <VStack w="full" minH="100vh" p={4} mb={24} spacing={8}>
          <Info />
          <Card w="full">
            <VStack align="flex-start" w="full" p={2} spacing={4}>
              <Heading size="md">今後の試合</Heading>
              <UpcomingMatch year={year} season={season} />
            </VStack>
          </Card>
          <Card w="full">
            <VStack align="flex-start" w="full" p={2} spacing={4}>
              <Heading size="md">トーナメント表</Heading>
              {/* eslint-disable no-nested-ternary */}
              {sportsError ? (
                <Error error={sportsError} />
              ) : sportsLoading ? (
                <Loading />
              ) : (
                <SimpleGrid w="full" columns={2} gap={4} placeContent="center">
                  {sports.map((sport) => (
                    <SportButton
                      key={sport.id}
                      {...sport}
                      year={year}
                      season={season}
                    />
                  ))}
                </SimpleGrid>
              )}
              {/* eslint-enable no-nested-ternary */}
            </VStack>
          </Card>
          <Card w="full">
            <VStack align="flex-start" w="full" p={2} spacing={8}>
              <Heading size="md">ライブ配信</Heading>
              {/* eslint-disable no-nested-ternary */}
              {streamsError ? (
                <Error error={streamsError} />
              ) : streamsLoading ? (
                <Loading />
              ) : streams.length ? (
                streams.map((stream) => (
                  <LiveStream key={stream.url} {...stream} />
                ))
              ) : (
                <Text
                  w="full"
                  textAlign="center"
                  textStyle="description"
                  fontWeight="bold"
                >
                  予定されているライブ配信はありません
                </Text>
              )}
              {/* eslint-enable no-nested-ternary */}
            </VStack>
          </Card>
        </VStack>
      </ChakraPullToRefresh>
    </Box>
  );
}
