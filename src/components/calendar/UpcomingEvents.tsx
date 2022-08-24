import {
  Stack,
  HStack,
  VStack,
  Text,
  Tag,
  Icon,
  Spacer,
  Divider,
  TagCloseButton,
  Wrap,
  IconButton,
  Collapse,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { TbChevronRight, TbFilter, TbPlus } from "react-icons/tb";
import { useClient } from "../../modules/client";
import { CardElement } from "../cards";
import Loading from "../common/Loading";
import { useAllTagList } from "../../hooks/calendar/tag";
import { useEffect, useState } from "react";
import { Select } from "chakra-react-select";
import { useAuth } from "../../modules/auth";

interface UpcomingEventsProps {
  year: number;
  month: number;
  day: number;
}

const UpcomingEvents = ({ year, month, day }: UpcomingEventsProps) => {
  if (!year || !month || !day) return <></>;
  const { client } = useClient();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: allTag } = useAllTagList();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [tagFilter, setTagFilter] = useState<Tag[]>([]);

  // 全タグリストが非同期でフェッチされるのでリストが変更された際に再計算
  useEffect(() => {
    if (!allTag) return;
    setTagFilter((oldTags) => [
      ...oldTags,
      ...allTag
        .filter(
          (tag) =>
            tag.value === "all" || // 全校
            tag.value === `${user?.type}-all` || // 高校 / 中学
            tag.value === `${user?.type}-${user?.grade}` || // 学年
            tag.value === `${user?.grade}${user?.class}` || // クラス
            tag.value === `${user?.type}-${user?.grade}-${user?.course}` // コース
        )
        .filter((tag) => {
          // タグ重複追加防止
          if (!oldTags.length) return true;
        }),
    ]);
  }, [allTag]);

  const { data, isLoading, error } = useQuery<Event[], AxiosError>(
    ["calendar", "events", { year, month, day }],
    async () =>
      (
        await client.get("/calendar/event", {
          params: {
            y: year,
            m: month,
            d: day,
          },
        })
      ).data,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        for (const event of data) {
          queryClient.setQueryData(
            ["calendar", "event", event._id],
            () => event
          );
        }
      },
    }
  );

  if (isLoading) return <Loading />;
  if (error) return <CardElement.Error error={error} />;

  return (
    <VStack w="100%" spacing={4}>
      <HStack w="100%">
        <Icon as={TbFilter} w={6} h={6} />
        <Wrap align="center" w="100%">
          {tagFilter?.map((tag) => (
            <Tag whiteSpace="nowrap" key={tag.value}>
              {tag.label}
              <TagCloseButton
                onClick={() => {
                  setTagFilter((oldTags) =>
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
              setTagFilter((oldTags) => [...oldTags, value as Tag]);
              onClose();
            }}
            options={allTag}
            chakraStyles={{
              container: (provided) => ({
                ...provided,
                w: "100%",
                textStyle: "title",
              }),
              // valueContainer: (provided) => ({
              //   ...provided,
              //   ml: 5,
              // }),
              menu: (provided) => ({
                ...provided,
                shadow: "lg",
                zIndex: 2,
              }),
            }}
          />
        </Collapse>
      </Box>
      {data
        .sort((first, second) => {
          if (
            new Date(first.startAt).getTime() <
              new Date(second.startAt).getTime() ||
            (first.isAllDay && !second.isAllDay)
          ) {
            return -1;
          } else if (
            new Date(first.startAt).getTime() >
              new Date(second.startAt).getTime() ||
            (!first.isAllDay && second.isAllDay)
          ) {
            return 1;
          } else {
            return 0;
          }
        })
        .filter((event) => {
          if (!tagFilter.length) return true;
          for (const tag of tagFilter) {
            for (const eventTag of event.tags) {
              if (tag.value === eventTag.value) return true;
            }
          }
        })
        .map((event) => (
          <HStack
            w="100%"
            h={24}
            p={2}
            key={event._id}
            // border="1px solid var(--chakra-colors-gray-100)"
            rounded="xl"
            // shadow="lg"
            as={RouterLink}
            to={`/calendar/events/${event._id}`}
          >
            <VStack
              h="full"
              minW={10}
              align="flex-end"
              textStyle="title"
              fontSize="xs"
            >
              {event.isAllDay ? (
                <Text>終日</Text>
              ) : (
                <>
                  <Text>{format(new Date(event.startAt), "HH:mm")}</Text>
                  <Text>{format(new Date(event.endAt), "HH:mm")}</Text>
                </>
              )}
            </VStack>
            <Divider
              borderColor="blue.500"
              borderWidth={1}
              orientation="vertical"
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
        ))}
    </VStack>
  );
};

export default UpcomingEvents;
