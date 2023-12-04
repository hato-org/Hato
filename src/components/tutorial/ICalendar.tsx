import { useMemo } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useClipboard,
  VStack,
} from '@chakra-ui/react';
import { TbCheck, TbChevronDown, TbCopy, TbExternalLink } from 'react-icons/tb';
import { useRecoilState } from 'recoil';
import { useUser } from '@/services/user';
import { tutorialModalAtom } from '@/store/tutorial';

export default function ICalendar() {
  const { data: user } = useUser();
  const [tutorialModal, setTutorialModal] = useRecoilState(tutorialModalAtom);
  const iCalLink = useMemo(
    () =>
      `${import.meta.env.VITE_API_URL}/calendar/ical/events.ics?key=${
        user.apiKey
      }`,
    [user],
  );
  const { onCopy, hasCopied } = useClipboard(iCalLink);

  return (
    <Modal
      isOpen={tutorialModal.iCal}
      onClose={() =>
        setTutorialModal((currVal) => ({ ...currVal, iCal: false }))
      }
    >
      <ModalOverlay />
      <ModalContent rounded="xl" bg="panel">
        <ModalHeader>iCalフィード</ModalHeader>
        <ModalCloseButton top={4} right={4} />
        <ModalBody>
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
                  spacing={4}
                  divider={<Icon as={TbChevronDown} w={8} h={8} />}
                >
                  <Text>「カレンダー」アプリ</Text>
                  <Image
                    shadow="md"
                    rounded="lg"
                    src="/ical/iCal_iPhone_1.png"
                  />
                  <Image
                    shadow="md"
                    rounded="lg"
                    src="/ical/iCal_iPhone_2.png"
                  />
                  <VStack>
                    <InputGroup>
                      <Input variant="filled" isReadOnly value={iCalLink} />
                      <InputRightElement>
                        <IconButton
                          aria-label="copy ical url"
                          variant="outline"
                          colorScheme={hasCopied ? 'green' : 'gray'}
                          icon={hasCopied ? <TbCheck /> : <TbCopy />}
                          onClick={onCopy}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <Image
                      shadow="md"
                      rounded="lg"
                      src="/ical/iCal_iPhone_3.png"
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
                  spacing={4}
                  divider={<Icon as={TbChevronDown} w={8} h={8} />}
                >
                  <Button
                    as={Link}
                    href="https://calendar.google.com/r"
                    isExternal
                    variant="link"
                    colorScheme="blue"
                    rightIcon={<TbExternalLink />}
                  >
                    Googleカレンダー (Web版)
                  </Button>
                  <Image
                    shadow="md"
                    rounded="lg"
                    src="/ical/iCal_Android_1.png"
                  />
                  <VStack>
                    <InputGroup>
                      <Input variant="filled" isReadOnly value={iCalLink} />
                      <InputRightElement>
                        <IconButton
                          aria-label="copy ical url"
                          variant="outline"
                          colorScheme={hasCopied ? 'green' : 'gray'}
                          icon={hasCopied ? <TbCheck /> : <TbCopy />}
                          onClick={onCopy}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <Image
                      shadow="md"
                      rounded="lg"
                      src="/ical/iCal_Android_2.png"
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
                  spacing={4}
                  divider={<Icon as={TbChevronDown} w={8} h={8} />}
                >
                  <Text>上記2つのどちらかを完了させる</Text>
                  <Image
                    shadow="md"
                    rounded="lg"
                    src="/ical/iCal_Timetree_0.png"
                  />
                  <Image
                    shadow="md"
                    rounded="lg"
                    src="/ical/iCal_Timetree_1.png"
                  />
                  <Image
                    shadow="md"
                    rounded="lg"
                    src="/ical/iCal_Timetree_2.png"
                  />
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
