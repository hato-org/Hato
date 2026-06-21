import React from 'react';
import type { classroom_v1 } from 'googleapis';
import { Icon, Link, Text } from '@chakra-ui/react';
import { Tag } from '@/components/ui/tag';
import {
  TbBrandGoogleDrive,
  TbBrandYoutube,
  TbLink,
  TbReport,
} from 'react-icons/tb';

const Material = React.memo(
  ({ driveFile, youtubeVideo, form, link }: classroom_v1.Schema$Material) => {
    if (driveFile) {
      return (
        <Link
          target="_blank" rel="noreferrer"
          href={driveFile.driveFile?.alternateLink ?? ''}
          _hover={{ textDecor: 'none' }}
        >
          <Tag
            size="lg"
            variant="outline"
            rounded="full"
            layerStyle="button"
            startElement={<Icon as={TbBrandGoogleDrive} />}
          >
            <Text as="span" fontSize="sm" fontWeight="bold">
              {driveFile.driveFile?.title}
            </Text>
          </Tag>
        </Link>
      );
    }
    if (youtubeVideo) {
      return (
        <Link
          target="_blank" rel="noreferrer"
          href={youtubeVideo.alternateLink ?? ''}
          _hover={{ textDecor: 'none' }}
        >
          <Tag
            size="lg"
            variant="outline"
            rounded="full"
            layerStyle="button"
            startElement={<Icon as={TbBrandYoutube} />}
          >
            <Text as="span" fontSize="sm" fontWeight="bold">
              {youtubeVideo.title}
            </Text>
          </Tag>
        </Link>
      );
    }
    if (link) {
      return (
        <Link
          target="_blank" rel="noreferrer"
          href={link.url ?? ''}
          _hover={{ textDecor: 'none' }}
        >
          <Tag
            size="lg"
            variant="outline"
            rounded="full"
            layerStyle="button"
            startElement={<Icon as={TbLink} />}
          >
            <Text as="span" fontSize="sm" fontWeight="bold">
              {link.title}
            </Text>
          </Tag>
        </Link>
      );
    }

    if (form) {
      return (
        <Link
          target="_blank" rel="noreferrer"
          href={form.formUrl ?? ''}
          _hover={{ textDecor: 'none' }}
        >
          <Tag
            size="lg"
            variant="outline"
            rounded="full"
            layerStyle="button"
            startElement={<Icon as={TbReport} />}
          >
            <Text as="span" fontSize="sm" fontWeight="bold">
              {form.title}
            </Text>
          </Tag>
        </Link>
      );
    }

    return null;
  },
);
Material.displayName = 'Material';

export default Material;
