import { useMemo } from 'react';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot } from '@/components/ui/dialog';
import { Accordion, Button, Icon, IconButton, Image, Input, InputGroup, Link, Spacer, Text, useClipboard, VStack } from '@chakra-ui/react';
import { TbCheck, TbChevronDown, TbCopy, TbExternalLink } from 'react-icons/tb';
import { useAtom } from 'jotai';
import { useUser } from '@/services/user';
import { tutorialModalAtom } from '@/store/tutorial';

export default function ICalendar() {
  const { data: user } = useUser();
  const [tutorialModal, setTutorialModal] = useAtom(tutorialModalAtom);
  const iCalLink = useMemo(
    () =>
      `${import.meta.env.VITE_API_URL}/calendar/ical/events.ics?key=${
        user.apiKey
      }`,
    [user],
  );
  const { copied, copy } = useClipboard({ value: iCalLink });

  return (
    <DialogRoot
      open={tutorialModal.iCal}
      onOpenChange={(e) => !e.open && (() =>
        setTutorialModal((currVal) => ({ ...currVal, iCal: false })))()}
    >
      <DialogContent rounded="xl" bg="panel">
        <DialogHeader>iCalフィード</DialogHeader>
        <DialogCloseTrigger top={4} right={4} />
        <DialogBody>
          <Accordion.Root textStyle="title" collapsible defaultValue={['item-0']}>
            <Accordion.Item value="item-0">
              <Accordion.ItemTrigger textStyle="title">
                iCalとは？
                <Spacer />
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  iCalとは、カレンダーに関する情報を記述する際に用いられる書式のことです。
                  <br />
                  Hatoで生成されるiCalをカレンダーアプリに読み込ませることで、アプリ上でHatoのカレンダー情報を表示することができます。
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
            <Accordion.Item value="item-1">
              <Accordion.ItemTrigger textStyle="title">
                連携方法（iOSカレンダー）
                <Spacer />
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <VStack
                    pt={4}
                    gap={4}
                    separator={<Icon as={TbChevronDown} w={8} h={8} />}
                  >
                    <Text>「カレンダー」アプリ</Text>
                    <Image
                      shadow="md"
                      rounded="lg"
                      src="/ical/iCal_iPhone_1.png"
                      alt="iOSカレンダー 手順1: カレンダーアプリを開く"
                    />
                    <Image
                      shadow="md"
                      rounded="lg"
                      src="/ical/iCal_iPhone_2.png"
                      alt="iOSカレンダー 手順2: 照会を追加"
                    />
                    <VStack>
                      <InputGroup
                        endElement={
                          <IconButton
                            aria-label="copy ical url"
                            variant="outline"
                            colorScheme={copied ? 'green' : 'gray'}
                            onClick={copy}
                          >{copied ? <TbCheck /> : <TbCopy />}</IconButton>
                        }
                      >
                        <Input variant="subtle" readOnly value={iCalLink} />
                      </InputGroup>
                      <Image
                        shadow="md"
                        rounded="lg"
                        src="/ical/iCal_iPhone_3.png"
                        alt="iOSカレンダー 手順3: URLを貼り付けて照会"
                      />
                    </VStack>
                  </VStack>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
            <Accordion.Item value="item-2">
              <Accordion.ItemTrigger textStyle="title">
                連携方法（Googleカレンダー）
                <Spacer />
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <VStack
                    pt={4}
                    gap={4}
                    separator={<Icon as={TbChevronDown} w={8} h={8} />}
                  >
                    <Button
                      asChild
                      variant="plain"
                      colorScheme="blue"
                    >
                      <Link
                        href="https://calendar.google.com/r"
                        target="_blank" rel="noreferrer"
                      >
                        Googleカレンダー (Web版)
                        {<TbExternalLink />}
                      </Link>
                    </Button>
                    <Image
                      shadow="md"
                      rounded="lg"
                      src="/ical/iCal_Android_1.png"
                      alt="Googleカレンダー 手順1: 他のカレンダーを追加"
                    />
                    <VStack>
                      <InputGroup
                        endElement={
                          <IconButton
                            aria-label="copy ical url"
                            variant="outline"
                            colorScheme={copied ? 'green' : 'gray'}
                            onClick={copy}
                          >{copied ? <TbCheck /> : <TbCopy />}</IconButton>
                        }
                      >
                        <Input variant="subtle" readOnly value={iCalLink} />
                      </InputGroup>
                      <Image
                        shadow="md"
                        rounded="lg"
                        src="/ical/iCal_Android_2.png"
                        alt="Googleカレンダー 手順2: URLを貼り付けて追加"
                      />
                    </VStack>
                  </VStack>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
            <Accordion.Item value="item-3">
              <Accordion.ItemTrigger textStyle="title">
                連携方法（Timetree）
                <Spacer />
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <VStack
                    pt={4}
                    gap={4}
                    separator={<Icon as={TbChevronDown} w={8} h={8} />}
                  >
                    <Text>上記2つのどちらかを完了させる</Text>
                    <Image
                      shadow="md"
                      rounded="lg"
                      src="/ical/iCal_Timetree_0.png"
                      alt="Timetree 手順1: 事前にiOS/Googleカレンダーの連携を完了"
                    />
                    <Image
                      shadow="md"
                      rounded="lg"
                      src="/ical/iCal_Timetree_1.png"
                      alt="Timetree 手順2: OSカレンダーと連携"
                    />
                    <Image
                      shadow="md"
                      rounded="lg"
                      src="/ical/iCal_Timetree_2.png"
                      alt="Timetree 手順3: カレンダーの取り込みを確認"
                    />
                  </VStack>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
        </DialogBody>
        <DialogFooter />
      </DialogContent>
    </DialogRoot>
  );
}
