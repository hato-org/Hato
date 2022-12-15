import { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { Virtuoso } from 'react-virtuoso';
import { librarySearchAtom } from '@/store/library';
import Card from '../layout/Card';
import { useLibrarySearch } from '@/hooks/library';
import BookInfo from './BookInfo';

export default function Search() {
  const { mutate, data, isLoading } = useLibrarySearch();
  const [selected, setSelected] = useState<'free' | 'detail'>('free');

  return (
    <VStack pt={2} px={4} mb={24} w="100%" minH="100vh" spacing={8}>
      <Card p={0} w="100%" overflow="hidden">
        <VStack>
          <Tabs w="100%" isFitted size="lg">
            <TabList>
              <Tab
                textStyle="title"
                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
                onSelect={() => setSelected('free')}
              >
                フリーワード
              </Tab>
              <Tab
                textStyle="title"
                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
                onSelect={() => setSelected('detail')}
              >
                詳細検索
              </Tab>
            </TabList>
            <TabPanels w="100%">
              <TabPanel w="100%">
                <FreeSearch onSubmit={() => mutate({})} />
              </TabPanel>
              <TabPanel>
                <DetailSearch onSubmit={() => mutate({ free: undefined })} />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Box w="100%" px={4} pb={4}>
            <Button
              w="100%"
              colorScheme="blue"
              rounded="lg"
              onClick={() =>
                mutate(selected === 'free' ? {} : { free: undefined })
              }
              isLoading={isLoading}
            >
              検索
            </Button>
          </Box>
        </VStack>
      </Card>
      <Box w="100%" h="100%">
        <Collapse in={!!data}>
          <VStack w="100%" h="100%" spacing={4}>
            <HStack w="100%" px={2}>
              <Skeleton isLoaded={!isLoading} rounded="lg" w={24}>
                <Text textStyle="title" color="description">
                  {data?.count}件
                </Text>
              </Skeleton>
            </HStack>
            {/* <VStack w="100%" spacing={4}>
              {data?.books.map((book) => (
                <BookInfo key={book.id} {...book} />
              ))}
            </VStack> */}

            <Virtuoso
              useWindowScroll
              data={data?.books ?? []}
              itemContent={(index, book) => (
                <Box py={2}>
                  <BookInfo {...book} />
                </Box>
              )}
              increaseViewportBy={{ top: 8, bottom: 8 }}
              style={{ width: '100%' }}
            />
          </VStack>
        </Collapse>
      </Box>
    </VStack>
  );
}

function FreeSearch({ onSubmit }: { onSubmit: () => void }) {
  const [params, setParams] = useRecoilState(librarySearchAtom);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <VStack pt={4}>
        <Input
          textStyle="title"
          rounded="lg"
          value={params.free}
          onChange={(e) =>
            setParams((currVal) => ({ ...currVal, free: e.target.value }))
          }
        />
      </VStack>
    </form>
  );
}

function DetailSearch({ onSubmit }: { onSubmit: () => void }) {
  const [params, setParams] = useRecoilState(librarySearchAtom);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <VStack>
        <FormControl>
          <FormLabel>タイトル</FormLabel>
          <Input
            textStyle="title"
            rounded="lg"
            value={params.title}
            onChange={(e) =>
              setParams((currVal) => ({ ...currVal, title: e.target.value }))
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>著者名</FormLabel>
          <Input
            textStyle="title"
            rounded="lg"
            value={params.author}
            onChange={(e) =>
              setParams((currVal) => ({ ...currVal, author: e.target.value }))
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>出版者</FormLabel>
          <Input
            textStyle="title"
            rounded="lg"
            value={params.publisher}
            onChange={(e) =>
              setParams((currVal) => ({
                ...currVal,
                publisher: e.target.value,
              }))
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>分類</FormLabel>
          <Input
            textStyle="title"
            rounded="lg"
            value={params.ndc}
            onChange={(e) =>
              setParams((currVal) => ({ ...currVal, ndc: e.target.value }))
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>出版年</FormLabel>
          <HStack>
            <Input
              textStyle="title"
              rounded="lg"
              type="number"
              value={params.yearStart}
              onChange={(e) =>
                setParams((currVal) => ({
                  ...currVal,
                  yearStart: Number(e.target.value) || undefined,
                }))
              }
            />
            <Text>～</Text>
            <Input
              textStyle="title"
              rounded="lg"
              type="number"
              value={params.yearEnd}
              onChange={(e) =>
                setParams((currVal) => ({
                  ...currVal,
                  yearEnd: Number(e.target.value) || undefined,
                }))
              }
            />
          </HStack>
        </FormControl>
        <FormControl>
          <FormLabel>ISBN</FormLabel>
          <Input
            textStyle="title"
            rounded="lg"
            value={params.isbn}
            onChange={(e) =>
              setParams((currVal) => ({ ...currVal, isbn: e.target.value }))
            }
          />
        </FormControl>
      </VStack>
    </form>
  );
}
