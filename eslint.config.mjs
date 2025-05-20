import pluginImport from 'eslint-plugin-import';
import tsEslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from "eslint-plugin-jsx-a11y";
import promise from 'eslint-plugin-promise';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import eslint from '@eslint/js';

export default tsEslint.config(
  {
    ignores: [
      '**/dist/',
      '**/public/',
      '**/node_modules/',
      '**/*.config.js',
      '**/*.config.ts',
      '**/*.local',
      '**/.*',
      '**/pdf.worker.min.js',
    ],
  },
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  promise.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      import: pluginImport,
      react,
      '@typescript-eslint': tsEslint.plugin,
      'react-hooks': reactHooks,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsEslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'script',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },

        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/require-default-props': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': [
        'error',
        {
          custom: 'ignore',
        },
      ],
      'react/no-unstable-nested-components': [
        'error',
        {
          allowAsProps: true,
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-use-before-define': 'off',
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'function',
          format: ['PascalCase', 'camelCase'],
        },
      ],
      '@typescript-eslint/no-use-before-define': 'off',
      'no-underscore-dangle': 'off',
      'no-console': 'warn',
      'no-nested-ternary': 'off',
      'import/extensions': 'off',
      'import/prefer-default-export': 'off',
    },
  },
  {
    // disable type-aware linting on JS files
    files: ['**/*.js'],
    extends: [tsEslint.configs.disableTypeChecked],
  },
);
