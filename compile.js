const pug = require('pug');
const fs = require('fs');
var md = require('markdown-it')();
const yaml = require('yaml');

// clear www directory
fs.readdirSync('www').forEach(file => {
  fs.unlinkSync(`www/${file}`);
});

// render index.html with list of posts
fs.writeFileSync('www/index.html', pug.renderFile('src/index.pug', {
  pretty: true,
  posts: compilePosts(),
}));

// Copy across dependencies
fs.copyFileSync('src/normalize.css', 'www/normalize.css');
fs.copyFileSync('src/style.css', 'www/style.css');

// UTILITY FUNCTIONS
function compilePosts() {
  var posts = [];
  fs.readdirSync('content').reverse().forEach(file => {
    let filename = file.replace('.md', '.html');
  
    let {content, frontMatter} = splitFrontMatter(fs.readFileSync(`content/${file}`, 'utf8'));
    
    posts.push({
      filename,
      ...frontMatter
    });
    
    fs.writeFileSync(`www/${filename}`, pug.renderFile('src/post.pug', {
      pretty: true,
      filename,
      content: md.render(content),
      ...frontMatter
    }));
  });
  return posts;
}

function splitFrontMatter(content) {
  let sections = content.split('---');
  if (content.indexOf('---') == 0 && sections.length > 2) {
    return {
      frontMatter: yaml.parse(sections[1]),
      content: sections.slice(2).join('---')
    }
  }
  return {
    content
  };
}