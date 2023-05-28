import React, { useMemo } from 'react';
import {
  Box,
  Center,
  HStack,
  Icon,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import { TbCrown } from 'react-icons/tb';
import TournamentMetaPopover from './MetaPopover';

const countNumOfClass = ({
  match,
  class: classInfo,
}: ClassmatchTournament): ClassmatchClass[] =>
  match
    ? match.map((tournament) => countNumOfClass(tournament)).flat()
    : [classInfo];

export default function Tournament({
  id,
  participants,
  ...rest
}: ClassmatchTournament) {
  const winner = useMemo(
    () =>
      participants.reduce<ClassmatchParticipant>(
        (prev, curr) => (prev.point > curr.point ? prev : curr),
        { type: 'hs', grade: '0', class: '0', from: '', point: 0 }
      ),
    [participants]
  );

  return (
    <VStack>
      <Text textStyle="description" fontWeight="bold">
        交点をタップして詳細を見る
      </Text>
      <HStack>
        <TournamentSection
          id={id}
          participants={participants}
          isWinner={id === winner.from}
          {...rest}
        />
        <VStack spacing={1}>
          <Icon as={TbCrown} boxSize={8} color="yellow.400" />
          {participants.length && (
            <Text textStyle="title" fontSize="2xl" fontFamily="monospace">
              {winner.grade}-{winner.class}
            </Text>
          )}
        </VStack>
      </HStack>
    </VStack>
  );
}

const TournamentSection = React.memo(
  ({
    id,
    match,
    class: classInfo,
    meta,
    participants,
    isWinner,
  }: ClassmatchTournament & {
    isWinner: boolean;
  }) => {
    const winnerId = participants.reduce(
      (prev, curr) => (prev.point > curr.point ? prev : curr),
      { from: '', point: 0 }
    ).from;

    const numOfClass = match?.map((tournament) => countNumOfClass(tournament));

    return match ? (
      <HStack spacing={0} alignSelf="stretch">
        <VStack spacing={0} flexGrow={1}>
          {match.map((tournament) => (
            <TournamentSection
              key={tournament.id}
              {...tournament}
              isWinner={tournament.id === winnerId}
            />
          ))}
        </VStack>
        <VStack
          pos="relative"
          alignSelf="stretch"
          justify="center"
          w={{ base: 8, md: 12 }}
          spacing={0}
          // _before={{
          //   content: '""',
          //   pos: 'absolute',
          //   [(id.at(-1) ?? '') === '0' ? 'bottom' : 'top']: `-4px`,
          //   left: 0,
          //   [(id.at(-1) ?? '') === '0' ? 'top' : 'bottom']: '50%',
          //   w: 1,
          //   bg: isWinner ? 'blue.400' : 'border',
          // }}
        >
          {match.map((tournament, index) => (
            <Box
              key={tournament.id}
              pos="absolute"
              left={-1}
              w={1}
              {...{
                [(tournament.id.at(-1) ?? '') === '0' ? 'bottom' : 'top']:
                  '50%',
                h: `calc(100% / ${numOfClass?.flat()?.length} / 2 * ${
                  numOfClass?.[Math.abs(index - 1)]?.length
                } - 2px)`,
                bg: winnerId === tournament.id ? 'blue.400' : 'border',
              }}
            />
          ))}
          <TournamentMetaPopover
            id={id}
            meta={meta}
            participants={participants}
            match={match}
          />
          <StackDivider
            borderColor={participants.length ? 'blue.400' : 'border'}
            borderWidth={2}
          />
        </VStack>
      </HStack>
    ) : (
      <TournamentLeaf isWinner={isWinner} {...classInfo} />
    );
  }
);

const TournamentLeaf = React.memo(
  ({
    type,
    grade,
    class: classNum,
    isWinner,
  }: ClassmatchClass & { isWinner: boolean }) => (
    <HStack spacing={4} alignSelf="stretch">
      <Center py={1} flexShrink={0}>
        <Text w="full" textStyle="title" fontFamily="monospace" fontSize="2xl">
          {type === 'teacher' ? '職員' : `${grade}-${classNum}`}
        </Text>
      </Center>
      <VStack
        pos="relative"
        alignSelf="stretch"
        justify="center"
        minW={{ base: 8, md: 12 }}
        flexGrow={1}
        // _before={{
        //   content: '""',
        //   pos: 'absolute',
        //   [(id.at(-1) ?? '') === '0' ? 'bottom' : 'top']: 0,
        //   right: 0,
        //   h: '50%',
        //   w: 1,
        //   bg: isWinner ? 'blue.400' : 'border',
        // }}
      >
        <StackDivider
          borderColor={isWinner ? 'blue.400' : 'border'}
          borderWidth={2}
        />
      </VStack>
    </HStack>
  )
);
