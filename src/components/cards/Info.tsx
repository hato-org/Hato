import { Center, VStack, Icon, Text, StackDivider } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TbBulb, TbInfoCircle } from 'react-icons/tb';

function Info({ info }: { info: string }) {
  switch (info) {
    case 'setAccountInfo':
      return (
        <Center w="100%">
          <VStack w="100%">
            <Icon as={TbInfoCircle} w={16} h={16} color="blue.500" />
            <Text textStyle="title" align="center">
              学年・クラス等の情報を
              <Text as={RouterLink} to="/settings/account" textStyle="link">
                設定
              </Text>
              してください。
            </Text>
            <StackDivider />
            <Icon as={TbBulb} w={16} h={16} color="yellow.500" />
            <Text textStyle="title" textAlign="center">
              「ホーム画面に追加」すると、
              <br />
              より便利に使えるようになります
            </Text>
          </VStack>
        </Center>
      );

    default:
      break;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

export default Info;
