const fs = require('fs');
const path = require('path');

const getTitlesAndPaths = require('./getTitlesAndPaths.js');
const insertToTemplate = require('./insertToTemplate.js');

const generateSidebarListItem =
  (filePath, title) => `<li><a href="${filePath}">${title}</a></li>`;

const generateSidebar = async (pageName, templateDir, markdownDir) => {
  // get sidebar template text
  const templateFilePath = path.resolve(templateDir, `${pageName}-sidebar.html`);
  const template = fs.readFileSync(templateFilePath).toString().split('\n');

  // get titles and paths for installs
  const installs = await getTitlesAndPaths(path.resolve(markdownDir, 'install'));
  // create sidebar list for installs
  const installsList = [];
  for (let i=0; i<installs.titles.length; i++) {
    const fileName = installs.fileNames[i].replace(/\.[^/.]+$/, ".html");
    const title = installs.titles[i];
    installsList.push(generateSidebarListItem(fileName, title));
  }

  // get titles and paths for guides
  const guides = await getTitlesAndPaths(markdownDir);
  // create sidebar list for guides
  const guidesList = [];
  for (let i=0; i<guides.titles.length; i++) {
    const fileName = guides.fileNames[i].replace(/\.[^/.]+$/, ".html");
    const title = guides.titles[i];
    guidesList.push(generateSidebarListItem(fileName, title));
  }

  // compose widget for sidebar
  // TO DO: we can make this smarter where it will make a new category for every
  // sub-directory, and use the name to create the title of the widget, e.g. install, advanced-guides

  const categoriesWidget = ['<div class="widget guide-list">'];
  categoriesWidget.push('<h6 class="montserrat text-uppercase bottom-line">Install</h6>');
  categoriesWidget.push('<ul class="icons-list">','<!-- INSTALL-LIST -->');
  categoriesWidget.push(...installsList, '<!-- /INSTALL-LIST -->');
  categoriesWidget.push('</ul>','<br>');

  categoriesWidget.push('<h6 class="montserrat text-uppercase bottom-line">Guides</h6>');
  categoriesWidget.push('<ul class="icons-list">', '<!-- GUIDES-LIST -->');;
  categoriesWidget.push(...guidesList, '<!-- /GUIDES-LIST -->');
  categoriesWidget.push('</ul>','</div>');

  // insert lists into sidebar template at CATEGORIES WIDGET
  return insertToTemplate(
                      template.join('\n'),
                      'CATEGORIES WIDGET',
                      categoriesWidget.join('\n')
                    );
}
// generateSidebar('guides').then(html => console.log(html));
module.exports = generateSidebar;
