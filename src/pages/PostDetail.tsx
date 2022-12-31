import { HStack, Heading, Box } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import Header from '@/components/nav/Header';
import BackButton from '@/components/layout/BackButton';
import Post from '@/components/posts/Post';

function PostDetail() {
  const { id } = useParams();

  return (
    <Box>
      <Helmet>
        <title>投稿の詳細 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack w="100%">
          <BackButton />
          <Heading size="md" py={4}>
            投稿の詳細
          </Heading>
        </HStack>
      </Header>
      <Post id={id!} />
    </Box>
  );
}

export default PostDetail;
