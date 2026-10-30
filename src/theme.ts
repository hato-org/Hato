import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

/**
 * Chakra v2 のカラーパレット (v3 では Tailwind 系に変更されたため、
 * v2 当時の見た目を維持する目的で使用色のみ移植)
 */
const v2Palettes = {
  gray: {
    '50': { value: '#F7FAFC' },
    '100': { value: '#EDF2F7' },
    '200': { value: '#E2E8F0' },
    '300': { value: '#CBD5E0' },
    '400': { value: '#A0AEC0' },
    '500': { value: '#718096' },
    '600': { value: '#4A5568' },
    '700': { value: '#2D3748' },
    '800': { value: '#1A202C' },
    '900': { value: '#171923' },
    '950': { value: '#0f1117' },
  },
  red: {
    '50': { value: '#FFF5F5' },
    '100': { value: '#FED7D7' },
    '200': { value: '#FEB2B2' },
    '300': { value: '#FC8181' },
    '400': { value: '#F56565' },
    '500': { value: '#E53E3E' },
    '600': { value: '#C53030' },
    '700': { value: '#9B2C2C' },
    '800': { value: '#822727' },
    '900': { value: '#63171B' },
    '950': { value: '#4a1114' },
  },
  orange: {
    '50': { value: '#FFFAF0' },
    '100': { value: '#FEEBC8' },
    '200': { value: '#FBD38D' },
    '300': { value: '#F6AD55' },
    '400': { value: '#ED8936' },
    '500': { value: '#DD6B20' },
    '600': { value: '#C05621' },
    '700': { value: '#9C4221' },
    '800': { value: '#7B341E' },
    '900': { value: '#652B19' },
    '950': { value: '#4c2013' },
  },
  yellow: {
    '50': { value: '#FFFFF0' },
    '100': { value: '#FEFCBF' },
    '200': { value: '#FAF089' },
    '300': { value: '#F6E05E' },
    '400': { value: '#ECC94B' },
    '500': { value: '#D69E2E' },
    '600': { value: '#B7791F' },
    '700': { value: '#975A16' },
    '800': { value: '#744210' },
    '900': { value: '#5F370E' },
    '950': { value: '#48290a' },
  },
  green: {
    '50': { value: '#F0FFF4' },
    '100': { value: '#C6F6D5' },
    '200': { value: '#9AE6B4' },
    '300': { value: '#68D391' },
    '400': { value: '#48BB78' },
    '500': { value: '#38A169' },
    '600': { value: '#2F855A' },
    '700': { value: '#276749' },
    '800': { value: '#22543D' },
    '900': { value: '#1C4532' },
    '950': { value: '#153426' },
  },
  blue: {
    '50': { value: '#ebf8ff' },
    '100': { value: '#bee3f8' },
    '200': { value: '#90cdf4' },
    '300': { value: '#63b3ed' },
    '400': { value: '#4299e1' },
    '500': { value: '#3182ce' },
    '600': { value: '#2b6cb0' },
    '700': { value: '#2c5282' },
    '800': { value: '#2a4365' },
    '900': { value: '#1A365D' },
    '950': { value: '#132743' },
  },
  pink: {
    '50': { value: '#FFF5F7' },
    '100': { value: '#FED7E2' },
    '200': { value: '#FBB6CE' },
    '300': { value: '#F687B3' },
    '400': { value: '#ED64A6' },
    '500': { value: '#D53F8C' },
    '600': { value: '#B83280' },
    '700': { value: '#97266D' },
    '800': { value: '#702459' },
    '900': { value: '#521B41' },
    '950': { value: '#3d1430' },
  },
};

/**
 * v2 の solid ボタン配色 (light: 500/白文字, dark: 200/黒文字) を
 * v3 の colorPalette セマンティックトークンとして再現
 */
