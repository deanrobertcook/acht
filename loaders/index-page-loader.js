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

  return template({
    posts: compilePosts(),
    postOrder
  })
}

function compilePosts() {
  return fs.readdirSync('content').reverse().map(file => {
    let { content, frontMatter } = utils.splitFrontMatter(fs.readFileSync(`content/${file}`, 'utf8'));

    if (frontMatter['exclude']) {
      return null;
    }

    let slug = path.parse(file).name;
    return {
      slug,
      href: slug + '.html',
      preview: utils.extractPreview(content),
      ...frontMatter
    };
  }).filter(v => !!v);
}