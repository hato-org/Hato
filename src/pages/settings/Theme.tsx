import { Switch, useColorMode, VStack } from '@chakra-ui/react';
import { MotionCenter } from '@/components/motion';
import SettingButton from './Button';
import SettingCategory from './Category';

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
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{
        duration: 0.2,
        type: 'spring',
        damping: 25,
        stiffness: 180,
      }}
      layout
    >
      <VStack spacing={4} align="flex-start" w="100%">
        <SettingCategory title="画面表示">
          {list.map((elem) => (
            <SettingButton {...elem} key={elem.label} />
          ))}
        </SettingCategory>
      </VStack>
    </MotionCenter>
  );
}

export default Theme;
