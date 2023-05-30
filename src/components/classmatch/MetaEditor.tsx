import { useState, useEffect } from 'react';
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
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { TbCheck, TbChevronDown, TbChevronUp, TbX } from 'react-icons/tb';
import { format } from 'date-fns/esm';
import { useClassmatchMutation } from '@/hooks/classmatch';
import { overlayAtom } from '@/store/overlay';

function MetaEditor({
  id,
  meta,
  participants,
  match,
  onSubmit,
}: Pick<ClassmatchTournament, 'id' | 'meta' | 'participants' | 'match'> & {
  onSubmit: () => void;
}) {
  const [metaValue, setMetaValue] = useState(meta);
  const [participantsValue, setParticipantsValue] = useState(participants);
  const { classmatchTournament } = useRecoilValue(overlayAtom);

  const { mutate, isLoading } = useClassmatchMutation({
    year: classmatchTournament?.year,
    season: classmatchTournament?.season,
    sport: classmatchTournament?.sport,
    id,
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
    <VStack w="full" spacing={4}>
      <Text textStyle="description" fontWeight="bold" fontSize="xs">
        試合結果
      </Text>
      {/* eslint-disable no-nested-ternary */}
      <Box w="full" pos="relative">
        {!isParticipantsEditable && (
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
        <VStack w="full" p={2} spacing={0}>
          <HStack w="full" justify="space-around" spacing={0}>
            {Array.from({ length: 2 }).map((_, index) => (
              <VStack
                w="full"
                rounded="xl"
                spacing={4}
                _first={{ pr: 2 }}
                _last={{ pl: 2 }}
              >
                <NumberInput
                  w="full"
                  min={0}
                  size="lg"
                  borderColor="border"
                  value={participantsValue[index]?.point ?? ''}
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
            ))}
          </HStack>
          <Button
            w="full"
            rounded="lg"
            variant="outline"
            colorScheme="red"
            leftIcon={<Icon as={TbX} />}
            onClick={() => setParticipantsValue([])}
          >
            クリア
          </Button>
        </VStack>
      </Box>
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
              ? format(new Date(metaValue.startAt), 'yyyy-MM-dd HH:mm')
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
      <HStack w="full" spacing={4}>
        <IconButton
          aria-label="cancel"
          icon={<Icon as={TbX} />}
          colorScheme="red"
          variant="outline"
          rounded="lg"
          flex={1}
          onClick={onSubmit}
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
                onSuccess: onSubmit,
              }
            )
          }
          isLoading={isLoading}
        />
      </HStack>
    </VStack>
  );
}

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
        variant="outline"
        rightIcon={<Icon as={TbChevronDown} />}
        textStyle={currentClass?.from ? 'title' : 'description'}
      >
        {/* eslint-disable no-nested-ternary */}
        {currentClass?.from
          ? currentClass.type === 'teacher'
            ? '職員'
            : `${currentClass.grade}-${currentClass.class}`
          : 'クラス'}
        {/* eslint-enable no-nested-ternary */}
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

  if (!tournament.class && !winner.from)
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
      {/* eslint-disable no-nested-ternary */}
      {tournament.class
        ? tournament.class.type === 'teacher'
          ? '職員'
          : `${tournament.class.grade}-${tournament.class.class}`
        : winner.type === 'teacher'
        ? '職員'
        : `${winner.grade}-${winner.class}`}
      {/* eslint-enable no-nested-ternary */}
    </MenuItem>
  );
}

export default MetaEditor;
