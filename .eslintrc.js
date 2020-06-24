module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['airbnb', 'plugin:prettier/recommended', 'prettier/react'],
    env: {
      browser: true,
      jest: true,
    },
    plugins: ['@typescript-eslint', 'react', 'import'],
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
      sourceType: "module", // Allows for the use of imports
      ecmaFeatures: {
        jsx: true,
      },
    },
    rules: {
      'max-len': ['error', 120],
      'no-underscore-dangle': ['error', { allow: ['_id'] }],
      'no-mixed-operators': 'off',
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: false,
            object: true,
          },
          AssignmentExpression: {
            array: true,
            object: false,
          },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'import/prefer-default-export': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'react/react-in-jsx-scope': 'off',
      'prefer-arrow-callback': 'error',
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'react/jsx-props-no-spreading': 0,
      'import/extensions': 'off',
      '@typescript-eslint/indent': 0,
      '@typescript-eslint/member-delimiter-style': 0,
      '@typescript-eslint/no-unused-vars': ['error'],
      'jsx-a11y/click-events-have-key-events': "off",
      'jsx-a11y/interactive-supports-focus': "off",// Проверяем зависимости эффекта
      "@typescript-eslint/explicit-function-return-type": "off",
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          arrowParens: 'always',
          printWidth: 120,
        },
      ],
    },
  };
  