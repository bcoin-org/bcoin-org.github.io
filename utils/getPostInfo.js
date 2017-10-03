const marked = require('marked');
const fs = require('fs');
const path = require('path');

const getPostMeta = require('./getPostMeta');

const getPostInfo = function getPostInfo(pathToFiles, postMeta) {
  const posts = [];
  const renderer = new marked.Renderer();

  // Add text to list of titles if in a header level 1 or 2
  renderer.heading = (text, level) => {
    if (level == '2' || level == '1' ) {
      let iconCloseTag = text.indexOf('</i>')
      if ( iconCloseTag > -1) {
        text = text.slice(iconCloseTag + 4);
      }
      posts[0].title = text;
    }
  }

  renderer.code = function (code, language) {
    if (language === 'post-author') {
      // only return code block if wasn't set by argument
      posts[0].author = code;
      return;
    }

    if (language === 'post-description') {
      posts[0].description = code;
      return;
    }
  }

  marked.setOptions({
    renderer,
    gfm: true,
  });

  // Promisify the readdir so we can retrieve the titles when it's done
  return new Promise((resolve, reject) => {
    fs.readdir(pathToFiles, (err, files) => {
      if (err) reject(err);
      for (let i=0; i < files.length; i++) {
        const file = files[i];
        const ext = path.extname(file);
        if (ext === '.md') {
          posts.unshift({
            fileName: file,
            description: '',
            author: ''
          });
          markdownFile = path.resolve(pathToFiles, file);
          const markdownString = fs.readFileSync(markdownFile, 'utf8');
          marked(markdownString);
        }
      }
      resolve(posts);
    });
  });
}

// getPostInfo('../guides-markdown').then((fileInfo) => console.log(fileInfo))
module.exports = getPostInfo;
