/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

const fs = require('fs');
const componentGenerator = require('./component/index.js');
const containerGenerator = require('./container/index.js');

module.exports = (plop) => {
  plop.setGenerator('component', componentGenerator);
  plop.setGenerator('container', containerGenerator);
  plop.addHelper('directory', (comp) => {
    fs.accessSync(`app/components/${comp}`, fs.F_OK);
    return `components/${comp}`;
  });
  plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
};
