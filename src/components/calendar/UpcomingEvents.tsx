import {
  HStack,
  VStack,
  Text,
  Tag,
  Icon,
  Spacer,
  TagCloseButton,
  Wrap,
  IconButton,
  Collapse,
  useDisclosure,
  Box,
  Center,
  StackDivider,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { format, isSameDay } from 'date-fns';
import { TbChevronRight, TbFilter, TbPlus } from 'react-icons/tb';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Select } from 'chakra-react-select';
import { useClient } from '@/modules/client';
import { useAllTagList } from '@/hooks/calendar/tag';
import { useUser } from '@/hooks/user';
import Error from '../cards/Error';
import Loading from '../common/Loading';
import { tagsAtom } from '@/store/tags';

interface UpcomingEventsProps {
  year: number;
  month: number;
  day: number;
}

function UpcomingEvents({ year, month, day }: UpcomingEventsProps) {
  const { client } = useClient();
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const { data: allTag } = useAllTagList();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [tags, setTags] = useRecoilState(tagsAtom);

  // 全タグリストが非同期でフェッチされるのでリストが変更された際に再計算
  useEffect(() => {
    if (!allTag) return;
    setTags((oldTags) => [
      ...oldTags,
      ...allTag.filter(
        (tag) =>
          !oldTags.some((oldTag) => oldTag.value === tag.value) &&
          (tag.value === 'all' || // 全校
            tag.value === `${user?.type}-all` || // 高校 / 中学
            tag.value === `${user?.type}-${user?.grade}` || // 学年
            tag.value === `${user?.grade}${user?.class}` || // クラス
            tag.value === `${user?.type}-${user?.grade}-${user?.course}`) // コース
      ),
    ]);
  }, [allTag, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data, isLoading, error } = useQuery<Event[], AxiosError>(
    ['calendar', 'events', { year, month, day }],
    async () =>
      (
        await client.get('/calendar/event', {
          params: {
            y: year,
            m: month,
            d: day,
          },
        })
      ).data,
    {
      cacheTime: Infinity,
      onSuccess: (events) => {
        events.forEach((event) => {
          queryClient.setQueryData(['calendar', 'event', event._id], event);
        });
      },
    }
  );

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
        event.tags.some((eventTag) => tag.value === eventTag.value)
      );
    });

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <VStack w="100%" spacing={2}>
      <HStack w="100%">
        <Icon as={TbFilter} w={6} h={6} />
        <Wrap align="center" w="100%">
          {tags?.map((tag) => (
            <Tag whiteSpace="nowrap" key={tag.value}>
              {tag.label}
              <TagCloseButton
                onClick={() => {
                  setTags((oldTags) =>
                    oldTags.filter((oldTag) => oldTag.value !== tag.value)
                  );
                }}
              />
            </Tag>
          ))}
          <IconButton
            aria-label="Add filter"
            icon={<TbPlus />}
            variant="ghost"
            isRound
            size="sm"
            onClick={onToggle}
          />
        </Wrap>
      </HStack>
      <Box w="100%">
        <Collapse in={isOpen}>
          <Select
            placeholder="タグを選択"
            menuPosition="fixed"
            onChange={(value) => {
              setTags((oldTags) => [...oldTags, value as Tag]);
              onClose();
            }}
            options={allTag}
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
                      new Date(event.startAt)
                    )
                      ? format(new Date(event.startAt), 'HH:mm')
                      : '0:00'}
                  </Text>
                  <Text>
                    {isSameDay(
                      new Date(year, month - 1, day),
                      new Date(event.endAt)
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
