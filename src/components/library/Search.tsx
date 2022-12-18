import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormLabel,
  HStack,
  Icon,
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
import { TbMoodSad } from 'react-icons/tb';
import { librarySearchAtom } from '@/store/library';
import Card from '../layout/Card';
import { useLibrarySearch } from '@/hooks/library';
import BookInfo from './BookInfo';
import Loading from '../common/Loading';

export default function Search() {
  const { mutate, data, isLoading } = useLibrarySearch();
  const [selected, setSelected] = useState<'free' | 'detail'>('free');
  const category: ['free', 'detail'] = useMemo(() => ['free', 'detail'], []);

  return (
    <VStack pt={2} px={4} mb={24} w="100%" spacing={8}>
      <Card p={0} w="100%" overflow="hidden">
        <VStack>
          <Tabs
            w="100%"
            isFitted
            size="lg"
            onChange={(index) => setSelected(category[index])}
          >
            <TabList>
              <Tab
                textStyle="title"
                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
              >
                フリーワード
              </Tab>
              <Tab
                textStyle="title"
                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
              >
                詳細検索
              </Tab>
            </TabList>
            <TabPanels w="100%">
              <TabPanel w="100%">
                <FreeSearch onSubmit={() => mutate('free')} />
              </TabPanel>
              <TabPanel>
                <DetailSearch onSubmit={() => mutate('detail')} />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Box w="100%" px={4} pb={4}>
            <Button
              w="100%"
              colorScheme="blue"
              rounded="lg"
              onClick={() => mutate(selected)}
              isLoading={isLoading}
            >
              検索
            </Button>
          </Box>
        </VStack>
      </Card>
      <SearchResult result={data} isLoading={isLoading} />
    </VStack>
  );
}

const SearchResult = React.memo(
  ({
    result,
    isLoading,
  }: {
    result?: LibrarySearchResponse;
    isLoading: boolean;
  }) => (
    <Box w="100%" h="100%">
      <Collapse in={!!result || isLoading}>
        {/* eslint-disable no-nested-ternary */}
        {isLoading ? (
          <Loading />
        ) : result?.count ? (
          <VStack w="100%" h="100%" spacing={4}>
            <HStack w="100%" px={2}>
              <Skeleton isLoaded={!isLoading} rounded="lg" w={24}>
                <Text textStyle="title" color="description">
                  {result?.count}件
                </Text>
              </Skeleton>
            </HStack>
            <Virtuoso
              useWindowScroll
              data={result?.books ?? []}
              itemContent={(index, book) => (
                <Box py={2}>
                  <BookInfo {...book} />
                </Box>
              )}
              style={{ width: '100%' }}
            />
          </VStack>
        ) : (
          <VStack w="100%">
            <Icon as={TbMoodSad} boxSize={16} color="description" />
            <Text textStyle="description" fontWeight="bold">
              本が見つかりませんでした
            </Text>
          </VStack>
        )}
        {/* eslint-enable no-nested-ternary */}
      </Collapse>
    </Box>
  )
);

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
              value={params.year_start}
              onChange={(e) =>
                setParams((currVal) => ({
                  ...currVal,
                  year_start: Number(e.target.value) || undefined,
                }))
              }
            />
            <Text>～</Text>
            <Input
              textStyle="title"
              rounded="lg"
              type="number"
              value={params.year_end}
              onChange={(e) =>
                setParams((currVal) => ({
                  ...currVal,
                  year_end: Number(e.target.value) || undefined,
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
