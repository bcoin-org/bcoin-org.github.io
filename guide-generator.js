const marked = require('marked');
const fs = require('fs');
const path = require('path');

const renderer = new marked.Renderer();

const guidesDir = path.resolve(__dirname, 'guides');
const markdownDir = path.resolve(__dirname, 'guides/markdown/');

const args = process.argv.slice(2);
let author, file;

args.forEach(arg => {
  if (arg.indexOf('--author=') > -1) {
    author = arg.slice(arg.indexOf('=') +1);
  } else if (arg.indexOf('--file=') > -1) {
    file = arg.slice(arg.indexOf('=') + 1);
  }
});

if ( !author || !file ) {
  console.log('Please pass an argument for author and file');
  console.log('options:');
  console.log('\'--author\'    e.g. `--author="JOHN SNOW"`');
  console.log('\'--file\'      e.g. `--file="my-markdown.md"`');
  console.log('Make sure the file is in the markdown directory in guides');
  return;
} else if (!fs.existsSync(path.resolve(markdownDir, file))) {
    console.log('That markdown file does not exist!');
    return;
}

const markdownFile = path.resolve(markdownDir, file);
const htmlFile = path.resolve(guidesDir, file.replace(/\.[^/.]+$/, ".html"));

/******
Prepare the HTML FIlE
******/
renderer.heading = (text, level) => {
  if (level == '2' || level == '1' ) {
    return '<h2 class="post-title panel-title">'
           + text + '</h2>'
           + '<ul class="post-meta">' 
           + '<li class="author">By ' + author + '</li>'
           + '</ul>';
  } else {
    return `<h${level}>${text}</h${level}>`;
  }
}

marked.setOptions({
  renderer,
  gfm: true,
  highlight: function (code, lang) {
      return require('node-prismjs').highlight(code, Prism.languages[lang]);
    }
});


const markdownString = fs.readFileSync(markdownFile, 'utf8');

// Assemble guide text container
let blogText = '<div class="post-content panel-heading" style="color:#000">'; 
blogText += marked(markdownString);
blogText += '</div>'

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

fs.writeFile(htmlFile, template.join('\n'), err => {
  if (err) throw err;
  console.log('File done!');
});
