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
  {
    files: ['eslint.config.cjs'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly'
      }
    },
    rules: {
      'no-undef': 'off'
    }
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
        ...globals.node
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
    files: ['frontend/src/**/*.ts', 'frontend/src/**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./frontend/tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        extraFileExtensions: ['.vue']
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
    files: ['frontend/vite.config.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        tsconfigRootDir: __dirname
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
    files: ['frontend/src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        project: ['./frontend/tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        extraFileExtensions: ['.vue']
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
