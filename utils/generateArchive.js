const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const generateSidebar = require('./generateSidebar');

const helpers = require('./helpers');
const insertToTemplate = helpers.insertToTemplate;
const getPostInfo = helpers.getPostInfo;

const generateArchive = async function(archiveName, rootDirectory) {
  const templatesDir = path.resolve(rootDirectory, 'page-templates');
  const archiveTemplatePath = path.resolve(templatesDir, `${archiveName}-archive.html`);
  const itemTemplatePath = path.resolve(templatesDir, `${archiveName}-archive-item.html`);
  const markdownDir = path.resolve(rootDirectory, `${archiveName}-markdown`);

  const SIDEBAR_START = 'START SIDEBAR';
  const ARCHIVES_START = 'START ARCHIVE';

  let archiveTemplate = fs.readFileSync(archiveTemplatePath).toString();

  // generate sidebar and insert into our page template
  const sidebarText = await generateSidebar('guides', rootDirectory, true);

  archiveTemplate = insertToTemplate(archiveTemplate, SIDEBAR_START, sidebarText);

  const posts = await getPostInfo(markdownDir);
  let archiveItemTemplate = fs.readFileSync(itemTemplatePath).toString();
  archiveItemTemplate = _.template(archiveItemTemplate);
  let archives = '<div class="col-sm-1"></div>';
  archives += '<div class="col-sm-11 guide-section-title montserrat text-uppercase bottom-line2">Guides</div>';
  archives += '\n';
  _.each(posts, (post) => {
    // need to get the relative file path
    const filePath =  post.fileName.replace(/\.[^/.]+$/, ".html");
    post.filePath = archiveName.concat('/', filePath);
    archives += archiveItemTemplate(post);
    archives += '\n';
  });
  archiveTemplate = insertToTemplate(archiveTemplate, ARCHIVES_START, archives);

  return archiveTemplate;
}

module.exports = generateArchive;
