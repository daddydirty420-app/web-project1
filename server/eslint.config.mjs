import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: [
            ".vscode/**",
            "dist/**",
            "node_modules/**",
            "migration/**",
            "seeders/**",
            "public/**",
            "tmp/**",
            "eslint.config.mjs",
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
