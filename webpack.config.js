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
    filename: '[name].js',
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
    ...postHtmlPages(),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/i,
        use: [
          "html-loader",
          {
            loader: path.resolve('loaders', 'index-pug.js'),
          }]
      },
      {
        test: /\.md$/i,
        use: [
          "html-loader",
          {
            loader: path.resolve('loaders', 'md-pug.js'),
          }]
      },
      {
        test: require.resolve("./src/style.css"),
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
        type: 'asset/resource'
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

function postHtmlPages() {
  var posts = [];
  fs.readdirSync('content').forEach(file => {

    let slug = file.slice(0, file.lastIndexOf('.md'));
    let href = slug + '.html';
    posts.push(
      new HtmlWebpackPlugin({
        template: `content/${file}`,
        filename: href,
        meta: {
          viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
        }
      })
    )
  });
  return posts;
}