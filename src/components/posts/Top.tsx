import { VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { TbFile } from 'react-icons/tb';
import PostCategoryButton from './Button';

function Top() {
  const categories = useMemo(
    () => [
      {
        label: '教科通信',
        description: '各教科からのお知らせです。',
        icon: TbFile,
        href: 'subj-news',
      },
      {
        label: 'テスト範囲',
        description: 'テスト範囲のお知らせです。',
        icon: TbFile,
        href: 'exam-news',
      },
      {
        label: '学年だより',
        description: '学年だよりです。',
        icon: TbFile,
        href: 'class-news',
      },
      {
        label: '月歴',
        description: '月歴です。',
        icon: TbFile,
        href: 'monthly-calendar',
      },
      {
        label: '学校外連絡',
        description: '学校外からのお知らせです。',
        icon: TbFile,
        href: 'public-news',
      },
    ],
    []
  );

  return (
    <VStack w="100%" p={4}>
      {categories.map((category) => (
        <PostCategoryButton {...category} />
      ))}
      {/* <PostCategoryButton label='教科通信' description="各教科からのお知らせです。" icon={TbFile} /> */}
    </VStack>
  );
}

export default Top;
