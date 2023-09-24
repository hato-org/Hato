import {
  HStack,
  Heading,
  Box,
  Spacer,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { TbPin, TbPinFilled } from 'react-icons/tb';
import { useRecoilState } from 'recoil';
import Header from '@/components/nav/Header';
import BackButton from '@/components/layout/BackButton';
import Post from '@/components/posts/Post';
import { pinnedPostAtom } from '@/store/posts';

function PostDetail() {
  const { id } = useParams();
  const [pinned, setPinned] = useRecoilState(pinnedPostAtom);

  const isPinned = pinned.includes(id ?? '');

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
          <Spacer />
          <IconButton
            aria-label="pin"
            icon={
              <Icon
                color={isPinned ? 'blue.400' : undefined}
                as={isPinned ? TbPinFilled : TbPin}
                boxSize={6}
              />
            }
            size="lg"
            variant="ghost"
            isRound
            onClick={() =>
              id &&
              setPinned((currVal) =>
                isPinned
                  ? currVal.filter((postId) => postId !== id)
                  : [...currVal, id],
              )
            }
          />
        </HStack>
      </Header>
      <Post id={id!} />
    </Box>
  );
}

export default PostDetail;
