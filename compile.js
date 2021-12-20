const pug = require('pug');
const fs = require('fs');
const md = require('markdown-it')();
const yaml = require('yaml');
const removeMd = require('remove-markdown');
const datefmt = require('date-fns');

//Sort first based on priority (descending), then by date (reverse chronological)
const postOrder = (p1, p2) => 
  (p2.priority ?? 0) - (p1.priority ?? 0) - p1.date.localeCompare(p2.date);

// clear www directory
fs.readdirSync('www').forEach(file => {
  fs.unlinkSync(`www/${file}`);
});

// render index.html with list of posts
fs.writeFileSync('www/index.html', pug.renderFile('src/index.pug', {
  pretty: true,
  posts: compilePosts(),
  postOrder
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
      ...frontMatter
    }));
  });
  return posts;
}

function splitFrontMatter(fileContent) {
  let sections = fileContent.split('---');
  if (fileContent.indexOf('---') == 0 && sections.length > 2) {
    let frontMatter = yaml.parse(sections[1]);
    frontMatter['date'] = formatDate(frontMatter['date']);
    return {
      frontMatter,
      content: sections.slice(2).join('---')
    }
  }
  return {
    content: fileContent
  };
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return datefmt.format(date, 'MMM. yyyy');
}

function extractPreview(content) {
  const intro = content.split('## ')[0].trim();
  return removeMd(intro, {
    stripListLeaders: false
  }).replace(/(?:\r\n|\r|\n)/g, "<br>");
}
