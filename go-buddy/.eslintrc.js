module.exports = {
  root: true,
  extends: [
    'google',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    jest: true,
    es6: true,
    node: true,
  },
  rules: {
    // Adjust Google style guide rules for React Native/TypeScript
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
    'max-len': ['error', {code: 100, ignoreUrls: true, ignoreStrings: true}],
    'object-curly-spacing': ['error', 'never'],
    'indent': 'off', // Let Prettier handle indentation
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single', {avoidEscape: true}],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'operator-linebreak': 'off', // Let Prettier handle this

    // React specific
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/display-name': 'off',

    // TypeScript specific
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],

    // General code quality
    'no-console': ['warn', {allow: ['warn', 'error']}],
    'prefer-const': 'error',
    'no-var': 'error',
  },
  ignorePatterns: [
    'node_modules/',
    'ios/',
    'android/',
    'coverage/',
    '*.config.js',
    '.expo/',
    'dist/',
  ],
};

