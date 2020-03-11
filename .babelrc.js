const DEV = process.env.NODE_ENV === 'developemnt'

module.exports = {
  presets: [
    ['@babel/preset-react', {
      pragma: 'h',
    }],
  ],
  plugins: [
    'dynamic-import-node',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-modules-commonjs',
  ],
}
