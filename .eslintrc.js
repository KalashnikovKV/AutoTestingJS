module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:playwright/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['playwright'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'playwright/expect-expect': 'error',
    'playwright/no-page-pause': 'error',
    'playwright/no-restricted-matchers': 'error',
    'playwright/require-top-level-describe': 'error',
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      rules: {
        'playwright/expect-expect': 'off',
      },
    },
  ],
};
