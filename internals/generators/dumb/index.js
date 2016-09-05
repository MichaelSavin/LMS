/**
 * Component Generator
 */

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add dumb component',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Button',
    validate: value => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A component or container with this name already exists' : true;
      }

      return 'The name is required';
    },
  }],
  actions: () => (
    // Generate index.js
    [{
      type: 'add',
      path: '../../app/components/{{properCase name}}/index.js',
      templateFile: './dumb/index.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../app/components/{{properCase name}}/styles.css',
      templateFile: './dumb/styles.css.hbs',
      abortOnFail: true,
    }]
  ),
};
