import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import courseReducer from 'components/Course/reducer';

// Поддержка ImmutableJS в react-router-redux
const routeReducer = (state = fromJS({ locationBeforeTransitions: null }), action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      });
    default:
      return state;
  }
};

const reducers = combineReducers({
  route: routeReducer,
  course: courseReducer,
});

export default reducers;
