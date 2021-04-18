module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // debug: true,
        // useBuiltIns: 'usage',
        // modules: false,
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "regenerator": true,
      }
    ]
  ],
};