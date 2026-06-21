import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Collapsible,
  Field,
  HStack,
  Icon,
  Input,
  Skeleton,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useSearchParams } from 'react-router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Virtuoso } from 'react-virtuoso';
import { TbMoodSad } from 'react-icons/tb';
import { librarySearchAtom } from '@/store/library';
import Card from '../layout/Card';
import { useLibrarySearch } from '@/services/library';
import BookInfo from './BookInfo';
import Loading from '../common/Loading';

export default function Search() {
  const { free, ...params } = useAtomValue(librarySearchAtom);
  const [searchParams, setSearchParams] = useSearchParams();
  const setParams = useSetAtom(librarySearchAtom);
  const { mutate, data, isPending } = useLibrarySearch({
    onMutate: (type) => {
      [...searchParams.keys()].forEach((key) => searchParams.delete(key));
      if (type === 'free') {
        searchParams.set('free', free ?? '');
      } else {
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.set(key, String(value));
        });
      }
      setSearchParams(searchParams, { replace: true });
    },
  });
  const defaultIndex =
    [...searchParams.entries()].length && !searchParams.has('free') ? 1 : 0;
  const category: ['free', 'detail'] = useMemo(() => ['free', 'detail'], []);
  const [selected, setSelected] = useState<'free' | 'detail'>(
    category[defaultIndex],
  );

  useEffect(() => {
    if ([...searchParams.entries()].length) {
      searchParams.forEach((value, key) => {
        setParams((currVal) => ({ ...currVal, [key]: value }));
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <VStack pt={2} px={4} mb={24} w="100%" gap={8}>
      <Card p={0} w="100%" overflow="hidden">
        <VStack>
          <Tabs.Root
            w="100%"
            fitted
            size="lg"
            value={selected}
            onValueChange={(e) => setSelected(e.value as 'free' | 'detail')}
          >
            <Tabs.List>
              <Tabs.Trigger
                value="free"
                textStyle="title"
                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
              >
                フリーワード
              </Tabs.Trigger>
              <Tabs.Trigger
                value="detail"
                textStyle="title"
                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
              >
                詳細検索
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="free" w="100%">
              <FreeSearch onSubmit={() => mutate('free')} />
            </Tabs.Content>
            <Tabs.Content value="detail" w="100%">
              <DetailSearch onSubmit={() => mutate('detail')} />
            </Tabs.Content>
          </Tabs.Root>
          <Box w="100%" px={4} pb={4}>
            <Button
              w="100%"
              colorScheme="blue"
              rounded="lg"
              onClick={() => mutate(selected, {})}
              loading={isPending}
            >
              検索
            </Button>
          </Box>
        </VStack>
      </Card>
      <SearchResult result={data} isLoading={isPending} />
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
      <Collapsible.Root open={!!result || isLoading}><Collapsible.Content>
        {isLoading ? (
          <Loading />
        ) : result?.count ? (
          <VStack w="100%" h="100%" gap={4}>
            {result?.messages.length && (
              <Alert.Root status="info" rounded="xl" shadow="xl">
                <Alert.Indicator />
                <Alert.Content>
                  <VStack align="flex-start" gap={1}>
                    {result.messages.map((message) => (
                      <Text key={message} textStyle="title">
                        {message}
                      </Text>
                    ))}
                  </VStack>
                </Alert.Content>
              </Alert.Root>
            )}
            <HStack w="100%" px={2}>
              <Skeleton loading={isLoading} rounded="lg" w={24}>
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
          <VStack w="100%" gap={4}>
            {result?.messages.length && (
              <Alert.Root status="info" rounded="xl" shadow="xl">
                <Alert.Indicator />
                <Alert.Content>
                  <VStack align="flex-start" gap={1}>
                    {result.messages.map((message) => (
                      <Text key={message} textStyle="title">
                        {message}
                      </Text>
                    ))}
                  </VStack>
                </Alert.Content>
              </Alert.Root>
            )}
            <Icon as={TbMoodSad} boxSize={16} color="description" />
            <Text textStyle="description" fontWeight="bold">
              本が見つかりませんでした
            </Text>
          </VStack>
        )}
      </Collapsible.Content></Collapsible.Root>
    </Box>
  ),
);
SearchResult.displayName = 'SearchResult';

function FreeSearch({ onSubmit }: { onSubmit: () => void }) {
  const [params, setParams] = useAtom(librarySearchAtom);

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
  const [params, setParams] = useAtom(librarySearchAtom);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <VStack>
        <Field.Root>
          <Field.Label>タイトル</Field.Label>
          <Input
            textStyle="title"
            rounded="lg"
            value={params.title}
            onChange={(e) =>
              setParams((currVal) => ({ ...currVal, title: e.target.value }))
            }
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>著者名</Field.Label>
          <Input
            textStyle="title"
            rounded="lg"
            value={params.author}
            onChange={(e) =>
              setParams((currVal) => ({ ...currVal, author: e.target.value }))
            }
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>出版者</Field.Label>
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
        </Field.Root>
        <Field.Root>
          <Field.Label>分類</Field.Label>
          <Input
            textStyle="title"
            rounded="lg"
            value={params.ndc}
            onChange={(e) =>
              setParams((currVal) => ({ ...currVal, ndc: e.target.value }))
            }
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>出版年</Field.Label>
          <HStack>
            <Input
              textStyle="title"
              rounded="lg"
              type="number"
              value={params.year_start || ''}
              onChange={(e) =>
                setParams((currVal) => ({
                  ...currVal,
                  year_start: e.target.value,
                }))
              }
            />
            <Text>～</Text>
            <Input
              textStyle="title"
              rounded="lg"
              type="number"
              value={params.year_end || ''}
              onChange={(e) =>
                setParams((currVal) => ({
                  ...currVal,
                  year_end: e.target.value,
                }))
              }
            />
          </HStack>
        </Field.Root>
        <Field.Root>
          <Field.Label>ISBN</Field.Label>
          <Input
            textStyle="title"
            rounded="lg"
            value={params.isbn}
            onChange={(e) =>
              setParams((currVal) => ({ ...currVal, isbn: e.target.value }))
            }
          />
        </Field.Root>
      </VStack>
    </form>
  );
}
