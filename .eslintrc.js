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
            "plugin:@typescript-eslint/recommended-requiring-type-checking",
            "plugin:prettier/recommended"
        ],
        "parser": "@typescript-eslint/parser",
        "parserOptions": {
            "project": "tsconfig.json",
            "tsconfigRootDir": "./",
            "createDefaultProgram": true

        },
        "plugins": ["@typescript-eslint", "prettier"],
        "rules": {
            "prettier/prettier":"error"
        }
    }