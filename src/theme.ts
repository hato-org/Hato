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
    heading: `-apple-system, Inter, "Noto Sans JP", sans-serif`,
    body: `-apple-system, Inter, "Noto Sans JP", sans-serif`,
  },
  semanticTokens: {
    colors: {
      title: {
        default: 'gray.700',
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
      bgAlpha: {
        default: 'whiteAlpha.800',
        _dark: '#121212CC',
      },
      panel: {
        default: 'white',
        _dark: '#202020',
      },
      popover: {
        default: 'white',
        _dark: 'bg.800',
      },
      border: {
        default: 'bg.100',
        _dark: 'bg.800',
      },
      hover: {
        default: 'blackAlpha.100',
        _dark: 'whiteAlpha.100',
      },
      active: {
        default: 'blackAlpha.200',
        _dark: 'whiteAlpha.200',
      },
      accent: {
        default: 'blue.50',
        _dark: 'blue.800',
      },
      'border-accent': {
        default: 'blue.300',
        _dark: 'blue.400',
      },
    },
  },
  styles: {
    global: {
      'html, body': {
        color: 'title',
        bg: 'bg',
        '-webkit-touch-callout': 'none',
        userSelect: 'none',
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
      layerStyle: 'button',
      rounded: 'md',
      px: 1,
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
      _active: {
        bg: 'active',
      },
    },
  },
  config,
});

export default theme;
