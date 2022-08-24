import {
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
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
} from "@chakra-ui/react";
import ResizeTextArea from "react-textarea-autosize";
import { Select } from "chakra-react-select";
import { useState } from "react";
import {
  TbArrowBarRight,
  TbArrowBarToRight,
  TbMapPin,
  TbTag,
} from "react-icons/tb";
import { useClient } from "../../modules/client";
import { AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAllTagList } from "../../hooks/calendar/tag";
import { endOfDay, startOfDay } from "date-fns";
import { useAuth } from "../../modules/auth";

const AddEventDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { client } = useClient();
  const { user } = useAuth();
  const toast = useToast({
    position: "top-right",
  });
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [startAt, setStartAt] = useState<Date | undefined>();
  const [endAt, setEndAt] = useState<Date | undefined>();
  const [isAllDay, setIsAllDay] = useBoolean(false);
  const [location, setLocation] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const { data: allTag, error: tagError } = useAllTagList();

  const { isLoading: submitLoading, mutate: submit } = useMutation(
    () =>
      client.post("/calendar/event", {
        title,
        description: desc,
        startAt: isAllDay ? startOfDay(new Date(startAt || "")) : startAt,
        endAt: isAllDay ? endOfDay(new Date(endAt || "")) : endAt,
        isAllDay,
        location,
        tags,
        owner: user?.email,
      }),
    {
      onSuccess: () => {
        toast({
          title: "予定を追加しました。",
          status: "success",
        });
        setTitle("");
        setDesc("");
        setStartAt(undefined);
        setEndAt(undefined);
        setTags([]);
        queryClient.invalidateQueries(["calendar", "upcoming"]);
        onClose();
      },
      onError: (error) => {
        toast({
          title: "予定の追加に失敗しました。",
          status: "error",
        });
        console.error(error);
      },
    }
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
      <DrawerOverlay />
      <DrawerContent borderTopRightRadius="xl" borderTopLeftRadius="xl" pb={4}>
        <DrawerHeader>イベントの追加</DrawerHeader>
        <DrawerBody>
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
                <Switch onChange={() => setIsAllDay.toggle()} />
              </HStack>
              <HStack w="100%">
                <InputGroup>
                  <InputLeftElement children={<Icon as={TbArrowBarRight} />} />
                  <Input
                    onChange={(e) => setStartAt(new Date(e.target.value))}
                    variant="flushed"
                    type={isAllDay ? "date" : "datetime-local"}
                    isInvalid={!startAt || (endAt && startAt.getTime() > endAt.getTime())}
                  />
                </InputGroup>

                <InputGroup>
                  <InputLeftElement
                    children={<Icon as={TbArrowBarToRight} />}
                  />
                  <Input
                    onChange={(e) => setEndAt(new Date(e.target.value))}
                    variant="flushed"
                    type={isAllDay ? "date" : "datetime-local"}
                    isInvalid={!endAt || (startAt && startAt?.getTime() > endAt.getTime())}
                  />
                </InputGroup>
              </HStack>
              <HStack w="100%"></HStack>
            </VStack>
            {/* <VStack w="100%">
              <HStack>
                <CheckboxGroup>
                  <VStack textStyle="title">
                    <Checkbox value="j1">中1</Checkbox>
                    <Checkbox value="j2">中2</Checkbox>
                    <Checkbox value="j3">中3</Checkbox>
                  </VStack>
                </CheckboxGroup>
                <CheckboxGroup>
                  <VStack textStyle='title'>
                    <Checkbox value="h1">高1</Checkbox>
                    <Checkbox value="h2">高2</Checkbox>
                    <Checkbox value="h3">高3</Checkbox>
                  </VStack>
                </CheckboxGroup>
              </HStack>
            </VStack> */}
            <VStack w="100%">
              <InputGroup>
                <InputLeftElement children={<Icon as={TbMapPin} />} />
                <Input
                  value={location}
                  variant="flushed"
                  placeholder="場所（任意）"
                  onChange={(e) => setLocation(e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement children={<Icon as={TbTag} />} />
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
                      w: "100%",
                      textStyle: "title",
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      ml: 5,
                    }),
                    menu: (provided) => ({
                      ...provided,
                      shadow: "lg",
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
        <DrawerFooter>
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
};

export default AddEventDrawer;
