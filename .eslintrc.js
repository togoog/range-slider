module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    jest: true
  },
  extends: [
    "plugin:@typescript-eslint/recommended" // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    semi: ["error", "always"],
    complexity: ["error", 5],
    "@typescript-eslint/explicit-function-return-type": 0
  }
};
