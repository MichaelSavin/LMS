const dumbComponentGenerator = require('./dumb/index.js');
const smartComponentGenerator = require('./smart/index.js');

module.exports = (plop) => {
  plop.setGenerator('smart', smartComponentGenerator);
  plop.setGenerator('dumb', dumbComponentGenerator);
  plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
};
