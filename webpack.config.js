var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'demo'),
    compress: true,
    port: 9002
  },
  entry: './demo/app.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }, {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'demo/index.html'),
      title: 'Viscosity',
      favicon: path.resolve(__dirname, 'demo/honey.png')
    })]
};
