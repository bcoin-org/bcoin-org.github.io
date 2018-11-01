const marked = require('marked');
const fs = require('fs');
const path = require('path');
const Prism = require('prismjs');
const PrismLanguages = require('prism-languages');
const _ = require('underscore');

const generateSidebar = require('./generateSidebar.js');
const helpers = require('./helpers');

const insertToTemplate = helpers.insertToTemplate;
const getPostMeta = helpers.getPostMeta;

const createHTML = async function createHTML(markdownFile, htmlFile, author, postMeta, rootDir) {
  const guidesDir = path.resolve(rootDir, 'guides');
  const markdownDir = path.resolve(rootDir, 'guides-markdown');
  const templatesDir = path.resolve(rootDir, 'page-templates');

  /******
  Prepare the marked renderer
  ******/
  const renderer = new marked.Renderer();

  let guideTitle, guideDescription;

  // Custom renderer for top two level headers
  renderer.heading = (text, level) => {
    let textURL = text.replace(/\(.+\)/, '').trim(); // for url remove any parentheses and their contents
    textURL = textURL.replace(/[$-/:-?{-~!"^_`\[\]]/, '').replace(/ /g, '-').toLowerCase(); // and replace spaces with dashes

    if (level == '1' ) {
      // remove icon tag for the url
      const iconCloseTagIndex = textURL.indexOf('</i>');
      if (iconCloseTagIndex > -1) {
        textURL = textURL.slice(iconCloseTagIndex + 4, textURL.length);
      }
      let header = `<h2 class="post-title panel-title" id="${textURL}">${text}</h2>`;

      if (author) {
        postMeta = getPostMeta(author)
        header += postMeta;
      }
      guideTitle = text;
      return header;
    } else {
      return `<h${level} id="${textURL}">${text}</h${level}>`;
    }
  }

  renderer.code = function (code, language) {
    if (language === 'post-author') {
      // only return code block if wasn't set by argument
      author = code;
      return postMeta ? '' : getPostMeta(code);
    }

    if (language === 'post-description') {
      guideDescription = code;
      return '';
    }
    addClass = '';
    if (language === 'command-line') {
      addClass = 'command-line';
      language = 'bash';
    }
    if (!language || !PrismLanguages)
      language = 'bash';

    return `<pre class="snippet line-numbers language-${language} ` + addClass + `">`
             + `<code class="line-numbers language-${language}">`
             + Prism.highlight(code, PrismLanguages[language])
             + '</code>'
             + '<button class="copy-button">'
             + '<img src="../assets/images/clippy.svg" alt="Copy to clipboard"></button>'
             + '</pre>';
  }

  marked.setOptions({
    renderer,
    gfm: true,
  });

  const markdownString = fs.readFileSync(markdownFile, 'utf8');

  // Assemble guide text container
  let blogText = marked(markdownString);
  let guideText = fs.readFileSync(path.resolve(templatesDir, 'guides-template.html'))
                      .toString();

  // these constants are comment text that mark the start
  // of their respective sections in the template files
  const GUIDE_START = 'START OF GUIDE'; // NOTE: Make sure to change this if the comment text changes
  const SIDEBAR_START = 'START SIDEBAR';


  // generate sidebar and insert into our page template
  const sidebarText = await generateSidebar('guides', rootDir);
  guideText = insertToTemplate(guideText, SIDEBAR_START, sidebarText);

  // insert the guide text into our template
  guideText = insertToTemplate(guideText, GUIDE_START, blogText);

  const guideTemplate = _.template(guideText);
  const postInfo = {
    title: guideTitle,
    author,
    description: guideDescription
  }

  // create the html file for final output
  return new Promise((resolve, reject) => {
    fs.writeFile(htmlFile, guideTemplate(postInfo), {flags: 'w+'}, (err) => {
      if (err) reject(err);
      resolve(htmlFile)
    });
  })
  .then((htmlFile) => console.log(`Finished ${path.basename(htmlFile)}!`));
}

module.exports = createHTML;
