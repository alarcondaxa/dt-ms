// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import importHelpers from 'eslint-plugin-import-helpers';
import nextPlugin from '@next/eslint-plugin-next';

/**
 * ESLint 9 flat config
 * Combina suporte a React, TypeScript, Next.js e Prettier
 */
export default [
  // Configuração base JavaScript recomendada
  js.configs.recommended,
  // Configuração base TypeScript recomendada (flat)
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      prettier,
      'import-helpers': importHelpers,
      next: nextPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // --- Next.js e React ---
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': 'off',
      // --- TypeScript ---
      '@typescript-eslint/no-explicit-any': 'off',
      // --- Estilo de código ---
      'prefer-const': 'off',
      'prettier/prettier': 'error',
      // --- Ordem de imports ---
      'import-helpers/order-imports': [
        'error',
        {
          newlinesBetween: 'always',
          groups: [
            '/^next/',
            '/@next/',
            '/^react/',
            'module',
            '/@/',
            '/^@shared/',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc', ignoreCase: true },
        },
      ],
    },
  },
];
