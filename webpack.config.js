const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

module.exports = {
  entry: {
    main: './src/main.js'
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './www',
  },
  output: {
    path: path.resolve(__dirname, 'www'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.pug',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      }
    }),
    ...buildPostHtmlPlugins(),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/i,
        use: [
          "html-loader",
          {
            loader: path.resolve('loaders', 'index-page-loader.js'),
          }]
      },
      {
        test: /\.md$/i,
        use: [
          "html-loader",
          {
            loader: path.resolve('loaders', 'post-page-loader.js'),
          }]
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.svg/,
        type: 'asset'
      },
      {
        test: /\.js$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
    ],
  },
};

function buildPostHtmlPlugins() {
  return fs.readdirSync('content').map(file => {
    return new HtmlWebpackPlugin({
      template: `content/${file}`,
      filename: path.parse(file).name + '.html',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      }
    });
  });
}