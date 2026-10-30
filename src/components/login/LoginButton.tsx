import React from 'react';
import { Button, Icon } from '@chakra-ui/react';
import { TbBrandGoogle } from 'react-icons/tb';
import { useAuth } from '@/modules/auth';

const LoginButton = React.memo(({ scopes }: { scopes?: string[] }) => {
  const { login, loginLoading } = useAuth(scopes);

  return (
    <Button
      loading={loginLoading}
      colorPalette="blue"
      rounded="lg"
      onClick={() => login()}
    >
      {<Icon as={TbBrandGoogle} />}
      Googleでログイン
    </Button>
  );
});
LoginButton.displayName = 'LoginButton';

export default LoginButton;
