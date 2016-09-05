import { fromJS } from 'immutable';
import {
  SOME_ACTION,
} from './constants';

const initialState = fromJS({});

function courseReducer(state = initialState, action) {
  switch (action.type) {
    case SOME_ACTION:
      return state;
    default:
      return state;
  }
}

export default courseReducer;

// Добавить в reducers.js
// import Course from 'components/Course/reducer';
// { course: courseReducer }
