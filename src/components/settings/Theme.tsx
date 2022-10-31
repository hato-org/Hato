import { Heading, Switch, useColorMode, VStack } from '@chakra-ui/react';
import { MotionCenter } from '../motion';
import SettingButton from './Button';

function Theme() {
  const { colorMode, toggleColorMode } = useColorMode();

  const list = [
    {
      label: 'ダークテーマ',
      description: 'ダークテーマを有効にするか。',
      children: (
        <Switch
          size="lg"
          isChecked={colorMode === 'dark'}
          onChange={toggleColorMode}
        />
      ),
    },
  ];

  return (
    <MotionCenter
      w="100%"
      initial={{ x: '100vw', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100vw', opacity: 0 }}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.4,
      }}
      layout
    >
      <VStack spacing={4} align="flex-start" w="100%">
        <Heading size="lg">画面表示</Heading>
        {list.map((elem) => (
          <SettingButton {...elem} key={elem.label} />
        ))}
      </VStack>
    </MotionCenter>
  );
}

export default Theme;
