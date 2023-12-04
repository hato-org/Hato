import {
  VStack,
  Heading,
  HStack,
  Text,
  Icon,
  Tag,
  Wrap,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { TbChevronRight, TbMapPin, TbTag, TbWorld } from 'react-icons/tb';
import Error from '../cards/Error';
import Loading from '../common/Loading';
import { useEvent } from '@/services/calendar';

function Event({ id }: { id: string }) {
  const { data, status, error } = useEvent(id);

  if (status === 'pending') return <Loading />;
  if (status === 'error') return <Error error={error} />;

  return (
    <VStack w="100%" spacing={4} p={8}>
      <Heading>{data.title}</Heading>
      <Text textStyle="description">{data.description}</Text>
      <HStack spacing={4}>
        <VStack align="flex-start" spacing={-1}>
          <Text textStyle="title" fontSize="xs">
            {data.isAllDay
              ? format(new Date(data.startAt), 'yo', {
                  locale: ja,
                })
              : format(new Date(data.startAt), 'yoMMMdo（EEE）', {
                  locale: ja,
                })}
          </Text>
          <Text textStyle="title" fontSize={data.isAllDay ? '2xl' : '3xl'}>
            {data.isAllDay
              ? format(new Date(data.startAt), 'MMMdo(EEE)', { locale: ja })
              : format(new Date(data.startAt), 'HH:mm')}
          </Text>
        </VStack>
        <Icon as={TbChevronRight} w={8} h={8} color="blue.400" />
        <VStack align="flex-start" spacing={-1}>
          <Text textStyle="title" fontSize="xs">
            {data.isAllDay
              ? format(new Date(data.endAt), 'yo', { locale: ja })
              : format(new Date(data.endAt), 'yoMMMdo（EEE）', {
                  locale: ja,
                })}
          </Text>
          <Text textStyle="title" fontSize={data.isAllDay ? '2xl' : '3xl'}>
            {data.isAllDay
              ? format(new Date(data.endAt), 'MMMdo(EEE)', { locale: ja })
              : format(new Date(data.endAt), 'HH:mm')}
          </Text>
        </VStack>
      </HStack>
      {data.location && (
        <HStack w="100%" textStyle="title">
          <Icon as={TbMapPin} color="description" w={6} h={6} />
          <Text>{data.location}</Text>
        </HStack>
      )}
      <HStack w="100%">
        <Icon as={TbTag} color="description" w={6} h={6} />
        <Wrap>
          {data.tags?.map((tag) => (
            <Tag whiteSpace="nowrap" key={tag.value}>
              {tag.label}
            </Tag>
          ))}
        </Wrap>
      </HStack>
      {data.external && (
        <HStack w="100%">
          <Icon as={TbWorld} w={6} h={6} />
          <Text textStyle="title">{data.source?.name}</Text>
        </HStack>
      )}
      {/* <HStack w="100%">
        <Icon as={TbUser} w={6} h={6} />
        <Text textStyle="description">{data.owner}</Text>
      </HStack> */}
    </VStack>
  );
}

export default Event;
