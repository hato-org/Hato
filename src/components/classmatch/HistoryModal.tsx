import { HStack, Icon, Spacer, StackSeparator, Text, VStack } from '@chakra-ui/react';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { TbChevronRight } from 'react-icons/tb';
import Error from '../cards/Error';
import Loading from '../common/Loading';
import { useClassmatchHistory } from '@/services/classmatch';

export default function HistoryModal({
  isOpen,
  onClose,
  onSelected,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelected: ({
    year,
    season,
  }: {
    year: number;
    season: ClassmatchSeason;
  }) => void;
}) {
  const { data, isPending, error } = useClassmatchHistory();

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && (onClose)()} size="xl">
      <DialogContent bg="panel" rounded="xl">
        <DialogCloseTrigger top={4} right={4} />
        <DialogHeader>過去のクラスマッチ</DialogHeader>
        <DialogBody>
          <VStack w="full">
            {isPending ? (
              <Loading />
            ) : error ? (
              <Error error={error} />
            ) : (
              data?.map(({ year, season, startAt, endAt }) => (
                <HStack
                  key={year + season}
                  w="full"
                  px={4}
                  py={2}
                  rounded="lg"
                  layerStyle="button"
                  onClick={() => {
                    onSelected({ year, season });
                    onClose();
                  }}
                >
                  <StackSeparator
                    borderWidth={2}
                    borderColor={
                      season === 'spring' ? 'pink.300' : 'orange.500'
                    }
                    rounded="full"
                  />
                  <VStack align="flex-start" gap={0}>
                    <Text fontSize="xl" textStyle="title">
                      {year} {season === 'spring' ? '春' : '秋'}
                    </Text>
                    <Text textStyle="description">
                      {format(new Date(startAt), 'MM/dd')} -{' '}
                      {format(new Date(endAt), 'MM/dd')}
                    </Text>
                  </VStack>
                  <Spacer />
                  <Icon as={TbChevronRight} boxSize={6} />
                </HStack>
              ))
            )}
          </VStack>
        </DialogBody>
        <DialogFooter />
      </DialogContent>
    </DialogRoot>
  );
}
