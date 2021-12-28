const yaml = require('yaml');
const removeMd = require('remove-markdown');

module.exports = {
  splitFrontMatter: (fileContent) => {
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
  },

  extractPreview: (content) => {
    const intro = content.split('## ')[0].trim();
    return removeMd(intro, {
      stripListLeaders: false
    }).replace(/(?:\r\n|\r|\n)/g, "<br>");
  }
}