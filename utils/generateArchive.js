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

  // collect post information of guides to add in archive
  // `posts` returns an array of objects storing the info for each post
  const posts = await getPostInfo(markdownDir);
  let archiveItemTemplate = fs.readFileSync(itemTemplatePath).toString();

  // Use the underscore templating engine for filling in post info in our template html
  archiveItemTemplate = _.template(archiveItemTemplate);

  // Let's start building out the text for the archives list
  let archives = '<div class="col-sm-1"></div>';
  archives += '<div class="col-sm-11 guide-section-title montserrat text-uppercase bottom-line2">Guides</div>';
  archives += '\n';

  // Add each post to the list
  _.each(posts, (post) => {
    // need to get the relative file path and convert to html since that's what we're linking to
    const filePath =  post.fileName.replace(/\.[^/.]+$/, ".html");
    post.filePath = archiveName.concat('/', filePath);

    // Add archive item from template
    archives += archiveItemTemplate(post);
    archives += '\n';
  });

  // Once our archives are ready, add the list into the archive page template
  archiveTemplate = insertToTemplate(archiveTemplate, ARCHIVES_START, archives);

  return archiveTemplate;
}

module.exports = generateArchive;
