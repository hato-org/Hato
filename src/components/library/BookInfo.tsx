import React, { useMemo } from 'react';
import {
  VStack,
  Image,
  HStack,
  Spacer,
  Box,
  Text,
  Icon,
  IconButton,
  Collapse,
  ButtonGroup,
  Button,
  Link,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { TbChevronDown, TbBook, TbExternalLink } from 'react-icons/tb';
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5';
import { useAtom } from 'jotai';
import { generateISBN13 } from '@/modules/library';
import { libraryBookmarkAtom } from '@/store/library';
import { useBookInfoById } from '@/services/library';

const BookInfo = React.memo(
  ({
    author,
    id,
    isbn,
    pubdate,
    publisher,
    title,
    holdings,
    url,
    source,
  }: Book) => {
    const [bookmarks, setBookmarks] = useAtom(libraryBookmarkAtom);
    const { isOpen, onToggle } = useDisclosure();
    const bgBrightness = useColorModeValue('100%', '40%');
    const bgOpacity = useColorModeValue(0.3, 0.9);
    const isBookmarked = bookmarks.includes(isbn);
    const imgSrc = useMemo(
      () =>
        isbn
          ? `https://cover.openbd.jp/${generateISBN13(isbn)}.jpg`
          : undefined,
      [isbn],
    );

    const sourceName = useMemo<{ [source: string]: string }>(
      () => ({
        NDL: '青空文庫',
        Negima_GK_2004103: '屋代高校・附属中学校図書館',
      }),
      [],
    );

    const { data: detail } = useBookInfoById(id, {
      enabled: source !== 'NDL' && isOpen,
    });

    return (
      <VStack
        w="100%"
        my={0}
        layerStyle="button"
        rounded="xl"
        spacing={0}
        pos="relative"
        overflow="hidden"
        zIndex={0}
      >
        <Image
          w="100%"
          h="100%"
          src={imgSrc}
          fallback={<Box />}
          pos="absolute"
          zIndex={-1}
          objectFit="cover"
          filter="auto"
          blur="10px"
          brightness={bgBrightness}
          transition="all .4s ease"
          opacity={isOpen ? bgOpacity : 0}
        />

        <HStack p={2} pr={4} w="100%" spacing={4} onClick={onToggle}>
          <Image
            boxSize={16}
            minW={16}
            shadow="md"
            objectFit="cover"
            rounded="lg"
            src={imgSrc}
            fallback={<Icon as={TbBook} boxSize={16} p={4} />}
          />
          <VStack align="flex-start" spacing={1}>
            <Text textStyle="title">{title}</Text>
            <HStack divider={<Text textStyle="description">・</Text>}>
              <Text textStyle="description" whiteSpace="nowrap">
                {pubdate}
              </Text>
              <Text textStyle="description" noOfLines={1}>
                {author}
              </Text>
            </HStack>
          </VStack>
          <Spacer />
          <Icon
            as={TbChevronDown}
            boxSize={5}
            transform={`rotate(${isOpen ? '180deg' : '0deg'})`}
            transition="all .2s ease"
          />
        </HStack>
        <Box w="100%">
          <Collapse in={isOpen}>
            <VStack w="100%" p={2} spacing={1}>
              <HStack w="100%" spacing={4}>
                <Text w={16} textAlign="right" textStyle="title">
                  出版者
                </Text>
                <Text textStyle="description">{publisher}</Text>
              </HStack>
              <HStack w="100%" spacing={4}>
                <Text w={16} textAlign="right" textStyle="title">
                  ISBN
                </Text>
                <Text textStyle="description">{isbn}</Text>
              </HStack>
              <HStack w="100%" spacing={4}>
                <Text w={16} textAlign="right" textStyle="title">
                  所蔵
                </Text>
                <Text textStyle="description">{sourceName[source] ?? ''}</Text>
              </HStack>
              <ButtonGroup w="100%" p={2} spacing={4}>
                {isbn && (
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <IconButton
                      aria-label="bookmark"
                      icon={
                        <Icon
                          as={isBookmarked ? IoBookmark : IoBookmarkOutline}
                          color={isBookmarked ? 'blue.400' : undefined}
                        />
                      }
                      rounded="lg"
                      shadow="lg"
                      onClick={() =>
                        setBookmarks((currVal) =>
                          isBookmarked
                            ? currVal.filter(
                                (markedIsbn) => markedIsbn !== isbn,
                              )
                            : [...currVal, isbn],
                        )
                      }
                    />
                  </motion.div>
                )}
                <Button
                  w="100%"
                  rounded="lg"
                  shadow="lg"
                  rightIcon={<Icon as={TbExternalLink} />}
                  as={Link}
                  href={url[holdings[0]]}
                  isExternal
                >
                  詳細を開く
                </Button>
                {source !== 'NDL' && (
                  <Button
                    w="100%"
                    rounded="lg"
                    shadow="lg"
                    colorScheme="blue"
                    isDisabled={!detail?.raw_holdings[0]?.id}
                    onClick={() =>
                      window.open(
                        `https://docs.google.com/forms/d/e/1FAIpQLSf-AAYIvxK9X1gEM7GwDUvETdCH3KPwoMXrk9R_dG6ipPehZQ/viewform?entry.1484043324=${title}&entry.294673799=${detail?.raw_holdings[0]?.id}`,
                      )
                    }
                  >
                    予約
                  </Button>
                )}
              </ButtonGroup>
            </VStack>
          </Collapse>
        </Box>
      </VStack>
    );
  },
);

export default BookInfo;
