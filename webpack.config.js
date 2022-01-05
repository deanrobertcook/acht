const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const utils = require('./build/utils')

var config = {
  entry: {
    main: './src/js/main.js'
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
            loader: path.resolve('build', 'index-page-loader.js'),
          }]
      },
      {
        test: /\.md$/i,
        use: [
          "html-loader",
          {
            loader: path.resolve('build', 'post-page-loader.js'),
          }]
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  tailwindcss('./tailwind.config.js'),
                  autoprefixer,
                  "postcss-preset-env",
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.svg/,
        type: 'asset'
      },
      {
        test: /\.js$/i,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
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
  return utils.getPosts()
    .map(file => {
      return new HtmlWebpackPlugin({
        template: file,
        filename: path.parse(file).name + '.html',
        meta: {
          viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
        }
      });
  });
}