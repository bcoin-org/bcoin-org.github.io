const marked = require('marked');
const fs = require('fs');
const path = require('path');
const Prism = require('prismjs');
const PrismLanguages = require('prism-languages');

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


/******
Prepare the marked renderer 
******/
const renderer = new marked.Renderer();


// Custom renderer for code snippet highlighting
const getPostMeta = (author='bcoin-org') => '<ul class="post-meta">' 
           + '<li class="author">By ' + author + '</li>'
           + '</ul>';


// Custom renderer for top two level headers
renderer.heading = (text, level) => {
  if (level == '2' || level == '1' ) {
    let header = '<h2 class="post-title panel-title">'
           + text + '</h2>';

    if (author) {
      postMeta = getPostMeta(author)
      header += postMeta;
    }
    
    return header;
  } else {
    return `<h${level}>${text}</h${level}>`;
  }
}

renderer.code = function (code, language) {
  if (language === 'post-author') {
    // only return code block if wasn't set by argument
    return postMeta ? '' : getPostMeta(code);
  }

  return `<pre class="line-numbers language-${language}">` 
           + `<code class="line-numbers language-${language}">`
           + Prism.highlight(code, PrismLanguages[language]) 
           + '</code></pre>';
}

marked.setOptions({
  renderer,
  gfm: true,
});


const createHTML = markdownFile => {

  const markdownString = fs.readFileSync(markdownFile, 'utf8');

  // Assemble guide text container
  let blogText = marked(markdownString);

  // Get the guide html template and find start of guide section
  const template = fs.readFileSync(path.resolve(markdownDir, 'guides-template.txt'))
                      .toString().split('\n');
  const startText = 'START OF GUIDE'; // NOTE: Make sure to change this if the comment text changes
  let startLine = 0;

  for (let i=0; i <= template.length; i++) {
    if (template[i].indexOf(startText) > -1) {
      startLine = i + 1;
      break;
    }
  }

  template.splice(startLine, 0, blogText);

  fs.writeFileSync(htmlFile, template.join('\n'));
  console.log(`Finished ${path.basename(htmlFile)}`);
}

let markdownFile;
let htmlFile;
if (all) {
  // get all markdown files and createHTML for each
  fs.readdir(markdownDir, (err, files) => {
    if (err) throw err;
    for (let i=0; i < files.length; i++) {
      const file = files[i]; 
      const ext = path.extname(file);
      if (ext === '.md') {
      console.log('Starting file conversion: ', file);
        markdownFile = path.resolve(markdownDir, file);
        htmlFile = path.resolve(guidesDir, file.replace(/\.[^/.]+$/, ".html"));
        createHTML(markdownFile);
    }  
    }
    console.log('All files done!');
  });
} else {
  markdownFile = path.resolve(markdownDir, file);
  htmlFile = path.resolve(guidesDir, file.replace(/\.[^/.]+$/, ".html"));
  createHTML(markdownFile);
}

