const pug = require('pug');
const fs = require('fs');
var md = require('markdown-it')();

var posts = [];
fs.readdirSync('content').reverse().forEach(file => {
  let date = file.match('[0-9]{4}\-[0-9]{2}\-[0-9]{2}')[0];
  let filename = file.replace('.md', '.html');
  
  let title = titleCaps(file.replace('.md', '')
  .slice(date.length + 1)
  .replace(/[-_]/g, ' '));
  
  posts.push({
    filename,
    title,
    date
  });
  
  fs.writeFileSync(`www/${filename}`, pug.renderFile('src/post.pug', {
    pretty: true,
    filename,
    title,
    date,
    content: md.render(fs.readFileSync(`content/${file}`, 'utf8'))
  }));
});

fs.writeFileSync('www/index.html', pug.renderFile('src/index.pug', {
  pretty: true,
  posts,
}));

fs.copyFileSync('src/normalize.css', 'www/normalize.css');
fs.copyFileSync('src/style.css', 'www/style.css');


/**
* Title Caps
* 
* See https://johnresig.com/files/titleCaps.js
* 
* Ported to JavaScript By John Resig - http://ejohn.org/ - 21 May 2008
* Original by John Gruber - http://daringfireball.net/ - 10 May 2008
* License: http://www.opensource.org/licenses/mit-license.php
*/
function titleCaps(title) {
  const small = "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
  const punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";

  function lower(word){
    return word.toLowerCase();
  }
  
  function upper(word){
    return word.substr(0,1).toUpperCase() + word.substr(1);
  }
  
  var parts = [], split = /[:.;?!] |(?: |^)["Ò]/g, index = 0;
  
  while (true) {
    var m = split.exec(title);
    
    parts.push( title.substring(index, m ? m.index : title.length)
    .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function(all){
      return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
    })
    .replace(RegExp("\\b" + small + "\\b", "ig"), lower)
    .replace(RegExp("^" + punct + small + "\\b", "ig"), function(all, punct, word){
      return punct + upper(word);
    })
    .replace(RegExp("\\b" + small + punct + "$", "ig"), upper));
    
    index = split.lastIndex;
    
    if ( m ) parts.push( m[0] );
    else break;
  }
  
  return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
  .replace(/(['Õ])S\b/ig, "$1s")
  .replace(/\b(AT&T|Q&A)\b/ig, function(all){
    return all.toUpperCase();
  });
};