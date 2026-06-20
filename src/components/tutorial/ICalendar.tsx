import { useMemo } from 'react';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot } from '@/components/ui/dialog';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, Icon, IconButton, Image, Input, InputGroup, InputRightElement, Link, Spacer, Text, useClipboard, VStack } from '@chakra-ui/react';
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
  const { onCopy, hasCopied } = useClipboard(iCalLink);

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
          <Accordion textStyle="title" allowToggle defaultIndex={0}>
            <AccordionItem>
              <AccordionButton textStyle="title">
                iCalとは？
                <Spacer />
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                iCalとは、カレンダーに関する情報を記述する際に用いられる書式のことです。
                <br />
                Hatoで生成されるiCalをカレンダーアプリに読み込ませることで、アプリ上でHatoのカレンダー情報を表示することができます。
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton textStyle="title">
                連携方法（iOSカレンダー）
                <Spacer />
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
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
                    <InputGroup>
                      <Input variant="filled" isReadOnly value={iCalLink} />
                      <InputRightElement>
                        <IconButton
                          aria-label="copy ical url"
                          variant="outline"
                          colorScheme={hasCopied ? 'green' : 'gray'}
                          onClick={onCopy}
                        >{hasCopied ? <TbCheck /> : <TbCopy />}</IconButton>
                      </InputRightElement>
                    </InputGroup>
                    <Image
                      shadow="md"
                      rounded="lg"
                      src="/ical/iCal_iPhone_3.png"
                      alt="iOSカレンダー 手順3: URLを貼り付けて照会"
                    />
                  </VStack>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton textStyle="title">
                連携方法（Googleカレンダー）
                <Spacer />
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <VStack
                  pt={4}
                  gap={4}
                  separator={<Icon as={TbChevronDown} w={8} h={8} />}
                >
                  <Button
                    as={Link}
                    href="https://calendar.google.com/r"
                    target="_blank" rel="noreferrer"
                    variant="link"
                    colorScheme="blue"
                  >
                    Googleカレンダー (Web版)
                   {<TbExternalLink />}</Button>
                  <Image
                    shadow="md"
                    rounded="lg"
                    src="/ical/iCal_Android_1.png"
                    alt="Googleカレンダー 手順1: 他のカレンダーを追加"
                  />
                  <VStack>
                    <InputGroup>
                      <Input variant="filled" isReadOnly value={iCalLink} />
                      <InputRightElement>
                        <IconButton
                          aria-label="copy ical url"
                          variant="outline"
                          colorScheme={hasCopied ? 'green' : 'gray'}
                          onClick={onCopy}
                        >{hasCopied ? <TbCheck /> : <TbCopy />}</IconButton>
                      </InputRightElement>
                    </InputGroup>
                    <Image
                      shadow="md"
                      rounded="lg"
                      src="/ical/iCal_Android_2.png"
                      alt="Googleカレンダー 手順2: URLを貼り付けて追加"
                    />
                  </VStack>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton textStyle="title">
                連携方法（Timetree）
                <Spacer />
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
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
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </DialogBody>
        <DialogFooter />
      </DialogContent>
    </DialogRoot>
  );
}
