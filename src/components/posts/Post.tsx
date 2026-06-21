import { lazy, Suspense, useState } from 'react';
import {
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Wrap,
  useDisclosure,
} from '@chakra-ui/react';
import { Tag } from '@/components/ui/tag';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { TbClock, TbFile, TbPaperclip, TbTag } from 'react-icons/tb';
import Error from '../cards/Error';
import Loading from '../common/Loading';
import ChakraPullToRefresh from '../layout/PullToRefresh';
import { usePost } from '@/services/posts';
import { queryKeys } from '@/services/queryKeys';

const PDFViewer = lazy(() => import('./PDFViewer'));

function Post({ id }: { id: string }) {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAttachment, setSelectedAttachment] = useState('');
  const queryClient = useQueryClient();

  const { data, error, status } = usePost(id);

  if (status === 'pending') return <Loading />;
  if (status === 'error') return <Error error={error} />;

  return (
    <ChakraPullToRefresh
      w="100%"
      minH="100vh"
      mb={16}
      onRefresh={async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryKeys.posts.detail(id),
          }),
          ...data.attachments.map((attachment) =>
            queryClient.invalidateQueries({
              queryKey: queryKeys.posts.attachment(attachment.id),
            }),
          ),
        ]);
      }}
    >
      <VStack w="100%" gap={4} p={8}>
        <Heading>{data.title}</Heading>
        {data.text && <Text textStyle="description">{data.text}</Text>}
        <HStack textStyle="description">
          <Icon as={TbClock} w={6} h={6} />
          <Text fontSize="md" fontWeight="bold">
            {format(new Date(data.createdAt), 'yyyy/MM/dd HH:mm')}
          </Text>
        </HStack>

        <HStack w="100%" gap={4} pt={8}>
          <Icon as={TbPaperclip} w={6} h={6} />
          <Wrap>
            {data.attachments.map((attachment) => (
              <Suspense key={attachment.id} fallback={<Loading size="sm" />}>
                <Tag
                  size="lg"
                  variant="outline"
                  rounded="full"
                  onClick={() => {
                    onOpen();
                    setSelectedAttachment(attachment.id);
                  }}
                  layerStyle="button"
                  startElement={<Icon as={TbFile} />}
                >
                  <Text as="span" fontWeight="bold">
                    {attachment.name}
                  </Text>
                </Tag>
                <PDFViewer
                  isOpen={isOpen && selectedAttachment === attachment.id}
                  onClose={() => {
                    onClose();
                    setSelectedAttachment('');
                  }}
                  attachment={attachment}
                />
              </Suspense>
            ))}
          </Wrap>
        </HStack>
        <HStack w="100%" gap={4}>
          <Icon as={TbTag} w={6} h={6} />
          <Wrap>
            {data.tags.map((tag) => (
              <Tag key={tag.value} size="lg" variant="subtle">
                {tag.label}
              </Tag>
            ))}
          </Wrap>
        </HStack>
      </VStack>
    </ChakraPullToRefresh>
  );
}

export default Post;
