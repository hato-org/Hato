import { useCallback } from 'react';
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Stack,
  Icon,
  VStack,
  Text,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { TbCheck, TbPencil, TbPlus } from 'react-icons/tb';
import { useAtom, useSetAtom } from 'jotai';
import {
  DndContext,
  useSensors,
  useSensor,
  DragEndEvent,
  MouseSensor,
  KeyboardSensor,
  TouchSensor,
} from '@dnd-kit/core';
import type { Announcements } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { ErrorBoundary } from 'react-error-boundary';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import Card from '@/components/layout/Card';
import CardElement from '@/components/cards';
import Header from '@/components/nav/Header';
import { cardOrderDrawerAtom } from '@/store/overlay';
import { cards, cardOrderAtom, dashboardEditModeAtom } from '@/store/dashboard';
import { cardComponentMap } from '@/components/cards';
import SortableCard from '@/components/dashboard/SortableCard';
import CardErrorFallback from '@/components/dashboard/CardErrorFallback';

function Dashboard() {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useAtom(dashboardEditModeAtom);
  const setCardOrderDrawer = useSetAtom(cardOrderDrawerAtom);
  const [cardOrder, setCardOrder] = useAtom(cardOrderAtom);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 0,
      },
    }),
  );

  const announcements: Announcements = {
    onDragStart({ active }) {
      const card = cards.find(({ id }) => id === active.id);
      return `${card?.name ?? 'カード'}を掴みました`;
    },
    onDragOver({ active, over }) {
      const activeCard = cards.find(({ id }) => id === active.id);
      if (over) {
        const overCard = cards.find(({ id }) => id === over.id);
        return `${activeCard?.name ?? 'カード'}を${overCard?.name ?? 'カード'}の上に移動しました`;
      }
      return `${activeCard?.name ?? 'カード'}はドロップエリア外です`;
    },
    onDragEnd({ active, over }) {
      const activeCard = cards.find(({ id }) => id === active.id);
      if (over) {
        const overCard = cards.find(({ id }) => id === over.id);
        return `${activeCard?.name ?? 'カード'}を${overCard?.name ?? 'カード'}の位置に移動しました`;
      }
      return `${activeCard?.name ?? 'カード'}をドロップしました`;
    },
    onDragCancel({ active }) {
      const card = cards.find(({ id }) => id === active.id);
      return `ドラッグをキャンセルしました。${card?.name ?? 'カード'}は元の位置に戻りました`;
    },
  };

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over) return;

      setCardOrder((prevOrder) => {
        const oldIndex = prevOrder.indexOf(active.id.toString());
        const newIndex = prevOrder.indexOf(over.id.toString());

        return arrayMove(prevOrder, oldIndex, newIndex);
      });
    },
    [setCardOrder],
  );

  return (
    <Box>
      <Helmet>
        <title>ホーム - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header withMenu={!editMode}>
        <HStack w="100%">
          <Heading size="md" ml={editMode ? 4 : 2} py={4}>
            {editMode ? 'ホーム画面を編集' : 'ホーム'}
          </Heading>
          <Spacer />
          {editMode && (
            <IconButton
              aria-label="Add card"
              icon={<Icon as={TbPlus} boxSize={6} />}
              variant="ghost"
              size="lg"
              isRound
              onClick={() => setCardOrderDrawer(true)}
            />
          )}
          <IconButton
            aria-label="Edit dashboard"
            icon={<Icon as={editMode ? TbCheck : TbPencil} boxSize={6} />}
            color={editMode ? 'green.400' : undefined}
            variant="ghost"
            size="lg"
            isRound
            onClick={() => setEditMode(!editMode)}
          />
        </HStack>
      </Header>

      <ChakraPullToRefresh
        w="100%"
        minH="100vh"
        mb={16}
        isPullable={!editMode}
        onRefresh={async () => {
          await queryClient.invalidateQueries({ type: 'active' });
        }}
      >
        <Stack>
          {editMode ? (
            <DndContext
              onDragEnd={onDragEnd}
              sensors={sensors}
              accessibility={{ announcements }}
            >
              <SortableContext items={cardOrder}>
                <Flex flex={1} p={4} pt={-4} pb={16} flexDir="column">
                  {cardOrder.map((cardId) => (
                    <SortableCard key={cardId} cardId={cardId} />
                  ))}
                </Flex>
              </SortableContext>
            </DndContext>
          ) : (
            <Stack flex={1} p={4} pb={16} spacing={8}>
              <CardElement.Info />
              {cardOrder.length ? (
                cardOrder.map((cardId) => {
                  const CardComponent = cardComponentMap[cardId];
                  return (
                    <Card key={cardId}>
                      <ErrorBoundary FallbackComponent={CardErrorFallback}>
                        {CardComponent && <CardComponent />}
                      </ErrorBoundary>
                    </Card>
                  );
                })
              ) : (
                <VStack>
                  <Text color="description" textStyle="title" fontSize="4xl">
                    :(
                  </Text>
                  <Text
                    textAlign="center"
                    color="description"
                    fontSize="md"
                    fontWeight="bold"
                  >
                    カードがありません。
                    <br />
                    右上の編集ボタンから追加できます
                  </Text>
                </VStack>
              )}
            </Stack>
          )}
        </Stack>
      </ChakraPullToRefresh>
    </Box>
  );
}

export default Dashboard;
