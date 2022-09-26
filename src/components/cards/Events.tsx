import { Heading, HStack, Icon, Spacer, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TbChevronRight } from 'react-icons/tb';
import UpcomingEvents from '../calendar/UpcomingEvents';

function Events() {
  const date = new Date();

  return (
    <VStack w="100%" spacing={4}>
      <HStack w="100%" pt={2} pl={2} as={RouterLink} to="/events">
        <Heading as="h2" size="md">
          今日の予定
        </Heading>
        <Spacer />
        <Icon as={TbChevronRight} w={5} h={5} />
      </HStack>
      <UpcomingEvents
        year={date.getFullYear()}
        month={date.getMonth() + 1}
        day={date.getDate()}
      />
    </VStack>
  );
}

export default Events;
