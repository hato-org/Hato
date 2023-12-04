import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Spacer,
  StackDivider,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { TbChevronRight } from 'react-icons/tb';
import Header from '@/components/nav/Header';
import Card from '@/components/layout/Card';
import {
  useClassmatchLiveStreams,
  useClassmatchSports,
} from '@/services/classmatch';
import SportButton from '@/components/classmatch/SportButton';
import LiveStream from '@/components/classmatch/LiveStream';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import UpcomingMatch from '@/components/classmatch/UpcomingMatch';
import Info from '@/components/cards/Info';
import Error from '@/components/cards/Error';
import Loading from '@/components/common/Loading';
import HistoryModal from '@/components/classmatch/HistoryModal';

const year = 2023;

export default function Classmatch2023() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [season, setSeason] = useState<ClassmatchSeason>(
    searchParams.get('season') ?? new Date().getMonth() > 6
      ? 'autumn'
      : 'spring',
  );

  useEffect(() => {
    searchParams.set('season', season);
    setSearchParams(searchParams);
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season]);

  const onSeasonSelected = useCallback(
    ({
      // year: newYear,
      season: newSeason,
    }: {
      year: number;
      season: ClassmatchSeason;
    }) => {
      setSeason(newSeason);
    },
    [],
  );

  const {
    data: sports,
    status: sportsStatus,
    error: sportsError,
  } = useClassmatchSports({
    year,
    season,
  });
  const {
    data: streams,
    status: streamsStatus,
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
      <Header withMenu>
        <HStack w="100%">
          <Heading size="md" ml={2} py={4}>
            クラスマッチ
          </Heading>
        </HStack>
      </Header>
      <HistoryModal
        isOpen={isOpen}
        onClose={onClose}
        onSelected={onSeasonSelected}
      />
      <ChakraPullToRefresh
        onRefresh={async () => {
          await queryClient.invalidateQueries({
            queryKey: ['classmatch', year, season],
          });
          await queryClient.invalidateQueries({
            queryKey: ['classmatch', 'history'],
          });
        }}
      >
        <VStack w="full" minH="100vh" p={4} mb={24} spacing={8}>
          <Info />
          <Card
            w="full"
            onClick={onOpen}
            layerStyle="button"
            _hover={{ cursor: 'pointer' }}
          >
            <HStack spacing={4}>
              <StackDivider
                rounded="full"
                borderWidth={2}
                borderColor={season === 'spring' ? 'pink.300' : 'orange.500'}
              />
              <VStack spacing={0}>
                <Text fontSize="3xl" fontWeight="bold">
                  {year} {season === 'spring' ? '春' : '秋'}
                </Text>
                <Text textStyle="description">以前の結果を見る</Text>
              </VStack>
              <Spacer />
              <Icon as={TbChevronRight} boxSize={6} />
            </HStack>
          </Card>
          <Card w="full">
            <VStack align="flex-start" w="full" p={2} spacing={4}>
              <Heading size="md">今後の試合</Heading>
              <UpcomingMatch year={year} season={season} />
            </VStack>
          </Card>
          <Card w="full">
            <VStack align="flex-start" w="full" p={2} spacing={4}>
              <Heading size="md">トーナメント表・会場図</Heading>
              {sportsStatus === 'error' ? (
                <Error error={sportsError} />
              ) : sportsStatus === 'pending' ? (
                <Loading />
              ) : (
                <SimpleGrid w="full" columns={2} gap={4} placeContent="center">
                  {sports.map((sport) => (
                    <SportButton
                      key={sport.id}
                      {...sport}
                      year={year}
                      season={season}
                      sport={sport.id}
                    />
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          </Card>
          <Card w="full">
            <VStack align="flex-start" w="full" p={2} spacing={8}>
              <Heading size="md">ライブ配信</Heading>
              {streamsStatus === 'error' ? (
                <Error error={streamsError} />
              ) : streamsStatus === 'pending' ? (
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
            </VStack>
          </Card>
        </VStack>
      </ChakraPullToRefresh>
    </Box>
  );
}
