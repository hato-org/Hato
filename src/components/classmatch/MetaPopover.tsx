import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
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
import {
  TbCheck,
  TbChevronDown,
  TbChevronUp,
  TbPencil,
  TbX,
} from 'react-icons/tb';
import { useRecoilValue } from 'recoil';
import { useClassmatchMutation } from '@/hooks/classmatch';
import { overlayAtom } from '@/store/overlay';

const TournamentMetaPopover = React.memo(
  ({
    id,
    meta,
    participants,
    match,
  }: Pick<ClassmatchTournament, 'id' | 'meta' | 'participants' | 'match'>) => {
    const { isOpen, onToggle, onClose } = useDisclosure();
    const [editMode, setEditMode] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [metaValue, setMetaValue] = useState(meta);
    const [participantsValue, setParticipantsValue] = useState(participants);
    const { classmatchTournament } = useRecoilValue(overlayAtom);

    const { mutate, isLoading } = useClassmatchMutation({
      year: classmatchTournament?.year,
      season: classmatchTournament?.season,
      sport: classmatchTournament?.sport,
      id,
    });

    useOutsideClick({
      ref: popoverRef,
      handler: onClose,
    });

    const isParticipantsEditable = match?.every(
      (tournament) => tournament.class ?? tournament.participants.length
    );

    // Clear placeholder value when popover is disappeared / opened
    // (To prevent showing previous value)
    useEffect(() => {
      setMetaValue(meta);
      setParticipantsValue(participants);
    }, [meta, participants]);

    return (
      <Popover isOpen={editMode || isOpen}>
        <PopoverTrigger>
          <Box
            role="button"
            pos="absolute"
            left="-2px"
            top="50%"
            w={4}
            h={4}
            bg={participants.length ? 'blue.400' : 'border'}
            rounded="md"
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
            <VStack w="full" spacing={4}>
              <Text textStyle="description" fontWeight="bold" fontSize="xs">
                試合結果
              </Text>
              {/* eslint-disable no-nested-ternary */}
              <Box w="full" pos="relative">
                {editMode && !isParticipantsEditable && (
                  <Center
                    pos="absolute"
                    inset={0}
                    backdropFilter="auto"
                    backdropBlur="4px"
                    zIndex={1}
                  >
                    <Text textStyle="description" fontWeight="bold">
                      最初に前試合の結果を入力
                    </Text>
                  </Center>
                )}
                <HStack
                  w="full"
                  justify="space-around"
                  spacing={0}
                  divider={
                    <Text fontSize="xl" color="description" fontWeight="bold">
                      ―
                    </Text>
                  }
                >
                  {editMode ? (
                    (participants.length
                      ? participants
                      : Array.from({ length: 2 })
                    ).map((_, index) => (
                      <VStack w="full" p={2} rounded="xl" spacing={4}>
                        <NumberInput
                          w="full"
                          min={0}
                          size="lg"
                          borderColor="border"
                          value={participantsValue[index]?.point}
                          onChange={(__, value) =>
                            setParticipantsValue((prev) => {
                              const newParticipants = structuredClone(prev);
                              newParticipants[index] = {
                                ...newParticipants[index],
                                point: Number.isNaN(value) ? 0 : value,
                              };
                              return newParticipants;
                            })
                          }
                        >
                          <NumberInputField
                            w="full"
                            rounded="lg"
                            textStyle="title"
                            textAlign="center"
                          />
                          <NumberInputStepper borderColor="border">
                            <NumberIncrementStepper>
                              <Icon as={TbChevronUp} />
                            </NumberIncrementStepper>
                            <NumberDecrementStepper>
                              <Icon as={TbChevronDown} />
                            </NumberDecrementStepper>
                          </NumberInputStepper>
                        </NumberInput>
                        <ClassSelectMenu
                          currentClass={participantsValue[index]}
                          match={match}
                          onSelect={(classInfo) =>
                            setParticipantsValue((prev) => {
                              const newParticipants = structuredClone(prev);
                              newParticipants[index] = {
                                ...newParticipants[index],
                                ...classInfo,
                              };
                              return newParticipants;
                            })
                          }
                        />
                      </VStack>
                    ))
                  ) : participants.length ? (
                    participants.map((classInfo, index) => (
                      <VStack
                        key={JSON.stringify(`${classInfo} ${index}`)}
                        spacing={0}
                        flex={1}
                      >
                        <Text textStyle="title" fontSize="3xl">
                          {classInfo.point}
                        </Text>
                        <Text textStyle="description">
                          {classInfo.grade}-{classInfo.class}
                        </Text>
                      </VStack>
                    ))
                  ) : (
                    <Text
                      textAlign="center"
                      textStyle="description"
                      fontWeight="bold"
                    >
                      まだ結果が分かっていません
                    </Text>
                  )}
                </HStack>
              </Box>
              {/* eslint-enable no-nested-ternary */}
              <StackDivider
                borderWidth={1}
                borderColor="border"
                rounded="full"
              />
              {editMode ? (
                <VStack w="full" align="flex-start">
                  <Text textStyle="description" fontWeight="bold" fontSize="xs">
                    開始時間
                  </Text>
                  <Input
                    variant="flushed"
                    type="datetime-local"
                    textStyle="title"
                    value={
                      metaValue.startAt
                        ? format(
                            new Date(metaValue.startAt),
                            'yyyy-MM-dd HH:mm'
                          )
                        : ''
                    }
                    onChange={(e) =>
                      setMetaValue((prev) => ({
                        ...prev,
                        startAt: new Date(e.target.value).toISOString(),
                      }))
                    }
                  />
                  <Text textStyle="description" fontWeight="bold" fontSize="xs">
                    場所
                  </Text>
                  <Input
                    variant="flushed"
                    textStyle="title"
                    value={metaValue.location ?? ''}
                    onChange={(e) =>
                      setMetaValue((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </VStack>
              ) : (
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
                    <Text textStyle="title" fontSize="xl" whiteSpace="nowrap">
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
              )}
              {editMode ? (
                <HStack w="full" spacing={4}>
                  <IconButton
                    aria-label="cancel"
                    icon={<Icon as={TbX} />}
                    colorScheme="red"
                    variant="ghost"
                    rounded="lg"
                    flex={1}
                    onClick={() => setEditMode(false)}
                  />
                  <IconButton
                    aria-label="confirm changes"
                    icon={<Icon as={TbCheck} />}
                    rounded="lg"
                    colorScheme="green"
                    flex={2}
                    onClick={() =>
                      mutate(
                        {
                          meta: metaValue,
                          participants: participantsValue,
                        },
                        {
                          onSuccess: () => {
                            setEditMode(false);
                            onClose();
                          },
                        }
                      )
                    }
                    isLoading={isLoading}
                  />
                </HStack>
              ) : (
                <Button
                  w="full"
                  leftIcon={<Icon as={TbPencil} />}
                  rounded="lg"
                  onClick={() => setEditMode(true)}
                >
                  編集する
                </Button>
              )}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
);

function ClassSelectMenu({
  currentClass,
  match,
  onSelect,
}: {
  currentClass?: ClassmatchParticipant;
  match: ClassmatchTournament['match'];
  onSelect: (classInfo: Omit<ClassmatchParticipant, 'point'>) => void;
}) {
  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded="lg"
        w="full"
        rightIcon={<Icon as={TbChevronDown} />}
      >
        {currentClass?.grade
          ? `${currentClass.grade}-${currentClass.class}`
          : 'ｸﾗｽ'}
      </MenuButton>
      <Box>
        <MenuList rounded="xl" shadow="xl">
          {match?.map((tournament) => (
            <ClassSelectMenuItem onSelect={onSelect} tournament={tournament} />
          ))}
        </MenuList>
      </Box>
    </Menu>
  );
}

function ClassSelectMenuItem({
  tournament,
  onSelect,
}: {
  tournament: ClassmatchTournament;
  onSelect: (classInfo: Omit<ClassmatchParticipant, 'point'>) => void;
}) {
  const winner = tournament.participants.reduce<ClassmatchParticipant>(
    (prev, curr) => (prev.point > curr.point ? prev : curr),
    { from: '', point: 0, type: 'hs', grade: '0', class: '0' }
  );

  if (!tournament.class && !winner.grade)
    return (
      <Text
        w="full"
        py={2}
        textAlign="center"
        textStyle="description"
        fontWeight="bold"
      >
        前試合の情報なし
      </Text>
    );

  return (
    <MenuItem
      textStyle="title"
      onClick={() =>
        onSelect({
          from: tournament.id,
          ...(tournament.class ?? {
            type: winner.type,
            grade: winner.grade,
            class: winner.class,
          }),
        })
      }
    >
      {tournament.class
        ? `${tournament.class.grade}-${tournament.class.class}`
        : `${winner.grade}-${winner.class}`}
    </MenuItem>
  );
}

export default TournamentMetaPopover;
