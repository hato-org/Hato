import {
  HStack,
  Icon,
  Spacer,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns/esm';
import { TbArrowDownCircle, TbChevronRight, TbFile } from 'react-icons/tb';
import { useQueryClient } from '@tanstack/react-query';

function Card({ _id, title, text, attachments, createdAt }: Post) {
  const queryClient = useQueryClient();

  const attachmentQueries = attachments.map((attachment) =>
    queryClient.getQueryState(['post', 'attachment', attachment.id])
  );

  return (
    <HStack
      w="100%"
      px={2}
      py={4}
      rounded="xl"
      as={RouterLink}
      to={`/posts/${_id}`}
      layerStyle="button"
    >
      {/* {thumbnail ? (
				<Image boxSize='100px' src={thumbnail} />
			) : (
				<Icon w={8} h={8} as={TbFile} />
			)} */}
      <VStack align="flex-start" w="100%" pl={4}>
        <HStack w="100%">
          <Text fontSize="lg" textStyle="title" noOfLines={1}>
            {title}
          </Text>
          <Spacer />
          {attachmentQueries.every((queryState) => queryState?.data) && (
            <Icon as={TbArrowDownCircle} />
          )}
          <Text textStyle="description" fontSize="xs">
            {format(new Date(createdAt), 'MM/dd')}
          </Text>
        </HStack>
        {text && <Text noOfLines={1}>{text}</Text>}
        <Wrap>
          {attachments.map((attachment) => (
            <Tag variant="outline" rounded="full" key={attachment.id}>
              <TagLeftIcon as={TbFile} />
              <TagLabel>{attachment.name}</TagLabel>
            </Tag>
          ))}
        </Wrap>
      </VStack>
      <Spacer />
      <Icon as={TbChevronRight} />
    </HStack>
  );
}

export default Card;
