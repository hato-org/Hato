import React from 'react';
import { Box, HStack, Icon, Link, Spacer, Text } from '@chakra-ui/react';
import { TbExternalLink } from 'react-icons/tb';
import { FaInstagram } from 'react-icons/fa';
import { getYouTubeID } from '@/utils/youtube';

const LiveStream = React.memo(({ type, name, url }: ClassmatchLiveStream) =>
  type === 'youtube' ? (
    <Box
      as="iframe"
      title={name}
      src={`https://youtube.com/embed/${getYouTubeID(url)}`}
      w="full"
      shadow="md"
      sx={{ aspectRatio: '16/9', rounded: 'xl' }}
    />
  ) : (
    <HStack
      p={4}
      w="full"
      color="gray.100"
      rounded="xl"
      as={Link}
      isExternal
      href={url}
      bgGradient="linear(to-r, #7928CA, #FF0080)"
      spacing={4}
    >
      <Icon as={FaInstagram} boxSize={6} />
      <Text
        color="gray.100"
        textStyle="title"
        _hover={{ textDecoration: 'none' }}
      >
        {name}
      </Text>
      <Spacer />
      <Icon as={TbExternalLink} boxSize={6} />
    </HStack>
  )
);

export default LiveStream;
