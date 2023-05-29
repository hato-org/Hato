import React from 'react';
import { Icon, Text, VStack } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import { overlayAtom } from '@/store/overlay';
import { sportIcon } from '@/utils/classmatch';

const SportButton = React.memo(
  ({
    id,
    name,
    year,
    season,
  }: ClassmatchSport & { year: number; season: ClassmatchSeason }) => {
    const setOverlay = useSetRecoilState(overlayAtom);

    return (
      <VStack
        as="button"
        p={4}
        rounded="xl"
        layerStyle="button"
        onClick={() =>
          setOverlay((currVal) => ({
            ...currVal,
            classmatchTournament: { year, season, sport: id },
          }))
        }
      >
        <Icon as={sportIcon[id]} boxSize={10} />
        <Text textStyle="title">{name}</Text>
      </VStack>
    );
  }
);

export default SportButton;
