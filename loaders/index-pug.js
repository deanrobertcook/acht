/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Williams Medina @willyelm

  Taken from: https://github.com/willyelm/pug-html-loader/blob/master/lib/index.js
*/
'use strict'
const pug = require('pug');
const path = require('path');
const yaml = require('yaml');
const fs = require('fs');
const removeMd = require('remove-markdown');

const postOrder = (p1, p2) =>
  (p2.priority ?? 0) - (p1.priority ?? 0) - p1.date.localeCompare(p2.date);

module.exports = function (source) {
  
  let p = path.resolve('./src/index.pug');
  this.addDependency(p);

  let options = Object.assign({
    filename: this.resourcePath,
    doctype: this.query.doctype || 'js',
    compileDebug: this.debug || false
  }, this.query)

  let template = pug.compileFile('./src/index.pug', options)
  
  template.dependencies.forEach(this.addDependency)
  // let data = this.query.data || {}
  return template({
    pretty: true,
    posts: compilePosts(),
    postOrder
  })
}

function compilePosts() {
  var posts = [];
  fs.readdirSync('content').reverse().forEach(file => {
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
  });
  return posts;
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

function extractPreview(content) {
  const intro = content.split('## ')[0].trim();
  return removeMd(intro, {
    stripListLeaders: false
  }).replace(/(?:\r\n|\r|\n)/g, "<br>");
}