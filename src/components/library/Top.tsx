import { useMemo } from 'react';
import { Center, VStack, Icon } from '@chakra-ui/react';
import { TbSearch, TbBookmark } from 'react-icons/tb';
import LibraryCategoryButton from './Button';

export default function Top() {
  const links = useMemo(
    () => [
      {
        label: '蔵書検索',
        description: '図書館にある本を検索できます。',
        icon: <Icon as={TbSearch} boxSize={6} />,
        href: 'search',
      },
      {
        label: 'ブックマーク',
        description: 'ブックマークした本のリスト。',
        icon: <Icon as={TbBookmark} boxSize={6} />,
        href: 'bookmarks',
      },
    ],
    []
  );

  return (
    <Center w="100%" pt={2} px={4} mb={24}>
      <VStack w="100%">
        {links.map((link) => (
          <LibraryCategoryButton key={link.label} {...link} />
        ))}
      </VStack>
    </Center>
  );
}
