import { chakra, Center, Icon, ChakraProps } from '@chakra-ui/react';
import { TbArrowNarrowDown } from 'react-icons/tb';
import PullToRefresh from 'react-simple-pull-to-refresh';
import Loading from '../common/Loading';

const CPullToRefresh = chakra(PullToRefresh);

type ChakraPullToRefreshProps = Parameters<typeof PullToRefresh>[0] &
  ChakraProps;

function ChakraPullToRefresh({
  children,
  onRefresh,
  ...rest
}: ChakraPullToRefreshProps) {
  return (
    <CPullToRefresh
      onRefresh={onRefresh}
      maxPullDownDistance={Infinity}
      resistance={2.5}
      refreshingContent={<Loading />}
      pullingContent={
        <Center flexGrow={1} p={4}>
          <Icon as={TbArrowNarrowDown} w={6} h={6} color="gray.500" />
        </Center>
      }
      {...rest}
    >
      {children}
    </CPullToRefresh>
  );
}

export default ChakraPullToRefresh;
