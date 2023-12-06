import { useCallback } from 'react';
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Stack,
  Icon,
  Flex,
  VStack,
  Text,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { TbCheck, TbPencil, TbPlus, TbTrash } from 'react-icons/tb';
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
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import Card from '@/components/layout/Card';
import CardElement from '@/components/cards';
import Header from '@/components/nav/Header';
import { overlayAtom } from '@/store/overlay';
import { cards, cardOrderAtom, dashboardEditModeAtom } from '@/store/dashboard';

function Dashboard() {
  // const [date] = useSeconds();

  // const formatDate = new Intl.DateTimeFormat([], {
  //   dateStyle: 'full',
  //   timeStyle: 'short',
  // }).format(date);
  // const hour = new Date().getHours();
  // const greet =
  //   hour > 0 && hour < 4
  //     ? 'こんばんは'
  //     : hour >= 4 && hour < 9
  //     ? 'おはようございます'
  //     : hour >= 9 && hour < 19
  //     ? 'こんにちは'
  //     : 'こんばんは';

  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useAtom(dashboardEditModeAtom);
  const setOverlay = useSetAtom(overlayAtom);
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
              onClick={() =>
                setOverlay((currVal) => ({ ...currVal, cardOrder: true }))
              }
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
          {/* <IconButton
            aria-label="Go to settings"
            icon={<Icon as={TbSettings} boxSize={6} />}
            variant="ghost"
            size="lg"
            isRound
            as={RouterLink}
            to="/settings"
          /> */}
        </HStack>
      </Header>

      <ChakraPullToRefresh
        w="100%"
        minH="100vh"
        mb={16}
        isPullable={!editMode}
        onRefresh={async () => {
          await Promise.all([
            queryClient.invalidateQueries({ type: 'active' }),
          ]);
        }}
      >
        <Stack>
          {/* <VStack w="100%" align="flex-start" spacing={1}>
            <Heading as="h2" textStyle="title">
              {greet}
            </Heading>
            <Text fontWeight="bold" textStyle="description">
              {formatDate}
            </Text>
          </VStack> */}
          {editMode ? (
            <DndContext onDragEnd={onDragEnd} sensors={sensors}>
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
                cardOrder.map((cardId) => (
                  <Card key={cardId}>
                    {cards.find(({ id }) => cardId === id)?.component}
                  </Card>
                ))
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

function SortableCard({ cardId }: { cardId: string }) {
  const card = cards.find(({ id }) => id === cardId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card?.id ?? 'draggable',
  });

  const setCardOrder = useSetAtom(cardOrderAtom);

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        transition,
      }
    : undefined;

  return card ? (
    <Card
      pos="relative"
      style={style}
      my={4}
      sx={{
        touchAction: isDragging ? 'manipulation' : 'auto',
      }}
      zIndex={isDragging ? 1 : 0}
    >
      {card.component}
      <Flex
        pos="absolute"
        inset={0}
        rounded="xl"
        backdropFilter="auto"
        backdropBlur="2px"
        {...attributes}
        {...listeners}
        ref={setNodeRef}
      />
      <IconButton
        pos="absolute"
        top="50%"
        left="50%"
        aria-label="Delete card"
        icon={<Icon as={TbTrash} boxSize={6} />}
        colorScheme="red"
        variant="ghost"
        size="lg"
        isRound
        transform="translate(-50%, -50%) scale(1.5)"
        onClick={() =>
          setCardOrder((currVal) => currVal.filter((id) => id !== card.id))
        }
      />
    </Card>
  ) : null;
}

export default Dashboard;
