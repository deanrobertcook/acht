const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

var config = {
  entry: {
    main: './src/main.js'
  },
  mode: "production",
  output: {
    path: path.resolve('www'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('src', 'index.pug'),
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
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      },
    ],
  },
};

module.exports = (env, argv) => {
  if (argv.mode == 'development') {
    config.devtool = 'inline-source-map';
    config.devServer = {
      static: './www',
    };
  }
  return config;
}

function buildPostHtmlPlugins() {
  return fs.readdirSync('content').map(file => {
    return new HtmlWebpackPlugin({
      template: path.resolve('content', file),
      filename: path.parse(file).name + '.html',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      }
    });
  });
}