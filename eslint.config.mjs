import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  {
    ignores: [
      "out/**/*",
      ".next/**/*",
      "dist/**/*",
      "build/**/*",
      "node_modules/**/*",
      "**/node_modules/**/*",
      "*.tsbuildinfo",
      "*.log",
      ".env*",
      ".vscode/**/*",
      ".idea/**/*",
      ".DS_Store",
      "Thumbs.db",
      "public/**/*",
      "coverage/**/*",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
    ],
  },
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      // Warn when variables are declared but never used
      "@typescript-eslint/no-unused-vars": "warn",

      // Allow empty object types/interfaces (e.g., type X = {})
      "@typescript-eslint/no-empty-object-type": "off",

      // Enforce a maximum of one consecutive empty line
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1, maxBOF: 0 }],

      // Disallow trailing whitespace at the end of lines
      "no-trailing-spaces": "error",

      // Require a newline at the end of files
      "eol-last": "error",

      // Disallow mixing spaces and tabs for indentation
      "no-mixed-spaces-and-tabs": "error",

      // Require spacing inside curly braces in objects
      "object-curly-spacing": ["error", "always"],

      // Disallow spaces inside array brackets
      "array-bracket-spacing": ["error", "never"],

      // Disallow spaces inside computed property brackets
      "computed-property-spacing": ["error", "never"],

      // Require a space before opening braces of blocks
      "space-before-blocks": "error",

      // Enforce consistent spacing around keywords (e.g., if, else, return)
      "keyword-spacing": "error",

      // Require spaces around infix operators (+, -, =, etc.)
      "space-infix-ops": "error",

      // Disallow spaces inside parentheses
      "space-in-parens": ["error", "never"],

      // Enforce spacing after the // or /* in comments
      "spaced-comment": ["error", "always"],

      // Enforce spacing around colon in object literals
      "key-spacing": ["error", { beforeColon: false, afterColon: true }],

      // Enforce consistent spacing after commas
      "comma-spacing": ["error", { before: false, after: true }],

      // Disallow semicolons at the end of statements
      semi: ["error", "never"],

      // Disable spacing checks around semicolons (not needed since semi is off)
      "semi-spacing": "off",

      // Enforce spacing inside single-line blocks
      "block-spacing": "error",

      // Enforce camelCase naming convention
      camelcase: "warn",

      // Require constructor names to begin with a capital letter
      "new-cap": "error",

      // Disallow Array constructors (use [] instead of new Array())
      "no-array-constructor": "error",

      // Disallow Object constructors (use {} instead of new Object())
      "no-new-object": "error",

      // Disallow unnecessary ternary expressions
      "no-unneeded-ternary": "error",

      // Require object literal shorthand syntax (e.g., { a } instead of { a: a })
      "object-shorthand": "error",

      // Require const declarations for variables that are never reassigned
      "prefer-const": "error",

      // Require template literals instead of string concatenation
      "prefer-template": "error",

      // Console statements warnings
      "no-console": "warn",
      "no-debugger": "warn",

      // "import/no-cycle": ["warn", { maxDepth: 1 }],
      "import/no-self-import": "error",
      "import/no-useless-path-segments": "error", // could be warn
      // Evita re-exportar todo a ciegas:
      "import/no-deprecated": "error", // could be warn

      // "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }]
    },
  }),
]

export default eslintConfig
