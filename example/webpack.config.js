const InjectPlugin = require('..').default;

module.exports = {
  entry: './entry.js',
  mode: 'development',
  plugins: [
    new InjectPlugin(() => `console.log('hello world');`),
    new InjectPlugin(() => `console.log('second injected code');`)
  ]
};
