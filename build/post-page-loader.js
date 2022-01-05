'use strict'
const path = require('path');
const pug = require('pug');
const md = require('markdown-it')({ html: true });
const datefmt = require('date-fns');
const utils = require('./utils.js');

const formatDate = (dateStr) => datefmt.format(new Date(dateStr), 'MMM. yyyy');

module.exports = function (source) {
  const templateFile = path.resolve('src', 'post.pug');
  this.addDependency(templateFile);

  let { content, frontMatter } = utils.splitFrontMatter(source);

  let template = pug.compileFile(templateFile, {
    filename: templateFile,
    compileDebug: this.debug || false,
  });

  template.dependencies.forEach(this.addDependency);

  return template({
    content: md.render(content),
    ...frontMatter,
    formatDate
  });
}