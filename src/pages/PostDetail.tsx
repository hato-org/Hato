import { HStack, Heading } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import Header from '@/components/nav/Header';
import BackButton from '@/components/layout/BackButton';
import Post from '@/components/posts/Post';
import BottomNavbar from '@/components/nav/BottomNavbar';

function PostDetail() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>投稿の詳細 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack w="100%" px={2}>
          <BackButton />
          <Heading size="md" py={4}>
            投稿の詳細
          </Heading>
        </HStack>
      </Header>
      <Post id={id!} />
      <BottomNavbar />
    </>
  );
}

export default PostDetail;
