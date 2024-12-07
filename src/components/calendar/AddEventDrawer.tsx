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
import { AsyncSelect } from 'chakra-react-select';
import {
  TbArrowBarRight,
  TbArrowBarToRight,
  TbMapPin,
  TbTag,
} from 'react-icons/tb';
import { useAddEventMutation, useTagsSearch } from '@/services/calendar';
import { useUser } from '@/services/user';

const AddEventDrawer = React.memo(
  ({ isOpen, onClose, ...rest }: Omit<DrawerProps, 'children'>) => {
    const toast = useToast({
      position: 'top-right',
      duration: 1500,
    });
    const { data: user } = useUser();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [startAt, setStartAt] = useState<Date>();
    const [endAt, setEndAt] = useState<Date>();
    const [isAllDay, setIsAllDay] = useBoolean(false);
    const [location, setLocation] = useState('');
    // const [url, setUrl] = useState('');
    const [tags, setTags] = useState<Tag[]>([]);
    const {
      data: searchRes,
      mutateAsync: searchTags,
      isPending: searchPending,
    } = useTagsSearch();

    const { isPending, mutate } = useAddEventMutation();

    // TODO: refactor with react-hook-form
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
                    isChecked={isAllDay}
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
                  <AsyncSelect
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
                    options={searchRes}
                    loadOptions={(value) => searchTags(value || '*')}
                    isLoading={searchPending}
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
              isLoading={isPending}
              isDisabled={
                !title ||
                !startAt ||
                !endAt ||
                !tags.length ||
                startAt.getTime() > endAt.getTime()
              }
              onClick={() => {
                if (startAt && endAt) {
                  mutate(
                    {
                      title,
                      description: desc,
                      isAllDay,
                      startAt,
                      endAt,
                      location,
                      tags,
                      owner: user.email,
                    },
                    {
                      onSuccess: () => {
                        onClose();
                        toast({
                          title: '追加しました。',
                          status: 'success',
                        });
                        setTitle('');
                        setDesc('');
                        setIsAllDay.off();
                        setStartAt(undefined);
                        setEndAt(undefined);
                        setLocation('');
                        setTags([]);
                      },
                      onError: (e) => {
                        toast({
                          title: 'エラーが発生しました',
                          description: e.message,
                          status: 'error',
                        });
                      },
                    },
                  );
                }
              }}
            >
              追加する
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
);

export default AddEventDrawer;
