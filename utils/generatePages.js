const fs = require('fs');
const path = require('path');

const createHTML = require('./createHTML.js');


const generatePages = async (markdownDir, all, rootDir) => {

  const guidesDir = path.resolve(rootDir, 'guides');
  let markdownFile;
  let htmlFile;

  if (all) {
    // get all markdown files and createHTML for each
    // returning a promise so we can have better control over async logic flow
    // since the `fs.readdir` is an async callback that we'd like to `await` on
    return new Promise ((resolve, reject) => {
      fs.readdir(markdownDir, async (err, files) => {
        if (err) reject(err);
        for (let i=0; i < files.length; i++) {
          const file = files[i];
          const ext = path.extname(file);
          if (ext === '.md') {
            console.log('Starting file conversion: ', file);
            markdownFile = path.resolve(markdownDir, file);
            htmlFile = path.resolve(guidesDir, file.replace(/\.[^/.]+$/, ".html"));
            await createHTML(markdownFile, htmlFile, null, null, rootDir);
          } else if (fs.statSync(path.resolve(markdownDir, file)).isDirectory()) {
            // if we find a folder inside the directory
            // we need to do a recursive call to convert (all) the guides in that directory
            await generatePages(path.resolve(markdownDir,file), true, rootDir);
          }
        }
        // once we've converted all markdown files in the folder
        // we can resolve our promise and continue in our promise/await chain
        resolve(files);
      });
    })
  } else {
    markdownFile = path.resolve(markdownDir, file);
    htmlFile = path.resolve(guidesDir, file.replace(/\.[^/.]+$/, ".html"));
    await createHTML(markdownFile, htmlFile, author, postMeta);
  }
}

module.exports = generatePages;
