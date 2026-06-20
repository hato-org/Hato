import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        bg: {
          '50': { value: '#f7f7f7' },
          '100': { value: '#eeeeee' },
          '200': { value: '#e2e2e2' },
          '300': { value: '#d0d0d0' },
          '400': { value: '#ababab' },
          '500': { value: '#8a8a8a' },
          '600': { value: '#636363' },
          '700': { value: '#505050' },
          '800': { value: '#323232' },
          '850': { value: '#202020' },
          '900': { value: '#121212' },
        },
      },
      fonts: {
        heading: {
          value: `-apple-system, Inter, "Noto Sans JP Variable", sans-serif`,
        },
        body: {
          value: `-apple-system, Inter, "Noto Sans JP Variable", sans-serif`,
        },
      },
    },
    semanticTokens: {
      colors: {
        title: {
          value: { base: '{colors.gray.700}', _dark: '{colors.gray.100}' },
        },
        description: {
          value: { base: '{colors.gray.500}', _dark: '{colors.gray.400}' },
        },
        bg: {
          value: { base: 'white', _dark: '{colors.bg.900}' },
        },
        bgAlpha: {
          value: {
            base: '{colors.whiteAlpha.800}',
            _dark: 'rgba(18, 18, 18, 0.8)',
          },
        },
        panel: {
          value: { base: 'white', _dark: '{colors.bg.850}' },
        },
        popover: {
          value: { base: 'white', _dark: '{colors.bg.800}' },
        },
        border: {
          value: { base: '{colors.bg.100}', _dark: '{colors.bg.800}' },
        },
        hover: {
          value: {
            base: '{colors.blackAlpha.100}',
            _dark: '{colors.whiteAlpha.100}',
          },
        },
        active: {
          value: {
            base: '{colors.blackAlpha.200}',
            _dark: '{colors.whiteAlpha.200}',
          },
        },
        success: {
          value: { base: '{colors.green.400}', _dark: '{colors.green.500}' },
        },
        warning: {
          value: { base: '{colors.yellow.400}', _dark: '{colors.yellow.500}' },
        },
        error: {
          value: { base: '{colors.red.400}', _dark: '{colors.red.500}' },
        },
        invalid: {
          value: { base: '{colors.red.100}', _dark: '{colors.red.800}' },
        },
        accent: {
          value: { base: '{colors.blue.50}', _dark: '{colors.blue.800}' },
        },
        'border-accent': {
          value: { base: '{colors.blue.300}', _dark: '{colors.blue.400}' },
        },
      },
    },
    textStyles: {
      title: {
        value: {
          fontWeight: 'bold',
          color: 'title',
        },
      },
      description: {
        value: {
          fontSize: 'sm',
          color: 'description',
        },
      },
      // v2 では layerStyle: 'button' を参照していたが、v3 では textStyle 内で
      // layerStyle を解決できないため button レイヤーのスタイルをインライン展開する。
      link: {
        value: {
          border: '1px solid transparent',
          transition: 'all .2s ease',
          rounded: 'md',
          px: 1,
          color: 'blue.500',
          textDecoration: 'underline',
          textUnderlineOffset: '4px',
          cursor: 'pointer',
          _hover: {
            bg: 'hover',
            cursor: 'pointer',
          },
          _active: {
            bg: 'active',
          },
        },
      },
    },
    layerStyles: {
      button: {
        value: {
          border: '1px solid transparent',
          transition: 'all .2s ease',
          _hover: {
            bg: 'hover',
            cursor: 'pointer',
          },
          _active: {
            bg: 'active',
          },
        },
      },
    },
  },
  globalCss: {
    'html, body': {
      color: 'title',
      bg: 'bg',
      WebkitTouchCallout: 'none',
      userSelect: 'none',
      fontWeight: 500,
      fontVariationSettings: '"wdth" 100, "wght" 600',
    },
  },
});

export const system = createSystem(defaultConfig, config);

// Backward-compatible aliases (default + named `theme`) for existing call sites.
export { system as theme };
export default system;
