module.exports = {
  env: {
    node: true,
    es6: true,
    jest: {
      globals: true
    }
  },
  extends: 'standard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  },
  settings: {
    import: {
      resolver: {
        alias: [['@', './src']]
      }
    }
  }
}
