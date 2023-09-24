import {
  HStack,
  Heading,
  Icon,
  LinkBox,
  Spacer,
  VStack,
} from '@chakra-ui/react';
import { TbChevronRight } from 'react-icons/tb';
import { Link as RouterLink } from 'react-router-dom';
import UpcomingMatch from '../classmatch/UpcomingMatch';

export default function Classmatch() {
  const date = new Date();
  const season = date.getMonth() > 6 ? 'autumn' : 'spring';

  return (
    <VStack w="full" spacing={4} align="flex-start">
      <LinkBox
        w="full"
        as={RouterLink}
        to={`/classmatch/${date.getFullYear()}`}
      >
        <HStack pt={2} pl={2} w="full">
          <Heading as="h2" size="md">
            クラスマッチ
          </Heading>
          <Spacer />
          <Icon as={TbChevronRight} boxSize={5} />
        </HStack>
      </LinkBox>
      <VStack w="full" p={2}>
        <UpcomingMatch year={date.getFullYear()} season={season} />
      </VStack>
    </VStack>
  );
}
