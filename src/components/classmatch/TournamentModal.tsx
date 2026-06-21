import React from 'react';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from '@/components/ui/dialog';
import { VStack, Image } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
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
      <DialogRoot
        open={isOpen}
        onOpenChange={(e) => !e.open && onClose()}
        size="xl"
      >
        <DialogContent overflow="hidden" bg="panel" rounded="xl">
          <DialogCloseTrigger top={4} right={4} />
          <DialogHeader>
            {sports?.find(({ id }) => id === sport)?.name}
          </DialogHeader>
          <DialogBody>
            {status === 'pending' ? (
              <Loading />
            ) : status === 'error' ? (
              <Error error={error} />
            ) : (
              <VStack gap={0}>
                <Image
                  w="full"
                  aspectRatio="4 / 3"
                  src={`/classmatch/${year}/${data.map}${darkSuffix}.png`}
                  rounded="xl"
                  alt="トーナメント表"
                />
                <Tournament
                  year={year}
                  season={season}
                  sport={sport}
                  {...data.tournament}
                />
              </VStack>
            )}
          </DialogBody>
          <DialogFooter />
        </DialogContent>
      </DialogRoot>
    );
  },
);
TournamentModal.displayName = 'TournamentModal';

export default TournamentModal;
