'use strict'
const pug = require('pug');
const path = require('path');
const utils = require('./utils.js');
const fs = require('fs');

const postOrder = (p1, p2) =>
  (p2.priority ?? 0) - (p1.priority ?? 0) - p1.date.localeCompare(p2.date);

module.exports = function (source) {
  let options = Object.assign({
    filename: this.resourcePath,
    compileDebug: this.debug || false
  }, this.query)

  let template = pug.compile(source, options)
  template.dependencies.forEach(this.addDependency)

  const posts = compilePosts();
  //The index page depends on the post pages to render itself. Add them here for file-watching
  posts.map(p => p.file).forEach(this.addDependency);

  return template({
    posts: compilePosts(),
    postOrder
  })
}

function compilePosts() {
  return utils.getPosts()
    .map(file => {
      let { content, frontMatter } = utils.splitFrontMatter(fs.readFileSync(file, 'utf8'));

      let slug = path.parse(file).name;
      return {
        slug,
        href: slug + '.html',
        file,
        preview: utils.extractPreview(content),
        ...frontMatter
      };
    })
}