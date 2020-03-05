const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    library: 'viscosity',
    libraryTarget: 'var',
    filename: 'viscosity.js'
  }
};
