module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': 0,
    'import/no-unresolved': 0,
    'react/no-array-index-key': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/prop-types': 0,
    indent: 0,
    'object-curly-newline': 0,
    'import/no-named-as-default-member': 0,
    'arrow-body-style': 0,
    'import/prefer-default-export': 0,
  },
};