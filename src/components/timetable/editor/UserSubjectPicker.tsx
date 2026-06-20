import React, { useState, useRef, useEffect } from 'react';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot } from '@/components/ui/dialog';
import { Button, HStack, Icon, Input, Text, VStack } from '@chakra-ui/react';
import { useDebouncedCallback } from 'use-debounce';
import { TbArrowLeft, TbMapPin, TbPlus, TbUser } from 'react-icons/tb';
import {
  useUserSubjectMutation,
  useSearchUserSubject,
} from '@/services/timetable';
import { useUser } from '@/services/user';
import Loading from '../../common/Loading';

const UserSubjectPicker = React.memo(
  ({
    isOpen,
    onSelect,
    onCancel,
    meta,
    isPrivate,
  }: {
    isOpen: boolean;
    onSelect: (subjectId?: string | null) => void;
    onCancel: () => void;
    meta: UserSchedule['meta'];
    isPrivate: UserSchedule['private'];
  }) => {
    const suggestContainerRef = useRef<HTMLDivElement>(null);
    const [createMode, setCreateMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: user } = useUser();
    const { mutate, isPending } = useUserSubjectMutation();
    const {
      mutate: search,
      data: searchResult,
      isPending: searchPending,
    } = useSearchUserSubject();

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
      <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && (onCancel)()} size="xl">
        <DialogContent
          zIndex={1500}
          bg="panel"
          rounded="xl"
          pb="env(safe-area-inset-bottom)"
        >
          <DialogHeader>時限の追加・置き換え</DialogHeader>
          <DialogBody>
            <VStack w="full" align="flex-start" gap={4}>
              {createMode ? (
                <VStack w="full" align="flex-start" gap={4}>
                  <Button
                    variant="link"
                    colorScheme="blue"
                    onClick={() => {
                      setCreateMode(false);
                    }}
                  >{<Icon as={TbArrowLeft} />} 
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
                {searchPending ? (
                  <Loading />
                ) : searchResult?.length ? (
                  searchResult?.map((subj) => (
                    <UserSubjectSuggestion
                      key={subj._id}
                      {...subj}
                      onSelect={() => {
                        mutate(subj, {
                          onSuccess: (res) => {
                            onSelect(res._id);
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
              </VStack>
            </VStack>
          </DialogBody>
          <DialogFooter>
            {createMode ? (
              <Button
                w="full"
                rounded="lg"
                colorScheme="blue"
                disabled={!subject.name}
                loading={isPending}
                onClick={() =>
                  mutate(subject as UserSubject, {
                    onSuccess: (res) => {
                      onSelect(res._id);
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
                onClick={() => {
                  setCreateMode(true);
                  setSubject((val) => ({ ...val, name: searchQuery }));
                }}
              >{<Icon as={TbPlus} />} 
                作成する
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    );
  },
);
UserSubjectPicker.displayName = 'UserSubjectPicker';

const UserSubjectSuggestion = React.memo(
  ({
    name,
    short_name,
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
      gap={1}
      layerStyle="button"
      rounded="xl"
      onClick={onSelect}
    >
      <HStack w="full" align="flex-end">
        <Text textStyle="title">{name}</Text>
        {short_name && <Text textStyle="description">({short_name})</Text>}
      </HStack>
      {description && (
        <Text textStyle="description" fontWeight="normal">
          {description}
        </Text>
      )}
      <HStack wrap="wrap" rowGap={0.5}>
        {teacher && (
          <HStack align="center" gap={1}>
            <Icon as={TbUser} />
            <Text
              color="description"
              fontSize="xs"
              fontWeight="normal"
              lineClamp={1}
            >
              {teacher}
            </Text>
          </HStack>
        )}
        {location && (
          <HStack align="center" gap={1}>
            <Icon as={TbMapPin} />
            <Text
              color="description"
              fontSize="xs"
              fontWeight="normal"
              lineClamp={1}
            >
              {location}
            </Text>
          </HStack>
        )}
      </HStack>
    </VStack>
  ),
);
UserSubjectSuggestion.displayName = 'UserSubjectSuggestion';

export default UserSubjectPicker;
