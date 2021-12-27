/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Williams Medina @willyelm

  Taken from: https://github.com/willyelm/pug-html-loader/blob/master/lib/index.js
*/
'use strict'
const path = require('path');
const pug = require('pug');
const md = require('markdown-it')({ html: true });
const yaml = require('yaml');
const datefmt = require('date-fns');

const formatDate = (dateStr) => datefmt.format(new Date(dateStr), 'MMM. yyyy');

module.exports = function (source) {
  let p = path.resolve('./src/post.pug');
  this.addDependency(p);

  let { content, frontMatter } = splitFrontMatter(source);

  let template = pug.compileFile('./src/post.pug', {
    filename: this.resourcePath,
    doctype: this.query.doctype || 'js',
    compileDebug: this.debug || false,
  });

  template.dependencies.forEach(this.addDependency);
  let data = this.query.data || {}

  return template({
    pretty: true,
    content: md.render(content),
    ...frontMatter,
    formatDate
  })
}

function splitFrontMatter(fileContent) {
  let sections = fileContent.split('---');
  if (fileContent.indexOf('---') == 0 && sections.length > 2) {
    return {
      frontMatter: yaml.parse(sections[1]),
      content: sections.slice(2).join('---')
    }
  }
  return {
    content: fileContent
  };
}