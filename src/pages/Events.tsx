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
import { useAtom, useSetAtom } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import { addMonths, subMonths } from 'date-fns/esm';
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
  const setTutorialModal = useSetAtom(tutorialModalAtom);
  const onHelpOpen = useCallback(
    () => setTutorialModal((currVal) => ({ ...currVal, events: true })),
    [setTutorialModal],
  );
  const onIcalOpen = useCallback(
    () => setTutorialModal((currVal) => ({ ...currVal, iCal: true })),
    [setTutorialModal],
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [tutorial, setTutorial] = useAtom(tutorialAtom);
  const year = useMemo(() => Number(searchParams.get('y')), [searchParams]);
  const month = useMemo(() => Number(searchParams.get('m')), [searchParams]);
  const [date, setDate] = useState(
    year && month ? new Date(year, month - 1, 1) : new Date(),
  );

  useEffect(() => {
    if (!tutorial.events) {
      onHelpOpen();
      setTutorial((oldVal) => ({
        ...oldVal,
        events: true,
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    searchParams.set('y', date.getFullYear().toString());
    searchParams.set('m', (date.getMonth() + 1).toString());
    searchParams.set('d', date.getDate().toString());
    setSearchParams(searchParams, { replace: true });
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

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
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['calendar'] }),
          ]);
        }}
      >
        <VStack px={4} mb={40}>
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
          <Calendar
            year={year}
            month={month}
            onPrevMonth={() => setDate((prev) => subMonths(prev, 1))}
            onNextMonth={() => setDate((prev) => addMonths(prev, 1))}
          />
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
