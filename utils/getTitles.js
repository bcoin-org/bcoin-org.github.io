const marked = require('marked');
const fs = require('fs');
const path = require('path');

const getTitles = function getTitles(pathToFiles) {
  const titles = [];
  const renderer = new marked.Renderer();

  // Add text to list of titles if in a header level 1 or 2
  renderer.heading = (text, level) => {
    if (level == '2' || level == '1' ) {
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
        }
      }
      resolve(titles);
    });
  });
}

module.exports = getTitles;

