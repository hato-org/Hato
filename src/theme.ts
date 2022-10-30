import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  semanticTokens: {
    colors: {
      title: {
        default: 'gray.600',
        _dark: 'gray.100',
      },
      description: {
        default: 'gray.500',
        _dark: 'gray.200',
      },
      bg: {
        default: '#fff',
        _dark: '#121212',
      },
    },
  },
  styles: {
    global: {
      'html, body': {
        color: 'gray.600',
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
    },
  },
  layerStyles: {
    button: {
      border: '1px solid transparent',
      transition: 'all .2s ease',
      _hover: {
        bg: 'gray.100',
        // borderColor: 'gray.100',
        cursor: 'pointer',
      },
    },
  },
});

export default theme;
