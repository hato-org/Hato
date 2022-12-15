import { Box, Center, Skeleton, Text } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { Virtuoso } from 'react-virtuoso';
import BookInfo from './BookInfo';
import { libraryBookmarkAtom } from '@/store/library';
import { useBookInfo } from '@/hooks/library';

export default function Bookmarks() {
  const bookmarks = useRecoilValue(libraryBookmarkAtom);

  return (
    <Center w="100%" pt={2} px={4} mb={24}>
      {bookmarks.length ? (
        <Virtuoso
          useWindowScroll
          data={bookmarks}
          itemContent={(index, isbn) => (
            <Box py={2}>
              <BookInfoAsync isbn={isbn} />
            </Box>
          )}
          style={{ width: '100%' }}
        />
      ) : (
        <Text textStyle="description" fontWeight="bold">
          ブックマークした本がありません
        </Text>
      )}
    </Center>
  );
}

function BookInfoAsync({ isbn }: { isbn: string }) {
  const { data, isLoading } = useBookInfo(isbn);

  console.log(data);
  return (
    <Skeleton
      w="100%"
      h={isLoading ? 20 : undefined}
      rounded="xl"
      isLoaded={!isLoading}
    >
      {data && <BookInfo {...data} />}
    </Skeleton>
  );
}
