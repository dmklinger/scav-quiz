import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
    {    
        files: ["**/*.js", "**/*.ts"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": typescriptPlugin,
        },
        rules: {
            "semi": ["error", "always"],
            "comma-dangle": ["error", "always-multiline"],
            "quotes": ["error", "double", { "avoidEscape": true }],
        },
    },
];