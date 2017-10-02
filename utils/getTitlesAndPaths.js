const marked = require('marked');
const fs = require('fs');
const path = require('path');

const getTitlesAndPaths = function getTitlesAndPaths(pathToFiles) {
  const titles = [];
  const fileNames = [];
  const renderer = new marked.Renderer();

  // Add text to list of titles if in a header level 1 or 2
  renderer.heading = (text, level) => {
    if (level == '2' || level == '1' ) {
      let iconCloseTag = text.indexOf('</i>')
      if ( iconCloseTag > -1) {
        text = text.slice(iconCloseTag + 4);
      }
      titles.push(text);
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
          markdownFile = path.resolve(pathToFiles, file);
          const markdownString = fs.readFileSync(markdownFile, 'utf8');
          marked(markdownString);
          fileNames.push(file);
        }
      }
      resolve({ titles, fileNames });
    });
  });
}

// const dir = path.resolve(__dirname, '../guides-markdown')
// getTitlesAndPaths(dir).then(titles => console.log('got titles? ', titles))
module.exports = getTitlesAndPaths;

