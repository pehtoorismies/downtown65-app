module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'unicorn', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    // 'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  ignorePatterns: ['packages/services/appsync.d.ts'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    'import/no-unresolved': 'off',
    'import/named': 'off',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'never',
      },
    ],
    'prettier/prettier': ['error'],
    'unicorn/prevent-abbreviations': [
      'error',
      {
        replacements: {
          db: {
            database: false,
          },
          res: false,
          params: false,
          env: false,
          args: false,
        },
      },
    ],
  },
}
