const assert = require('assert');

const insertToTemplate = (template, targetText, customText) => {
  assert(typeof template === 'string', 'template must be a string');
  assert(typeof customText === 'string', 'customText must be a string');

  const templateByLine = template.split('\n');
  const customTextByLine = customText.split('\n');

  let startLine = 0;
  for (let i=0; i < templateByLine.length; i++) {
    if (templateByLine[i].indexOf(targetText) > -1) {
      startLine = i + 1;
      break;
    }
  }

  templateByLine.splice(startLine, 0, ...customTextByLine);
  return templateByLine;
}

module.exports = insertToTemplate;