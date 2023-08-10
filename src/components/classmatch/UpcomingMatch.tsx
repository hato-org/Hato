import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  HStack,
  Icon,
  Spacer,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns/esm';
import { TbChevronDown } from 'react-icons/tb';
import { useClassmatchUpcomingList } from '@/hooks/classmatch';
import { sportIcon } from '@/utils/classmatch';
import GradeClassPicker from '../timetable/GradeClassPicker';
import { useUser } from '@/hooks/user';
import Loading from '../common/Loading';
import Error from '../cards/Error';

const UpcomingMatch = React.memo(
  ({ year, season }: { year: number; season: ClassmatchSeason }) => {
    const { data: user } = useUser();

    const { isOpen, onToggle } = useDisclosure();
    const [type, setType] = useState(user.type);
    const [grade, setGrade] = useState(user.grade);
    const [classNum, setClass] = useState(user.class);
    const { data, isLoading, error } = useClassmatchUpcomingList({
      year,
      season,
      type,
      grade,
      class: classNum,
    });

    const upcomingMatches = useMemo(
      () =>
        data?.filter(
          ({ startAt }) =>
            new Date(startAt ?? '').getTime() -
              new Date(Date.now() - 1000 * 60 * 30).getTime() >
            0
        ),
      [data]
    );

    if (isLoading) return <Loading />;
    if (error) return <Error error={error} />;

    return (
      <VStack w="full" spacing={4}>
        <GradeClassPicker
          onGradeSelect={({ type: newType, gradeCode }) => {
            setType(newType);
            setGrade(gradeCode);
          }}
          onClassSelect={({ classCode }) => setClass(classCode)}
          defaultType={user.type}
          defaultGrade={user.grade}
          defaultClass={user.class}
          direction="row"
        />
        {upcomingMatches?.length ? (
          <Box w="full">
            <Collapse
              startingHeight={(data?.length ?? 0) > 3 ? 220 : 0}
              in={isOpen}
            >
              <VStack w="full" spacing={0}>
                {upcomingMatches?.map((upcoming) => (
                  <Match key={upcoming.matchId + upcoming.name} {...upcoming} />
                ))}
              </VStack>
            </Collapse>
          </Box>
        ) : (
          <Text pt={2} textStyle="description" fontWeight="bold">
            {type && grade && classNum
              ? '今後の試合はありません'
              : '学年・クラスを選択してください'}
          </Text>
        )}
        {(upcomingMatches?.length ?? 0) > 3 && (
          <Button
            w="full"
            rounded="lg"
            leftIcon={
              <Icon
                as={TbChevronDown}
                transform={`rotate(${isOpen ? '180deg' : '0deg'})`}
                transition="all .2s ease"
              />
            }
            onClick={onToggle}
          >
            {isOpen ? '折りたたむ' : 'もっと見る'}
          </Button>
        )}
      </VStack>
    );
  }
);

const Match = React.memo(
  ({ id, name, startAt, location }: ClassmatchTournamentUpcoming) => {
    const isPlaying = new Date(startAt ?? '').getTime() - Date.now() < 0;

    return (
      <HStack
        pos="relative"
        w="full"
        p={2}
        py={4}
        spacing={4}
        _first={{
          _after: {
            content: '""',
            pos: 'absolute',
            bg: 'border',
            left: 3,
            top: 'calc(50% + var(--chakra-sizes-4))',
            bottom: 0,
            w: 1,
            shadow: 'lg',
            roundedTop: 'full',
          },
        }}
        _notFirst={{
          _before: {
            content: '""',
            pos: 'absolute',
            bg: 'border',
            left: 3,
            bottom: 'calc(50% + var(--chakra-sizes-4))',
            top: 0,
            w: 1,
            shadow: 'lg',
            roundedBottom: 'full',
          },
          _after: {
            content: '""',
            pos: 'absolute',
            bg: 'border',
            left: 3,
            top: 'calc(50% + var(--chakra-sizes-4))',
            bottom: 0,
            w: 1,
            shadow: 'lg',
            roundedTop: 'full',
          },
        }}
        _last={{
          _before: {
            content: '""',
            pos: 'absolute',
            bg: 'border',
            left: 3,
            bottom: 'calc(50% + var(--chakra-sizes-4))',
            top: 0,
            w: 1,
            shadow: 'lg',
          },
          _after: {
            display: 'none',
          },
        }}
      >
        <AnimatePresence>
          <motion.div
            style={{
              display: isPlaying ? 'block' : 'none',
              position: 'absolute',
              borderRadius: '100%',
              width: 'var(--chakra-sizes-3)',
              height: 'var(--chakra-sizes-3)',
              backgroundColor: isPlaying
                ? 'var(--chakra-colors-blue-400)'
                : 'var(--chakra-colors-border)',
              boxShadow: 'var(--chakra-shadow-sm)',
              left: 'var(--chakra-sizes-2)',
              scale: 1,
              opacity: 1,
            }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </AnimatePresence>
        <Box
          pos="absolute"
          rounded="full"
          boxSize={3}
          bg={isPlaying ? 'blue.400' : 'border'}
          shadow="sm"
          left={2}
        />
        <VStack pl={6} spacing={-1} align="flex-start">
          {startAt && (
            <Text textStyle="title" fontSize="xs">
              {format(new Date(startAt), 'MM/dd')}
            </Text>
          )}
          <Text
            textStyle="title"
            fontSize="xl"
            color={startAt ? 'title' : 'description'}
          >
            {startAt ? format(new Date(startAt), 'HH:mm') : '時間不明'}
          </Text>
        </VStack>
        <Spacer />
        <VStack align="flex-end" spacing={0}>
          <Text textStyle="title" noOfLines={1}>
            {name}
          </Text>
          <Text textStyle="description" fontWeight="bold">
            {location}
          </Text>
        </VStack>
        <Icon as={sportIcon[id]} boxSize={8} />
      </HStack>
    );
  }
);

export default UpcomingMatch;
