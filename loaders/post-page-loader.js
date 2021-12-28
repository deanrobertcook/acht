'use strict'
const path = require('path');
const pug = require('pug');
const md = require('markdown-it')({ html: true });
const datefmt = require('date-fns');
const utils = require('./utils.js');

const formatDate = (dateStr) => datefmt.format(new Date(dateStr), 'MMM. yyyy');

module.exports = function (source) {
  this.addDependency(path.resolve('src', 'post.pug'));

  let { content, frontMatter } = utils.splitFrontMatter(source);

  let template = pug.compileFile('./src/post.pug', {
    filename: this.resourcePath,
    doctype: this.query.doctype || 'js',
    compileDebug: this.debug || false,
  });

  template.dependencies.forEach(dep => {
    this.addDependency(path.resolve(dep));
  });

  return template({
    pretty: true,
    content: md.render(content),
    ...frontMatter,
    formatDate
  })
}