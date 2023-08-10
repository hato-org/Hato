import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  StackDivider,
  Text,
  VStack,
  useDisclosure,
  useOutsideClick,
} from '@chakra-ui/react';
import { format } from 'date-fns/esm';
import { TbFlag, TbPencil } from 'react-icons/tb';

import MetaEditor from './MetaEditor';
import MetaReporter from './MetaReporter';

const TournamentMetaPopover = React.memo(
  ({
    id,
    meta,
    participants,
    match,
    editHistory,
  }: Omit<ClassmatchTournament, 'class'>) => {
    const { isOpen, onToggle, onClose } = useDisclosure();
    const [editMode, setEditMode] = useState<'editor' | 'reporter' | undefined>(
      undefined
    );
    const popoverRef = useRef<HTMLDivElement>(null);

    useOutsideClick({
      ref: popoverRef,
      handler: onClose,
    });

    const onSubmit = useCallback(() => setEditMode(undefined), []);

    return (
      <Popover isOpen={!!editMode || isOpen}>
        <PopoverTrigger>
          <Box
            role="button"
            pos="absolute"
            left="-2px"
            top="50%"
            w={5}
            h={5}
            bg={participants.length ? 'blue.400' : 'border'}
            rounded="lg"
            transform="translate(-50%, -50%)"
            onClick={onToggle}
          />
        </PopoverTrigger>
        <PopoverContent
          p={4}
          bg="panel"
          rounded="2xl"
          shadow="xl"
          borderColor="border"
          ref={popoverRef}
        >
          <PopoverArrow bg="panel" borderColor="border" />
          <PopoverBody>
            {(() => {
              switch (editMode) {
                case 'editor':
                  return (
                    <MetaEditor
                      id={id}
                      meta={meta}
                      participants={participants}
                      match={match}
                      onSubmit={onSubmit}
                    />
                  );

                case 'reporter':
                  return (
                    <MetaReporter
                      id={id}
                      history={editHistory}
                      onSubmit={onSubmit}
                    />
                  );

                default:
                  return (
                    <VStack w="full" spacing={4}>
                      <Text
                        textStyle="description"
                        fontWeight="bold"
                        fontSize="xs"
                      >
                        試合結果
                      </Text>
                      {participants.length ? (
                        <HStack
                          w="full"
                          justify="space-around"
                          spacing={0}
                          divider={
                            <Text
                              fontSize="xl"
                              color="description"
                              fontWeight="bold"
                            >
                              ―
                            </Text>
                          }
                        >
                          {participants.map((classInfo, index) => (
                            <VStack
                              key={JSON.stringify(`${classInfo} ${index}`)}
                              spacing={0}
                              flex={1}
                            >
                              <Text textStyle="title" fontSize="3xl">
                                {classInfo.point}
                              </Text>
                              <Text textStyle="description">
                                {classInfo.type === 'teacher'
                                  ? '職員'
                                  : `${classInfo.grade}-${classInfo.class}`}
                              </Text>
                            </VStack>
                          ))}
                        </HStack>
                      ) : (
                        <Text
                          textAlign="center"
                          textStyle="description"
                          fontWeight="bold"
                        >
                          まだ結果が分かっていません
                        </Text>
                      )}
                      <StackDivider
                        borderWidth={1}
                        borderColor="border"
                        rounded="full"
                      />
                      <HStack
                        w="full"
                        justify="space-evenly"
                        align="flex-start"
                        spacing={4}
                        divider={<StackDivider borderColor="border" />}
                      >
                        <VStack spacing={1} align="flex-start">
                          <Text
                            textStyle="description"
                            fontWeight="bold"
                            fontSize="xs"
                          >
                            開始時間
                          </Text>
                          <Text
                            textStyle="title"
                            fontSize="xl"
                            whiteSpace="nowrap"
                          >
                            {meta.startAt
                              ? format(new Date(meta.startAt), 'HH:mm')
                              : '不明'}
                          </Text>
                        </VStack>
                        <VStack spacing={1} align="flex-start">
                          <Text
                            textStyle="description"
                            fontWeight="bold"
                            fontSize="xs"
                          >
                            場所
                          </Text>
                          <Text textStyle="title" fontSize="xl">
                            {meta.location ?? '不明'}
                          </Text>
                        </VStack>
                      </HStack>
                      <HStack w="full">
                        <Button
                          w="full"
                          leftIcon={<Icon as={TbPencil} />}
                          rounded="lg"
                          onClick={() => setEditMode('editor')}
                        >
                          編集
                        </Button>
                        <Button
                          w="full"
                          leftIcon={<Icon as={TbFlag} />}
                          rounded="lg"
                          onClick={() => setEditMode('reporter')}
                        >
                          報告
                        </Button>
                      </HStack>
                    </VStack>
                  );
              }
            })()}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
);

export default TournamentMetaPopover;
