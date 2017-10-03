const fs = require('fs');
const path = require('path');

const helpers = require('./helpers');
const getPostInfo = helpers.getPostInfo;
const insertToTemplate = helpers.insertToTemplate;

const generateSidebarListItem =
  (filePath, title) => `<li><a href="${filePath}">${title}</a></li>`;

const generateSidebar = async (pageName, rootDir, relativeToPage=false) => {
  // get sidebar template text
  const markdownDir = path.resolve(rootDir, `${pageName}-markdown`);
  const templateDir = path.resolve(rootDir, 'page-templates');

  const templateFilePath = path.resolve(rootDir, 'page-templates', `${pageName}-sidebar.html`);
  const template = fs.readFileSync(templateFilePath).toString().split('\n');

  // get file info for installs. Returns an array of objects
  if (pageName === 'guides') {
    const installs = await getPostInfo(path.resolve(markdownDir, 'install'));

    // create sidebar list for installs
    const installsList = [];
    for (let i=0; i<installs.length; i++) {
      let fileName = installs[i].fileName.replace(/\.[^/.]+$/, ".html");
      const title = installs[i].title;
      if (relativeToPage) fileName = `${pageName}/${fileName}`;
      installsList.push(generateSidebarListItem(fileName, title));
    }

    // get titles and paths for guides
    const guides = await getPostInfo(markdownDir);

    // create sidebar list for guides
    const guidesList = [];
    for (let i=0; i<guides.length; i++) {
      let fileName = guides[i].fileName.replace(/\.[^/.]+$/, ".html");
      const title = guides[i].title;
      if (relativeToPage) fileName = `${pageName}/${fileName}`;
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
}

module.exports = generateSidebar;
