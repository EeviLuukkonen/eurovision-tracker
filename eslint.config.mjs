import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

const sharedTypeCheckedConfig = {
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  plugins: {
    "@stylistic": stylistic,
  },
  rules: {
    '@stylistic/semi': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { 'argsIgnorePattern': '^_' }
    ],
  },
};

export default defineConfig(
  {
    ignores: ['**/build/**', '**/node_modules/**'],
  },
  {
    ...sharedTypeCheckedConfig,
    files: ['backend/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./backend/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ...sharedTypeCheckedConfig,
    files: ['frontend/src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./frontend/tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ...sharedTypeCheckedConfig,
    files: ['frontend/vite.config.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./frontend/tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
