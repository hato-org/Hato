import { Button, ButtonProps } from '@chakra-ui/react';

function FloatButton({ children, ...rest }: ButtonProps) {
  return (
    <Button
      position="fixed"
      right={0}
      bottom="env(safe-area-inset-bottom)"
      shadow="xl"
      rounded="full"
      {...rest}
    >
      {children}
    </Button>
  );
}

export default FloatButton;
