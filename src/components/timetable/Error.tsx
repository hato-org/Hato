import { Button, Center, Icon, Text, VStack } from '@chakra-ui/react';
import { TbAlertCircle } from 'react-icons/tb';
import { Link as RouterLink } from 'react-router-dom';

type ErrorProps =
  | {
      type: 'userScheduleNotSet';
      onOpen?: never;
    }
  | {
      type: 'divisionNotSet';
      onOpen: () => void;
    };

function Error({ type, onOpen }: ErrorProps) {
  switch (type) {
    case 'divisionNotSet':
      return (
        <Center w="100%">
          <VStack>
            <Icon as={TbAlertCircle} w={16} h={16} color="yellow.500" />
            <Text textStyle="title">まだ日課が設定されていません。</Text>
            <Button rounded="lg" colorScheme="blue" onClick={onOpen}>
              設定する
            </Button>
          </VStack>
        </Center>
      );
      break;

    case 'userScheduleNotSet':
      return (
        <Center w="100%">
          <VStack>
            <Icon as={TbAlertCircle} w={16} h={16} color="yellow.500" />
            <Text textAlign="center" textStyle="title">
              時間割が設定されていません。
              <br />
              <Text as={RouterLink} to="/timetable/editor" textStyle="link">
                設定ページ
              </Text>
              から、マイ時間割を作成
              <br />
              または設定してください。
            </Text>
          </VStack>
        </Center>
      );
      break;

    default:
      return (
        <Center w="100%">
          <VStack>
            <Icon as={TbAlertCircle} w={16} h={16} color="yellow.500" />
            <Text textStyle="title" align="center">
              エラーが発生しました。
              <br />
              原因不明のため、再起動をお試しください。
            </Text>
          </VStack>
        </Center>
      );
      break;
  }
}

export default Error;
