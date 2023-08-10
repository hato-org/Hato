import React, { useMemo } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Center,
  Collapse,
  HStack,
  Icon,
  Skeleton,
  Spacer,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { TbChevronDown } from 'react-icons/tb';
import { useDiainfo } from '@/hooks/transit';
import Error from '../cards/Error';

const DiaStatus = React.memo(() => {
  const { data, isLoading, error } = useDiainfo();

  const unstableLines = useMemo(
    () => data?.filter((diaInfo) => diaInfo.status.code !== 'normal') ?? [],
    [data]
  );

  const isAllUnstable = useMemo(
    () => !!(data && data?.length === unstableLines?.length),
    [data, unstableLines]
  );

  return (
    <VStack w="full" align="flex-start">
      <Text textStyle="title" fontSize="lg">
        運転状況
      </Text>
      <Skeleton w="100%" minH={8} rounded="xl" isLoaded={!isLoading}>
        <Center w="full">
          {/* eslint-disable no-nested-ternary */}
          {error ? (
            <Error error={error} />
          ) : unstableLines?.length ? (
            <UnstableInfo
              unstableLines={unstableLines}
              isAllUnstable={isAllUnstable}
            />
          ) : (
            <Text textStyle="description" fontSize="lg" fontWeight="bold">
              全路線平常運転
            </Text>
          )}
          {/* eslint-enable no-nested-ternary */}
        </Center>
      </Skeleton>
    </VStack>
  );
});

const UnstableInfo = React.memo(
  ({
    isAllUnstable,
    unstableLines,
  }: {
    isAllUnstable: boolean;
    unstableLines: DiaInfo[];
  }) => {
    const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

    return (
      <Alert
        // bg='transparent'
        status={isAllUnstable ? 'error' : 'warning'}
        rounded="xl"
        onClick={onToggle}
        _hover={{ cursor: 'pointer' }}
      >
        <VStack w="full" spacing={0}>
          <HStack w="full">
            <AlertIcon mr={0} />
            <Text textStyle="title">
              {isAllUnstable ? '大規模な障害あり' : '一部路線に情報あり'}
            </Text>
            <Spacer />
            <Icon
              as={TbChevronDown}
              transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
              transition="all .2s ease"
            />
          </HStack>
          <Box w="full">
            <Collapse in={isOpen}>
              <VStack mt={4} w="full" align="flex-start">
                {unstableLines.map((diaInfo) => (
                  <LineInfo key={diaInfo.lineInfo.kana} diaInfo={diaInfo} />
                ))}
              </VStack>
            </Collapse>
          </Box>
        </VStack>
      </Alert>
    );
  }
);

const LineInfo = React.memo(({ diaInfo }: { diaInfo: DiaInfo }) => {
  const borderColor = (() => {
    switch (diaInfo.status.code) {
      case 'suspend':
        return 'red.400';
      case 'trouble':
        return 'yellow.400';
      case 'normal':
        return 'green.400';
      default:
        return 'blue.400';
    }
  })();

  return (
    <HStack w="full">
      <StackDivider borderWidth={2} borderColor={borderColor} rounded="full" />
      <Text textStyle="title">{diaInfo.lineInfo.name}</Text>
      <Spacer />
      <Text textStyle="description" fontWeight="bold" noOfLines={1}>
        {diaInfo.status.text}
      </Text>
    </HStack>
  );
});

export default DiaStatus;
