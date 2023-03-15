import React from 'react';
import { Button, Icon } from '@chakra-ui/react';
import { TbBrandGoogle } from 'react-icons/tb';
import { useAuth } from '@/modules/auth';

const LoginButton = React.memo(({ scopes }: { scopes?: string[] }) => {
  const { login, loginLoading } = useAuth(scopes);

  return (
    <Button
      isLoading={loginLoading}
      colorScheme="blue"
      rounded="lg"
      leftIcon={<Icon as={TbBrandGoogle} />}
      onClick={() => login()}
    >
      Googleでログイン
    </Button>
  );
});

export default LoginButton;
