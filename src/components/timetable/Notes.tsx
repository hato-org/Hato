import React, { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  Text,
  StackProps,
  IconButton,
  IconButtonProps,
  HStack,
  Textarea,
  useDisclosure,
  Portal,
  Heading,
  Wrap,
  Box,
  Field,
} from '@chakra-ui/react';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu';
import { Tag } from '@/components/ui/tag';
import { toaster } from '@/components/ui/toaster';
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
Notes.displayName = 'Notes';

const NoteCard = React.memo(({ note }: { note: Note }) => {
  const toast = (options: Parameters<typeof toaster.create>[0]) =>
    toaster.create({ duration: 1500, ...options });
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
          <Field.Root invalid={!message}>
            <Textarea
              asChild
              resize="none"
              variant="outline"
              minH="unset"
              // maxRows={5}
            >
              <ResizeTextArea
                value={message}
                placeholder="説明"
                onChange={(e) => setMessage(e.target.value)}
              />
            </Textarea>
          </Field.Root>
          <HStack w="100%">
            <IconButton
              aria-label="abort changes"
              // w="100%"
              flex={1}
              rounded="lg"
              variant="ghost"
              colorScheme="red"
              onClick={() => {
                setEditMode(false);
                setMessage(note.message);
              }}
            >
              {<TbX />}
            </IconButton>
            <IconButton
              aria-label="apply changes"
              flex={3}
              rounded="lg"
              variant="solid"
              colorScheme="green"
              loading={isPending}
              onClick={() => {
                mutate(
                  { action: 'edit', note: { ...note, message } },
                  {
                    onSuccess: () => {
                      setEditMode(false);
                      toast({
                        type: 'success',
                        title: '保存しました。',
                      });
                    },
                    onError: (e) => {
                      toast({
                        type: 'error',
                        title: '保存に失敗しました。',
                        description: e.message,
                      });
                    },
                  },
                );
              }}
            >
              {<TbCheck />}
            </IconButton>
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
                      type: 'success',
                      title: '削除しました。',
                    });
                  },
                  onError: (e) => {
                    toast({
                      type: 'error',
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
NoteCard.displayName = 'NoteCard';

interface NotesMenuProps extends IconButtonProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

const NotesMenu = React.memo(
  ({ note, onEdit, onDelete, ...rest }: NotesMenuProps) => {
    const { data: user } = useUser();

    const { open: isOpen, onOpen, onClose } = useDisclosure();

    return (
      <MenuRoot>
        <MenuTrigger asChild>
          <IconButton
            aria-label="note menu"
            variant="ghost"
            size="sm"
            _hover={{
              bg: 'whiteAlpha.500',
            }}
            _active={{
              bg: 'whiteAlpha.500',
            }}
            borderRadius="full"
            {...rest}
          >
            <TbDotsVertical />
          </IconButton>
        </MenuTrigger>
        <MenuContent textStyle="title" rounded="xl" shadow="lg">
          {note.owner === user.email || user.role === 'admin' ? (
            <>
              {user.role === 'admin' && (
                <MenuItem value="report" textStyle="title" onClick={onOpen}>
                  <TbFlag />
                  報告
                  <Portal>
                    <ReportModal
                      {...{ isOpen, onClose, url: window.location.toString() }}
                    />
                  </Portal>
                </MenuItem>
              )}
              <MenuItem value="edit" textStyle="title" onClick={onEdit}>
                <TbEdit />
                編集
              </MenuItem>
              <MenuItem
                value="delete"
                textStyle="title"
                onClick={onDelete}
                color="red.500"
              >
                <TbTrash />
                削除
              </MenuItem>
            </>
          ) : (
            <MenuItem value="report" textStyle="title" onClick={onOpen}>
              <TbFlag />
              報告
              <Portal>
                <ReportModal
                  {...{ isOpen, onClose, url: window.location.toString() }}
                />
              </Portal>
            </MenuItem>
          )}
        </MenuContent>
      </MenuRoot>
    );
  },
);
NotesMenu.displayName = 'NotesMenu';

export default Notes;
