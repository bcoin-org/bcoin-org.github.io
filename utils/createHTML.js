const marked = require('marked');
const fs = require('fs');
const path = require('path');
const Prism = require('prismjs');
const PrismLanguages = require('prism-languages');

const createHTML = async function createHTML(markdownFile, markdownDir, htmlFile, author, postMeta) {
  /******
  Prepare the marked renderer
  ******/

  const guidesDir = path.resolve(__dirname, 'guides');
  const templatesDir = path.resolve(__dirname, 'page-templates');

  const renderer = new marked.Renderer();
  let guideTitle, guideDescription;

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
      guideTitle = text;
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

    if (language === 'post-description') {
      guideDescription = code;
      return;
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

  const markdownString = fs.readFileSync(markdownFile, 'utf8');

  // Assemble guide text container
  let blogText = marked(markdownString);

  // Get the guide html template and find start of guide section
  // const pageWrapper = fs.readFileSync(path.resolve(templatesDir), 'page-wrapper.html').toString().split('\n');
  // const header = fs.readFileSync(path.resolve(templatesDir), 'header.html').toString().split('\n');
  // const guidesSidebar = fs.readFileSync(path.resolve(templatesDir), 'guides-sidebar.html').toString().split('\n');
  // const guidesWrapper = fs.readFileSync(path.resolve(templatesDir), 'guide-wrapper.html').toString().split('\n');
  // const footer = fs.readFileSync(path.resolve(templatesDir), 'footer.html').toString().split('\n');

  const template = fs.readFileSync(path.resolve(markdownDir, 'guides-template.txt'))
                      .toString().split('\n');
  // const startHeaderText = 'HEADER-SECTION';
  // const startGuidesWrapper = 'GUIDES-WRAPPER';
  // const startGuidesSidebar = 'GUIDES-SIDEBAR';
  const startGuideText = 'START OF GUIDE'; // NOTE: Make sure to change this if the comment text changes
  // const startFooter = 'FOOTER-SECTION';
  // const startFooterScripts = 'FOOTER-SCRIPTS';

  let startLine = 0;

  // 1. insert post into guidesWrapper
  // 2. insert

  for (let i=0; i <= template.length; i++) {
    if (template[i].indexOf(startGuideText) > -1) {
      startLine = i + 1;
      break;
    }
  }

  template.splice(startLine, 0, blogText);
  fs.writeFileSync(htmlFile, template.join('\n'));
  console.log(`Finished ${path.basename(htmlFile)}`);
}

module.exports = createHTML;