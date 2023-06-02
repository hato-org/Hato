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
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import {
  useClassmatchSportInfo,
  useClassmatchSports,
} from '@/hooks/classmatch';
import { overlayAtom } from '@/store/overlay';
import Tournament from './Tournament';
import Loading from '../common/Loading';
import Error from '../cards/Error';

const TournamentModal = React.memo(
  ({ year, season }: { year: number; season: ClassmatchSeason }) => {
    const invertValue = useColorModeValue('0%', '87.2%');
    const [{ classmatchTournament }, setOverlay] = useRecoilState(overlayAtom);

    const { data, isLoading, error } = useClassmatchSportInfo(
      { year, season, sport: classmatchTournament?.sport },
      { enabled: !!classmatchTournament }
    );

    const { data: sports } = useClassmatchSports(
      { year, season },
      { enabled: !!classmatchTournament }
    );

    return (
      <Modal
        isOpen={!!classmatchTournament}
        onClose={() =>
          setOverlay((currVal) => ({
            ...currVal,
            classmatchTournament: undefined,
          }))
        }
        size="xl"
      >
        <ModalOverlay />
        <ModalContent overflow="hidden" bg="panel" rounded="xl">
          <ModalCloseButton top={4} right={4} size="lg" />
          <ModalHeader>
            {
              sports?.find(
                ({ id }) =>
                  id ===
                  (classmatchTournament ? classmatchTournament.sport : '')
              )?.name
            }
          </ModalHeader>
          <ModalBody>
            {/* eslint-disable no-nested-ternary */}
            {isLoading ? (
              <Loading />
            ) : error ? (
              <Error error={error} />
            ) : (
              <VStack spacing={0}>
                <Box p={4}>
                  <Image
                    src={`/classmatch/${classmatchTournament?.year}/${data.map}.png`}
                    rounded="xl"
                    filter={`invert(${invertValue})`}
                  />
                </Box>
                <Tournament {...data.tournament} />
              </VStack>
            )}
            {/* eslint-enable no-nested-ternary */}
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    );
  }
);

export default TournamentModal;
