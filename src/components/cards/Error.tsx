import { Center, Icon, Text, VStack } from '@chakra-ui/react';
import { TbAlertCircle } from 'react-icons/tb';
import { AxiosError } from 'axios';
import { Link as RouterLink } from 'react-router-dom';

interface ErrorProps {
  error?: AxiosError;
}

function Error({ error = new AxiosError() }: ErrorProps) {
  switch (error.response?.status) {
    case 400:
      return (
        <Center w="100%">
          <VStack>
            <Icon as={TbAlertCircle} w={16} h={16} color="yellow.500" />
            <Text fontSize="sm" color="gray.400" align="center">
              {error.message}
              <br />
              {error.response.statusText}
            </Text>
            <Text textStyle="title" align="center">
              データの取得に失敗しました。
              <br />
              学年・クラス・コースを
              <Text as={RouterLink} to="/settings/account" textStyle="link">
                設定
              </Text>
              してください。
            </Text>
          </VStack>
        </Center>
      );
      break;

    case 401:
      return (
        <Center w="100%">
          <VStack>
            <Icon as={TbAlertCircle} w={16} h={16} color="yellow.500" />
            <Text fontSize="sm" color="gray.400" align="center">
              {error.message}
              <br />
              {error.response.statusText}
            </Text>
            <Text textStyle="title" align="center">
              データの取得に失敗しました。
              <br />
              ログインし直してみてください。
            </Text>
          </VStack>
        </Center>
      );
      break;

    case 429:
      return (
        <Center w="100%">
          <VStack>
            <Icon as={TbAlertCircle} w={16} h={16} color="yellow.500" />
            <Text fontSize="sm" color="gray.400" align="center">
              {error.message}
              <br />
              {error.response.statusText}
            </Text>
            <Text textStyle="title" align="center">
              データの取得に失敗しました。
              <br />
              更新頻度が高すぎます。
            </Text>
          </VStack>
        </Center>
      );
      break;

    case 500:
      return (
        <Center w="100%">
          <VStack>
            <Icon as={TbAlertCircle} w={16} h={16} color="red.500" />
            <Text fontSize="sm" color="gray.400" align="center">
              {error.message}
              <br />
              {error.response.statusText}
            </Text>
            <Text textStyle="title" align="center">
              データの取得に失敗しました。
              <br />
              しばらくしてからもう一度お試しください。
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
            <Text fontSize="sm" color="gray.400" align="center">
              {error?.message}
              <br />
              {error?.response?.statusText}
            </Text>
            <Text textStyle="title" align="center">
              データの取得に失敗しました。
            </Text>
          </VStack>
        </Center>
      );
      break;
  }
}

export default Error;
