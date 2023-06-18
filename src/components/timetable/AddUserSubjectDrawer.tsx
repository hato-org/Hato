import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  IconButton,
  Input,
  Portal,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useDebouncedCallback } from 'use-debounce';
import { TbArrowLeft, TbPlus, TbX } from 'react-icons/tb';
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
    const {
      isOpen: suggestIsOpen,
      onOpen: suggestOnOpen,
      onClose: suggestOnClose,
    } = useDisclosure();
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
      search({ name: '.*', meta });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [suggestIsOpen]);

    useEffect(() => {
      if (!searchResult?.length)
        suggestContainerRef.current?.scrollTo({
          top: 1000000,
          behavior: 'smooth',
        });
    }, [searchResult]);

    return (
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom"
        autoFocus={false}
      >
        <DrawerOverlay zIndex={1400} />
        <DrawerContent
          zIndex={1500}
          bg="panel"
          roundedTop="xl"
          pb="env(safe-area-inset-bottom)"
          onClick={suggestOnClose}
        >
          <DrawerHeader>時限の追加</DrawerHeader>
          <DrawerBody>
            <VStack w="full" align="flex-start">
              {createMode ? (
                <VStack w="full" align="flex-start" spacing={4}>
                  <Button
                    variant="link"
                    colorScheme="blue"
                    leftIcon={<Icon as={TbArrowLeft} />}
                    onClick={() => setCreateMode(false)}
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
                [
                  subject.name ? (
                    <HStack
                      w="full"
                      px={4}
                      py={2}
                      border="1px solid"
                      borderColor="border"
                      rounded="xl"
                      overflow="hidden"
                    >
                      <VStack spacing={1} w="full" align="flex-start">
                        <Text textStyle="title">{subject.name}</Text>
                        <Text textStyle="description">
                          {subject.description}
                        </Text>
                      </VStack>
                      <Spacer />
                      <IconButton
                        aria-label="delete subject selection"
                        icon={<Icon as={TbX} />}
                        variant="ghost"
                        colorScheme="red"
                        size="sm"
                        onClick={() => setSubject({})}
                      />
                    </HStack>
                  ) : (
                    <Input
                      variant="flushed"
                      placeholder="教科名（略称でも可）"
                      textStyle="title"
                      display={subject.name ? 'none' : 'block'}
                      onChange={(e) => debounced(e.target.value)}
                      onFocus={suggestOnOpen}
                      onClickCapture={(e) => e.stopPropagation()}
                    />
                  ),
                ]
              )}
            </VStack>
            <Portal>
              <VStack
                ref={suggestContainerRef}
                position="fixed"
                bottom={0}
                bg="panel"
                w="full"
                h="calc(env(safe-area-inset-bottom) + var(--chakra-sizes-16))"
                py={3}
                overflowY="auto"
                shadow="xl"
                border="1px solid"
                borderColor="border"
                roundedTop="xl"
                zIndex={2000}
                display={!createMode && suggestIsOpen ? 'block' : 'none'}
                onClick={(e) => e.stopPropagation()}
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
                        setSubject(subj);
                        suggestOnClose();
                      }}
                    />
                  ))
                ) : (
                  <VStack justify="center" minH="full">
                    <Text color="description" textStyle="title">
                      候補がありません
                    </Text>
                    <Button
                      variant="ghost"
                      leftIcon={<Icon as={TbPlus} />}
                      onClick={() => {
                        setCreateMode(true);
                        setSubject((val) => ({ ...val, name: searchQuery }));
                      }}
                    >
                      作成する
                    </Button>
                  </VStack>
                )}
                {/* eslint-enable no-nested-ternary */}
              </VStack>
            </Portal>
          </DrawerBody>
          <DrawerFooter>
            <Button
              isDisabled={!subject.name}
              isLoading={isLoading}
              w="full"
              colorScheme="blue"
              rounded="lg"
              onClick={() => {
                if (subject.owner && subject.name)
                  mutate(subject as UserSubject, {
                    onSuccess: (subj) => {
                      console.log(subj);
                      onClose(subj._id);
                    },
                  });
                else onClose(null);
              }}
            >
              追加
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
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
