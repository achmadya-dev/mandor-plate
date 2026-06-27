import eslint from '@eslint/js';
import globals from 'globals';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const apiRules = {
  '@typescript-eslint/interface-name-prefix': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['error'],
  'require-await': 'off',
  '@typescript-eslint/require-await': 'error',
  '@typescript-eslint/no-floating-promises': 'error',
  'no-restricted-syntax': [
    'error',
    {
      selector:
        'CallExpression[callee.object.name=configService][callee.property.name=/^(get|getOrThrow)$/]:not(:has([arguments.1] Property[key.name=infer][value.value=true])), CallExpression[callee.object.property.name=configService][callee.property.name=/^(get|getOrThrow)$/]:not(:has([arguments.1] Property[key.name=infer][value.value=true]))',
      message:
        'Add "{ infer: true }" to configService.get() for correct typechecking. Example: configService.get("database.port", { infer: true })',
    },
    {
      selector: 'CallExpression[callee.name=it][arguments.0.value!=/^should/]',
      message: '"it" should start with "should"',
    },
  ],
};

/**
 * @param {string} tsconfigRootDir
 * @param {{ isApi?: boolean; isWeb?: boolean; files?: string[]; eslintTsconfig?: string }} [options]
 */
export function createPackageEslintConfig(tsconfigRootDir, options = {}) {
  const { isApi = false, isWeb = false, files, eslintTsconfig } = options;
  const filePatterns = files ?? (isWeb ? ['**/*.{ts,tsx}'] : ['**/*.ts']);

  return tseslint.config(
    {
      ignores: [
        'dist/**',
        '.next/**',
        'node_modules/**',
        'coverage/**',
        '**/*.{mjs,cjs,js}',
        'eslint.config.mjs',
        ...(isWeb
          ? ['.agents/**', '.claude/**', 'e2e/**', 'playwright.config.ts']
          : []),
      ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    {
      files: filePatterns,
      ...(isWeb
        ? {
            plugins: {
              'react-hooks': reactHooks,
              'jsx-a11y': jsxA11y,
            },
          }
        : {}),
      languageOptions: {
        globals: isApi
          ? { ...globals.node, ...globals.jest }
          : isWeb
            ? { ...globals.browser, ...globals.node }
            : { ...globals.node, ...globals.jest },
        parserOptions: eslintTsconfig
          ? {
              project: eslintTsconfig,
              tsconfigRootDir,
            }
          : {
              projectService: true,
              tsconfigRootDir,
            },
      },
      rules: isApi
        ? apiRules
        : isWeb
          ? {
              'react-hooks/rules-of-hooks': 'error',
              'react-hooks/exhaustive-deps': 'error',
              '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
              ],
            }
          : {
              '@typescript-eslint/no-unsafe-return': 'off',
            },
    },
  );
}

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default [
  ...createPackageEslintConfig(path.join(rootDir, 'packages/shared'), {
    files: ['packages/shared/**/*.ts'],
    eslintTsconfig: path.join(rootDir, 'packages/shared/tsconfig.eslint.json'),
  }),
  ...createPackageEslintConfig(path.join(rootDir, 'apps/api'), {
    isApi: true,
    files: ['apps/api/**/*.ts'],
  }),
  ...createPackageEslintConfig(path.join(rootDir, 'apps/web'), {
    isWeb: true,
    files: ['apps/web/**/*.{ts,tsx}'],
  }),
];
