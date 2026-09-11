const js = require('@eslint/js');
const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const vueParser = require('vue-eslint-parser');
const vuePlugin = require('eslint-plugin-vue');

const typescriptRules = {
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
};

module.exports = [
  {
    ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['backend/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./backend/tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module'
      },
      globals: globals.node
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...typescriptRules,
      'no-undef': 'off'
    }
  },
  {
    files: ['backend/src/__tests__/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./backend/tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module'
      },
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...typescriptRules,
      'no-undef': 'off'
    }
  },
  {
    files: ['frontend/**/*.ts', 'frontend/**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./frontend/tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module'
      },
      globals: globals.browser
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...typescriptRules,
      'no-undef': 'off'
    }
  },
  {
    files: ['frontend/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        project: ['./frontend/tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module'
      },
      globals: globals.browser
    },
    plugins: {
      vue: vuePlugin,
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...vuePlugin.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...typescriptRules,
      'no-undef': 'off',
      'vue/multi-word-component-names': 'off'
    }
  }
];
