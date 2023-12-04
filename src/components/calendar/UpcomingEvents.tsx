import {
  HStack,
  VStack,
  Text,
  Tag,
  Icon,
  Spacer,
  TagCloseButton,
  IconButton,
  Collapse,
  useDisclosure,
  Box,
  Center,
  StackDivider,
  WrapItem,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { format, isSameDay } from 'date-fns';
import { TbChevronRight, TbFilter, TbPlus } from 'react-icons/tb';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { AsyncSelect } from 'chakra-react-select';
import Error from '../cards/Error';
import Loading from '../common/Loading';
import { tagsAtom } from '@/store/tags';
import { useEvents, useTagsSearch } from '@/services/calendar';

interface UpcomingEventsProps {
  year: number;
  month: number;
  day: number;
}

function UpcomingEvents({ year, month, day }: UpcomingEventsProps) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [tags, setTags] = useRecoilState(tagsAtom);

  const { data, status, error } = useEvents({ year, month, day });
  const {
    data: tagSearchRes,
    mutate,
    mutateAsync,
    isPending,
  } = useTagsSearch();

  // set default tags
  useEffect(() => {
    mutate('all', {
      onSuccess: (res) => {
        setTags((oldTags) => [
          ...oldTags,
          ...res.filter((tag) =>
            oldTags.some((oldTag) => oldTag.value === tag.value),
          ),
        ]);
      },
    });
  }, [mutate, setTags]);

  const filteredEvents = data
    ?.sort((first, second) => {
      if (
        new Date(first.startAt).getTime() <
          new Date(second.startAt).getTime() ||
        (first.isAllDay && !second.isAllDay)
      ) {
        return -1;
      }
      if (
        new Date(first.startAt).getTime() >
          new Date(second.startAt).getTime() ||
        (!first.isAllDay && second.isAllDay)
      ) {
        return 1;
      }
      return 0;
    })
    .filter((event) => {
      if (!tags.length) return true;
      return tags.some((tag) =>
        event.tags.some((eventTag) => tag.value === eventTag.value),
      );
    });

  if (status === 'pending') return <Loading />;
  if (status === 'error') return <Error error={error} />;

  return (
    <VStack w="100%" spacing={2}>
      <HStack w="100%" overflowX="auto">
        <Icon as={TbFilter} w={6} h={6} />
        {tags?.map((tag) => (
          <WrapItem key={tag.value}>
            <Tag size="md" rounded="full" whiteSpace="nowrap">
              {tag.label}
              <TagCloseButton
                onClick={() => {
                  setTags((oldTags) =>
                    oldTags.filter((oldTag) => oldTag.value !== tag.value),
                  );
                }}
              />
            </Tag>
          </WrapItem>
        ))}
        <Center bg="inherit" position="sticky" right={0} pl={1}>
          <IconButton
            aria-label="Add filter"
            icon={<TbPlus />}
            variant="ghost"
            isRound
            size="sm"
            onClick={onToggle}
          />
        </Center>
      </HStack>
      <Box w="100%">
        <Collapse in={isOpen}>
          <AsyncSelect
            placeholder="タグを選択"
            menuPosition="fixed"
            onChange={(value) => {
              setTags((oldTags) => [...oldTags, value as Tag]);
              onClose();
            }}
            value={null}
            options={tagSearchRes}
            loadOptions={(value) => mutateAsync(value)}
            isLoading={isPending}
            chakraStyles={{
              container: (provided) => ({
                ...provided,
                w: '100%',
                textStyle: 'title',
              }),
              // valueContainer: (provided) => ({
              //   ...provided,
              //   ml: 5,
              // }),
              menu: (provided) => ({
                ...provided,
                shadow: 'lg',
                zIndex: 2,
              }),
            }}
          />
        </Collapse>
      </Box>
      {filteredEvents?.length ? (
        filteredEvents?.map((event) => (
          <HStack
            w="100%"
            p={2}
            key={event._id}
            // border="1px solid var(--chakra-colors-gray-100)"
            rounded="xl"
            // shadow="lg"
            as={RouterLink}
            to={`/events/${event._id}`}
            layerStyle="button"
          >
            <VStack
              h="100%"
              minW={10}
              justify="space-between"
              align="flex-end"
              textStyle="title"
              fontSize="xs"
            >
              {event.isAllDay ? (
                <Text>終日</Text>
              ) : (
                <>
                  <Text>
                    {isSameDay(
                      new Date(year, month - 1, day),
                      new Date(event.startAt),
                    )
                      ? format(new Date(event.startAt), 'HH:mm')
                      : '0:00'}
                  </Text>
                  <Text>
                    {isSameDay(
                      new Date(year, month - 1, day),
                      new Date(event.endAt),
                    )
                      ? format(new Date(event.endAt), 'HH:mm')
                      : '0:00'}
                  </Text>
                </>
              )}
            </VStack>
            <StackDivider
              borderColor={event.external ? 'green.400' : 'blue.400'}
              borderWidth={1}
            />
            <VStack align="flex-start" spacing={1} w="100%">
              <Text textStyle="title" noOfLines={1}>
                {event.title}
              </Text>
              <Text textStyle="description" fontSize="xs" noOfLines={1}>
                {event.description}
              </Text>
              <HStack w="100%" flexGrow={0} noOfLines={1} align="flex-start">
                {event.tags?.map((tag) => (
                  <Tag key={tag.value} size="sm" whiteSpace="nowrap">
                    {tag.label}
                  </Tag>
                ))}
              </HStack>
            </VStack>
            <Spacer />
            <Icon as={TbChevronRight} />
          </HStack>
        ))
      ) : (
        <Center w="100%" flexGrow={1}>
          <Text textStyle="description" fontWeight="bold">
            予定されているイベントはありません
          </Text>
        </Center>
      )}
    </VStack>
  );
}

export default UpcomingEvents;
