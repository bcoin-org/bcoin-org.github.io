const fs = require('fs');
const path = require('path');

const generateArchive = require('./utils/generateArchive');
const generatePages = require('./utils/generatePages');

const markdownDir = path.resolve(__dirname, 'guides-markdown');
const args = process.argv.slice(2);
let author,
    file,
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

const options = {
  all: all,
  file: file,
  author: author
};

generatePages(__dirname, markdownDir, options)
.then((files) => {
  console.log('Finished generating files: ', files);
  console.log('Writing guides archive...');
  return generateArchive('guides', __dirname);
})
.then((guidesArchive) => {
  fs.writeFileSync('guides.html', guidesArchive);
  console.log('Guides archive done');
})
.then(() => console.log('All files done!'))
.catch(e => console.log('There was a problem: ', e));
