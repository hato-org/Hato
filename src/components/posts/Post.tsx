import { useState } from 'react';
import {
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Wrap,
  Tag,
  TagLeftIcon,
  TagLabel,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { format } from 'date-fns/esm';
import { TbClock, TbFile, TbPaperclip, TbTag } from 'react-icons/tb';
import { useClient } from '@/modules/client';
import Error from '../cards/Error';
import Loading from '../common/Loading';
import PDFViewer from './PDFViewer';

function Post({ id }: { id: string }) {
  const { client } = useClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAttachment, setSelectedAttachment] = useState('');

  const { data, error, isLoading } = useQuery<Post, AxiosError>(
    ['post', id],
    async () => (await client.get(`/post/${id}`)).data,
    {
      cacheTime: Infinity,
    }
  );

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <VStack w="100%" spacing={4} p={8}>
      <Heading>{data.title}</Heading>
      {data.text && <Text textStyle="description">{data.text}</Text>}
      <HStack textStyle="description">
        <Icon as={TbClock} w={6} h={6} />
        <Text fontSize="md" fontWeight="bold">
          {format(new Date(data.createdAt), 'yyyy/MM/dd hh:mm')}
        </Text>
      </HStack>

      <HStack w="100%" spacing={4} pt={8}>
        <Icon as={TbPaperclip} w={6} h={6} />
        <Wrap>
          {data.attachments.map((attachment) => (
            <Tag
              key={attachment.id}
              size="lg"
              variant="outline"
              rounded="full"
              onClick={() => {
                onOpen();
                setSelectedAttachment(attachment.id);
              }}
              layerStyle="button"
            >
              <TagLeftIcon as={TbFile} />
              <TagLabel fontWeight="bold">{attachment.name}</TagLabel>
              <PDFViewer
                isOpen={isOpen && selectedAttachment === attachment.id}
                onClose={() => {
                  onClose();
                  setSelectedAttachment('');
                }}
                attachment={attachment}
              />
            </Tag>
          ))}
        </Wrap>
      </HStack>
      <HStack w="100%" spacing={4}>
        <Icon as={TbTag} w={6} h={6} />
        <Wrap>
          {data.tags.map((tag) => (
            <Tag key={tag.value} size="lg" variant="subtle">
              <TagLabel>{tag.label}</TagLabel>
            </Tag>
          ))}
        </Wrap>
      </HStack>
    </VStack>
  );
}

export default Post;
