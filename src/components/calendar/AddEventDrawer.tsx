import React, { useState } from 'react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Switch,
  Text,
  Textarea,
  useBoolean,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import ResizeTextArea from 'react-textarea-autosize';
import { Select } from 'chakra-react-select';
import {
  TbArrowBarRight,
  TbArrowBarToRight,
  TbMapPin,
  TbTag,
} from 'react-icons/tb';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { endOfDay, startOfDay } from 'date-fns';
import { AxiosError } from 'axios';
import { useClient } from '@/modules/client';
import { useAllTagList } from '@/hooks/calendar/tag';
import { useUser } from '@/hooks/user';

const AddEventDrawer = React.memo(
  ({ isOpen, onClose, ...rest }: Omit<DrawerProps, 'children'>) => {
    const { client } = useClient();
    const { data: user } = useUser();
    const toast = useToast({
      position: 'top-right',
      variant: 'left-accent',
    });
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [startAt, setStartAt] = useState<Date>();
    const [endAt, setEndAt] = useState<Date>();
    const [isAllDay, setIsAllDay] = useBoolean(false);
    const [location, setLocation] = useState('');
    // const [url, setUrl] = useState('');
    const [tags, setTags] = useState<Tag[]>([]);
    const { data: allTag } = useAllTagList();

    const { isLoading: submitLoading, mutate: submit } = useMutation<
      Event,
      AxiosError
    >(
      async () =>
        (
          await client.post('/calendar/event', {
            title,
            description: desc,
            startAt: isAllDay ? startOfDay(new Date(startAt || '')) : startAt,
            endAt: isAllDay ? endOfDay(new Date(endAt || '')) : endAt,
            isAllDay,
            location,
            tags,
            owner: user?.email,
          })
        ).data,
      {
        onSuccess: (event) => {
          toast({
            title: '予定を追加しました。',
            status: 'success',
          });
          queryClient.setQueryData<Event[]>(
            [
              'calendar',
              'events',
              {
                month: Number(startAt?.getMonth()) + 1,
                year: startAt?.getFullYear(),
              },
            ],
            (oldEvents) => [...(oldEvents ?? []), event]
          );
          queryClient.setQueryData(['calendar', 'event', event._id], event);
          setTitle('');
          setDesc('');
          setStartAt(undefined);
          setEndAt(undefined);
          setTags([]);
          onClose();
        },
        onError: (error) => {
          toast({
            title: '予定の追加に失敗しました。',
            description: error.message,
            status: 'error',
          });
        },
      }
    );

    return (
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom"
        autoFocus={false}
        {...rest}
      >
        <DrawerOverlay />
        <DrawerContent
          borderTopRadius="xl"
          pb="env(safe-area-inset-bottom)"
          bg="panel"
        >
          <DrawerHeader w="full" maxW="container.lg" mx="auto">
            イベントの追加
          </DrawerHeader>
          <DrawerBody w="full" maxW="container.lg" mx="auto">
            <VStack spacing={8}>
              <VStack w="100%">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="タイトル"
                  variant="flushed"
                  textStyle="title"
                  size="lg"
                  isInvalid={!title}
                />
                <Textarea
                  value={desc}
                  placeholder="説明（任意）"
                  as={ResizeTextArea}
                  resize="none"
                  variant="flushed"
                  minH="unset"
                  maxRows={5}
                  onChange={(e) => setDesc(e.target.value)}
                />
                {/* <Input
                onChange={(e) => setDesc(e.target.value)}
                placeholder="説明（任意）"
                variant="flushed"
                textStyle="description"
              /> */}
              </VStack>
              <VStack w="100%">
                <HStack w="100%">
                  <Text textStyle="title">終日</Text>
                  <Spacer />
                  <Switch
                    onChange={() => {
                      setIsAllDay.toggle();
                      setStartAt(undefined);
                      setEndAt(undefined);
                    }}
                  />
                </HStack>
                <Wrap w="100%">
                  <WrapItem w="100%">
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={TbArrowBarRight} />
                      </InputLeftElement>
                      <Input
                        onChange={(e) => setStartAt(new Date(e.target.value))}
                        variant="flushed"
                        type={isAllDay ? 'date' : 'datetime-local'}
                        isInvalid={
                          !startAt ||
                          (endAt && startAt.getTime() > endAt.getTime())
                        }
                      />
                    </InputGroup>
                  </WrapItem>
                  <WrapItem w="100%">
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={TbArrowBarToRight} />
                      </InputLeftElement>
                      <Input
                        onChange={(e) => setEndAt(new Date(e.target.value))}
                        variant="flushed"
                        type={isAllDay ? 'date' : 'datetime-local'}
                        isInvalid={
                          !endAt ||
                          (startAt && startAt?.getTime() > endAt.getTime())
                        }
                      />
                    </InputGroup>
                  </WrapItem>
                </Wrap>
                <HStack w="100%" />
              </VStack>
              <VStack w="100%">
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={TbMapPin} />
                  </InputLeftElement>
                  <Input
                    value={location}
                    variant="flushed"
                    placeholder="場所（任意）"
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={TbTag} />
                  </InputLeftElement>
                  {/* <Input variant='flushed' placeholder="o" /> */}
                  <Select
                    isMulti
                    isInvalid={!tags.length}
                    placeholder="タグ"
                    menuPlacement="top"
                    maxMenuHeight={240}
                    noOptionsMessage={() => (
                      <Text textStyle="title">
                        一致するタグが見つかりません。
                      </Text>
                    )}
                    chakraStyles={{
                      container: (provided) => ({
                        ...provided,
                        w: '100%',
                        textStyle: 'title',
                      }),
                      valueContainer: (provided) => ({
                        ...provided,
                        ml: 5,
                      }),
                      menu: (provided) => ({
                        ...provided,
                        shadow: 'lg',
                        zIndex: 2,
                      }),
                    }}
                    options={allTag}
                    value={tags}
                    onChange={(e: readonly Tag[]) => setTags(e as Tag[])}
                  />
                </InputGroup>
              </VStack>
            </VStack>
          </DrawerBody>
          <DrawerFooter w="full" maxW="container.lg" mx="auto">
            <Button
              w="100%"
              colorScheme="blue"
              rounded="xl"
              shadow="xl"
              isLoading={submitLoading}
              isDisabled={
                !title ||
                !startAt ||
                !endAt ||
                !tags.length ||
                startAt.getTime() > endAt.getTime()
              }
              onClick={() => submit()}
            >
              追加する
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
);

export default AddEventDrawer;
