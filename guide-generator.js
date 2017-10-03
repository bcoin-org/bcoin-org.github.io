const fs = require('fs');
const path = require('path');
const marked = require('marked');

const createHTML = require('./utils/createHTML.js');
const generateArchive = require('./utils/generateArchive');

const guidesDir = path.resolve(__dirname, 'guides');
const markdownDir = path.resolve(__dirname, 'guides-markdown');
const args = process.argv.slice(2);
let author,
    file,
    postMeta,
    all=false;

args.forEach(arg => {
  if (arg.indexOf('--author=') > -1) {
    author = arg.slice(arg.indexOf('=') +1);
  } else if (arg.indexOf('--file=') > -1) {
    file = arg.slice(arg.indexOf('=') + 1);
  } else if (arg.indexOf('--all') > -1) {
    all = true;
  }
});

// Information on how to use the command. Retrieved with `--help` arg
if ( args.indexOf('--help') > -1 || args.length === 0 ) {
  console.log('Build guides from markdown files. Available options are:');
  console.log('\'--author\'    e.g. `--author="JOHN SNOW"`');
  console.log('\'--file\'      e.g. `--file="my-markdown.md"`');
  console.log('\'--all\'       Clears all guides and builds from files in markdown directory')

  console.log('\nNOTES:');
  console.log('- code block with lang set to "post-author" will get set in post-meta')
  console.log('- CLI argument takes precedence over "post-author" code block for setting author');
  console.log('- Make sure the file is in the markdown directory in guides');
  return;
} else if (file && path.extname(file) !== '.md'){
  console.log('Must pass a markdown file name, including extension');
  return;
}else if (file && !fs.existsSync(path.resolve(markdownDir, file))) {
    console.log('That file does not exist!');
    return;
}

const generatePages = async (markdownDir) => {
  let markdownFile;
  let htmlFile;

  if (all) {
    // get all markdown files and createHTML for each
    // returning a promise so we can have better control over async logic flow
    // since the `fs.readdir` is an async callback that we'd like to `await` on
    return new Promise ((resolve, reject) => {
      fs.readdir(markdownDir, async (err, files) => {
        if (err) throw err;
        for (let i=0; i < files.length; i++) {
          const file = files[i];
          const ext = path.extname(file);
          if (ext === '.md') {
            console.log('Starting file conversion: ', file);
            markdownFile = path.resolve(markdownDir, file);
            htmlFile = path.resolve(guidesDir, file.replace(/\.[^/.]+$/, ".html"));
            await createHTML(markdownFile, htmlFile);
          } else if (fs.statSync(path.resolve(markdownDir, file)).isDirectory()) {
            // if we find a folder inside the directory
            // we need to do a recursive call to convert the guides in that directory
            await generatePages(path.resolve(markdownDir,file));
          }
        }
        // once we've converted all markdown files in the folder
        // we can resolve our promise and continue in our promise/await chain
        resolve();
      });
    })
  } else {
    markdownFile = path.resolve(markdownDir, file);
    htmlFile = path.resolve(guidesDir, file.replace(/\.[^/.]+$/, ".html"));
    await createHTML(markdownFile, htmlFile, author, postMeta);
  }
}

generatePages(markdownDir)
.then(() => {
  console.log('Writing guides archive');
  return generateArchive('guides');
})
.then((guidesArchive) => {
  fs.writeFileSync('guides.html', guidesArchive);
  console.log('Guides archive done!');
})
.then(() => console.log('All files done!'));
