const yaml = require('yaml');
const removeMd = require('remove-markdown');
const fs = require('fs');
const path = require('path');

const CONT_DIR = 'content';

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
  },

  /**
   * Gets all the shallow files in CONT_DIR and maps them to fully resolved paths
   */
  getPosts: () => 
    fs.readdirSync(path.resolve(process.cwd(), CONT_DIR))
      .map(base => path.resolve(process.cwd(), CONT_DIR, base)) //map to full path  
      .filter(path => !fs.statSync(path).isDirectory()) //filter out directories
      
}