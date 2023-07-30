module.exports = {
  extends: ['@antfu/eslint-config-basic', '@unocss', 'plugin:jsx-a11y/recommended', 'plugin:astro/recommended'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  ],
}
