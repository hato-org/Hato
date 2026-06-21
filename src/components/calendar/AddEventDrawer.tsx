import React, { useState } from 'react';
import { DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot } from '@/components/ui/drawer';
import { Button, Field, HStack, Icon, Input, InputGroup, Spacer, Text, Textarea, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import { Switch } from '@/components/ui/switch';
import { toaster } from '@/components/ui/toaster';
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

interface AddEventDrawerProps
  extends Omit<
    React.ComponentProps<typeof DrawerRoot>,
    'open' | 'onOpenChange' | 'children'
  > {
  isOpen: boolean;
  onClose: () => void;
}

const AddEventDrawer = React.memo(
  ({ isOpen, onClose, ...rest }: AddEventDrawerProps) => {
    const toast = (options: Parameters<typeof toaster.create>[0]) =>
    toaster.create({ duration: 1500, ...options });
    const { data: user } = useUser();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [startAt, setStartAt] = useState<Date>();
    const [endAt, setEndAt] = useState<Date>();
    const [isAllDay, setIsAllDay] = useState(false);
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
      <DrawerRoot open={isOpen} onOpenChange={(e) => !e.open && (onClose)()} placement="bottom" {...rest}>
        <DrawerContent
          borderTopRadius="xl"
          pb="env(safe-area-inset-bottom)"
          bg="panel"
        >
          <DrawerHeader w="full" maxW="container.lg" mx="auto">
            イベントの追加
          </DrawerHeader>
          <DrawerBody w="full" maxW="container.lg" mx="auto">
            <VStack gap={8}>
              <VStack w="100%">
                <Field.Root invalid={!title}>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="タイトル"
                    variant="flushed"
                    textStyle="title"
                    size="lg"
                  />
                </Field.Root>
                <Textarea
                  asChild
                  resize="none"
                  variant="flushed"
                  minH="unset"
                >
                  <ResizeTextArea
                    value={desc}
                    placeholder="説明（任意）"
                    maxRows={5}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </Textarea>
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
                    checked={isAllDay}
                    onCheckedChange={() => {
                      setIsAllDay((v) => !v);
                      setStartAt(undefined);
                      setEndAt(undefined);
                    }}
                  />
                </HStack>
                <Wrap w="100%">
                  <WrapItem w="100%">
                    <Field.Root
                      invalid={
                        !startAt ||
                        (endAt && startAt.getTime() > endAt.getTime())
                      }
                    >
                      <InputGroup startElement={<Icon as={TbArrowBarRight} />}>
                        <Input
                          onChange={(e) => setStartAt(new Date(e.target.value))}
                          variant="flushed"
                          type={isAllDay ? 'date' : 'datetime-local'}
                        />
                      </InputGroup>
                    </Field.Root>
                  </WrapItem>
                  <WrapItem w="100%">
                    <Field.Root
                      invalid={
                        !endAt ||
                        (startAt && startAt?.getTime() > endAt.getTime())
                      }
                    >
                      <InputGroup startElement={<Icon as={TbArrowBarToRight} />}>
                        <Input
                          onChange={(e) => setEndAt(new Date(e.target.value))}
                          variant="flushed"
                          type={isAllDay ? 'date' : 'datetime-local'}
                        />
                      </InputGroup>
                    </Field.Root>
                  </WrapItem>
                </Wrap>
                <HStack w="100%" />
              </VStack>
              <VStack w="100%">
                <InputGroup startElement={<Icon as={TbMapPin} />}>
                  <Input
                    value={location}
                    variant="flushed"
                    placeholder="場所（任意）"
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </InputGroup>
                <InputGroup startElement={<Icon as={TbTag} />}>
                  {/* <Input variant='flushed' placeholder="o" /> */}
                  <AsyncSelect
                    isMulti
                    invalid={!tags.length}
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
              loading={isPending}
              disabled={
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
                          type: 'success',
                        });
                        setTitle('');
                        setDesc('');
                        setIsAllDay(false);
                        setStartAt(undefined);
                        setEndAt(undefined);
                        setLocation('');
                        setTags([]);
                      },
                      onError: (e) => {
                        toast({
                          title: 'エラーが発生しました',
                          description: e.message,
                          type: 'error',
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
      </DrawerRoot>
    );
  },
);

AddEventDrawer.displayName = 'AddEventDrawer';
export default AddEventDrawer;
