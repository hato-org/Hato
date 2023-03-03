import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  HStack,
  IconButton,
  Heading,
  useDisclosure,
  Text,
  Spacer,
  Icon,
  VStack,
  Box,
} from '@chakra-ui/react';
import { TbInfoCircle, TbPlus, TbX, TbBulb } from 'react-icons/tb';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import Header from '@/components/nav/Header';
import Calendar from '@/components/calendar/Calendar';
import FloatButton from '@/components/layout/FloatButton';
import AddEventDrawer from '@/components/calendar/AddEventDrawer';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import { tutorialAtom, tutorialModalAtom } from '@/store/tutorial';
import Card from '@/components/layout/Card';

function Events() {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setTutorialModal = useSetRecoilState(tutorialModalAtom);
  const onHelpOpen = useCallback(
    () => setTutorialModal((currVal) => ({ ...currVal, events: true })),
    [setTutorialModal]
  );
  const onIcalOpen = useCallback(
    () => setTutorialModal((currVal) => ({ ...currVal, iCal: true })),
    [setTutorialModal]
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [tutorial, setTutorial] = useRecoilState(tutorialAtom);
  const [date, setDate] = useState(new Date());

  const year = useMemo(() => Number(searchParams.get('y')), [searchParams]);
  const month = useMemo(() => Number(searchParams.get('m')), [searchParams]);

  useEffect(() => {
    if (searchParams.has('y') && searchParams.has('m')) {
      setDate(
        new Date(
          Number(searchParams.get('y')),
          Number(searchParams.get('m')) - 1
        )
      );
    } else {
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
    <Box>
      <Helmet>
        <title>年間行事予定 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header withMenu>
        <HStack w="100%">
          <Heading size="md" ml={2} py={4}>
            年間行事予定
          </Heading>
          <Spacer />
          <IconButton
            aria-label="open help"
            icon={<Icon as={TbInfoCircle} w={6} h={6} />}
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
      >
        <VStack px={4} mb={24}>
          {!tutorial.iCal && (
            <Card w="100%">
              <VStack w="100%" position="relative">
                <Icon as={TbBulb} w={16} h={16} color="yellow.500" />
                <Text textStyle="link" fontWeight="bold" onClick={onIcalOpen}>
                  他のカレンダーと連携できます
                </Text>
                <IconButton
                  variant="ghost"
                  aria-label="Close iCal info"
                  position="absolute"
                  top={0}
                  right={0}
                  icon={<TbX />}
                  onClick={() =>
                    setTutorial((oldTutorial) => ({
                      ...oldTutorial,
                      iCal: true,
                    }))
                  }
                />
              </VStack>
            </Card>
          )}
          <Calendar year={year} month={month} />
        </VStack>
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
    </Box>
  );
}

export default Events;
