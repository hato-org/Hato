import React from 'react';
import { chakra, HStack, Icon, Link, Spacer, Text } from '@chakra-ui/react';
import { TbExternalLink } from 'react-icons/tb';
import { FaInstagram } from 'react-icons/fa';
import { getYouTubeID } from '@/utils/youtube';

const LiveStream = React.memo(({ type, name, url }: ClassmatchLiveStream) =>
  type === 'youtube' ? (
    <chakra.iframe
      title={name}
      src={`https://youtube.com/embed/${getYouTubeID(url)}`}
      w="full"
      shadow="md"
      aspectRatio={16 / 9}
      rounded="xl"
    />
  ) : (
    <HStack
      p={4}
      w="full"
      color="gray.100"
      rounded="xl"
      asChild
      bgGradient="to-r"
      gradientFrom="#7928CA"
      gradientTo="#FF0080"
      gap={4}
    >
      <Link target="_blank" rel="noreferrer" href={url}>
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
      </Link>
    </HStack>
  ),
);
LiveStream.displayName = 'LiveStream';

export default LiveStream;
