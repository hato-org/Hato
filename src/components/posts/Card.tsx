import React, { useState } from 'react';
import {
  Flex,
  FlexProps,
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
  TbChevronRight,
  TbCircleArrowDown,
  TbFile,
  TbPin,
  TbPinnedOff,
} from 'react-icons/tb';
import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import {
  PanInfo,
  useDragControls,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { MotionCenter, MotionFlex } from '../motion';
import { pinnedPostAtom } from '@/store/posts';

const Card = React.memo(
  ({
    _id,
    title,
    text,
    attachments,
    createdAt,
    bg = 'bg',
    ...rest
  }: Post & FlexProps) => {
    const queryClient = useQueryClient();
    const controls = useDragControls();
    const x = useMotionValue(0);
    const pinWidth = useTransform(x, [0, 64, 1000], [32, 64, 1000]);

    const [pinned, setPinned] = useAtom(pinnedPostAtom);
    const [pin, setPin] = useState(false);
    const isPinned = pinned.some((postId) => postId === _id);

    const attachmentQueries = attachments.map((attachment) =>
      queryClient.getQueryState(['post', 'attachment', attachment.id]),
    );

    return (
      <Flex
        w="100%"
        rounded="xl"
        overflow="hidden"
        position="relative"
        zIndex={0}
        sx={{
          ':hover': {
            touchAction: 'none',
          },
        }}
        {...rest}
      >
        <MotionCenter
          bg={isPinned ? 'red.400' : 'blue.400'}
          color="white"
          position="absolute"
          left={0}
          h="100%"
          style={{ width: pinWidth }}
        >
          <Icon
            as={isPinned ? TbPinnedOff : TbPin}
            transform={`rotate(${pin ? '-45deg' : '0deg'}) scale(${
              pin ? 1.2 : 1
            })`}
            transition="all .2s ease"
            boxSize={6}
          />
        </MotionCenter>
        <MotionFlex
          w="100%"
          bg={bg}
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragControls={controls}
          dragListener={false}
          onDrag={(
            event: MouseEvent | TouchEvent | PointerEvent,
            info: PanInfo,
          ) => {
            setPin(info.offset.x > 160);
          }}
          onDragEnd={() => {
            if (pin)
              setPinned((oldPinned) =>
                isPinned
                  ? oldPinned.filter((postId) => postId !== _id)
                  : [...oldPinned, _id],
              );
          }}
          style={{
            x,
          }}
          zIndex={5}
        >
          <HStack
            w="100%"
            bg={bg}
            as={RouterLink}
            to={`/posts/${_id}`}
            px={2}
            py={4}
            layerStyle="button"
            onPointerDown={(e) => controls.start(e, { snapToCursor: false })}
          >
            <VStack align="flex-start" w="100%" pl={2}>
              <HStack w="100%">
                {isPinned && <Icon as={TbPin} color="blue.400" />}
                <Text fontSize="lg" textStyle="title" noOfLines={1}>
                  {title}
                </Text>
                <Spacer />
                {attachmentQueries.every((queryState) => queryState?.data) && (
                  <Icon as={TbCircleArrowDown} />
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
        </MotionFlex>
      </Flex>
    );
  },
);

export default Card;
