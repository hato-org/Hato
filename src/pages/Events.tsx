import { useEffect } from 'react';
import {
  HStack,
  IconButton,
  Heading,
  Box,
  useDisclosure,
  Text,
  Spacer,
  Center,
  Icon,
} from '@chakra-ui/react';
import { TbInfoCircle, TbPlus, TbArrowNarrowDown } from 'react-icons/tb';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import Loading from '../components/common/Loading';
import Header from '../components/nav/Header';
import BottomNavbar from '../components/nav/BottomNavbar';
import Calendar from '../components/calendar/Calendar';
import FloatButton from '../components/layout/FloatButton';
import AddEventDrawer from '../components/calendar/AddEventDrawer';
import ChakraPullToRefresh from '../components/layout/PullToRefresh';
import Tutorial from '../components/tutorial';
import { tutorialAtom } from '../store/tutorial';

function Events() {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isHelpOpen,
    onOpen: onHelpOpen,
    onClose: onHelpClose,
  } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tutorial, setTutorial] = useRecoilState(tutorialAtom);

  const year = Number(searchParams.get('y'));
  const month = Number(searchParams.get('m'));

  useEffect(() => {
    const date = new Date();

    if (!searchParams.has('y') || !searchParams.has('m')) {
      searchParams.set('y', String(date.getFullYear()));
      searchParams.set('m', String(date.getMonth() + 1));
      setSearchParams(searchParams, {
        replace: true,
      });
    }
    if (!tutorial.events) {
      onHelpOpen();
      setTutorial((oldVal) => ({
        ...oldVal,
        events: true,
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Helmet>
        <title>年間行事予定 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack w="100%" px={2}>
          {/* <IconButton
            aria-label="go back"
            icon={<TbArrowNarrowLeft />}
            variant="ghost"
            size="lg"
            isRound
            onClick={() => navigate(-1)}
          /> */}
          <Heading size="md" ml={4} py={4}>
            年間行事予定
          </Heading>
          <Tutorial.Events isOpen={isHelpOpen} onClose={onHelpClose} />
          <Spacer />
          <IconButton
            aria-label="open help"
            icon={<TbInfoCircle />}
            onClick={onHelpOpen}
            isRound
            size="lg"
            variant="ghost"
          />
        </HStack>
      </Header>
      <ChakraPullToRefresh
        w="100%"
        onRefresh={async () => {
          await Promise.all([queryClient.invalidateQueries(['calendar'])]);
        }}
        refreshingContent={<Loading />}
        pullingContent={
          <Center flexGrow={1} p={4}>
            <Icon as={TbArrowNarrowDown} w={6} h={6} color="gray.500" />
          </Center>
        }
      >
        <Box px={4} mb={24}>
          <Calendar year={year} month={month} />
        </Box>
      </ChakraPullToRefresh>
      <FloatButton
        aria-label="create event"
        size="lg"
        colorScheme="blue"
        mb={16}
        mr={4}
        onClick={onOpen}
        leftIcon={<TbPlus />}
      >
        <Text>イベントを追加</Text>
      </FloatButton>
      <AddEventDrawer isOpen={isOpen} onClose={onClose} />
      <BottomNavbar />
    </>
  );
}

export default Events;
