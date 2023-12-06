import { Box, Center, Heading, HStack, Text } from '@chakra-ui/react';
import { Virtuoso } from 'react-virtuoso';
import { useAtomValue } from 'jotai';
import { Helmet } from 'react-helmet-async';
import BackButton from '@/components/layout/BackButton';
import Header from '@/components/nav/Header';
import { GCBookmarkAtom } from '@/store/classroom';
import { AsyncPost } from '@/components/classroom/Post';

export default function ClassroomBookmarks() {
  const bookmarks = useAtomValue(GCBookmarkAtom);

  return (
    <Box>
      <Helmet>
        <title>ブックマーク - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack>
          <BackButton />
          <Heading size="md" py={4}>
            ブックマーク
          </Heading>
        </HStack>
      </Header>
      <Center p={4}>
        {bookmarks.length ? (
          <Virtuoso
            style={{ width: '100%' }}
            data={bookmarks}
            itemContent={(index, bookmark) => (
              <Box py={4}>
                <AsyncPost {...bookmark} />
              </Box>
            )}
            useWindowScroll
          />
        ) : (
          <Text textStyle="description" fontWeight="bold">
            ブックマークした投稿がありません
          </Text>
        )}
      </Center>
    </Box>
  );
}
