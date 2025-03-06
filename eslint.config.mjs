import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      ...prettier.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'no-console': 'warn',
    },
  },
];
