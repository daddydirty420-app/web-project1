import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: [
            ".vscode/**",
            "dist/**",
            "node_modules/**",
            "migrations/**",
            "seeders/**",
            "public/**",
            "tmp/**",
            "eslint.config.mjs",
            "scripts/**"
        ],
    },

    eslint.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ["src/**/*.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
);
