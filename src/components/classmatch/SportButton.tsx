import React from 'react';
import { Icon, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { sportIcon } from '@/utils/classmatch';
import TournamentModal from './TournamentModal';

const SportButton = React.memo(
  ({
    id,
    name,
    year,
    season,
    sport,
  }: ClassmatchSport & {
    year: number;
    season: ClassmatchSeason;
    sport: ClassmatchSportId;
  }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <>
        <VStack
          as="button"
          p={4}
          rounded="xl"
          layerStyle="button"
          onClick={onOpen}
        >
          <Icon as={sportIcon[id]} boxSize={10} />
          <Text textStyle="title">{name}</Text>
        </VStack>
        <TournamentModal
          isOpen={isOpen}
          onClose={onClose}
          year={year}
          season={season}
          sport={sport}
        />
      </>
    );
  },
);

export default SportButton;
