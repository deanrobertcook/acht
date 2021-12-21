const path = require('path');
const pug = require('pug');
const fs = require('fs');
const md = require('markdown-it')();
const yaml = require('yaml');
const removeMd = require('remove-markdown');
const datefmt = require('date-fns');

const O_DIR = "www"; //output directory
const I_DIR = "src"; //input directory

//Sort first based on priority (descending), then by date (reverse chronological)
const postOrder = (p1, p2) => 
  (p2.priority ?? 0) - (p1.priority ?? 0) - p1.date.localeCompare(p2.date);

const formatDate = (dateStr) => datefmt.format(new Date(dateStr), 'MMM. yyyy');

// clear www directory
fs.readdirSync(O_DIR).forEach(file => {
  fs.unlinkSync(path.join(O_DIR, file));
});

// render index.html with list of posts
fs.writeFileSync(
  path.join(O_DIR, 'index.html'), 
  pug.renderFile(path.join(I_DIR, 'index.pug'), {
    pretty: true,
    posts: compilePosts(),
    postOrder
  }));

// Copy across dependencies
[
  'normalize.css',
  'style.css',
  'temple.svg'
].forEach(file => {
  fs.copyFileSync(path.join(I_DIR, file), path.join(O_DIR, file));
})

/**************************************************
 ** UTILITY FUNCTIONS 
 **************************************************/ 

function compilePosts() {
  var posts = [];
  fs.readdirSync('content').reverse().forEach(file => {
    let filename = file.replace('.md', '.html');
  
    let {content, frontMatter} = splitFrontMatter(fs.readFileSync(`content/${file}`, 'utf8'));

    if (frontMatter['exclude']) {
      return;
    }
  
    posts.push({
      filename,
      preview: extractPreview(content),
      ...frontMatter
    });
    
    fs.writeFileSync(`www/${filename}`, pug.renderFile('src/post.pug', {
      pretty: true,
      filename,
      content: md.render(content),
      ...frontMatter,
      formatDate
    }));
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