const v2SolidTokens = Object.fromEntries(
  ['blue', 'red', 'green', 'orange', 'yellow', 'pink'].map((c) => [
    c,
    {
      // default 側が _light 条件で定義しているため、base ではなく _light で
      // 上書きしないとマージ後に default の値が勝ってしまう
      solid: {
        value: { _light: `{colors.${c}.500}`, _dark: `{colors.${c}.200}` },
      },
      contrast: {
        value: { _light: 'white', _dark: '{colors.gray.800}' },
      },
    },
  ]),
);

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        ...v2Palettes,
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
        ...v2SolidTokens,
        // v2 のデフォルト (colorScheme=gray solid) ボタン配色
        gray: {
          solid: {
            value: {
              _light: '{colors.gray.100}',
              _dark: '{colors.whiteAlpha.200}',
            },
          },
          contrast: {
            value: {
              _light: '{colors.gray.800}',
              _dark: '{colors.whiteAlpha.900}',
            },
          },
        },
        title: {
          value: { base: '{colors.gray.700}', _dark: '{colors.gray.100}' },
        },
        description: {
          value: { base: '{colors.gray.500}', _dark: '{colors.gray.400}' },
        },
        // NOTE: v3 の `bg`/`border` は子キーを持つセマンティックグループのため、
        // グループ直下に value を書くと条件付きトークンの生成順が壊れ
        // ダークモードが効かなくなる。必ず DEFAULT キー経由で上書きすること。
        bg: {
          DEFAULT: {
            value: { base: 'white', _dark: '{colors.bg.900}' },
          },
          // v3 組み込みのサーフェス (Dialog/Menu/Popover 等) が参照する。
          // v2 の dark サーフェス (gray.700) に合わせる
          panel: {
            value: { _light: 'white', _dark: '{colors.gray.700}' },
          },
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
          DEFAULT: {
            value: { base: '{colors.bg.100}', _dark: '{colors.bg.800}' },
          },
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
    recipes: {
      // v2 の Heading サイズ体系 (v3 では md=16px 等に縮小。v2: md=20→24px responsive)
      heading: {
        base: { fontWeight: 'bold' }, // v2 は bold (v3 は semibold)
        variants: {
          size: {
            sm: { fontSize: 'md', lineHeight: 1.2 },
            md: { fontSize: 'xl', lineHeight: 1.2 },
            '2xl': {
              fontSize: { base: '4xl', md: '5xl' },
              lineHeight: { base: 1.2, md: 1 },
            },
          },
        },
      },
      // v2 のボタン寸法 (v3 は lg=44px/md フォント等に縮小されたため v2 に合わせる)
      button: {
        base: { fontWeight: 'semibold' }, // v2 は semibold (v3 は medium)
        variants: {
          size: {
            sm: { h: '8', minW: '8', textStyle: 'sm', px: '3' },
            md: { h: '10', minW: '10', textStyle: 'md', px: '4' },
            lg: { h: '12', minW: '12', textStyle: 'lg', px: '6' },
          },
        },
      },
      // v2 Input 寸法 (v3 は md で 14px / px 3 に縮小)
      input: {
        variants: {
          size: {
            sm: { textStyle: 'sm', px: '3', '--input-height': 'sizes.8' },
            md: { textStyle: 'md', px: '4', '--input-height': 'sizes.10' },
            lg: { textStyle: 'lg', px: '4', '--input-height': 'sizes.12' },
          },
        },
      },
      textarea: {
        variants: {
          size: {
            md: { textStyle: 'md', px: '4', py: '2' },
          },
        },
      },
      // v2 Spinner 寸法 (md=24px, v3 は 20px)
      spinner: {
        variants: {
          size: {
            md: { '--spinner-size': 'sizes.6' },
          },
        },
      },
      // v2 Divider は horizontal で幅 100% (v3 は flex 子要素で幅 0 になり不可視)
      separator: {
        variants: {
          orientation: {
            horizontal: { width: '100%' },
          },
        },
      },
      // v2 Badge subtle 配色 (light: 100/800, dark: 200 の 16% / 200)
      badge: {
        variants: {
          variant: {
            subtle: {
              bg: { base: 'colorPalette.100', _dark: 'colorPalette.200/16' },
              color: { base: 'colorPalette.800', _dark: 'colorPalette.200' },
            },
          },
        },
      },
    },
    slotRecipes: {
      // v2 Alert subtle: 文字色は継承し、色はアイコンと背景だけに付ける
      alert: {
        variants: {
          variant: {
            subtle: {
              root: {
                bg: { base: 'colorPalette.100', _dark: 'colorPalette.200/16' },
                color: 'inherit',
              },
              indicator: {
                color: { base: 'colorPalette.600', _dark: 'colorPalette.200' },
              },
            },
          },
        },
      },
      // v2 Tag: lg は 32px 高・px 3、outline は 500 (dark: 200/80) の枠線。
      // アイコン要素は flex で中央揃え (inline の svg がベースライン分下にずれるため)
      tag: {
        base: {
          startElement: { display: 'inline-flex', alignItems: 'center' },
          endElement: { display: 'inline-flex', alignItems: 'center' },
        },
        variants: {
          size: {
            lg: {
              root: {
                minH: '8',
                px: '3',
                gap: '2',
                '--tag-element-offset': '0px',
              },
            },
          },
          variant: {
            outline: {
              root: {
                color: {
                  base: 'colorPalette.500',
                  _dark: 'colorPalette.200/80',
                },
                shadowColor: {
                  base: 'colorPalette.500',
                  _dark: 'colorPalette.200/80',
                },
              },
            },
          },
        },
      },
      // v2 Table は行に背景色を持たない (v3 line は row に bg が付く)
      // v2 の sm 寸法と th スタイル。v3 は文字サイズを root に置くため、
      // 呼び出し側の textStyle="title" で打ち消されないよう th/td に直接指定する
      table: {
        variants: {
          variant: {
            line: { row: { bg: 'transparent' } },
          },
          size: {
            sm: {
              columnHeader: {
                px: '4',
                py: '1',
                fontSize: 'xs',
                lineHeight: '1rem',
                fontWeight: 'bold',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: { base: 'gray.600', _dark: 'gray.400' },
              },
              cell: { px: '4', py: '2', fontSize: 'sm', lineHeight: '1rem' },
            },
          },
        },
      },
      // v2 Switch のオフ時トラック色 (v3 の bg.emphasized は v2 gray で青みがかる)
      switch: {
        variants: {
          variant: {
            solid: {
              control: { bg: { base: 'gray.300', _dark: 'whiteAlpha.400' } },
            },
          },
        },
      },
      // v2 Modal 幅 (v3 は 1 段ずつ大きく、xl は 36rem → 56rem になる)
      dialog: {
        variants: {
          size: {
            xs: { content: { maxW: 'xs' } },
            sm: { content: { maxW: 'sm' } },
            md: { content: { maxW: 'md' } },
            lg: { content: { maxW: 'lg' } },
            xl: { content: { maxW: 'xl' } },
          },
        },
      },
      // v2 Avatar 寸法 (sm=32/md=48/lg=64px, 文字は 40%) と塗りつぶしのフォールバック
      avatar: {
        variants: {
          size: {
            sm: {
              root: {
                '--avatar-size': 'sizes.8',
                '--avatar-font-size': '0.8rem',
              },
            },
            md: {
              root: {
                '--avatar-size': 'sizes.12',
                '--avatar-font-size': '1.2rem',
              },
            },
            lg: {
              root: {
                '--avatar-size': 'sizes.16',
                '--avatar-font-size': '1.6rem',
              },
            },
          },
          variant: {
            subtle: {
              root: { bg: 'gray.400', color: 'white' },
            },
          },
        },
      },
      // v2 ではリストマーカーが本文と同色 (v3 は fg.subtle)
      list: {
        variants: {
          variant: {
            marker: { item: { _marker: { color: 'inherit' } } },
          },
        },
      },
      // v2 Progress: xs は 4px、indeterminate は中央だけ色の付くグラデーション
      progress: {
        base: {
          range: {
            _indeterminate: {
              bgColor: 'transparent',
              backgroundImage:
                'linear-gradient(to right, transparent 0%, {colors.colorPalette.solid} 50%, transparent 100%)',
            },
          },
        },
        variants: {
          size: {
            xs: { track: { h: '1' } },
          },
        },
      },
      // v2 Tabs: lg は fontSize lg / py 3、line の非選択色は継承、下線 2px
      tabs: {
        variants: {
          size: {
            // textStyle は呼び出し側の textStyle="title" に上書きされるため fontSize で指定
            lg: {
              root: { '--tabs-content-padding': 'spacing.4' },
              trigger: {
                py: '3',
                px: '4',
                fontSize: 'lg',
                lineHeight: 1.5,
                height: 'auto',
              },
            },
          },
          variant: {
            line: {
              list: { _horizontal: { borderBottomWidth: '2px' } },
              trigger: { color: 'inherit' },
            },
          },
        },
      },
    },
    textStyles: {
      // NOTE: v3 では textStyle 内の color が color prop より優先されるため、
      // title には color を含めない (globalCss の body color: title が同値の
      // デフォルトを与えるので見た目は不変、color prop での上書きが可能になる)
      title: {
        value: {
          fontWeight: 'bold',
        },
      },
      description: {
        value: {
          fontSize: 'sm',
          lineHeight: 1.5, // v2 では body の 1.5 を継承していた (21px)
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
