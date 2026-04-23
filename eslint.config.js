const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const n = require('eslint-plugin-n');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.extends('prettier'),
  n.configs['flat/recommended'],
  {
    plugins: {
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: 'req|res|next|val' }],
      'no-console': 'off',
      'func-names': 'off',
      'no-process-exit': 'off',
      'object-shorthand': 'off',
      'class-methods-use-this': 'off',
      'no-underscore-dangle': 'off',
      'n/no-missing-require': 'off',
      'import/no-extraneous-dependencies': 'off',
      'n/no-unpublished-require': 'off',
      'global-require': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'consistent-return': 'off',
      radix: 'off',
      'no-shadow': 'off',
    },
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },
  {
    ignores: ['node_modules/**', '.env', 'public/**', 'dev-data/**'],
  },
];
