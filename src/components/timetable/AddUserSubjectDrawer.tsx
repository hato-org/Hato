import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useDebouncedCallback } from 'use-debounce';
import { TbArrowLeft, TbPlus } from 'react-icons/tb';
import {
  useUserSubjectMutation,
  useUserSubjectSearch,
} from '@/hooks/timetable';
import { useUser } from '@/hooks/user';
import Loading from '../common/Loading';

const AddUserSubjectDrawer = React.memo(
  ({
    isOpen,
    onClose,
    meta,
    isPrivate,
  }: {
    isOpen: boolean;
    onClose: (subjectId?: string | null) => void;
    meta: UserSchedule['meta'];
    isPrivate: UserSchedule['private'];
  }) => {
    const suggestContainerRef = useRef<HTMLDivElement>(null);
    const [createMode, setCreateMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: user } = useUser();
    const { mutate, isLoading } = useUserSubjectMutation();
    const {
      mutate: search,
      data: searchResult,
      isLoading: searchLoading,
    } = useUserSubjectSearch();

    const debounced = useDebouncedCallback((query: string) => {
      search({ name: query, short_name: query, meta });
      setSearchQuery(query);
    }, 500);

    const [subject, setSubject] = useState<Partial<UserSubject>>({
      owner: user._id,
      private: isPrivate,
      meta,
    });

    useEffect(() => {
      if (isOpen) search({ name: '.*', meta });
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} size="xl">
        <ModalOverlay zIndex={1400} />
        <ModalContent
          zIndex={1500}
          bg="panel"
          rounded="xl"
          pb="env(safe-area-inset-bottom)"
        >
          <ModalHeader>時限の追加</ModalHeader>
          <ModalBody>
            <VStack w="full" align="flex-start" spacing={4}>
              {createMode ? (
                <VStack w="full" align="flex-start" spacing={4}>
                  <Button
                    variant="link"
                    colorScheme="blue"
                    leftIcon={<Icon as={TbArrowLeft} />}
                    onClick={() => {
                      setCreateMode(false);
                    }}
                  >
                    検索に戻る
                  </Button>
                  <Input
                    variant="flushed"
                    textStyle="title"
                    placeholder="教科名"
                    defaultValue={searchQuery}
                    isInvalid={!subject.name}
                    onChange={(e) =>
                      setSubject((val) => ({
                        ...val,
                        name: e.target.value || undefined,
                      }))
                    }
                  />
                  <Input
                    variant="flushed"
                    textStyle="title"
                    placeholder="教科名（略称）"
                    onChange={(e) =>
                      setSubject((val) => ({
                        ...val,
                        short_name: e.target.value || undefined,
                      }))
                    }
                  />
                  <Input
                    variant="flushed"
                    textStyle="title"
                    placeholder="教師"
                    onChange={(e) =>
                      setSubject((val) => ({
                        ...val,
                        teacher: e.target.value || undefined,
                      }))
                    }
                  />
                  <Input
                    variant="flushed"
                    textStyle="title"
                    placeholder="場所"
                    onChange={(e) =>
                      setSubject((val) => ({
                        ...val,
                        location: e.target.value || undefined,
                      }))
                    }
                  />
                </VStack>
              ) : (
                <Input
                  variant="outline"
                  rounded="lg"
                  placeholder="教科名で検索（略称でも可）"
                  textStyle="title"
                  display={subject.name ? 'none' : 'block'}
                  onChange={(e) => debounced(e.target.value)}
                  onClickCapture={(e) => e.stopPropagation()}
                />
              )}
              <VStack
                ref={suggestContainerRef}
                display={!createMode ? 'block' : 'none'}
                onClick={(e) => e.stopPropagation()}
                w="full"
              >
                {/* eslint-disable no-nested-ternary */}
                {searchLoading ? (
                  <Loading />
                ) : searchResult?.length ? (
                  searchResult?.map((subj) => (
                    <UserSubjectSuggestion
                      key={subj._id}
                      {...subj}
                      onSelect={() => {
                        mutate(subj, {
                          onSuccess: (res) => {
                            onClose(res._id);
                          },
                        });
                      }}
                    />
                  ))
                ) : (
                  <Text
                    py={2}
                    textAlign="center"
                    color="description"
                    textStyle="title"
                  >
                    候補がありません
                  </Text>
                )}
                {/* eslint-enable no-nested-ternary */}
              </VStack>
              {createMode ? (
                <Button
                  w="full"
                  rounded="lg"
                  colorScheme="blue"
                  isDisabled={!subject.name}
                  isLoading={isLoading}
                  onClick={() =>
                    mutate(subject as UserSubject, {
                      onSuccess: (res) => {
                        onClose(res._id);
                      },
                    })
                  }
                >
                  追加
                </Button>
              ) : (
                <Button
                  w="full"
                  rounded="lg"
                  leftIcon={<Icon as={TbPlus} />}
                  onClick={() => {
                    setCreateMode(true);
                    setSubject((val) => ({ ...val, name: searchQuery }));
                  }}
                >
                  作成する
                </Button>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
);

const UserSubjectSuggestion = React.memo(
  ({
    name,
    description,
    teacher,
    location,
    onSelect,
  }: UserSubject & { onSelect?: () => void }) => (
    <VStack
      px={4}
      py={2}
      w="full"
      align="flex-start"
      spacing={0}
      layerStyle="button"
      rounded="xl"
      onClick={onSelect}
    >
      <HStack w="full" align="flex-end">
        <Text textStyle="title">{name}</Text>
        {/* <Text textStyle="description">{data?.short_name}</Text> */}
      </HStack>
      {description && (
        <Text textStyle="description" fontWeight="normal">
          {description}
        </Text>
      )}
      <HStack
        divider={
          <Text color="description" fontSize="xs" fontWeight="normal">
            ・
          </Text>
        }
      >
        {teacher && (
          <Text color="description" fontSize="xs" fontWeight="normal">
            {teacher}
          </Text>
        )}
        {location && (
          <Text color="description" fontSize="xs" fontWeight="normal">
            {location}
          </Text>
        )}
      </HStack>
    </VStack>
  )
);

export default AddUserSubjectDrawer;
