import React from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  useClassmatchSportInfo,
  useClassmatchSports,
} from '@/services/classmatch';
import Tournament from './Tournament';
import Loading from '../common/Loading';
import Error from '../cards/Error';

const TournamentModal = React.memo(
  ({
    isOpen,
    onClose,
    year,
    season,
    sport,
  }: {
    isOpen: boolean;
    onClose: () => void;
    year: number;
    season: ClassmatchSeason;
    sport: ClassmatchSportId;
  }) => {
    const darkSuffix = useColorModeValue('', '_dark');

    const { data, status, error } = useClassmatchSportInfo(
      { year, season, sport },
      { enabled: isOpen },
    );

    const { data: sports } = useClassmatchSports(
      { year, season },
      { enabled: isOpen },
    );

    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent overflow="hidden" bg="panel" rounded="xl">
          <ModalCloseButton top={4} right={4} size="lg" />
          <ModalHeader>
            {sports?.find(({ id }) => id === sport)?.name}
          </ModalHeader>
          <ModalBody>
            {status === 'pending' ? (
              <Loading />
            ) : status === 'error' ? (
              <Error error={error} />
            ) : (
              <VStack spacing={0}>
                <Image
                  w="full"
                  aspectRatio="4 / 3"
                  src={`/classmatch/${year}/${data.map}${darkSuffix}.png`}
                  rounded="xl"
                />
                <Tournament
                  year={year}
                  season={season}
                  sport={sport}
                  {...data.tournament}
                />
              </VStack>
            )}
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    );
  },
);

export default TournamentModal;
