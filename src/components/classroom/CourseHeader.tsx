import React from 'react';
import { Text, VStack } from '@chakra-ui/react';
import { useGCCourseInfo } from '@/services/classroom';
import { useStringHSLColor } from '@/hooks/common/color';

const CourseHeader = React.memo(({ courseId }: { courseId?: string }) => {
  const { data } = useGCCourseInfo(courseId);
  const bgColor = useStringHSLColor(window.btoa(courseId ?? ''));

  return (
    <VStack
      p={4}
      pt={8}
      spacing={0}
      rounded="xl"
      align="flex-start"
      w="full"
      bg={bgColor}
    >
      <Text
        fontSize={{ base: '2xl', md: '3xl' }}
        textStyle="title"
        color="white"
        textShadow="1px 1px 5px var(--chakra-colors-blackAlpha-400);"
      >
        {data?.name}
      </Text>
      <Text
        color="white"
        fontSize="sm"
        textShadow="1px 1px 5px var(--chakra-colors-blackAlpha-400);"
      >
        {data?.section}
      </Text>
    </VStack>
  );
});

export default CourseHeader;
