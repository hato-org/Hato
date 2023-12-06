import {
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="panel" rounded="xl">
        <ModalCloseButton top={4} right={4} />
        <ModalHeader>過去のクラスマッチ</ModalHeader>
        <ModalBody>
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
                  <StackDivider
                    borderWidth={2}
                    borderColor={
                      season === 'spring' ? 'pink.300' : 'orange.500'
                    }
                    rounded="full"
                  />
                  <VStack align="flex-start" spacing={0}>
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
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
