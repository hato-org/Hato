import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

const colors = {
  bg: {
    '50': '#f7f7f7',
    '100': '#eeeeee',
    '200': '#e2e2e2',
    '300': '#d0d0d0',
    '400': '#ababab',
    '500': '#8a8a8a',
    '600': '#636363',
    '700': '#505050',
    '800': '#323232',
    '900': '#121212',
  },
};

const theme = extendTheme({
  colors,
  fonts: {
    body: `"Noto Sans JP", sans-serif`,
  },
  semanticTokens: {
    colors: {
      title: {
        default: 'gray.600',
        _dark: 'gray.100',
      },
      description: {
        default: 'gray.500',
        _dark: 'gray.300',
      },
      bg: {
        default: 'white',
        _dark: 'bg.900',
      },
      panel: {
        default: 'white',
        _dark: '#202020',
      },
      border: {
        default: 'bg.50',
        _dark: 'transparent',
      },
      hover: {
        default: 'blackAlpha.100',
        _dark: 'whiteAlpha.100',
      },
    },
  },
  styles: {
    global: {
      'html, body': {
        color: 'title',
        bg: 'bg',
      },
    },
  },
  textStyles: {
    title: {
      fontWeight: 'bold',
      color: 'title',
    },
    description: {
      fontSize: 'sm',
      color: 'description',
    },
    link: {
      color: 'blue.500',
      textDecoration: 'underline',
      textUnderlineOffset: '4px',
      cursor: 'pointer',
    },
  },
  layerStyles: {
    button: {
      border: '1px solid transparent',
      transition: 'all .2s ease',
      _hover: {
        bg: 'hover',
        // borderColor: 'gray.100',
        cursor: 'pointer',
      },
    },
  },
  config,
});

export default theme;
