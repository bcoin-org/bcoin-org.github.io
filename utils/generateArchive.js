const fs = require('fs');
const path = require('path');

const generateSidebar = require('./generateSidebar');
const insertToTemplate = require('./insertToTemplate');

const generateArchive = async function(archiveName) {
  const templatesDir = path.resolve(__dirname, '../page-templates');
  const templatePath = path.resolve(templatesDir, `${archiveName}-archive.html`);
  const markdownDir = path.resolve(__dirname, '../guides-markdown');
  const SIDEBAR_START = 'START SIDEBAR';

  let archiveTemplate = fs.readFileSync(templatePath).toString();

  // generate sidebar and insert into our page template
  const sidebarText = await generateSidebar('guides', templatesDir, markdownDir);

  archiveTemplate = insertToTemplate(archiveTemplate, SIDEBAR_START, sidebarText);
  return archiveTemplate;
}

generateArchive('guides').then(html => console.log(html));
module.exports = generateArchive;