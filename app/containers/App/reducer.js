import { fromJS } from 'immutable';
import {
  SOME_ACTION,
} from './constants';

const initialState = fromJS({});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case SOME_ACTION:
      return state;
    default:
      return state;
  }
}

export default appReducer;

// Добавить в reducers.js
// import App from 'containers/App/reducer';
// { app: appReducer }
