import React from 'react';
import type { classroom_v1 } from 'googleapis';
import { Link, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
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
        <Tag
          size="lg"
          variant="outline"
          rounded="full"
          layerStyle="button"
          as={Link}
          isExternal
          href={driveFile.driveFile?.alternateLink}
          _hover={{ textDecor: 'none' }}
        >
          <TagLeftIcon as={TbBrandGoogleDrive} />
          <TagLabel fontSize="sm" fontWeight="bold">
            {driveFile.driveFile?.title}
          </TagLabel>
        </Tag>
      );
    }
    if (youtubeVideo) {
      return (
        <Tag
          size="lg"
          variant="outline"
          rounded="full"
          layerStyle="button"
          as={Link}
          isExternal
          href={youtubeVideo.alternateLink}
          _hover={{ textDecor: 'none' }}
        >
          <TagLeftIcon as={TbBrandYoutube} />
          <TagLabel fontSize="sm" fontWeight="bold">
            {youtubeVideo.title}
          </TagLabel>
        </Tag>
      );
    }
    if (link) {
      return (
        <Tag
          size="lg"
          variant="outline"
          rounded="full"
          layerStyle="button"
          as={Link}
          isExternal
          href={link.url}
          _hover={{ textDecor: 'none' }}
        >
          <TagLeftIcon as={TbLink} />
          <TagLabel fontSize="sm" fontWeight="bold">
            {link.title}
          </TagLabel>
        </Tag>
      );
    }

    if (form) {
      return (
        <Tag
          size="lg"
          variant="outline"
          rounded="full"
          layerStyle="button"
          as={Link}
          isExternal
          href={form.formUrl}
          _hover={{ textDecor: 'none' }}
        >
          <TagLeftIcon as={TbReport} />
          <TagLabel fontSize="sm" fontWeight="bold">
            {form.title}
          </TagLabel>
        </Tag>
      );
    }

    return null;
  }
);

export default Material;
