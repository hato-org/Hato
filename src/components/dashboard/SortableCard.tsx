import { Flex, IconButton, Icon } from '@chakra-ui/react';
import { TbTrash } from 'react-icons/tb';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSetAtom } from 'jotai';
import { ErrorBoundary } from 'react-error-boundary';
import Card from '@/components/layout/Card';
import { cardComponentMap } from '@/components/cards';
import { cards, cardOrderAtom } from '@/store/dashboard';
import CardErrorFallback from './CardErrorFallback';

export default function SortableCard({ cardId }: { cardId: string }) {
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

  const CardComponent = cardComponentMap[cardId];

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
      <ErrorBoundary FallbackComponent={CardErrorFallback}>
        {CardComponent && <CardComponent />}
      </ErrorBoundary>
      <Flex
        pos="absolute"
        inset={0}
        rounded="xl"
        backdropFilter="auto"
        backdropBlur="2px"
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        aria-roledescription="並べ替え可能なカード"
        aria-label={card?.name}
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
