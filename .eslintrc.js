module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        indent: ['error', 4],
        'no-console': 1,
        'no-param-reassign': "off",
        '@typescript-eslint/typedef': [
            'error',
            {
                'arrowParameter': true,
                'variableDeclaration': true,
                'propertyDeclaration': true
            }
        ],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                'js': 'never',
                'jsx': 'never',
                'ts': 'never',
                'tsx': 'never'
            }
        ],
    },
    settings: {
        "import/resolver": {
            "node": {
                "extensions": [
                    ".js",
                    ".ts",
                ]
            }
        }
    }
};
