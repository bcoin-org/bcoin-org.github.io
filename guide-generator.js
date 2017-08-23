const marked = require('marked');
const fs = require('fs');
const path = require('path');

const renderer = new marked.Renderer();

renderer.code = function(code, language) {
  return `<pre class="line-numbers"><code class="${language}">${code}</code></pre>`;
}

marked.setOptions({
  renderer,
  gfm: true,
  highlight: function (code,lang) {
    return require('highlight.js').highlightAuto(code).value;
  } 
});


const markdownString = fs.readFileSync('./guides/markdown/test-guide.md', 'utf8');

const blogText = marked(markdownString);

const template = fs.readFileSync('./guides/markdown/guides-template.txt').toString().split('\n');
const startText = 'START OF GUIDE';
let startLine = 0;
for (let i=0; i <= template.length; i++) {
  if (template[i].indexOf(startText) > -1) {
    startLine = i + 1;
    break;
  }
}

template.splice(startLine, 0, blogText);

fs.writeFile('./guides/test.html', template.join('\n'), err => {
  if (err) throw err;
  console.log('File done!');
});
