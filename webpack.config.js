const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs


module.exports = {
  entry: {
    css: require.resolve("./src/style.css"),
    js: './src/main.js'
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
      template: 'content/about.md',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      }
    }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.md$/i,
        use: [
          "html-loader",
          {
            loader: path.resolve('loaders', 'md-pug.js'),
            options: {
              test: "test"
            }
          }]
      },
      {
        test: require.resolve("./src/style.css"),
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
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

function htmlPlugins() {
  var posts = [];
  fs.readdirSync('content').forEach(file => {
    let slug = file.slice(0, file.lastIndexOf('.md'));
    let href = slug + '.html';

    let { content, frontMatter } = splitFrontMatter(fs.readFileSync(`content/${file}`, 'utf8'));

    if (frontMatter['exclude']) {
      return;
    }

    posts.push({
      slug,
      href,
      preview: extractPreview(content),
      ...frontMatter
    });

    fs.writeFileSync(`www/${slug}.html`, pug.renderFile('src/post.pug', {
      pretty: true,
      slug,
      href,
      content: md.render(content),
      ...frontMatter,
      formatDate
    }));
  });
  return posts;
}