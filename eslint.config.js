import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        mocha: true,
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        after: 'readonly',
        require: 'readonly',
        process: 'readonly',
        console: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      // Code style
      'quotes': ['error', 'single'], // Use single quotes
      'max-len': ['error', { code: 120 }], // Maximum line length of 120 characters
      'semi': ['error', 'always'], // Require semicolons
      'indent': ['error', 2], // Indentation of 2 spaces
      'no-trailing-spaces': 'error', // Disallow trailing spaces at the end of lines
      'eol-last': ['error', 'always'], // Require a newline at the end of files
      'no-multiple-empty-lines': ['error', { max: 1 }], // Maximum of one consecutive empty line
      'comma-dangle': ['error', 'always-multiline'], // Require trailing commas in multiline lists
      'object-curly-spacing': ['error', 'always'], // Require spaces inside curly braces

      // Rules for variables
      'no-var': 'error', // Disallow the use of var
      'prefer-const': 'error', // Prefer const for variables that are not reassigned
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Disallow unused variables
      'camelcase': ['error', { properties: 'always' }], // Enforce camelCase naming convention

      // Rules for functions
      'arrow-spacing': ['error', { before: true, after: true }], // Require space around the arrow in arrow functions
      'space-before-function-paren': ['error', 'never'], // Disallow space before function parentheses
      'func-call-spacing': ['error', 'never'], // Disallow space between function name and invocation
      'no-console': 'warn', // Allow console statements with a warning

      // Logic and structure
      'eqeqeq': ['error', 'always'], // Require the use of === and !== instead of == and !=
      'no-else-return': 'error', // Disallow else after return
      'curly': ['error', 'all'], // Require curly braces for all blocks
      'no-fallthrough': 'error', // Disallow fallthrough in switch cases
      'default-case': 'error', // Require a default case in switch statements

      // Security
      'no-eval': 'error', // Disallow the use of eval
      'no-implied-eval': 'error', // Disallow implied eval
      'no-new-func': 'error', // Disallow the use of new Function
      'no-prototype-builtins': 'error', // Disallow direct use of Object.prototype methods

      // ES6+
      'prefer-arrow-callback': 'error', // Prefer arrow functions for callbacks
      'no-duplicate-imports': 'error', // Disallow duplicate imports
      'template-curly-spacing': ['error', 'never'], // Disallow spaces inside ${} in template strings
      'rest-spread-spacing': ['error', 'never'], // Disallow spaces in rest/spread operators

      // Miscellaneous
      'no-debugger': 'warn', // Allow debugger with a warning
      'no-undef': 'error', // Disallow the use of undefined variables
      'consistent-return': 'error', // Require consistent return statements in functions
    },
  },
];
