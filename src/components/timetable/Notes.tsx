import { useState, useEffect } from 'react';
import {
  VStack,
  Text,
  StackProps,
  UnorderedList,
  ListItem,
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
} from '@chakra-ui/react';
import ResizeTextArea from 'react-textarea-autosize';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  TbCheck,
  TbDotsVertical,
  TbEdit,
  TbFlag,
  TbTrash,
  TbX,
} from 'react-icons/tb';
import { useClient } from '@/modules/client';
import { useUser } from '@/hooks/user';
import Error from '../cards/Error';
import Loading from '../common/Loading';
import ReportModal from '../common/ReportModal';

interface NotesProps extends StackProps {
  year: number;
  month: number;
  day: number;
  type: Type;
  grade: number;
  schoolClass: number;
}

function Notes({
  year,
  month,
  day,
  type,
  grade,
  schoolClass,
  ...rest
}: NotesProps) {
  const { client } = useClient();
  const { data: user } = useUser();

  const { data, isLoading, error } = useQuery<Note[], AxiosError>(
    ['timetable', 'note', { year, month, day }],
    async () =>
      (await client.get('/timetable/note', { params: { year, month, day } }))
        .data
  );

  if (isLoading) return <Loading />;

  if (error) return <Error error={error} />;

  return (
    <VStack w="100%" {...rest}>
      {data.filter(
        (note) =>
          note.target?.some(
            (classInfo) =>
              classInfo.type === type &&
              classInfo.grade_num === grade &&
              classInfo.class_num === schoolClass
          ) || note.owner === user.email
      ).length ? (
        <VStack w="100%" align="flex-start">
          <UnorderedList w="100%" px={4}>
            {data
              .filter(
                (note) =>
                  note.target?.some(
                    (classInfo) =>
                      classInfo.type === user.type &&
                      classInfo.grade_num === user.grade &&
                      classInfo.class_num === user.class
                  ) && note.owner !== user.email
              )
              .map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
          </UnorderedList>
          <Heading size="sm">自分が追加したもの</Heading>
          <UnorderedList w="100%" px={4}>
            {data
              .filter((note) => note.owner === user.email)
              .map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
          </UnorderedList>
        </VStack>
      ) : (
        <Text textStyle="description" fontWeight="bold">
          特にありません
        </Text>
      )}
    </VStack>
  );
}

function NoteCard({ note }: { note: Note }) {
  const toast = useToast({
    position: 'top-right',
    variant: 'left-accent',
  });
  const { client } = useClient();
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(note.message);

  useEffect(() => {
    setMessage(note.message);
  }, [note]);

  const { mutate: editMutate } = useMutation<Note, AxiosError, Note>(
    async (newNote) =>
      (await client.post(`/timetable/note/${newNote._id}`, newNote)).data,
    {
      onSuccess: (newNote) => {
        toast({
          status: 'success',
          title: '保存しました。',
        });
        queryClient.setQueryData<Note[]>(
          [
            'timetable',
            'note',
            {
              year: new Date(newNote.date).getFullYear(),
              month: new Date(newNote.date).getMonth() + 1,
              day: new Date(newNote.date).getDate(),
            },
          ],
          (oldNotes) => [
            ...(oldNotes?.filter((oldNote) => oldNote._id !== newNote._id) ??
              []),
            newNote,
          ]
        );
      },
      onError: (mutateError) => {
        toast({
          status: 'error',
          title: '保存に失敗しました。',
          description: mutateError.message,
        });
      },
    }
  );
  const { mutate: deleteMutate } = useMutation<Note, AxiosError, string>(
    async (_id) => (await client.delete(`/timetable/note/${_id}`)).data,
    {
      onSuccess: (deletedNote) => {
        toast({
          status: 'success',
          title: '削除しました。',
        });
        queryClient.setQueryData<Note[]>(
          [
            'timetable',
            'note',
            {
              year: new Date(deletedNote.date).getFullYear(),
              month: new Date(deletedNote.date).getMonth() + 1,
              day: new Date(deletedNote.date).getDate(),
            },
          ],
          (oldNotes) =>
            oldNotes?.filter((oldNote) => oldNote._id !== deletedNote._id)
        );
      },
      onError: (mutateError) => {
        toast({
          status: 'error',
          title: '削除に失敗しました。',
          description: mutateError.message,
        });
      },
    }
  );

  return (
    <ListItem
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
              onClick={() => {
                editMutate({ ...note, message });
                setEditMode(false);
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
            onDelete={() => deleteMutate(note._id)}
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
                    targetClass.grade_num +
                    targetClass.class_num
                  }
                >{`${targetClass.grade_num}年${targetClass.name}`}</Tag>
              ))}
            </Wrap>
          )}
        </>
      )}
    </ListItem>
  );
}

interface NotesMenuProps extends MenuButtonProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

function NotesMenu({ note, onEdit, onDelete, ...rest }: NotesMenuProps) {
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
      <MenuList textStyle="title" shadow="lg">
        {note.owner === user.email || user.role === 'admin' ? (
          <>
            {user.role === 'admin' && (
              <MenuItem textStyle="title" icon={<TbFlag />} onClick={onOpen}>
                報告
                <Portal>
                  <ReportModal {...{ isOpen, onClose, note }} />
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
              <ReportModal {...{ isOpen, onClose, note }} />
            </Portal>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}

export default Notes;
