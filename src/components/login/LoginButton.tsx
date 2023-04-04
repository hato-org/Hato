import React from 'react';
import { Button, ButtonProps, Icon } from '@chakra-ui/react';
import { TbBrandGoogle } from 'react-icons/tb';
import { useAuth } from '@/modules/auth';

const LoginButton = React.memo(
  ({ scopes, ...rest }: { scopes?: string[] } & ButtonProps) => {
    const { login, loginLoading } = useAuth(scopes);

    return (
      <Button
        isLoading={loginLoading}
        colorScheme="blue"
        rounded="lg"
        leftIcon={<Icon as={TbBrandGoogle} />}
        onClick={() => login()}
        {...rest}
      >
        Googleでログイン
      </Button>
    );
  }
);

export default LoginButton;
