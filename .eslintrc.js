module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "airbnb",
        "plugin:jsx-a11y/recommended"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "jsx-a11y",
        "unused-imports"
    ],
    "rules": {
        "no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
            "warn",
            { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
        ],
        "import/no-unresolved": "off",
        "import/no-named-as-default": 0,
        "eqeqeq": ["error", "smart"],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "no-unused-vars": 2,
        "ignoreImports": 0,
        'camelcase': 'off',
        "no-mixed-operators": 0,
        "no-alert": 0,
        "max-len": ["error", { "code": 150 }],
        "object-curly-newline": 0,
        "no-return-assign": 0
    }
};