const path = require('path');

module.exports = {
  entry: './src/main.js',
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './www',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'www'),
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ],
  },
};