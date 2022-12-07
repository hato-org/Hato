import { useState } from 'react';
import {
  Flex,
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
import {
  TbArrowDownCircle,
  TbChevronRight,
  TbFile,
  TbPin,
  TbPinnedOff,
} from 'react-icons/tb';
import { useQueryClient } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';
import {
  motion,
  useDragControls,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { MotionCenter } from '../motion';
import { pinnedPostAtom } from '@/store/posts';

function Card({ _id, title, text, attachments, createdAt }: Post) {
  const queryClient = useQueryClient();
  const controls = useDragControls();
  const x = useMotionValue(0);
  const pinWidth = useTransform(x, [0, 64, 1000], [32, 64, 1000]);

  const [pinned, setPinned] = useRecoilState(pinnedPostAtom);
  const [pin, setPin] = useState(false);
  const isPinned = pinned.some((postId) => postId === _id);

  const attachmentQueries = attachments.map((attachment) =>
    queryClient.getQueryState(['post', 'attachment', attachment.id])
  );

  return (
    <Flex
      w="100%"
      rounded="xl"
      overflowX="hidden"
      position="relative"
      sx={{ touchAction: 'none' }}
    >
      <MotionCenter
        bg={isPinned ? 'red.400' : 'blue.400'}
        color="white"
        position="absolute"
        left={0}
        h="100%"
        style={{ width: pinWidth }}
        animate={{ scale: pin ? 1.2 : 1 }}
        zIndex={-10}
      >
        <Icon
          as={isPinned ? TbPinnedOff : TbPin}
          transform={`rotate(${pin ? '-45deg' : '0deg'})`}
          transition="all .2s ease"
          size="lg"
          boxSize={6}
        />
      </MotionCenter>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragControls={controls}
        dragListener={false}
        onDrag={(event, info) => {
          setPin(info.offset.x > 160);
        }}
        onDragEnd={() => {
          if (pin)
            setPinned((oldPinned) =>
              isPinned
                ? oldPinned.filter((postId) => postId !== _id)
                : [...oldPinned, _id]
            );
        }}
        style={{
          x,
          background: 'var(--chakra-colors-bg)',
          width: '100%',
        }}
      >
        <HStack
          w="100%"
          bg="bg"
          as={RouterLink}
          to={`/posts/${_id}`}
          px={2}
          py={4}
          layerStyle="button"
          onTouchStart={(e) => controls.start(e, { snapToCursor: false })}
        >
          <VStack align="flex-start" w="100%" pl={2}>
            <HStack w="100%">
              {isPinned && <Icon as={TbPin} color="blue.400" />}
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
      </motion.div>
    </Flex>
  );
}

export default Card;
