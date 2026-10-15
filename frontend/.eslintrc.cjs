module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'build', '.react-router', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      // React Router's plugin keeps fast refresh working for the loaders of route modules
      { allowConstantExport: true, allowExportNames: ['loader', 'clientLoader'] },
    ],
    'max-len': ['warn', { code: 150 }],
    'quotes': ['warn', 'double'],
    'semi': ['warn', 'always']
  },
}
