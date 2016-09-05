const fs = require('fs');
const components = fs.readdirSync('app/components');

function componentExists(comp) {
  return components.indexOf(comp) >= 0;
}

module.exports = componentExists;
