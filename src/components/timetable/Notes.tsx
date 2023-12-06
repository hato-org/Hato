import React, { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  Text,
  StackProps,
  IconButton,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Textarea,
  MenuButtonProps,
  useDisclosure,
  Portal,
  Heading,
  Wrap,
  Tag,
  Box,
} from '@chakra-ui/react';
import ResizeTextArea from 'react-textarea-autosize';
import {
  TbCheck,
  TbDotsVertical,
  TbEdit,
  TbFlag,
  TbTrash,
  TbX,
} from 'react-icons/tb';
import { useUser } from '@/services/user';
import Error from '../cards/Error';
import Loading from '../common/Loading';
import ReportModal from '../common/ReportModal';
import { useNotes, useNoteMutation } from '@/services/timetable';

interface NotesProps extends StackProps {
  date: Date;
  type: Type;
  grade: GradeCode;
  schoolClass: ClassCode;
}

const Notes = React.memo(
  ({ date, type, grade, schoolClass, ...rest }: NotesProps) => {
    const { data: user } = useUser();

    const { data, status, error } = useNotes({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });

    const myNotes = useMemo(
      () => data?.filter((note) => note.owner === user.email),
      [data, user],
    );

    if (status === 'pending') return <Loading />;

    if (status === 'error') return <Error error={error} />;

    return (
      <VStack w="100%" {...rest}>
        {data.filter(
          (note) =>
            note.target?.some(
              (classInfo) =>
                classInfo.type === type &&
                classInfo.gradeCode === grade &&
                classInfo.classCode === schoolClass,
            ) || note.owner === user.email,
        ).length ? (
          <VStack w="100%" align="flex-start">
            <VStack w="100%">
              {data
                .filter(
                  (note) =>
                    note.target?.some(
                      (classInfo) =>
                        classInfo.type === user.type &&
                        classInfo.gradeCode === user.grade &&
                        classInfo.classCode === user.class,
                    ) && note.owner !== user.email,
                )
                .map((note) => (
                  <NoteCard key={note._id} note={note} />
                ))}
            </VStack>
            {myNotes?.length && (
              <>
                <Heading size="sm">自分が追加したもの</Heading>
                <VStack w="100%">
                  {myNotes.map((note) => (
                    <NoteCard key={note._id} note={note} />
                  ))}
                </VStack>
              </>
            )}
          </VStack>
        ) : (
          <Text textStyle="description" fontWeight="bold">
            特にありません
          </Text>
        )}
      </VStack>
    );
  },
);

const NoteCard = React.memo(({ note }: { note: Note }) => {
  const toast = useToast({
    position: 'top-right',
    duration: 1500,
  });
  const { data: user } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(note.message);

  useEffect(() => {
    setMessage(note.message);
  }, [note]);

  const { mutate, isPending } = useNoteMutation();

  return (
    <Box
      w="100%"
      whiteSpace="pre-wrap"
      layerStyle={editMode ? '' : 'button'}
      px={2}
      rounded="lg"
      position="relative"
      role="group"
    >
      {editMode ? (
        <VStack w="100%">
          <Textarea
            value={message}
            placeholder="説明"
            as={ResizeTextArea}
            resize="none"
            variant="outline"
            minH="unset"
            // maxRows={5}
            onChange={(e) => setMessage(e.target.value)}
            isInvalid={!message}
          />
          <HStack w="100%">
            <IconButton
              aria-label="abort changes"
              // w="100%"
              flex={1}
              rounded="lg"
              variant="ghost"
              colorScheme="red"
              icon={<TbX />}
              onClick={() => {
                setEditMode(false);
                setMessage(note.message);
              }}
            />
            <IconButton
              aria-label="apply changes"
              flex={3}
              rounded="lg"
              variant="solid"
              colorScheme="green"
              icon={<TbCheck />}
              isLoading={isPending}
              onClick={() => {
                mutate(
                  { action: 'edit', note: { ...note, message } },
                  {
                    onSuccess: () => {
                      setEditMode(false);
                      toast({
                        status: 'success',
                        title: '保存しました。',
                      });
                    },
                    onError: (e) => {
                      toast({
                        status: 'error',
                        title: '保存に失敗しました。',
                        description: e.message,
                      });
                    },
                  },
                );
              }}
            />
          </HStack>
        </VStack>
      ) : (
        <>
          <NotesMenu
            mt={1}
            float="right"
            note={note}
            onEdit={() => setEditMode(true)}
            onDelete={() =>
              mutate(
                { action: 'delete', id: note._id },
                {
                  onSuccess: () => {
                    toast({
                      status: 'success',
                      title: '削除しました。',
                    });
                  },
                  onError: (e) => {
                    toast({
                      status: 'error',
                      title: '削除に失敗しました。',
                      description: e.message,
                    });
                  },
                },
              )
            }
          />
          <Text py={2} textStyle="title">
            {note.message}
          </Text>
          {note.owner === user.email && (
            <Wrap pb={2}>
              {note.target?.map((targetClass) => (
                <Tag
                  size="sm"
                  key={
                    targetClass.type +
                    targetClass.gradeCode +
                    targetClass.classCode
                  }
                >{`${targetClass.gradeCode}年${targetClass.name}`}</Tag>
              ))}
            </Wrap>
          )}
        </>
      )}
    </Box>
  );
});

interface NotesMenuProps extends MenuButtonProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

const NotesMenu = React.memo(
  ({ note, onEdit, onDelete, ...rest }: NotesMenuProps) => {
    const { data: user } = useUser();

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<TbDotsVertical />}
          variant="ghost"
          size="sm"
          _hover={{
            bg: 'whiteAlpha.500',
          }}
          _active={{
            bg: 'whiteAlpha.500',
          }}
          isRound
          {...rest}
        />
        <MenuList textStyle="title" rounded="xl" shadow="lg">
          {note.owner === user.email || user.role === 'admin' ? (
            <>
              {user.role === 'admin' && (
                <MenuItem textStyle="title" icon={<TbFlag />} onClick={onOpen}>
                  報告
                  <Portal>
                    <ReportModal
                      {...{ isOpen, onClose, url: window.location.toString() }}
                    />
                  </Portal>
                </MenuItem>
              )}
              <MenuItem textStyle="title" icon={<TbEdit />} onClick={onEdit}>
                編集
              </MenuItem>
              <MenuItem
                textStyle="title"
                icon={<TbTrash />}
                onClick={onDelete}
                color="red.500"
              >
                削除
              </MenuItem>
            </>
          ) : (
            <MenuItem textStyle="title" icon={<TbFlag />} onClick={onOpen}>
              報告
              <Portal>
                <ReportModal
                  {...{ isOpen, onClose, url: window.location.toString() }}
                />
              </Portal>
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    );
  },
);

export default Notes;
