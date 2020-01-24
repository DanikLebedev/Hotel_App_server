    module.exports = {
        "env": {
            "browser": true,
            "es6": true,
            "es2017": true
        },
        "extends": [
            "eslint:recommended",
            "plugin:@typescript-eslint/eslint-recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:@typescript-eslint/recommended-requiring-type-checking"
        ],
        "parser": "@typescript-eslint/parser",
        "parserOptions": {
            "project": "tsconfig.json",
            "tsconfigRootDir": "./",
            "createDefaultProgram": true

        },
        // Плагин с наборами правил для TypeScript
        "plugins": ["@typescript-eslint"],
        "rules": {}
    }