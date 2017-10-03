const marked = require('marked');
const fs = require('fs');
const path = require('path');
const Prism = require('prismjs');
const PrismLanguages = require('prism-languages');

const insertToTemplate = require('./insertToTemplate.js');
const generateSidebar = require('./generateSidebar.js');

const createHTML = async function createHTML(markdownFile, htmlFile, author, postMeta) {
  const guidesDir = path.resolve(__dirname, '../guides');
  const markdownDir = path.resolve(__dirname, '../guides-markdown');
  const templatesDir = path.resolve(__dirname, '../page-templates');

  /******
  Prepare the marked renderer
  ******/
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
  let template = fs.readFileSync(path.resolve(templatesDir, 'guides-template.txt'))
                      .toString();

  // these constants are comment text that mark the start
  // of their respective sections in the template files
  const GUIDE_START = 'START OF GUIDE'; // NOTE: Make sure to change this if the comment text changes
  const SIDEBAR_START = 'START SIDEBAR';


  // generate sidebar and insert into our page template
  const sidebarText = await generateSidebar('guides', templatesDir, markdownDir);
  template = insertToTemplate(template, SIDEBAR_START, sidebarText);

  // insert the guide text into our template
  template = insertToTemplate(template, GUIDE_START, blogText);

  // create the html file for final output
  fs.writeFileSync(htmlFile, template);
  console.log(`Finished ${path.basename(htmlFile)}`);
}

module.exports = createHTML;