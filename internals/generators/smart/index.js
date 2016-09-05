/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add smart component',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Form',
    validate: value => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A component or container with this name already exists' : true;
      }

      return 'The name is required';
    },
  }, {
    type: 'confirm',
    name: 'wantHeaders',
    default: false,
    message: 'Do you want headers?',
  }, {
    type: 'confirm',
    name: 'wantActionsAndReducer',
    default: true,
    message: 'Do you want an actions/constants/selectors/reducer tupel for this container?',
  }, {
    type: 'confirm',
    name: 'wantSagas',
    default: true,
    message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
  }],
  actions: data => {
    // Generate index.js
    const actions = [{
      type: 'add',
      path: '../../app/components/{{properCase name}}/index.js',
      templateFile: './smart/index.js.hbs',
      abortOnFail: true,
    }];

    // If they want actions and a reducer, generate actions.js, constants.js,
    // reducer.js and the corresponding tests for actions and the reducer
    if (data.wantActionsAndReducer) {
      // Actions
      actions.push({
        type: 'add',
        path: '../../app/components/{{properCase name}}/actions.js',
        templateFile: './smart/actions.js.hbs',
        abortOnFail: true,
      });

      // Constants
      actions.push({
        type: 'add',
        path: '../../app/components/{{properCase name}}/constants.js',
        templateFile: './smart/constants.js.hbs',
        abortOnFail: true,
      });

      // Selectors
      actions.push({
        type: 'add',
        path: '../../app/components/{{properCase name}}/selectors.js',
        templateFile: './smart/selectors.js.hbs',
        abortOnFail: true,
      });

      // Reducer
      actions.push({
        type: 'add',
        path: '../../app/components/{{properCase name}}/reducer.js',
        templateFile: './smart/reducer.js.hbs',
        abortOnFail: true,
      });
    }

    // Sagas
    if (data.wantSagas) {
      actions.push({
        type: 'add',
        path: '../../app/components/{{properCase name}}/sagas.js',
        templateFile: './smart/sagas.js.hbs',
        abortOnFail: true,
      });
    }

    return actions;
  },
};
